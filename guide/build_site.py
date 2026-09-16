import re, html, os
ROOT = "/Users/kwanmeister/Claude Code/CaseChanger"
SRC = f"{ROOT}/guide"; OUT = f"{ROOT}/docs"
os.makedirs(OUT, exist_ok=True)

def inline(t):
    t = html.escape(t, quote=False)
    t = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', t)
    t = re.sub(r'`(.+?)`', r'<code>\1</code>', t)
    t = re.sub(r'\[(.+?)\]\((.+?)\)', r'<a href="\2">\1</a>', t)
    t = re.sub(r'(?<![">])(https?://[^\s<]+)', r'<a href="\1">\1</a>', t)
    t = re.sub(r'(?<![\w@/">])([\w.+-]+@[\w-]+\.[\w.]+)', r'<a href="mailto:\1">\1</a>', t)
    return t

def md_to_html(md):
    out, lst, para = [], None, []
    def flush():
        nonlocal para
        if para: out.append('<p>' + inline(' '.join(para)) + '</p>'); para = []
    for line in md.splitlines():
        s = line.rstrip()
        if s.startswith('# '): flush(); out.append(f'<h1>{inline(s[2:])}</h1>'); continue
        if s.startswith('## '): flush(); out.append(f'<h2>{inline(s[3:])}</h2>'); continue
        if s.startswith('### '): flush(); out.append(f'<h3>{inline(s[4:])}</h3>'); continue
        m = re.match(r'^(\d+)\. (.*)', s)
        if s.startswith('- ') or m:
            flush(); kind = 'ol' if m else 'ul'
            if lst != kind: 
                if lst: out.append(f'</{lst}>')
                out.append(f'<{kind}>'); lst = kind
            out.append('<li>' + inline(m.group(2) if m else s[2:]) + '</li>'); continue
        if lst and s == '': out.append(f'</{lst}>'); lst = None; continue
        if s == '': flush(); continue
        para.append(s)
    flush()
    if lst: out.append(f'</{lst}>')
    return '\n'.join(out)

CSS = """
:root{color-scheme:dark;--bg:#121417;--surface:#1b1e24;--border:#2c3038;--text:#e6e8eb;--muted:#9aa0a8;--accent:#8ab4f8;--header:#0b57d0}
body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;color:var(--text);background:var(--bg);line-height:1.6}
header{background:var(--header);color:#fff}header .in{max-width:860px;margin:0 auto;padding:14px 20px;display:flex;align-items:center;gap:12px}
header img{width:36px;height:36px;border-radius:9px}header a{color:#fff;text-decoration:none;font-weight:600}header nav{margin-left:auto;display:flex;gap:16px;flex-wrap:wrap}header nav a{font-weight:400;opacity:.92}
main{max-width:860px;margin:0 auto;padding:24px 20px 48px}h1{font-size:1.9rem;margin:.4em 0;color:#fff}h2{font-size:1.25rem;margin-top:1.6em;color:#fff}code{background:var(--surface);border:1px solid var(--border);padding:1px 5px;border-radius:4px;font-size:.92em}
a{color:var(--accent)}strong{color:#fff}.hero{display:flex;gap:24px;align-items:center;flex-wrap:wrap;margin:16px 0 28px}.hero img{width:128px;height:128px;border-radius:28px}
.styles{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px;margin:16px 0}.muted{color:var(--muted);font-size:.9em}h3{font-size:1.05rem;margin:1.2em 0 .3em;color:#fff}.styles div{background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:10px 12px}
.shots{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;margin:16px 0}.shots figure{margin:0;background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:10px}.shots img{width:100%;height:auto;border-radius:6px;display:block}.shots figcaption{margin-top:8px;font-size:.9em;color:var(--muted)}
footer{max-width:860px;margin:0 auto;padding:16px 20px 32px;color:var(--muted);font-size:.9rem;border-top:1px solid var(--border)}
"""
NAV = '<nav><a href="index.html">Home</a><a href="privacy-policy.html">Privacy Policy</a><a href="terms-of-service.html">Terms of Service</a><a href="support.html">Support</a></nav>'
SITE = 'https://case-changer.app/'
def page(title, body, path='', description='', extra_head=''):
    url = SITE + path
    desc = html.escape(description or 'Case Changer is a free Google Docs, Sheets and Slides add-on that changes selected text to UPPERCASE, lowercase, Sentence case, Title Case and more while keeping formatting.', quote=True)
    return f"""<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{html.escape(title)}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{url}">
<meta name="robots" content="index,follow">
<meta property="og:type" content="website"><meta property="og:site_name" content="Case Changer">
<meta property="og:title" content="{html.escape(title, quote=True)}"><meta property="og:description" content="{desc}">
<meta property="og:url" content="{url}"><meta property="og:image" content="{SITE}assets/screenshot-1.png"><meta property="og:image:width" content="1280"><meta property="og:image:height" content="800">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="{html.escape(title, quote=True)}"><meta name="twitter:description" content="{desc}"><meta name="twitter:image" content="{SITE}assets/screenshot-1.png">
<link rel="icon" href="icon-48.png"><link rel="apple-touch-icon" href="icon-128.png"><meta name="theme-color" content="#0b57d0">
{extra_head}<style>{CSS}</style></head>
<body><header><div class="in"><img src="icon-128.png" alt="Case Changer logo"><a href="index.html">Case Changer</a>{NAV}</div></header>
<main>{body}</main>
<footer>Case Changer is a free add-on for Google Docs, Sheets and Slides. Google Docs, Google Sheets, Google Slides and Google Workspace are trademarks of Google LLC. Contact: <a href="mailto:support@case-changer.app">support@case-changer.app</a></footer>
</body></html>
"""

