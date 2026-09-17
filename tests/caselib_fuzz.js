ObjC.import('Foundation');
var src = $.NSString.stringWithContentsOfFileEncodingError($.NSString.alloc.initWithUTF8String($.NSProcessInfo.processInfo.environment.objectForKey('CASELIB').js).js, 4, null).js;
eval(src);
var fails = [], count = 0;
function eq(name, got, want) { count++; if (got !== want) fails.push(name + '\n   got:  ' + JSON.stringify(got) + '\n   want: ' + JSON.stringify(want)); }
var C = CaseLib.convert;
var MODES = Object.keys(CaseLib.MODES);

// 1. Exact expectations
eq('upper basic', C('hello world', 'upper'), 'HELLO WORLD');
eq('lower basic', C('HELLO World', 'lower'), 'hello world');
eq('sentence basic', C('the quick brown fox. jumps over! the lazy dog? yes', 'sentence'), 'The quick brown fox. Jumps over! The lazy dog? Yes');
eq('sentence i pronoun', C('yesterday i said i would. i did', 'sentence'), 'Yesterday I said I would. I did');
eq('sentence newline', C('first line\nsecond line', 'sentence'), 'First line\nSecond line');
eq('sentence from caps', C('THIS IS SHOUTING. STOP IT', 'sentence'), 'This is shouting. Stop it');
eq('sentence e.g.', C('e.g. this one. and that', 'sentence'), 'E.g. this one. And that');
eq('sentence i.e.', C('use it, i.e. now. ok', 'sentence'), 'Use it, i.e. now. Ok');
eq('sentence initials', C('meet j. k. rowling. she wrote', 'sentence'), 'Meet j. k. rowling. She wrote');
eq('sentence U.S.', C('THE U.S. TEAM WON. GREAT', 'sentence'), 'The u.s. team won. Great');
eq('sentence i pronoun still', C('what i said. i meant it', 'sentence'), 'What I said. I meant it');
eq('sentence i at end', C('so did i', 'sentence'), 'So did I');
eq('sentence url intact', C('visit www.case-changer.app today. thanks', 'sentence'), 'Visit www.case-changer.app today. Thanks');
eq('sentence email intact', C('MAIL SUPPORT@CASE-CHANGER.APP NOW. OK', 'sentence'), 'Mail SUPPORT@CASE-CHANGER.APP now. Ok');
eq('sentence decimal', C('it costs 3.5 dollars. cheap', 'sentence'), 'It costs 3.5 dollars. Cheap');
eq('sentence version', C('use v1.2 now. done', 'sentence'), 'Use v1.2 now. Done');
eq('sentence question inside token', C('why?not. next', 'sentence'), 'Why?not. Next');
eq('sentence still ends at space', C('end here. next one', 'sentence'), 'End here. Next one');
eq('sentence ends before quote', C('he said "go." then left', 'sentence'), 'He said "go." Then left');
eq('sentence ends at newline', C('line one\nline two', 'sentence'), 'Line one\nLine two');
eq('title url', C('visit https://Example.com/Path now', 'title'), 'Visit https://Example.com/Path Now');
eq('title www', C('see www.case-changer.app for help', 'title'), 'See www.case-changer.app for Help');
eq('title domain', C('go to case-changer.app today', 'title'), 'Go to case-changer.app Today');
eq('capitalize email', C('email support@case-changer.app now', 'capitalize'), 'Email support@case-changer.app Now');
eq('title plain dot word', C('end of sentence. next one', 'title'), 'End of Sentence. Next One');
eq('sentence leading space', C('  hello there. bye', 'sentence'), '  Hello there. Bye');
eq('sentence quote start', C('"hello," she said. "bye."', 'sentence'), '"Hello," she said. "Bye."');
eq('title basic', C('the lord of the rings', 'title'), 'The Lord of the Rings');
eq('title last word', C('what we are fighting for', 'title'), 'What We Are Fighting For');
eq('title after colon', C('star wars: the empire strikes back', 'title'), 'Star Wars: The Empire Strikes Back');
eq('title hyphen', C('state-of-the-art design', 'title'), 'State-Of-The-Art Design');
eq('title apostrophe', C("don't stop believin'", 'title'), "Don't Stop Believin'");
eq('title from caps', C('MINISTRY OF HEALTH MALAYSIA', 'title'), 'Ministry of Health Malaysia');
eq('capitalize basic', C('hello big wide world', 'capitalize'), 'Hello Big Wide World');
eq('capitalize of', C('lord of the rings', 'capitalize'), 'Lord Of The Rings');
eq('capitalize digits', C('3rd place and 2nd', 'capitalize'), '3rd Place And 2nd');
eq('inverse basic', C('Hello World', 'inverse'), 'hELLO wORLD');
eq('inverse digits', C('abc 123 XYZ', 'inverse'), 'ABC 123 xyz');
eq('alternating basic', C('hello world', 'alternating'), 'hElLo WoRlD');
eq('alternating skips non-letters', C('a-b c', 'alternating'), 'a-B c');
eq('alternating from caps', C('HELLO', 'alternating'), 'hElLo');
eq('unicode upper', C('café résumé naïve', 'upper'), 'CAFÉ RÉSUMÉ NAÏVE');
eq('unicode lower', C('ÉCOLE ÜBER', 'lower'), 'école über');
eq('unicode title', C('émile zola et les misérables', 'title'), 'Émile Zola Et Les Misérables');
eq('malay', C('selamat pagi kuala lumpur', 'title'), 'Selamat Pagi Kuala Lumpur');
eq('sharp s kept', C('straße', 'upper'), 'STRAßE');
eq('sharp s length', C('straße', 'upper').length, 6);
eq('turkish dotted I lower length', C('İstanbul', 'lower').length, 8);
eq('cjk unchanged', C('你好 world', 'upper'), '你好 WORLD');
eq('emoji unchanged', C('hello 😀 world', 'upper'), 'HELLO 😀 WORLD');
eq('emoji length', C('hello 😀 world', 'alternating').length, 'hello 😀 world'.length);
eq('empty', C('', 'upper'), '');
eq('spaces only', C('   ', 'title'), '   ');
eq('punct only', C('!!! ??? ...', 'sentence'), '!!! ??? ...');
eq('numbers only', C('2026-09-15', 'title'), '2026-09-15');
eq('url lower', C('Visit HTTPS://Example.COM/Path', 'lower'), 'visit https://example.com/path');
eq('email title', C('mail me at foo@bar.com today', 'title'), 'Mail Me at foo@bar.com Today');
eq('tabs kept', C('a\tb\tc', 'upper'), 'A\tB\tC');
eq('crlf sentence', C('one.\r\ntwo', 'sentence'), 'One.\r\nTwo');
count++; try { C('abc','nope'); fails.push('unknown mode did not throw'); } catch (e) { /* expected */ }

