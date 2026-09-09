"""Test helpers."""

from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.school_timetable.const import DOMAIN, STORAGE_KEY, STORAGE_VERSION

KID_ID = "kid-anna"
TIMETABLE_ID = "tt-2026"


def sample_data() -> dict[str, Any]:
    """One kid with a three-period week, one holiday and one personal day off.

    2026-08-10 and 2026-09-14 are Mondays; 2026-09-15 is a Tuesday.
    """
    return {
        "kids": [
            {
                "id": KID_ID,
                "name": "Anna",
                "timetables": [
                    {
                        "id": TIMETABLE_ID,
                        "label": "2026/27",
                        "valid_from": "2026-08-10",
                        "valid_to": "2027-07-09",
                        "periods": [
                            {"period": 1, "start": "08:00", "end": "08:45"},
                            {"period": 2, "start": "08:50", "end": "09:35"},
                            {"period": 3, "start": "09:55", "end": "10:40"},
                        ],
                        "lessons": [
                            {"weekday": 0, "period": 2, "subject": "Deutsch", "week": "every"},
                            {"weekday": 0, "period": 1, "subject": "Mathe", "week": "every"},
                            {"weekday": 1, "period": 3, "subject": "Sport", "week": "every"},
                        ],
                    }
                ],
                "days_off": [{"date": "2026-11-02", "reason": "krank"}],
            }
        ],
        "closed_days": [
            {
                "id": "cd-herbst",
                "name": "Herbstferien",
                "start": "2026-10-12",
                "end": "2026-10-23",
                "source": "manual",
                "uid": None,
            }
        ],
    }


def seed_storage(hass_storage: dict[str, Any], data: dict[str, Any] | None = None) -> None:
    """Put a document on disk before the integration loads."""
    hass_storage[STORAGE_KEY] = {
        "version": STORAGE_VERSION,
        "key": STORAGE_KEY,
        "data": data if data is not None else sample_data(),
    }


async def setup_integration(hass: HomeAssistant) -> MockConfigEntry:
    """Set up the single config entry and wait for the platforms."""
    entry = MockConfigEntry(domain=DOMAIN, data={}, title="School Timetable")
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry
