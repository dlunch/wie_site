# WIE — GitHub Pages / Jekyll Site

This repository is set up to publish the WIE site on GitHub Pages using Jekyll.

To build locally (with Jekyll installed):

```bash
gem install bundler jekyll
bundle install
bundle exec jekyll serve
```

Or preview the static files directly after a normal Jekyll build in `_site/`.

Content includes:

- shared header/footer in `_includes/`
- layout in `_layouts/default.html`
- pages: `index.md`, `compatibility.md`, `screenshots.md`, `about.md`
- static assets in `/css`, `/js`, `/locales`
