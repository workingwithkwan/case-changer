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

// 2. Invariants on a corpus + fuzz
var corpus = ['', 'a', 'A', ' ', 'hello', 'Hello, World!', 'the quick brown fox.', 'ÀÉÎÕÜ àéîõü', 'straße Straße STRASSE',
  'İstanbul ıi', 'ﬁ ligature', 'é combining', '😀 emoji 🇲🇾 flags 👨‍👩‍👧 zwj', '你好，世界', 'مرحبا بالعالم', 'Привет мир',
  'tab\there\nnew\r\nline', '  leading and trailing  ', 'MiXeD cAsE tExT 123', "it's o'clock don't", 'a-b-c d_e_f',
  '"quoted" (parens) [brackets] {braces}', 'x'.repeat(5000), 'word '.repeat(1000)];
var rnd = 12345; function rand() { rnd = (rnd * 1103515245 + 12345) & 0x7fffffff; return rnd / 0x7fffffff; }
var alphabet = 'abcXYZ éÉßİı你😀 .!?\n\t\'"-:0129';
for (var f = 0; f < 400; f++) { var n = Math.floor(rand() * 40), s = ''; for (var k = 0; k < n; k++) s += alphabet[Math.floor(rand() * alphabet.length)]; corpus.push(s); }
corpus.forEach(function (s, idx) {
  MODES.forEach(function (m) {
    var out = C(s, m);
    count++;
    if (typeof out !== 'string') fails.push('non-string ' + m + ' #' + idx);
    else if (out.length !== s.length) fails.push('LENGTH CHANGED ' + m + ' #' + idx + ' ' + JSON.stringify(s.slice(0, 40)) + ' -> ' + JSON.stringify(out.slice(0, 40)));
    // non-letters must be untouched
    for (var i = 0; i < s.length; i++) { if (!/\p{L}/u.test(s[i]) && s[i] !== out[i]) { fails.push('NON-LETTER CHANGED ' + m + ' #' + idx + ' at ' + i); break; } }
    // idempotence for the deterministic modes
    if (m !== 'inverse' && m !== 'alternating' && !/İ/.test(s)) { count++; if (C(out, m) !== out) fails.push('NOT IDEMPOTENT ' + m + ' #' + idx + ' ' + JSON.stringify(s.slice(0, 40))); }
  });
  count++; if (C(C(s, 'inverse'), 'inverse') !== s && !/[ßİıﬁ]/.test(s)) fails.push('INVERSE NOT INVOLUTION #' + idx + ' ' + JSON.stringify(s.slice(0, 40)));
  count++; if (C(C(s, 'upper'), 'lower') !== C(s, 'lower') && !/[ßİıﬁ]/.test(s)) fails.push('UPPER->LOWER != LOWER #' + idx + ' ' + JSON.stringify(s.slice(0, 40)));
});
// 3. Performance
var t0 = Date.now(); C('The quick brown fox jumps over the lazy dog. '.repeat(2000), 'title'); var ms = Date.now() - t0;
count++; if (ms > 2000) fails.push('SLOW title on 90k chars: ' + ms + 'ms');
'checks: ' + count + ', failures: ' + fails.length + (fails.length ? '\n' + fails.join('\n') : '') + '\n(title on 90k chars: ' + ms + 'ms)';
