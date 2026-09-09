"""Data model for the School Timetable integration.

Everything the user edits in the panel lives here and is persisted as one JSON
document (see `store.py`). Dates are stored as ISO `YYYY-MM-DD` strings and
period boundaries as `HH:MM`, so the stored file stays readable and diffable.

Parsing is deliberately forgiving: a malformed row is dropped with a warning
rather than failing integration setup, because this file can be hand-edited.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date, time
import logging
from typing import Any
from uuid import uuid4

from .const import SOURCE_ICS, SOURCE_MANUAL, WEEK_EVERY

_LOGGER = logging.getLogger(__name__)

WEEKDAY_COUNT = 7


def new_id() -> str:
    """Return an id for a kid, timetable or closed day."""
    return uuid4().hex


def parse_date(value: Any) -> date | None:
    """Parse an ISO date, returning None when it isn't one."""
    if isinstance(value, date):
        return value
    if not isinstance(value, str):
        return None
    try:
        return date.fromisoformat(value)
    except ValueError:
        return None


def parse_time(value: Any) -> time | None:
    """Parse an `HH:MM` (or `HH:MM:SS`) time, returning None when it isn't one."""
    if isinstance(value, time):
        return value
    if not isinstance(value, str):
        return None
    try:
        return time.fromisoformat(value)
    except ValueError:
        return None


def _fmt_time(value: time) -> str:
    return value.strftime("%H:%M")


@dataclass(slots=True)
class Period:
    """One bell-schedule slot: period N runs from start to end."""

    period: int
    start: time
    end: time

    def to_dict(self) -> dict[str, Any]:
        return {
            "period": self.period,
            "start": _fmt_time(self.start),
            "end": _fmt_time(self.end),
        }

    @classmethod
    def from_dict(cls, data: Any) -> Period | None:
        if not isinstance(data, dict):
            return None
        start = parse_time(data.get("start"))
        end = parse_time(data.get("end"))
        try:
            number = int(data["period"])
        except (KeyError, TypeError, ValueError):
            return None
        if start is None or end is None or end <= start:
            _LOGGER.warning("Dropping period %s with invalid times", number)
            return None
        return cls(period=number, start=start, end=end)


@dataclass(slots=True)
class Lesson:
    """One subject taught in a given period on a given weekday.

    `week` is reserved for alternating A/B weeks; it is persisted and returned
    to the frontend but ignored when generating events (see const.WEEK_EVERY).
    """

    weekday: int  # 0 = Monday .. 6 = Sunday
    period: int
    subject: str
    week: str = WEEK_EVERY

    def to_dict(self) -> dict[str, Any]:
        return {
            "weekday": self.weekday,
            "period": self.period,
            "subject": self.subject,
            "week": self.week,
        }

    @classmethod
    def from_dict(cls, data: Any) -> Lesson | None:
        if not isinstance(data, dict):
            return None
        try:
            weekday = int(data["weekday"])
            period = int(data["period"])
        except (KeyError, TypeError, ValueError):
            return None
        subject = str(data.get("subject") or "").strip()
        if not subject or not 0 <= weekday < WEEKDAY_COUNT:
            return None
        return cls(
            weekday=weekday,
            period=period,
            subject=subject,
            week=str(data.get("week") or WEEK_EVERY),
        )


@dataclass(slots=True)
class Timetable:
    """A weekly grid that applies for a date range.

    A kid may hold several: the yearly rollover and the mid-year change are the
    same mechanism, and old timetables stay readable instead of being
    overwritten. `valid_to` may be None, meaning open-ended.
    """

    id: str
    label: str
    valid_from: date
    valid_to: date | None = None
    periods: list[Period] = field(default_factory=list)
    lessons: list[Lesson] = field(default_factory=list)

    def covers(self, day: date) -> bool:
        """Return True when this timetable is in force on `day`."""
        if day < self.valid_from:
            return False
        return self.valid_to is None or day <= self.valid_to

    def period_map(self) -> dict[int, Period]:
        return {period.period: period for period in self.periods}

    def to_dict(self) -> dict[str, Any]:
        return {
            "id": self.id,
            "label": self.label,
            "valid_from": self.valid_from.isoformat(),
            "valid_to": self.valid_to.isoformat() if self.valid_to else None,
            "periods": [period.to_dict() for period in self.periods],
            "lessons": [lesson.to_dict() for lesson in self.lessons],
        }

    @classmethod
    def from_dict(cls, data: Any) -> Timetable | None:
        if not isinstance(data, dict):
            return None
        valid_from = parse_date(data.get("valid_from"))
        if valid_from is None:
            _LOGGER.warning("Dropping timetable %s without a valid_from", data.get("label"))
            return None
        periods = [p for p in (Period.from_dict(raw) for raw in data.get("periods") or []) if p]
        lessons = [le for le in (Lesson.from_dict(raw) for raw in data.get("lessons") or []) if le]
        return cls(
            id=str(data.get("id") or new_id()),
            label=str(data.get("label") or ""),
            valid_from=valid_from,
            valid_to=parse_date(data.get("valid_to")),
            periods=sorted(periods, key=lambda p: p.period),
            lessons=lessons,
        )


