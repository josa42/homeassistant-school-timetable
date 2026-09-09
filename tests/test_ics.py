"""ICS parsing: all-day ranges, recurrence and the exclusive DTEND."""

from __future__ import annotations

from datetime import date

import pytest

from custom_components.school_timetable.ics import IcsError, parse_holidays

TODAY = date(2026, 9, 1)


def _ics(*events: str) -> str:
    body = "\n".join(events)
    return f"BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//test//EN\n{body}\nEND:VCALENDAR\n"


ALL_DAY = (
    "BEGIN:VEVENT\n"
    "UID:herbst-2026\n"
    "SUMMARY:Herbstferien\n"
    "DTSTART;VALUE=DATE:20261012\n"
    "DTEND;VALUE=DATE:20261024\n"
    "END:VEVENT"
)

RECURRING = (
    "BEGIN:VEVENT\n"
    "UID:einheit\n"
    "SUMMARY:Tag der Deutschen Einheit\n"
    "DTSTART;VALUE=DATE:20261003\n"
    "DTEND;VALUE=DATE:20261004\n"
    "RRULE:FREQ=YEARLY;COUNT=3\n"
    "END:VEVENT"
)

TIMED = (
    "BEGIN:VEVENT\n"
    "UID:zeugnis\n"
    "SUMMARY:Zeugnisausgabe\n"
    "DTSTART:20270709T080000\n"
    "DTEND:20270709T100000\n"
    "END:VEVENT"
)


def test_all_day_range_ends_on_the_last_real_day() -> None:
    """DTEND is exclusive in ICS; the stored end is the last day off."""
    holidays = parse_holidays(_ics(ALL_DAY), today=TODAY)

    assert len(holidays) == 1
    assert holidays[0].uid == "herbst-2026"
    assert holidays[0].name == "Herbstferien"
    assert holidays[0].start == date(2026, 10, 12)
    assert holidays[0].end == date(2026, 10, 23)


def test_recurring_event_is_expanded_inside_the_window() -> None:
    holidays = parse_holidays(_ics(RECURRING), today=TODAY)

    assert [holiday.start.isoformat() for holiday in holidays] == [
        "2026-10-03",
        "2027-10-03",
        "2028-10-03",
    ]
    assert {holiday.uid for holiday in holidays} == {"einheit"}
    assert all(holiday.start == holiday.end for holiday in holidays)


def test_timed_event_collapses_to_its_day() -> None:
    holidays = parse_holidays(_ics(TIMED), today=TODAY)

    assert holidays[0].start == date(2027, 7, 9)
    assert holidays[0].end == date(2027, 7, 9)


def test_events_outside_the_window_are_dropped() -> None:
    old = (
        "BEGIN:VEVENT\nUID:alt\nSUMMARY:Sommerferien 2019\n"
        "DTSTART;VALUE=DATE:20190701\nDTEND;VALUE=DATE:20190801\nEND:VEVENT"
    )
    holidays = parse_holidays(_ics(ALL_DAY, old), today=TODAY)

    assert [holiday.uid for holiday in holidays] == ["herbst-2026"]


def test_results_are_sorted_by_start() -> None:
    holidays = parse_holidays(_ics(ALL_DAY, RECURRING), today=TODAY)

    assert [holiday.start for holiday in holidays] == sorted(h.start for h in holidays)


def test_garbage_raises_ics_error() -> None:
    with pytest.raises(IcsError):
        parse_holidays("this is not a calendar", today=TODAY)


def test_oversized_payload_raises_ics_error() -> None:
    with pytest.raises(IcsError):
        parse_holidays("x" * 2_000_001, today=TODAY)
