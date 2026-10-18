# WIE — GitHub Pages

This repository is set up to publish the WIE site on GitHub Pages using Jekyll.

Translations live in `_data/translations.yml`. Pages render English by default;
`js/localization.js` applies the browser language or the saved header selection.
Add matching translation keys and `data-i18n` attributes when adding visible text.

To check localization, run `jekyll serve`, install Playwright with
`npm install --no-save --package-lock=false playwright`, then run
`node tests/localization.cjs`. Set `CHROME_PATH` to your Chrome executable and
`SITE_URL` if the site is not served at `http://127.0.0.1:4000`.
