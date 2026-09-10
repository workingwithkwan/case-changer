# Case Changer

A Google Docs Editor Add-on that changes the case of selected text while keeping all formatting. Built as a replacement for the abandoned "Change Case" add-on.

Styles: UPPERCASE, lowercase, Sentence case, Title Case, Capitalize Each Word, iNVERSE cASE, aLtErNaTiNg cAsE.

## Folder map

| Path | What it is |
|---|---|
| `src/Code.gs` | Menu, sidebar launcher and the document-editing logic (Apps Script) |
| `src/CaseLib.gs` | The pure text transforms. No Google code, so it can be tested in a browser |
| `src/Sidebar.html` | The sidebar with one button per style |
| `src/appsscript.json` | Manifest: V8 runtime and the two OAuth scopes |
| `tests.html` | Open in any browser to run the CaseLib unit tests (23 checks) |
| `assets/` | Official logo (Option A, two-tone Aa): icons 32/48/96/128/512, 220x140 card banner, `logo.svg` source. `assets/logo/` keeps the unused Option B |
| `guide/PUBLISHING_GUIDE.md` | Step-by-step: run it today (Part A) and publish to the Marketplace (Part B) |
| `guide/LISTING.md` | Copy for the store listing |
| `guide/VERIFICATION.md` | OAuth verification checklist, demo video script and scope justifications |
| `guide/PRIVACY_POLICY.md`, `guide/TERMS_OF_SERVICE.md`, `guide/SUPPORT.md` | Source text for the policy pages |
| `docs/` | The public website (GitHub Pages): home, privacy policy, terms, support. Rebuild with `python3 guide/build_site.py` |

## How the formatting is preserved

Every transform in `CaseLib.gs` maps one character to exactly one character, so the converted text is always the same length as the original. `Code.gs` snapshots the formatting runs of the selection, replaces the text in place, and re-applies each run at the same character positions. Links are restored explicitly.

## Scopes

- `documents.currentonly`: read and write only the document the add-on is open in
- `script.container.ui`: show the menu and sidebar

The Cloud console classes `script.container.ui` as sensitive, so a public Marketplace listing needs Google OAuth verification (verified homepage domain, policy pages, demo video). Confirmed 4 September 2026.

## Status

10 September 2026: consent screen in production, Store Listing complete, demo video recorded (`assets/casechanger-demo.mp4`, kept out of git). OAuth verification submitted 10 September 2026 (under review). Marketplace listing to be submitted once verification is approved. See `guide/VERIFICATION.md`.

## Version

1.0.1 (10 September 2026): sidebar buttons no longer clip their labels (Google's add-on stylesheet forces a fixed button height); heading in sentence case.
1.0.0 (3 September 2026): first release.
