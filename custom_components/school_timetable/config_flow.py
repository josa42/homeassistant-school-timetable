"""Config flow for School Timetable.

There is nothing to configure here: the single entry exists so the integration
can be added, unloaded and removed from the UI. Kids, timetables and holidays
are all edited in the sidebar panel.
"""

from __future__ import annotations

from typing import Any

from homeassistant.config_entries import ConfigFlow, ConfigFlowResult

from .const import DOMAIN


class SchoolTimetableConfigFlow(ConfigFlow, domain=DOMAIN):
    """Create the one and only School Timetable entry."""

    VERSION = 1

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Confirm, then create the entry."""
        await self.async_set_unique_id(DOMAIN)
        self._abort_if_unique_id_configured()

        if user_input is None:
            return self.async_show_form(step_id="user")

        return self.async_create_entry(title="School Timetable", data={})
