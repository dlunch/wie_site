# AGENTS.md

## Build & Preview
```bash
jekyll serve   # Local dev server at http://localhost:4000
jekyll build   # Build to _site/
```
No tests or linting configured.

## Stack
- **Jekyll** static site generator with Kramdown markdown
- **Pretendard** font (Korean), **Font Awesome 6** icons
- Plain CSS (no preprocessor), CSS variables in `:root`

## Code Style
- **HTML**: 2-space indent, attributes on new lines for readability
- **CSS**: kebab-case classes (`.btn-github`), use CSS variables (`var(--accent)`)
- **Markdown**: Front matter required (`layout`, `title`), embed HTML for complex layouts
- **Links**: External links need `target="_blank" rel="noopener noreferrer"`
- **Icons**: Use `aria-hidden="true"` on decorative icons, `aria-label` on icon-only buttons
- **Email obfuscation**: Use JS string concatenation to prevent scraping

## Structure
- `_layouts/default.html` - Base template with meta tags, analytics
- `_includes/header.html`, `footer.html` - Site chrome
- `css/style.css` - All styles, mobile breakpoint at 768px
- Content pages: `index.md`, `faq.md`, `compatibility.md`
