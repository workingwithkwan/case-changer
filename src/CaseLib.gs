/**
 * CaseLib - pure text transforms for Case Changer.
 *
 * Every transform is LENGTH-PRESERVING: each character maps to exactly one
 * character. That lets Code.gs swap text in place and re-apply the original
 * formatting (bold, links, colours, ...) at the same character positions.
 *
 * This file has no Google dependencies so it can be unit-tested in a browser.
 */
var CaseLib = (function () {
  'use strict';

  // Words that stay lowercase in Title Case (unless first/last or after a colon etc.)
  var SMALL_WORDS = {
    a: 1, an: 1, and: 1, as: 1, at: 1, but: 1, by: 1, en: 1, 'for': 1, 'if': 1,
    'in': 1, nor: 1, of: 1, on: 1, or: 1, per: 1, the: 1, to: 1, v: 1, vs: 1, via: 1
  };

  var LETTER = /\p{L}/u;
  var WORD_CHAR = /[\p{L}\p{N}'’]/u;      // characters that belong to a word
  var SENTENCE_END = /[.!?\n\r]/;

  function isLetter(ch) { return LETTER.test(ch); }
  function isWordChar(ch) { return WORD_CHAR.test(ch); }

  // Case-map a single character, but only if the result is still one character
  // (e.g. German sharp s uppercases to "SS", which would break in-place replacement).
  function up(ch) { var u = ch.toUpperCase(); return u.length === 1 ? u : ch; }
  function low(ch) { var l = ch.toLowerCase(); return l.length === 1 ? l : ch; }

  function mapChars(s, fn) {
    var out = '';
    for (var i = 0; i < s.length; i++) out += fn(s[i], i);
    return out;
  }

  function upper(s) { return mapChars(s, up); }
  function lower(s) { return mapChars(s, low); }

  function inverse(s) {
    return mapChars(s, function (ch) {
      var u = up(ch);
      return ch === u ? low(ch) : u;
    });
  }

  function alternating(s) {
    var n = 0;
    return mapChars(s, function (ch) {
      if (!isLetter(ch)) return ch;
      var r = (n % 2 === 0) ? low(ch) : up(ch);
      n++;
      return r;
    });
  }

  // Tokens that must not be re-cased by Title Case or Capitalize Each Word:
  // email addresses, URLs and bare domain names. Returned as [start, end] pairs.
  var PROTECTED = /^(?:[^\s@]+@[^\s@]+|[a-z][a-z0-9+.-]*:\/\/\S+|www\.\S+|[\w-]+(?:\.[\w-]+)*\.(?:com|net|org|io|app|my|co|edu|gov|dev|uk|info|biz)(?:\/\S*)?)$/i;
  function protectedSpans(s) {
    var spans = [], re = /\S+/g, m;
    while ((m = re.exec(s)) !== null) {
      if (PROTECTED.test(m[0])) spans.push([m.index, m.index + m[0].length]);
    }
    return spans;
  }
  function restoreProtected(original, chars) {
    var spans = protectedSpans(original);
    for (var k = 0; k < spans.length; k++) {
      for (var i = spans[k][0]; i < spans[k][1]; i++) chars[i] = original[i];
    }
    return chars;
  }

  // Capitalise the first letter of every word; everything else lowercase.
  function capitalizeEachWord(s) {
    var out = [];
    for (var i = 0; i < s.length; i++) {
      var ch = s[i];
      var startOfWord = isLetter(ch) && (i === 0 || !isWordChar(s[i - 1]));
      out.push(startOfWord ? up(ch) : low(ch));
    }
    return restoreProtected(s, out).join('');
  }

  // Smart title case: like capitalizeEachWord, but short function words stay
  // lowercase unless they begin/end the text or follow a colon, dash, bracket
  // or sentence end.
  function titleCase(s) {
    var lowered = lower(s);
    var chars = lowered.split('');
    var words = [];
    var re = /[\p{L}\p{N}'’]+(?:-[\p{L}\p{N}'’]+)*/gu;
    var m;
    while ((m = re.exec(lowered)) !== null) {
      words.push({ start: m.index, end: m.index + m[0].length - 1, text: m[0] });
    }
    for (var w = 0; w < words.length; w++) {
      var word = words[w];
      var isFirst = w === 0;
      var isLast = w === words.length - 1;
      var p = word.start - 1;
      while (p >= 0 && /[ \t]/.test(lowered[p])) p--;
      var afterBreak = p < 0 || /[:.!?—–\-(\[{"“‘'\n\r]/.test(lowered[p]);
      var small = SMALL_WORDS.hasOwnProperty(word.text);
      if (small && !isFirst && !isLast && !afterBreak) continue;
      for (var i = word.start; i <= word.end; i++) {
        var ch = chars[i];
        if (isLetter(ch) && (i === word.start || chars[i - 1] === '-')) chars[i] = up(ch);
      }
    }
    return restoreProtected(s, chars).join('');
  }

  // Sentence case: lowercase everything, capitalise the first letter of each
  // sentence (and after line breaks), and fix the standalone pronoun "i".
  function sentenceCase(s) {
    var chars = lower(s).split('');
    var needCap = true;
    for (var i = 0; i < chars.length; i++) {
      var ch = chars[i];
      if (isLetter(ch)) {
        if (needCap) { chars[i] = up(ch); needCap = false; }
      } else if (SENTENCE_END.test(ch)) {
        // A full stop right after a one-letter word is an abbreviation or an
        // initial (e.g., i.e., U.S., J. K.), not the end of a sentence.
        var abbrev = ch === '.' && i >= 1 && isLetter(chars[i - 1]) && (i === 1 || !isWordChar(chars[i - 2]));
        if (!abbrev) needCap = true;
      } else if (/\p{N}/u.test(ch)) {
        needCap = false; // "3 apples were left." - the number starts the sentence
      }
      if (chars[i] === 'i') {
        var prevOk = i === 0 || !isWordChar(chars[i - 1]);
        var next = chars[i + 1];
        var nextOk = next === undefined || !isWordChar(next) || next === "'" || next === '’';
        // "i.e." is not the pronoun.
        if (next === '.' && isLetter(chars[i + 2] || '')) nextOk = false;
        if (prevOk && nextOk) chars[i] = 'I';
      }
    }
    return chars.join('');
  }

  var MODES = {
    upper: { label: 'UPPERCASE', fn: upper },
    lower: { label: 'lowercase', fn: lower },
    sentence: { label: 'Sentence case', fn: sentenceCase },
    title: { label: 'Title Case', fn: titleCase },
    capitalize: { label: 'Capitalize Each Word', fn: capitalizeEachWord },
    inverse: { label: 'iNVERSE cASE', fn: inverse },
    alternating: { label: 'aLtErNaTiNg cAsE', fn: alternating }
  };

  function convert(text, mode) {
    var m = MODES[mode];
    if (!m) throw new Error('Unknown case mode: ' + mode);
    var out = m.fn(String(text));
    if (out.length !== text.length) throw new Error('Internal error: length changed');
    return out;
  }

  return { convert: convert, MODES: MODES };
})();
