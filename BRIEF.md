# WR_WEBS_BRIEF (konsolidovaný v3, jediný zdroj pravdy)

Zadání pro Claude Code. Postavit **samostatnou microsite** ve White Rabbit brand stylu, která prezentuje webové služby agentury. Dvě hlavní hodnoty: **showcase realizovaných webů** a **vzorový ceník ve 4 tierech**.

> **Pozor.** Tohle NENÍ modifikace existujícího repa `wr-web/` (hlavní web White Rabbit). Je to **úplně nový samostatný projekt** v novém repu `wr-webs/`, s vlastním vercel deploymentem. `wr-web` zůstává nedotčený.
>
> Tento dokument **nahrazuje** všechny předchozí briefy a patche, které vznikly v Claude.ai konverzaci (`WR_WEBS_BRIEF.md`, `WR_WEBS_BRIEF_PATCH.md`, `WR_WEBS_BRIEF_PATCH_02.md`). Pokud máš v ruce starší dokument, ignoruj ho. Tenhle je atomický.

---

## 1. Setup

### Nové repo, mimo wr-web

```bash
mkdir -p ~/projects/wr-webs
cd ~/projects/wr-webs
git init
```

### Struktura

```
wr-webs/
├── BRIEF.md            # tento dokument, commit do repa
├── README.md           # deploy instrukce + TODO list
├── index.html
├── styles.css
├── main.js
├── img/
│   ├── wr-logo.svg     # stáhnout z původního WR webu
│   ├── show-darkgreen.png   # screenshoty showcase webů (sekce 4)
│   ├── show-toma.png
│   ├── show-marvis.png
│   ├── show-monkeypot.png
│   ├── show-headshots.png
│   ├── show-lughnasad.png
│   ├── show-whiterabbit.png
│   └── show-beermuseum.png
└── og/
    └── og-image.jpg
```

### Stack

Vanilla HTML/CSS/JS, single page. **Žádný framework, žádný build step, žádné dependencies.** Stejný styl konstrukce jako `wr-web` repo (z paměti by sis měl pamatovat brand DNA).

### Deploy

Nový vercel projekt, doporučený název `wr-webs` (vercel ti dá `wr-webs.vercel.app`). Custom doména (`weby.whiterabbit.cz` nebo podobně) později.

---

## 2. Brand DNA

**Identický brand jako `wr-web`** (hlavní web). Konzistence napříč WR microsites je featura, ne chyba.

```css
:root {
  --bg: #000000;
  --dark-gray: #1A1A1A;
  --darker: #0A0A0A;
  --gray: #888888;
  --white: #FFFFFF;
  --accent: #FFC107;
  --dark-accent: #784213;
  --font: "Century Gothic", "URW Gothic", "Avantgarde", "Trebuchet MS", system-ui, sans-serif;
}
```

**Tvrdé zákazy:**
- `border-radius` (nikde, vše ostré hrany)
- `box-shadow` (nikde)
- gradienty
- animované blob backgrounds (Aurora style)
- em-dash (U+2014). Místo něj tečka, dvojtečka, závorka, středník
- Title Case v českých nadpisech (sentence case: „Co děláme", ne „Co Děláme")
- Google Fonts CDN (self-host nebo fallback stack)
- emoji
- Tailwind

**Lowercase brand wordmarky:** `nutribullet`, `eBay`, `iPhone`, `adidas`. Pokud se objeví v copy.

**Karty dvou formátů:**
- Formát A: `border-left: 4px solid var(--accent); background: var(--dark-gray)`
- Formát B: `border-top: 4px solid var(--accent); background: var(--dark-gray)`

Drž konzistenci v rámci sekce. Nemíchat.

**Footer signature:** `Follow the White Rabbit...` italic gray.

---

## 3. Stažení assetů

### Logo SVG

```bash
curl -sLO https://tranquil-bombolone-66c37e.netlify.app/logo-whiterabbit-light.svg
mv logo-whiterabbit-light.svg img/wr-logo.svg
```

### Screenshoty showcase webů

Pokud máš puppeteer / playwright dostupný:

