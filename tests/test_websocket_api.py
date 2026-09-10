"""The websocket API the panel talks to."""

from __future__ import annotations

from homeassistant.core import HomeAssistant

from .common import KID_ID, TIMETABLE_ID, seed_storage, setup_integration

ICS = (
    "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//test//EN\r\n"
    "BEGIN:VEVENT\r\nUID:weihnachten-2026\r\nSUMMARY:Weihnachtsferien\r\n"
    "DTSTART;VALUE=DATE:20261223\r\nDTEND;VALUE=DATE:20270107\r\nEND:VEVENT\r\n"
    "END:VCALENDAR\r\n"
)


async def test_get_returns_the_document(hass: HomeAssistant, hass_storage, hass_ws_client) -> None:
    seed_storage(hass_storage)
    await setup_integration(hass)
    client = await hass_ws_client(hass)

    await client.send_json_auto_id({"type": "school_timetable/get"})
    msg = await client.receive_json()

    assert msg["success"]
    assert [kid["name"] for kid in msg["result"]["kids"]] == ["Anna"]
    assert msg["result"]["closed_days"][0]["name"] == "Herbstferien"


async def test_add_kid(hass: HomeAssistant, hass_storage, hass_ws_client) -> None:
    seed_storage(hass_storage)
    await setup_integration(hass)
    client = await hass_ws_client(hass)

    await client.send_json_auto_id({"type": "school_timetable/kid/add", "name": "Ben"})
    msg = await client.receive_json()

    assert msg["success"]
    assert msg["result"]["kid_id"]
    assert [kid["name"] for kid in msg["result"]["kids"]] == ["Anna", "Ben"]


async def test_save_timetable_round_trips(hass: HomeAssistant, hass_storage, hass_ws_client) -> None:
    seed_storage(hass_storage)
    await setup_integration(hass)
    client = await hass_ws_client(hass)

    await client.send_json_auto_id(
        {
            "type": "school_timetable/timetable/save",
            "kid_id": KID_ID,
            "timetable": {
                "id": TIMETABLE_ID,
                "label": "2026/27",
                "valid_from": "2026-08-10",
                "valid_to": None,
                "periods": [{"period": 1, "start": "08:00", "end": "08:45"}],
                "lessons": [{"weekday": 4, "period": 1, "subject": "Kunst"}],
            },
        }
    )
    msg = await client.receive_json()

    assert msg["success"]
    timetable = msg["result"]["kids"][0]["timetables"][0]
    assert timetable["valid_to"] is None
    assert timetable["show_weekend"] is False
    assert timetable["lessons"] == [
        {"weekday": 4, "period": 1, "subject": "Kunst", "week": "every", "span": 1}
    ]


async def test_unknown_kid_is_a_not_found_error(
    hass: HomeAssistant, hass_storage, hass_ws_client
) -> None:
    seed_storage(hass_storage)
    await setup_integration(hass)
    client = await hass_ws_client(hass)

    await client.send_json_auto_id(
        {"type": "school_timetable/kid/rename", "kid_id": "nope", "name": "X"}
    )
    msg = await client.receive_json()

    assert not msg["success"]
    assert msg["error"]["code"] == "not_found"


async def test_set_closed_days_replaces_the_list(
    hass: HomeAssistant, hass_storage, hass_ws_client
) -> None:
    seed_storage(hass_storage)
    await setup_integration(hass)
    client = await hass_ws_client(hass)

    await client.send_json_auto_id(
        {
            "type": "school_timetable/closed_days/set",
            "closed_days": [
                {"name": "Osterferien", "start": "2027-03-29", "end": "2027-04-09"}
            ],
        }
    )
    msg = await client.receive_json()

    assert msg["success"]
    assert [entry["name"] for entry in msg["result"]["closed_days"]] == ["Osterferien"]


