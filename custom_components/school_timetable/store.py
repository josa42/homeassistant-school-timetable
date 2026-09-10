"""Persistence and mutations for the School Timetable integration.

One JSON document holds every kid, timetable and closed day. The panel is the
only editor; each websocket command lands in one of the `async_*` mutations
below, which persist and then notify listeners (the calendar platform and any
open panel).
"""

from __future__ import annotations

from collections.abc import Callable, Iterable
import logging
from typing import Any

from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.storage import Store

from .const import SOURCE_ICS, STORAGE_KEY, STORAGE_VERSION
from .ics import ImportedHoliday
from .models import ClosedDay, DayOff, Kid, SchoolData, Timetable, new_id

_LOGGER = logging.getLogger(__name__)


class NotFound(Exception):
    """Raised when a kid or timetable id does not exist."""


class Overlap(Exception):
    """Raised when a timetable's validity range covers another one's."""


class SchoolTimetableStore:
    """Loads, mutates and persists the school timetable document."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass
        self._store: Store[dict[str, Any]] = Store(hass, STORAGE_VERSION, STORAGE_KEY)
        self._listeners: list[Callable[[], None]] = []
        self.data = SchoolData()

    async def async_load(self) -> None:
        """Read the document from disk."""
        raw = await self._store.async_load()
        self.data = SchoolData.from_dict(raw)

    async def async_save(self) -> None:
        """Persist the document and tell everyone it changed."""
        await self._store.async_save(self.data.to_dict())
        self._notify()

    @callback
    def async_add_listener(self, listener: Callable[[], None]) -> Callable[[], None]:
        """Register a callback fired after every change. Returns an unsubscribe."""
        self._listeners.append(listener)

        def _remove() -> None:
            if listener in self._listeners:
                self._listeners.remove(listener)

        return _remove

    @callback
    def _notify(self) -> None:
        for listener in list(self._listeners):
            listener()

    def _kid(self, kid_id: str) -> Kid:
        kid = self.data.kid(kid_id)
        if kid is None:
            raise NotFound(f"Unknown kid {kid_id}")
        return kid

    # --- kids ------------------------------------------------------------

    async def async_add_kid(self, name: str) -> Kid:
        kid = Kid(id=new_id(), name=name.strip())
        self.data.kids.append(kid)
        await self.async_save()
        return kid

    async def async_rename_kid(self, kid_id: str, name: str) -> Kid:
        kid = self._kid(kid_id)
        kid.name = name.strip()
        await self.async_save()
        return kid

    async def async_delete_kid(self, kid_id: str) -> None:
        kid = self._kid(kid_id)
        self.data.kids.remove(kid)
        await self.async_save()

    async def async_set_days_off(self, kid_id: str, entries: Iterable[Any]) -> Kid:
        """Replace a kid's personal days off with `entries`."""
        kid = self._kid(kid_id)
        parsed = [entry for entry in (DayOff.from_dict(raw) for raw in entries) if entry]
        kid.days_off = sorted(parsed, key=lambda entry: entry.date)
        await self.async_save()
        return kid

    # --- timetables ------------------------------------------------------

    async def async_save_timetable(self, kid_id: str, raw: dict[str, Any]) -> Timetable:
        """Create or replace a timetable. An unknown or missing id creates one.

        Validity ranges may not overlap: two timetables covering one date would
        make the generated day depend on tie-breaking rules nobody can see.
        """
        kid = self._kid(kid_id)
        timetable = Timetable.from_dict({**raw, "id": raw.get("id") or new_id()})
        if timetable is None:
            raise ValueError("Invalid timetable")
        clash = next(
            (
                other
                for other in kid.timetables
                if other.id != timetable.id and _ranges_overlap(timetable, other)
            ),
            None,
        )
        if clash is not None:
            raise Overlap(f"Overlaps the timetable {clash.label or clash.id}")
        for index, existing in enumerate(kid.timetables):
            if existing.id == timetable.id:
                kid.timetables[index] = timetable
                break
        else:
            kid.timetables.append(timetable)
        kid.timetables.sort(key=lambda tt: tt.valid_from)
        await self.async_save()
        return timetable

    async def async_delete_timetable(self, kid_id: str, timetable_id: str) -> None:
        kid = self._kid(kid_id)
        remaining = [tt for tt in kid.timetables if tt.id != timetable_id]
        if len(remaining) == len(kid.timetables):
            raise NotFound(f"Unknown timetable {timetable_id}")
        kid.timetables = remaining
        await self.async_save()

    # --- closed days -----------------------------------------------------

    async def async_set_closed_days(self, entries: Iterable[Any]) -> None:
        """Replace the shared closed-day list with `entries`."""
        parsed = [entry for entry in (ClosedDay.from_dict(raw) for raw in entries) if entry]
        self.data.closed_days = sorted(parsed, key=lambda entry: entry.start)
        await self.async_save()

    async def async_import_holidays(self, holidays: Iterable[ImportedHoliday]) -> tuple[int, int]:
        """Merge parsed ICS holidays in, returning (added, updated).

        Imported rows are matched on their iCal UID plus start date, because
        recurring events repeat the same UID. Rows added by hand are never
        touched.
        """
        by_key: dict[tuple[str, str], ClosedDay] = {
            (entry.uid, entry.start.isoformat()): entry
            for entry in self.data.closed_days
            if entry.source == SOURCE_ICS and entry.uid
        }
        added = updated = 0
        for holiday in holidays:
            existing = by_key.get((holiday.uid, holiday.start.isoformat())) if holiday.uid else None
            if existing is None:
                existing = _match_by_value(self.data.closed_days, holiday)
            if existing is None:
                self.data.closed_days.append(
                    ClosedDay(
                        id=new_id(),
                        name=holiday.name,
                        start=holiday.start,
                        end=holiday.end,
                        source=SOURCE_ICS,
                        uid=holiday.uid,
                    )
                )
                added += 1
                continue
            if (existing.name, existing.start, existing.end) == (
                holiday.name,
                holiday.start,
                holiday.end,
            ):
                continue
            existing.name = holiday.name
            existing.start = holiday.start
            existing.end = holiday.end
            updated += 1

        self.data.closed_days.sort(key=lambda entry: entry.start)
        await self.async_save()
        _LOGGER.debug("Imported holidays: %s added, %s updated", added, updated)
        return added, updated


def _ranges_overlap(left: Timetable, right: Timetable) -> bool:
    """Whether two validity ranges share a date. `valid_to` of None is open-ended."""
    if left.valid_to is not None and right.valid_from > left.valid_to:
        return False
    if right.valid_to is not None and left.valid_from > right.valid_to:
        return False
    return True


def _match_by_value(entries: list[ClosedDay], holiday: ImportedHoliday) -> ClosedDay | None:
    """Fall back to matching an ICS row on its dates when it carries no UID."""
    for entry in entries:
        if entry.source != SOURCE_ICS:
            continue
        if entry.start == holiday.start and entry.end == holiday.end:
            return entry
    return None
