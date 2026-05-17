# wr-webs

White Rabbit, microsite k webovým službám. Showcase 8 realizovaných webů + vzorový ceník ve 4 tierech.

> **Poznámka.** Tohle je `wr-webs`, samostatný projekt s vlastním repem a vlastním Vercel deploymentem. Hlavní web White Rabbit (`wr-web.vercel.app` / `whiterabbit.cz`) je úplně jiný projekt. Nemíchat.

## Stack

Vanilla HTML/CSS/JS. Single page. Žádný framework, žádný build step, žádné dependencies.

```
wr-webs/
├── BRIEF.md         # zdrojové zadání (atomický v3)
├── HANDOFF.md       # co je hotovo, co ještě zbývá, instrukce pro dalšího Claude Code
├── README.md        # tento soubor
├── index.html       # single page, sekce 1 až 9 (top nav, hero, stats, showcase, tiery, v ceně, proces, FAQ, kontakt)
├── styles.css       # brand DNA + layout, mobile-first, breakpointy 640 / 768 / 1024
├── main.js          # mobile nav toggle, vanilla, žádné dependencies
├── img/
│   ├── wr-logo.svg          # White Rabbit logo (z cml/brand/logo/)
│   ├── show-darkgreen.png   # placeholdery 1280×800, viz HANDOFF.md krok 2
│   ├── show-toma.png
│   ├── show-marvis.png
│   ├── show-monkeypot.png
│   ├── show-headshots.png
│   ├── show-lughnasad.png
│   ├── show-whiterabbit.png
│   └── show-beermuseum.png
└── og/
    └── og-image.jpg         # 1200×630 placeholder
```

## Mapa sekcí webu

| Sekce | ID v HTML | Popis |
|---|---|---|
| 1. Top nav | `<header class="nav">` | Sticky, links + CTA, hamburger pod 768 px |
| 2. Hero | `<section class="hero">` | H1, subtitle, 2 CTA, „Follow the White Rabbit..." italic |
| 3. Stats strip | `<section class="stats">` | 8, 100 %, 14 dní, 4 |
| 4. Naše práce | `#prace` | 4-col grid (showcase + CTA dlaždice) |
| 5. Tiery | `#tiery` | 4 karty, T3 s badge „Doporučujeme" |
| 6. V ceně / není v ceně | (section) | Dva sloupce, žlutý vs gray border |
| 7. Jak to děláme | `#proces` | 5 kroků, žlutá tečka mezi nimi |
| 8. FAQ | (section) | 6 otázek, karty formát B |
| 9. Kontakt / CTA | `#kontakt` | Velký mailto, sekundární CTA |
| Footer | `<footer>` | Signature + meta + copyright + cross-link |

## Lokální spuštění

```bash
cd ~/projects/wr-webs
python3 -m http.server 8080
open http://localhost:8080
```

## Deploy (Vercel)

```bash
npm i -g vercel        # jednorázově, pokud nemáš
vercel                 # interaktivně: nový projekt „wr-webs", root = .
vercel --prod          # produkce
```

Vercel ti dá `wr-webs.vercel.app`. Custom doména (`weby.whiterabbit.cz` přes Cloudflare CNAME na `cname.vercel-dns.com`) později.

## QA checklist

Viz `BRIEF.md` sekce 11 nebo:

```bash
cd ~/projects/wr-webs

# Em-dashes (U+2014) nikde
grep -RnP --include='*.html' --include='*.css' --include='*.js' $'\xe2\x80\x94' . && echo "FAIL: em-dashes found" || echo "OK: no em-dashes"

# Žádné Google Fonts CDN
grep -n 'fonts.googleapis' index.html && echo "FAIL" || echo "OK"

# Žádný Tailwind / Aurora / blob backgrounds
grep -nE 'tailwind|animate-blob|blur-3xl|aurora' styles.css index.html && echo "FAIL" || echo "OK"

# Všech 8 showcase URL existuje v kódu
for slug in darkgreen toma marvis monkeypot headshots lughnasad whiterabbit beermuseum; do
  grep -q "show-${slug}" index.html || echo "MISSING showcase tile: $slug"
done

# CTA dlaždice „Vaše značka tady?"
grep -q "Vaše značka tady" index.html || echo "MISSING CTA tile"

# DRAFT marker u ceníku
grep -q "DRAFT" index.html || echo "MISSING DRAFT marker"
```

## TODO

- [ ] **Lenka:** confirm pricing ranges T1 až T4
- [ ] **Lenka:** confirm „v ceně / není v ceně" lists are complete
- [ ] **Lenka:** replace `mailto:` with cal.com link for 30min booking
- [ ] **Screenshoty:** replace all 8 `img/show-*.png` placeholders with real captures (puppeteer / playwright). Příkazy v `BRIEF.md` sekce 3.
- [ ] **OG image:** regenerate `og/og-image.jpg` s reálnou typografií Century Gothic (placeholder používá DejaVu jako fallback)
- [ ] **Footer:** replace `IČO TODO` a `VAT TODO` s reálnými hodnotami White Rabbit s.r.o.
- [ ] **Logo:** verifikovat, že `img/wr-logo.svg` (kopie z `cml/brand/logo/`) je správná aktuální verze
- [ ] **Lighthouse:** spustit po nasazení, cíl Performance ≥ 90, Accessibility = 100

Detailní handoff a kontext **proč to tak je**: viz `HANDOFF.md`.
