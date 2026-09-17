/**
 * Case Changer - Editor Add-on for Google Docs, Sheets and Slides
 *
 * Adds an "Extensions > Case Changer" menu and a sidebar that convert the
 * selected text to UPPERCASE, lowercase, Sentence case, Title Case,
 * Capitalize Each Word, iNVERSE cASE or aLtErNaTiNg cAsE.
 *
 * Formatting (bold, italic, colour, links, font) is preserved because the
 * transforms in CaseLib.gs never change the length of the text.
 *
 * One script project serves all three editors. Code.gs holds the shared
 * menu, sidebar and the Docs converter; SheetsCase.gs and SlidesCase.gs hold
 * the editor-specific converters.
 */

var ADDON_TITLE = 'Case Changer';

/**
 * Returns the Ui of whichever editor the add-on is running in.
 * Each *App.getUi() throws when called from another editor, so try in turn.
 * Safe in AuthMode.NONE (used by onOpen).
 */
function getUi() {
  try { return DocumentApp.getUi(); } catch (e) {}
  try { return SpreadsheetApp.getUi(); } catch (e) {}
  return SlidesApp.getUi();
}

/** Returns 'docs', 'sheets' or 'slides'. Needs full authorisation. */
function getHost() {
  try { if (DocumentApp.getActiveDocument()) return 'docs'; } catch (e) {}
  try { if (SpreadsheetApp.getActiveSpreadsheet()) return 'sheets'; } catch (e) {}
  try { if (SlidesApp.getActivePresentation()) return 'slides'; } catch (e) {}
  return null;
}

/**
 * Runs when the file is opened. Only builds the menu - in AuthMode.NONE
 * nothing else is allowed to run.
 */
function onOpen(e) {
  getUi().createAddonMenu()
    .addItem('UPPERCASE', 'menuUpper')
    .addItem('lowercase', 'menuLower')
    .addItem('Sentence case', 'menuSentence')
    .addItem('Title Case', 'menuTitle')
    .addItem('Capitalize Each Word', 'menuCapitalize')
    .addItem('iNVERSE cASE', 'menuInverse')
    .addItem('aLtErNaTiNg cAsE', 'menuAlternating')
    .addItem('snake_case', 'menuSnake')
    .addItem('kebab-case', 'menuKebab')
    .addSeparator()
    .addItem('Cycle case (UPPER > lower > Title)', 'menuCycle')
    .addItem('Repeat last style', 'menuRepeat')
    .addSeparator()
    .addItem('Open sidebar', 'showSidebar')
    .addItem('Help', 'showHelp')
    .addToUi();
}

/** Runs once when a user installs the add-on. */
function onInstall(e) {
  onOpen(e);
}

// Menu targets (menu items can only call zero-argument functions).
function menuUpper() { runFromMenu('upper'); }
function menuLower() { runFromMenu('lower'); }
function menuSentence() { runFromMenu('sentence'); }
function menuTitle() { runFromMenu('title'); }
function menuCapitalize() { runFromMenu('capitalize'); }
function menuInverse() { runFromMenu('inverse'); }
function menuAlternating() { runFromMenu('alternating'); }
function menuSnake() { runFromMenu('snake'); }
function menuKebab() { runFromMenu('kebab'); }
function menuCycle() { runFromMenu(nextCycleMode()); }
function menuRepeat() {
  var last = getSettings().lastMode;
  if (!last || !CaseLib.MODES[last]) {
    var ui = getUi();
    ui.alert(ADDON_TITLE, 'No style has been used yet. Pick one from the menu first.', ui.ButtonSet.OK);
    return;
  }
  runFromMenu(last);
}

function runFromMenu(mode) {
  var result = applyCase(mode);
  if (result.ok) return;
  var ui = getUi();
  if (result.needWhole) {
    var answer = ui.alert(ADDON_TITLE, 'Nothing is selected. Change the entire ' + fileNoun() + ' instead?', ui.ButtonSet.YES_NO);
    if (answer === ui.Button.YES) {
      var r2 = applyCaseWhole(mode);
      if (!r2.ok) ui.alert(ADDON_TITLE, r2.message, ui.ButtonSet.OK);
    }
    return;
  }
  ui.alert(ADDON_TITLE, result.message, ui.ButtonSet.OK);
}

function fileNoun() {
  var host = getHost();
  return host === 'sheets' ? 'sheet' : host === 'slides' ? 'presentation' : 'document';
}

/* ---------- Settings (per user, stored by Apps Script, no extra permission) ---------- */

