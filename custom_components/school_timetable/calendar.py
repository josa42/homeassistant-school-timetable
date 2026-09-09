"""One calendar entity per kid.

Events are generated on every request straight from the store instead of being
materialised, so an edit in the panel shows up immediately and nothing has to
be kept in sync.
"""

from __future__ import annotations

from datetime import datetime, timedelta
import logging

from homeassistant.components.calendar import CalendarEntity, CalendarEvent
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback
from homeassistant.util import dt as dt_util

from .const import (
    DEFAULT_EVENT_SUMMARY,
    DOMAIN,
    EVENT_SUMMARY,
    NEXT_EVENT_LOOKAHEAD_DAYS,
    PANEL_ICON,
)
from .models import Kid
from .schedule import SchoolDay, school_days
from .store import SchoolTimetableStore

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant,
    entry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Create a calendar for every kid, and keep up as kids come and go."""
    store: SchoolTimetableStore = entry.runtime_data.store
    known: dict[str, SchoolCalendarEntity] = {}

    @callback
    def _sync_entities() -> None:
        current = {kid.id: kid for kid in store.data.kids}

        added = [
            SchoolCalendarEntity(store, kid) for kid_id, kid in current.items() if kid_id not in known
        ]
        for entity in added:
            known[entity.kid_id] = entity
        if added:
            async_add_entities(added)

        for kid_id in [kid_id for kid_id in known if kid_id not in current]:
            entity = known.pop(kid_id)
            hass.async_create_task(_async_remove_entity(hass, entity))

    _sync_entities()
    entry.async_on_unload(store.async_add_listener(_sync_entities))


async def _async_remove_entity(hass: HomeAssistant, entity: SchoolCalendarEntity) -> None:
    """Drop a deleted kid's calendar, registry entry included.

    Going through the platform rather than `entity.async_remove` lets it tear
    down its polling timer once the last calendar is gone.
    """
    entity_id = entity.entity_id
    if not entity_id:
        return
    if entity.platform is not None and entity_id in entity.platform.entities:
        await entity.platform.async_remove_entity(entity_id)
    registry = er.async_get(hass)
    if registry.async_get(entity_id):
        registry.async_remove(entity_id)


class SchoolCalendarEntity(CalendarEntity):
    """The school days of one kid."""

    _attr_icon = PANEL_ICON

    def __init__(self, store: SchoolTimetableStore, kid: Kid) -> None:
        self._store = store
        self.kid_id = kid.id
        self._attr_unique_id = f"{DOMAIN}_{kid.id}"
        self._attr_name = kid.name

    async def async_added_to_hass(self) -> None:
        """Refresh whenever the panel changes anything."""
        await super().async_added_to_hass()
        self.async_on_remove(self._store.async_add_listener(self._handle_store_update))

    @callback
    def _handle_store_update(self) -> None:
        kid = self._kid
        if kid is not None and kid.name != self._attr_name:
            self._attr_name = kid.name
            registry = er.async_get(self.hass)
            if self.entity_id and registry.async_get(self.entity_id):
                # Keeps the sidebar and entity list showing the new name; the
                # entity_id itself stays put, as it does for any HA rename.
                registry.async_update_entity(self.entity_id, original_name=kid.name)
        self.async_write_ha_state()

    @property
    def _kid(self) -> Kid | None:
        return self._store.data.kid(self.kid_id)

    @property
    def available(self) -> bool:
        return self._kid is not None

    @property
    def event(self) -> CalendarEvent | None:
        """The school day in progress, or the next one."""
        kid = self._kid
        if kid is None:
            return None
        now = dt_util.now()
        today = now.date()
        for day in school_days(
            self._store.data, kid, today, today + timedelta(days=NEXT_EVENT_LOOKAHEAD_DAYS)
        ):
            event = self._build_event(day)
            if event.end > now:
                return event
        return None

    async def async_get_events(
        self, hass: HomeAssistant, start_date: datetime, end_date: datetime
    ) -> list[CalendarEvent]:
        """Return every school day overlapping the requested range."""
        kid = self._kid
        if kid is None:
            return []
        start_local = dt_util.as_local(start_date)
        end_local = dt_util.as_local(end_date)
        events = [
            self._build_event(day)
            for day in school_days(self._store.data, kid, start_local.date(), end_local.date())
        ]
        return [event for event in events if event.end > start_date and event.start < end_date]

    def _build_event(self, day: SchoolDay) -> CalendarEvent:
        timezone = dt_util.DEFAULT_TIME_ZONE
        return CalendarEvent(
            summary=self._summary,
            start=datetime.combine(day.date, day.start, tzinfo=timezone),
            end=datetime.combine(day.date, day.end, tzinfo=timezone),
            description=day.description(),
            uid=f"{self.kid_id}-{day.date.isoformat()}",
        )

    @property
    def _summary(self) -> str:
        language = (self.hass.config.language or "en").split("-")[0]
        return EVENT_SUMMARY.get(language, DEFAULT_EVENT_SUMMARY)