pages = {'PRIVACY_POLICY.md': ('privacy-policy.html', 'Privacy Policy | Case Changer for Google Docs, Sheets and Slides', 'How Case Changer handles your data: nothing is collected, stored or shared. Text is converted inside Google Apps Script and written straight back to your document, spreadsheet or presentation.'),
         'TERMS_OF_SERVICE.md': ('terms-of-service.html', 'Terms of Service | Case Changer for Google Docs, Sheets and Slides', 'Terms of service for the free Case Changer add-on for Google Docs, Sheets and Slides.'),
         'SUPPORT.md': ('support.html', 'Support and FAQ | Case Changer for Google Docs, Sheets and Slides', 'Help for Case Changer: how to change text case in Google Docs, Sheets and Slides, undo a change, fix a missing menu, and contact support.')}

styles = [('UPPERCASE','MAKE EVERYTHING CAPITAL LETTERS'),('lowercase','make everything small letters'),('Sentence case','Capital letter at the start of each sentence'),('Title Case','Capitals On The Important Words, Small On "of" and "the"'),('Capitalize Each Word','A Capital Letter On Every Word'),('iNVERSE cASE','sWAPS eVERY lETTER'),('aLtErNaTiNg cAsE','uPpEr AnD lOwEr In TuRn')]
faq = [
 ('The menu says "Select the text you want to change first."',
  'Nothing was highlighted. Click and drag over some text (or select cells in Sheets, or a text box in Slides), then run the command again. With nothing selected, the sidebar offers to change the whole file instead.'),
 ('Case Changer is not in the Extensions menu.',
  'Reload the page. If it is still missing, open Extensions > Add-ons > Manage add-ons and make sure Case Changer is turned on for this file.'),
 ('How do I change the case of text in Google Docs?',
  'Highlight the text, then open Extensions > Case Changer and choose a style such as UPPERCASE, lowercase, Sentence case or Title Case. The sidebar gives you the same styles as one-click buttons.'),
 ('Does Google Docs have a built-in change case option?',
  'Google Docs has Format > Text > Capitalization with three options: lowercase, UPPERCASE and Title Case. Case Changer adds Sentence case, Capitalize Each Word, iNVERSE cASE and aLtErNaTiNg cAsE, uses smart title case that keeps small words like "of" and "the" in lowercase, and puts every style in a sidebar.'),
 ('Is Case Changer free?',
  'Yes. Case Changer is free, with no account, sign-up, ads or upgrade.'),
 ('Will it remove my bold text, links or colours?',
  'No. Case Changer changes only the letters. Bold, italic, underline, colours, fonts, links and comments stay exactly where they were.'),
 ('Is my document safe?',
  'Case Changer only asks for access to the document it is open in, and it stores nothing. The text is converted inside Google\'s own servers by Google Apps Script and written straight back into your document. It never leaves Google.'),
 ('Can I undo a case change?',
  'Yes. Press Cmd+Z on a Mac or Ctrl+Z on Windows straight after, the same as any other edit, or use File > Version history.'),
 ('The old "Change Case" add-on stopped working. Is this a replacement?',
  'Yes. Case Changer was built as a modern replacement for abandoned change-case add-ons, with the same styles, formatting kept intact, and a privacy policy that promises no data collection.'),
 ('Does it work in Google Sheets or Slides?',
  'Yes. Since version 1.2 Case Changer works in Google Docs, Google Sheets and Google Slides. In Sheets, select the cells you want to change. In Slides, highlight text inside a box or select the box itself.'),
 ('How do I change case in Google Sheets without a formula?',
  'Select the cells and pick a style from Extensions > Case Changer. The text is rewritten in the same cells, so there is no UPPER(), LOWER() or PROPER() formula to write, no helper column and no copy-and-paste-as-values step. Cells that hold formulas or numbers are skipped.'),
 ('How do I change text to uppercase or lowercase in Google Slides?',
  'Highlight the text, or click the text box, shape or table, then choose UPPERCASE, lowercase or another style from Extensions > Case Changer. Fonts, sizes, colours and links are kept. With nothing selected, the sidebar can change every slide.'),
 ('Can I change the case of a whole document, sheet or presentation at once?',
  'Yes. Click a style with nothing selected and the sidebar offers a button to change the entire document, the active sheet or every slide, after a confirmation.'),
]
faq_html = ''.join(f'<h3>{html.escape(q)}</h3><p>{html.escape(a)}</p>' for q,a in faq)
home = f"""
<div class="hero"><img src="icon-512.png" alt="Case Changer logo: the letters Aa on a blue tile above three dots in the colours of Docs, Sheets and Slides"><div><h1>Case Changer for Google Docs™, Sheets™ &amp; Slides™</h1>
<p>A free add-on that changes the case of selected text in one click: UPPERCASE, lowercase, Sentence case, Title Case and more, in a document, a spreadsheet or a presentation. Bold, links and colours stay exactly where they were.</p></div></div>
<h2>Seven Case Styles</h2><div class="styles">{''.join(f'<div><strong>{html.escape(n)}</strong><br><span class="muted">{html.escape(d)}</span></div>' for n,d in styles)}</div>
<h2>See It In Action</h2>
<div class="shots">
<figure><a href="assets/screenshot-1.png"><img src="assets/screenshot-1.png" width="1280" height="800" loading="lazy" alt="Case Changer sidebar in Google Docs with the case style buttons next to a document"></a><figcaption>Google Docs: highlight text, click a style in the sidebar.</figcaption></figure>
<figure><a href="assets/screenshot-2-sheets.png"><img src="assets/screenshot-2-sheets.png" width="1280" height="800" loading="lazy" alt="Case Changer sidebar in Google Sheets with a column of customer names selected"></a><figcaption>Google Sheets: select cells, no formulas needed.</figcaption></figure>
<figure><a href="assets/screenshot-3-slides.png"><img src="assets/screenshot-3-slides.png" width="1280" height="800" loading="lazy" alt="Case Changer sidebar in Google Slides next to a slide with a title and bullet points"></a><figcaption>Google Slides: highlight text or select a text box.</figcaption></figure>
</div>
<h2>How To Change Case In Google Docs</h2>
<ol><li>Highlight some text in your Google Doc.</li><li>Open <strong>Extensions &gt; Case Changer</strong> and pick a style, or choose <strong>Open sidebar</strong> for one-click buttons.</li><li>Done. Formatting stays exactly where it was. Press Cmd+Z or Ctrl+Z to undo.</li></ol>
<h2>How To Change Case In Google Sheets</h2>
<ol><li>Select the cells, a column, a row or the whole range you want to change. Formulas and numbers are left alone.</li><li>Open <strong>Extensions &gt; Case Changer</strong> and pick a style such as UPPERCASE, lowercase or Capitalize Each Word.</li><li>The text changes in place. No UPPER(), LOWER() or PROPER() formulas, no helper column and no paste-as-values step.</li></ol>
<h2>How To Change Case In Google Slides</h2>
<ol><li>Highlight text inside a text box, or click a text box, shape or table to change all of its text.</li><li>Open <strong>Extensions &gt; Case Changer</strong> and pick a style.</li><li>Fonts, sizes, colours and links stay where they were. With nothing selected, the sidebar offers to change the whole presentation.</li></ol>
<h2>Why Case Changer</h2>
<ul><li><strong>Keeps formatting.</strong> Only the letters change. Bold, italic, colours, fonts, links and comments are untouched.</li>
<li><strong>Smart title case.</strong> Short words such as "of", "and" and "the" stay lowercase, the way editors write titles.</li>
<li><strong>Works on any selection.</strong> A word, a sentence, a whole table, a range of cells, a text box or the entire file.</li>
<li><strong>One add-on for three editors.</strong> The same menu and sidebar in Google Docs, Google Sheets and Google Slides.</li>
<li><strong>Keeps acronyms.</strong> Sentence case and Title Case leave NASA, KL or UMNO alone, and Title Case knows the small words of English, Bahasa Malaysia and Bahasa Indonesia.</li>
<li><strong>Private by design.</strong> Access is limited to the open document and nothing is stored. Read the <a href="privacy-policy.html">privacy policy</a>.</li>
<li><strong>Free.</strong> No account, no sign-up, no ads.</li></ul>
<h2>Get It</h2>
<p>Case Changer is free on the <a href="https://workspace.google.com/marketplace/app/case_changer/422980989821">Google Workspace Marketplace</a>. Install it there, or open <strong>Extensions &gt; Add-ons &gt; Get add-ons</strong> inside Google Docs, Sheets or Slides and search for "Case Changer".</p>
<h2>Questions?</h2>
<p>Answers to common questions, including how it works in Sheets and Slides, are on the <a href="support.html#faq">support page</a>. Or email <a href="mailto:support@case-changer.app">support@case-changer.app</a>.</p>
"""
import json
ld = [{
 "@context":"https://schema.org","@type":"SoftwareApplication","name":"Case Changer for Google Docs™, Sheets™ & Slides™","alternateName":"Case Changer","url":SITE,
 "applicationCategory":"BrowserApplication","applicationSubCategory":"Google Workspace add-on","operatingSystem":"Web",
 "description":"Free Google Docs, Sheets and Slides add-on that changes selected text to UPPERCASE, lowercase, Sentence case, Title Case, Capitalize Each Word, iNVERSE cASE or aLtErNaTiNg cAsE while keeping bold, links and colours.",
 "offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},
 "image":SITE+"icon-512.png","screenshot":[SITE+"assets/screenshot-1.png", SITE+"assets/screenshot-2-sheets.png", SITE+"assets/screenshot-3-slides.png"],
 "author":{"@type":"Person","name":"Ikhwan Ariff"},
 "softwareVersion":"1.2.0","featureList":[n for n,_ in styles] + ["Works in Google Docs, Google Sheets and Google Slides", "Keeps bold, links and colours", "Keeps acronyms", "Whole-file mode"]
}]
faq_ld = {"@context":"https://schema.org","@type":"FAQPage",
 "mainEntity":[{"@type":"Question","name":q,"acceptedAnswer":{"@type":"Answer","text":a}} for q,a in faq]}
