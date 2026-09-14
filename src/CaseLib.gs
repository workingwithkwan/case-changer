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
  var SMALL_WORD_PRESETS = {
    en: 'a an and as at but by en for if in nor of on or per the to v vs via',
    ms: 'dan atau di ke dari pada untuk yang dengan oleh bagi serta tentang demi',
    id: 'dan atau di ke dari pada untuk yang dengan oleh bagi serta tentang demi'
  };
  function wordSet(list) {
    var set = {};
    String(list || '').toLowerCase().split(/[\s,;]+/).forEach(function (w) { if (w) set[w] = 1; });
    return set;
  }
  var SMALL_WORDS = wordSet(SMALL_WORD_PRESETS.en);

  // Options accepted by convert(): { keepAcronyms: true, language: 'en'|'ms'|'id', extraSmallWords: 'dan di ke' }
  var current = { keepAcronyms: true, smallWords: SMALL_WORDS };
  function applyOptions(opts) {
    opts = opts || {};
    var lang = SMALL_WORD_PRESETS.hasOwnProperty(opts.language) ? opts.language : 'en';
    var set = wordSet(SMALL_WORD_PRESETS[lang]);
    var extra = wordSet(opts.extraSmallWords);
    for (var k in extra) if (extra.hasOwnProperty(k)) set[k] = 1;
    current = { keepAcronyms: opts.keepAcronyms !== false, smallWords: set };
  }

  // Acronym protection: words of 2 to 6 letters written entirely in capitals
  // (NASA, KL, UMNO, HTML, COVID) keep their capitals in Sentence case, Title
  // Case and Capitalize Each Word. Skipped when the whole text is shouting
  // (mostly capitals and at least 12 letters), because then the capitals are
  // not acronyms, they are the thing the user wants to fix.
  function restoreAcronyms(original, chars) {
    if (!current.keepAcronyms) return chars;
    // Collect words with their capitalisation, in order.
    var re = /\p{L}[\p{L}\p{N}]*/gu, m, words = [];
    while ((m = re.exec(original)) !== null) {
      var letters = 0, allCaps = true;
      for (var i = 0; i < m[0].length; i++) {
        var ch = m[0][i];
        if (!isLetter(ch)) continue;
        letters++;
        if (ch !== ch.toUpperCase() || ch === ch.toLowerCase()) { allCaps = false; }
      }
      words.push({ start: m.index, text: m[0], letters: letters, caps: allCaps && letters >= 2 });
    }
    // A run of two or more consecutive capitalised words is a shouted phrase,
    // not a list of acronyms, when it contains a long word (7+ letters) or
    // adds up to 10 or more letters: "MESYUARAT AGUNG TAHUNAN" and
    // "ANNUAL REPORT" are fixed as a whole, "NASA HQ" and "COVID HTML" are kept.
    var w = 0;
    while (w < words.length) {
      if (!words[w].caps) { w++; continue; }
      var end = w, hasLong = false, total = 0;
      while (end < words.length && words[end].caps) { if (words[end].letters > 6) hasLong = true; total += words[end].letters; end++; }
      if (end - w >= 2 && (hasLong || total >= 10)) for (var k = w; k < end; k++) words[k].caps = false;
      w = end;
    }
    // If most of the text is still capitalised words after that, the whole
    // thing is shouting and nothing is an acronym.
    var totalWords = 0, capsLeft = 0;
    for (var c = 0; c < words.length; c++) { if (words[c].letters >= 2) { totalWords++; if (words[c].caps) capsLeft++; } }
    if (totalWords >= 3 && capsLeft / totalWords >= 0.6) return chars;
    for (var q = 0; q < words.length; q++) {
      var word = words[q];
      if (!word.caps || word.letters > 6) continue;
      for (var j = 0; j < word.text.length; j++) chars[word.start + j] = original[word.start + j];
    }
    return chars;
  }

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
    return restoreAcronyms(s, restoreProtected(s, out)).join('');
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
      var small = current.smallWords.hasOwnProperty(word.text);
      if (small && !isFirst && !isLast && !afterBreak) continue;
      for (var i = word.start; i <= word.end; i++) {
        var ch = chars[i];
        if (isLetter(ch) && (i === word.start || chars[i - 1] === '-')) chars[i] = up(ch);
      }
    }
    return restoreAcronyms(s, restoreProtected(s, chars)).join('');
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
        // Punctuation followed directly by a word character is inside a token
        // (case-changer.app, 3.5, v1.2, why?not), not the end of a sentence.
        var inToken = ch !== '\n' && ch !== '\r' && i + 1 < chars.length && isWordChar(chars[i + 1]);
        if (!abbrev && !inToken) needCap = true;
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
    return restoreAcronyms(s, restoreProtected(s, chars)).join('');
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

  function convert(text, mode, options) {
    var m = MODES[mode];
    if (!m) throw new Error('Unknown case mode: ' + mode);
    applyOptions(options);
    var out = m.fn(String(text));
    if (out.length !== text.length) throw new Error('Internal error: length changed');
    return out;
  }

  return { convert: convert, MODES: MODES, PRESETS: SMALL_WORD_PRESETS };
})();