@dataclass(slots=True)
class DayOff:
    """A single date on which one kid has no school."""

    date: date
    reason: str = ""

    def to_dict(self) -> dict[str, Any]:
        return {"date": self.date.isoformat(), "reason": self.reason}

    @classmethod
    def from_dict(cls, data: Any) -> DayOff | None:
        if not isinstance(data, dict):
            return None
        day = parse_date(data.get("date"))
        if day is None:
            return None
        return cls(date=day, reason=str(data.get("reason") or ""))


@dataclass(slots=True)
class Kid:
    """One child, one calendar entity."""

    id: str
    name: str
    timetables: list[Timetable] = field(default_factory=list)
    days_off: list[DayOff] = field(default_factory=list)

    def timetable_for(self, day: date) -> Timetable | None:
        """Return the timetable in force on `day`.

        When ranges overlap the latest `valid_from` wins, so a mid-year
        replacement takes over from the plan it supersedes.
        """
        candidates = [tt for tt in self.timetables if tt.covers(day)]
        if not candidates:
            return None
        return max(candidates, key=lambda tt: tt.valid_from)

    def is_day_off(self, day: date) -> bool:
        return any(entry.date == day for entry in self.days_off)

    def to_dict(self) -> dict[str, Any]:
        return {
            "id": self.id,
            "name": self.name,
            "timetables": [tt.to_dict() for tt in self.timetables],
            "days_off": [entry.to_dict() for entry in self.days_off],
        }

    @classmethod
    def from_dict(cls, data: Any) -> Kid | None:
        if not isinstance(data, dict):
            return None
        name = str(data.get("name") or "").strip()
        if not name:
            return None
        timetables = [
            tt for tt in (Timetable.from_dict(raw) for raw in data.get("timetables") or []) if tt
        ]
        days_off = [d for d in (DayOff.from_dict(raw) for raw in data.get("days_off") or []) if d]
        return cls(
            id=str(data.get("id") or new_id()),
            name=name,
            timetables=timetables,
            days_off=sorted(days_off, key=lambda entry: entry.date),
        )


@dataclass(slots=True)
class ClosedDay:
    """A date range on which no kid has school. `end` is inclusive."""

    id: str
    name: str
    start: date
    end: date
    source: str = SOURCE_MANUAL
    uid: str | None = None

    def contains(self, day: date) -> bool:
        return self.start <= day <= self.end

    def to_dict(self) -> dict[str, Any]:
        return {
            "id": self.id,
            "name": self.name,
            "start": self.start.isoformat(),
            "end": self.end.isoformat(),
            "source": self.source,
            "uid": self.uid,
        }

    @classmethod
    def from_dict(cls, data: Any) -> ClosedDay | None:
        if not isinstance(data, dict):
            return None
        start = parse_date(data.get("start"))
        end = parse_date(data.get("end")) or start
        if start is None or end is None:
            _LOGGER.warning("Dropping closed day %s with invalid dates", data.get("name"))
            return None
        if end < start:
            start, end = end, start
        source = str(data.get("source") or SOURCE_MANUAL)
        return cls(
            id=str(data.get("id") or new_id()),
            name=str(data.get("name") or ""),
            start=start,
            end=end,
            source=source if source in (SOURCE_MANUAL, SOURCE_ICS) else SOURCE_MANUAL,
            uid=str(data["uid"]) if data.get("uid") else None,
        )


@dataclass(slots=True)
class SchoolData:
    """The whole persisted document."""

    kids: list[Kid] = field(default_factory=list)
    closed_days: list[ClosedDay] = field(default_factory=list)

    def kid(self, kid_id: str) -> Kid | None:
        return next((kid for kid in self.kids if kid.id == kid_id), None)

    def is_closed(self, day: date) -> bool:
        return any(entry.contains(day) for entry in self.closed_days)

    def to_dict(self) -> dict[str, Any]:
        return {
            "kids": [kid.to_dict() for kid in self.kids],
            "closed_days": [entry.to_dict() for entry in self.closed_days],
        }

    @classmethod
    def from_dict(cls, data: Any) -> SchoolData:
        if not isinstance(data, dict):
            return cls()
        kids = [kid for kid in (Kid.from_dict(raw) for raw in data.get("kids") or []) if kid]
        closed = [c for c in (ClosedDay.from_dict(raw) for raw in data.get("closed_days") or []) if c]
        return cls(kids=kids, closed_days=sorted(closed, key=lambda entry: entry.start))
