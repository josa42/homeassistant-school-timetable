// School Timetable panel.
//
// Registered by the integration via panel_custom. No build step and no
// dependencies: a custom panel loads before Home Assistant's lazily-bundled
// ha-* elements are guaranteed to be defined, so this uses plain DOM styled
// with HA's theme variables.
//
// Bump PANEL_VERSION here and in const.py together. The query string on the
// module URL is the only cache-buster.
const PANEL_VERSION = "1.0.0";

// Home Assistant's elements are defined as its chunks arrive, which happens
// after a panel's first paint. So the panel renders its own controls, waits on
// each name, and swaps in the real element the moment it exists.
const HA_ELEMENTS = [
  "ha-dialog",
  "ha-selector",
  "ha-button-toggle-group",
  "ha-icon-button",
  "ha-menu-button",
  "ha-list",
  "ha-dropdown",
  "ha-dropdown-item",
  "wa-divider",
  "ha-button",
  "ha-input",
  "ha-select",
  "ha-checkbox",
  "ha-date-input",
  "ha-time-input",
];

// Below this the pane gives way to a picker in the toolbar, the way the todo
// panel drops its pane. Kept in step with the media query in STYLE.
const NARROW_QUERY = "(max-width: 700px)";

// Home Assistant only ships a fixed set of translation categories to the
// frontend, and a custom key like `panel.*` is not one of them, so
// hass.localize would always miss. The table below is the real source; the
// localize call stays in front of it in case that ever changes.
const STRINGS = {
  en: {
    "nav.closed": "Holidays",
    "tab.timetable": "Timetable",
    "tab.days_off": "Days off",
    "nav.settings": "Settings",
    "settings.default_times": "Default lesson times",
    "settings.hint": "The times a new timetable starts from. Changing them leaves existing timetables alone.",
    "common.cancel": "Cancel",
    "common.save": "Save",
    "common.delete": "Delete",
    "common.add": "Add",
    "common.edit": "Edit",
    "common.name": "Name",
    "common.loading": "Loading…",
    "common.not_set_up": "School Timetable is not set up yet. Add the integration under Settings → Devices & Services.",
    "error.cannot_connect": "Cannot reach Home Assistant.",
    "error.invalid_auth": "Not authorised.",
    "error.connection_lost": "Connection to Home Assistant lost. Reload the page.",
    "error.unknown": "Something went wrong.",
    "kids.add": "Add kid",
    "kids.add_title": "Add kid",
    "kids.rename_title": "Edit kid",
    "kids.delete_title": "Delete kid",
    "menu.title": "Actions",
    "kids.empty": "No kids yet. Add one to get started.",
    "kids.delete_confirm": "Delete {name} and their timetables? The calendar entity is removed too.",
    "timetable.add_title": "Add timetable",
    "timetable.edit_title": "Edit timetable",
    "timetable.delete_title": "Delete timetable",
    "timetable.new_hint": "Starts with the default times from settings and no subjects.",
    "timetable.empty": "No timetable yet. Add one to start filling in lessons.",
    "timetable.label": "Label",
    "timetable.label_placeholder": "2026/27",
    "timetable.valid_from": "Valid from",
    "timetable.valid_to": "Valid to",
    "timetable.open_ended": "open-ended",
    "timetable.delete_confirm": "Delete the timetable “{label}”?",
    "timetable.period": "Period",
    "timetable.edit_period": "Edit times",
    "timetable.start": "Start",
    "timetable.end": "End",
    "timetable.add_period": "Add period",
    "timetable.overlap": "This overlaps another period.",
    "timetable.end_before_start": "The end must be after the start.",
    "timetable.lessons": "Lessons",
    "timetable.subject": "Subject",
    "timetable.duration": "Duration",
    "timetable.no_periods": "No periods yet. Add one to start filling in lessons.",
    "timetable.show_weekend": "Show weekend",
    "days_off.section": "Days off",
    "days_off.hint": "Dates this kid alone has no school: sick days, a Pädagogischer Tag at their school.",
    "days_off.add": "Add day off",
    "days_off.title": "Day off",
    "days_off.date": "Date",
    "days_off.reason": "Reason",
    "days_off.empty": "None.",
    "closed.section": "School and public holidays",
    "closed.hint": "Shared by every kid. No calendar events are generated on these days.",
    "closed.add": "Add holiday",
    "closed.title": "Holiday",
    "closed.start": "First day",
    "closed.end": "Last day",
    "closed.source": "Source",
    "closed.source_manual": "manual",
    "closed.source_ics": "ICS",
    "closed.empty": "Nothing here yet. Add a holiday or import an ICS file.",
    "closed.delete_confirm": "Delete “{name}”?",
    "closed.selected": "{count} selected",
    "closed.select_all": "Select all",
    "closed.bulk_delete": "Delete selected",
    "closed.bulk_delete_confirm": "Delete {count} entries?",
    "closed.replace_title": "Search and replace",
    "closed.replace_hint": "Replaces text in the names of the selected entries.",
    "closed.search": "Search for",
    "closed.replace_with": "Replace with",
    "closed.replaced": "{count} entries changed.",
    "closed.replace_none": "Nothing matched.",
    "import.section": "Import ICS",
    "import.hint": "Imported holidays become normal rows you can edit. Importing the same file again updates them and leaves manual entries alone.",
    "import.file": "Choose file",
    "import.url": "…or paste a URL",
    "import.url_placeholder": "https://example.org/ferien.ics",
    "import.button": "Import",
    "import.running": "Importing…",
    "import.nothing_chosen": "Choose a file or paste a URL first.",
    "import.result": "{added} added, {updated} updated.",
    "import.failed": "Import failed: {error}",
    "weekday.0": "Mon",
    "weekday.1": "Tue",
    "weekday.2": "Wed",
    "weekday.3": "Thu",
    "weekday.4": "Fri",
    "weekday.5": "Sat",
    "weekday.6": "Sun",
  },
  de: {
    "nav.closed": "Ferien",
    "tab.timetable": "Stundenplan",
    "tab.days_off": "Freie Tage",
    "nav.settings": "Einstellungen",
    "settings.default_times": "Standard-Stundenzeiten",
    "settings.hint": "Die Zeiten, mit denen ein neuer Stundenplan startet. Bestehende Stundenpläne bleiben unverändert.",
    "common.cancel": "Abbrechen",
    "common.save": "Speichern",
    "common.delete": "Löschen",
    "common.add": "Hinzufügen",
    "common.edit": "Bearbeiten",
    "common.name": "Name",
    "common.loading": "Wird geladen…",
    "common.not_set_up": "Stundenplan ist noch nicht eingerichtet. Integration unter Einstellungen → Geräte & Dienste hinzufügen.",
    "error.cannot_connect": "Home Assistant ist nicht erreichbar.",
    "error.invalid_auth": "Keine Berechtigung.",
    "error.connection_lost": "Verbindung zu Home Assistant verloren. Seite neu laden.",
    "error.unknown": "Etwas ist schiefgelaufen.",
    "kids.add": "Kind hinzufügen",
    "kids.add_title": "Kind hinzufügen",
    "kids.rename_title": "Kind bearbeiten",
    "kids.delete_title": "Kind löschen",
    "menu.title": "Aktionen",
    "kids.empty": "Noch keine Kinder. Lege eines an, um zu starten.",
    "kids.delete_confirm": "{name} und alle Stundenpläne löschen? Der Kalender wird mit entfernt.",
    "timetable.add_title": "Stundenplan hinzufügen",
    "timetable.edit_title": "Stundenplan bearbeiten",
    "timetable.delete_title": "Stundenplan löschen",
    "timetable.new_hint": "Startet mit den Standardzeiten aus den Einstellungen, ohne Fächer.",
    "timetable.empty": "Noch kein Stundenplan. Lege einen an, um Fächer einzutragen.",
    "timetable.label": "Bezeichnung",
    "timetable.label_placeholder": "2026/27",
    "timetable.valid_from": "Gültig ab",
    "timetable.valid_to": "Gültig bis",
    "timetable.open_ended": "unbefristet",
    "timetable.delete_confirm": "Stundenplan „{label}“ löschen?",
    "timetable.period": "Stunde",
    "timetable.edit_period": "Zeiten bearbeiten",
    "timetable.start": "Beginn",
    "timetable.end": "Ende",
    "timetable.add_period": "Stunde hinzufügen",
    "timetable.overlap": "Überschneidet sich mit einer anderen Stunde.",
    "timetable.end_before_start": "Das Ende muss nach dem Beginn liegen.",
    "timetable.lessons": "Fächer",
    "timetable.subject": "Fach",
    "timetable.duration": "Dauer",
    "timetable.no_periods": "Noch keine Stunden. Füge eine hinzu, um Fächer einzutragen.",
    "timetable.show_weekend": "Wochenende anzeigen",
    "days_off.section": "Freie Tage",
    "days_off.hint": "Tage, an denen nur dieses Kind schulfrei hat: krank, Pädagogischer Tag der eigenen Schule.",
    "days_off.add": "Freien Tag hinzufügen",
    "days_off.title": "Freier Tag",
    "days_off.date": "Datum",
    "days_off.reason": "Grund",
    "days_off.empty": "Keine.",
    "closed.section": "Ferien und Feiertage",
    "closed.hint": "Gilt für alle Kinder. An diesen Tagen entstehen keine Kalendereinträge.",
    "closed.add": "Eintrag hinzufügen",
    "closed.title": "Ferien / Feiertag",
    "closed.start": "Erster Tag",
    "closed.end": "Letzter Tag",
    "closed.source": "Quelle",
    "closed.source_manual": "manuell",
    "closed.source_ics": "ICS",
    "closed.empty": "Noch nichts da. Eintrag anlegen oder ICS-Datei importieren.",
    "closed.delete_confirm": "„{name}“ löschen?",
    "closed.selected": "{count} ausgewählt",
    "closed.select_all": "Alle auswählen",
    "closed.bulk_delete": "Auswahl löschen",
    "closed.bulk_delete_confirm": "{count} Einträge löschen?",
    "closed.replace_title": "Suchen und ersetzen",
    "closed.replace_hint": "Ersetzt Text in den Namen der ausgewählten Einträge.",
    "closed.search": "Suchen nach",
    "closed.replace_with": "Ersetzen durch",
    "closed.replaced": "{count} Einträge geändert.",
    "closed.replace_none": "Keine Treffer.",
    "import.section": "ICS importieren",
    "import.hint": "Importierte Einträge werden normale, bearbeitbare Zeilen. Ein erneuter Import derselben Datei aktualisiert sie und lässt manuelle Einträge unberührt.",
    "import.file": "Datei wählen",
    "import.url": "…oder URL einfügen",
    "import.url_placeholder": "https://example.org/ferien.ics",
    "import.button": "Importieren",
    "import.running": "Wird importiert…",
    "import.nothing_chosen": "Erst eine Datei wählen oder eine URL einfügen.",
    "import.result": "{added} neu, {updated} aktualisiert.",
    "import.failed": "Import fehlgeschlagen: {error}",
    "weekday.0": "Mo",
    "weekday.1": "Di",
    "weekday.2": "Mi",
    "weekday.3": "Do",
    "weekday.4": "Fr",
    "weekday.5": "Sa",
    "weekday.6": "So",
  },
};

// home-assistant-js-websocket rejects with a bare numeric code when the
// connection itself fails, and with {code, message} for command errors. Neither
// is something to put in front of a person unfiltered.
const WS_ERROR_CODES = {
  1: "error.cannot_connect",
  2: "error.invalid_auth",
  3: "error.connection_lost",
  not_found: "common.not_set_up",
  unauthorized: "error.invalid_auth",
};

function _errorText(hass, err) {
  const code = err && typeof err === "object" ? err.code : err;
  if (WS_ERROR_CODES[code]) return _t(hass, WS_ERROR_CODES[code]);
  if (err && typeof err === "object" && err.message) return err.message;
  return _t(hass, "error.unknown");
}

