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

    var changed = 0;
    for (var i = 0; i < ranges.length; i++) changed += convertRange(ranges[i], mode, opts);
    return changed;
  }

  /** Every text cell on the active sheet. */
  function applyWhole(mode, opts) {
    var sheet = SpreadsheetApp.getActiveSheet();
    var range = sheet.getDataRange();
    return range ? convertRange(range, mode, opts) : 0;
  }

  function convertRange(range, mode, opts) {
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

  return { apply: apply, applyWhole: applyWhole };
})();
