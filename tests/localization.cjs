const assert = require('node:assert/strict');
const { chromium } = require('playwright');

(async () => {
  const base = process.env.SITE_URL || 'http://127.0.0.1:4000';
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome-stable', args: ['--no-sandbox'] });
  try {
    for (const [locale, expected] of [['ko-KR', 'ko'], ['ko', 'ko'], ['en-US', 'en'], ['fr-FR', 'en']]) {
      const context = await browser.newContext({ locale });
      const page = await context.newPage();
      await page.goto(base);
      assert.equal(await page.locator('html').getAttribute('lang'), expected);
      assert.equal(await page.locator('#language-select').inputValue(), 'system');
      await context.close();
    }
    const context = await browser.newContext({ locale: 'ko-KR' });
    const page = await context.newPage();
    await page.goto(base);
    await page.locator('#language-select').selectOption('en');
    assert.equal(await page.evaluate(() => localStorage.getItem('wie-language')), 'en');
    for (const path of ['/', '/faq.html', '/compatibility.html', '/404.html']) {
      await page.goto(base + path);
      assert.equal(await page.locator('html').getAttribute('lang'), 'en');
      const expected = {
        '/': ['.hero-subtitle', 'Remember mobile games'],
        '/faq.html': ['.faq-question', 'What is WIE?'],
        '/compatibility.html': ['.status-playable', 'Playable'],
        '/404.html': ['[data-i18n="not_found_body"]', 'The page you requested could not be found.']
      }[path];
      assert.ok((await page.locator(expected[0]).first().textContent()).includes(expected[1]));
      const problems = await page.evaluate(() => {
        const translations = JSON.parse(document.querySelector('#translations').textContent);
        const errors = [];
        for (const node of document.querySelectorAll('*')) {
          for (const attr of node.attributes) {
            if (!attr.name.startsWith('data-i18n')) continue;
            if (!translations.en[attr.value] || !translations.ko[attr.value]) errors.push(attr.value);
          }
        }
        return errors;
      });
      assert.deepEqual(problems, []);
      await page.locator('#language-select').selectOption('ko');
      assert.equal(await page.locator('meta[property="og:locale"]').getAttribute('content'), 'ko_KR');
      assert.equal(await page.title(), await page.locator('meta[property="og:title"]').getAttribute('content'));
      await page.locator('#language-select').selectOption('en');
    }
    await page.goto(base);
    await page.reload();
    assert.equal(await page.locator('#language-select').inputValue(), 'en');
    assert.equal(await page.locator('.screenshot').first().getAttribute('alt'), 'Screenshot 1');
    assert.equal(await page.locator('.footer-email').getAttribute('aria-label'), 'Email');
    page.once('dialog', async dialog => {
      assert.equal(dialog.message(), 'Coming soon!');
      await dialog.dismiss();
    });
    await page.locator('.btn-store').first().click();
    await page.locator('#language-select').selectOption('system');
    assert.equal(await page.evaluate(() => localStorage.getItem('wie-language')), null);
    assert.equal(await page.locator('html').getAttribute('lang'), 'ko');
    await page.evaluate(() => {
      Object.defineProperty(navigator, 'language', { value: 'de-DE', configurable: true });
      window.dispatchEvent(new Event('languagechange'));
    });
    assert.equal(await page.locator('html').getAttribute('lang'), 'en');
    await page.locator('#language-select').selectOption('ko');
    await page.evaluate(() => window.dispatchEvent(new Event('languagechange')));
    assert.equal(await page.locator('html').getAttribute('lang'), 'ko');
    page.once('dialog', async dialog => {
      assert.equal(dialog.message(), '준비 중입니다!');
      await dialog.dismiss();
    });
    await page.locator('.btn-store').first().click();
    await page.evaluate(() => localStorage.setItem('wie-language', 'invalid'));
    await page.reload();
    assert.equal(await page.locator('#language-select').inputValue(), 'system');
    assert.equal(await page.locator('html').getAttribute('lang'), 'ko');
    await page.locator('#language-select').focus();
    await page.keyboard.press('End');
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('html').getAttribute('lang'), 'en');
    for (const width of [320, 375, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `overflow at ${width}px`);
      assert.ok(await page.locator('#language-select').isVisible());
    }
    await context.close();

    const restricted = await browser.newContext({ locale: 'ko-KR' });
    await restricted.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Blocked', 'SecurityError'); } });
    });
    const blocked = await restricted.newPage();
    await blocked.goto(base);
    await blocked.locator('#language-select').selectOption('en');
    assert.equal(await blocked.locator('html').getAttribute('lang'), 'en');
    await blocked.locator('#language-select').selectOption('system');
    assert.equal(await blocked.locator('html').getAttribute('lang'), 'ko');
    await restricted.close();

    const fallback = await browser.newContext({ locale: 'ko-KR' });
    await fallback.route('**/js/localization.js', async route => {
      const response = await route.fetch();
      await route.fulfill({ response, body: `const data = document.querySelector('#translations'); const values = JSON.parse(data.textContent); delete values.ko.nav_home; data.textContent = JSON.stringify(values);\n${await response.text()}` });
    });
    const missing = await fallback.newPage();
    await missing.goto(base);
    assert.equal(await missing.locator('[data-i18n="nav_home"]').textContent(), 'Home');
    await fallback.close();

    const staticContext = await browser.newContext({ javaScriptEnabled: false, locale: 'ko-KR' });
    const staticPage = await staticContext.newPage();
    for (const path of ['/', '/faq.html', '/compatibility.html', '/404.html']) {
      await staticPage.goto(base + path);
      assert.equal(await staticPage.locator('html').getAttribute('lang'), 'en');
      assert.equal(await staticPage.locator('[data-i18n="nav_home"]').textContent(), 'Home');
      assert.equal(await staticPage.locator('#language-select').isVisible(), false);
    }
    await staticContext.close();
    console.log('Localization integration checks passed.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
