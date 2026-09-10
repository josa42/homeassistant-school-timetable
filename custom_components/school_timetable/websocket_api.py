"""Websocket API behind the School Timetable panel.

The panel is the only editor, so every read and write goes through these
commands. Writes require admin; each one persists and returns the whole
document, and `school_timetable/subscribe` pushes it again whenever anything
changes so a second open panel stays in sync.
"""

from __future__ import annotations

import asyncio
from functools import partial
import logging
from typing import Any

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.aiohttp_client import async_get_clientsession
import voluptuous as vol

from .const import DOMAIN, SOURCE_ICS, SOURCE_MANUAL, WEEK_A, WEEK_B, WEEK_EVERY
from .ics import MAX_ICS_BYTES, IcsError, parse_holidays
from .store import NotFound, SchoolTimetableStore

_LOGGER = logging.getLogger(__name__)

FETCH_TIMEOUT = 30

_TIME = vol.Match(r"^\d{2}:\d{2}(:\d{2})?$")
_DATE = vol.Match(r"^\d{4}-\d{2}-\d{2}$")

_PERIOD_SCHEMA = vol.Schema(
    {
        vol.Required("period"): int,
        vol.Required("start"): _TIME,
        vol.Required("end"): _TIME,
    }
)

_LESSON_SCHEMA = vol.Schema(
    {
        vol.Required("weekday"): vol.All(int, vol.Range(min=0, max=6)),
        vol.Required("period"): int,
        vol.Required("subject"): str,
        vol.Optional("week", default=WEEK_EVERY): vol.In([WEEK_EVERY, WEEK_A, WEEK_B]),
    }
)

_TIMETABLE_SCHEMA = vol.Schema(
    {
        vol.Optional("id"): vol.Any(str, None),
        vol.Required("label"): str,
        vol.Required("valid_from"): _DATE,
        vol.Optional("valid_to"): vol.Any(_DATE, None),
        # No default: an absent key means "seed from the settings defaults".
        vol.Optional("periods"): [_PERIOD_SCHEMA],
        vol.Optional("lessons", default=list): [_LESSON_SCHEMA],
    }
)

_DAY_OFF_SCHEMA = vol.Schema(
    {
        vol.Required("date"): _DATE,
        vol.Optional("reason", default=""): str,
    }
)

_CLOSED_DAY_SCHEMA = vol.Schema(
    {
        vol.Optional("id"): vol.Any(str, None),
        vol.Required("name"): str,
        vol.Required("start"): _DATE,
        vol.Required("end"): _DATE,
        vol.Optional("source", default=SOURCE_MANUAL): vol.In([SOURCE_MANUAL, SOURCE_ICS]),
        vol.Optional("uid"): vol.Any(str, None),
    }
)


@callback
def async_register(hass: HomeAssistant) -> None:
    """Register every websocket command. Called once per Home Assistant run."""
    for handler in (
        handle_get,
        handle_subscribe,
        handle_add_kid,
        handle_rename_kid,
        handle_delete_kid,
        handle_set_days_off,
        handle_save_timetable,
        handle_delete_timetable,
        handle_set_closed_days,
        handle_set_settings,
        handle_import_ics,
    ):
        websocket_api.async_register_command(hass, handler)


@callback
def _get_store(hass: HomeAssistant) -> SchoolTimetableStore:
    """Return the store of the (single) loaded config entry."""
    entries = hass.config_entries.async_loaded_entries(DOMAIN)
    if not entries:
        raise NotFound("School Timetable is not set up")
    return entries[0].runtime_data.store


def _send_document(connection: websocket_api.ActiveConnection, msg_id: int, store, **extra: Any) -> None:
    connection.send_result(msg_id, {**store.data.to_dict(), **extra})


def _with_store(func):
    """Resolve the store, turning a missing entry or id into a websocket error."""

    async def wrapper(
        hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
    ) -> None:
        try:
            store = _get_store(hass)
            await func(hass, connection, msg, store)
        except NotFound as err:
            connection.send_error(msg["id"], "not_found", str(err))
        except (ValueError, vol.Invalid) as err:
            connection.send_error(msg["id"], "invalid_format", str(err))

    wrapper.__name__ = func.__name__
    return wrapper


@websocket_api.websocket_command({vol.Required("type"): "school_timetable/get"})
@websocket_api.async_response
@_with_store
async def handle_get(hass, connection, msg, store) -> None:
    """Return the whole document."""
    _send_document(connection, msg["id"], store)


@websocket_api.websocket_command({vol.Required("type"): "school_timetable/subscribe"})
@callback
def handle_subscribe(hass, connection, msg) -> None:
    """Push the whole document on every change."""
    try:
        store = _get_store(hass)
    except NotFound as err:
        connection.send_error(msg["id"], "not_found", str(err))
        return

    @callback
    def _forward() -> None:
        connection.send_message(websocket_api.event_message(msg["id"], store.data.to_dict()))

    connection.subscriptions[msg["id"]] = store.async_add_listener(_forward)
    connection.send_result(msg["id"])
    _forward()


