# Release 1.5.1: language audit fixes

Status 22 September 2026, 11:55pm: APPROVED and LIVE (Version 5; public listing shows the corrected translations). Commit 9c2d4a3 loaded into the Apps Script project ("Saved to Drive" confirmed), Version 5 "v1.5.1 language audit and rating prompt" deployed, App Configuration on version 5 for Docs, Sheets and Slides (confirmed after reload), the five translated listings (id, es, pt-BR, fr, de) replaced with the corrected text (confirmed after reload), review submitted.

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
- `LISTING_TRANSLATIONS.md` has the corrected menu names. The corrected descriptions went live with this release on 22 September.

## Tests

- `caselib_fuzz.js`: 10,564 checks, 0 failures. New: 14 ambiguity cases, 10 awkward never-change inputs (regex characters, 7-Eleven, possessives, overlaps, Turkish), and two speed guards (200 protected words over 60,000 characters; Auto language over 100,000 characters).
- `language_words.js`: 1,892,816 checks, 0 failures. `strings_check.js`: 12 languages, 0 failures.
- Live in Docs through the dry-run deployment: "The road to Kuala Lumpur was full of lumpur on Monday. We flew to New York with a new plan"; Preview in all nine styles; menu shows "How it works" above Google's Help.
- Release-day check (22 September, commit 9c2d4a3): Sentence case on "the road to kuala lumpur passes through johor bahru. the NASA team met the ceo of petronas in new york." gave Kuala Lumpur, Johor Bahru and New York; NASA came out lowercase only because the test account has "Keep acronyms" switched off (the engine with the default setting keeps NASA). Sidebar shows the rating line with "Rate it" and "Not now". The browser automation cannot click inside the sidebar frame, so the "Not now" click was not exercised live; the handler is three lines (hide the box, save `rateDone`).

## Also in 1.5.1: rating prompt

After the tenth use (the per-style counts already stored in the user's settings), the sidebar shows one quiet line: "Finding it useful? A short review on the Marketplace helps others find it." with "Rate it" (opens the listing) and "Not now". Either click sets `rateDone` and the line never returns. Translated into all twelve languages. No tracking, nothing leaves the user's account.

## Release checklist

1. Apps Script editor: load Code.gs, Strings.gs, CaseLib.gs, Sidebar.html from commit 9c2d4a3 (fetch by SHA into Monaco), click the save icon, confirm "Saved to Drive".
2. Dry-run test in a Doc: Sentence case on "the road to kuala lumpur was full of lumpur", menu shows "How it works", sidebar Preview; the rating line appears after ten uses (the test account is already past ten).
3. Deploy > Manage deployments > Edit > New version "v1.5.1 language audit and rating prompt". App Configuration: version 5 for Docs, Sheets and Slides, Save Draft, confirm after reload.
4. Store Listing: expand each of the five translated language panels and paste the corrected detailed description from LISTING_TRANSLATIONS.md (menu names). Save Draft, confirm after reload, SUBMIT FOR REVIEW.

## Not changed, on purpose

- "with" is capitalised in English Title Case (only prepositions of three letters or fewer stay small). Users who prefer otherwise can add it under Settings.
- German Sentence case lowercases nouns. Correct German capitalisation needs a dictionary, which the add-on does not have.