```bash
# 1. Toma džusy
npx puppeteer-screenshot https://tomadzusy.cz \
  --output img/show-toma.png --width 1280 --height 800

# 2. Marvis auto
npx puppeteer-screenshot https://marvisauto.cz \
  --output img/show-marvis.png --width 1280 --height 800

# 3. Monkey Pot
npx puppeteer-screenshot https://whiterabbitcz-dev.github.io/monkeypot/ \
  --output img/show-monkeypot.png --width 1280 --height 800

# 4. Headshots
npx puppeteer-screenshot https://headshotscz.vercel.app \
  --output img/show-headshots.png --width 1280 --height 800

# 5. Lughnasad
npx puppeteer-screenshot https://whiterabbitcz-dev.github.io/Lughnasad/ \
  --output img/show-lughnasad.png --width 1280 --height 800

# 6. White Rabbit
npx puppeteer-screenshot https://wr-web.vercel.app \
  --output img/show-whiterabbit.png --width 1280 --height 800

# 7. Beer Museum
npx puppeteer-screenshot https://beeer-museum.vercel.app/cs \
  --output img/show-beermuseum.png --width 1280 --height 800

# 8. Dark Green Solutions
# Aktuálně 503, použij placeholder (dark gray 1280×800 s žlutou tečkou v rohu a textem "Dark Green Solutions")
```

**Placeholder fallback** pokud puppeteer není dostupný nebo některý web vrací error:

```html
<!-- v index.html zachovej <img src="img/show-X.png">, ale soubor img/show-X.png
     vyrob jako CSS-only placeholder via canvas/svg, nebo použij solid dark-gray PNG 1280×800 -->
```

V README do TODO listu napiš `Replace screenshot placeholders with real captures` pro každý chybějící soubor.

---

## 4. Showcase sekce (8 webů + 1 CTA)

**Layout:** 4-sloupcový grid na desktopu, 2-sloupcový tablet, 1-sloupcový mobile. Aspect ratio screenshotu **16:10**, 1rem gap. Card formát B (žlutý border nahoře).

**Status caps label** v levém horním rohu dlaždice (žlutá): `PŘEDÁNO` nebo `PROBÍHÁ`. **Tier badge** v pravém horním (světle gray): `T1`, `T2`, `T3`.

### Blok 1. PŘEDÁNO (5 dlaždic)

**1. Dark Green Solutions** · T1 · `https://darkgreensolutions.cz`
> Brand prezentace pro environmentální poradenskou firmu. Statický web, kontaktní formulář, MS 365 napojení.

**2. Toma džusy** · T2 · `https://tomadzusy.cz`
> Brand web pro tradiční českou značku ovocných džusů. Příběh značky, produktová řada, distribuce.

**3. Marvis auto** · T2 · `https://marvisauto.cz`
> Web autoservisu v Dobříči. Služby, ceník, kontakt, online objednání termínu.

**4. Monkey Pot** · T1 · `https://whiterabbitcz-dev.github.io/monkeypot/`
> Keramický ateliér na Letné. Kurzy točení, e-shop, gastro spolupráce. Personal brand Martina Minkse.

**5. Headshots (Martin Svoboda)** · T1 · `https://headshotscz.vercel.app`
> Portrétní fotograf z Prahy. Vizitka s portfoliem, about a online bookingem. Statický export.

### Blok 2. PROBÍHÁ (3 dlaždice)

**6. Lughnasad festival** · T2 · `https://whiterabbitcz-dev.github.io/Lughnasad/`
> Web pro 20. ročník mezinárodního festivalu keltské kultury. Program, vstupenky, merch, areál, FAQ.

**7. White Rabbit** · T2 · `https://wr-web.vercel.app`
> Vlastní web. Bez buzzwordů, bez stockových obrázků. Černá s žlutou.

**8. Beer Museum** · T3 · `https://beeer-museum.vercel.app/cs`
> Web pro Czech Beer Museum Prague. Multi-jazyčný (CS/EN/DE/JP), online prodej vstupenek, sekce zážitků, Google reviews integrace.

### 9. CTA dlaždice (inverzní)

Místo 9. reference dej **inverzní karta** s outline / dark gray pozadím a žlutým textem:

```
[ + ] Vaše značka tady?

Domluvíme si 30min hovor a sepíšeme rozsah.

[Naplánovat hovor →]
```

Tlačítko: `mailto:info@whiterabbit.cz?subject=Web pro [vaši značku]` jako placeholder. V README do TODO: `Replace mailto with cal.com link when available`.

---

## 5. Ceník (4 tiery)

**DRAFT.** Hodnoty cen i timeline jsou návrh založený na reálném btnz rozpočtu (8 000 Kč/den standard, 10 000 Kč/den specialized) aplikovaný na ostatní weby. Před tím, než URL půjde reálnému klientovi, **Lenka má ceny potvrdit nebo přepsat**.

V kódu označ:
```html
<!-- DRAFT: ceny i timeline jsou návrh dle scope analysis, čekají na potvrzení od Lenky -->
```

