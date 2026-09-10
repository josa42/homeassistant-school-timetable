"""The generated calendar entities."""

from __future__ import annotations

from datetime import datetime

from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util
import pytest

from .common import KID_ID, seed_storage, setup_integration


@pytest.fixture(autouse=True)
async def berlin(hass: HomeAssistant):
    """The timetable is wall-clock local time; pin a zone so tests are stable."""
    await hass.config.async_set_time_zone("Europe/Berlin")


async def _get_events(hass: HomeAssistant, entity_id: str, start: str, end: str) -> list[dict]:
    response = await hass.services.async_call(
        "calendar",
        "get_events",
        {
            "entity_id": entity_id,
            "start_date_time": start,
            "end_date_time": end,
        },
        blocking=True,
        return_response=True,
    )
    return response[entity_id]["events"]


async def test_one_event_per_school_day(hass: HomeAssistant, hass_storage) -> None:
    seed_storage(hass_storage)
    await setup_integration(hass)

    events = await _get_events(hass, "calendar.school_anna", "2026-09-14 00:00:00", "2026-09-21 00:00:00")

    assert len(events) == 2
    monday, tuesday = events
    assert monday["summary"] == "School (Anna)"
    assert monday["description"] == "08:00 Mathe\n08:50 Deutsch"
    assert dt_util.parse_datetime(monday["start"]) == datetime(
        2026, 9, 14, 8, 0, tzinfo=dt_util.DEFAULT_TIME_ZONE
    )
    assert dt_util.parse_datetime(monday["end"]) == datetime(
        2026, 9, 14, 9, 35, tzinfo=dt_util.DEFAULT_TIME_ZONE
    )
    assert dt_util.parse_datetime(tuesday["start"]) == datetime(
        2026, 9, 15, 9, 55, tzinfo=dt_util.DEFAULT_TIME_ZONE
    )


async def test_holidays_and_days_off_produce_no_events(hass: HomeAssistant, hass_storage) -> None:
    seed_storage(hass_storage)
    await setup_integration(hass)

    holidays = await _get_events(hass, "calendar.school_anna", "2026-10-12 00:00:00", "2026-10-24 00:00:00")
    day_off = await _get_events(hass, "calendar.school_anna", "2026-11-02 00:00:00", "2026-11-03 00:00:00")

    assert holidays == []
    assert day_off == []


async def test_name_follows_the_configured_language(hass: HomeAssistant, hass_storage) -> None:
    """Entity and events share one name, so a shared calendar says whose day it is."""
    hass.config.language = "de"
    seed_storage(hass_storage)
    await setup_integration(hass)

    events = await _get_events(hass, "calendar.schule_anna", "2026-09-14 00:00:00", "2026-09-15 00:00:00")

    assert events[0]["summary"] == "Schule (Anna)"
    assert hass.states.get("calendar.schule_anna").attributes["friendly_name"] == "Schule (Anna)"


async def test_state_is_on_during_a_lesson(hass: HomeAssistant, hass_storage, freezer) -> None:
    freezer.move_to("2026-09-14 06:30:00+00:00")  # 08:30 in Berlin, second period
    seed_storage(hass_storage)
    await setup_integration(hass)

    state = hass.states.get("calendar.school_anna")

    assert state.state == "on"
    assert state.attributes["description"] == "08:00 Mathe\n08:50 Deutsch"


async def test_state_points_at_the_next_school_day_when_off(
    hass: HomeAssistant, hass_storage, freezer
) -> None:
    freezer.move_to("2026-09-13 10:00:00+00:00")  # Sunday
    seed_storage(hass_storage)
    await setup_integration(hass)

    state = hass.states.get("calendar.school_anna")

    assert state.state == "off"
    assert state.attributes["start_time"] == "2026-09-14 08:00:00"


async def test_adding_a_kid_creates_a_calendar(hass: HomeAssistant, hass_storage) -> None:
    seed_storage(hass_storage)
    entry = await setup_integration(hass)

    await entry.runtime_data.store.async_add_kid("Ben")
    await hass.async_block_till_done()

    assert hass.states.get("calendar.school_ben") is not None


async def test_deleting_a_kid_removes_the_calendar(hass: HomeAssistant, hass_storage) -> None:
    seed_storage(hass_storage)
    entry = await setup_integration(hass)

    await entry.runtime_data.store.async_delete_kid(KID_ID)
    await hass.async_block_till_done()

    assert hass.states.get("calendar.school_anna") is None
    assert er.async_get(hass).async_get("calendar.school_anna") is None


async def test_renaming_a_kid_updates_the_entity_name(hass: HomeAssistant, hass_storage) -> None:
    seed_storage(hass_storage)
    entry = await setup_integration(hass)

    await entry.runtime_data.store.async_rename_kid(KID_ID, "Anna B.")
    await hass.async_block_till_done()

    state = hass.states.get("calendar.school_anna")
    assert state.attributes["friendly_name"] == "School (Anna B.)"


async def test_edits_show_up_without_a_reload(hass: HomeAssistant, hass_storage) -> None:
    seed_storage(hass_storage)
    entry = await setup_integration(hass)
    store = entry.runtime_data.store

    kid = store.data.kid(KID_ID)
    raw = kid.timetables[0].to_dict()
    raw["lessons"].append({"weekday": 2, "period": 1, "subject": "Schwimmen", "week": "every"})
    await store.async_save_timetable(KID_ID, raw)
    await hass.async_block_till_done()

    events = await _get_events(hass, "calendar.school_anna", "2026-09-16 00:00:00", "2026-09-17 00:00:00")

    assert [event["description"] for event in events] == ["08:00 Schwimmen"]
