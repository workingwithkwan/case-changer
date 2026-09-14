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

function runFromMenu(mode) {
  var result = applyCase(mode);
  if (!result.ok) { var ui = getUi(); ui.alert(ADDON_TITLE, result.message, ui.ButtonSet.OK); }
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
  var changed;
  try {
    if (host === 'sheets') changed = SheetsCase.apply(mode);
    else if (host === 'slides') changed = SlidesCase.apply(mode);
    else if (host === 'docs') changed = applyCaseDocs(mode);
    else return { ok: false, message: 'Open this add-on from Google Docs, Sheets or Slides.', changed: 0 };
  } catch (err) {
    if (err && err.noSelection) return { ok: false, message: err.message, changed: 0 };
    throw err;
  }
  return finish(changed, mode);
}

function finish(changed, mode) {
  return {
    ok: true,
    changed: changed,
    message: changed ? 'Changed to ' + CaseLib.MODES[mode].label + '.' : 'Nothing to change.'
  };
}

/** Thrown by the converters when nothing usable is selected. */
function noSelectionError(message) {
  var e = new Error(message);
  e.noSelection = true;
  return e;
}

/** Google Docs: convert the current selection. Returns characters changed. */
function applyCaseDocs(mode) {
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
      changed += convertTextRange(el.asText(), re.getStartOffset(), re.getEndOffsetInclusive(), mode);
    } else {
      changed += convertElement(el, mode);
    }
  }
  return changed;
}

/** Converts a fully selected element, recursing into tables and cells. */
function convertElement(el, mode) {
  var T = DocumentApp.ElementType;
  var type = el.getType();

  if (type === T.TEXT) {
    var text = el.asText();
    var len = text.getText().length;
    return len ? convertTextRange(text, 0, len - 1, mode) : 0;
  }

  if (type === T.PARAGRAPH || type === T.LIST_ITEM) {
    var t = el.editAsText();
    var n = t.getText().length;
    return n ? convertTextRange(t, 0, n - 1, mode) : 0;
  }

  // Containers: tables, rows, cells, body, footnotes, etc.
  var changed = 0;
  if (typeof el.getNumChildren === 'function') {
    var count = el.getNumChildren();
    for (var i = 0; i < count; i++) {
      changed += convertElement(el.getChild(i), mode);
    }
  }
  return changed;
}

/**
 * Replaces text[start..endInclusive] with its converted form while keeping
 * every formatting run exactly where it was.
 */
function convertTextRange(text, start, endInclusive, mode) {
  var full = text.getText();
  if (start > endInclusive || start < 0 || endInclusive >= full.length) return 0;

  var original = full.substring(start, endInclusive + 1);
  var converted = CaseLib.convert(original, mode);
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
