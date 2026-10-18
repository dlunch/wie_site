# Website localization architecture

## Design and classification

Frontend static site; apply `guidelines/frontend.md`. Keep Jekyll static generation, existing URLs and layout hierarchy (page → default layout → header/footer). Build English HTML and enhance it with one small browser script. No framework, locale routes, dependencies, translation service, or duplicated page trees are needed. The data is repository-owned; browser language and persisted preference are external inputs.

## Components and interfaces

- `_data/translations.yml`: flat keyed `en` and `ko` dictionaries covering existing page prose, shared chrome, accessibility text, alerts, titles, description and Open Graph locale. English is complete; missing Korean keys resolve to English. Use stable semantic names such as `home_title`, `nav_home`, `status_playable`.
- Existing pages and includes: retain their structure, icons, links, table rows and identifiers. Render default values from `site.data.translations.en` with Liquid. Annotate translated text spans with `data-i18n="key"`. Explicit `data-i18n-html="key"` may be used for repository-owned prose containing `<br>`, `<strong>` or `<u>`; never insert runtime input as HTML. Attribute translations use explicit `data-i18n-alt`, `data-i18n-aria-label`, and `data-i18n-content` keys. Icons remain outside replaced text nodes and are decorative.
- `_layouts/default.html`: set static `lang="en"`; expose dictionaries in an `application/json` script serialized by Liquid `jsonify` (escape `<` to prevent script termination). Render English title/description and Open Graph/Twitter metadata with matching translation annotations. Store a title key in page front matter, so the layout uses the same key for all title variants. Load `/js/localization.js` after page markup.
- `_includes/header.html`: accessible native select with a visible associated label and values `system`, `ko`, `en`. Display native language names `한국어` and `English`; translate the label and System option. Hide the selector until initialization succeeds so no-JavaScript users do not see an inert setting.
- `js/localization.js`: owns preference resolution, DOM translation and select/change handlers. Keep implementation private in a script scope; no reusable public API or compatibility wrapper. `localStorage` key `wie-language` stores only explicit `ko` or `en`; System removes it. Runtime variable retains the current selection when storage is unavailable.
- `css/style.css`: style the select with existing variables and let header/navigation wrap at existing responsive breakpoint. Do not alter unrelated site styling.

## Data flow and behavior

1. Jekyll renders readable English, metadata and the translation JSON on all four pages, including `/404.html`.
2. Script reads persisted preference with a small `try/catch`. Accept only `ko` or `en`; anything else means System.
3. Resolve System from the primary `navigator.language`: lowercase and use its base tag; `ko` and `ko-*` resolve to Korean, every other value resolves to English. Do not scan secondary preferred languages.
4. For each annotated node, select `translations[language][key] ?? translations.en[key]`; update text via `textContent`, static rich prose via `innerHTML`, or the explicitly annotated attribute. Update `document.documentElement.lang` and locale metadata in the same pass.
5. On select change, set in-memory preference, attempt storage write/removal, and apply immediately. Storage failures are nonfatal and must not undo the selection.
6. Listen to `languagechange` and reapply only while the preference is System. Explicit choices remain unchanged.
7. Replace hardcoded store-button alert strings with annotated alert keys and click listeners using the current resolved language. Preserve existing prevent-navigation behavior. Supply localized accessible names for both icon-only store buttons and footer email.

No content is fetched and no URL changes occur during a switch. English source HTML is indexed by crawlers; per-language indexing is outside this change. A brief English initial render before script execution is acceptable; do not hide the entire document.

## Scope and failure handling

Touch `_data/translations.yml`, `js/localization.js`, the default layout, header/footer, `index.md`, `faq.md`, `compatibility.md`, `404.html`, CSS, and `_config.yml` only as needed to make the site description default English and exclude verification/docs artifacts from published output. Preserve current content claims and original game proper names. Use translated spans in Markdown table headers/status cells rather than moving the table into a new data model. Runtime lookup falls back per key; completeness checks catch missing English keys. Blocked storage only prevents persistence; readable English remains available if JavaScript is disabled. No remote error reporting is added.

## Building block plan

Implement as one cohesive core block: **Site localization** (★), no block dependencies and no parallel production edits. Its interface is the markup annotations plus translation dictionary described above. Sequence: write focused verification for resolution/persistence/fallback; implement dictionary and browser behavior; annotate existing views/metadata; run integration verification and build. There is no justification for additional module boundaries or a state-management library.

## Verification

Use the available Node/Playwright and Chrome for a small integration test against generated pages; do not add dependencies to the site. Exercise Korean regional primary language, English and unsupported primary languages, saved overrides, invalid stored preference, choosing System/removing preference, missing Korean entry falling back to English, blocked storage, `languagechange`, and translated alert behavior. Verify visible text, document language, selected option, title and metadata as observable outcomes; do not export helpers just for tests.

Build Jekyll and inspect every generated page: all annotated keys exist in English and Korean, initial HTML is English, translation JSON parses, icons/links/game rows survive, and title/description/alt/aria-label/content updates are wired. Exercise navigating between pages and reload persistence in a browser if available. Check desktop and narrow mobile header layout with long English labels and keyboard selection/focus. No real screen-reader or broad cross-browser claim unless actually performed. Existing screenshots and game names are intentionally not translated.