async def test_set_settings_and_seed_a_timetable(
    hass: HomeAssistant, hass_storage, hass_ws_client
) -> None:
    seed_storage(hass_storage)
    await setup_integration(hass)
    client = await hass_ws_client(hass)

    await client.send_json_auto_id(
        {
            "type": "school_timetable/settings/set",
            "settings": {"default_periods": [{"period": 1, "start": "07:45", "end": "08:30"}]},
        }
    )
    msg = await client.receive_json()
    assert msg["success"]
    assert msg["result"]["settings"]["default_periods"] == [
        {"period": 1, "start": "07:45", "end": "08:30"}
    ]

    await client.send_json_auto_id(
        {
            "type": "school_timetable/timetable/save",
            "kid_id": KID_ID,
            "timetable": {"label": "2027/28", "valid_from": "2027-08-09", "valid_to": None},
        }
    )
    msg = await client.receive_json()
    created = next(
        tt for tt in msg["result"]["kids"][0]["timetables"] if tt["id"] == msg["result"]["timetable_id"]
    )

    assert created["periods"] == [{"period": 1, "start": "07:45", "end": "08:30"}]
    assert created["lessons"] == []


async def test_import_ics_content(hass: HomeAssistant, hass_storage, hass_ws_client) -> None:
    seed_storage(hass_storage)
    await setup_integration(hass)
    client = await hass_ws_client(hass)

    await client.send_json_auto_id({"type": "school_timetable/ics/import", "content": ICS})
    msg = await client.receive_json()

    assert msg["success"]
    assert msg["result"]["added"] == 1
    assert msg["result"]["updated"] == 0
    imported = next(
        entry for entry in msg["result"]["closed_days"] if entry["uid"] == "weihnachten-2026"
    )
    assert imported["source"] == "ics"
    assert imported["end"] == "2027-01-06"


async def test_import_rejects_garbage(hass: HomeAssistant, hass_storage, hass_ws_client) -> None:
    seed_storage(hass_storage)
    await setup_integration(hass)
    client = await hass_ws_client(hass)

    await client.send_json_auto_id({"type": "school_timetable/ics/import", "content": "nope"})
    msg = await client.receive_json()

    assert not msg["success"]
    assert msg["error"]["code"] == "import_failed"


async def test_subscribe_pushes_changes(hass: HomeAssistant, hass_storage, hass_ws_client) -> None:
    seed_storage(hass_storage)
    entry = await setup_integration(hass)
    client = await hass_ws_client(hass)

    await client.send_json_auto_id({"type": "school_timetable/subscribe"})
    assert (await client.receive_json())["success"]
    first = await client.receive_json()
    assert [kid["name"] for kid in first["event"]["kids"]] == ["Anna"]

    await entry.runtime_data.store.async_add_kid("Ben")
    pushed = await client.receive_json()

    assert [kid["name"] for kid in pushed["event"]["kids"]] == ["Anna", "Ben"]


async def test_writes_require_admin(
    hass: HomeAssistant, hass_storage, hass_ws_client, hass_read_only_access_token
) -> None:
    seed_storage(hass_storage)
    await setup_integration(hass)
    client = await hass_ws_client(hass, hass_read_only_access_token)

    await client.send_json_auto_id({"type": "school_timetable/kid/add", "name": "Ben"})
    msg = await client.receive_json()

    assert not msg["success"]
    assert msg["error"]["code"] == "unauthorized"


async def test_commands_work_before_the_entry_exists(
    hass: HomeAssistant, hass_ws_client
) -> None:
    """The websocket API is registered globally; without an entry it reports not_found."""
    await setup_integration(hass)
    entry = hass.config_entries.async_entries("school_timetable")[0]
    await hass.config_entries.async_unload(entry.entry_id)
    client = await hass_ws_client(hass)

    await client.send_json_auto_id({"type": "school_timetable/get"})
    msg = await client.receive_json()

    assert not msg["success"]
    assert msg["error"]["code"] == "not_found"
