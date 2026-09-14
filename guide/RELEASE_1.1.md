# Case Changer 1.1.0: Google Sheets™ and Google Slides™ support

Status 15 September 2026: code written, pasted into the Apps Script project and tested through the test deployment. Full bug-test round completed the same day (see table); the Apps Script project holds the fixed CaseLib.gs and SlidesCase.gs. Not yet released. Do not publish until the current Marketplace review of 1.0.1 has finished.

## What changed in the code

- `src/Code.gs`: detects which editor it is running in (`getUi`, `getHost`) and routes `applyCase` to the right converter. Docs behaviour unchanged.
- `src/SheetsCase.gs` (new): converts the selected cells. Only plain text cells change; formulas, numbers, dates, booleans and blanks are left alone. Rich text runs (bold, colour, font, links) are rebuilt at the same positions.
- `src/SlidesCase.gs` (new): handles highlighted text, selected shapes, groups, tables and table cells. Edits are addressed by absolute position in the container's text and applied from the end backwards so every style run survives.
- `src/appsscript.json`: adds `spreadsheets.currentonly` and `presentations.currentonly` (both non-sensitive).
- `src/Sidebar.html`: hint text now mentions Sheets and Slides.

## Tested (15 September 2026, test deployment via the dry-run link)

| Editor | Test | Result |
|---|---|---|
| Sheets | UPPERCASE, Sentence case, Title Case on a 4-cell selection | Pass |
| Sheets | Formula `=1+2` and number `42` inside the selection | Untouched |
| Sheets | Bold word inside a cell | Bold kept after Title Case |
| Slides | Whole text box: UPPERCASE, lowercase, Capitalize Each Word, iNVERSE cASE | Pass |
| Slides | Bold word inside a text box | Bold kept after iNVERSE cASE |
| Slides | 2x2 table selected: Title Case | All cells pass |
| Sheets | Multi-range selection (Cmd-click A1, B1, B2): UPPERCASE | Pass: both text cells changed |
| Sheets | Date cell inside the selection | Untouched |
| Docs | Regression after the host-aware refactor: whole document UPPERCASE and Title Case from the menu | Pass |
| Docs | Title Case on a line with an email address and a web address | Both left intact, links kept |
| Slides | Title box and table selected together: lowercase | Pass, both changed |
| Slides | Two table cells selected (one column): Sentence case | Pass: only those cells changed |
| Slides | Caret inside a cell with nothing highlighted | Nothing changes, no error (expected) |
| Slides | Bulleted body placeholder, three paragraphs: Sentence case | Pass: bullets and paragraph breaks kept, each line sentence-cased |
| Engine | `tests/caselib_fuzz.js`: 5,989 checks incl. 400 random strings | 0 failures after two fixes (abbreviations in Sentence case; emails and URLs in Title Case) |
| Both | Extensions menu and sidebar appear | Pass |
| Both | Sidebar buttons | Pass (hand-tested by Ikhwan, 15 September 2026) |
| Slides | Highlighted word only (partial selection), via the sidebar | Pass: only the highlighted word changed. Note: the Extensions menu drops a text selection in Slides and converts the whole box instead, which is Slides behaviour, not a bug |

## Release steps (after the 1.0.1 review is approved)

1. In the Apps Script editor: Deploy > Manage deployments > edit the Marketplace deployment > Version: New version > "1.1.0 Sheets and Slides" > Deploy. Note the new version number.
2. Marketplace SDK > App Configuration: tick **Sheets add-on** and **Slides add-on**, same script ID, the new version number for all three editors. Save Draft.
3. Marketplace SDK > Store Listing: paste the 1.1 copy below, add a 1280x800 screenshot each for Sheets and Slides. Save Draft, then Submit for review.
4. Cloud console > Google Auth Platform > Data Access: add the two new scopes. Expect a re-verification request; the scopes are non-sensitive so it should be quick, but do this only after the listing is approved so nothing is pending on two fronts at once.
5. Website: update the FAQ answer "Does it work in Google Sheets or Slides?" and the support page, rebuild with `python3 guide/build_site.py`, push.
6. README version line and `guide/LISTING.md`.

## Store listing copy for 1.1 (trademark symbols are required)

Short description (max 200):

Change selected text in Google Docs™, Sheets™ and Slides™ to UPPERCASE, lowercase, Sentence case, Title Case and more, keeping bold, links and colours.

Detailed description, first line:

Case Changer fixes the case of any text in Google Docs™, Google Sheets™ and Google Slides™ in one click.

Detailed description, replace the last two paragraphs with:

Works in Google Docs™ (selected text), Google Sheets™ (selected cells; formulas and numbers are never touched) and Google Slides™ (highlighted text, text boxes, shapes and tables).

Google Docs™, Google Sheets™, Google Slides™ and Google Workspace™ are trademarks of Google LLC.

Post-install tip:

Highlight some text (or select cells in Sheets™), then open Extensions > Case Changer and pick a style.
