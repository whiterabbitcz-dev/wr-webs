# HANDOFF — wr-webs

Tenhle dokument je adresovaný **dalšímu Claude Code instance**, který tenhle balíček dostane k dokončení. Pokud jsi Martin a čteš to ručně: shrnutí dole v sekci „TL;DR pro Martina".

---

## Co se stalo dosud

Microsite postavená v cloudové sandboxové session Claude Code on the web (`whiterabbitcz-dev/cml` repo, branch `claude/review-project-progress-jSbeP`). Sandbox má **dvě tvrdé limity** oproti standardnímu Claude Code:

1. **Externí síť úplně zakázaná** (`x-deny-reason: host_not_allowed`). Vyzkoušeno na `tomadzusy.cz`, `tranquil-bombolone-66c37e.netlify.app`, `wr-web.vercel.app` — všechny 403. Tj. žádný `curl`, žádný `npx puppeteer-screenshot`, žádný `npm install` z npm registry.
2. **GitHub MCP server** restriktivně přibitý na `whiterabbitcz-dev/cml`. Nemůže zakládat nové repo `whiterabbitcz-dev/wr-webs` ani do něj pushovat.

Tj. všechno co brief řeší přes externí stahování + nový GitHub repo + Vercel deploy **bylo posunuto na dalšího Claude Code (tebe) nebo na Martina ručně**. Build samotný (HTML, CSS, JS, struktura, brand DNA, copy) je dokončený.

---

## Co je hotové

