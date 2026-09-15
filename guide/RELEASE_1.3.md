# Release 1.3: languages, Turkish and Greek, snake_case and kebab-case

Status 15 September 2026: code written, unit-tested, loaded into the Apps Script project (head) and tested through the dry-run deployment: Sheets (snake_case on Turkish, Greek and English cells; Türkçe setting gives İSTANBUL_IŞIK_İZMİR in UPPERCASE; Auto shows "Auto: English (your account language)"), Slides (kebab-case on a selected title box, undo works), Docs (Sentence case gives "Οδυσσευς ηταν εδω. Hello world, I said", then snake_case). Not yet deployed as a version. Release after the 1.2 Marketplace review finishes (new Apps Script version, App Configuration version bump, listing text and graphics update, then SUBMIT FOR REVIEW).

## What changed

- **Language setting** in the sidebar: Auto (the Google account language, read with `Session.getActiveUserLocale()`, no extra permission) or one of English, Bahasa Malaysia, Bahasa Indonesia, Español, Français, Deutsch, Português, Italiano, Nederlands, Tagalog, Türkçe, Ελληνικά. The language sets the small words Title Case keeps lowercase and switches the English "i" to "I" rule on only for English. Existing users keep the language they had chosen; new users start on Auto.
- **Turkish**: with Türkçe chosen or detected, `I` lowercases to `ı` and `i` uppercases to `İ`. For everyone, `İ` now lowercases to `i` (before it was left unchanged).
- **Greek**: a capital sigma at the end of a word lowercases to the final form `ς`, elsewhere `σ`. Always on, no setting needed.
- **snake_case** and **kebab-case** styles in the menu and the sidebar: lowercase, and every space (and the other joiner) becomes `_` or `-`. One character per character, so formatting is kept like every other style.
- **New logo** (`assets/logo.svg`, PNGs in `assets/`, old one under `assets/logo/v1`): the Aa tile with three dots in the Docs, Sheets and Slides colours. The card banner matches.

## Tests

- `tests/caselib_fuzz.js`: 6,674 checks, 0 failures (new: snake and kebab, every language preset, Turkish, Greek, the English-only pronoun rule, fuzz alphabet now includes sigma and underscore).
- `tests/language_words.js`: 1,892,569 checks, 0 failures (new: one real book title per language, every preset word alone and mid-title in every language).

## Release checklist (after the 1.2 review)

1. Load `src/*` into the Apps Script project (fetch by commit SHA into Monaco, click Save).
2. Test through the dry-run deployment in Docs, Sheets and Slides: menu shows snake_case and kebab-case; sidebar Settings shows "Auto (your Google account language: English)"; Turkish and Greek samples.
3. Deploy > Manage deployments > Edit > New version "v1.3.0". Marketplace SDK > App Configuration: version 3, save.
4. Store Listing: description bullets for languages and the two styles, "Nine case styles"; upload the new icons (32, 48, 96, 128) and card banner from `assets/`; Save Draft; SUBMIT FOR REVIEW.
5. Google Auth Platform > Branding: replacing the app logo there triggers a branding re-verification. Do it only when the user agrees, and not while a Marketplace review is running.
6. Website: styles grid to nine, FAQ for languages, README version.
