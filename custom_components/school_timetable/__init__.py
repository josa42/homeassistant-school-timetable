"""The School Timetable integration.

A single config entry holds everything; kids are created in the sidebar panel,
not through the config flow, and each one gets a calendar entity.
"""

from __future__ import annotations

from dataclasses import dataclass
import logging
from pathlib import Path

from homeassistant.components import frontend, panel_custom
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant
from homeassistant.helpers.typing import ConfigType

from . import websocket_api
from .const import (
    DOMAIN,
    PANEL_ASSET_URL,
    PANEL_COMPONENT_NAME,
    PANEL_ICON,
    PANEL_TITLE,
    PANEL_URL_PATH,
    PANEL_VERSION,
)
from .store import SchoolTimetableStore

_LOGGER = logging.getLogger(__name__)

PLATFORMS: list[Platform] = [Platform.CALENDAR]


@dataclass
class SchoolTimetableRuntimeData:
    """What the platforms and the websocket API need at runtime."""

    store: SchoolTimetableStore


type SchoolTimetableConfigEntry = ConfigEntry[SchoolTimetableRuntimeData]


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Register the websocket API and serve the panel asset. Once per session."""
    websocket_api.async_register(hass)

    if hass.http is None:
        return True
    asset = Path(__file__).parent / "www" / "school-timetable-panel.js"
    if not asset.is_file():
        _LOGGER.warning("School Timetable panel asset missing at %s", asset)
        return True
    await hass.http.async_register_static_paths(
        [StaticPathConfig(PANEL_ASSET_URL, str(asset), cache_headers=False)]
    )
    return True


async def async_setup_entry(hass: HomeAssistant, entry: SchoolTimetableConfigEntry) -> bool:
    """Load the stored timetables and put the panel in the sidebar."""
    store = SchoolTimetableStore(hass)
    await store.async_load()
    entry.runtime_data = SchoolTimetableRuntimeData(store=store)

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    await _async_register_panel(hass)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: SchoolTimetableConfigEntry) -> bool:
    """Tear down the calendars and take the panel out of the sidebar."""
    unloaded = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unloaded and frontend.async_panel_exists(hass, PANEL_URL_PATH):
        frontend.async_remove_panel(hass, PANEL_URL_PATH)
    return unloaded


async def _async_register_panel(hass: HomeAssistant) -> None:
    """Add the sidebar panel, unless a previous setup left it there."""
    if frontend.async_panel_exists(hass, PANEL_URL_PATH):
        return
    language = (hass.config.language or "en").split("-")[0]
    await panel_custom.async_register_panel(
        hass,
        frontend_url_path=PANEL_URL_PATH,
        webcomponent_name=PANEL_COMPONENT_NAME,
        # The version query string is the cache-buster; bump PANEL_VERSION in
        # const.py and in the JS together.
        module_url=f"{PANEL_ASSET_URL}?v={PANEL_VERSION}",
        sidebar_title=PANEL_TITLE.get(language, PANEL_TITLE["en"]),
        sidebar_icon=PANEL_ICON,
        require_admin=False,
        embed_iframe=False,
    )
    _LOGGER.debug("Registered %s panel at /%s", DOMAIN, PANEL_URL_PATH)
