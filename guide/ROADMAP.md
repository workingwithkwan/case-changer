# Case Changer roadmap

Each release below needs only a Marketplace listing review (text and screenshots). None adds a new OAuth scope, so no new verification.

## 1.1 (released with 1.2, submitted 15 September 2026)
- Google Sheets™ and Google Slides™ support. See `RELEASE_1.1.md`.

## 1.2 (submitted for Marketplace review 15 September 2026)
- **Keep acronyms**: Sentence case, Title Case and Capitalize Each Word leave words like NASA, KL and UMNO alone, unless the whole selection is shouting in capitals. Toggle in the sidebar, remembered per user.
- **Title Case words to keep lowercase**: presets for English, Bahasa Malaysia and Bahasa Indonesia, plus a box for the user's own words. Remembered per user.
- **Whole-file mode**: with nothing selected, offer to change the entire document, sheet or deck after a confirmation.
- **Last used** style highlighted in the sidebar.

## 1.3 (built and tested 15 September 2026, release after the 1.2 review)
- **Language picker** (Auto from the account language, English, Bahasa Malaysia, Bahasa Indonesia, Spanish, French, German, Portuguese, Italian, Dutch, Tagalog, Turkish, Greek) driving the Title Case small words and the English-only "i" pronoun rule.
- Locale-correct lowercase for Greek (final sigma, always on) and Turkish (dotted and dotless i, when Turkish is chosen or detected).
- Extra length-preserving styles: snake_case and kebab-case.
- New logo: the Aa tile with three dots in the Docs, Sheets and Slides colours.

## 1.4
- Sidebar, menu hints and help text translated into the 1.3 languages, chosen from the account language.
- Marketplace listing translated into the top five languages.

## Later, if asked for
- Apply to every slide including speaker notes; apply to a whole Sheets column skipping the header.
- Google Forms™ support.
- Preview of the converted text in the sidebar.

## Not planned
- Keyboard shortcuts: Apps Script add-ons cannot register them.
- Styles that change text length (camelCase, removing double spaces): they would lose bold, links and colours.
- Usage tracking or a paid tier: the "stores nothing, free" promise is the product.