A v README do TODO list:
```
- [ ] Lenka: confirm pricing ranges and timelines for all 4 tiers
- [ ] Lenka: confirm "v ceně" / "není v ceně" lists are complete
```

### Layout

4 sloupce (1 mobile, 2 tablet, 4 desktop), karty formát A (žlutá lišta vlevo). Tier 3 má **„Doporučujeme"** badge žluté nahoře nad kartou.

### Tier 1. Vizitka

```
Pro koho:   Malé firmy, OSVČ, butiky, eventy, personal brand.
Co dostanete: Statický web, 1-5 sekcí, kontakt, mobilní optimalizace,
              SEO základ, Google Analytics setup. Statický export
              (Next.js / Astro / vanilla).
Stránek:    1-3
Doba:       1,5-2 týdny
Cena:       50 000 - 75 000 Kč
Reference:  Headshots, Monkey Pot, Dark Green Solutions
```

### Tier 2. Standard

```
Pro koho:   Festivaly, kulturní akce, lifestyle brandy, agentury,
            B2B služby, lokální podniky, FMCG brandy.
Co dostanete: Multi-page web, custom design, formuláře, SEO + structured
              data, lokální Google Business napojení, FAQ, content
              produkce. CMS (WordPress + ACF Pro nebo custom dev).
Stránek:    5-15
Doba:       2,5-3 týdny
Cena:       100 000 - 130 000 Kč
Reference:  Marvis auto, Toma džusy, Lughnasad, whiterabbit.cz
```

### Tier 3. Custom *(doporučujeme)*

```
Pro koho:   Brandy, co chtějí něco navíc. Muzea, rezidenční projekty,
            B2B s komplexním produktem, multi-jazyčné weby.
Co dostanete: Vše z Tieru 2 plus: multi-language, online booking,
              e-commerce flow, integrace s API (Google Reviews, ticketing),
              AI chatbot s knowledge base, custom blocks.
Stránek:    10+ + custom features
Doba:       4-5 týdnů
Cena:       180 000 - 280 000 Kč
Reference:  Beer Museum (multilang, ticketing, reviews)
```

### Tier 4. Heavy Custom / Commerce

```
Pro koho:   E-shopy, vstupenkové portály, předplatné, B2B objednávkové
            systémy, immersive experience weby.
Co dostanete: Vše z Tieru 3 plus: payment gateway (GP webpay, Comgate,
              Stripe), produktový katalog, skladové hospodářství,
              vícestupňový checkout, napojení na CRM, WebAR / 3D experience.
Stránek:    15+ + commerce flow + custom experience
Doba:       7-10 týdnů
Cena:       od 300 000 Kč
Reference:  Beer Museum + chystaný WebAR + e-shop upgrade
```

**Struktura každé karty:** caps label nahoře (`01 / VIZITKA`, `02 / STANDARD`, atd.), pak Pro koho / Co dostanete / Stránek / Doba / Cena / Reference. Cena tučně, ostatní řádky regular.

---

## 6. V ceně. A co není.

Sekce hned za tiery. Dva sloupce kontrast. Žlutý border vlevo / nahoře u sloupce „v ceně", gray border u „není v ceně".

### V ceně každého tieru

- Strategická konzultace na začátku, definice cílů
- Wireframy a designové návrhy
- Vývoj a deployment na vlastní hosting nebo klientův
- Mobilní responsivita, SEO základ, accessibility
- 14 dní support po předání (bug fixy zdarma)
- Dokumentace pro klienta, předávací schůzka
- Domain DNS setup, SSL certifikát

### Co není v ceně

- Hosting po prvním roce (klient si platí sám, nebo přejde k nám za měsíční fee)
- Pravidelný content management (psaní článků, foto, video)
- Performance kampaně, Meta Ads, Google Ads (samostatná služba)
- Doména registrace (klient si kupuje sám, my pomůžeme nakonfigurovat)
- Stock fotografie nebo placené ilustrace (zařídíme za nákladovou cenu)
- Continuous development po 14 dnech (samostatnou smlouvou nebo retainerem)

---

## 7. Jak to děláme (proces)

5 kroků horizontálně (mobile: vertikál stack). Každý krok = caps label + krátký popisek 2 řádky. Mezi kroky drobný separator (žlutá tečka, žádná čára).

