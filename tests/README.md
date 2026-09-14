# Tests

- `tests.html` (repo root): open in any browser, 23 hand-written checks of CaseLib.
- `tests/caselib_fuzz.js`: about 6,000 checks (exact expectations, Unicode, emoji, abbreviations, URLs and emails, plus 400 random strings checked for length preservation, untouched punctuation and idempotence). Runs on any Mac without installing anything:

```bash
CASELIB="$PWD/src/CaseLib.gs" osascript -l JavaScript tests/caselib_fuzz.js
```

Expected output ends with `failures: 0`.

- `tests/language_words.js`: word-level suite. Every English word in the Mac dictionary (about 236,000), 260 Bahasa Malaysia and 256 Bahasa Indonesia words including the Title Case presets, real Malay and Indonesian titles and sentences, and 62 accented words from French, Spanish, German, Portuguese, Vietnamese, Danish, Turkish, Polish, Greek, Russian and Ukrainian. About 1.9 million checks, roughly 40 seconds:

```bash
CASELIB="$PWD/src/CaseLib.gs" osascript -l JavaScript tests/language_words.js
```