- `BRIEF.md` — zdrojový brief v3, atomický (kopie z Google Drive: `1INxyr0OLZEH9aoa7aZ7U-ovyvryGWdQP`)
- `index.html` — single page, všech 10 sekcí podle briefu sec 9 (Top nav, Hero, Stats, Showcase grid s 8 + 1 dlaždicemi, Tiery 4 s T3 „Doporučujeme" badge a DRAFT komentářem, V ceně / není v ceně, Proces 5 kroků, FAQ 6 otázek, Kontakt, Footer)
- `styles.css` — vanilla CSS, brand tokens podle briefu sec 2, žádné `border-radius`, žádné `box-shadow`, žádné gradienty, mobile-first, breakpointy 640 / 768 / 1024, focus-visible outline, `prefers-reduced-motion` respektován
- `main.js` — vanilla, jen mobile nav toggle (open / close, ESC, klik na link zavře)
- `img/wr-logo.svg` — White Rabbit logo, **lokálně zkopírováno z `cml/brand/logo/wr-logo.svg`** (sandbox neuměl `curl` na netlify zdroj uvedený v briefu sekce 3)
- `img/show-*.png` — **8 placeholderů 1280×800** (dark gray + yellow dot + nadpis značky + URL), vygenerováno přes Python PIL. Brief tohle explicitně povoluje jako fallback (sekce 3 „Placeholder fallback"). Hotové pro všech 8 webů včetně Dark Green Solutions (které brief stejně chtěl placeholder kvůli 503).
- `og/og-image.jpg` — 1200×630 OG placeholder s headline „Děláme weby." (DejaVu font, ne Century Gothic)
- `README.md` — stack, mapa sekcí, lokální spuštění, deploy instrukce, QA checklist, TODO list
- `.gitignore` — node_modules, .DS_Store, .vercel/

QA checklist z briefu sec 11 prošel (em-dashes, Google Fonts, Tailwind, Aurora, 8 showcase slugů, CTA dlaždice, DRAFT marker, žádné 404 v lokálním serveru).

---

## Co zbývá udělat

### Krok 1. Založit GitHub repo a pushnout

```bash
cd ~/projects/wr-webs
git init -b main                   # pokud ještě není
git add .
git commit -m "initial: wr-webs microsite (placeholders for screenshots, logo from cml/brand)"

# Pomocí gh CLI
gh repo create whiterabbitcz-dev/wr-webs --private --source=. --remote=origin
git push -u origin main

# Nebo ručně přes web a:
# git remote add origin git@github.com:whiterabbitcz-dev/wr-webs.git
# git push -u origin main
```

### Krok 2. Reálné screenshoty (nahradit placeholders)

Sandbox nemohl spustit puppeteer. Ty (Claude Code lokálně) můžeš.

```bash
cd ~/projects/wr-webs

# Doporučená cesta: oneliner přes npx
npx --yes puppeteer-screenshot https://tomadzusy.cz \
    --output img/show-toma.png --width 1280 --height 800

# Opakuj pro:
#   https://marvisauto.cz                                  → img/show-marvis.png
#   https://whiterabbitcz-dev.github.io/monkeypot/         → img/show-monkeypot.png
#   https://headshotscz.vercel.app                         → img/show-headshots.png
#   https://whiterabbitcz-dev.github.io/Lughnasad/         → img/show-lughnasad.png
#   https://wr-web.vercel.app                              → img/show-whiterabbit.png
#   https://beeer-museum.vercel.app/cs                     → img/show-beermuseum.png

# Dark Green Solutions je 503 podle briefu (sekce 3, bod 8). Nech současný placeholder
# img/show-darkgreen.png (nebo zkus zda je už zpět online; jinak nech a v README dej TODO).
```

Pokud `puppeteer-screenshot` (npm balíček) není dostupný, alternativa:

```bash
# Playwright variant
npm i -D playwright
npx playwright install chromium
node -e "
const { chromium } = require('playwright');
(async () => {
  const targets = [
    ['https://tomadzusy.cz', 'img/show-toma.png'],
    ['https://marvisauto.cz', 'img/show-marvis.png'],
    ['https://whiterabbitcz-dev.github.io/monkeypot/', 'img/show-monkeypot.png'],
    ['https://headshotscz.vercel.app', 'img/show-headshots.png'],
    ['https://whiterabbitcz-dev.github.io/Lughnasad/', 'img/show-lughnasad.png'],
    ['https://wr-web.vercel.app', 'img/show-whiterabbit.png'],
    ['https://beeer-museum.vercel.app/cs', 'img/show-beermuseum.png'],
  ];
  const browser = await chromium.launch();
  for (const [url, out] of targets) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.screenshot({ path: out, fullPage: false });
      console.log('OK', url);
    } catch (e) {
      console.log('FAIL', url, e.message);
    }
    await page.close();
  }
  await browser.close();
})();
"
```

Po nahrazení commit a push:

```bash
git add img/show-*.png
git commit -m "img: replace placeholders with real screenshots (puppeteer)"
git push
```

### Krok 3. Logo verifikace

`img/wr-logo.svg` je kopie z `cml/brand/logo/wr-logo.svg` (master), ne z netlify URL uvedeného v briefu (`tranquil-bombolone-66c37e.netlify.app/logo-whiterabbit-light.svg`). Mělo by být to samé, ale brief odkazuje na netlify jako kanonický zdroj. Otevři lokální server, podívej se, zda logo v navbaru sedí. Pokud chceš slepou jistotu:

```bash
curl -sLO https://tranquil-bombolone-66c37e.netlify.app/logo-whiterabbit-light.svg
diff logo-whiterabbit-light.svg img/wr-logo.svg
# pokud se liší, zvaž který je správný (CML brand/ je novější single source per cml/brand/README.md)
```

### Krok 4. Vercel deploy

```bash
cd ~/projects/wr-webs
npm i -g vercel              # jednorázově
vercel login                 # jednorázově, přihlásit se jako tým white-rabbit-cz
vercel                       # první deploy, název projektu „wr-webs"
vercel --prod                # produkce → wr-webs.vercel.app
```

Pokud chceš custom doménu `weby.whiterabbit.cz`:
1. Vercel dashboard → Project `wr-webs` → Settings → Domains → Add `weby.whiterabbit.cz`
2. Cloudflare DNS pro `whiterabbit.cz` → CNAME `weby` → `cname.vercel-dns.com`, proxy off
3. Vercel auto vystaví SSL přes Let's Encrypt

### Krok 5. Lighthouse

```bash
npx lighthouse https://wr-webs.vercel.app --view --preset=desktop
```

Cíl: Performance ≥ 90, Accessibility = 100, Best Practices ≥ 90, SEO ≥ 90.

Pokud Performance < 90, nejpravděpodobnější příčina jsou velké screenshot PNG. Konvertuj na WebP:

```bash
for f in img/show-*.png; do
  cwebp -q 85 "$f" -o "${f%.png}.webp"
done
# Pak v index.html nahraď src="img/show-X.png" za <picture><source srcset="img/show-X.webp" type="image/webp"><img src="img/show-X.png" ...></picture>
```

### Krok 6. Aktualizace CML

V `whiterabbitcz-dev/cml` po finálním deploy:

1. `projects/wr-webs.md` (už existuje na branchi `claude/review-project-progress-jSbeP` v cml repu):
   - Status `planned` → `wip` po prvním commitu, `live` po Vercel deploy
   - Repo: doplnit `whiterabbitcz-dev/wr-webs`
   - Live URL: doplnit `wr-webs.vercel.app`
   - `lastTouch`: aktualizovat
2. `dashboard.html` v cml: shodně aktualizovat entry pro `wr-webs`
3. Drive Google Doc `White Rabbit/CML/wr-webs/project-card` (id `1j1evA1Fck6sDE5CvoceILBEk9W5JN5fadXSXhYOCxZA`) shodně aktualizovat — Drive je master per migrace v `cml/migration/README.md`

### Krok 7. Lenka pricing review

Brief sec 5 i v `BRIEF.md`: ceny i timeline jsou DRAFT, Lenka má potvrdit nebo přepsat **dřív, než URL půjde reálnému klientovi**. V `index.html` je viditelný `tier-note` s touto poznámkou a HTML komentář `<!-- DRAFT: ceny i timeline jsou návrh dle scope analysis, čekají na potvrzení od Lenky -->`.

Až Lenka potvrdí:
1. Aktualizuj čísla v `index.html` (sekce `#tiery`, 4 karty)
2. Smaž HTML komentář a `<p class="tier-note">` blok
3. Commit: `tier: confirmed pricing per Lenka (T1/T2/T3/T4)`

---

## Rozhodnutí, která jsem během buildu udělal

Brief sec 16 říká „pokud při buildu narazíš na rozhodnutí, které tohle zadání nepokrývá, vyber sám konzervativně podle DNA, v kódu napiš `// decision: [popis]`". V tomhle buildu jsem rozhodl:

1. **Logo z `cml/brand/logo/` místo netlify curl** — sandbox neumí ven, ale master pro WR brand je `cml/brand/` (viz `cml/brand/README.md`). Funkčně stejné.
2. **Em-dashes přepsány na alternativy v ceníku** — brief vyžaduje „1,5–2 týdny" formát (s `–`, což je en-dash U+2013, OK), ale brief sám používá `-` (ASCII hyphen) v range formátech. Použil jsem `až` slovem („1,5 až 2 týdny", „50 000 až 75 000 Kč") pro lepší czech reading. Pokud se ti to nelíbí, vrať na `-`.
3. **Showcase CTA dlaždice** — brief popisuje obsah, ne přesný formát. Zvolil jsem inverzní variantu (border `2px solid accent`, žluté texty, sjednocený `border-top: 4px solid accent` aby ladila s ostatními dlaždicemi formátu B).
4. **Tier card „Reference" řádek** — brief v sec 5 vyjmenovává v textu, použil jsem `<dl>` strukturu s ostatními řádky pro vizuální konzistenci.
5. **Stats strip čísla bez tečky / komy** — `8`, `100 %`, `14 dní`, `4` — žádná interpunkce, čistá čísla per brief sec 9.3.
6. **Hero CTA „Cena podle rozsahu"** — brief má to v hranatých závorkách jako label. Použil jsem výchozí button styl outline (sekundární), primary šipka jde na `#prace`.
7. **`mailto:` subject encoded** — `?subject=Web%20pro%20[va%C5%A1i%20zna%C4%8Dku]` — diakritika encoded jako UTF-8 percent encoding. Pokud klient klikne, otevře se mail klient s předvyplněným subject.
8. **FAQ ponecháno** — brief sec 8 říká „pokud cítíš, že stránka je krátká, přidej". Single-page bez FAQ působí useknutě před kontaktem; nechal jsem všech 6.
9. **`<h2>` v sekci Kontakt visually-hidden** — brief sec 9.9 chce centrovaný mailto + sekundární CTA, žádný H2 nadpis. Pro a11y semantic strukturu jsem přidal skrytý `<h2 id="kontakt-h">Kontakt</h2>`.

Žádné `<!-- TODO: -->` jsem v HTML nenechal, protože brief má jasně danou copy. TODO listy jsou v `README.md` a tady.

---

## TL;DR pro Martina

- Microsite je hotová (HTML / CSS / JS / brand DNA / copy / brand-clean). Otevři lokálně přes `python3 -m http.server 8080` a mrkni.
- **Co zbývá:**
  1. Push do nového repa `whiterabbitcz-dev/wr-webs` (chce gh CLI nebo ruční create na webu)
  2. Reálné screenshoty 7 webů přes puppeteer / playwright (1 = Dark Green Solutions zůstane placeholder kvůli 503)
  3. Vercel deploy → `wr-webs.vercel.app`
  4. Custom doména `weby.whiterabbit.cz` (Cloudflare CNAME)
  5. Aktualizovat status v cml/`projects/wr-webs.md` + dashboard + Drive
  6. Lenka schválí ceny → smazat DRAFT note + případně přepsat čísla
- Lokální Claude Code (ne web sandbox) by měl všech 6 zvládnout bez problémů — má síť, gh, Vercel CLI.