@websocket_api.websocket_command(
    {
        vol.Required("type"): "school_timetable/kid/add",
        vol.Required("name"): vol.All(str, vol.Length(min=1)),
    }
)
@websocket_api.require_admin
@websocket_api.async_response
@_with_store
async def handle_add_kid(hass, connection, msg, store) -> None:
    kid = await store.async_add_kid(msg["name"])
    _send_document(connection, msg["id"], store, kid_id=kid.id)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "school_timetable/kid/rename",
        vol.Required("kid_id"): str,
        vol.Required("name"): vol.All(str, vol.Length(min=1)),
    }
)
@websocket_api.require_admin
@websocket_api.async_response
@_with_store
async def handle_rename_kid(hass, connection, msg, store) -> None:
    await store.async_rename_kid(msg["kid_id"], msg["name"])
    _send_document(connection, msg["id"], store)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "school_timetable/kid/delete",
        vol.Required("kid_id"): str,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
@_with_store
async def handle_delete_kid(hass, connection, msg, store) -> None:
    await store.async_delete_kid(msg["kid_id"])
    _send_document(connection, msg["id"], store)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "school_timetable/kid/days_off",
        vol.Required("kid_id"): str,
        vol.Required("days_off"): [_DAY_OFF_SCHEMA],
    }
)
@websocket_api.require_admin
@websocket_api.async_response
@_with_store
async def handle_set_days_off(hass, connection, msg, store) -> None:
    await store.async_set_days_off(msg["kid_id"], msg["days_off"])
    _send_document(connection, msg["id"], store)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "school_timetable/timetable/save",
        vol.Required("kid_id"): str,
        vol.Required("timetable"): _TIMETABLE_SCHEMA,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
@_with_store
async def handle_save_timetable(hass, connection, msg, store) -> None:
    timetable = await store.async_save_timetable(msg["kid_id"], msg["timetable"])
    _send_document(connection, msg["id"], store, timetable_id=timetable.id)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "school_timetable/timetable/delete",
        vol.Required("kid_id"): str,
        vol.Required("timetable_id"): str,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
@_with_store
async def handle_delete_timetable(hass, connection, msg, store) -> None:
    await store.async_delete_timetable(msg["kid_id"], msg["timetable_id"])
    _send_document(connection, msg["id"], store)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "school_timetable/settings/set",
        vol.Required("settings"): vol.Schema(
            {vol.Required("default_periods"): [_PERIOD_SCHEMA]}
        ),
    }
)
@websocket_api.require_admin
@websocket_api.async_response
@_with_store
async def handle_set_settings(hass, connection, msg, store) -> None:
    await store.async_set_settings(msg["settings"])
    _send_document(connection, msg["id"], store)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "school_timetable/closed_days/set",
        vol.Required("closed_days"): [_CLOSED_DAY_SCHEMA],
    }
)
@websocket_api.require_admin
@websocket_api.async_response
@_with_store
async def handle_set_closed_days(hass, connection, msg, store) -> None:
    await store.async_set_closed_days(msg["closed_days"])
    _send_document(connection, msg["id"], store)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "school_timetable/ics/import",
        vol.Exclusive("content", "source"): str,
        vol.Exclusive("url", "source"): str,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
@_with_store
async def handle_import_ics(hass, connection, msg, store) -> None:
    """Import holidays from pasted ICS content or a URL."""
    content = msg.get("content")
    try:
        if content is None:
            if not msg.get("url"):
                raise IcsError("Provide either ICS content or a URL")
            content = await _async_fetch_ics(hass, msg["url"])
        holidays = await hass.async_add_executor_job(partial(parse_holidays, content))
    except IcsError as err:
        connection.send_error(msg["id"], "import_failed", str(err))
        return

    added, updated = await store.async_import_holidays(holidays)
    _send_document(connection, msg["id"], store, added=added, updated=updated)


async def _async_fetch_ics(hass: HomeAssistant, url: str) -> str:
    """Download an ICS document, refusing anything that isn't plain HTTP(S)."""
    if url.startswith("webcal://"):
        url = "https://" + url[len("webcal://") :]
    if not url.startswith(("http://", "https://")):
        raise IcsError("Only http(s) and webcal URLs can be imported")

    session = async_get_clientsession(hass)
    try:
        async with asyncio.timeout(FETCH_TIMEOUT):
            response = await session.get(url)
            response.raise_for_status()
            raw = await response.content.read(MAX_ICS_BYTES + 1)
    except (TimeoutError, asyncio.TimeoutError) as err:
        raise IcsError(f"Timed out fetching {url}") from err
    except Exception as err:
        raise IcsError(f"Could not fetch {url}: {err}") from err

    if len(raw) > MAX_ICS_BYTES:
        raise IcsError("Calendar is too large to import")
    return raw.decode("utf-8", errors="replace")
