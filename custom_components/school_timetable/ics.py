"""ICS import for the shared closed-day list.

Import is one-shot: entries are parsed here and written into the same list as
manually added rows, so they stay editable. Re-importing the same feed matches
on the iCal UID and updates in place (see `store.async_import_holidays`).
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date, datetime, timedelta
import logging

from ical.calendar_stream import IcsCalendarStream

_LOGGER = logging.getLogger(__name__)

# How far around today a recurring holiday is expanded. Wide enough to cover
# last school year and the three ahead, so a yearly-recurring Feiertag feed
# yields several years of dates in one import.
IMPORT_PAST_DAYS = 365
IMPORT_FUTURE_DAYS = 1095

# Guards against pulling a huge calendar into memory over websocket or HTTP.
MAX_ICS_BYTES = 2_000_000


class IcsError(Exception):
    """Raised when the payload is not a calendar we can read."""


@dataclass(slots=True)
class ImportedHoliday:
    """One holiday parsed out of an ICS file. `end` is inclusive."""

    uid: str | None
    name: str
    start: date
    end: date


def parse_holidays(content: str, *, today: date | None = None) -> list[ImportedHoliday]:
    """Parse an ICS document into holidays, expanding recurring events.

    Both all-day and timed events are reduced to whole days: school is out for
    the day either way, and every published Ferien feed uses all-day events.
    """
    if len(content.encode("utf-8")) > MAX_ICS_BYTES:
        raise IcsError("Calendar is too large to import")

    try:
        calendar = IcsCalendarStream.calendar_from_ics(content)
    except Exception as err:  # the parser raises a family of pydantic/ical errors
        raise IcsError(str(err)) from err

    today = today or date.today()
    window_start = today - timedelta(days=IMPORT_PAST_DAYS)
    window_end = today + timedelta(days=IMPORT_FUTURE_DAYS)

    holidays: list[ImportedHoliday] = []
    for event in calendar.timeline.overlapping(window_start, window_end):
        start = _as_date(event.start)
        end = _last_day(event.end, start)
        holidays.append(
            ImportedHoliday(
                uid=str(event.uid) if event.uid else None,
                name=(event.summary or "").strip(),
                start=start,
                end=end,
            )
        )

    holidays.sort(key=lambda holiday: (holiday.start, holiday.name))
    _LOGGER.debug("Parsed %s holidays from ICS", len(holidays))
    return holidays


def _as_date(value: date | datetime) -> date:
    return value.date() if isinstance(value, datetime) else value


def _last_day(end: date | datetime, start: date) -> date:
    """Convert an exclusive DTEND to the last day the holiday covers."""
    if isinstance(end, datetime):
        last = (end - timedelta(seconds=1)).date()
    else:
        last = end - timedelta(days=1)
    return max(last, start)
