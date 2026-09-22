# Community answers (drafted 23 September 2026)

Where people ask "how do I change case in Google Docs / Sheets / Slides", and what to reply. Post from your own account. Every reply says up front that you made the add-on: Stack Exchange and Reddit both require that, and readers trust it more.

## Where the questions live

- **Google Docs Editors Help Community** (support.google.com/docs/community): the biggest source, but Google locks every thread a few weeks after the last reply. On 23 September every relevant thread ("MS Word Change Case", "Docs neither identifying nor fixing random capitalization", "Sheets: How to permanently convert text strings into uppercases?" and so on) was already locked. The only way to answer there is to catch a new thread within days. Bookmark this search and check it once a week: https://support.google.com/docs/threads?hl=en&thread_filter=(%27capitalization%27)&max_results=40 (also try `uppercase`, `sentence case`, `change case`). Reply only to threads without the lock icon.
- **Web Applications Stack Exchange** (webapps.stackexchange.com): never locks, and answers rank in Google for years. Two live questions below.
- **Reddit** r/googledocs, r/googlesheets, r/GoogleSlides: my browser cannot open Reddit, so search there yourself for "sentence case", "change case", "title case", "uppercase" sorted by new. Posts under six months old accept replies. Template at the end.

## 1. Stack Exchange: "Can Google Docs auto-correct capitalization?"

https://webapps.stackexchange.com/questions/105213/can-google-docs-auto-correct-capitalization
(asked 2017, 4,700+ views, one answer from 2017 pointing at an add-on)

Paste as a new answer:

---

Docs now has this built in, with limits. Select the text, then **Format > Text > Capitalization**, and pick **lowercase**, **UPPERCASE** or **Title Case**. Compared with Word's Change Case two things are missing: there is no **Sentence case**, and Docs' "Title Case" capitalises every word, including "of", "the" and "and".

For those you still need an add-on. Disclosure: I made one. [Case Changer for Google Docs™, Sheets™ & Slides™](https://workspace.google.com/marketplace/app/case_changer/422980989821) is free and adds Sentence case, a Title Case that keeps small words lowercase, Capitalize Each Word, iNVERSE and a few others. It keeps acronyms such as NASA, leaves bold, links and colours in place, and works in Sheets and Slides too, where Docs' menu option does not exist. After installing: select text, then **Extensions > Case Changer** and pick a style. Nothing leaves your document; it only asks for access to the file that is open.

---

## 2. Stack Exchange: "Change text case so that first letter of the sentence is capitalized" (Sheets)

https://webapps.stackexchange.com/questions/116959/change-text-case-so-that-first-letter-of-the-sentence-is-capitalized
(asked 2018, 700+ views, two formula answers)

Paste as a new answer:

---

Two things worth adding to the formula answers.

**If you want it to happen as you type**, a formula cannot do that, because a formula has to live in a different cell from the text. A small script can. Open **Extensions > Apps Script**, paste this, save, and go back to the sheet:

```javascript
function onEdit(e) {
  var v = e.value;
  if (typeof v === 'string' && /^[a-z]/.test(v)) {
    e.range.setValue(v.charAt(0).toUpperCase() + v.slice(1));
  }
}
```

It capitalises the first letter of any text you type into a cell and leaves numbers, dates and formulas alone.

**If you want to fix text that is already there**, in place rather than in a helper column, use an add-on. Disclosure: I made one. [Case Changer for Google Docs™, Sheets™ & Slides™](https://workspace.google.com/marketplace/app/case_changer/422980989821) is free: select the cells, then **Extensions > Case Changer > Sentence case** (or UPPERCASE, lowercase, Title Case and others). It changes the cell text directly, skips formulas, numbers and dates, and keeps bold or coloured runs inside a cell. It also handles the "i" to "I" and proper-noun cases that the formulas above have to special-case.

---

## 3. Reddit template (adjust the first line to the post)

---

Format > Text > Capitalization in Docs does uppercase, lowercase and title case, but not sentence case, and its title case capitalises "of" and "the" as well. Sheets and Slides don't have the menu at all.

Full disclosure, I built a free add-on for exactly this: Case Changer for Google Docs, Sheets & Slides (https://case-changer.app). Select the text or cells, Extensions > Case Changer, pick a style. Sentence case, smart Title Case, keeps acronyms and formatting, works in all three editors, no account or sign-up, and it only gets access to the file you have open. Happy to answer questions about it.

---

## Notes

- Stack Exchange will show a "self-promotion" flag if the disclosure is missing; keep the "Disclosure: I made one" sentence.
- Do not post the same text twice on Stack Exchange; the two answers above are deliberately different.
- Vote counts on old questions move slowly. The value is search traffic over the next years, not the first week.
