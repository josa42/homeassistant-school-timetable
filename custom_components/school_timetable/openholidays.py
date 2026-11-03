"""Import of Ferien and Feiertage from the OpenHolidays API.

Like the ICS import this is one-shot: the response becomes ordinary closed-day
rows, tagged with the API's own id so a later import updates them in place.
Unlike ICS, `endDate` is already inclusive, so it maps onto `ClosedDay.end`
without conversion.
"""

from __future__ import annotations

from datetime import date, timedelta
import logging
from typing import Any

from .ics import ImportedHoliday

_LOGGER = logging.getLogger(__name__)

API_URL = "https://openholidaysapi.org"
COUNTRY = "DE"

# The Bundesländer, as the API names them. Sub-regions such as DE-BY-AU
# (Augsburg) exist but are not offered: they only add a single local Feiertag.
SUBDIVISIONS = (
    "DE-BB",
    "DE-BE",
    "DE-BW",
    "DE-BY",
    "DE-HB",
    "DE-HE",
    "DE-HH",
    "DE-MV",
    "DE-NI",
    "DE-NW",
    "DE-RP",
    "DE-SH",
    "DE-SL",
    "DE-SN",
    "DE-ST",
    "DE-TH",
)

# School and public holidays both close the school.
ENDPOINTS = ("SchoolHolidays", "PublicHolidays")

# The API refuses ranges over 1095 days, counting both ends. Last school year
# and roughly the two ahead, which is all a Kultusministerium has published.
IMPORT_PAST_DAYS = 365
IMPORT_FUTURE_DAYS = 729


class OpenHolidaysError(Exception):
    """Raised when the API cannot be reached or answers with something unusable."""


def request_params(subdivision: str, language: str, *, today: date | None = None) -> dict[str, str]:
    """Query parameters for one endpoint, covering the import window."""
    today = today or date.today()
    return {
        "countryIsoCode": COUNTRY,
        "subdivisionCode": subdivision,
        "languageIsoCode": language.upper(),
        "validFrom": (today - timedelta(days=IMPORT_PAST_DAYS)).isoformat(),
        "validTo": (today + timedelta(days=IMPORT_FUTURE_DAYS)).isoformat(),
    }


def parse_holidays(payload: Any, subdivision: str) -> list[ImportedHoliday]:
    """Turn one endpoint's JSON into holidays for `subdivision`.

    A Land query also returns holidays of its sub-regions (the Augsburger
    Friedensfest comes back for all of Bavaria), so only entries that are
    nationwide or name the Land itself are kept. Half days are skipped: school
    is not closed on them.
    """
    if not isinstance(payload, list):
        raise OpenHolidaysError("Unexpected response from OpenHolidays")

    holidays: list[ImportedHoliday] = []
    for raw in payload:
        if not isinstance(raw, dict):
            continue
        if raw.get("temporalScope", "FullDay") != "FullDay":
            continue
        codes = {sub.get("code") for sub in raw.get("subdivisions") or [] if isinstance(sub, dict)}
        if codes and subdivision not in codes:
            continue
        try:
            start = date.fromisoformat(raw["startDate"])
            end = date.fromisoformat(raw["endDate"])
        except (KeyError, TypeError, ValueError):
            _LOGGER.warning("Skipping OpenHolidays entry with invalid dates: %s", raw.get("id"))
            continue
        holidays.append(
            ImportedHoliday(
                uid=str(raw["id"]) if raw.get("id") else None,
                name=_name(raw.get("name")),
                start=start,
                end=max(end, start),
            )
        )
    return holidays


def _name(names: Any) -> str:
    """The API returns the name in the requested language, first in the list."""
    for entry in names or []:
        if isinstance(entry, dict) and entry.get("text"):
            return str(entry["text"]).strip()
    return ""
