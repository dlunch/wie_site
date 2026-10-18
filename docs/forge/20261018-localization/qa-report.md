# Localization QA

## Status

**Verdict: PASS.** No Critical, High, Medium or Low defects identified. The coordinating agent reported a successful Jekyll 4.4.1 build and a passing full Chrome integration suite. Independent supplemental browser checks also passed. JavaScript syntax and whitespace validation passed in the coordinating run.

## Coverage and test quality

| Requirement | Evidence in `tests/localization.cjs` |
| --- | --- |
| Primary system language and English fallback | Real browser contexts for ko-KR, ko, en-US and fr-FR |
| Explicit preference, navigation and reload | Select changes, storage inspection, all four routes and reload |
| Return to System and system language changes | Storage removal, languagechange events and explicit-choice immunity |
| Invalid preference and restricted storage | Invalid stored value and throwing localStorage boundary |
| Missing Korean translation | Remove one Korean key before running the real script; assert English text |
| Page content and translation completeness | Representative rendered content and dictionary coverage across all pages |
| Metadata, image and icon-button text | Document language/title, OG locale/title, screenshot alt, footer accessible name |
| Localized alerts | Actual dialog assertions in English and Korean |
| Keyboard, responsive control and no JavaScript | Native keyboard selection, five viewport widths and English static pages |

Tests exercise the production script and generated DOM, with mocking limited to external storage/language boundaries and a missing-translation fixture. No implementation copies, vacuous assertions, swallowed test errors or excessive mocks were found. The sequential preference scenario deliberately verifies persistence between documents. Browser contexts isolate the remaining scenarios.

## Static consistency

All four pages supply title keys. Both dictionaries contain the existing Korean prose and corresponding English translations, including footer disclaimers, statuses and accessibility text. Table rows retain their game names and identifiers. Translation replaces text spans while retaining surrounding icons and anchors. Explicit HTML translations contain repository-owned prose only. JSON serialization escapes opening angle brackets. The language control retains native labeling/keyboard semantics and remains hidden when JavaScript is disabled.

## Runtime results and limits

The full integration suite printed `Localization integration checks passed.` against the Jekyll-generated site. The independent supplemental Chrome run verified all annotated text, metadata content, image alt text and accessible labels on all four routes in both languages; all passed. Icons and link destinations were unchanged by switching. The compatibility table retained 19 rows, 16 playable statuses and three partial statuses, with the expected first/last game IDs.

The first independent Chrome launch failed under sandbox restrictions before reaching the site; the authorized unsandboxed run passed. No production changes were needed. For reproduction, serve Jekyll output and run `NODE_PATH=<existing Playwright module directory> SITE_URL=<server URL> node tests/localization.cjs`.

Viewport overflow and native keyboard operation were checked automatically. Visual screenshots, real screen-reader behavior and Safari/Firefox rendering were not checked; no broader accessibility or cross-browser certification is claimed.