```
01 BRIEF.    Zjistíme, co chcete a komu to mluví.
             Cílovky, konkurence, KPI.

02 NÁVRH.    Wireframes a směr designu.
             Schvalujete na 1 schůzce, pak fixujeme.

03 STAVBA.   Code, deploy, testing.
             Týdenní reporty, žádné měsíční ticho.

04 PŘEDÁNÍ.  Spuštění + dokumentace.
             Naučíme vás obsah upravovat sami.

05 KLID.     14 dní support zdarma. Pak buď retainer
             nebo klid. Nikdo se nelepí.
```

Tečky za nadpisy kroků jsou OK (signature pattern WR), ale nepoužívej je v navigaci ani v tier nadpisech.

---

## 8. FAQ (volitelné, pokud zbude prostor)

Pokud cítíš, že stránka je krátká, přidej 4-6 FAQ otázek na konec před CTA. Pokud je dost dlouhá, vyhoď.

1. **Jak dlouho trvá zaplatit?**
   `Zálohu 30 % před startem, 40 % po schválení designu, 30 % při předání. Faktury se splatností 14 dní.`

2. **Můžu si web spravovat sám?**
   `Ano, předáváme dokumentaci a edit přístup. Pro Tier 2+ má klient admin panel.`

3. **Pracujete s WordPress?**
   `Ano, ale doporučujeme statické řešení nebo headless CMS. WordPress jen tam, kde to klient výslovně chce.`

4. **Co když web spadne v 3:00 ráno?**
   `Pokud je v rámci 14denního supportu, řešíme do 4 hodin. Mimo to v rámci retaineru. Bez retaineru: další pracovní den.`

5. **Můžete mi udělat jen design?**
   `Ne. Děláme strategy + design + code dohromady. Half-services nedávají smysl.`

6. **Pracujete s ČR i zahraničím?**
   `ČR a Slovensko bez omezení. EU občas. Globálně zatím ne.`

Karty formát B (žlutý border nahoře). Otázka tučně, odpověď pod ní gray. 1-2 sloupce.

---

## 9. Sekce webu (kompletní pořadí)

1. **Top nav** sticky. Linky: `Naše práce`, `Tiery`, `Proces`, `Kontakt` + `[Napsat nám]` jako žluté CTA. Logo SVG vlevo.

2. **Hero.**
   - H1: `Děláme weby. Nikoho neztratíme v menu.`
   - Subtitle: `Od vizitky po e-shop. 4 tiery, jasné ceny, konkrétní termín.`
   - CTAs: `[Naše práce →]` `[Cena podle rozsahu]`
   - Pod CTA italic gray: `Follow the White Rabbit...`

3. **Stats strip.** 4 čísla:
   - `8` (realizovaných webů)
   - `100 %` (předáno v termínu)
   - `14 dní` (support zdarma)
   - `4` (tiery)

4. **Naše práce.** Showcase grid podle sekce 4. H2 + subtitle gray.

5. **Tiery.** 4 karty podle sekce 5.
   - H2: `Kolik to stojí`
   - Subtitle: `Vyberte si rozsah. Cenu fixujeme po briefu.`

6. **V ceně. A co není.** Dva sloupce podle sekce 6.

7. **Jak to děláme.** 5 kroků podle sekce 7.

8. **FAQ.** Volitelně podle sekce 8.

9. **Kontakt / CTA.** Centrované.
   - Velký mailto:info@whiterabbit.cz
   - Sekundární CTA `[Naplánovat 30min hovor]` (mailto placeholder, TODO cal.com)

10. **Footer.**
    - `Follow the White Rabbit...` italic gray
    - `White Rabbit s.r.o. · IČO TODO · VAT TODO · Letná, Praha`
    - Copyright `© 2026 White Rabbit`
    - Cross-link: `Hlavní web: whiterabbit.cz`

---

## 10. Responsive a a11y

- Mobile first. Breakpointy: 640 / 768 / 1024 px
- Sticky nav s hamburgerem pod 768
- Touch targets min 44×44 px
- Kontrast: bílá / gray na černé OK, dark accent na žluté OK
- `prefers-reduced-motion` respektovat
- Lang `cs`
- Sémantické HTML (`<header>`, `<main>`, `<section>`, `<article>`, `<footer>`)
- Alt texty na všech obrázcích

---

## 11. QA checklist

