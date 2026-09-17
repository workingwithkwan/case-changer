/**
 * SheetsCase - Google Sheets converter for Case Changer.
 *
 * Works on the selected cells (all ranges of a multi-selection). Only cells
 * whose value is a plain text string are changed; formulas, numbers, dates,
 * booleans and empty cells are left exactly as they are. Rich text runs
 * (bold, colour, font, links) are rebuilt at the same character positions,
 * which is safe because every CaseLib transform keeps the text length.
 */
var SheetsCase = (function () {
  'use strict';

  function apply(mode, opts) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var rangeList = ss.getActiveRangeList();
    var ranges = rangeList ? rangeList.getRanges() : [];
    if (!ranges.length) {
      var single = ss.getActiveRange();
      if (single) ranges = [single];
    }
    if (!ranges.length) throw noSelectionError('Select the cells you want to change first.');
    // Sheets always has a selected cell. A single blank cell counts as
    // "nothing selected" so the caller can offer the whole sheet instead.
    if (ranges.length === 1 && ranges[0].getNumRows() === 1 && ranges[0].getNumColumns() === 1 && ranges[0].isBlank()) {
      throw noSelectionError('Nothing is selected.');
    }

    lastNote = '';
    var changed = 0;
    for (var i = 0; i < ranges.length; i++) changed += convertRange(trimWholeColumns(ranges[i], opts), mode, opts);
    return changed;
  }

  var lastNote = '';
  /** A short remark about the last apply(), e.g. that the header row was skipped. */
  function note() { return lastNote; }

  /**
   * When whole columns are selected (by clicking the column letter), only the
   * rows that hold data are read, and the header is left alone: the frozen
   * rows if there are any, otherwise row 1 (unless the setting is off).
   */
  function trimWholeColumns(range, opts) {
    var sheet = range.getSheet();
    if (range.getRow() !== 1 || range.getNumRows() < sheet.getMaxRows()) return range;
    var lastRow = sheet.getLastRow();
    if (lastRow < 1) return null;
    var skip = 0;
    if (!opts || opts.skipHeader !== false) skip = Math.max(sheet.getFrozenRows(), 1);
    if (skip >= lastRow) skip = 0;               // a single row of data is not a header
    if (skip) lastNote = skip === 1 ? 'Header row skipped.' : skip + ' header rows skipped.';
    return sheet.getRange(skip + 1, range.getColumn(), lastRow - skip, range.getNumColumns());
  }

  /** First non-empty text cell of the selection, for the preview. */
  function sample() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var range = ss.getActiveRange();
    if (!range) return '';
    var sheet = range.getSheet();
    var rows = Math.min(range.getNumRows(), Math.max(sheet.getLastRow() - range.getRow() + 1, 1), 50);
    var values = sheet.getRange(range.getRow(), range.getColumn(), rows, Math.min(range.getNumColumns(), 20)).getValues();
    for (var r = 0; r < values.length; r++) for (var c = 0; c < values[r].length; c++) {
      if (typeof values[r][c] === 'string' && values[r][c].trim()) return values[r][c];
    }
    return '';
  }

  /** Every text cell on the active sheet. */
  function applyWhole(mode, opts) {
    var sheet = SpreadsheetApp.getActiveSheet();
    var range = sheet.getDataRange();
    return range ? convertRange(range, mode, opts) : 0;
  }

  function convertRange(range, mode, opts) {
    if (!range) return 0;
    var values = range.getValues();
    var formulas = range.getFormulas();
    var rich = range.getRichTextValues();
    var changed = 0;

    for (var r = 0; r < values.length; r++) {
      for (var c = 0; c < values[r].length; c++) {
        if (formulas[r][c]) continue;                       // never touch formulas
        var v = values[r][c];
        if (typeof v !== 'string' || !v) continue;           // numbers, dates, booleans, blanks
        var rt = rich[r][c];
        var text = rt ? rt.getText() : v;
        var converted = CaseLib.convert(text, mode, opts);
        if (converted === text) continue;

        var builder = SpreadsheetApp.newRichTextValue().setText(converted);
        var runs = rt ? rt.getRuns() : [];
        for (var k = 0; k < runs.length; k++) {
          var run = runs[k];
          var s = run.getStartIndex(), e = run.getEndIndex();
          if (e <= s) continue;
          builder.setTextStyle(s, e, run.getTextStyle());
          var url = run.getLinkUrl();
          if (url) builder.setLinkUrl(s, e, url);
        }
        range.getCell(r + 1, c + 1).setRichTextValue(builder.build());
        changed += text.length;
      }
    }
    return changed;
  }

  return { apply: apply, applyWhole: applyWhole, sample: sample, note: note };
})();