var DEFAULT_SETTINGS = { keepAcronyms: true, language: 'auto', extraSmallWords: '', lastMode: '',
  protectedWords: '', properNouns: true, skipHeader: true, counts: {} };

/**
 * The language behind 'auto': the account language of the current user
 * (Session.getActiveUserLocale needs no extra permission), reduced to one of
 * the CaseLib presets. Anything unknown falls back to English.
 */
function accountLanguage() {
  var code = 'en';
  try { code = String(Session.getActiveUserLocale() || 'en'); } catch (e) { /* keep en */ }
  code = code.toLowerCase().split(/[-_]/)[0];
  if (code === 'fil') code = 'tl';
  return CaseLib.PRESETS.hasOwnProperty(code) ? code : 'en';
}
function resolveLanguage(language) {
  return language === 'auto' ? accountLanguage() : language;
}

function getSettings() {
  var out = {};
  for (var k in DEFAULT_SETTINGS) if (DEFAULT_SETTINGS.hasOwnProperty(k)) out[k] = DEFAULT_SETTINGS[k];
  try {
    var raw = PropertiesService.getUserProperties().getProperty('settings');
    if (raw) {
      var saved = JSON.parse(raw);
      for (var key in saved) if (saved.hasOwnProperty(key) && out.hasOwnProperty(key)) out[key] = saved[key];
    }
  } catch (e) { /* fall back to defaults */ }
  if (!out.counts || typeof out.counts !== 'object') out.counts = {};
  out.resolvedLanguage = resolveLanguage(out.language); // for the sidebar's "Auto: English" label
  out.favourites = favouriteModes(out.counts);
  return out;
}

function saveSettings(patch) {
  var current = getSettings();
  patch = patch || {};
  if (typeof patch.keepAcronyms === 'boolean') current.keepAcronyms = patch.keepAcronyms;
  if (typeof patch.language === 'string' && (patch.language === 'auto' || CaseLib.PRESETS.hasOwnProperty(patch.language))) current.language = patch.language;
  if (typeof patch.extraSmallWords === 'string') current.extraSmallWords = patch.extraSmallWords.slice(0, 500);
  if (typeof patch.lastMode === 'string' && CaseLib.MODES[patch.lastMode]) current.lastMode = patch.lastMode;
  if (typeof patch.protectedWords === 'string') current.protectedWords = patch.protectedWords.slice(0, 1000);
  if (typeof patch.properNouns === 'boolean') current.properNouns = patch.properNouns;
  if (typeof patch.skipHeader === 'boolean') current.skipHeader = patch.skipHeader;
  if (patch.countMode && CaseLib.MODES[patch.countMode]) current.counts[patch.countMode] = (current.counts[patch.countMode] || 0) + 1;
  delete current.resolvedLanguage;
  delete current.favourites;
  PropertiesService.getUserProperties().setProperty('settings', JSON.stringify(current));
  return getSettings();
}

/** The three most used styles (used at least twice), most used first. */
function favouriteModes(counts) {
  var keys = [];
  for (var k in counts) if (counts.hasOwnProperty(k) && CaseLib.MODES[k] && counts[k] >= 2) keys.push(k);
  keys.sort(function (a, b) { return counts[b] - counts[a]; });
  return keys.slice(0, 3);
}

/**
 * The CaseLib options derived from the saved settings. With 'auto' the
 * engine looks at the text itself and falls back to the account language.
 */
function caseOptions() {
  var st = getSettings();
  return {
    keepAcronyms: st.keepAcronyms,
    language: st.language === 'auto' ? 'auto' : st.language,
    fallbackLanguage: accountLanguage(),
    extraSmallWords: st.extraSmallWords,
    protectedWords: st.protectedWords,
    properNouns: st.properNouns,
    skipHeader: st.skipHeader
  };
}

/* ---------- Preview and cycle (1.5) ---------- */

/** The first line of what is selected (or of the file when nothing is), at most 80 characters. */
function selectionSample() {
  var host = getHost(), text = '';
  try {
    if (host === 'docs') text = docsSample();
    else if (host === 'sheets') text = SheetsCase.sample();
    else if (host === 'slides') text = SlidesCase.sample();
  } catch (e) { text = ''; }
  text = String(text || '').split(/[\r\n\u000b]/)[0];
  return text.length > 80 ? text.slice(0, 80) : text;
}

