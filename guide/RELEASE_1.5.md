# Release 1.5: smarter text, faster workflow, wider coverage

Status 19 September 2026: code written, unit-tested, loaded into the Apps Script project (head, commit 68cee96) and tested through the dry-run deployment in Docs, Sheets and Slides. RELEASED TO REVIEW 21 September 2026 together with 1.4: Apps Script Version 4 ("v1.5.0 twelve-language interface, never-change words, preview, cycle case", 10:50 AM), App Configuration on version 4 for Docs, Sheets and Slides, English listing text updated, five translated listings added, SUBMITTED FOR REVIEW. 1.3 stays live until approval.

## What changed

Smarter text
- **Never-change words** (Settings): words such as iPhone, eBay, macOS or PETRONAS keep exactly that spelling in every style except iNVERSE and aLtErNaTiNg. Whole words only, any case in the source.
- **Sentence case capitalises proper nouns**: days, months, languages, nationalities, holidays and places, with lists for English, Bahasa Malaysia, Bahasa Indonesia, Tagalog and Greek, and country and city names for the other languages. Ambiguous words are left alone on purpose (may, march, polish, turkey, minggu). Can be turned off in Settings. "i'm", "i've", "i'll" and "i'd" were already handled and are now covered by tests.
- **Auto language reads the text**: with Language on Auto, the engine looks for everyday words of each language in the text being converted (needs two hits and a clear winner), then falls back to the account language. Greek is recognised by its letters. Turkish is only chosen when the text also contains a Turkish-only letter, so English text can never get dotless i.

Faster workflow
- **Preview** button in the sidebar: shows the first line of the selection in all nine styles under the buttons, in one server call.
- **Cycle case**: sidebar button and menu item. UPPERCASE text goes to lowercase, lowercase goes to Title Case, anything else goes to UPPERCASE.
- **Repeat last style** menu item.

Wider coverage
- **Sheets**: selecting whole columns now reads only the rows with data and leaves the header alone (frozen rows if any, otherwise row 1). Setting to turn it off. The result message says "Header row skipped."
- **Slides**: whole-presentation mode includes speaker notes. A bare cursor with nothing highlighted now offers the whole presentation instead of "Nothing to change".
- **Docs**: whole-document mode includes footnotes (tables, header and footer were already covered).

Polish
- **Favourites**: the three styles used most (at least twice each) move to the top of the sidebar under "Your most used". Counts live in the user's own settings.
- **Dark sidebar**: a switch in Settings. It is manual because the editors give add-ons no way to read their theme and have no dark theme on the web; following the computer's dark mode made a dark panel inside a white editor.

Privacy policy updated the same day: the settings list now mentions never-change words and the per-style usage count.

## Tests

- `tests/caselib_fuzz.js`: 10,537 checks, 0 failures.
- `tests/language_words.js`: about 1.89 million checks, 0 failures (new: proper nouns on and off, Malay days and months, ambiguous words, ten brand names in seven styles, language detection for all eleven languages, fallbacks, and a guard that English text never gets Turkish casing through Auto).
- Through the dry-run deployment: Sheets whole column Sentence case (header skipped, "See you on Monday in Kuala Lumpur"), Preview, Cycle three times, never-change "iPhone" in UPPERCASE ("MY NEW iPhone CASE"); Docs whole document with a footnote; Slides whole presentation with speaker notes.

## Release checklist (after the rename review)

1. Deploy > Manage deployments > Edit > New version "v1.5.0". App Configuration: version 4 for Docs, Sheets and Slides, Save Draft.
2. Store Listing: add bullets for never-change words, preview, cycle, favourites and the wider whole-file coverage. Save Draft (expand the English panel if the save does not register), SUBMIT FOR REVIEW.
3. Website: new points and FAQ entries; README version.