// 1b. Options: acronyms and language presets
var KA={keepAcronyms:true}, NA={keepAcronyms:false};
eq('acronym sentence kept', C('the NASA and KL teams met. UMNO too', 'sentence', KA), 'The NASA and KL teams met. UMNO too');
eq('acronym sentence off', C('the NASA and KL teams met', 'sentence', NA), 'The nasa and kl teams met');
eq('acronym title kept', C('a guide to HTML and CSS', 'title', KA), 'A Guide to HTML and CSS');
eq('acronym capitalize kept', C('covid-19 and COVID19 rules', 'capitalize', KA), 'Covid-19 And COVID19 Rules');
eq('shouting is fixed', C('THIS IS SHOUTING AND SHOULD BE FIXED', 'sentence', KA), 'This is shouting and should be fixed');
eq('short all-caps kept', C('KL', 'sentence', KA), 'KL');
eq('long caps word not acronym', C('the MINISTRY said', 'sentence', KA), 'The ministry said');
eq('mixed heading kept', C('NASA HQ visit report', 'title', KA), 'NASA HQ Visit Report');
eq('acronym list treated as shouting', C('NASA KL UMNO', 'sentence', KA), 'Nasa kl umno');
eq('two caps words not shouting', C('NASA KL', 'sentence', KA), 'NASA KL');
eq('caps run with long word is shouting', C('MESYUARAT AGUNG TAHUNAN: cadangan dan keputusan', 'title', {language:'ms'}), 'Mesyuarat Agung Tahunan: Cadangan dan Keputusan');
eq('caps run short words kept', C('visit NASA HQ soon', 'title', KA), 'Visit NASA HQ Soon');
eq('caps run mixed keeps separate acronym', C('the ANNUAL REPORT by KL staff', 'sentence', KA), 'The annual report by KL staff');
eq('caps run short total kept', C('see COVID HTML notes', 'sentence', KA), 'See COVID HTML notes');
eq('caps run unesco kept', C('at UNESCO HQ today', 'sentence', KA), 'At UNESCO HQ today');
eq('please note fixed', C('PLEASE NOTE the change', 'sentence', KA), 'Please note the change');
eq('run fixed but lone acronym kept (en)', C('MESYUARAT AGUNG TAHUNAN oleh jabatan DBP', 'title'), 'Mesyuarat Agung Tahunan Oleh Jabatan DBP');
eq('run fixed but lone acronym kept (ms)', C('MESYUARAT AGUNG TAHUNAN oleh jabatan DBP', 'title', {language:'ms'}), 'Mesyuarat Agung Tahunan oleh Jabatan DBP');
eq('mostly caps singles is shouting', C('ONE big TWO big SIX', 'sentence', KA), 'One big two big six');
eq('single cap letter not acronym', C('plan A failed', 'sentence', KA), 'Plan a failed');
eq('acronym default on', C('the NASA team', 'sentence'), 'The NASA team');
eq('upper unaffected by acronyms', C('the NASA team', 'upper', KA), 'THE NASA TEAM');
eq('malay preset', C('kementerian kesihatan dan kebajikan di malaysia', 'title', {language:'ms'}), 'Kementerian Kesihatan dan Kebajikan di Malaysia');
eq('malay preset last word', C('cinta dan', 'title', {language:'ms'}), 'Cinta Dan');
eq('english default keeps dan capital', C('rock dan roll', 'title'), 'Rock Dan Roll');
eq('extra words', C('song of ice dan fire', 'title', {language:'en', extraSmallWords:'dan, fire'}), 'Song of Ice dan Fire');
eq('unknown language falls back', C('lord of the rings', 'title', {language:'xx'}), 'Lord of the Rings');
eq('options do not leak', C('the NASA team', 'sentence', NA) === 'The nasa team' && C('the NASA team', 'sentence') === 'The NASA team', true);

