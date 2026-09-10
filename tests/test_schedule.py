"""School day generation: the pure core, no Home Assistant involved."""

from __future__ import annotations

from datetime import date

from custom_components.school_timetable.models import SchoolData
from custom_components.school_timetable.schedule import school_day_for, school_days

from .common import sample_data


def _data() -> SchoolData:
    return SchoolData.from_dict(sample_data())


def test_monday_has_two_lessons_in_period_order() -> None:
    data = _data()
    day = school_day_for(data, data.kids[0], date(2026, 9, 14))

    assert day is not None
    assert [lesson.subject for lesson in day.lessons] == ["Mathe", "Deutsch"]
    assert day.start.isoformat() == "08:00:00"
    assert day.end.isoformat() == "09:35:00"
    assert day.description() == "08:00 Mathe\n08:50 Deutsch"


def test_gap_before_first_lesson_moves_the_start() -> None:
    """Tuesday only has period 3, so the day starts at 09:55."""
    data = _data()
    day = school_day_for(data, data.kids[0], date(2026, 9, 15))

    assert day is not None
    assert day.start.isoformat() == "09:55:00"
    assert day.end.isoformat() == "10:40:00"


def test_weekday_without_lessons_has_no_day() -> None:
    data = _data()
    assert school_day_for(data, data.kids[0], date(2026, 9, 16)) is None


def test_shared_closed_day_wins() -> None:
    data = _data()
    assert school_day_for(data, data.kids[0], date(2026, 10, 12)) is None


def test_personal_day_off_wins() -> None:
    data = _data()
    assert school_day_for(data, data.kids[0], date(2026, 11, 2)) is None


def test_dates_outside_the_validity_range_produce_nothing() -> None:
    data = _data()
    assert school_day_for(data, data.kids[0], date(2026, 8, 3)) is None
    assert school_day_for(data, data.kids[0], date(2027, 9, 13)) is None


def test_open_ended_timetable_keeps_going() -> None:
    raw = sample_data()
    raw["kids"][0]["timetables"][0]["valid_to"] = None
    data = SchoolData.from_dict(raw)

    assert school_day_for(data, data.kids[0], date(2029, 9, 17)) is not None


def test_latest_valid_from_wins_when_ranges_overlap() -> None:
    """A mid-year replacement takes over from the plan it supersedes."""
    raw = sample_data()
    raw["kids"][0]["timetables"].append(
        {
            "id": "tt-neu",
            "label": "2026/27 neu",
            "valid_from": "2026-11-09",
            "valid_to": "2027-07-09",
            "periods": [{"period": 1, "start": "07:45", "end": "08:30"}],
            "lessons": [{"weekday": 0, "period": 1, "subject": "Englisch", "week": "every"}],
        }
    )
    data = SchoolData.from_dict(raw)

    before = school_day_for(data, data.kids[0], date(2026, 10, 5))
    after = school_day_for(data, data.kids[0], date(2026, 11, 16))

    assert [lesson.subject for lesson in before.lessons] == ["Mathe", "Deutsch"]
    assert [lesson.subject for lesson in after.lessons] == ["Englisch"]


def test_lesson_referencing_a_deleted_period_is_skipped() -> None:
    raw = sample_data()
    raw["kids"][0]["timetables"][0]["lessons"].append(
        {"weekday": 0, "period": 9, "subject": "Geister-Stunde", "week": "every"}
    )
    data = SchoolData.from_dict(raw)
    day = school_day_for(data, data.kids[0], date(2026, 9, 14))

    assert [lesson.subject for lesson in day.lessons] == ["Mathe", "Deutsch"]


def test_range_generation_covers_only_school_days() -> None:
    data = _data()
    days = list(school_days(data, data.kids[0], date(2026, 9, 14), date(2026, 9, 20)))

    assert [day.date.isoformat() for day in days] == ["2026-09-14", "2026-09-15"]
