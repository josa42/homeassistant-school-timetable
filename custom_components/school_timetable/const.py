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
PANEL_VERSION: Final = "1.4.0"
PANEL_ICON: Final = "mdi:school"

# Seed bell schedule, used until the user edits the defaults in settings. A
# common German Grundschule day.
DEFAULT_PERIOD_TIMES: Final[tuple[tuple[str, str], ...]] = (
    ("08:00", "08:45"),
    ("08:50", "09:35"),
    ("09:55", "10:40"),
    ("10:45", "11:30"),
    ("11:50", "12:35"),
    ("12:40", "13:25"),
)

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

# Display name per language, used for both the calendar entity and the summary
# of every event it generates, so a shared calendar view says whose school day
# it is.
DISPLAY_NAME: Final[dict[str, str]] = {
    "en": "School ({name})",
    "de": "Schule ({name})",
}
DEFAULT_DISPLAY_NAME: Final = "School ({name})"

# Sidebar label per language. panel_custom takes a plain string, so the title
# is picked at registration time from hass.config.language.
PANEL_TITLE: Final[dict[str, str]] = {
    "en": "School",
    "de": "Stundenplan",
}
