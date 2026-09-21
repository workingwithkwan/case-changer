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
    id: 'dan atau di ke dari pada untuk yang dengan oleh bagi serta tentang demi',
    es: 'a al ante bajo con contra de del desde durante e el en entre hacia hasta la las lo los mediante ni o para por que según sin sobre tras u un una unas unos y',
    fr: 'à au aux avec car chez dans de des du en et la le les mais ni ou par pour sans sous sur un une vers',
    de: 'aber als am an auf aus bei bis das dem den der des die durch ein eine einem einen einer eines für gegen im in mit nach ohne oder seit sondern über um und unter vom von vor zu zum zur zwischen',
    pt: 'a à ao aos as às com da das de do dos e em mas na nas nem no nos o os ou para pela pelas pelo pelos por que sem sob sobre um uma umas uns',
    it: 'a ad agli ai al alla alle allo che col con da dagli dai dal dalla dalle dallo degli dei del della delle dello di e ed fra gli i il in la le lo ma nei negli nel nella nelle nello o per su sugli sui sul sulla sulle sullo tra un una uno',
    nl: 'aan als bij dan de door een en het in maar met naar of om onder op over te tot uit van voor want',
    tl: 'ang at ay kay kina mga na nang ng ni nina o para sa si sina',
    tr: 'ama da de fakat gibi ile için kadar ki mi mı mu mü ve veya ya',
    el: 'από για δεν η ή και με να ο οι σε στα στη στην στις στο στον στου στους στων τα της τη την τις το τον του τους των'
  };
  // Languages offered in the sidebar, in display order. 'auto' (the account
  // language) is resolved by Code.gs before the options reach convert().
  var LANGUAGES = [
    ['en', 'English'], ['ms', 'Bahasa Malaysia'], ['id', 'Bahasa Indonesia'], ['es', 'Español'],
    ['fr', 'Français'], ['de', 'Deutsch'], ['pt', 'Português'], ['it', 'Italiano'], ['nl', 'Nederlands'],
    ['tl', 'Tagalog'], ['tr', 'Türkçe'], ['el', 'Ελληνικά']
  ];
  // Distinctive everyday words used to recognise the language of a piece of
  // text (1.5). Kept separate from the Title Case presets because those share
  // many words across languages ("de", "la", "en").
  var DETECT = {
    en: 'the and of to is are was were this that with for you your not have has will from they our their would about which',
    ms: 'dan yang di ini itu untuk dengan tidak adalah akan telah kami kita mereka boleh sudah juga atau oleh pada kepada dalam ialah anda',
    es: 'el los las una que por para con no es son como más pero sus este esta del al muy también hay',
    fr: 'le les des une que est pas pour dans qui sur avec sont nous vous ce cette au aux plus mais très',
    de: 'der die das und ist nicht ein eine mit für auf dem den sich auch von zu wir sie werden oder',
    pt: 'os as uma que não para com é são como mais mas seu sua este esta do da em também muito',
    it: 'il gli una che non per con è sono come più ma della nel questo questa anche molto alla dei',
    nl: 'het een van en is niet dat op te voor met zijn er aan ook als bij naar deze wordt',
    tl: 'ang ng mga sa ay na at si ko ka ako siya kami ito para hindi may ni kay nang',
    tr: 've bir bu için ile de da ne çok daha gibi kadar ama olarak olan var değil her sonra'
  };
  var DETECT_SETS = null;
  function detectSets() {
    if (!DETECT_SETS) { DETECT_SETS = {}; for (var k in DETECT) if (DETECT.hasOwnProperty(k)) DETECT_SETS[k] = wordSet(DETECT[k]); }
    return DETECT_SETS;
  }

  // Words Sentence case capitalises because they are proper nouns (1.5).
  // Ambiguous ones are left out on purpose: may, march, polish, turkey, minggu.
  var PLACES = 'malaysia indonesia singapore brunei thailand vietnam philippines cambodia laos myanmar japan china korea india pakistan bangladesh australia america canada mexico brazil argentina england scotland wales ireland britain france germany spain portugal italy netherlands belgium switzerland austria sweden norway denmark finland poland russia ukraine greece egypt nigeria kenya africa asia europe selangor johor penang perak kedah kelantan terengganu pahang melaka sabah sarawak putrajaya labuan kuching ipoh jakarta bandung surabaya bali london paris berlin madrid rome tokyo beijing delhi dubai';
  var PROPER = {
    en: 'monday tuesday wednesday thursday friday saturday sunday january february april june july august september october november december ' +
        'english malay indonesian chinese japanese korean french german spanish portuguese italian dutch arabic hindi tamil thai vietnamese russian greek turkish tagalog filipino ' +
        'malaysian singaporean american british australian canadian european asian african indian ' +
        'christmas easter ramadan eid deepavali diwali hanukkah ' + PLACES,
    ms: 'isnin selasa rabu khamis jumaat sabtu ahad januari februari mac april mei jun julai ogos september oktober november disember ' +
        'melayu inggeris cina jepun korea perancis jerman sepanyol arab tamil islam kristian hindu buddha ramadan syawal aidilfitri aidiladha deepavali krismas ' +
        'jepun amerika britain perancis jerman belanda ' + PLACES,
    id: 'senin selasa rabu kamis jumat sabtu januari februari maret april mei juni juli agustus september oktober november desember ' +
        'indonesia inggris tionghoa jepang korea prancis jerman spanyol arab jawa sunda bali islam kristen hindu buddha ramadan lebaran natal ' +
        'jepang amerika inggris prancis jerman belanda ' + PLACES,
    tl: 'lunes martes miyerkules huwebes biyernes sabado enero pebrero marso abril mayo hunyo hulyo agosto setyembre oktubre nobyembre disyembre ' +
        'pilipinas pilipino filipino tagalog ingles kastila amerika maynila cebu davao ' + PLACES,
    el: 'δευτέρα παρασκευή σάββατο κυριακή ιανουάριος φεβρουάριος μάρτιος απρίλιος μάιος ιούνιος ιούλιος αύγουστος σεπτέμβριος οκτώβριος νοέμβριος δεκέμβριος ελλάδα αθήνα θεσσαλονίκη κύπρος ευρώπη',
    es: 'españa méxico colombia perú venezuela madrid barcelona europa américa ' + PLACES,
    fr: 'france belgique suisse canada paris lyon marseille europe afrique asie amérique allemagne espagne italie angleterre ' + PLACES,
    de: 'deutschland österreich schweiz berlin münchen hamburg europa frankreich spanien italien england ' + PLACES,
    pt: 'brasil portugal lisboa angola moçambique europa américa espanha frança alemanha itália ' + PLACES,
    it: 'italia roma milano napoli europa francia germania spagna inghilterra svizzera ' + PLACES,
    nl: 'nederland belgië amsterdam rotterdam europa duitsland frankrijk spanje italië engeland ' + PLACES,
    tr: 'türkiye istanbul ankara izmir avrupa asya almanya fransa ingiltere ' + PLACES
  };
  // Words that are a place in one language but an everyday word in another:
  // perak is silver in Malay and Indonesian; china, argentina and chile are
  // an adjective, an adjective and a pepper in Spanish; porto is a port.
  var PROPER_EXCLUDE = { ms: 'perak', id: 'perak', es: 'china argentina chile', pt: 'porto china', it: 'china', tl: 'china' };
  // Names that are only safe as a whole phrase ("lumpur" alone is mud,
  // "pinang" a nut, "new" an adjective). Matched as consecutive words.
  var PROPER_PHRASES = ['kuala lumpur', 'johor bahru', 'kota kinabalu', 'kota bharu', 'kuala terengganu', 'pulau pinang', 'shah alam',
    'george town', 'new york', 'new zealand', 'hong kong', 'sri lanka', 'saudi arabia', 'south korea', 'north korea', 'south africa',
    'united states', 'united kingdom', 'los angeles', 'san francisco', 'abu dhabi', 'timor leste', 'papua new guinea'];
  var PROPER_SETS = {};
  function properSet(lang) {
    if (!PROPER_SETS[lang]) {
      var set = wordSet(PROPER[lang] || PROPER.en), drop = wordSet(PROPER_EXCLUDE[lang]);
      for (var w in drop) if (drop.hasOwnProperty(w)) delete set[w];
      PROPER_SETS[lang] = set;
    }
    return PROPER_SETS[lang];
  }

  function wordSet(list) {
    var set = {};
    String(list || '').toLowerCase().split(/[\s,;]+/).forEach(function (w) { if (w) set[w] = 1; });
    return set;
  }
  var SMALL_WORDS = wordSet(SMALL_WORD_PRESETS.en);

  // Options accepted by convert():
  //   keepAcronyms (default true), language ('auto' or a preset key),
  //   fallbackLanguage (used by 'auto' when the text gives no clear answer),
  //   extraSmallWords ('dan di ke'), properNouns (default true),
  //   protectedWords ('iPhone eBay macOS': spelling kept in every style)
  var current = { keepAcronyms: true, smallWords: SMALL_WORDS, language: 'en', properNouns: true, protectedWords: [] };
  function applyOptions(opts, text) {
    opts = opts || {};
    var requested = opts.language;
    if (requested === 'auto') requested = detectLanguage(text, opts.fallbackLanguage);
    var lang = SMALL_WORD_PRESETS.hasOwnProperty(requested) ? requested : 'en';
    var set = wordSet(SMALL_WORD_PRESETS[lang]);
    var extra = wordSet(opts.extraSmallWords);
    for (var k in extra) if (extra.hasOwnProperty(k)) set[k] = 1;
    var keep = [];
    String(opts.protectedWords || '').split(/[\s,;]+/).forEach(function (w) { if (w && /\p{L}/u.test(w)) keep.push(w); });
    current = { keepAcronyms: opts.keepAcronyms !== false, smallWords: set, language: lang, properNouns: opts.properNouns !== false, protectedWords: keep };
  }

  // Lowercase without any language rules, for matching only.
  function plainLower(s) {
    var out = '';
    for (var i = 0; i < s.length; i++) { var l = s[i].toLowerCase(); out += l.length === 1 ? l : s[i]; }
    return out;
  }

  /**
   * Guesses the language of a piece of text from its everyday words. Needs at
   * least two hits and a clear winner, otherwise the fallback (the account
   * language) is used, so short selections behave exactly as before.
   * Turkish is only chosen when the text also has a Turkish-only letter,
   * because choosing it wrongly would turn every I into a dotless one.
   */
  function detectLanguage(text, fallback) {
    fallback = SMALL_WORD_PRESETS.hasOwnProperty(fallback) ? fallback : 'en';
    text = String(text || '');
    var letters = text.match(/\p{L}/gu) || [];
    if (!letters.length) return fallback;
    var greek = (text.match(/[\u0370-\u03ff\u1f00-\u1fff]/g) || []).length;
    if (greek >= 3 && greek * 2 > letters.length) return 'el';
    var words = plainLower(text).match(/[\p{L}'’]+/gu) || [];
    if (words.length < 3) return fallback;
    var sets = detectSets(), scores = {}, lang;
    for (lang in sets) if (sets.hasOwnProperty(lang)) scores[lang] = 0;
    for (var i = 0; i < words.length; i++) {
      for (lang in sets) if (sets.hasOwnProperty(lang) && sets[lang].hasOwnProperty(words[i])) scores[lang]++;
    }
    if (!/[ıİğĞşŞ]/.test(text)) scores.tr = 0;
    var best = null, bestScore = 0, second = 0;
    for (lang in scores) if (scores.hasOwnProperty(lang)) {
      if (scores[lang] > bestScore) { second = bestScore; bestScore = scores[lang]; best = lang; }
      else if (scores[lang] > second) second = scores[lang];
    }
    if (!best || bestScore < 2 || bestScore === second) return fallback;
    // Malay and Indonesian share their everyday words; keep whichever the account uses.
    if (best === 'ms') return fallback === 'id' ? 'id' : 'ms';
    return best;
  }

  /** Cycle case: mixed or Title text goes to UPPERCASE, UPPERCASE to lowercase, lowercase to Title Case. */
  function nextCycleMode(sample) {
    sample = String(sample || '');
    var hasUpper = false, hasLower = false;
    for (var i = 0; i < sample.length; i++) {
      var ch = sample[i];
      if (!isLetter(ch)) continue;
      if (ch !== ch.toLowerCase()) hasUpper = true;
      else if (ch !== ch.toUpperCase()) hasLower = true;
    }
    if (hasUpper && !hasLower) return 'lower';
    if (hasLower && !hasUpper) return 'title';
    return 'upper';
  }

  // Never-change words: wherever one appears in the original (any case, as a
  // whole word), the result gets the spelling from the list.
  function restoreProtectedWords(original, out) {
    var list = current.protectedWords;
    if (!list.length) return out;
    var lowered = plainLower(original), chars = null;
    for (var w = 0; w < list.length; w++) {
      var word = list[w], needle = plainLower(word);
      if (needle.length !== word.length) continue;
      var from = 0, at;
      while ((at = lowered.indexOf(needle, from)) >= 0) {
        var before = at > 0 ? lowered[at - 1] : '', after = lowered[at + needle.length] || '';
        var boundary = !(before && /[\p{L}\p{N}]/u.test(before)) && !(after && /[\p{L}\p{N}]/u.test(after));
        if (boundary) {
          if (!chars) chars = out.split('');
          for (var k = 0; k < word.length; k++) chars[at + k] = word[k];
        }
        from = at + needle.length;
      }
    }
    return chars ? chars.join('') : out;
  }

  // Proper nouns in Sentence case: days, months, languages, places.
  function capitaliseProperNouns(chars) {
    if (!current.properNouns) return chars;
    var set = properSet(current.language), text = chars.join(''), re = /\p{L}+/gu, m;
    while ((m = re.exec(text)) !== null) {
      if (set.hasOwnProperty(m[0])) chars[m.index] = up(chars[m.index]);
    }
    // Multi-word names: every word of the phrase gets its capital.
    var lowered = plainLower(text);
    for (var p = 0; p < PROPER_PHRASES.length; p++) {
      var phrase = PROPER_PHRASES[p], from = 0, at;
      while ((at = lowered.indexOf(phrase, from)) >= 0) {
        var before = at > 0 ? lowered[at - 1] : '', after = lowered[at + phrase.length] || '';
        if (!(before && /[\p{L}\p{N}]/u.test(before)) && !(after && /[\p{L}\p{N}]/u.test(after))) {
          for (var k = 0; k < phrase.length; k++) {
            if (k === 0 || phrase[k - 1] === ' ') chars[at + k] = up(chars[at + k]);
          }
        }
        from = at + phrase.length;
      }
    }
    return chars;
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
      words.push({ start: m.index, text: m[0], letters: letters, caps: allCaps });
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
      if (!word.caps || word.letters < 2 || word.letters > 6) continue;
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
  // Turkish (and Azeri) pair the dotted i with a dotted capital İ and the
  // dotless ı with a plain I, so those two mappings depend on the language.
  function up(ch) {
    if (ch === 'i' && current.language === 'tr') return 'İ';
    var u = ch.toUpperCase(); return u.length === 1 ? u : ch;
  }
  function low(ch) {
    if (ch === 'İ') return 'i';                              // toLowerCase gives "i" + combining dot
    if (ch === 'I' && current.language === 'tr') return 'ı';
    var l = ch.toLowerCase(); return l.length === 1 ? l : ch;
  }
  // Lowercase with context: a Greek capital sigma at the end of a word becomes
  // the final form ς, elsewhere σ.
  function lowAt(s, i) {
    var ch = s[i];
    if (ch === 'Σ') {
      var prevLetter = i > 0 && isLetter(s[i - 1]);
      var next = s[i + 1];
      var nextLetter = next !== undefined && isLetter(next);
      return (prevLetter && !nextLetter) ? 'ς' : 'σ';
    }
    return low(ch);
  }

  function mapChars(s, fn) {
    var out = '';
    for (var i = 0; i < s.length; i++) out += fn(s[i], i);
    return out;
  }

  function upper(s) { return mapChars(s, up); }
  function lower(s) { return mapChars(s, function (ch, i) { return lowAt(s, i); }); }

  function inverse(s) {
    return mapChars(s, function (ch, i) {
      var u = up(ch);
      return ch === u ? lowAt(s, i) : u;
    });
  }

  function alternating(s) {
    var n = 0;
    return mapChars(s, function (ch, i) {
      if (!isLetter(ch)) return ch;
      var r = (n % 2 === 0) ? lowAt(s, i) : up(ch);
      n++;
      return r;
    });
  }

  // snake_case and kebab-case: everything lowercase, and each space (or the
  // other joiner) becomes the joiner. One character per character, so a run
  // of two spaces becomes two joiners; tabs and line breaks are left alone.
  function joined(s, joiner, other) {
    var lowered = lower(s), out = '';
    for (var i = 0; i < lowered.length; i++) {
      var ch = lowered[i];
      out += (ch === ' ' || ch === '\u00a0' || ch === other) ? joiner : ch;
    }
    return out;
  }
  function snakeCase(s) { return joined(s, '_', '-'); }
  function kebabCase(s) { return joined(s, '-', '_'); }

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
    var out = lower(s).split('');
    for (var i = 0; i < s.length; i++) {
      var ch = out[i];
      var startOfWord = isLetter(ch) && (i === 0 || !isWordChar(s[i - 1]));
      if (startOfWord) out[i] = up(ch);
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
  // sentence (and after line breaks), and fix the standalone pronoun "i"
  // (English only: in Dutch, Turkish or Malay a lone "i" is not a pronoun).
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
      if (chars[i] === 'i' && current.language === 'en') {
        var prevOk = i === 0 || !isWordChar(chars[i - 1]);
        var next = chars[i + 1];
        var nextOk = next === undefined || !isWordChar(next) || next === "'" || next === '’';
        // "i.e." is not the pronoun.
        if (next === '.' && isLetter(chars[i + 2] || '')) nextOk = false;
        if (prevOk && nextOk) chars[i] = 'I';
      }
    }
    chars = capitaliseProperNouns(chars);
    return restoreAcronyms(s, restoreProtected(s, chars)).join('');
  }

  var MODES = {
    upper: { label: 'UPPERCASE', fn: upper },
    lower: { label: 'lowercase', fn: lower },
    sentence: { label: 'Sentence case', fn: sentenceCase },
    title: { label: 'Title Case', fn: titleCase },
    capitalize: { label: 'Capitalize Each Word', fn: capitalizeEachWord },
    inverse: { label: 'iNVERSE cASE', fn: inverse },
    alternating: { label: 'aLtErNaTiNg cAsE', fn: alternating },
    snake: { label: 'snake_case', fn: snakeCase },
    kebab: { label: 'kebab-case', fn: kebabCase }
  };

  function convert(text, mode, options) {
    var m = MODES[mode];
    if (!m) throw new Error('Unknown case mode: ' + mode);
    text = String(text);
    applyOptions(options, text);
    var out = m.fn(text);
    if (mode !== 'inverse' && mode !== 'alternating') out = restoreProtectedWords(text, out);
    if (out.length !== text.length) throw new Error('Internal error: length changed');
    return out;
  }

  return { convert: convert, MODES: MODES, PRESETS: SMALL_WORD_PRESETS, LANGUAGES: LANGUAGES,
           detectLanguage: detectLanguage, nextCycleMode: nextCycleMode };
})();
