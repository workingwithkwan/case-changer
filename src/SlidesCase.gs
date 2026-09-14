/**
 * SlidesCase - Google Slides converter for Case Changer.
 *
 * Handles the three ways text can be selected in Slides:
 *   - text highlighted inside a shape or table cell (TEXT selection)
 *   - one or more shapes, tables or groups selected (PAGE_ELEMENT selection)
 *   - table cells selected (TABLE_CELL selection)
 *
 * The whole selected string is converted at once (so Sentence case and
 * Title Case see complete sentences), then written back run by run so that
 * each run keeps its own style. Runs are addressed by their own relative
 * offsets, which avoids any ambiguity about absolute indices.
 */
var SlidesCase = (function () {
  'use strict';

  function apply(mode) {
    var selection = SlidesApp.getActivePresentation().getSelection();
    var T = SlidesApp.SelectionType;
    var type = selection.getSelectionType();
    var changed = 0;

    if (type === T.TEXT) {
      changed = convertTextRange(selection.getTextRange(), mode);
    } else if (type === T.TABLE_CELL) {
      var cells = selection.getTableCellRange().getTableCells();
      for (var i = 0; i < cells.length; i++) changed += convertTextRange(cells[i].getText(), mode);
    } else if (type === T.PAGE_ELEMENT) {
      var elements = selection.getPageElementRange().getPageElements();
      for (var j = 0; j < elements.length; j++) changed += convertPageElement(elements[j], mode);
    } else {
      throw noSelectionError('Highlight some text, or select a text box, table or shape first.');
    }
    return changed;
  }

  function convertPageElement(el, mode) {
    var PT = SlidesApp.PageElementType;
    var kind = el.getPageElementType();
    if (kind === PT.SHAPE) return convertTextRange(el.asShape().getText(), mode);
    if (kind === PT.TABLE) {
      var table = el.asTable(), n = 0;
      for (var r = 0; r < table.getNumRows(); r++) {
        for (var c = 0; c < table.getNumColumns(); c++) {
          var cell = table.getCell(r, c);
          // Merged cells report the head cell; skip the covered ones.
          if (cell.getMergeState() === SlidesApp.CellMergeState.MERGED) continue;
          n += convertTextRange(cell.getText(), mode);
        }
      }
      return n;
    }
    if (kind === PT.GROUP) {
      var children = el.asGroup().getChildren(), m = 0;
      for (var k = 0; k < children.length; k++) m += convertPageElement(children[k], mode);
      return m;
    }
    return 0; // images, lines, videos, etc.
  }

  /** Converts one TextRange, keeping every run's style. Returns characters changed. */
  function convertTextRange(textRange, mode) {
    if (!textRange) return 0;
    var full = textRange.asString();
    if (!full) return 0;
    var converted = CaseLib.convert(full, mode);
    if (converted === full) return 0;

    var runs = textRange.getRuns();
    var pos = 0, changed = 0, runsCover = true;
    var pieces = [];
    for (var i = 0; i < runs.length; i++) {
      var runText = runs[i].asString();
      pieces.push({ run: runs[i], text: runText, start: pos });
      pos += runText.length;
    }
    if (pos !== full.length) runsCover = false;

    if (runsCover) {
      for (var p = 0; p < pieces.length; p++) {
        var piece = pieces[p];
        var oldText = piece.text;
        var newText = converted.substr(piece.start, oldText.length);
        if (newText === oldText) continue;
        // Never rewrite the paragraph break at the end of a run: it carries
        // list and paragraph formatting. Replace the characters before it.
        var end = oldText.length;
        if (oldText.charAt(end - 1) === '\n') end -= 1;
        if (end <= 0) continue;
        var target = piece.run.getRange(0, end);
        if (target) target.setText(newText.substring(0, end));
        changed += end;
      }
    } else {
      // Fallback: convert each run on its own (still keeps styles).
      for (var q = 0; q < runs.length; q++) {
        var t = runs[q].asString();
        var end2 = t.length;
        if (t.charAt(end2 - 1) === '\n') end2 -= 1;
        if (end2 <= 0) continue;
        var c2 = CaseLib.convert(t.substring(0, end2), mode);
        if (c2 === t.substring(0, end2)) continue;
        var target2 = runs[q].getRange(0, end2);
        if (target2) target2.setText(c2);
        changed += end2;
      }
    }
    return changed;
  }

  return { apply: apply };
})();
