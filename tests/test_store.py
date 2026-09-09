"""Store mutations, and the ICS upsert rules in particular."""

from __future__ import annotations

from datetime import date

import pytest

from custom_components.school_timetable.ics import ImportedHoliday
from custom_components.school_timetable.store import NotFound, SchoolTimetableStore

from .common import KID_ID, TIMETABLE_ID, sample_data, seed_storage


@pytest.fixture
async def store(hass, hass_storage) -> SchoolTimetableStore:
    seed_storage(hass_storage)
    loaded = SchoolTimetableStore(hass)
    await loaded.async_load()
    return loaded


async def test_load_parses_the_document(store: SchoolTimetableStore) -> None:
    kid = store.data.kid(KID_ID)

    assert kid is not None
    assert kid.name == "Anna"
    assert kid.timetables[0].id == TIMETABLE_ID
    assert store.data.closed_days[0].name == "Herbstferien"


async def test_add_rename_and_delete_kid(store: SchoolTimetableStore) -> None:
    kid = await store.async_add_kid("Ben")
    assert len(store.data.kids) == 2

    await store.async_rename_kid(kid.id, "Benjamin")
    assert store.data.kid(kid.id).name == "Benjamin"

    await store.async_delete_kid(kid.id)
    assert store.data.kid(kid.id) is None


async def test_unknown_kid_raises(store: SchoolTimetableStore) -> None:
    with pytest.raises(NotFound):
        await store.async_rename_kid("nope", "X")


async def test_saving_a_timetable_replaces_the_matching_id(store: SchoolTimetableStore) -> None:
    raw = sample_data()["kids"][0]["timetables"][0]
    raw["label"] = "2026/27 neu"
    raw["lessons"] = [{"weekday": 3, "period": 1, "subject": "Kunst", "week": "every"}]

    await store.async_save_timetable(KID_ID, raw)
    kid = store.data.kid(KID_ID)

    assert len(kid.timetables) == 1
    assert kid.timetables[0].label == "2026/27 neu"
    assert [lesson.subject for lesson in kid.timetables[0].lessons] == ["Kunst"]


async def test_saving_without_an_id_creates_a_timetable(store: SchoolTimetableStore) -> None:
    created = await store.async_save_timetable(
        KID_ID,
        {
            "label": "2027/28",
            "valid_from": "2027-08-09",
            "valid_to": None,
            "periods": [{"period": 1, "start": "08:00", "end": "08:45"}],
            "lessons": [],
        },
    )

    assert created.id
    assert len(store.data.kid(KID_ID).timetables) == 2


async def test_days_off_are_replaced_and_sorted(store: SchoolTimetableStore) -> None:
    await store.async_set_days_off(
        KID_ID,
        [{"date": "2026-12-08", "reason": "krank"}, {"date": "2026-11-02", "reason": "Päd. Tag"}],
    )
    kid = store.data.kid(KID_ID)

    assert [entry.date.isoformat() for entry in kid.days_off] == ["2026-11-02", "2026-12-08"]


def _holiday(uid, name, start, end) -> ImportedHoliday:
    return ImportedHoliday(
        uid=uid, name=name, start=date.fromisoformat(start), end=date.fromisoformat(end)
    )


async def test_import_adds_rows_tagged_ics(store: SchoolTimetableStore) -> None:
    added, updated = await store.async_import_holidays(
        [_holiday("weihnachten", "Weihnachtsferien", "2026-12-23", "2027-01-06")]
    )

    assert (added, updated) == (1, 0)
    imported = next(entry for entry in store.data.closed_days if entry.uid == "weihnachten")
    assert imported.source == "ics"


async def test_reimport_updates_in_place(store: SchoolTimetableStore) -> None:
    await store.async_import_holidays([_holiday("weihnachten", "Weihnachten", "2026-12-23", "2027-01-06")])
    added, updated = await store.async_import_holidays(
        [_holiday("weihnachten", "Weihnachtsferien", "2026-12-23", "2027-01-07")]
    )

    assert (added, updated) == (0, 1)
    matching = [entry for entry in store.data.closed_days if entry.uid == "weihnachten"]
    assert len(matching) == 1
    assert matching[0].name == "Weihnachtsferien"
    assert matching[0].end == date(2027, 1, 7)


async def test_unchanged_reimport_counts_nothing(store: SchoolTimetableStore) -> None:
    holiday = _holiday("weihnachten", "Weihnachtsferien", "2026-12-23", "2027-01-06")
    await store.async_import_holidays([holiday])

    assert await store.async_import_holidays([holiday]) == (0, 0)


async def test_recurring_uid_keeps_one_row_per_date(store: SchoolTimetableStore) -> None:
    """Occurrences of a recurring event share a UID, so the date is part of the key."""
    added, _ = await store.async_import_holidays(
        [
            _holiday("einheit", "Tag der Deutschen Einheit", "2026-10-03", "2026-10-03"),
            _holiday("einheit", "Tag der Deutschen Einheit", "2027-10-03", "2027-10-03"),
        ]
    )

    assert added == 2
    assert len([entry for entry in store.data.closed_days if entry.uid == "einheit"]) == 2


async def test_import_never_touches_manual_rows(store: SchoolTimetableStore) -> None:
    """The manually added Herbstferien row survives an overlapping import."""
    await store.async_import_holidays(
        [_holiday("herbst", "Herbstferien (Land)", "2026-10-12", "2026-10-23")]
    )

    manual = [entry for entry in store.data.closed_days if entry.source == "manual"]
    assert len(manual) == 1
    assert manual[0].name == "Herbstferien"
    assert manual[0].id == "cd-herbst"


async def test_listeners_fire_on_every_save(store: SchoolTimetableStore) -> None:
    calls: list[int] = []
    unsub = store.async_add_listener(lambda: calls.append(1))

    await store.async_add_kid("Ben")
    assert len(calls) == 1

    unsub()
    await store.async_add_kid("Cara")
    assert len(calls) == 1