// 1c. 1.3: snake_case, kebab-case, more languages, Turkish and Greek
eq('snake basic', C('Hello World', 'snake'), 'hello_world');
eq('snake hyphen joins', C('case-changer app', 'snake'), 'case_changer_app');
eq('snake double space', C('a  b', 'snake'), 'a__b');
eq('snake keeps tabs and newlines', C('a b\tc\nD e', 'snake'), 'a_b\tc\nd_e');
eq('snake nbsp', C('a\u00a0b', 'snake'), 'a_b');
eq('snake punctuation kept', C('Hello, World!', 'snake'), 'hello,_world!');
eq('kebab basic', C('Hello World', 'kebab'), 'hello-world');
eq('kebab underscore joins', C('my_var name', 'kebab'), 'my-var-name');
eq('kebab of snake', C(C('Some Name Here', 'snake'), 'kebab'), 'some-name-here');
eq('snake of kebab', C(C('Some Name Here', 'kebab'), 'snake'), 'some_name_here');
eq('snake unicode', C('Kuala Lumpur ÉTÉ', 'snake'), 'kuala_lumpur_été');
eq('snake label', CaseLib.MODES.snake.label + ' ' + CaseLib.MODES.kebab.label, 'snake_case kebab-case');
eq('modes count', Object.keys(CaseLib.MODES).length, 9);
eq('languages listed', CaseLib.LANGUAGES.length, 12);
count++; CaseLib.LANGUAGES.forEach(function (l) { if (!CaseLib.PRESETS.hasOwnProperty(l[0])) fails.push('language without preset: ' + l[0]); });
eq('spanish preset', C('el señor de los anillos y la comunidad del anillo', 'title', {language:'es'}), 'El Señor de los Anillos y la Comunidad del Anillo');
eq('french preset', C('le fabuleux destin d\'amélie poulain et les autres', 'title', {language:'fr'}), 'Le Fabuleux Destin D\'amélie Poulain et les Autres');
eq('german preset', C('der herr der ringe und die gefährten', 'title', {language:'de'}), 'Der Herr der Ringe und die Gefährten');
eq('portuguese preset', C('o senhor dos anéis e a sociedade do anel', 'title', {language:'pt'}), 'O Senhor dos Anéis e a Sociedade do Anel');
eq('italian preset', C('il signore degli anelli e la compagnia dell\'anello', 'title', {language:'it'}), 'Il Signore degli Anelli e la Compagnia Dell\'anello');
eq('dutch preset', C('in de ban van de ring en het gezelschap', 'title', {language:'nl'}), 'In de Ban van de Ring en het Gezelschap');
eq('tagalog preset', C('ang panginoon ng mga singsing at ang kapatiran', 'title', {language:'tl'}), 'Ang Panginoon ng mga Singsing at ang Kapatiran');
eq('turkish preset', C('yüzüklerin efendisi ve yüzük kardeşliği', 'title', {language:'tr'}), 'Yüzüklerin Efendisi ve Yüzük Kardeşliği');
eq('greek preset', C('ο άρχοντας των δαχτυλιδιών και η συντροφιά', 'title', {language:'el'}), 'Ο Άρχοντας των Δαχτυλιδιών και η Συντροφιά');
eq('i pronoun english only', C('what i said', 'sentence', {language:'nl'}) + '|' + C('what i said', 'sentence', {language:'en'}) + '|' + C('what i said', 'sentence', {language:'tr'}), 'What i said|What I said|What i said');
eq('i pronoun default en', C('so i went', 'sentence'), 'So I went');
eq('greek final sigma lower', C('ΟΔΥΣΣΕΥΣ ΚΑΙ ΣΟΦΙΑ', 'lower'), 'οδυσσευς και σοφια');
eq('greek final sigma sentence', C('ΟΔΥΣΣΕΥΣ ΗΤΑΝ ΕΔΩ. ΝΑΙ', 'sentence', {keepAcronyms:false}), 'Οδυσσευς ηταν εδω. Ναι');
eq('greek final sigma capitalize', C('ΟΔΥΣΣΕΥΣ ΣΟΦΟΣ', 'capitalize', {keepAcronyms:false}), 'Οδυσσευς Σοφος');
eq('greek sigma alone', C('Σ', 'lower'), 'σ');
eq('greek sigma before punctuation', C('ΟΔΥΣΣΕΥΣ, ΝΑΙ', 'lower'), 'οδυσσευς, ναι');
eq('greek upper of final sigma', C('οδυσσευς', 'upper'), 'ΟΔΥΣΣΕΥΣ');
eq('greek inverse', C('ΟΔΥΣΣΕΥΣ', 'inverse'), 'οδυσσευς');
eq('greek not in en', C('ΟΔΥΣΣΕΥΣ', 'lower', {language:'en'}), 'οδυσσευς');
eq('turkish lower I', C('ISPARTA IĞDIR', 'lower', {language:'tr'}), 'ısparta ığdır');
eq('turkish lower dotted', C('İZMİR', 'lower', {language:'tr'}), 'izmir');
eq('turkish upper i', C('izmir istanbul', 'upper', {language:'tr'}), 'İZMİR İSTANBUL');
eq('turkish upper dotless', C('ısparta', 'upper', {language:'tr'}), 'ISPARTA');
eq('turkish title', C('istanbul ve izmir', 'title', {language:'tr'}), 'İstanbul ve İzmir');
eq('turkish sentence', C('ISPARTA GÜZEL. İZMİR DE', 'sentence', {language:'tr', keepAcronyms:false}), 'Isparta güzel. İzmir de');
eq('turkish roundtrip', C(C('istanbul ısparta', 'upper', {language:'tr'}), 'lower', {language:'tr'}), 'istanbul ısparta');
eq('english I lower stays i', C('ISTANBUL', 'lower'), 'istanbul');
eq('english dotted I lowers to i', C('İstanbul', 'lower'), 'istanbul');
eq('english i upper stays I', C('istanbul', 'upper'), 'ISTANBUL');
eq('language does not leak', C('istanbul', 'upper', {language:'tr'}) === 'İSTANBUL' && C('istanbul', 'upper') === 'ISTANBUL', true);