// Home Assistant's own palette, limited to the shades that carry white text.
// A subject keeps its colour wherever it appears, so a week reads like a
// calendar rather than a table of words.
const SUBJECT_COLORS = [
  ["--blue-color", "#2196f3"],
  ["--green-color", "#4caf50"],
  ["--deep-orange-color", "#ff6f22"],
  ["--purple-color", "#926bc7"],
  ["--teal-color", "#009688"],
  ["--pink-color", "#e91e63"],
  ["--indigo-color", "#3f51b5"],
  ["--orange-color", "#ff9800"],
  ["--cyan-color", "#00bcd4"],
  ["--red-color", "#f44336"],
  ["--blue-grey-color", "#607d8b"],
  ["--brown-color", "#795548"],
];

function lessonSpan(lesson) {
  return Math.max(1, Number(lesson.span) || 1);
}

function orderedPeriods(timetable) {
  return [...timetable.periods].sort((left, right) => left.start.localeCompare(right.start));
}

function lessonCovers(lesson, periodNumber) {
  return periodNumber >= lesson.period && periodNumber < lesson.period + lessonSpan(lesson);
}

function subjectColor(subject) {
  const key = String(subject || "").trim().toLowerCase();
  let hash = 0;
  for (let index = 0; index < key.length; index++) {
    hash = (hash * 31 + key.charCodeAt(index)) >>> 0;
  }
  const [token, fallback] = SUBJECT_COLORS[hash % SUBJECT_COLORS.length];
  return `var(${token}, ${fallback})`;
}

function _t(hass, key, params) {
  const lang = ((hass && hass.language) || "en").split("-")[0];
  const table = STRINGS[lang] || STRINGS.en;
  const raw =
    (hass && hass.localize && hass.localize(`component.school_timetable.panel.${key}`)) ||
    table[key] ||
    STRINGS.en[key] ||
    key;
  if (!params) return raw;
  return raw.replace(/\{(\w+)\}/g, (_, name) =>
    params[name] != null ? String(params[name]) : ""
  );
}

// ha-icon is defined in a lazily loaded chunk that a panel cannot count on, so
// the pane draws its own. Every path below is the Material Design Icons data
// Home Assistant itself ships (mdiAccount, mdiPlus, mdiCalendarBlank, mdiCog).
const MDI = {
  account:
    "M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z",
  plus: "M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z",
  calendar:
    "M19,19H5V8H19M19,3H18V1H16V3H8V1H6V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3Z",
  upload: "M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z",
  chevron: "M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z",
  pencil:
    "M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z",
  delete: "M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z",
  // mdiDotsVertical, as the todo panel's overflow trigger uses it.
  overflow:
    "M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z",
  cog: "M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z",
};

function icon(name) {
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  // Sized on the element, not only in CSS: slotted into ha-dropdown-item there
  // is nothing to give it an intrinsic size and it collapses.
  svg.setAttribute("width", "24");
  svg.setAttribute("height", "24");
  svg.setAttribute("focusable", "false");
  svg.setAttribute("aria-hidden", "true");
  const path = document.createElementNS(ns, "path");
  path.setAttribute("d", MDI[name]);
  path.setAttribute("fill", "currentColor");
  svg.appendChild(path);
  return svg;
}

function h(tag, props, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(props || {})) {
    if (value === null || value === undefined || value === false) continue;
    if (key === "class") node.className = value;
    else if (key === "style") node.style.cssText = value;
    else if (key === "text") node.textContent = value;
    else if (key.startsWith("on")) node.addEventListener(key.slice(2).toLowerCase(), value);
    else if (key in node) node[key] = value;
    else node.setAttribute(key, value === true ? "" : value);
  }
  for (const child of children.flat()) {
    if (child === null || child === undefined || child === false) continue;
    node.append(child.nodeType ? child : document.createTextNode(String(child)));
  }
  return node;
}

// Home Assistant keeps each user's date and time preferences in hass.locale.
// "language" follows their chosen language, "system" follows the browser, and
// the rest are explicit patterns. Formatters are cached because the lesson grid
// asks for a time on every row.
const FORMATTERS = new Map();

function _cachedFormat(key, build) {
  let formatter = FORMATTERS.get(key);
  if (!formatter) {
    formatter = build();
    FORMATTERS.set(key, formatter);
  }
  return formatter;
}

function localeSignature(hass) {
  const locale = (hass && hass.locale) || {};
  return [
    hass && hass.language,
    locale.language,
    locale.date_format,
    locale.time_format,
  ].join("|");
}

function _formatLanguage(hass, setting) {
  if (setting === "system") return undefined;
  const locale = (hass && hass.locale) || {};
  return locale.language || (hass && hass.language) || "en";
}

// Mirrors the frontend's useAMPM: for "language" and "system" it asks the
// runtime by formatting 22:00 and looking for a 10.
function _usesAmPm(hass) {
  const setting = ((hass && hass.locale) || {}).time_format;
  if (setting === "12") return true;
  if (setting === "24") return false;
  const language = setting === "language" ? _formatLanguage(hass, setting) : undefined;
  return new Date("January 1, 2023 22:00:00").toLocaleString(language).includes("10");
}

function _numericDateFormat(hass, setting) {
  const language = _formatLanguage(hass, setting);
  return _cachedFormat(`date:${setting}:${language}`, () =>
    new Intl.DateTimeFormat(language, { year: "numeric", month: "numeric", day: "numeric" })
  );
}

// Mirrors the frontend's formatDateNumeric, so a date here reads exactly like
// one in an ha-date-input. "language" and "system" take the runtime's order; the
// explicit orders reuse the parts that locale produced, which keeps its own
// separator (dots in German, slashes in English) rather than importing another
// locale's punctuation.
function fmtDate(hass, iso) {
  if (!iso) return "";
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const setting = ((hass && hass.locale) || {}).date_format;
  const formatter = _numericDateFormat(hass, setting);
  if (setting !== "DMY" && setting !== "MDY" && setting !== "YMD") return formatter.format(date);

  const parts = formatter.formatToParts(date);
  const pick = (type) => parts.find((part) => part.type === type)?.value;
  const separator = pick("literal") ?? ".";
  const last = parts[parts.length - 1];
  const language = _formatLanguage(hass, setting);
  const suffix =
    last && last.type === "literal" && !(language === "bg" && setting === "YMD") ? last.value : "";
  const order = {
    DMY: [pick("day"), pick("month"), pick("year")],
    MDY: [pick("month"), pick("day"), pick("year")],
    YMD: [pick("year"), pick("month"), pick("day")],
  }[setting];
  return order.join(separator) + suffix;
}

// Mirrors the frontend's formatTime.
function fmtTime(hass, value) {
  if (!value) return "";
  const [hours, minutes] = value.split(":").map(Number);
  const setting = ((hass && hass.locale) || {}).time_format;
  const language = _formatLanguage(hass, setting);
  const amPm = _usesAmPm(hass);
  return _cachedFormat(`time:${language}:${amPm}`, () =>
    new Intl.DateTimeFormat(language, {
      hour: amPm ? "numeric" : "2-digit",
      minute: "2-digit",
      hour12: amPm,
    })
  ).format(new Date(2023, 0, 1, hours, minutes));
}

function todayIso() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