```bash
cd ~/projects/wr-webs

# Em-dash check (hledá U+2014)
grep -rE $'—' . --include='*.html' --include='*.css' --include='*.js'
# expected: žádný výsledek

# nutribullet lowercase
grep -E 'NutriBullet|Nutribullet|NUTRIBULLET' index.html

# Žádné Google Fonts
grep 'fonts.googleapis' index.html

# Žádné Aurora / blob backgrounds v CSS
grep -E 'animate-blob|blur-3xl|aurora' styles.css

# DRAFT komentář u tier cen
grep "DRAFT.*Lenk\|placeholder.*Lenk" index.html

# Všech 8 showcase URL existuje v kódu
for slug in darkgreen toma marvis monkeypot headshots lughnasad whiterabbit beermuseum; do
  grep -q "show-${slug}" index.html || echo "MISSING showcase tile: $slug"
done

# CTA dlaždice „Vaše značka tady?" existuje
grep -q "Vaše značka tady" index.html || echo "MISSING CTA tile"

# Lokální server
python3 -m http.server 8080
# Otevři http://localhost:8080, mrkni Network tab, žádný 404

# Lighthouse: Performance >= 90, Accessibility = 100
```

---

## 12. README obsahuje

- Stack a deploy instrukce (vercel)
- Mapu sekcí webu
- TODO list:
  ```
  - [ ] Lenka: confirm pricing ranges T1-T4
  - [ ] Lenka: confirm "v ceně / není v ceně" lists
  - [ ] Lenka: replace mailto with cal.com link for 30min booking
  - [ ] Replace screenshot placeholders if any (puppeteer fail fallback)
  - [ ] Replace IČO TODO and VAT TODO in footer with real values
  - [ ] Generate fresh og-image.jpg with current branding
  ```
- Poznámku, že tohle je `wr-webs` (samostatný od `wr-web` hlavního webu)

---

## 13. Co NEDĚLAT

- Nepoužívej React, Astro, Next, Vue, Tailwind, ani žádný framework
- Žádné animace (blob, parallax, float, fadeIn na scroll). Jen fade overlay na hover v showcase grid
- Žádný carousel co se sám otáčí
- Žádné Google Fonts CDN. Self-host Century Gothic nebo fallback stack
- Žádný cookie banner, GA, FB pixel (klient řeší později)
- Žádné fake testimonials nebo placeholder quoty
- Žádné klientská loga dump (to je doména hlavního webu)
- Žádný emoji
- Nepiš „web na klíč" ani jiné buzz fráze (`synergy`, `transform`, `revolutionize`)
- Nehádej IČO ani VAT, drž TODO

---

## 14. Workflow

1. Setup nového repa `wr-webs/` (mimo `wr-web/`)
2. Stažení logo SVG (sekce 3)
3. Pokus o 7 screenshotů live webů (puppeteer / playwright / placeholder fallback)
4. Build CSS s tokens podle brand DNA (sekce 2)
5. Build HTML podle sekce 9
6. Mobile menu JS (vanilla, fork z `wr-web` pokud existuje stejný pattern)
7. Spustit QA checklist (sekce 11)
8. Lighthouse run
9. README s TODO listem
10. Commit do `wr-webs` repa, push na GitHub (whiterabbitcz-dev/wr-webs)
11. Deploy na vercel jako nový projekt `wr-webs`
12. Pošli URL zpět Martinovi

---

## 15. Klíčová fakta pro sanity check

Než začneš stavět, ověř že chápeš:

- [x] `wr-webs` je **NOVÝ** projekt, ne modifikace `wr-web`
- [x] Brief žije v **rootu nového repa** jako `BRIEF.md`
- [x] Showcase má **8 webů + 1 CTA dlaždice** (5 PŘEDÁNO, 3 PROBÍHÁ)
- [x] `nutribullet` lowercase (pokud se objeví v copy, ale v tomhle showcase se neobjeví)
- [x] Žádný em-dash nikde
- [x] Tier 3 má badge „Doporučujeme"
- [x] Ceny v Tier 1-4 jsou DRAFT, čekají na Lenku
- [x] Production URL Headshots je `headshotscz.vercel.app` (NE preview URL s hashem)
- [x] Beer Museum URL je `beeer-museum.vercel.app/cs` (CS varianta jako default)
- [x] Dark Green Solutions je 503, použij placeholder

---

## 16. Pokud něco nesedí

- Pokud při buildu narazíš na rozhodnutí, které tohle zadání nepokrývá, vyber sám konzervativně podle DNA (ostré hrany, černá / žlutá / bílá / gray, žádné animace). V kódu napiš `// decision: [popis]` pro pozdější review.
- Pokud chybí obsah, který nedokážeš odvodit z briefu, napiš `<!-- TODO: [co potřebuješ] -->` v HTML jako placeholder. **Nehádej, nevymýšlej fake data.**
- Pokud cokoliv zásadně koliduje s tvými předpoklady (např. „chceš to v `wr-web/` nebo novém repu?"), **STOP a zeptej se Martina** na chatu, neimprovizuj.
