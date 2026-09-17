# Release 1.4: the add-on in twelve languages

Status 19 September 2026: code written, tested and loaded into the Apps Script project (head, commit adaa9ab) together with 1.5. Not deployed as a version: the Marketplace listing is locked while the rename review runs. 1.4 and 1.5 ship together as one version.

## What changed

- **Interface in twelve languages**: English, Bahasa Malaysia, Bahasa Indonesia, Español, Français, Deutsch, Português, Italiano, Nederlands, Tagalog, Türkçe, Ελληνικά. 59 strings each: sidebar, style names, settings, status and error messages, the "change the whole file?" prompts, the Help text and the menu.
- **Chosen from the Google account language**, read with `Session.getActiveUserLocale()` (no extra permission). Anything else falls back to English.
- **Sidebar language** setting to override it. The override applies to the sidebar, messages and prompts. The menu always follows the account language, because Google builds the menu in a mode where an add-on cannot read its saved settings. The setting says so.
- **Style names are translated but still show their own style** (HURUF BESAR, huruf kecil, Huruf Tajuk, hUrUf BeRsElAnG). snake_case and kebab-case keep their names everywhere.
- New file `src/Strings.gs`. The sidebar is now an HTML template: Code.gs hands it the strings for the viewer's language, so it opens already translated with no flash of English.
- **Marketplace listing translations** for Bahasa Malaysia, Bahasa Indonesia, Spanish, Portuguese (Brazil), French and German in `LISTING_TRANSLATIONS.md`, each with ™ on every Google product name and the trademark line. To be added with "Add a Language" when the listing unlocks.

## Tests

- `tests/strings_check.js`: every language has all 59 strings, the same `{placeholders}` as English, nothing accidentally left in English, menu and style labels short enough. 12 languages, 0 failures.
- Live through the dry-run deployment in Sheets: sidebar in English from the template; Sidebar language set to Bahasa Malaysia, sidebar reopened fully translated (buttons, favourites labels, Settings, tip); Huruf Tajuk applied; setting returned to Auto.
- Known and accepted: with an English account the menu stays English even when the sidebar override is Malay (platform limit described above).

## Release checklist (with 1.5, after the rename review)

1. Confirm `Strings.gs` exists in the Apps Script project (created 19 September 2026).
2. Follow RELEASE_1.5.md for the version, App Configuration and English listing.
3. Store Listing > App Details > Add a Language, six times, pasting from LISTING_TRANSLATIONS.md. The application name is the same in every language.
4. Website: mention the twelve interface languages; consider translated landing pages later.
