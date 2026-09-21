# Release 1.5.1: language audit fixes

Status 21 September 2026: written, tested, on the Apps Script head (commit 2a63c13). Not deployed: Version 4 (1.4 + 1.5) is in Marketplace review and the listing is locked. Ship as the next version once that review finishes.

## Why

With no native speakers to proofread, the translations were checked against Google's own help pages in each language (`support.google.com/docs/answer/2942256?hl=xx` for menus and product names, `answer/1663349?hl=xx` for the capitalisation menu). The same "is this word really what it seems in that language?" question was then put to the engine's word lists.

## What changed

Interface wording
- **Menu name.** The tip said "Extensions > Case Changer" in every language, but the menu is Sambungan (ms), Ekstensi (id), Extensiones (es), Erweiterungen (de), Extensões (pt), Estensioni (it), Uitbreidingen (nl), Uzantılar (tr), Επεκτάσεις (el). French and English use "Extensions". Filipino has no localised help page, so Tagalog keeps "Extensions".
- **Product names.** "Sheets" and "Slides" replaced by the names Google uses: Hojas de cálculo / Presentaciones (es), Tabellen / Präsentationen (de), Planilhas (pt, Slides stays), Fogli / Presentazioni (it), Spreadsheets / Presentaties (nl), E-Tablolar / Slaytlar (tr), Υπολογιστικά φύλλα / Παρουσιάσεις (el), Spreadsheet / Slide (id). French, Malay and Tagalog keep the English names, as Google does.
- **French add-on** is "module complémentaire", not "module".
- **Two style labels aligned with Google's own menu**: Dutch "Elk Woord Met Een Hoofdletter", Indonesian "Huruf Besar Tiap Awal Kata". UPPERCASE and lowercase already matched Google word for word in es, fr, de, it, nl and id.
- **Duplicate "Help".** Google adds its own Help item to every add-on menu, so ours showed twice. Ours is now "How it works" (translated).

Engine word lists
- **Ambiguous proper nouns removed**: perak (silver) for ms and id; china, argentina, chile for es; porto for pt; hapon (afternoon) for tl; τρίτη, τετάρτη, πέμπτη (also the ordinals third, fourth, fifth) for el.
- **Place names that are only safe as a phrase** are now matched as phrases: Kuala Lumpur ("lumpur" alone is mud), Johor Bahru, Kota Kinabalu, Pulau Pinang, New York, Hong Kong, United Kingdom and others. "a new plan for york" stays lowercase.

Listing translations
- `LISTING_TRANSLATIONS.md` has the corrected menu names. The listings submitted on 21 September still say "Extensions"; paste the corrected descriptions at the next listing edit.

## Tests

- `caselib_fuzz.js`: 10,564 checks, 0 failures. New: 14 ambiguity cases, 10 awkward never-change inputs (regex characters, 7-Eleven, possessives, overlaps, Turkish), and two speed guards (200 protected words over 60,000 characters; Auto language over 100,000 characters).
- `language_words.js`: 1,892,816 checks, 0 failures. `strings_check.js`: 12 languages, 0 failures.
- Live in Docs through the dry-run deployment: "The road to Kuala Lumpur was full of lumpur on Monday. We flew to New York with a new plan"; Preview in all nine styles; menu shows "How it works" above Google's Help.

## Not changed, on purpose

- "with" is capitalised in English Title Case (only prepositions of three letters or fewer stay small). Users who prefer otherwise can add it under Settings.
- German Sentence case lowercases nouns. Correct German capitalisation needs a dictionary, which the add-on does not have.
