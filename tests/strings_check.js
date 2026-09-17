// Checks every interface language: no missing keys, placeholders match English, nothing left in English by accident.
//   STRINGS="$PWD/src/Strings.gs" osascript -l JavaScript tests/strings_check.js
ObjC.import('Foundation');
eval($.NSString.stringWithContentsOfFileEncodingError($.NSProcessInfo.processInfo.environment.objectForKey('STRINGS').js, 4, null).js);
var SAME_OK = { nl: ['menu_help'], tl: ['preview'] };   // the word really is the same
var out = [], failures = 0, en = Strings.get('en');
Strings.LANGS.forEach(function (l) {
  var s = Strings.get(l), problems = [];
  Strings.KEYS.forEach(function (k) {
    var v = s[k];
    if (!v) { problems.push('missing ' + k); return; }
    var want = (en[k].match(/\{\w+\}/g) || []).sort().join(), got = (v.match(/\{\w+\}/g) || []).sort().join();
    if (want !== got) problems.push('placeholders differ in ' + k);
    if (l !== 'en' && v === en[k] && !/^style_(snake|kebab)$/.test(k) && (SAME_OK[l] || []).indexOf(k) < 0) problems.push('still English: ' + k);
    if (/^style_/.test(k) && v.length > 40) problems.push('style label too long: ' + k);
    if (/^menu_/.test(k) && v.length > 45) problems.push('menu label too long: ' + k);
  });
  if (Strings.format(s.msg_changed, { style: 'X' }).indexOf('{') >= 0) problems.push('format failed');
  failures += problems.length;
  out.push(l + ': ' + (problems.length ? problems.join('; ') : 'ok (' + Strings.KEYS.length + ' strings)'));
});
out.join('\n') + '\nlanguages: ' + Strings.LANGS.length + ', failures: ' + failures;