const STYLE = `
  /* ha-panel-custom appends a module panel with no styles of its own, so the
     panel has to claim the viewport itself. This is what Home Assistant uses
     for the iframe variant. */
  :host {
    display: flex;
    flex-direction: column;
    height: 100vh;
    height: 100dvh;
    box-sizing: border-box;
    background: var(--primary-background-color, #f5f5f5);
    color: var(--primary-text-color, #212121);
    font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif);
    --st-gap: 16px;
    --sidepane-width: 250px;
  }
  /* Mirrors ha-top-app-bar: a row of sections, navigation taking the space and
     actions pinned to the end. There is no divider between them; the #title
     rule that once set one to the pane width is dead code in the frontend. */
  .toolbar {
    flex: 0 0 var(--header-height, 56px);
    box-sizing: border-box;
    background: var(--app-header-background-color, var(--primary-color, #03a9f4));
    color: var(--app-header-text-color, #fff);
  }
  .toolbar .row {
    box-sizing: border-box;
    width: 100%;
    height: var(--header-height, 56px);
    border-bottom: var(--app-header-border-bottom, none);
    display: flex;
    align-items: center;
  }
  .toolbar .section {
    box-sizing: border-box;
    min-width: 0;
    height: 100%;
    padding: 0 var(--ha-space-3, 12px);
    display: flex;
    align-items: center;
  }
  .toolbar #navigation { flex: auto; }
  .toolbar .section.end { flex: none; justify-content: flex-end; }
  .toolbar .title {
    min-width: 0;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: var(--ha-font-size-xl, 20px);
    font-weight: var(--ha-font-weight-normal, 400);
    line-height: var(--header-height, 56px);
    padding-inline-start: var(--ha-space-6, 24px);
  }
  /* Next to the navigation icon the title sits closer, as it does there. */
  .toolbar .title.with-icon { padding-inline-start: var(--ha-space-2, 8px); }
  /* Holding the picker it is a flex row, not a line of text. */
  .toolbar .title.picker {
    display: flex;
    align-items: center;
    line-height: normal;
    padding-inline-start: var(--ha-space-2, 8px);
  }
  /* Same pill the todo panel's picker is: brand fill, white label, chevron
     inside. ha-button draws its own, so it only needs sizing. */
  button.view-picker {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    box-sizing: border-box;
    height: 40px;
    max-width: 60vw;
    padding: 0 16px;
    border: 0;
    border-radius: 999px;
    font-size: var(--ha-font-size-m, 14px);
    background: var(--ha-color-fill-primary-loud-resting, var(--primary-color, #03a9f4));
    color: var(--ha-color-on-primary-loud, var(--text-primary-color, #fff));
  }
  .view-picker > span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .view-picker svg { width: 20px; height: 20px; flex: 0 0 auto; color: currentColor; }
  ha-button.view-picker {
    background: none;
    padding: 0;
    height: auto;
    border-radius: 0;
    --ha-button-height: 40px;
    --ha-button-label-overflow: hidden;
  }
  ha-button.view-picker div { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  /* Exactly what ha-dropdown-item[selected] renders as. */
  .menu-item.active {
    font-weight: var(--ha-font-weight-medium, 500);
    color: var(--primary-color, #03a9f4);
    background: var(--ha-color-fill-primary-quiet-resting,
      rgba(var(--rgb-primary-color, 3, 169, 244), 0.12));
  }
  .menu-item.active svg { color: var(--primary-color, #03a9f4); }
  button.menu {
    border: 0;
    background: none;
    color: inherit;
    cursor: pointer;
    padding: 8px;
    border-radius: 50%;
    line-height: 0;
  }
  button.menu:hover { background: rgba(255, 255, 255, 0.12); }
  .content { flex: 1; min-height: 0; }
  /* Mirrors ha-two-pane-top-app-bar-fixed. */
  .layout { display: flex; overflow: hidden; height: 100%; }
  .nav {
    box-sizing: border-box;
    flex: 0 0 var(--sidepane-width, 250px);
    width: var(--sidepane-width, 250px);
    display: flex;
    flex-direction: column;
    position: relative;
    /* No background of its own: the pane sits on the page background, which is
       what separates it from Home Assistant's own sidebar to its left. */
    border-right: 1px solid var(--divider-color, #e0e0e0);
    border-inline-end: 1px solid var(--divider-color, #e0e0e0);
    border-inline-start: initial;
  }
  .nav-kids { flex: 1; overflow: auto; padding: 4px 0; }
  .nav-bottom { padding: 4px 0 8px; border-top: 1px solid var(--divider-color, #e0e0e0); }
  /* Rows follow an activated mwc list item: full bleed, 48px, and primary
     colour over a 12% tint when current. */
  button.nav-item {
    display: flex;
    align-items: center;
    gap: 16px;
    width: 100%;
    min-height: 48px;
    padding: 0 16px;
    box-sizing: border-box;
    border: 0;
    border-radius: 0;
    background: none;
    color: var(--primary-text-color, #212121);
    font-size: 14px;
    text-align: start;
    flex: 0 0 auto;
  }
  .nav-item svg {
    flex: 0 0 auto;
    width: 24px;
    height: 24px;
    color: var(--secondary-text-color, #727272);
  }
  .nav-item span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  button.nav-item:hover { background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.04); }
  button.nav-item[aria-current="page"] {
    color: var(--primary-color, #03a9f4);
    background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12);
  }
  button.nav-item[aria-current="page"] svg { color: var(--primary-color, #03a9f4); }
  .view { flex: 1; min-width: 0; height: 100%; overflow: auto; }
  .view-inner { max-width: 1100px; margin: 0 auto; padding: var(--st-gap) var(--st-gap) 88px; }
  @media (max-width: 700px) {
    .layout { flex-direction: column; overflow: auto; }
    .nav {
      flex: 0 0 auto;
      width: auto;
      flex-direction: row;
      border-inline-end: 0;
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
    }
    .nav-kids, .nav-bottom { flex-direction: row; overflow-x: auto; border-top: 0; }
    .view { height: auto; overflow: visible; }
  }
  .card {
    background: var(--card-background-color, #fff);
    border-radius: var(--ha-card-border-radius, 12px);
    box-shadow: var(--ha-card-box-shadow, 0 2px 4px rgba(0, 0, 0, 0.08));
    padding: var(--st-gap);
    margin-bottom: var(--st-gap);
  }
  h2 { font-size: 18px; font-weight: 500; margin: 0 0 4px; }
  h3 { font-size: 15px; font-weight: 500; margin: var(--st-gap) 0 8px; }
  .hint { color: var(--secondary-text-color, #727272); font-size: 13px; margin: 0 0 12px; }
  .row { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
  .spread { justify-content: space-between; }
  .grow { flex: 1; min-width: 0; }
  button {
    font: inherit;
    font-size: 14px;
    border-radius: 8px;
    border: 1px solid var(--divider-color, #e0e0e0);
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color, #212121);
    padding: 8px 14px;
    cursor: pointer;
  }
  button:hover { background: var(--secondary-background-color, #e5e5e5); }
  button.primary {
    background: var(--primary-color, #03a9f4);
    border-color: var(--primary-color, #03a9f4);
    color: var(--text-primary-color, #fff);
  }
  button.primary:hover { filter: brightness(1.08); }
  button.danger { color: var(--error-color, #db4437); }
  button.chip { border-radius: 999px; }
  button.chip[aria-pressed="true"] {
    background: var(--primary-color, #03a9f4);
    border-color: var(--primary-color, #03a9f4);
    color: var(--text-primary-color, #fff);
  }
  button.icon { padding: 6px 10px; }
  button:disabled { opacity: 0.5; cursor: default; }
  input, select {
    font: inherit;
    font-size: 14px;
    padding: 8px 10px;
    border-radius: 8px;
    border: 1px solid var(--divider-color, #e0e0e0);
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color, #212121);
    box-sizing: border-box;
    min-width: 0;
  }
  input:focus-visible, select:focus-visible, button:focus-visible {
    outline: 2px solid var(--primary-color, #03a9f4);
    outline-offset: 1px;
  }
  label.field { display: flex; flex-direction: column; gap: 4px; font-size: 12px;
    color: var(--secondary-text-color, #727272); }
  label.inline { display: flex; align-items: center; gap: 6px; font-size: 13px;
    color: var(--secondary-text-color, #727272); }
  table { width: 100%; border-collapse: collapse; }
  th {
    text-align: left;
    font-size: 12px;
    font-weight: 500;
    color: var(--secondary-text-color, #727272);
    padding: 6px 8px;
  }
  td { padding: 4px 8px; border-top: 1px solid var(--divider-color, #e0e0e0); }
  .scroll { overflow-x: auto; }
  /* A week grid: fixed-width time column, one equal column per weekday. */
  table.cal { table-layout: fixed; border-collapse: separate; border-spacing: 4px 4px; }
  table.cal th { text-align: center; font-size: 13px; padding-bottom: 0; }
  table.cal td { border-top: 0; padding: 0; }
  table.cal .cal-times { width: 120px; white-space: nowrap; text-align: end; vertical-align: middle; }
  .cal-cell { height: 52px; }
  .cal-entry,
  .cal-slot {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    min-height: 52px;
    box-sizing: border-box;
    padding: 6px 10px;
    border-radius: var(--ha-border-radius-md, 8px);
    font-size: 14px;
    text-align: start;
    overflow: hidden;
  }
  /* An entry looks like a calendar event: solid subject colour, white label. */
  .cal-entry {
    border: 0;
    background: var(--st-subject, var(--primary-color, #03a9f4));
    color: var(--text-primary-color, #fff);
    box-shadow: none;
  }
  .cal-entry:hover { filter: brightness(1.06); background: var(--st-subject, var(--primary-color, #03a9f4)); }
  .cal-subject { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .cal-slot {
    justify-content: center;
    border: 1px dashed var(--divider-color, #e0e0e0);
    background: none;
    color: var(--secondary-text-color, #727272);
    opacity: 0.55;
  }
  .cal-slot:hover { opacity: 1; background: var(--secondary-background-color, #e5e5e5); }
  .cal-slot svg { width: 20px; height: 20px; }
  .grid input { width: 100%; }
  .grid th { min-width: 110px; }
  .grid td.period-head { white-space: nowrap; }
  button.link {
    border: 0;
    background: none;
    padding: 6px 4px;
    font-size: 13px;
    color: var(--secondary-text-color, #727272);
    cursor: pointer;
    border-radius: 6px;
  }
  button.link:hover {
    background: var(--secondary-background-color, #e5e5e5);
    color: var(--primary-text-color, #212121);
  }
  /* Position only: ha-button draws itself, and painting the host would put a
     second button around it. */
  .fab {
    position: fixed;
    right: calc(16px + var(--safe-area-inset-right, 0px));
    bottom: calc(16px + var(--safe-area-inset-bottom, 0px));
    z-index: 5;
  }
  button.fab {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 48px;
    padding: 0 24px;
    border: 0;
    border-radius: 999px;
    font-size: 15px;
    background: var(--ha-color-fill-primary-loud-resting, var(--primary-color, #03a9f4));
    color: var(--ha-color-on-primary-loud, var(--text-primary-color, #fff));
    box-shadow: var(--ha-box-shadow-l, 0 3px 5px -1px rgba(0, 0, 0, 0.2),
      0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12));
  }
  .fab svg { width: 20px; height: 20px; color: currentColor; }
  .menu-host { display: flex; align-items: center; }
  .menu-popup.anchored { top: auto; right: auto; }
  button.row-menu {
    border: 0;
    background: none;
    padding: 4px;
    border-radius: 50%;
    line-height: 0;
    color: var(--secondary-text-color, #727272);
  }
  button.row-menu:hover { background: var(--secondary-background-color, #e5e5e5); }
  .row-menu svg { width: 20px; height: 20px; display: block; }
  ha-icon-button.row-menu { --mdc-icon-button-size: 40px; --mdc-icon-size: 20px; }
  td.row-actions { width: 1%; text-align: end; white-space: nowrap; }
  .menu-item svg {
    width: 24px;
    height: 24px;
    flex: 0 0 auto;
    color: var(--ha-color-on-neutral-normal, var(--secondary-text-color, #727272));
  }
  .menu-item.danger svg { color: var(--error-color, #db4437); }
  .menu-divider {
    height: 1px;
    margin: 4px 0;
    background: var(--divider-color, #e0e0e0);
  }
  .warm { position: absolute; left: -9999px; width: 1px; height: 1px; overflow: hidden; }
  .toggle-row { justify-content: flex-end; margin-bottom: var(--st-gap); }
  div.toggle { display: inline-flex; }
  div.toggle .toggle-item {
    border: 0;
    border-radius: 0;
    height: 40px;
    padding: 0 20px;
    font-size: 14px;
    background: var(--ha-color-fill-primary-normal-resting,
      rgba(var(--rgb-primary-color, 3, 169, 244), 0.12));
    color: var(--ha-color-on-primary-normal, var(--primary-color, #03a9f4));
  }
  div.toggle .toggle-item:first-child {
    border-start-start-radius: 999px;
    border-end-start-radius: 999px;
  }
  div.toggle .toggle-item:last-child {
    border-start-end-radius: 999px;
    border-end-end-radius: 999px;
  }
  div.toggle .toggle-item[aria-pressed="true"] {
    background: var(--ha-color-fill-primary-loud-resting, var(--primary-color, #03a9f4));
    color: var(--ha-color-on-primary-loud, var(--text-primary-color, #fff));
  }
  .bulk {
    background: var(--secondary-background-color, #e5e5e5);
    border-radius: 8px;
    padding: 8px 12px;
    margin-bottom: 12px;
  }
  .badge {
    font-size: 11px;
    border-radius: 999px;
    padding: 2px 8px;
    background: var(--secondary-background-color, #e5e5e5);
    color: var(--secondary-text-color, #727272);
  }
  .empty { color: var(--secondary-text-color, #727272); font-size: 14px; padding: 8px 0; }
  .status { font-size: 13px; color: var(--secondary-text-color, #727272); }
  .status.warn { color: var(--warning-color, #ffa600); }
  .status.error { color: var(--error-color, #db4437); }
  .menu-backdrop { position: fixed; inset: 0; z-index: 9; }
  /* Same surface ha-dropdown renders: raised card, 1px quiet border, 8px
     radius, 4px of padding, sized to its content. */
  .menu-popup {
    position: fixed;
    top: calc(var(--header-height, 56px) + 4px);
    right: 8px;
    width: max-content;
    min-width: 200px;
    max-width: min(80vw, 360px);
    padding: var(--ha-space-1, 4px);
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    color: var(--primary-text-color, #212121);
    background: var(--card-background-color, #fff);
    border: 1px solid var(--ha-color-border-neutral-quiet, var(--divider-color, #e0e0e0));
    border-radius: var(--ha-border-radius-md, 8px);
    box-shadow: var(--ha-box-shadow-m, 0 4px 16px rgba(0, 0, 0, 0.24));
  }
  /* And the metrics of an ha-dropdown-item. */
  .menu-item {
    display: flex;
    align-items: center;
    gap: var(--ha-space-3, 12px);
    width: 100%;
    min-height: 48px;
    box-sizing: border-box;
    text-align: start;
    border: 0;
    background: none;
    border-radius: var(--ha-border-radius-md, 8px);
    padding: var(--ha-space-2, 8px) var(--ha-space-3, 12px);
    font-size: var(--ha-font-size-m, 14px);
    color: inherit;
  }
  .menu-item:hover { background: var(--secondary-background-color, #e5e5e5); }
  .menu-item.danger { color: var(--error-color, #db4437); }
  .menu-item.danger svg { color: var(--error-color, #db4437); }
  .backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    padding: 16px;
  }
  .dialog-body { display: flex; flex-direction: column; gap: 12px; }
  ha-dialog .dialog-body { padding-bottom: 4px; }
  .dialog-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    margin-top: 4px;
    justify-content: flex-end;
  }
  .dialog-actions .dialog-delete { margin-inline-end: auto; }
  .dialog {
    background: var(--card-background-color, #fff);
    border-radius: var(--ha-card-border-radius, 12px);
    padding: 20px;
    width: min(420px, 100%);
    max-height: 90vh;
    overflow: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
`;