// 1d. 1.5: never-change words, proper nouns, auto language, cycle
var PW={protectedWords:'iPhone eBay, macOS; PETRONAS'};
eq('never-change title', C('my new iphone and EBAY account on MACOS', 'title', PW), 'My New iPhone and eBay Account on macOS');
eq('never-change upper', C('my new iphone', 'upper', PW), 'MY NEW iPhone');
eq('never-change lower', C('PETRONAS TOWERS', 'lower', PW), 'PETRONAS towers');
eq('never-change sentence start', C('iphone sales rose. ebay too', 'sentence', PW), 'iPhone sales rose. eBay too');
eq('never-change snake', C('My iPhone Case', 'snake', PW), 'my_iPhone_case');
eq('never-change whole word only', C('iphones and myiphone', 'upper', PW), 'IPHONES AND MYIPHONE');
eq('never-change next to punctuation', C('(iphone), "ebay"!', 'upper', PW), '(iPhone), "eBay"!');
eq('never-change not in inverse', C('iphone', 'inverse', PW), 'IPHONE');
eq('never-change empty list', C('iphone', 'upper', {protectedWords:'  ,; '}), 'IPHONE');
eq('never-change does not leak', C('iphone', 'upper', PW) + C('iphone', 'upper'), 'iPhoneIPHONE');
eq('proper nouns sentence', C("see you on monday in kuala lumpur. i'm ready, i've said i'll go and i'd like that", 'sentence'), "See you on Monday in Kuala Lumpur. I'm ready, I've said I'll go and I'd like that");
eq('proper nouns ambiguous left', C('you may go in march. we meet in may', 'sentence'), 'You may go in march. We meet in may');
eq('proper nouns off', C('see you on monday', 'sentence', {properNouns:false}), 'See you on monday');
eq('proper nouns malay', C('mesyuarat pada hari isnin di johor bahru', 'sentence', {language:'ms'}), 'Mesyuarat pada hari Isnin di Johor Bahru');
eq('proper nouns indonesian', C('rapat pada hari senin di jakarta', 'sentence', {language:'id'}), 'Rapat pada hari Senin di Jakarta');
eq('proper nouns not malay days in english', C('the isnin file', 'sentence'), 'The isnin file');
eq('proper nouns only sentence', C('see you on monday', 'lower'), 'see you on monday');
eq('proper nouns with caps input', C('SEE YOU ON MONDAY IN PARIS', 'sentence'), 'See you on Monday in Paris');
eq('auto title malay', C('laporan tahunan dan cadangan untuk jabatan di putrajaya', 'title', {language:'auto', fallbackLanguage:'en'}), 'Laporan Tahunan dan Cadangan untuk Jabatan di Putrajaya');
eq('auto title english in malay account', C('the lord of the rings and the return of the king', 'title', {language:'auto', fallbackLanguage:'ms'}), 'The Lord of the Rings and the Return of the King');
eq('auto short falls back', C('rock dan roll', 'title', {language:'auto', fallbackLanguage:'ms'}), 'Rock dan Roll');
eq('auto short falls back en', C('rock dan roll', 'title', {language:'auto', fallbackLanguage:'en'}), 'Rock Dan Roll');
eq('auto i pronoun only english', C('dan saya tidak tahu yang i itu untuk apa', 'sentence', {language:'auto', fallbackLanguage:'en'}), 'Dan saya tidak tahu yang i itu untuk apa');
eq('detect exposed', CaseLib.detectLanguage('the cat and the dog are with you', 'ms'), 'en');
eq('cycle from mixed', CaseLib.nextCycleMode('Hello World'), 'upper');
eq('cycle from upper', CaseLib.nextCycleMode('HELLO WORLD 123'), 'lower');
eq('cycle from lower', CaseLib.nextCycleMode('hello world'), 'title');
eq('cycle no letters', CaseLib.nextCycleMode('123 !!'), 'upper');
eq('cycle full loop', (function () { var t = 'Hello big World', seen = []; for (var i = 0; i < 3; i++) { var m = CaseLib.nextCycleMode(t); seen.push(m); t = C(t, m); } return seen.join('>'); })(), 'upper>lower>title');