function docsSample() {
  var doc = DocumentApp.getActiveDocument();
  var selection = doc.getSelection();
  if (selection) {
    var els = selection.getRangeElements();
    for (var i = 0; i < els.length; i++) {
      var el = els[i].getElement();
      if (typeof el.asText !== 'function' && typeof el.editAsText !== 'function') continue;
      var t = (el.getType() === DocumentApp.ElementType.TEXT ? el.asText() : el.editAsText()).getText();
      if (els[i].isPartial()) t = t.substring(els[i].getStartOffset(), els[i].getEndOffsetInclusive() + 1);
      if (t && t.trim()) return t;
    }
  }
  var body = doc.getBody().getText();
  var lines = body.split('\n');
  for (var k = 0; k < lines.length; k++) if (lines[k].trim()) return lines[k];
  return '';
}

/** Used by the sidebar's Preview button: the sample in every style. */
function previewSelection() {
  var sample = selectionSample();
  var opts = caseOptions(), previews = {};
  if (sample) {
    for (var key in CaseLib.MODES) if (CaseLib.MODES.hasOwnProperty(key)) previews[key] = CaseLib.convert(sample, key, opts);
  }
  return { sample: sample, previews: previews, next: CaseLib.nextCycleMode(sample) };
}

/** UPPERCASE, lowercase or Title Case, whichever comes next for the selected text. */
function nextCycleMode() {
  return CaseLib.nextCycleMode(selectionSample());
}

/** Sidebar entry point for the Cycle button. */
function cycleCase() {
  var mode = nextCycleMode();
  var result = applyCase(mode);
  result.mode = mode;
  return result;
}

/** Opens the sidebar with one button per case style. */
function showSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('Sidebar')
    .setTitle(ADDON_TITLE);
  getUi().showSidebar(html);
}

function showHelp() {
  var ui = getUi();
  ui.alert(ADDON_TITLE,
    'Select some text (in Sheets: select cells; in Slides: highlight text or select a text box), ' +
    'then pick a case style from the Case Changer menu or the sidebar.\n\n' +
    'Cycle case switches between UPPERCASE, lowercase and Title Case. Repeat last style does what it says.\n' +
    'With nothing selected you can change the whole file.\n\n' +
    'Formatting such as bold, links and colours is kept.\n' +
    'Nothing leaves your file: the add-on only reads the text you select and ' +
    'writes it back in the new case.',
    ui.ButtonSet.OK);
}

/**
 * Converts the current selection to the requested case in whichever editor
 * is active. Called by the menu and by the sidebar (google.script.run.applyCase).
 *
 * @param {string} mode one of the keys in CaseLib.MODES
 * @return {{ok: boolean, message: string, changed: number}}
 */
function applyCase(mode) {
  if (!CaseLib.MODES[mode]) return { ok: false, message: 'Unknown case style.', changed: 0 };
  var host = getHost();
  var opts = caseOptions();
  var changed;
  try {
    if (host === 'sheets') changed = SheetsCase.apply(mode, opts);
    else if (host === 'slides') changed = SlidesCase.apply(mode, opts);
    else if (host === 'docs') changed = applyCaseDocs(mode, opts);
    else return { ok: false, message: 'Open this add-on from Google Docs, Sheets or Slides.', changed: 0 };
  } catch (err) {
    if (err && err.noSelection) {
      return { ok: false, needWhole: true, message: 'Nothing is selected.', changed: 0, noun: fileNoun() };
    }
    throw err;
  }
  rememberMode(mode);
  return finish(changed, mode);
}

/** Converts the whole document, the active sheet, or every slide. */
function applyCaseWhole(mode) {
  if (!CaseLib.MODES[mode]) return { ok: false, message: 'Unknown case style.', changed: 0 };
  var host = getHost();
  var opts = caseOptions();
  var changed = 0;
  if (host === 'sheets') {
    changed = SheetsCase.applyWhole(mode, opts);
  } else if (host === 'slides') {
    changed = SlidesCase.applyWhole(mode, opts);
  } else if (host === 'docs') {
    var doc = DocumentApp.getActiveDocument();
    changed += convertElement(doc.getBody(), mode, opts);
    var header = doc.getHeader(); if (header) changed += convertElement(header, mode, opts);
    var footer = doc.getFooter(); if (footer) changed += convertElement(footer, mode, opts);
    var footnotes = doc.getFootnotes() || [];
    for (var f = 0; f < footnotes.length; f++) {
      var contents = footnotes[f].getFootnoteContents();
      if (contents) changed += convertElement(contents, mode, opts);
    }
  } else {
    return { ok: false, message: 'Open this add-on from Google Docs, Sheets or Slides.', changed: 0 };
  }
  rememberMode(mode);
  return finish(changed, mode);
}