extra = ''.join(f'<script type="application/ld+json">{json.dumps(x, ensure_ascii=False)}</script>\n' for x in ld)
faq_extra = f'<script type="application/ld+json">{json.dumps(faq_ld, ensure_ascii=False)}</script>\n'
for src, (dst, title, desc) in pages.items():
    md = open(f'{SRC}/{src}').read()
    body = md_to_html(md)
    head = ''
    if '[[FAQ]]' in body:
        body = body.replace('<p>[[FAQ]]</p>', '<h2 id="faq">Frequently Asked Questions</h2>' + faq_html)
        head = faq_extra
    open(f'{OUT}/{dst}', 'w').write(page(title, body, dst, desc, head))
open(f'{OUT}/index.html','w').write(page('Case Changer for Google Docs™, Sheets™ & Slides™: Free Change Case Add-on', home, '',
    'Free Google Docs, Sheets and Slides add-on to change selected text to UPPERCASE, lowercase, Sentence case, Title Case and more in one click, keeping bold, links and colours.', extra))
open(f'{OUT}/robots.txt','w').write('User-agent: *\nAllow: /\nSitemap: https://case-changer.app/sitemap.xml\n')
import datetime
today = datetime.date.today().isoformat()
urls = ['', 'support.html', 'privacy-policy.html', 'terms-of-service.html']
open(f'{OUT}/sitemap.xml','w').write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + ''.join(f'  <url><loc>{SITE}{u}</loc><lastmod>{today}</lastmod></url>\n' for u in urls) + '</urlset>\n')
open(f'{OUT}/404.html','w').write(page('Page not found | Case Changer', '<h1>Page Not Found</h1><p>That page does not exist. Try the <a href="index.html">home page</a> or the <a href="support.html">support page</a>.</p>', '404.html', 'Page not found.', '<meta name="robots" content="noindex">'))
for f in ['icon-48.png','icon-128.png','icon-512.png']:
    os.system(f'cp "{ROOT}/assets/{f}" "{OUT}/{f}"')
open(f'{OUT}/.nojekyll','w').write('')
print(sorted(os.listdir(OUT)))