const SVG_OVERFLOW =
  '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">' +
  '<path d="M12 16a2 2 0 1 1 0 4 2 2 0 0 1 0-4m0-6a2 2 0 1 1 0 4 2 2 0 0 1 0-4m0-6a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z"/></svg>';

const SVG_MENU =
  '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">' +
  '<path d="M3 6h18v2H3V6m0 5h18v2H3v-2m0 5h18v2H3v-2Z"/></svg>';

class SchoolTimetablePanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._data = null;
    this._error = null;
    this._view = "kid";
    this._kidId = null;
    this._timetableId = null;
    this._showWeekend = false;
    this._selected = new Set();
    this._kidTab = "timetable";
    this._nativeMenu = false;
    this._haIconButton = false;
    this._haMenuButton = false;
    this._haList = false;
    this._haSelector = false;
    this._haToggleGroup = false;
    this._haDialog = false;
    this._nativePickers = false;
    this._haInputs = false;
    this._haSelect = false;
    this._haCheckbox = false;
    this._haButton = false;
    this._status = null;
    this._subscribing = false;
    this._unsub = null;
  }

  set hass(hass) {
    const previous = this._hass;
    this._hass = hass;
    if (!previous) {
      this._subscribe();
      this._render();
      return;
    }
    // Home Assistant pushes a new hass object on every state change, far too
    // often to repaint on. Only the parts this panel renders from matter, so
    // repaint when the user changes language or their date/time format.
    if (localeSignature(previous) !== localeSignature(hass)) {
      FORMATTERS.clear();
      this._render();
    }
  }

  set narrow(value) {
    const changed = this._narrow !== value;
    this._narrow = value;
    if (changed) this._render();
  }

  _isNarrow() {
    return Boolean(this._narrow || (this._mql && this._mql.matches));
  }

  set panel(value) {
    this._panel = value;
  }

  connectedCallback() {
    if (!this._mql && typeof window.matchMedia === "function") {
      this._mql = window.matchMedia(NARROW_QUERY);
      this._onNarrowChange = () => this._render();
      this._mql.addEventListener("change", this._onNarrowChange);
    }
    if (this._hass && !this._unsub && !this._subscribing) this._subscribe();
    this._render();
  }

  disconnectedCallback() {
    if (this._mql) {
      this._mql.removeEventListener("change", this._onNarrowChange);
      this._mql = null;
    }
    if (this._unsub) {
      this._unsub();
      this._unsub = null;
    }
  }

  async _subscribe() {
    if (this._subscribing || !this._hass) return;
    this._subscribing = true;
    try {
      this._unsub = await this._hass.connection.subscribeMessage(
        (data) => this._onData(data),
        { type: "school_timetable/subscribe" }
      );
    } catch (err) {
      this._error = _errorText(this._hass, err);
      this._render();
    } finally {
      this._subscribing = false;
    }
  }

  _onData(data) {
    this._data = data;
    this._error = null;
    if (!this._kid()) {
      this._kidId = data.kids.length ? data.kids[0].id : null;
      this._timetableId = null;
    }
    this._render();
  }

  _kid() {
    if (!this._data || !this._kidId) return null;
    return this._data.kids.find((kid) => kid.id === this._kidId) || null;
  }

  _timetable() {
    const kid = this._kid();
    if (!kid || !kid.timetables.length) return null;
    const found = kid.timetables.find((tt) => tt.id === this._timetableId);
    if (found) return found;
    return kid.timetables[kid.timetables.length - 1];
  }

  async _call(message) {
    try {
      return await this._hass.callWS(message);
    } catch (err) {
      this._setStatus(_errorText(this._hass, err), "error");
      throw err;
    }
  }

  _setStatus(text, kind) {
    this._status = text ? { text, kind: kind || "" } : null;
    this._render();
  }

  // --- dialogs ---------------------------------------------------------

  // Home Assistant's dialog when available: real scrim, heading, focus trap and
  // Escape handling, with the actions in its own slots.
  _openDialogSurface({ title, description, onDismiss, actions }) {
    const body = h("div", { class: "dialog-body" });
    if (this._haDialog) {
      // ha-dialog wraps wa-dialog: the title is headerTitle, the body is the
      // default slot and the buttons go in one element slotted as "footer".
      const dialog = document.createElement("ha-dialog");
      dialog.headerTitle = title;
      dialog.open = true;
      let dismissed = true;
      dialog.addEventListener("closed", () => {
        const notify = dismissed;
        dialog.remove();
        if (notify) onDismiss();
      });
      if (description) body.appendChild(h("p", { class: "hint", text: description }));
      dialog.appendChild(body);

      const footer = h("div", { class: "dialog-actions" }, ...actions.map((a) => a.element));
      footer.setAttribute("slot", "footer");
      dialog.appendChild(footer);

      // wa-dialog does not wire Enter to the primary action either.
      const primary = actions.find((action) => action.primary);
      dialog.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && primary) {
          event.preventDefault();
          primary.element.click();
        }
      });
      this._dialogs.appendChild(dialog);
      return {
        body,
        // Closing from a button is not a dismissal, so onDismiss stays quiet.
        close: () => {
          dismissed = false;
          dialog.open = false;
        },
      };
    }

    const surface = h("div", { class: "dialog", role: "dialog" });
    if (title) surface.appendChild(h("h2", { text: title }));
    if (description) surface.appendChild(h("p", { class: "hint", text: description }));
    surface.appendChild(body);
    surface.appendChild(
      h("div", { class: "dialog-actions" }, ...actions.map((action) => action.element))
    );
    const backdrop = h(
      "div",
      {
        class: "backdrop",
        onClick: (event) => {
          if (event.target === backdrop) {
            backdrop.remove();
            onDismiss();
          }
        },
        onKeydown: (event) => {
          if (event.key === "Escape") {
            backdrop.remove();
            onDismiss();
          }
          if (event.key === "Enter") {
            const primary = actions.find((action) => action.primary);
            if (primary) primary.element.click();
          }
        },
      },
      surface
    );
    this._dialogs.append(backdrop);
    return { body, close: () => backdrop.remove(), surface };
  }

  _confirm(text) {
    return new Promise((resolve) => {
      let surface;
      const finish = (result) => {
        surface.close();
        resolve(result);
      };
      surface = this._openDialogSurface({
        title: _t(this._hass, "menu.title"),
        onDismiss: () => resolve(false),
        actions: [
          {
            element: this._button({
              label: _t(this._hass, "common.cancel"),
              className: "dialog-cancel",
              appearance: "plain",
              onClick: () => finish(false),
            }),
          },
          {
            primary: true,
            element: this._button({
              label: _t(this._hass, "common.delete"),
              className: "dialog-submit",
              variant: "danger",
              onClick: () => finish(true),
            }),
          },
        ],
      });
      surface.body.appendChild(h("div", { text }));
    });
  }

  // Every button in the panel comes from here, so the ha-button upgrade reaches
  // all of them at once. Classes are kept on whichever element is built, so
  // selectors and styling do not care which one it is.
  _button({ label, className = "", icon: iconName, appearance, variant, size, onClick }) {
    if (this._haButton) {
      const element = document.createElement("ha-button");
      if (className) element.className = className;
      if (appearance) element.setAttribute("appearance", appearance);
      if (variant) element.setAttribute("variant", variant);
      if (size) element.setAttribute("size", size);
      if (iconName) {
        const glyph = icon(iconName);
        glyph.setAttribute("slot", "start");
        element.appendChild(glyph);
      }
      element.append(document.createTextNode(label));
      if (onClick) element.addEventListener("click", onClick);
      return element;
    }
    const parts = [];
    if (iconName) parts.push(icon(iconName));
    parts.push(h("span", { text: label }));
    return h("button", { class: className, onClick }, ...parts);
  }

  _iconButton({ path, label, className = "", onClick }) {
    if (this._haIconButton) {
      const element = document.createElement("ha-icon-button");
      element.className = className;
      element.path = MDI[path];
      element.label = label;
      if (onClick) element.addEventListener("click", onClick);
      return element;
    }
    const element = h("button", { class: className, title: label, onClick });
    element.appendChild(icon(path));
    return element;
  }

  // Text, url and number fields. ha-input carries its own label, so the caller
  // does not add one when `labelled` comes back true.
  _textField({ type = "text", value = "", placeholder = "", label = "", onInput, onChange }) {
    if (this._haInputs) {
      const element = document.createElement("ha-input");
      element.type = type;
      element.value = value;
      if (label) element.label = label;
      if (placeholder) element.placeholder = placeholder;
      const read = () => String(element.value ?? "").trim();
      if (onInput) element.addEventListener("input", () => onInput(String(element.value ?? "")));
      if (onChange) element.addEventListener("change", () => onChange(read()));
      return { element, read, focus: () => element.focus?.(), labelled: Boolean(label) };
    }
    const element = h("input", { type, value, placeholder });
    const read = () => element.value.trim();
    if (onInput) element.addEventListener("input", () => onInput(element.value));
    if (onChange) element.addEventListener("change", () => onChange(read()));
    return { element, read, focus: () => element.focus(), labelled: false };
  }

  _checkbox({ checked, label, onChange, bare = false }) {
    let element;
    if (this._haCheckbox) {
      element = document.createElement("ha-checkbox");
      element.checked = checked;
      element.addEventListener("change", () => onChange(Boolean(element.checked)));
    } else {
      element = h("input", {
        type: "checkbox",
        checked,
        onChange: (event) => onChange(event.target.checked),
      });
    }
    if (!bare) return h("label", { class: "inline" }, element, label);
    element.setAttribute("aria-label", label);
    return element;
  }

  _select({ value, options, onChange }) {
    if (this._haSelect) {
      const element = document.createElement("ha-select");
      element.options = options;
      element.value = value;
      // ha-select reports a choice as "selected", not the usual value-changed,
      // and never writes its own value: it expects the owner to hand it back.
      // Listening only for value-changed leaves the select inert on a click.
      const handler = (event) => {
        event.stopPropagation();
        const next = event.detail?.value ?? "";
        if (String(next) === String(element.value)) return;
        element.value = next;
        onChange(String(next));
      };
      element.addEventListener("selected", handler);
      element.addEventListener("value-changed", handler);
      return element;
    }
    return h(
      "select",
      { onChange: (event) => onChange(event.target.value) },
      ...options.map((option) =>
        h("option", { value: option.value, selected: option.value === value, text: option.label })
      )
    );
  }

  // A dialog field is Home Assistant's own date or time input when that is
  // available, because those follow hass.locale. Otherwise a native input,
  // which follows the browser.
  _dialogField(field) {
    const type = field.type || "text";
    if (type === "select") {
      let current = field.value;
      const element = this._select({
        value: field.value,
        options: field.options,
        onChange: (value) => {
          current = value;
        },
      });
      return {
        element,
        read: () => String(current ?? element.value ?? ""),
        focus: () => element.focus?.(),
        labelled: false,
      };
    }
    // ha-selector is available from the first paint and lazy-loads ha-date-input
    // or ha-time-input itself, which is what makes these follow hass.locale.
    if (this._haSelector && (type === "date" || type === "time")) {
      const element = document.createElement("ha-selector");
      element.hass = this._hass;
      element.selector = type === "date" ? { date: {} } : { time: {} };
      element.required = Boolean(field.required);
      if (field.label) element.label = field.label;
      let current = field.value
        ? type === "time"
          ? `${field.value}:00`.slice(0, 8)
          : field.value
        : "";
      element.value = current || undefined;
      // A selector is a controlled component: it reports a change and expects
      // the value to be handed back, so the panel keeps it here.
      element.addEventListener("value-changed", (event) => {
        event.stopPropagation();
        current = event.detail.value || "";
        element.value = current || undefined;
      });
      return {
        element,
        read: () => (type === "time" ? String(current).slice(0, 5) : String(current)),
        focus: () => element.focus?.(),
        labelled: Boolean(field.label),
      };
    }
    if (this._nativePickers && (type === "date" || type === "time")) {
      const element = document.createElement(
        type === "date" ? "ha-date-input" : "ha-time-input"
      );
      element.locale = this._hass.locale;
      element.required = Boolean(field.required);
      if (field.label) element.label = field.label;
      // ha-time-input speaks HH:MM:SS; everything stored here is HH:MM.
      element.value = field.value
        ? type === "time"
          ? `${field.value}:00`.slice(0, 8)
          : field.value
        : undefined;
      return {
        element,
        read: () => {
          const value = String(element.value || "").trim();
          return type === "time" ? value.slice(0, 5) : value;
        },
        focus: () => element.focus?.(),
        labelled: Boolean(field.label),
      };
    }
    return this._textField({
      type,
      value: field.value || "",
      placeholder: field.placeholder || "",
      label: field.label,
    });
  }

  _formDialog({ title, description, fields, submitLabel, validate, deletable }) {
    return new Promise((resolve) => {
      const controls = {};
      const error = h("p", { class: "status error" });
      let surface;
      const finish = (result) => {
        surface.close();
        resolve(result);
      };
      const submit = () => {
        const values = {};
        for (const field of fields) {
          const value = controls[field.key].read();
          if (field.required && !value) {
            controls[field.key].focus();
            return;
          }
          values[field.key] = value;
        }
        const message = validate ? validate(values) : null;
        if (message) {
          error.textContent = message;
          return;
        }
        finish(values);
      };

      const actions = [];
      if (deletable) {
        actions.push({
          element: this._button({
            label: _t(this._hass, "common.delete"),
            className: "dialog-delete",
            variant: "danger",
            appearance: "plain",
            onClick: () => finish({ __deleted: true }),
          }),
        });
      }
      actions.push({
        element: this._button({
          label: _t(this._hass, "common.cancel"),
          className: "dialog-cancel",
          appearance: "plain",
          onClick: () => finish(null),
        }),
      });
      actions.push({
        primary: true,
        element: this._button({
          label: submitLabel || _t(this._hass, "common.save"),
          className: "dialog-submit",
          onClick: submit,
        }),
      });

      surface = this._openDialogSurface({
        title,
        description,
        onDismiss: () => resolve(null),
        actions,
      });

      for (const field of fields) {
        const control = this._dialogField(field);
        controls[field.key] = control;
        surface.body.appendChild(
          control.labelled
            ? control.element
            : h("label", { class: "field" }, field.label, control.element)
        );
      }
      surface.body.appendChild(error);
      if (fields.length) controls[fields[0].key].focus();
    });
  }

  // --- shell -----------------------------------------------------------

  _ensureShell() {
    if (this._main) return;
    // Only shown on a narrow screen, where Home Assistant hides its sidebar and
    // this is the only way back to it. On a wide screen that sidebar is already
    // on display and the button would just collapse it.
    this._sidebarToggle = h("div", { class: "sidebar-toggle" });
    this._menuHost = h("div", { class: "menu-host" });
    this._main = h("div", { class: "content" });
    this._dialogs = h("div");
    this.shadowRoot.replaceChildren(
      h("style", { text: STYLE }),
      h(
        "div",
        { class: "toolbar" },
        h(
          "div",
          { class: "row" },
          h(
            "section",
            { class: "section", id: "navigation" },
            this._sidebarToggle,
            (this._titleHost = h("span", { class: "title" }))
          ),
          h("section", { class: "section end", id: "actions", role: "toolbar" }, this._menuHost)
        )
      ),
      this._main,
      this._dialogs
    );
    this._installFallbackMenu();
    this._watchHaElements();
  }

  // Every element is optional: the panel works with its own controls and gets
  // better as Home Assistant's chunks land. Nothing here waits on a timeout,
  // because there is no telling how late a chunk arrives.
  // ha-button-toggle-group is only ever loaded by components a panel page never
  // shows. Mounting a hidden duration selector once is enough: ha-selector
  // lazy-loads ha-selector-duration, which brings the toggle group with it.
  // Date and time fields do not need this, they go through ha-selector directly.
  // If Home Assistant ever stops pulling it in, the toggle falls back to the
  // panel's own buttons and nothing breaks.
  _warmHaElements() {
    if (this._warmed || this._haToggleGroup) return;
    if (!customElements.get("ha-selector") || !this._hass) return;
    this._warmed = true;
    const host = h("div", { class: "warm" });
    const selector = document.createElement("ha-selector");
    selector.hass = this._hass;
    selector.selector = { duration: {} };
    selector.value = { hours: 0, minutes: 45, seconds: 0 };
    host.appendChild(selector);
    this.shadowRoot.appendChild(host);
    customElements
      .whenDefined("ha-button-toggle-group")
      .then(() => setTimeout(() => host.remove(), 0))
      .catch(() => host.remove());
  }

  _watchHaElements() {
    this._readHaElements();
    this._warmHaElements();
    for (const name of HA_ELEMENTS) {
      if (customElements.get(name)) continue;
      customElements.whenDefined(name).then(() => {
        if (!this.isConnected) return;
        this._warmHaElements();
        if (!this._readHaElements()) return;
        this._render();
      });
    }
  }

  // Returns whether anything changed, so a late arrival only costs one repaint.
  _readHaElements() {
    const has = (name) => Boolean(customElements.get(name));
    const next = {
      _nativeMenu: has("ha-dropdown") && has("ha-dropdown-item"),
      _haIconButton: has("ha-icon-button"),
      _haMenuButton: has("ha-menu-button"),
      _haList: has("ha-list") && has("ha-dropdown-item"),
      _haButton: has("ha-button"),
      _haInputs: has("ha-input"),
      _haSelect: has("ha-select"),
      _haCheckbox: has("ha-checkbox"),
      _haSelector: has("ha-selector"),
      _haToggleGroup: has("ha-button-toggle-group"),
      _haDialog: has("ha-dialog"),
      _nativePickers: has("ha-date-input") && has("ha-time-input"),
    };
    const changed = Object.entries(next).some(([key, value]) => this[key] !== value);
    Object.assign(this, next);
    return changed;
  }

  // The trigger lives in the toolbar, so it is rebuilt rather than re-rendered.
  _syncMenuHost() {
    if (!this._menuHost) return;
    if (!this._nativeMenu) {
      if (!this._menuHost.firstElementChild) this._installFallbackMenu();
      return;
    }
    if (!this._dropdown || !this._dropdown.isConnected) {
      const trigger = this._trigger();
      trigger.setAttribute("slot", "trigger");
      const dropdown = document.createElement("ha-dropdown");
      dropdown.addEventListener("wa-select", (event) => {
        const value = event.detail?.item?.value;
        const entry = this._menuItems().find((item) => item.value === value);
        if (entry) entry.run();
      });
      dropdown.appendChild(trigger);
      this._dropdown = dropdown;
      this._menuHost.replaceChildren(dropdown);
    }
    this._updateMenu();
  }

  _trigger(className = "menu") {
    return this._iconButton({
      path: "overflow",
      label: _t(this._hass, "menu.title"),
      className,
    });
  }

  // One dot-menu, used by the toolbar and by every table row. Falls back to the
  // panel's own popup when Home Assistant's dropdown is not there.
  _dotMenu(trigger, items) {
    if (this._nativeMenu) {
      const dropdown = document.createElement("ha-dropdown");
      dropdown.addEventListener("wa-select", (event) => {
        const value = event.detail?.item?.value;
        const entry = items.find((item) => item.value === value);
        if (entry) entry.run();
      });
      trigger.setAttribute("slot", "trigger");
      dropdown.append(trigger, ...items.map((entry) => this._dropdownItem(entry)));
      return dropdown;
    }
    trigger.addEventListener("click", () => this._openAnchoredMenu(trigger, items));
    return trigger;
  }

  _dropdownItem(entry, clickable = false) {
    if (entry.divider) return document.createElement("wa-divider");
    const item = document.createElement("ha-dropdown-item");
    item.value = entry.value;
    if (entry.active) item.selected = true;
    if (entry.danger) item.setAttribute("variant", "danger");
    const glyph = icon(entry.icon);
    glyph.setAttribute("slot", "icon");
    item.append(glyph, document.createTextNode(entry.label));
    // Inside ha-dropdown the wa-select event runs the action; in a list there
    // is nothing above to hear it, so the item handles its own click.
    if (clickable && entry.run) item.addEventListener("click", () => entry.run());
    return item;
  }

  _installFallbackMenu() {
    const trigger = this._trigger();
    trigger.addEventListener("click", () => this._openMenu());
    this._menuHost.replaceChildren(trigger);
  }

  _updateMenu() {
    const items = this._menuItems();
    if (this._menuHost) this._menuHost.hidden = items.length === 0;
    if (!this._dropdown || !this._nativeMenu) return;
    this._dropdown.replaceChildren(
      this._dropdown.querySelector('[slot="trigger"]'),
      ...items.map((entry) => this._dropdownItem(entry))
    );
  }

  // Actions live here rather than on the cards, matching the todo panel: the
  // items are built on open, so they always match the current view.
  _openMenu() {
    const trigger = this._menuHost.querySelector("button");
    this._openAnchoredMenu(trigger, this._menuItems());
  }

  _openAnchoredMenu(anchor, items) {
    const close = () => backdrop.remove();
    const popup = h(
      "div",
      { class: "menu-popup", role: "menu" },
      ...items.map((item) =>
        item.divider
          ? h("div", { class: "menu-divider" })
          : h(
              "button",
              {
                class: `menu-item ${item.danger ? "danger" : ""} ${item.active ? "active" : ""}`,
                role: "menuitem",
                "aria-current": item.active ? "true" : null,
                onClick: () => {
                  close();
                  item.run();
                },
              },
              icon(item.icon),
              h("span", { text: item.label })
            )
      )
    );
    const backdrop = h(
      "div",
      {
        class: "menu-backdrop",
        onClick: close,
        onKeydown: (event) => {
          if (event.key === "Escape") close();
        },
      },
      popup
    );
    this._dialogs.append(backdrop);
    this._placeMenu(popup, anchor);
    // Focus the surface rather than the first item: focusing an item draws a
    // focus ring over the selected row, which the real dropdown does not show
    // when it was opened with a pointer. Tab still walks into the items.
    popup.tabIndex = -1;
    popup.focus();
  }

  _placeMenu(popup, anchor) {
    if (!anchor || !anchor.getBoundingClientRect) return;
    const rect = anchor.getBoundingClientRect();
    const width = popup.offsetWidth;
    const height = popup.offsetHeight;
    popup.classList.add("anchored");

    // Left edge under the trigger, pulled back only when that would overflow.
    // Row menus sit at the right of the table and end up right-aligned anyway.
    const left = Math.min(rect.left, window.innerWidth - width - 8);
    popup.style.left = `${Math.max(8, left)}px`;

    // A trigger in the toolbar opens below the whole bar, not overlapping it.
    const bar = anchor.closest(".toolbar");
    const below = Math.max(rect.bottom + 4, bar ? bar.getBoundingClientRect().bottom : 0);
    const fitsBelow = window.innerHeight - below > height + 8;
    popup.style.top = fitsBelow ? `${below}px` : `${Math.max(8, rect.top - height - 4)}px`;
  }

  _menuItems() {
    if (this._view === "closed") {
      return [
        {
          value: "closed-add",
          icon: "plus",
          label: _t(this._hass, "closed.add"),
          run: () => this._editClosedDay(null),
        },
        {
          value: "ics-import",
          icon: "upload",
          label: _t(this._hass, "import.section"),
          run: () => this._openImportDialog(),
        },
      ];
    }
    if (this._view === "settings") {
      return [
        {
          value: "default-period-add",
          icon: "plus",
          label: _t(this._hass, "timetable.add_period"),
          run: () => this._editDefaultPeriod(null),
        },
      ];
    }
    if (this._view !== "kid") return [];

    const items = [
      { value: "kid-add", icon: "plus", label: _t(this._hass, "kids.add_title"), run: () => this._addKid() },
    ];
    const kid = this._kid();
    if (!kid) return items;

    items.push(
      {
        value: "kid-edit",
        icon: "pencil",
        label: _t(this._hass, "kids.rename_title"),
        run: () => this._renameKid(kid),
      },
      {
        value: "kid-delete",
        icon: "delete",
        danger: true,
        label: _t(this._hass, "kids.delete_title"),
        run: () => this._deleteKid(kid),
      },
      { divider: true },
      {
        value: "timetable-add",
        icon: "plus",
        label: _t(this._hass, "timetable.add_title"),
        run: () => this._addTimetable(kid),
      }
    );

    const timetable = this._timetable();
    if (timetable) {
      items.push(
        {
          value: "timetable-edit",
          icon: "pencil",
          label: _t(this._hass, "timetable.edit_title"),
          run: () => this._editTimetableDetails(kid, timetable),
        },
        {
          value: "timetable-delete",
          icon: "delete",
          danger: true,
          label: _t(this._hass, "timetable.delete_title"),
          run: () => this._deleteTimetable(kid, timetable),
        }
      );
    }

    items.push(
      { divider: true },
      {
        value: "day-off-add",
        icon: "plus",
        label: _t(this._hass, "days_off.add"),
        run: () => this._editDayOff(kid, null),
      }
    );
    return items;
  }

  _title() {
    const lang = ((this._hass && this._hass.language) || "en").split("-")[0];
    return lang === "de" ? "Stundenplan" : "School Timetable";
  }

  _render() {
    if (!this.shadowRoot || !this._hass) return;
    this._ensureShell();

    if (this._error) {
      this._main.replaceChildren(
        h("div", { class: "card" }, h("p", { class: "status error", text: this._error }))
      );
      return;
    }
    if (!this._data) {
      this._main.replaceChildren(
        h("div", { class: "card" }, h("p", { class: "status", text: _t(this._hass, "common.loading") }))
      );
      return;
    }

    this._syncMenuHost();
    const narrow = this._isNarrow();
    this._sidebarToggle.hidden = !narrow;
    this._syncSidebarToggle(narrow);
    this._titleHost.classList.toggle("with-icon", narrow);
    this._titleHost.classList.toggle("picker", narrow);
    this._titleHost.replaceChildren(
      narrow ? this._renderViewPicker() : document.createTextNode(this._title())
    );
    this._main.replaceChildren(
      h(
        "div",
        { class: "layout" },
        narrow ? null : this._renderNav(),
        h(
          "div",
          { class: "view" },
          h(
            "div",
            { class: "view-inner" },
            ...this._renderView(),
            ...(this._status
              ? [h("p", { class: `status ${this._status.kind}`, text: this._status.text })]
              : [])
          )
        )
      )
    );
  }

  _renderView() {
    if (this._view === "closed") return this._renderClosedView();
    if (this._view === "settings") return this._renderSettingsView();
    return this._renderKidView();
  }

  _show(view, kidId) {
    this._view = view;
    if (kidId !== undefined) {
      this._kidId = kidId;
      this._timetableId = null;
    }
    this._render();
  }

  _navItems() {
    const items = this._data.kids.map((kid) => ({
      value: `kid:${kid.id}`,
      icon: "account",
      label: kid.name,
      active: this._view === "kid" && this._kidId === kid.id,
      run: () => this._show("kid", kid.id),
    }));
    items.push(
      { divider: true },
      {
        value: "nav-kid-add",
        icon: "plus",
        label: _t(this._hass, "kids.add"),
        run: () => this._addKid(),
      },
      {
        value: "nav-closed",
        icon: "calendar",
        label: _t(this._hass, "nav.closed"),
        active: this._view === "closed",
        run: () => this._show("closed"),
      },
      {
        value: "nav-settings",
        icon: "cog",
        label: _t(this._hass, "nav.settings"),
        active: this._view === "settings",
        run: () => this._show("settings"),
      }
    );
    return items;
  }

  _viewLabel() {
    const item = this._navItems().find((entry) => entry.active);
    return item ? item.label : this._title();
  }

  // Narrow screens lose the pane and pick the view from the toolbar instead.
  // Built like the todo panel's list picker: an ha-button in the dropdown's
  // trigger slot, with the chevron in the button's end slot.
  // ha-menu-button is what every Home Assistant panel puts here; it wants hass
  // and narrow and does the toggling itself.
  _syncSidebarToggle(narrow) {
    if (!narrow || this._sidebarToggle.dataset.kind === (this._haMenuButton ? "ha" : "own")) {
      if (this._sidebarToggle.firstElementChild && this._haMenuButton) {
        this._sidebarToggle.firstElementChild.hass = this._hass;
        this._sidebarToggle.firstElementChild.narrow = true;
      }
      if (this._sidebarToggle.firstElementChild) return;
    }
    if (this._haMenuButton) {
      const button = document.createElement("ha-menu-button");
      button.hass = this._hass;
      button.narrow = true;
      this._sidebarToggle.dataset.kind = "ha";
      this._sidebarToggle.replaceChildren(button);
      return;
    }
    const own = h("button", {
      class: "menu",
      title: "Menu",
      onClick: () =>
        this.dispatchEvent(new CustomEvent("hass-toggle-menu", { bubbles: true, composed: true })),
    });
    own.innerHTML = SVG_MENU;
    this._sidebarToggle.dataset.kind = "own";
    this._sidebarToggle.replaceChildren(own);
  }

  _renderViewPicker() {
    const chevron = icon("chevron");
    chevron.setAttribute("slot", "end");
    let trigger;
    if (this._haButton) {
      // No appearance attribute, so it renders as the todo panel's picker does.
      trigger = document.createElement("ha-button");
      trigger.className = "view-picker";
      trigger.append(h("div", { text: this._viewLabel() }), chevron);
    } else {
      trigger = h(
        "button",
        { class: "view-picker" },
        h("span", { text: this._viewLabel() }),
        chevron
      );
    }
    return this._dotMenu(trigger, this._navItems());
  }

  _renderNav() {
    const entries = this._navItems();
    const isKid = (entry) => Boolean(entry.value && entry.value.startsWith("kid:"));
    const row = (entry) =>
      h(
        "button",
        {
          class: "nav-item",
          "aria-current": entry.active ? "page" : null,
          onClick: entry.run,
        },
        icon(entry.icon),
        h("span", { text: entry.label })
      );

    // The todo panel's pane is an ha-list of the same items its picker uses.
    const group = (items, className) => {
      if (this._haList) {
        const list = document.createElement("ha-list");
        list.setAttribute("activatable", "");
        list.className = className;
        list.append(...items.map((entry) => this._dropdownItem(entry, true)));
        return list;
      }
      return h("div", { class: className }, ...items.map(row));
    };

    return h(
      "div",
      { class: "nav" },
      group(entries.filter(isKid), "nav-kids"),
      group(
        entries.filter((entry) => !entry.divider && !isKid(entry)),
        "nav-bottom"
      )
    );
  }

  _renderSettingsView() {
    const periods = (this._data.settings && this._data.settings.default_periods) || [];
    const rows = periods.map((period, index) =>
      h(
        "tr",
        {},
        h(
          "td",
          { class: "grow" },
          this._button({
            label: `${fmtTime(this._hass, period.start)} – ${fmtTime(this._hass, period.end)}`,
            className: "link",
            appearance: "plain",
            onClick: () => this._editDefaultPeriod(index),
          })
        ),
        h(
          "td",
          { class: "row-actions" },
          this._rowMenu(
            () => this._editDefaultPeriod(index),
            () => this._deleteDefaultPeriod(index)
          )
        )
      )
    );

    return [
      h(
        "div",
        { class: "card" },
        h("h2", { text: _t(this._hass, "settings.default_times") }),
        h("p", { class: "hint", text: _t(this._hass, "settings.hint") }),
        rows.length
          ? h("div", { class: "scroll" }, h("table", {}, h("tbody", {}, ...rows)))
          : h("p", { class: "empty", text: _t(this._hass, "timetable.no_periods") })
      ),
      this._renderFab(_t(this._hass, "timetable.add_period"), () => this._editDefaultPeriod(null)),
    ];
  }

  _rowMenu(onEdit, onDelete) {
    return this._dotMenu(this._trigger("row-menu"), [
      { value: "edit", icon: "pencil", label: _t(this._hass, "common.edit"), run: onEdit },
      {
        value: "delete",
        icon: "delete",
        danger: true,
        label: _t(this._hass, "common.delete"),
        run: onDelete,
      },
    ]);
  }

  _defaultPeriods() {
    return ((this._data.settings && this._data.settings.default_periods) || []).map((period) => ({
      ...period,
    }));
  }

  async _editDefaultPeriod(index) {
    const periods = this._defaultPeriods();
    const values = await this._periodDialog(periods, index);
    if (!values) return;
    if (values.__deleted) periods.splice(index, 1);
    else if (index === null) periods.push({ start: values.start, end: values.end });
    else Object.assign(periods[index], { start: values.start, end: values.end });
    await this._saveDefaultPeriods(periods);
  }

  async _deleteDefaultPeriod(index) {
    const periods = this._defaultPeriods();
    periods.splice(index, 1);
    await this._saveDefaultPeriods(periods);
  }

  async _saveDefaultPeriods(periods) {
    periods.sort((left, right) => left.start.localeCompare(right.start));
    await this._call({
      type: "school_timetable/settings/set",
      settings: {
        default_periods: periods.map((period, position) => ({
          period: position + 1,
          start: period.start,
          end: period.end,
        })),
      },
    });
  }

  // --- kids ------------------------------------------------------------

  _renderKidView() {
    const kid = this._kid();
    if (!kid) {
      return [
        h("div", { class: "card" }, h("p", { class: "empty", text: _t(this._hass, "kids.empty") })),
      ];
    }
    const toggle = h(
      "div",
      { class: "row toggle-row" },
      this._renderToggle(
        this._kidTab,
        [
          { value: "timetable", label: _t(this._hass, "tab.timetable") },
          { value: "days_off", label: _t(this._hass, "tab.days_off") },
        ],
        (value) => {
          this._kidTab = value;
          this._render();
        }
      )
    );
    const daysOff = this._kidTab === "days_off";
    return [
      toggle,
      daysOff ? this._renderDaysOffCard(kid) : this._renderTimetableCard(kid),
      this._renderFab(
        daysOff ? _t(this._hass, "days_off.add") : _t(this._hass, "timetable.add_title"),
        daysOff ? () => this._editDayOff(kid, null) : () => this._addTimetable(kid)
      ),
    ];
  }

  _renderFab(label, onClick) {
    return this._button({ label, className: "fab", icon: "plus", size: "l", onClick });
  }

  _renderToggle(active, options, onChange) {
    if (this._haToggleGroup) {
      const group = document.createElement("ha-button-toggle-group");
      group.className = "toggle";
      group.buttons = options.map((option) => ({ label: option.label, value: option.value }));
      group.active = active;
      group.addEventListener("value-changed", (event) => {
        event.stopPropagation();
        onChange(event.detail.value);
      });
      return group;
    }
    // Same thing by hand: brand buttons, accent for the active segment.
    return h(
      "div",
      { class: "toggle", role: "group" },
      ...options.map((option) => {
        const current = active === option.value;
        const button = this._button({
          label: option.label,
          className: "toggle-item",
          appearance: current ? "accent" : "filled",
          onClick: () => onChange(option.value),
        });
        button.setAttribute("aria-pressed", current ? "true" : "false");
        return button;
      })
    );
  }

  async _addKid() {
    const values = await this._formDialog({
      title: _t(this._hass, "kids.add_title"),
      fields: [{ key: "name", label: _t(this._hass, "common.name"), required: true }],
      submitLabel: _t(this._hass, "common.add"),
    });
    if (!values) return;
    const result = await this._call({ type: "school_timetable/kid/add", name: values.name });
    this._kidId = result.kid_id;
    this._timetableId = null;
  }

  async _renameKid(kid) {
    const values = await this._formDialog({
      title: _t(this._hass, "kids.rename_title"),
      fields: [{ key: "name", label: _t(this._hass, "common.name"), value: kid.name, required: true }],
      deletable: true,
    });
    if (!values) return;
    if (values.__deleted) {
      await this._deleteKid(kid);
      return;
    }
    await this._call({ type: "school_timetable/kid/rename", kid_id: kid.id, name: values.name });
  }

  async _deleteKid(kid) {
    if (!(await this._confirm(_t(this._hass, "kids.delete_confirm", { name: kid.name })))) return;
    await this._call({ type: "school_timetable/kid/delete", kid_id: kid.id });
    this._kidId = null;
  }

  // --- timetable -------------------------------------------------------

  _renderTimetableCard(kid) {
    const timetable = this._timetable();
    const select = this._select({
      value: timetable ? timetable.id : "",
      options: kid.timetables.map((entry) => ({
        value: entry.id,
        label: [
          entry.label,
          `${fmtDate(this._hass, entry.valid_from)} – ${
            entry.valid_to
              ? fmtDate(this._hass, entry.valid_to)
              : _t(this._hass, "timetable.open_ended")
          }`,
        ]
          .filter(Boolean)
          .join(" · "),
      })),
      onChange: (value) => {
        this._timetableId = value;
        this._render();
      },
    });

    const head = h(
      "div",
      { class: "row spread" },
      h("h2", { text: kid.name }),
      kid.timetables.length ? select : null
    );

    if (!timetable) {
      return h(
        "div",
        { class: "card" },
        head,
        h("p", { class: "empty", text: _t(this._hass, "timetable.empty") })
      );
    }
    return h("div", { class: "card" }, head, ...this._renderWeek(kid, timetable));
  }

  // A week the shape of a calendar: weekdays across, periods down, and each
  // lesson an entry in its slot. Everything is edited in a dialog, so there is
  // nothing to save separately.
  _renderWeek(kid, timetable) {
    const weekdays = this._showWeekend ? [0, 1, 2, 3, 4, 5, 6] : [0, 1, 2, 3, 4];
    const periods = orderedPeriods(timetable);
    const lessonAt = (weekday, period) =>
      timetable.lessons.find(
        (lesson) => lesson.weekday === weekday && lesson.period === period.period
      );

    // A lesson covering more than one period leaves the slots underneath it
    // empty, the way a longer calendar entry does.
    const covered = new Set();
    periods.forEach((period, index) => {
      for (const day of weekdays) {
        const lesson = lessonAt(day, period);
        if (!lesson) continue;
        const span = Math.min(lessonSpan(lesson), periods.length - index);
        for (let step = 1; step < span; step++) covered.add(`${day}:${index + step}`);
      }
    });

    const cell = (weekday, period, index) => {
      if (covered.has(`${weekday}:${index}`)) return null;
      const lesson = lessonAt(weekday, period);
      const span = lesson ? Math.min(lessonSpan(lesson), periods.length - index) : 1;
      const button = h(
        "button",
        {
          class: lesson ? "cal-entry" : "cal-slot",
          "aria-label": lesson
            ? lesson.subject
            : `${_t(this._hass, `weekday.${weekday}`)} ${fmtTime(this._hass, period.start)}`,
          onClick: () => this._editLesson(kid, timetable, weekday, period),
        },
        lesson ? h("span", { class: "cal-subject", text: lesson.subject }) : icon("plus")
      );
      if (lesson) button.style.setProperty("--st-subject", subjectColor(lesson.subject));
      const td = h("td", { class: "cal-cell" }, button);
      if (span > 1) td.setAttribute("rowspan", String(span));
      return td;
    };

    const grid = periods.length
      ? h(
          "div",
          { class: "scroll" },
          h(
            "table",
            { class: "cal" },
            h(
              "thead",
              {},
              h(
                "tr",
                {},
                h("th", { class: "cal-times" }),
                ...weekdays.map((day) => h("th", { text: _t(this._hass, `weekday.${day}`) }))
              )
            ),
            h(
              "tbody",
              {},
              ...periods.map((period, index) =>
                h(
                  "tr",
                  {},
                  h(
                    "td",
                    { class: "cal-times" },
                    this._button({
                      label: `${fmtTime(this._hass, period.start)} – ${fmtTime(
                        this._hass,
                        period.end
                      )}`,
                      className: "link",
                      appearance: "plain",
                      onClick: () => this._editPeriod(kid, timetable, index),
                    })
                  ),
                  ...weekdays.map((day) => cell(day, period, index))
                )
              )
            )
          )
        )
      : h("p", { class: "empty", text: _t(this._hass, "timetable.no_periods") });

    return [
      h(
        "div",
        { class: "row spread" },
        h("h3", { text: _t(this._hass, "timetable.lessons") }),
        this._checkbox({
          checked: this._showWeekend,
          label: _t(this._hass, "timetable.show_weekend"),
          onChange: (checked) => {
            this._showWeekend = checked;
            this._render();
          },
        })
      ),
      grid,
      h(
        "div",
        { class: "row" },
        this._button({
          label: _t(this._hass, "timetable.add_period"),
          appearance: "filled",
          onClick: () => this._editPeriod(kid, timetable, null),
        })
      ),
    ];
  }

  async _editLesson(kid, timetable, weekday, period) {
    const existing = timetable.lessons.find(
      (lesson) => lesson.weekday === weekday && lesson.period === period.period
    );
    const periods = orderedPeriods(timetable);
    const index = periods.findIndex((entry) => entry.period === period.period);

    // A lesson may grow until the day runs out or another lesson is in the way.
    let reach = periods.length - index;
    for (let step = 1; step < reach; step++) {
      const next = periods[index + step];
      const blocked = timetable.lessons.some(
        (lesson) =>
          lesson !== existing && lesson.weekday === weekday && lessonCovers(lesson, next.period)
      );
      if (blocked) {
        reach = step;
        break;
      }
    }
    const spans = Array.from({ length: reach }, (_, offset) => {
      const last = periods[index + offset];
      return {
        value: String(offset + 1),
        label: `${fmtTime(this._hass, period.start)} – ${fmtTime(this._hass, last.end)}`,
      };
    });

    const values = await this._formDialog({
      title: `${_t(this._hass, `weekday.${weekday}`)} · ${fmtTime(
        this._hass,
        period.start
      )} – ${fmtTime(this._hass, period.end)}`,
      fields: [
        {
          key: "subject",
          label: _t(this._hass, "timetable.subject"),
          value: existing ? existing.subject : "",
          required: !existing,
        },
        ...(spans.length > 1
          ? [
              {
                key: "span",
                label: _t(this._hass, "timetable.duration"),
                type: "select",
                options: spans,
                value: String(existing ? Math.min(lessonSpan(existing), reach) : 1),
              },
            ]
          : []),
      ],
      deletable: Boolean(existing),
    });
    if (!values) return;

    const lessons = timetable.lessons.filter(
      (lesson) => !(lesson.weekday === weekday && lesson.period === period.period)
    );
    // An empty subject clears the slot, same as pressing delete.
    if (!values.__deleted && values.subject) {
      lessons.push({
        weekday,
        period: period.period,
        subject: values.subject,
        week: existing ? existing.week : "every",
        span: Math.max(1, Number(values.span) || 1),
      });
    }
    await this._saveTimetable(kid, timetable, { lessons });
  }

  async _editPeriod(kid, timetable, index) {
    const periods = [...timetable.periods]
      .sort((left, right) => left.start.localeCompare(right.start))
      .map((period) => ({ ...period }));
    const values = await this._periodDialog(periods, index);
    if (!values) return;

    if (values.__deleted) periods.splice(index, 1);
    else if (index === null) periods.push({ period: null, start: values.start, end: values.end });
    else Object.assign(periods[index], { start: values.start, end: values.end });

    await this._savePeriods(kid, timetable, periods);
  }

  _periodDialog(periods, index) {
    const existing = index === null ? null : periods[index];
    const last = periods[periods.length - 1];
    const start = existing ? existing.start : last ? addMinutes(last.end, 5) : "08:00";
    return this._formDialog({
      title: _t(this._hass, "timetable.period"),
      fields: [
        {
          key: "start",
          label: _t(this._hass, "timetable.start"),
          type: "time",
          value: start,
          required: true,
        },
        {
          key: "end",
          label: _t(this._hass, "timetable.end"),
          type: "time",
          value: existing ? existing.end : addMinutes(start, 45),
          required: true,
        },
      ],
      deletable: existing !== null,
      validate: (input) => this._validatePeriod(periods, input, index),
    });
  }

  _validatePeriod(periods, { start, end }, index) {
    // "HH:MM" compares correctly as a string, which is why times are stored that way.
    if (end <= start) return _t(this._hass, "timetable.end_before_start");
    const clashes = periods.some(
      (period, position) => position !== index && start < period.end && end > period.start
    );
    return clashes ? _t(this._hass, "timetable.overlap") : null;
  }

  // Periods are numbered by their place in the day, so editing a time can
  // renumber them. Lessons follow the period they were on.
  async _savePeriods(kid, timetable, rows) {
    const ordered = [...rows].sort((left, right) => left.start.localeCompare(right.start));
    const renumbered = ordered.map((row, position) => ({
      period: position + 1,
      start: row.start,
      end: row.end,
    }));
    const moved = new Map();
    ordered.forEach((row, position) => {
      if (row.period) moved.set(row.period, position + 1);
    });
    const lessons = timetable.lessons
      .filter((lesson) => moved.has(lesson.period))
      .map((lesson) => ({ ...lesson, period: moved.get(lesson.period) }));

    await this._saveTimetable(kid, timetable, { periods: renumbered, lessons });
  }

  async _saveTimetable(kid, timetable, changes) {
    await this._call({
      type: "school_timetable/timetable/save",
      kid_id: kid.id,
      timetable: {
        id: timetable.id,
        label: timetable.label,
        valid_from: timetable.valid_from,
        valid_to: timetable.valid_to || null,
        periods: timetable.periods,
        lessons: timetable.lessons,
        ...changes,
      },
    });
  }

  async _addTimetable(kid) {
    const values = await this._formDialog({
      title: _t(this._hass, "timetable.add_title"),
      description: _t(this._hass, "timetable.new_hint"),
      fields: [
        {
          key: "label",
          label: _t(this._hass, "timetable.label"),
          required: true,
          placeholder: _t(this._hass, "timetable.label_placeholder"),
        },
        {
          key: "valid_from",
          label: _t(this._hass, "timetable.valid_from"),
          type: "date",
          value: todayIso(),
          required: true,
        },
        { key: "valid_to", label: _t(this._hass, "timetable.valid_to"), type: "date" },
      ],
      submitLabel: _t(this._hass, "common.add"),
    });
    if (!values) return;
    const result = await this._call({
      type: "school_timetable/timetable/save",
      kid_id: kid.id,
      // No periods key at all: the store seeds the configured defaults.
      timetable: {
        label: values.label,
        valid_from: values.valid_from,
        valid_to: values.valid_to || null,
      },
    });
    this._timetableId = result.timetable_id;
  }

  async _editTimetableDetails(kid, timetable) {
    const values = await this._formDialog({
      title: _t(this._hass, "timetable.edit_title"),
      fields: [
        {
          key: "label",
          label: _t(this._hass, "timetable.label"),
          value: timetable.label,
          required: true,
          placeholder: _t(this._hass, "timetable.label_placeholder"),
        },
        {
          key: "valid_from",
          label: _t(this._hass, "timetable.valid_from"),
          type: "date",
          value: timetable.valid_from,
          required: true,
        },
        {
          key: "valid_to",
          label: _t(this._hass, "timetable.valid_to"),
          type: "date",
          value: timetable.valid_to || "",
        },
      ],
      deletable: true,
    });
    if (!values) return;
    if (values.__deleted) {
      await this._deleteTimetable(kid, timetable);
      return;
    }
    await this._saveTimetable(kid, timetable, {
      label: values.label,
      valid_from: values.valid_from,
      valid_to: values.valid_to || null,
    });
  }

  async _deleteTimetable(kid, timetable) {
    if (!(await this._confirm(_t(this._hass, "timetable.delete_confirm", { label: timetable.label }))))
      return;
    await this._call({
      type: "school_timetable/timetable/delete",
      kid_id: kid.id,
      timetable_id: timetable.id,
    });
    this._timetableId = null;
  }

  _renderDaysOffCard(kid) {
    const rows = kid.days_off.map((entry) =>
      h(
        "tr",
        {},
        h("td", { text: fmtDate(this._hass, entry.date) }),
        h("td", { class: "grow", text: entry.reason }),
        h(
          "td",
          { class: "row-actions" },
          this._rowMenu(
            () => this._editDayOff(kid, entry),
            () => this._saveDaysOff(kid, kid.days_off.filter((other) => other !== entry))
          )
        )
      )
    );

    return h(
      "div",
      { class: "card" },
      h("h2", { text: _t(this._hass, "days_off.section") }),
      h("p", { class: "hint", text: _t(this._hass, "days_off.hint") }),
      rows.length
        ? h(
            "div",
            { class: "scroll" },
            h(
              "table",
              {},
              h(
                "thead",
                {},
                h(
                  "tr",
                  {},
                  h("th", { text: _t(this._hass, "days_off.date") }),
                  h("th", { text: _t(this._hass, "days_off.reason") }),
                  h("th", {})
                )
              ),
              h("tbody", {}, ...rows)
            )
          )
        : h("p", { class: "empty", text: _t(this._hass, "days_off.empty") })
    );
  }

  async _editDayOff(kid, entry) {
    const values = await this._formDialog({
      title: _t(this._hass, "days_off.title"),
      fields: [
        {
          key: "date",
          label: _t(this._hass, "days_off.date"),
          type: "date",
          value: entry ? entry.date : todayIso(),
          required: true,
        },
        { key: "reason", label: _t(this._hass, "days_off.reason"), value: entry ? entry.reason : "" },
      ],
      deletable: entry !== null,
    });
    if (!values) return;
    const others = kid.days_off.filter((other) => other !== entry);
    if (values.__deleted) {
      await this._saveDaysOff(kid, others);
      return;
    }
    await this._saveDaysOff(kid, [...others, values]);
  }

  async _saveDaysOff(kid, entries) {
    await this._call({
      type: "school_timetable/kid/days_off",
      kid_id: kid.id,
      days_off: entries.map((entry) => ({ date: entry.date, reason: entry.reason || "" })),
    });
  }

  // --- holidays --------------------------------------------------------

  _renderClosedView() {
    const entries = this._data.closed_days;
    // Entries can disappear under a stale selection, for instance after an import.
    const ids = new Set(entries.map((entry) => entry.id));
    for (const id of [...this._selected]) {
      if (!ids.has(id)) this._selected.delete(id);
    }

    const toggle = (id, checked) => {
      if (checked) this._selected.add(id);
      else this._selected.delete(id);
      this._render();
    };

    const rows = entries.map((entry) =>
      h(
        "tr",
        {},
        h(
          "td",
          {},
          this._checkbox({
            checked: this._selected.has(entry.id),
            label: entry.name,
            bare: true,
            onChange: (checked) => toggle(entry.id, checked),
          })
        ),
        h("td", { class: "grow", text: entry.name }),
        h("td", { text: fmtDate(this._hass, entry.start) }),
        h("td", { text: fmtDate(this._hass, entry.end) }),
        h(
          "td",
          {},
          h("span", {
            class: "badge",
            text: _t(this._hass, entry.source === "ics" ? "closed.source_ics" : "closed.source_manual"),
          })
        ),
        h(
          "td",
          { class: "row-actions" },
          this._rowMenu(
            () => this._editClosedDay(entry),
            () => this._deleteClosedDay(entry)
          )
        )
      )
    );

    const allSelected = entries.length > 0 && this._selected.size === entries.length;
    const table = rows.length
      ? h(
          "div",
          { class: "scroll" },
          h(
            "table",
            {},
            h(
              "thead",
              {},
              h(
                "tr",
                {},
                h(
                  "th",
                  {},
                  this._checkbox({
                    checked: allSelected,
                    label: _t(this._hass, "closed.select_all"),
                    bare: true,
                    onChange: (checked) => {
                      this._selected = new Set(checked ? entries.map((entry) => entry.id) : []);
                      this._render();
                    },
                  })
                ),
                h("th", { text: _t(this._hass, "common.name") }),
                h("th", { text: _t(this._hass, "closed.start") }),
                h("th", { text: _t(this._hass, "closed.end") }),
                h("th", { text: _t(this._hass, "closed.source") }),
                h("th", {})
              )
            ),
            h("tbody", {}, ...rows)
          )
        )
      : h("p", { class: "empty", text: _t(this._hass, "closed.empty") });

    const selection = this._selected.size
      ? h(
          "div",
          { class: "row spread bulk" },
          h("span", {
            class: "status",
            text: _t(this._hass, "closed.selected", { count: this._selected.size }),
          }),
          h(
            "div",
            { class: "row" },
            this._button({
              label: _t(this._hass, "closed.replace_title"),
              appearance: "filled",
              onClick: () => this._replaceInSelected(),
            }),
            this._button({
              label: _t(this._hass, "closed.bulk_delete"),
              className: "danger",
              variant: "danger",
              appearance: "filled",
              onClick: () => this._deleteSelected(),
            })
          )
        )
      : null;

    const list = h(
      "div",
      { class: "card" },
      h("h2", { text: _t(this._hass, "closed.section") }),
      h("p", { class: "hint", text: _t(this._hass, "closed.hint") }),
      selection,
      table
    );

    return [
      list,
      this._renderFab(_t(this._hass, "closed.add"), () => this._editClosedDay(null)),
    ];
  }

  _openImportDialog() {
    const status = h("p", { class: "status error" });
    const file = h("input", { type: "file", accept: ".ics,text/calendar" });
    const url = this._textField({
      type: "url",
      label: _t(this._hass, "import.url"),
      placeholder: _t(this._hass, "import.url_placeholder"),
    });

    let surface;
    const submit = async () => {
      const address = url.read();
      const chosen = file.files && file.files[0];
      if (!address && !chosen) {
        status.textContent = _t(this._hass, "import.nothing_chosen");
        return;
      }
      surface.close();
      if (address) await this._import({ url: address });
      else await this._importFile(chosen);
    };

    surface = this._openDialogSurface({
      title: _t(this._hass, "import.section"),
      description: _t(this._hass, "import.hint"),
      onDismiss: () => {},
      actions: [
        {
          element: this._button({
            label: _t(this._hass, "common.cancel"),
            className: "dialog-cancel",
            appearance: "plain",
            onClick: () => surface.close(),
          }),
        },
        {
          primary: true,
          element: this._button({
            label: _t(this._hass, "import.button"),
            className: "dialog-submit",
            onClick: submit,
          }),
        },
      ],
    });

    surface.body.append(
      h("label", { class: "field" }, _t(this._hass, "import.file"), file),
      url.labelled ? url.element : h("label", { class: "field" }, _t(this._hass, "import.url"), url.element),
      status
    );
    file.focus();
  }

  async _importFile(file) {
    const content = await file.text();
    await this._import({ content });
  }

  async _import(payload) {
    this._setStatus(_t(this._hass, "import.running"));
    try {
      const result = await this._hass.callWS({ type: "school_timetable/ics/import", ...payload });
      this._setStatus(
        _t(this._hass, "import.result", { added: result.added, updated: result.updated })
      );
    } catch (err) {
      this._setStatus(
        _t(this._hass, "import.failed", { error: _errorText(this._hass, err) }),
        "error"
      );
    }
  }

  async _editClosedDay(entry) {
    const values = await this._formDialog({
      title: _t(this._hass, "closed.title"),
      fields: [
        { key: "name", label: _t(this._hass, "common.name"), value: entry ? entry.name : "", required: true },
        {
          key: "start",
          label: _t(this._hass, "closed.start"),
          type: "date",
          value: entry ? entry.start : todayIso(),
          required: true,
        },
        {
          key: "end",
          label: _t(this._hass, "closed.end"),
          type: "date",
          value: entry ? entry.end : todayIso(),
          required: true,
        },
      ],
      deletable: entry !== null,
    });
    if (!values) return;
    if (values.__deleted) {
      await this._deleteClosedDay(entry);
      return;
    }
    const next = this._data.closed_days.map((other) =>
      other === entry ? { ...other, ...values } : other
    );
    if (!entry) next.push({ ...values, source: "manual" });
    await this._saveClosedDays(next);
  }

  _selectedEntries() {
    return this._data.closed_days.filter((entry) => this._selected.has(entry.id));
  }

  async _deleteSelected() {
    const count = this._selected.size;
    if (!(await this._confirm(_t(this._hass, "closed.bulk_delete_confirm", { count })))) return;
    await this._saveClosedDays(
      this._data.closed_days.filter((entry) => !this._selected.has(entry.id))
    );
    this._selected = new Set();
    this._kidTab = "timetable";
    this._nativeMenu = false;
    this._haIconButton = false;
    this._haMenuButton = false;
    this._haList = false;
    this._haSelector = false;
    this._haToggleGroup = false;
    this._haDialog = false;
    this._nativePickers = false;
    this._haInputs = false;
    this._haSelect = false;
    this._haCheckbox = false;
    this._haButton = false;
  }

  async _replaceInSelected() {
    const values = await this._formDialog({
      title: _t(this._hass, "closed.replace_title"),
      description: _t(this._hass, "closed.replace_hint"),
      fields: [
        { key: "search", label: _t(this._hass, "closed.search"), required: true },
        { key: "replace", label: _t(this._hass, "closed.replace_with") },
      ],
    });
    if (!values) return;

    let changed = 0;
    const next = this._data.closed_days.map((entry) => {
      if (!this._selected.has(entry.id) || !entry.name.includes(values.search)) return entry;
      changed += 1;
      return { ...entry, name: entry.name.split(values.search).join(values.replace) };
    });
    if (!changed) {
      this._setStatus(_t(this._hass, "closed.replace_none"));
      return;
    }
    await this._saveClosedDays(next);
    this._setStatus(_t(this._hass, "closed.replaced", { count: changed }));
  }

  async _deleteClosedDay(entry) {
    if (!(await this._confirm(_t(this._hass, "closed.delete_confirm", { name: entry.name })))) return;
    await this._saveClosedDays(this._data.closed_days.filter((other) => other !== entry));
  }

  async _saveClosedDays(entries) {
    await this._call({
      type: "school_timetable/closed_days/set",
      closed_days: entries.map((entry) => ({
        id: entry.id || null,
        name: entry.name,
        start: entry.start,
        end: entry.end,
        source: entry.source || "manual",
        uid: entry.uid || null,
      })),
    });
  }
}

// Adds minutes to an `HH:MM` string, used when appending a period.
function addMinutes(time, minutes) {
  const [hours, mins] = (time || "08:00").split(":").map(Number);
  const total = (hours * 60 + mins + minutes) % (24 * 60);
  const pad = (value) => String(value).padStart(2, "0");
  return `${pad(Math.floor(total / 60))}:${pad(total % 60)}`;
}

customElements.define("school-timetable-panel", SchoolTimetablePanel);
console.info(`%c SCHOOL-TIMETABLE %c ${PANEL_VERSION} `, "color: #fff; background: #039be5", "");
