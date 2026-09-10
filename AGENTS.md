# AGENTS.md

Notes for AI coding agents working on this repo. Read before proposing a "fix",
especially for the panel, the data model, or anything touching Home Assistant
internals.

## Repo shape

- Custom Home Assistant integration in `custom_components/school_timetable/`.
- One config entry for the whole integration (`single_config_entry: true`). Kids
  are not config entries; they live in the store and are created in the panel.
- Ships a sidebar panel at `www/school-timetable-panel.js`, served as a static
  path and registered through `panel_custom`. Bumping `PANEL_VERSION` in both
  `const.py` and the JS is required, since the query string is the cache-buster.
- Tests use `pytest-homeassistant-custom-component` and live in `tests/`. Set up
  with `make install`, run with `make test`, lint with `make lint`.
- Real HA for manual checks: `make dev-up`, then `make dev-restart` after code
  changes and `make dev-logs` to follow the log.

## The data model, and why it looks like this

`models.py` holds the whole document; `store.py` persists it; `schedule.py`
turns it into school days; `calendar.py` wraps those in calendar events. Keep
`schedule.py` free of Home Assistant imports, it is the part worth unit testing.

Decisions that were made deliberately and should not be "simplified" away:

- **Events are never materialised.** `async_get_events` generates them from the
  store on every call. That is why an edit in the panel is visible immediately
  and why there is no sync code. Do not add a cache without a reason.
- **A kid holds several timetables, each with a validity range.** The yearly
  rollover and the mid-year Stundenplan change are the same mechanism. Ranges may
  not overlap; both the panel and `async_save_timetable` refuse it. The generator
  still falls back to the latest `valid_from`, because a hand-edited file can
  contain anything.
- **Lessons carry a `week` field that nothing reads.** It is reserved for
  alternating A/B weeks so adding them later is a UI change, not a data
  migration. Persist it, ignore it.
- **The closed-day list is shared by all kids, with a per-kid `days_off` list on
  top.** Ferien and Feiertage are set per Bundesland; sick days are not.
- **ICS import writes ordinary rows.** Imported rows are tagged `source: ics`
  with their UID so a re-import can update them. Rows with `source: manual` are
  never touched by an import. Occurrences of a recurring event share one UID, so
  the upsert key is `(uid, start)`.
- **`ClosedDay.end` is inclusive.** ICS `DTEND` is exclusive, and `ics.py`
  converts on the way in. Do not "fix" one side without the other.
- Parsing in `models.py` is forgiving on purpose: a malformed row is dropped
  with a warning instead of failing setup, because the store file can be
  hand-edited.

## Home Assistant gotchas that cost time here

### Custom translation keys never reach the frontend

`hass.localize` only resolves categories Home Assistant ships to the frontend
(`config`, `entity`, `selector`, and friends). A custom key such as
`component.school_timetable.panel.*` is not one of them, so it always misses.
The panel therefore carries its own `STRINGS` table for `en` and `de` and calls
`hass.localize` first only in case that ever changes. `strings.json` is for the
config flow, and stays copied to `translations/en.json`.

### Removing an entity needs the platform, not just the registry

Deleting a kid removes its calendar. Calling `entity_registry.async_remove`
alone leaves `EntityPlatform`'s polling timer running with no entities, which
the test harness reports as a lingering timer. Go through
`entity.platform.async_remove_entity(entity_id)` first, then remove the registry
entry. See `_async_remove_entity` in `calendar.py`.

### A custom panel gets no styles from Home Assistant

`ha-panel-custom` renders a module panel (`embed_iframe: false`) by creating the
element and appending it, with no CSS of its own. Nothing above it has a
definite height, so `height: 100%` collapses to the content height, which is why
the sidebar used to stop halfway down the page. The panel claims the viewport
itself with `height: 100vh; height: 100dvh`, the same pair Home Assistant uses
for the iframe variant of a custom panel.

The two-pane layout mirrors `ha-two-pane-top-app-bar-fixed`, the component the
todo panel uses: `--sidepane-width` of 250px, the pane as a flex column with
`border-inline-end`, its list scrolling under a bordered footer, and the top bar
split so the divider between pane and content runs to the top of the window.
Grep the frontend bundle in `hass_frontend/frontend_latest/` for `.pane{` to
read the original.

