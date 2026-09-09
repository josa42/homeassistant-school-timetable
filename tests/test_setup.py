"""Setting the integration up, and taking it down again."""

from __future__ import annotations

from homeassistant.components import frontend
from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant

from custom_components.school_timetable.const import PANEL_URL_PATH

from .common import seed_storage, setup_integration


async def test_setup_creates_a_calendar_per_kid(hass: HomeAssistant, hass_storage) -> None:
    seed_storage(hass_storage)
    entry = await setup_integration(hass)

    assert entry.state is ConfigEntryState.LOADED
    assert hass.states.get("calendar.anna") is not None


async def test_setup_registers_the_sidebar_panel(hass: HomeAssistant, hass_storage) -> None:
    seed_storage(hass_storage)
    await setup_integration(hass)

    assert frontend.async_panel_exists(hass, PANEL_URL_PATH)


async def test_unload_removes_the_panel(hass: HomeAssistant, hass_storage) -> None:
    seed_storage(hass_storage)
    entry = await setup_integration(hass)

    assert await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()

    assert entry.state is ConfigEntryState.NOT_LOADED
    assert not frontend.async_panel_exists(hass, PANEL_URL_PATH)


async def test_setup_without_stored_data_is_fine(hass: HomeAssistant, hass_storage) -> None:
    entry = await setup_integration(hass)

    assert entry.state is ConfigEntryState.LOADED
    assert not hass.states.async_entity_ids("calendar")
