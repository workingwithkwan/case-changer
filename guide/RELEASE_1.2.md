# Case Changer 1.2: acronyms, Title Case words, whole-file mode

Status 16 September 2026: built, loaded into the Apps Script project and tested through the test deployment. Ships together with 1.1 (Sheets and Slides) once the 1.0.1 listing review is done.

## What changed

- **Keep acronyms** (default on): Sentence case, Title Case and Capitalize Each Word leave words of 2 to 6 capital letters alone (NASA, KL, UMNO, HTML, COVID). Off automatically when the text is shouting, meaning three or more words and at least 60% of them all in capitals, so "THIS IS SHOUTING" still gets fixed. Toggle in the sidebar Settings.
- **Title Case small words**: preset for English, Bahasa Malaysia and Bahasa Indonesia, plus a box for extra words. Sidebar Settings, remembered per user.
- **Whole-file mode**: with nothing selected, the menu asks "Nothing is selected. Change the entire document / sheet / presentation instead?" and the sidebar shows a button for it. Docs converts body, header and footer; Sheets converts every text cell on the active sheet (a single blank selected cell counts as nothing selected); Slides converts every element on every slide. Speaker notes are left alone.
- **Last used** style highlighted in the sidebar on open.
- Engine fixes found by testing: a full stop, question mark or exclamation mark followed directly by a letter or digit (case-changer.app, 3.5, v1.2) no longer ends a sentence; Sentence case leaves emails and web addresses as typed.
- Settings are stored with `PropertiesService.getUserProperties()`, which needs no extra permission.

## Tested 16 September 2026

| Where | Test | Result |
|---|---|---|
| Engine | `tests/caselib_fuzz.js`, now 5,177 checks incl. acronyms, presets, extra words, shouting, URLs and decimals | 0 failures |
| Engine | `tests/language_words.js`, 1.89 million checks: every English dictionary word in all seven styles, 516 Malay and Indonesian words with the presets, accented and non-Latin words | 0 failures after one refinement: a run of two or more capital words with a long word or 10+ letters in total is treated as shouting ("MESYUARAT AGUNG TAHUNAN", "ANNUAL REPORT" get fixed; "NASA HQ", "COVID HTML" are kept) |
| Slides | "the NASA and KL teams met UMNO at HQ" to Sentence case | "The NASA and KL teams met UMNO at HQ" |
| Docs | Nothing selected, menu: prompt with "document"; Yes converts the whole document incl. the email line | Pass |
| Sheets | Blank cell selected, menu: prompt with "sheet"; Yes converts every text cell, number and date untouched | Pass |
| Slides | Nothing selected, menu: prompt with "presentation"; Yes converts both slides | Pass |
| Docs | Whole-document Sentence case with a URL and an email in the text | Pass: both addresses stay exactly as typed, "e.g." and "I" handled |
| Sidebar | Settings section renders; toggles and whole-file button | Hand test by Ikhwan pending (frame not reachable by automation) |

## Store listing additions for 1.2

Add to the detailed description bullet list:

• Keeps acronyms such as NASA or KL when you switch to Sentence case or Title Case.
• Title Case knows which small words to keep lowercase in English, Bahasa Malaysia and Bahasa Indonesia, and you can add your own.
• Nothing selected? Change the whole document, sheet or presentation in one go.