To check the layout without Home Assistant, drive the panel in Chrome through
`puppeteer-core` (`executablePath` pointing at the installed Chrome) on a bare
page. Because the real parent applies no styles, a bare page is a faithful
stand-in, and `getBoundingClientRect()` on `.nav` and `.view` will tell you
whether they reach the bottom of the viewport. jsdom cannot: it has no layout
engine.

### Matching the todo panel's pane

The pane rows copy an activated mwc list item, which is what `ha-list` renders
in the todo panel: full-bleed rows of at least 48px with 16px side padding, an
icon 16px before the label, and, when current, `--primary-color` for both text
and icon over `rgba(var(--rgb-primary-color), 0.12)`. The top bar holds the
panel name over the pane and nothing else, because that panel puts the selected
list's name on the card rather than in the bar. The kid's name is the timetable
card's heading for the same reason.

Icons are inline SVG rather than `ha-icon`: that element is defined in a lazily
loaded chunk, and nothing else in a bare panel pulls it in, so it may never
upgrade. The path data in `MDI` was copied out of the frontend bundle. Verify
any new one the same way (`grep -rF "<path data>" hass_frontend/frontend_latest/`)
instead of typing it from memory.

### The panel cannot rely on `ha-*` elements

A custom panel is loaded before Home Assistant's lazily-bundled frontend
elements are guaranteed to be defined. The panel uses plain DOM styled with HA
theme variables, and its own dialogs, rather than `ha-dialog` or `ha-textfield`.
The sidebar toggle is a plain button that dispatches `hass-toggle-menu`.

### Panel registration and reloads

The static path is registered in `async_setup` (once per session) and the panel
itself in `async_setup_entry`, guarded by `frontend.async_panel_exists`, then
removed again in `async_unload_entry`. Registering a panel twice raises.

### Tests need two extra packages

`home-assistant-frontend` must be installed or `frontend` fails to set up and
every setup test fails with `No module named 'hass_frontend'`. And `pytest.ini`
must **not** pass `-p no:socket`: `hass_ws_client` depends on the `socket_enabled`
fixture that `pytest-socket` provides.

## The panel

State comes from one websocket subscription (`school_timetable/subscribe`) that
pushes the whole document after every change, so a second open panel stays in
sync. Mutations also return the document, which is what the panel renders from.

Dates and times in the panel go through `fmtDate` and `fmtTime`, which read
each user's `hass.locale` (`date_format`, `time_format`) the way Home Assistant's
own frontend does. The event description built in `schedule.py` stays on 24-hour
`HH:MM`, because those are per-user frontend settings that the server cannot see.

The timetable editor is the one place with local state. It keeps a draft and an
explicit Save button, so typing in the grid does not trigger a re-render and
lose focus. `_markDirty()` deliberately does not re-render. Everything else
(kids, days off, holidays) writes straight through a dialog.

Grid cells are keyed by `weekday:periodIndex`, the row index rather than the
period number. That is what makes renumbering a period and deleting a row in the
middle work; `_removePeriod` shifts the keys below the deleted row.

There is no JS test tooling in the repo. To exercise the panel without a
browser, install `jsdom` in a scratch directory, stub `window`, `document`,
`HTMLElement` and `customElements` as globals, import the module, and drive the
element with a fake `hass` whose `connection.subscribeMessage` hands you the
push callback. Feeding it a payload dumped from `SchoolData.to_dict()` keeps the
frontend and backend shapes honest.

## Never / always

- **Never** guess a Home Assistant CSS variable. Grep the frontend bundle inside
  the container.
- **Never** ship a panel change without loading it in the real dashboard;
  browser and service-worker caching means bumping `PANEL_VERSION` and, for
  definitive tests, unregistering the service worker.
- **Never** batch unrelated changes into one commit. User rule: commit
  individually.
- **Always** run `make test` after a Python change and `make lint` before
  committing.
- **Always** update `translations/de.json` and the panel's `STRINGS.de` when
  adding user-facing strings.

## Release

`scripts/release.sh <version>` bumps `manifest.json` and `PANEL_VERSION` in
`const.py` and the panel JS, runs tests, commits, tags and pushes.
