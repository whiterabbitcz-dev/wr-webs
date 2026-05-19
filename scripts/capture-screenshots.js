// Capture above-the-fold screenshots of 8 showcase URLs and save as WebP.
// Idempotent — re-running overwrites existing files in assets/showcase/.
//
// Usage:
//   npm install                       (one-time, installs playwright + sharp)
//   npx playwright install chromium   (one-time, downloads chromium binary)
//   node scripts/capture-screenshots.js
//
// Output: assets/showcase/{slug}.webp at quality 85

const { chromium } = require('playwright');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SITES = [
  { slug: 'darkgreen',   url: 'https://darkgreensolutions.cz' },
  { slug: 'toma',        url: 'https://tomadzusy.cz' },
  { slug: 'marvis',      url: 'https://marvisauto.cz' },
  { slug: 'monkeypot',   url: 'https://whiterabbitcz-dev.github.io/monkeypot/' },
  { slug: 'headshots',   url: 'https://headshotscz.vercel.app' },
  { slug: 'lughnasad',   url: 'https://whiterabbitcz-dev.github.io/Lughnasad/' },
  { slug: 'whiterabbit', url: 'https://wr-web.vercel.app' },
  { slug: 'beermuseum',  url: 'https://beeer-museum.vercel.app/cs' },
];

const VIEWPORT = { width: 1440, height: 900 };
const DEVICE_SCALE = 2;
const QUALITY = 85;
const OUT_DIR = path.join(__dirname, '..', 'assets', 'showcase');

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: DEVICE_SCALE,
    ignoreHTTPSErrors: true,
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
      '(KHTML, like Gecko) Chrome/124.0 Safari/537.36',
  });

  let okCount = 0;
  let failCount = 0;

  for (const { slug, url } of SITES) {
    const page = await context.newPage();
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(1500);
      const png = await page.screenshot({
        clip: { x: 0, y: 0, width: VIEWPORT.width, height: VIEWPORT.height },
      });
      const outPath = path.join(OUT_DIR, `${slug}.webp`);
      // Capture at 2× retina raster (2880×1800) for sharpness, then downsize to
      // 1440 wide for a tile-friendly file size (well under 200 KB target).
      await sharp(png)
        .resize({ width: VIEWPORT.width, withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(outPath);
      const sizeKB = (fs.statSync(outPath).size / 1024).toFixed(1);
      console.log(`[OK] ${url} → assets/showcase/${slug}.webp (${sizeKB} KB)`);
      okCount++;
    } catch (e) {
      console.error(`[FAIL] ${url}: ${e.message}`);
      failCount++;
    } finally {
      await page.close();
    }
  }

  await browser.close();
  console.log(`\nDone. ${okCount} ok, ${failCount} failed.`);
  process.exit(failCount > 0 ? 1 : 0);
})();