// 2. Invariants on a corpus + fuzz
var corpus = ['', 'a', 'A', ' ', 'hello', 'Hello, World!', 'the quick brown fox.', 'ÀÉÎÕÜ àéîõü', 'straße Straße STRASSE',
  'İstanbul ıi', 'ﬁ ligature', 'é combining', '😀 emoji 🇲🇾 flags 👨‍👩‍👧 zwj', '你好，世界', 'مرحبا بالعالم', 'Привет мир',
  'tab\there\nnew\r\nline', '  leading and trailing  ', 'MiXeD cAsE tExT 123', "it's o'clock don't", 'a-b-c d_e_f',
  '"quoted" (parens) [brackets] {braces}', 'ΟΔΥΣΣΕΥΣ ΣΟΦΙΑ σοφός', 'İSTANBUL ısparta', 'x'.repeat(5000), 'word '.repeat(1000)];
var rnd = 12345; function rand() { rnd = (rnd * 1103515245 + 12345) & 0x7fffffff; return rnd / 0x7fffffff; }
var alphabet = 'abcXYZ éÉßİı你😀ΣσςΑ .!?\n\t\'"-_:0129';
for (var f = 0; f < 400; f++) { var n = Math.floor(rand() * 40), s = ''; for (var k = 0; k < n; k++) s += alphabet[Math.floor(rand() * alphabet.length)]; corpus.push(s); }
corpus.forEach(function (s, idx) {
  MODES.forEach(function (m) {
    var out = C(s, m);
    count++;
    if (typeof out !== 'string') fails.push('non-string ' + m + ' #' + idx);
    else if (out.length !== s.length) fails.push('LENGTH CHANGED ' + m + ' #' + idx + ' ' + JSON.stringify(s.slice(0, 40)) + ' -> ' + JSON.stringify(out.slice(0, 40)));
    // non-letters must be untouched (snake and kebab may only turn space, nbsp, - and _ into their joiner)
    var joiner = m === 'snake' ? '_' : m === 'kebab' ? '-' : null;
    for (var i = 0; i < s.length; i++) {
      if (/\p{L}/u.test(s[i]) || s[i] === out[i]) continue;
      if (joiner && out[i] === joiner && /[ \u00a0_-]/.test(s[i])) continue;
      fails.push('NON-LETTER CHANGED ' + m + ' #' + idx + ' at ' + i); break;
    }
    // idempotence for the deterministic modes
    if (m !== 'inverse' && m !== 'alternating' && !/İ/.test(s)) { count++; if (C(out, m) !== out) fails.push('NOT IDEMPOTENT ' + m + ' #' + idx + ' ' + JSON.stringify(s.slice(0, 40))); }
  });
  MODES.forEach(function (m) { count++; var o = C(s, m, {language:'auto', fallbackLanguage:'tr', protectedWords:'abc XYZ é', properNouns:true}); if (o.length !== s.length) fails.push('LENGTH CHANGED with 1.5 options ' + m + ' #' + idx); });
  count++; if (C(C(s, 'inverse'), 'inverse') !== s && !/[ßİıﬁΣσς]/.test(s)) fails.push('INVERSE NOT INVOLUTION #' + idx + ' ' + JSON.stringify(s.slice(0, 40)));
  count++; if (C(C(s, 'upper'), 'lower') !== C(s, 'lower') && !/[ßİıﬁΣσς]/.test(s)) fails.push('UPPER->LOWER != LOWER #' + idx + ' ' + JSON.stringify(s.slice(0, 40)));
});
// 2b. Sigma round trip on real words (final form only at word ends)
['ΟΔΥΣΣΕΥΣ ΣΟΦΙΑ', 'Σοφός Οδυσσεύς', 'ΝΑΙ ΚΑΙ ΟΧΙ'].forEach(function (g) { eq('sigma roundtrip ' + g, C(C(g, 'lower'), 'upper'), C(g, 'upper')); eq('sigma involution ' + g, C(C(C(g, 'lower'), 'inverse'), 'inverse'), C(g, 'lower')); });
// 3. Performance
var t0 = Date.now(); C('The quick brown fox jumps over the lazy dog. '.repeat(2000), 'title'); var ms = Date.now() - t0;
count++; if (ms > 2000) fails.push('SLOW title on 90k chars: ' + ms + 'ms');
'checks: ' + count + ', failures: ' + fails.length + (fails.length ? '\n' + fails.join('\n') : '') + '\n(title on 90k chars: ' + ms + 'ms)';
