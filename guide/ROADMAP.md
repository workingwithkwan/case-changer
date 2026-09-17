# Case Changer roadmap

Each release below needs only a Marketplace listing review (text and screenshots). None adds a new OAuth scope, so no new verification.

## 1.1 (released with 1.2, live 17 September 2026)
- Google Sheets™ and Google Slides™ support. See `RELEASE_1.1.md`.

## 1.2 (live 17 September 2026)
- **Keep acronyms**: Sentence case, Title Case and Capitalize Each Word leave words like NASA, KL and UMNO alone, unless the whole selection is shouting in capitals. Toggle in the sidebar, remembered per user.
- **Title Case words to keep lowercase**: presets for English, Bahasa Malaysia and Bahasa Indonesia, plus a box for the user's own words. Remembered per user.
- **Whole-file mode**: with nothing selected, offer to change the entire document, sheet or deck after a confirmation.
- **Last used** style highlighted in the sidebar.

## 1.3 (live 19 September 2026)
- **Language picker** (Auto from the account language, English, Bahasa Malaysia, Bahasa Indonesia, Spanish, French, German, Portuguese, Italian, Dutch, Tagalog, Turkish, Greek) driving the Title Case small words and the English-only "i" pronoun rule.
- Locale-correct lowercase for Greek (final sigma, always on) and Turkish (dotted and dotless i, when Turkish is chosen or detected).
- Extra length-preserving styles: snake_case and kebab-case.
- New logo: the Aa tile with three dots in the Docs, Sheets and Slides colours.

## 1.4
- Sidebar, menu hints and help text translated into the 1.3 languages, chosen from the account language.
- Marketplace listing translated into the top five languages.

## 1.5
Smarter text
- **Never-change words**: a Settings box for words that keep their exact spelling in every style (iPhone, eBay, macOS, PETRONAS, a company name). Remembered per user.
- **Sentence case knows the basics**: days, months, language names and country names stay capitalised (monday to Monday), and English contractions of "I" are fixed (i'm, i've, i'll to I'm, I've, I'll). Small built-in lists per 1.3 language.
- **Detect the language from the text itself**: Auto reads the selected words, not only the account language, so a Malay heading in an English account gets the Malay small words.

Faster workflow
- **Preview in the sidebar**: the first line of the selection shown as it would look, before clicking.
- **Cycle case**: one button and one menu item that go UPPERCASE, lowercase, Title Case on repeated use, like Shift+F3 in Word.
- **Repeat last style** menu item.

Wider coverage
- Sheets: whole column, skipping the header row.
- Slides: speaker notes included in whole-deck mode.
- Docs: footnotes and tables covered by whole-document mode.

Polish
- Dark sidebar as a switch in Settings (the editors give add-ons no way to read their theme, and they have no dark theme on the web).
- Favourites: pin the three most-used styles to the top of the sidebar.

## Later, if asked for
- Google Forms™ support: a different add-on type with its own scope and review, and very little text to change.

## Not planned
- Keyboard shortcuts: Apps Script add-ons cannot register them.
- Styles that change text length (camelCase, removing double spaces): they would lose bold, links and colours.
- Usage tracking or a paid tier: the "stores nothing, free" promise is the product.
