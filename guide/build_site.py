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
:root{color-scheme:light}body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;color:#202124;background:#fff;line-height:1.6}
header{background:#0b57d0;color:#fff}header .in{max-width:860px;margin:0 auto;padding:14px 20px;display:flex;align-items:center;gap:12px}
header img{width:36px;height:36px;border-radius:9px}header a{color:#fff;text-decoration:none;font-weight:600}header nav{margin-left:auto;display:flex;gap:16px;flex-wrap:wrap}header nav a{font-weight:400;opacity:.92}
main{max-width:860px;margin:0 auto;padding:24px 20px 48px}h1{font-size:1.9rem;margin:.4em 0}h2{font-size:1.25rem;margin-top:1.6em}code{background:#f1f3f4;padding:1px 5px;border-radius:4px;font-size:.92em}
a{color:#0b57d0}.hero{display:flex;gap:24px;align-items:center;flex-wrap:wrap;margin:16px 0 28px}.hero img{width:128px;height:128px;border-radius:28px}
.styles{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px;margin:16px 0}.styles div{border:1px solid #dadce0;border-radius:8px;padding:10px 12px}
footer{max-width:860px;margin:0 auto;padding:16px 20px 32px;color:#5f6368;font-size:.9rem;border-top:1px solid #e8eaed}
"""
NAV = '<nav><a href="index.html">Home</a><a href="privacy-policy.html">Privacy Policy</a><a href="terms-of-service.html">Terms of Service</a><a href="support.html">Support</a></nav>'
def page(title, body):
    return f"""<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{html.escape(title)}</title><link rel="icon" href="icon-48.png"><style>{CSS}</style></head>
<body><header><div class="in"><img src="icon-128.png" alt=""><a href="index.html">Case Changer</a>{NAV}</div></header>
<main>{body}</main>
<footer>Case Changer is a free add-on for Google Docs. Google Docs and Google Workspace are trademarks of Google LLC. Contact: <a href="mailto:workingwithkwan@gmail.com">workingwithkwan@gmail.com</a></footer>
</body></html>
"""

pages = {'PRIVACY_POLICY.md': ('privacy-policy.html', 'Privacy Policy | Case Changer'),
         'TERMS_OF_SERVICE.md': ('terms-of-service.html', 'Terms of Service | Case Changer'),
         'SUPPORT.md': ('support.html', 'Support | Case Changer')}
for src, (dst, title) in pages.items():
    md = open(f'{SRC}/{src}').read()
    open(f'{OUT}/{dst}', 'w').write(page(title, md_to_html(md)))

styles = ['UPPERCASE','lowercase','Sentence case','Title Case','Capitalize Each Word','iNVERSE cASE','aLtErNaTiNg cAsE']
home = f"""
<div class="hero"><img src="icon-512.png" alt="Case Changer logo"><div><h1>Case Changer</h1>
<p>Change the case of selected text in Google Docs in one click, without losing bold, links or colours.</p></div></div>
<h2>Seven Styles</h2><div class="styles">{''.join(f'<div>{s}</div>' for s in styles)}</div>
<h2>How It Works</h2>
<ol><li>Highlight some text in your Google Doc.</li><li>Open <strong>Extensions &gt; Case Changer</strong> and pick a style, or open the sidebar for one-click buttons.</li><li>Done. Formatting stays exactly where it was.</li></ol>
<h2>Private By Design</h2>
<p>Case Changer only asks for access to the document it is open in, and it stores nothing. The text you select is converted inside Google's own servers and written straight back into your document. Read the <a href="privacy-policy.html">privacy policy</a>.</p>
<h2>Get It</h2>
<p>Case Changer is being published on the Google Workspace Marketplace. Once it is listed, install it from <strong>Extensions &gt; Add-ons &gt; Get add-ons</strong> inside Google Docs.</p>
<p>Questions? See the <a href="support.html">support page</a>.</p>
"""
open(f'{OUT}/index.html','w').write(page('Case Changer', home))
for f in ['icon-48.png','icon-128.png','icon-512.png']:
    os.system(f'cp "{ROOT}/assets/{f}" "{OUT}/{f}"')
open(f'{OUT}/.nojekyll','w').write('')
print(sorted(os.listdir(OUT)))
