"""Constants for the School Timetable integration."""

from __future__ import annotations

from typing import Final

DOMAIN: Final = "school_timetable"

PLATFORMS: Final = ["calendar"]

# Storage
STORAGE_VERSION: Final = 1
STORAGE_KEY: Final = "school_timetable"

# Frontend panel
PANEL_URL_PATH: Final = "school-timetable"
PANEL_ASSET_URL: Final = "/school-timetable/school-timetable-panel.js"
PANEL_COMPONENT_NAME: Final = "school-timetable-panel"
PANEL_VERSION: Final = "1.0.0"
PANEL_ICON: Final = "mdi:school"

# Week selector on a lesson. Only WEEK_EVERY is produced today; the field is
# persisted and round-tripped so alternating A/B weeks can be added later
# without migrating stored data. Event generation ignores the value.
WEEK_EVERY: Final = "every"
WEEK_A: Final = "a"
WEEK_B: Final = "b"

# Where a closed day came from. ICS-imported rows carry the source UID so a
# re-import updates them; manual rows are never touched by an import.
SOURCE_MANUAL: Final = "manual"
SOURCE_ICS: Final = "ics"

# How far ahead `CalendarEntity.event` looks for the next school day. Long
# enough to cross the summer holidays so the attribute is never empty during
# a break.
NEXT_EVENT_LOOKAHEAD_DAYS: Final = 400

# Event summary per language, used for the generated all-school-day events.
EVENT_SUMMARY: Final[dict[str, str]] = {
    "en": "School",
    "de": "Schule",
}
DEFAULT_EVENT_SUMMARY: Final = "School"

# Sidebar label per language. panel_custom takes a plain string, so the title
# is picked at registration time from hass.config.language.
PANEL_TITLE: Final[dict[str, str]] = {
    "en": "School",
    "de": "Stundenplan",
}
