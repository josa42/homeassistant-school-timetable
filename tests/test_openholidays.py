"""OpenHolidays parsing: inclusive end dates, sub-regions and half days."""

from __future__ import annotations

from datetime import date, timedelta

import pytest

from custom_components.school_timetable.openholidays import (
    OpenHolidaysError,
    parse_holidays,
    request_params,
)


def _entry(id_, name, start, end, subdivisions=None, scope="FullDay"):
    entry = {
        "id": id_,
        "startDate": start,
        "endDate": end,
        "type": "School",
        "name": [{"language": "DE", "text": name}],
        "temporalScope": scope,
        "nationwide": subdivisions is None,
    }
    if subdivisions is not None:
        entry["subdivisions"] = [{"code": code} for code in subdivisions]
    return entry


def test_end_date_is_kept_as_is() -> None:
    """The API's endDate is inclusive already, unlike ICS DTEND."""
    [holiday] = parse_holidays(
        [_entry("w", "Weihnachtsferien", "2025-12-22", "2026-01-02", ["DE-BE"])], "DE-BE"
    )

    assert holiday.uid == "w"
    assert holiday.name == "Weihnachtsferien"
    assert (holiday.start, holiday.end) == (date(2025, 12, 22), date(2026, 1, 2))


def test_nationwide_entries_are_kept() -> None:
    holidays = parse_holidays([_entry("n", "Neujahr", "2026-01-01", "2026-01-01")], "DE-BY")

    assert [holiday.name for holiday in holidays] == ["Neujahr"]


def test_sub_region_entries_are_dropped() -> None:
    """A query for Bavaria also returns the Augsburger Friedensfest."""
    holidays = parse_holidays(
        [
            _entry("f", "Friedensfest", "2026-08-08", "2026-08-08", ["DE-BY-AU"]),
            _entry("m", "Mariä Himmelfahrt", "2026-08-15", "2026-08-15", ["DE-SL", "DE-BY"]),
        ],
        "DE-BY",
    )

    assert [holiday.name for holiday in holidays] == ["Mariä Himmelfahrt"]


def test_half_days_are_dropped() -> None:
    holidays = parse_holidays(
        [_entry("h", "Heiligabend", "2026-12-24", "2026-12-24", scope="HalfDay")], "DE-BE"
    )

    assert holidays == []


def test_invalid_rows_are_skipped() -> None:
    holidays = parse_holidays(
        [{"id": "x", "startDate": "nope"}, _entry("n", "Neujahr", "2026-01-01", "2026-01-01")], "DE-BE"
    )

    assert [holiday.uid for holiday in holidays] == ["n"]


def test_unexpected_payload_raises() -> None:
    with pytest.raises(OpenHolidaysError):
        parse_holidays({"title": "Bad Request"}, "DE-BE")


def test_window_fits_the_api_limit() -> None:
    """The API refuses ranges over 1095 days, counting both ends."""
    params = request_params("DE-BE", "de", today=date(2026, 9, 1))

    span = date.fromisoformat(params["validTo"]) - date.fromisoformat(params["validFrom"])
    assert span + timedelta(days=1) <= timedelta(days=1095)
    assert params["subdivisionCode"] == "DE-BE"
    assert params["languageIsoCode"] == "DE"
