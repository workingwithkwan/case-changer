# Tests

- `tests.html` (repo root): open in any browser, 23 hand-written checks of CaseLib.
- `tests/caselib_fuzz.js`: about 6,000 checks (exact expectations, Unicode, emoji, abbreviations, URLs and emails, plus 400 random strings checked for length preservation, untouched punctuation and idempotence). Runs on any Mac without installing anything:

```bash
CASELIB="$PWD/src/CaseLib.gs" osascript -l JavaScript tests/caselib_fuzz.js
```

Expected output ends with `failures: 0`.
