/**
 * SlidesCase - Google Slides converter for Case Changer.
 *
 * Handles the three ways text can be selected in Slides:
 *   - text highlighted inside a shape or table cell (TEXT selection)
 *   - one or more shapes, tables or groups selected (PAGE_ELEMENT selection)
 *   - table cells selected (TABLE_CELL selection)
 *
 * The selected string is converted in one go (so Sentence case and Title
 * Case see complete sentences), then written back one style run at a time so
 * each run keeps its own style. Every write is addressed by absolute
 * position in the containing shape's full text and applied from the end
 * backwards, because sub-ranges derived from runs proved unreliable to write
 * through.
 */
var SlidesCase = (function () {
  'use strict';

  function apply(mode, opts) {
    var selection = SlidesApp.getActivePresentation().getSelection();
    var T = SlidesApp.SelectionType;
    var type = selection.getSelectionType();
    var changed = 0;

    if (type === T.TEXT) {
      changed = convertSelectedText(selection, mode, opts);
    } else if (type === T.TABLE_CELL) {
      var cells = selection.getTableCellRange().getTableCells();
      for (var i = 0; i < cells.length; i++) changed += convertWhole(cells[i].getText(), mode, opts);
    } else if (type === T.PAGE_ELEMENT) {
      var elements = selection.getPageElementRange().getPageElements();
      for (var j = 0; j < elements.length; j++) changed += convertPageElement(elements[j], mode, opts);
    } else {
      throw noSelectionError('Highlight some text, or select a text box, table or shape first.');
    }
    return changed;
  }

  /** Every text element on every slide (speaker notes are left alone). */
  function applyWhole(mode, opts) {
    var slides = SlidesApp.getActivePresentation().getSlides();
    var changed = 0;
    for (var s = 0; s < slides.length; s++) {
      var elements = slides[s].getPageElements();
      for (var e = 0; e < elements.length; e++) changed += convertPageElement(elements[e], mode, opts);
    }
    return changed;
  }

  /** Text highlighted inside a shape or a table cell. */
  function convertSelectedText(selection, mode, opts) {
    var sel = selection.getTextRange();
    if (!sel) return 0;
    var selText = sel.asString();
    if (!selText) return 0;

    // Find the full text range of the container (shape or table cell).
    var full = null;
    var cellRange = selection.getTableCellRange();
    if (cellRange) {
      var cells = cellRange.getTableCells();
      if (cells.length) full = cells[0].getText();
    }
    if (!full) {
      var per = selection.getPageElementRange();
      var els = per ? per.getPageElements() : [];
      if (els.length && els[0].getPageElementType() === SlidesApp.PageElementType.SHAPE) {
        full = els[0].asShape().getText();
      }
    }
    if (!full) {
      // Unknown container: convert the selection as one range.
      return convertWhole(sel, mode, opts);
    }

    var fullText = full.asString();
    var start = sel.getStartIndex();
    var end = sel.getEndIndex();
    // Sanity check the indices against the text; fall back to a search.
    if (fullText.substring(start, end) !== selText) {
      var at = fullText.indexOf(selText);
      if (at < 0 || fullText.indexOf(selText, at + 1) >= 0) return convertWhole(sel, mode, opts);
      start = at; end = at + selText.length;
    }
    return convertSpan(full, start, end, mode, opts);
  }

  function convertPageElement(el, mode, opts) {
    var PT = SlidesApp.PageElementType;
    var kind = el.getPageElementType();
    if (kind === PT.SHAPE) return convertWhole(el.asShape().getText(), mode, opts);
    if (kind === PT.TABLE) {
      var table = el.asTable(), n = 0;
      for (var r = 0; r < table.getNumRows(); r++) {
        for (var c = 0; c < table.getNumColumns(); c++) {
          var cell = table.getCell(r, c);
          // Merged cells report the head cell; skip the covered ones.
          if (cell.getMergeState() === SlidesApp.CellMergeState.MERGED) continue;
          n += convertWhole(cell.getText(), mode, opts);
        }
      }
      return n;
    }
    if (kind === PT.GROUP) {
      var children = el.asGroup().getChildren(), m = 0;
      for (var k = 0; k < children.length; k++) m += convertPageElement(children[k], mode, opts);
      return m;
    }
    return 0; // images, lines, videos, etc.
  }

  /** Converts all of a container's text. */
  function convertWhole(full, mode, opts) {
    if (!full) return 0;
    var text = full.asString();
    return text ? convertSpan(full, 0, text.length, mode, opts) : 0;
  }

  /**
   * Converts full[start, end) keeping every style run. `full` must be the
   * complete text range of a shape or table cell so that run indices and
   * getRange() offsets share one coordinate system.
   */
  function convertSpan(full, start, end, mode, opts) {
    var fullText = full.asString();
    if (start < 0) start = 0;
    if (end > fullText.length) end = fullText.length;
    if (end <= start) return 0;

    var original = fullText.substring(start, end);
    var converted = CaseLib.convert(original, mode, opts);
    if (converted === original) return 0;

    var runs = full.getRuns();
    var edits = [];
    for (var i = 0; i < runs.length; i++) {
      var a = Math.max(runs[i].getStartIndex(), start);
      var b = Math.min(runs[i].getEndIndex(), end);
      if (b <= a) continue;
      var oldText = fullText.substring(a, b);
      var newText = converted.substr(a - start, b - a);
      // Never rewrite a paragraph break: it carries list and paragraph formatting.
      if (oldText.charAt(oldText.length - 1) === '\n') {
        b -= 1; oldText = oldText.slice(0, -1); newText = newText.slice(0, -1);
      }
      if (b <= a || oldText === newText) continue;
      edits.push({ a: a, b: b, text: newText });
    }
    if (!edits.length) {
      // No runs reported (should not happen); write the span in one go.
      full.getRange(start, end).setText(converted);
      return end - start;
    }

    // Apply from the end so earlier edits cannot shift later positions.
    edits.sort(function (x, y) { return y.a - x.a; });
    var changed = 0;
    for (var e = 0; e < edits.length; e++) {
      full.getRange(edits[e].a, edits[e].b).setText(edits[e].text);
      changed += edits[e].b - edits[e].a;
    }
    return changed;
  }

  return { apply: apply, applyWhole: applyWhole };
})();
