# School Timetable for Home Assistant

Custom integration that turns your kids' school timetables into Home Assistant
calendars. Each kid gets one calendar entity named after them, with one event per school
day and the day's lessons in the event description.

Everything is edited in a **Stundenplan** panel in the sidebar: kids, their
weekly grids, and the shared list of school and public holidays. Holidays can be
typed in or imported from an ICS file. The panel lists the kids down the left,
with Ferien and Settings underneath them.

## What it generates

A date produces an event for a kid when all of these hold:

| Condition | Where you set it |
|---|---|
| A timetable is in force on that date | Timetable `valid from` / `valid to` |
| That weekday has at least one lesson | The lesson grid |
| The date is not a school or public holiday | Shared holiday list |
| The kid has no personal day off | Days off, per kid |

The event runs from the first lesson's start to the last lesson's end:

```yaml
calendar.schule_anna:
  state: on
  attributes:
    message: Schule (Anna)
    start_time: "2026-09-14 08:00:00"
    end_time: "2026-09-14 13:25:00"
    description: |-
      08:00 Mathe
      08:50 Deutsch
      09:55 Sport
      10:45 Englisch
```

Nothing is stored per day. Events are generated from the timetable whenever
something asks for them, so an edit in the panel shows up immediately.

## Installation

**HACS:** add this repository as a custom integration in HACS, then install
*School Timetable*.

**Manual:** copy `custom_components/school_timetable` into your Home Assistant
`config/custom_components/` directory.

Restart Home Assistant, then add the integration under **Settings → Devices &
Services → Add integration → School Timetable**. There is nothing to configure
in the dialog; it only creates the entry that the panel and the calendars hang
off.

## Usage

Open **Stundenplan** in the sidebar.

1. **Add a kid.** A calendar entity named `Schule (<name>)` appears right away.
2. **Add a timetable.** Give it a label such as `2026/27` and a start date. It
   starts empty, with the default lesson times from Settings.
3. **Fill in the subjects.** Click a row's times to change, add or remove a
   period. Save.

A kid's page has two views, switched with the toggle in the top right: the
timetable, and that kid's days off.

Adding, renaming and deleting a kid or a timetable, and adding a day off, all
live in the menu in the top right. A timetable's label and date range are edited
there too, under *Stundenplan bearbeiten*.
4. **Add holidays** under Ferien, by hand or by importing an ICS file.

Under Settings, the default lesson times decide what a new timetable starts
from.

### Timetables and dates

A kid can hold several timetables, each valid for a date range. Ranges may not
overlap, so exactly one timetable is in force on any given day. That covers both
the yearly rollover and the mid-year change:

```
Anna
  2025/26       2025-08-11 → 2026-07-10
  2026/27       2026-08-10 → 2026-11-06
  2026/27 neu   2026-11-09 → 2027-07-09   ← in force
```

Leaving `valid to` empty makes a timetable open-ended.

### Holidays

The holiday list is shared by every kid, since Ferien and Feiertage are set per
Bundesland. Anything that affects one kid only, such as a sick day or their
school's Pädagogischer Tag, goes in that kid's **freie Tage** instead.

Rows can be ticked off in bulk to delete them together, or to run a search and
replace across their names, which is the quick way to fix up a batch of imported
entries.

Importing an ICS file writes normal, editable rows. Importing the same feed
again matches on the iCal UID and updates those rows in place; rows you added by
hand are never touched. Recurring events are expanded, from a year back to three
years ahead.

## Automations

The calendar entity is a normal Home Assistant calendar, so the built-in trigger
does the work, offset included:

```yaml
automation:
  - alias: Wake Anna up an hour before school
    triggers:
      - trigger: calendar
        entity_id: calendar.schule_anna
        event: start
        offset: "-01:00:00"
    actions:
      - action: light.turn_on
        target:
          entity_id: light.anna_bedroom
```

## Development

```sh
make install   # create ./venv and install test dependencies
make test      # pytest
make lint      # ruff
make dev-up    # Home Assistant in Docker on :8123, with this repo mounted
```

See `AGENTS.md` for the design decisions behind the data model and the panel.