function rememberMode(mode) {
  try { saveSettings({ lastMode: mode, countMode: mode }); } catch (e) { /* not important */ }
}

function finish(changed, mode) {
  var note = '';
  try { if (getHost() === 'sheets') note = SheetsCase.note(); } catch (e) { /* no note */ }
  return {
    ok: true,
    changed: changed,
    mode: mode,
    message: (changed ? 'Changed to ' + CaseLib.MODES[mode].label + '.' : 'Nothing to change.') + (note ? ' ' + note : '')
  };
}

/** Thrown by the converters when nothing usable is selected. */
function noSelectionError(message) {
  var e = new Error(message);
  e.noSelection = true;
  return e;
}

/** Google Docs: convert the current selection. Returns characters changed. */
function applyCaseDocs(mode, opts) {
  var doc = DocumentApp.getActiveDocument();
  var selection = doc.getSelection();
  if (!selection) throw noSelectionError('Select the text you want to change first.');

  var changed = 0;
  var rangeElements = selection.getRangeElements();
  for (var i = 0; i < rangeElements.length; i++) {
    var re = rangeElements[i];
    var el = re.getElement();
    if (re.isPartial()) {
      // A partial range is always a Text element with character offsets.
      changed += convertTextRange(el.asText(), re.getStartOffset(), re.getEndOffsetInclusive(), mode, opts);
    } else {
      changed += convertElement(el, mode, opts);
    }
  }
  return changed;
}

/** Converts a fully selected element, recursing into tables and cells. */
function convertElement(el, mode, opts) {
  var T = DocumentApp.ElementType;
  var type = el.getType();

  if (type === T.TEXT) {
    var text = el.asText();
    var len = text.getText().length;
    return len ? convertTextRange(text, 0, len - 1, mode, opts) : 0;
  }

  if (type === T.PARAGRAPH || type === T.LIST_ITEM) {
    var t = el.editAsText();
    var n = t.getText().length;
    return n ? convertTextRange(t, 0, n - 1, mode, opts) : 0;
  }

  // Containers: tables, rows, cells, body, footnotes, etc.
  var changed = 0;
  if (typeof el.getNumChildren === 'function') {
    var count = el.getNumChildren();
    for (var i = 0; i < count; i++) {
      changed += convertElement(el.getChild(i), mode, opts);
    }
  }
  return changed;
}

/**
 * Replaces text[start..endInclusive] with its converted form while keeping
 * every formatting run exactly where it was.
 */
function convertTextRange(text, start, endInclusive, mode, opts) {
  var full = text.getText();
  if (start > endInclusive || start < 0 || endInclusive >= full.length) return 0;

  var original = full.substring(start, endInclusive + 1);
  var converted = CaseLib.convert(original, mode, opts);
  if (converted === original) return 0;

  // Snapshot the formatting runs that overlap the range.
  var runs = [];
  var indices = text.getTextAttributeIndices();
  for (var i = 0; i < indices.length; i++) {
    var a = indices[i];
    var b = (i + 1 < indices.length) ? indices[i + 1] - 1 : full.length - 1;
    if (b < start || a > endInclusive) continue;
    var ra = Math.max(a, start);
    var rb = Math.min(b, endInclusive);
    runs.push({ start: ra, end: rb, attrs: text.getAttributes(ra), link: text.getLinkUrl(ra) });
  }

  // Swap the text. Same length in, same length out, so the runs still line up.
  text.deleteText(start, endInclusive);
  text.insertText(start, converted);

  // Restore formatting run by run.
  for (var r = 0; r < runs.length; r++) {
    var run = runs[r];
    var attrs = {};
    for (var key in run.attrs) {
      if (run.attrs.hasOwnProperty(key) && run.attrs[key] !== null) attrs[key] = run.attrs[key];
    }
    if (Object.keys(attrs).length) text.setAttributes(run.start, run.end, attrs);
    // Links need explicit handling so a link is never inherited or dropped.
    text.setLinkUrl(run.start, run.end, run.link || null);
  }

  return original.length;
}

/** Used by the sidebar to render its buttons. */
function getModes() {
  var out = [];
  for (var key in CaseLib.MODES) {
    if (CaseLib.MODES.hasOwnProperty(key)) out.push({ key: key, label: CaseLib.MODES[key].label });
  }
  return out;
}
