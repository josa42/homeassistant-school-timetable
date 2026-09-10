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

// Home Assistant only ships a fixed set of translation categories to the
// frontend, and a custom key like `panel.*` is not one of them, so
// hass.localize would always miss. The table below is the real source; the
// localize call stays in front of it in case that ever changes.
const STRINGS = {
  en: {
    "nav.kids": "Kids",
    "nav.closed": "Holidays",
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
    "kids.rename_title": "Rename kid",
    "kids.delete_title": "Delete kid",
    "menu.title": "Actions",
    "kids.empty": "No kids yet. Add one to get started.",
    "kids.delete_confirm": "Delete {name} and their timetables? The calendar entity is removed too.",
    "timetable.section": "Timetables",
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
    "timetable.unsaved": "Unsaved changes",
    "timetable.period": "Period",
    "timetable.edit_period": "Edit times",
    "timetable.start": "Start",
    "timetable.end": "End",
    "timetable.add_period": "Add period",
    "timetable.overlap": "This overlaps another period.",
    "timetable.range_overlap": "This date range overlaps another timetable.",
    "timetable.end_before_start": "The end must be after the start.",
    "timetable.lessons": "Lessons",
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
    "import.section": "Import ICS",
    "import.hint": "Imported holidays become normal rows you can edit. Importing the same file again updates them and leaves manual entries alone.",
    "import.file": "Choose file",
    "import.url": "…or paste a URL",
    "import.url_placeholder": "https://example.org/ferien.ics",
    "import.button": "Import",
    "import.running": "Importing…",
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
    "nav.kids": "Kinder",
    "nav.closed": "Ferien",
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
    "kids.rename_title": "Kind umbenennen",
    "kids.delete_title": "Kind löschen",
    "menu.title": "Aktionen",
    "kids.empty": "Noch keine Kinder. Lege eines an, um zu starten.",
    "kids.delete_confirm": "{name} und alle Stundenpläne löschen? Der Kalender wird mit entfernt.",
    "timetable.section": "Stundenpläne",
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
    "timetable.unsaved": "Nicht gespeicherte Änderungen",
    "timetable.period": "Stunde",
    "timetable.edit_period": "Zeiten bearbeiten",
    "timetable.start": "Beginn",
    "timetable.end": "Ende",
    "timetable.add_period": "Stunde hinzufügen",
    "timetable.overlap": "Überschneidet sich mit einer anderen Stunde.",
    "timetable.range_overlap": "Der Zeitraum überschneidet sich mit einem anderen Stundenplan.",
    "timetable.end_before_start": "Das Ende muss nach dem Beginn liegen.",
    "timetable.lessons": "Fächer",
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
    "import.section": "ICS importieren",
    "import.hint": "Importierte Einträge werden normale, bearbeitbare Zeilen. Ein erneuter Import derselben Datei aktualisiert sie und lässt manuelle Einträge unberührt.",
    "import.file": "Datei wählen",
    "import.url": "…oder URL einfügen",
    "import.url_placeholder": "https://example.org/ferien.ics",
    "import.button": "Importieren",
    "import.running": "Wird importiert…",
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
  overlap: "timetable.range_overlap",
  unauthorized: "error.invalid_auth",
};

function _errorText(hass, err) {
  const code = err && typeof err === "object" ? err.code : err;
  if (WS_ERROR_CODES[code]) return _t(hass, WS_ERROR_CODES[code]);
  if (err && typeof err === "object" && err.message) return err.message;
  return _t(hass, "error.unknown");
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

function _formatLanguage(hass, setting) {
  if (setting === "system") return undefined;
  const locale = (hass && hass.locale) || {};
  return locale.language || (hass && hass.language) || "en";
}

function _usesAmPm(hass) {
  const setting = ((hass && hass.locale) || {}).time_format;
  if (setting === "12") return true;
  if (setting === "24") return false;
  const language = _formatLanguage(hass, setting);
  return (
    _cachedFormat(`probe:${language}`, () =>
      new Intl.DateTimeFormat(language, { hour: "numeric" })
    ).resolvedOptions().hour12 === true
  );
}

function fmtDate(hass, iso) {
  if (!iso) return "";
  const parts = iso.split("-").map(Number);
  const date = new Date(parts[0], parts[1] - 1, parts[2]);
  const setting = ((hass && hass.locale) || {}).date_format;
  const language = _formatLanguage(hass, setting);
  const numeric = { day: "2-digit", month: "2-digit", year: "numeric" };
  return _cachedFormat(`date:${setting}:${language}`, () => {
    switch (setting) {
      case "DMY":
        return new Intl.DateTimeFormat("en-GB", numeric);
      case "MDY":
        return new Intl.DateTimeFormat("en-US", numeric);
      case "YMD":
        return new Intl.DateTimeFormat("sv-SE", numeric);
      default:
        return new Intl.DateTimeFormat(language, {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
    }
  }).format(date);
}

function fmtTime(hass, value) {
  if (!value) return "";
  const [hours, minutes] = value.split(":").map(Number);
  const setting = ((hass && hass.locale) || {}).time_format;
  const language = _formatLanguage(hass, setting);
  const amPm = _usesAmPm(hass);
  return _cachedFormat(`time:${language}:${amPm}`, () =>
    new Intl.DateTimeFormat(
      language,
      amPm
        ? { hour: "numeric", minute: "2-digit", hour12: true }
        : { hour: "2-digit", minute: "2-digit", hourCycle: "h23" }
    )
  ).format(new Date(2000, 0, 1, hours, minutes));
}

function todayIso() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

const STYLE = `
  :host {
    display: block;
    height: 100%;
    background: var(--primary-background-color, #f5f5f5);
    color: var(--primary-text-color, #212121);
    font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif);
    --st-gap: 16px;
  }
  .toolbar {
    display: flex;
    align-items: center;
    gap: 8px;
    height: var(--header-height, 56px);
    padding: 0 12px;
    background: var(--app-header-background-color, var(--primary-color, #03a9f4));
    color: var(--app-header-text-color, #fff);
    font-size: 20px;
    font-weight: 400;
    box-sizing: border-box;
  }
  .menu {
    border: 0;
    background: none;
    color: inherit;
    cursor: pointer;
    padding: 8px;
    border-radius: 50%;
    line-height: 0;
  }
  .menu:hover { background: rgba(255, 255, 255, 0.12); }
  .content { height: calc(100% - var(--header-height, 56px)); }
  .layout { display: flex; align-items: stretch; height: 100%; }
  .nav {
    flex: 0 0 220px;
    display: flex;
    flex-direction: column;
    background: var(--card-background-color, #fff);
    border-right: 1px solid var(--divider-color, #e0e0e0);
  }
  .nav-kids { flex: 1; overflow-y: auto; padding: 8px; display: flex; flex-direction: column; gap: 2px; }
  .nav-bottom {
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    border-top: 1px solid var(--divider-color, #e0e0e0);
  }
  .nav-label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--secondary-text-color, #727272);
    margin: 4px 12px 6px;
  }
  .nav-item {
    text-align: left;
    border: 0;
    background: none;
    border-radius: 8px;
    padding: 10px 12px;
    font-size: 14px;
  }
  .nav-item:hover { background: var(--secondary-background-color, #e5e5e5); }
  .nav-item[aria-current="page"] {
    background: var(--primary-color, #03a9f4);
    color: var(--text-primary-color, #fff);
  }
  .view { flex: 1; min-width: 0; overflow-y: auto; padding: var(--st-gap); }
  .view-inner { max-width: 1100px; margin: 0 auto; }
  @media (max-width: 700px) {
    .layout { flex-direction: column; height: auto; }
    .nav { flex: none; flex-direction: row; border-right: 0;
      border-bottom: 1px solid var(--divider-color, #e0e0e0); }
    .nav-kids, .nav-bottom { flex-direction: row; overflow-x: auto; border-top: 0; }
    .nav-label { display: none; }
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
  .menu-popup {
    position: fixed;
    top: calc(var(--header-height, 56px) + 4px);
    right: 8px;
    min-width: 230px;
    padding: 6px;
    display: flex;
    flex-direction: column;
    background: var(--card-background-color, #fff);
    border-radius: var(--ha-card-border-radius, 12px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.24);
  }
  .menu-item {
    text-align: left;
    border: 0;
    background: none;
    border-radius: 8px;
    padding: 10px 12px;
    font-size: 14px;
  }
  .menu-item:hover { background: var(--secondary-background-color, #e5e5e5); }
  .menu-item.danger { color: var(--error-color, #db4437); }
  .view-title { font-size: 22px; font-weight: 400; margin: 0 0 var(--st-gap); }
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
  .dialog .actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 4px; }
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
    this._draft = null;
    this._dirty = false;
    this._showWeekend = false;
    this._status = null;
    this._subscribing = false;
    this._unsub = null;
  }

  set hass(hass) {
    const first = !this._hass;
    this._hass = hass;
    if (first) {
      this._subscribe();
      this._render();
    }
  }

  set narrow(value) {
    this._narrow = value;
  }

  set panel(value) {
    this._panel = value;
  }

  connectedCallback() {
    if (this._hass && !this._unsub && !this._subscribing) this._subscribe();
    this._render();
  }

  disconnectedCallback() {
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

  _confirm(text) {
    return new Promise((resolve) => {
      const close = (result) => {
        backdrop.remove();
        resolve(result);
      };
      const dialog = h(
        "div",
        { class: "dialog", role: "alertdialog" },
        h("div", { text }),
        h(
          "div",
          { class: "actions" },
          h("button", { text: _t(this._hass, "common.cancel"), onClick: () => close(false) }),
          h("button", {
            class: "primary",
            text: _t(this._hass, "common.delete"),
            onClick: () => close(true),
          })
        )
      );
      const backdrop = h(
        "div",
        {
          class: "backdrop",
          onClick: (event) => {
            if (event.target === backdrop) close(false);
          },
          onKeydown: (event) => {
            if (event.key === "Escape") close(false);
            if (event.key === "Enter") close(true);
          },
        },
        dialog
      );
      this._dialogs.append(backdrop);
      dialog.querySelector("button.primary").focus();
    });
  }

  _formDialog({ title, description, fields, submitLabel, validate, deletable }) {
    return new Promise((resolve) => {
      const inputs = {};
      const error = h("p", { class: "status error" });
      const close = (result) => {
        backdrop.remove();
        resolve(result);
      };
      const submit = () => {
        const values = {};
        for (const field of fields) {
          const value = inputs[field.key].value.trim();
          if (field.required && !value) {
            inputs[field.key].focus();
            return;
          }
          values[field.key] = value;
        }
        const message = validate ? validate(values) : null;
        if (message) {
          error.textContent = message;
          return;
        }
        close(values);
      };
      const body = fields.map((field) => {
        const input = h("input", {
          type: field.type || "text",
          value: field.value || "",
          placeholder: field.placeholder || "",
        });
        inputs[field.key] = input;
        return h("label", { class: "field" }, field.label, input);
      });
      const dialog = h(
        "div",
        { class: "dialog", role: "dialog" },
        h("h2", { text: title }),
        description ? h("p", { class: "hint", text: description }) : null,
        ...body,
        error,
        h(
          "div",
          { class: "actions" },
          deletable
            ? h("button", {
                class: "danger",
                style: "margin-right: auto",
                text: _t(this._hass, "common.delete"),
                onClick: () => close({ __deleted: true }),
              })
            : null,
          h("button", { text: _t(this._hass, "common.cancel"), onClick: () => close(null) }),
          h("button", {
            class: "primary",
            text: submitLabel || _t(this._hass, "common.save"),
            onClick: submit,
          })
        )
      );
      const backdrop = h(
        "div",
        {
          class: "backdrop",
          onClick: (event) => {
            if (event.target === backdrop) close(null);
          },
          onKeydown: (event) => {
            if (event.key === "Escape") close(null);
            if (event.key === "Enter") submit();
          },
        },
        dialog
      );
      this._dialogs.append(backdrop);
      const firstInput = fields.length ? inputs[fields[0].key] : null;
      if (firstInput) firstInput.focus();
    });
  }

  // --- shell -----------------------------------------------------------

  _ensureShell() {
    if (this._main) return;
    const menu = h("button", {
      class: "menu",
      title: "Menu",
      onClick: () =>
        this.dispatchEvent(new CustomEvent("hass-toggle-menu", { bubbles: true, composed: true })),
    });
    menu.innerHTML = SVG_MENU;
    const overflow = h("button", {
      class: "menu",
      title: _t(this._hass, "menu.title"),
      onClick: () => this._openMenu(),
    });
    overflow.innerHTML = SVG_OVERFLOW;
    this._main = h("div", { class: "content" });
    this._dialogs = h("div");
    this.shadowRoot.replaceChildren(
      h("style", { text: STYLE }),
      h(
        "div",
        { class: "toolbar" },
        menu,
        h("div", { class: "grow", text: this._title() }),
        overflow
      ),
      this._main,
      this._dialogs
    );
  }

  // Actions live here rather than on the cards, matching the todo panel: the
  // items are built on open, so they always match the current view.
  _openMenu() {
    const close = () => backdrop.remove();
    const popup = h(
      "div",
      { class: "menu-popup", role: "menu" },
      ...this._menuItems().map((item) =>
        h("button", {
          class: `menu-item ${item.danger ? "danger" : ""}`,
          role: "menuitem",
          text: item.label,
          onClick: () => {
            close();
            item.run();
          },
        })
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
    const first = popup.querySelector("button");
    if (first) first.focus();
  }

  _menuItems() {
    const items = [
      { label: _t(this._hass, "kids.add_title"), run: () => this._addKid() },
    ];
    const kid = this._view === "kid" ? this._kid() : null;
    if (!kid) return items;

    const timetable = this._timetable();
    items.push(
      { label: _t(this._hass, "kids.rename_title"), run: () => this._renameKid(kid) },
      { label: _t(this._hass, "timetable.add_title"), run: () => this._addTimetable(kid) }
    );
    if (timetable) {
      items.push({
        label: _t(this._hass, "timetable.edit_title"),
        run: () => this._editTimetableDetails(kid, timetable),
      });
    }
    items.push({ label: _t(this._hass, "days_off.add"), run: () => this._editDayOff(kid, null) });
    if (timetable) {
      items.push({
        label: _t(this._hass, "timetable.delete_title"),
        danger: true,
        run: () => this._deleteTimetable(kid, timetable),
      });
    }
    items.push({
      label: _t(this._hass, "kids.delete_title"),
      danger: true,
      run: () => this._deleteKid(kid),
    });
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

    this._main.replaceChildren(
      h(
        "div",
        { class: "layout" },
        this._renderNav(),
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
      this._draft = null;
      this._dirty = false;
    }
    this._render();
  }

  _renderNav() {
    const item = (label, active, onClick) =>
      h("button", {
        class: "nav-item",
        "aria-current": active ? "page" : null,
        text: label,
        onClick,
      });

    return h(
      "div",
      { class: "nav" },
      h(
        "div",
        { class: "nav-kids" },
        h("p", { class: "nav-label", text: _t(this._hass, "nav.kids") }),
        ...this._data.kids.map((kid) =>
          item(kid.name, this._view === "kid" && this._kidId === kid.id, () =>
            this._show("kid", kid.id)
          )
        )
      ),
      h(
        "div",
        { class: "nav-bottom" },
        item(`+ ${_t(this._hass, "kids.add")}`, false, () => this._addKid()),
        item(_t(this._hass, "nav.closed"), this._view === "closed", () => this._show("closed")),
        item(_t(this._hass, "nav.settings"), this._view === "settings", () =>
          this._show("settings")
        )
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
          {},
          h("button", {
            class: "link",
            text: `${fmtTime(this._hass, period.start)} – ${fmtTime(this._hass, period.end)}`,
            onClick: () => this._editDefaultPeriod(index),
          })
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
          : h("p", { class: "empty", text: _t(this._hass, "timetable.no_periods") }),
        h(
          "div",
          { class: "row" },
          h("button", {
            text: _t(this._hass, "timetable.add_period"),
            onClick: () => this._editDefaultPeriod(null),
          })
        )
      ),
    ];
  }

  async _editDefaultPeriod(index) {
    const periods = ((this._data.settings && this._data.settings.default_periods) || []).map(
      (period) => ({ ...period })
    );
    const values = await this._periodDialog(periods, index);
    if (!values) return;
    if (values.__deleted) periods.splice(index, 1);
    else if (index === null) periods.push({ start: values.start, end: values.end });
    else Object.assign(periods[index], { start: values.start, end: values.end });
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
    return [
      h("h1", { class: "view-title", text: kid.name }),
      this._renderTimetableCard(kid),
      this._renderDaysOffCard(kid),
    ];
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
    this._draft = null;
    this._dirty = false;
  }

  async _renameKid(kid) {
    const values = await this._formDialog({
      title: _t(this._hass, "kids.rename_title"),
      fields: [{ key: "name", label: _t(this._hass, "common.name"), value: kid.name, required: true }],
    });
    if (!values) return;
    await this._call({ type: "school_timetable/kid/rename", kid_id: kid.id, name: values.name });
  }

  async _deleteKid(kid) {
    if (!(await this._confirm(_t(this._hass, "kids.delete_confirm", { name: kid.name })))) return;
    await this._call({ type: "school_timetable/kid/delete", kid_id: kid.id });
    this._kidId = null;
    this._draft = null;
    this._dirty = false;
  }

  // --- timetable -------------------------------------------------------

  _renderTimetableCard(kid) {
    const timetable = this._timetable();
    const select = h(
      "select",
      {
        onChange: (event) => {
          this._timetableId = event.target.value;
          this._dirty = false;
          this._draft = null;
          this._render();
        },
      },
      ...kid.timetables.map((entry) =>
        h("option", {
          value: entry.id,
          selected: timetable && entry.id === timetable.id,
          text: [
            entry.label,
            `${fmtDate(this._hass, entry.valid_from)} – ${
              entry.valid_to
                ? fmtDate(this._hass, entry.valid_to)
                : _t(this._hass, "timetable.open_ended")
            }`,
          ]
            .filter(Boolean)
            .join(" · "),
        })
      )
    );

    const head = h(
      "div",
      { class: "row spread" },
      h("h2", { text: _t(this._hass, "timetable.section") }),
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

    if (!this._dirty || !this._draft || this._draft.id !== timetable.id) {
      this._draft = this._makeDraft(timetable);
      this._dirty = false;
    }

    return h("div", { class: "card" }, head, ...this._renderEditor(kid));
  }

  _makeDraft(timetable) {
    const periods = timetable.periods.map((period) => ({ ...period }));
    const cells = {};
    for (const lesson of timetable.lessons) {
      const index = periods.findIndex((period) => period.period === lesson.period);
      if (index < 0) continue;
      cells[`${lesson.weekday}:${index}`] = { subject: lesson.subject, week: lesson.week || "every" };
    }
    return {
      id: timetable.id,
      label: timetable.label || "",
      valid_from: timetable.valid_from,
      valid_to: timetable.valid_to || "",
      periods,
      cells,
    };
  }

  _markDirty() {
    this._dirty = true;
    if (this._dirtyBadge) this._dirtyBadge.textContent = _t(this._hass, "timetable.unsaved");
  }

  _renderEditor(kid) {
    const draft = this._draft;

    const weekdays = this._showWeekend ? [0, 1, 2, 3, 4, 5, 6] : [0, 1, 2, 3, 4];

    // Bell schedule and lessons are one table: each row is a period, labelled
    // with its times. Periods are ordered by start time and numbered by
    // position, so there is no period number to keep in sync by hand.
    const grid = draft.periods.length
      ? h(
          "div",
          { class: "scroll" },
          h(
            "table",
            { class: "grid" },
            h(
              "thead",
              {},
              h(
                "tr",
                {},
                h("th", {}),
                ...weekdays.map((day) => h("th", { text: _t(this._hass, `weekday.${day}`) }))
              )
            ),
            h(
              "tbody",
              {},
              ...draft.periods.map((period, index) =>
                h(
                  "tr",
                  {},
                  h(
                    "td",
                    { class: "period-head" },
                    h("button", {
                      class: "link",
                      title: _t(this._hass, "timetable.edit_period"),
                      text: `${fmtTime(this._hass, period.start)} – ${fmtTime(
                        this._hass,
                        period.end
                      )}`,
                      onClick: () => this._editPeriod(index),
                    })
                  ),
                  ...weekdays.map((day) => {
                    const key = `${day}:${index}`;
                    const cell = draft.cells[key];
                    return h(
                      "td",
                      {},
                      h("input", {
                        type: "text",
                        value: cell ? cell.subject : "",
                        onInput: (event) => {
                          const value = event.target.value;
                          if (!value.trim()) delete draft.cells[key];
                          else draft.cells[key] = { subject: value, week: cell ? cell.week : "every" };
                          this._markDirty();
                        },
                      })
                    );
                  })
                )
              )
            )
          )
        )
      : h("p", { class: "empty", text: _t(this._hass, "timetable.no_periods") });

    this._dirtyBadge = h("span", {
      class: "status warn",
      text: this._dirty ? _t(this._hass, "timetable.unsaved") : "",
    });

    return [
      h(
        "div",
        { class: "row spread" },
        h("h3", { text: _t(this._hass, "timetable.lessons") }),
        h(
          "label",
          { class: "inline" },
          h("input", {
            type: "checkbox",
            checked: this._showWeekend,
            onChange: (event) => {
              this._showWeekend = event.target.checked;
              this._render();
            },
          }),
          _t(this._hass, "timetable.show_weekend")
        )
      ),
      grid,
      h(
        "div",
        { class: "row" },
        h("button", {
          text: _t(this._hass, "timetable.add_period"),
          onClick: () => this._editPeriod(null),
        })
      ),
      h(
        "div",
        { class: "row spread" },
        this._dirtyBadge,
        h("button", {
          class: "primary",
          text: _t(this._hass, "common.save"),
          onClick: () => this._saveTimetable(kid),
        })
      ),
    ];
  }

  async _editPeriod(index) {
    const values = await this._periodDialog(this._draft.periods, index);
    if (!values) return;
    if (values.__deleted) this._removePeriod(index);
    else this._writePeriod(index, values);
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

  _writePeriod(index, { start, end }) {
    const draft = this._draft;
    // Carry the old row position along so the lesson cells can follow their row
    // when a changed start time re-sorts the table.
    const rows = draft.periods.map((period, position) => ({ ...period, from: position }));
    if (index === null) rows.push({ start, end, from: null });
    else Object.assign(rows[index], { start, end });
    rows.sort((left, right) => left.start.localeCompare(right.start));

    const cells = {};
    rows.forEach((row, position) => {
      if (row.from === null) return;
      for (let day = 0; day < 7; day++) {
        const cell = draft.cells[`${day}:${row.from}`];
        if (cell) cells[`${day}:${position}`] = cell;
      }
    });

    draft.periods = rows.map((row, position) => ({
      period: position + 1,
      start: row.start,
      end: row.end,
    }));
    draft.cells = cells;
    this._markDirty();
    this._render();
  }

  _removePeriod(index) {
    const draft = this._draft;
    draft.periods.splice(index, 1);
    // Cells are keyed by row position, so everything below the deleted row moves up.
    const cells = {};
    for (const [key, cell] of Object.entries(draft.cells)) {
      const [day, position] = key.split(":").map(Number);
      if (position === index) continue;
      cells[`${day}:${position > index ? position - 1 : position}`] = cell;
    }
    draft.cells = cells;
    draft.periods = draft.periods.map((period, position) => ({ ...period, period: position + 1 }));
    this._markDirty();
    this._render();
  }

  async _addTimetable(kid) {
    const values = await this._formDialog({
      title: _t(this._hass, "timetable.add_title"),
      description: _t(this._hass, "timetable.new_hint"),
      fields: [
        { key: "label", label: _t(this._hass, "timetable.label"), required: true, placeholder: _t(this._hass, "timetable.label_placeholder") },
        { key: "valid_from", label: _t(this._hass, "timetable.valid_from"), type: "date", value: todayIso(), required: true },
        { key: "valid_to", label: _t(this._hass, "timetable.valid_to"), type: "date" },
      ],
      submitLabel: _t(this._hass, "common.add"),
      validate: (input) => this._validateRange(input, null),
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
    this._draft = null;
    this._dirty = false;
  }

  _validateRange({ valid_from, valid_to }, timetableId) {
    // Two timetables covering one date would make the generated day depend on
    // tie-breaking nobody can see, so the store refuses it too.
    if (valid_to && valid_to <= valid_from) return _t(this._hass, "timetable.end_before_start");
    const kid = this._kid();
    const clashes = (kid ? kid.timetables : []).some(
      (other) =>
        other.id !== timetableId &&
        (!valid_to || other.valid_from <= valid_to) &&
        (!other.valid_to || valid_from <= other.valid_to)
    );
    return clashes ? _t(this._hass, "timetable.range_overlap") : null;
  }

  // The grid cells are keyed by row position; lessons take their period number
  // from the row they sit in.
  _draftPayload() {
    const draft = this._draft;
    const periods = draft.periods.map((period) => ({
      period: Number(period.period),
      start: period.start,
      end: period.end,
    }));
    const lessons = [];
    for (const [key, cell] of Object.entries(draft.cells)) {
      const [day, index] = key.split(":").map(Number);
      const period = periods[index];
      const subject = (cell.subject || "").trim();
      if (!period || !subject) continue;
      lessons.push({ weekday: day, period: period.period, subject, week: cell.week || "every" });
    }
    return { periods, lessons };
  }

  async _saveTimetable(kid) {
    const draft = this._draft;
    await this._call({
      type: "school_timetable/timetable/save",
      kid_id: kid.id,
      timetable: {
        id: draft.id,
        label: draft.label,
        valid_from: draft.valid_from,
        valid_to: draft.valid_to || null,
        ...this._draftPayload(),
      },
    });
    this._dirty = false;
    this._draft = null;
    this._render();
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
      validate: (input) => this._validateRange(input, timetable.id),
    });
    if (!values) return;

    // Saving the details saves the grid with it, so an edit in progress is not
    // silently thrown away.
    const editing = this._dirty && this._draft && this._draft.id === timetable.id;
    await this._call({
      type: "school_timetable/timetable/save",
      kid_id: kid.id,
      timetable: {
        id: timetable.id,
        label: values.label,
        valid_from: values.valid_from,
        valid_to: values.valid_to || null,
        ...(editing
          ? this._draftPayload()
          : { periods: timetable.periods, lessons: timetable.lessons }),
      },
    });
    this._dirty = false;
    this._draft = null;
    this._render();
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
    this._draft = null;
    this._dirty = false;
  }

  // --- days off --------------------------------------------------------

  _renderDaysOffCard(kid) {
    const rows = kid.days_off.map((entry) =>
      h(
        "tr",
        {},
        h("td", { text: fmtDate(this._hass, entry.date) }),
        h("td", { class: "grow", text: entry.reason }),
        h(
          "td",
          {},
          h(
            "div",
            { class: "row" },
            h("button", {
              class: "icon",
              text: _t(this._hass, "common.edit"),
              onClick: () => this._editDayOff(kid, entry),
            }),
            h("button", {
              class: "icon danger",
              text: "✕",
              onClick: () => this._saveDaysOff(kid, kid.days_off.filter((other) => other !== entry)),
            })
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
    });
    if (!values) return;
    const others = kid.days_off.filter((other) => other !== entry);
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
    const rows = entries.map((entry) =>
      h(
        "tr",
        {},
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
          {},
          h(
            "div",
            { class: "row" },
            h("button", {
              class: "icon",
              text: _t(this._hass, "common.edit"),
              onClick: () => this._editClosedDay(entry),
            }),
            h("button", {
              class: "icon danger",
              text: "✕",
              onClick: () => this._deleteClosedDay(entry),
            })
          )
        )
      )
    );

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

    const list = h(
      "div",
      { class: "card" },
      h("h2", { text: _t(this._hass, "closed.section") }),
      h("p", { class: "hint", text: _t(this._hass, "closed.hint") }),
      table,
      h(
        "div",
        { class: "row" },
        h("button", { text: _t(this._hass, "closed.add"), onClick: () => this._editClosedDay(null) })
      )
    );

    return [list, this._renderImportCard()];
  }

  _renderImportCard() {
    const file = h("input", {
      type: "file",
      accept: ".ics,text/calendar",
      onChange: (event) => {
        const chosen = event.target.files && event.target.files[0];
        if (chosen) this._importFile(chosen);
        event.target.value = "";
      },
    });
    const url = h("input", {
      type: "url",
      class: "grow",
      placeholder: _t(this._hass, "import.url_placeholder"),
    });

    return h(
      "div",
      { class: "card" },
      h("h2", { text: _t(this._hass, "import.section") }),
      h("p", { class: "hint", text: _t(this._hass, "import.hint") }),
      h("label", { class: "field" }, _t(this._hass, "import.file"), file),
      h(
        "label",
        { class: "field" },
        _t(this._hass, "import.url"),
        h(
          "div",
          { class: "row" },
          url,
          h("button", {
            class: "primary",
            text: _t(this._hass, "import.button"),
            onClick: () => {
              if (url.value.trim()) this._import({ url: url.value.trim() });
            },
          })
        )
      )
    );
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
    });
    if (!values) return;
    const next = this._data.closed_days.map((other) =>
      other === entry ? { ...other, ...values } : other
    );
    if (!entry) next.push({ ...values, source: "manual" });
    await this._saveClosedDays(next);
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
