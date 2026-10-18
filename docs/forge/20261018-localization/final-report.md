# Website localization result

Implemented Korean and English localization on the home, FAQ, compatibility and 404 pages. The browser's primary language selects Korean for ko variants and English otherwise. The header offers System, 한국어 and English; explicit preferences persist across pages and visits, and System clears the override. Restricted storage does not block switching on the current page.

English is the static and missing-translation fallback. Page text, shared chrome, metadata, alerts and accessible labels use one translation dictionary. Original game names, identifiers and compatibility statuses are preserved. No runtime dependency or URL change was introduced.

Validation: Jekyll 4.4.1 build, Chrome integration suite, JavaScript syntax checks and diff whitespace checks passed. Integration coverage includes all four routes, persistence, system changes, unsupported languages, storage denial, missing translations, no-JavaScript rendering, keyboard selection and five widths from 320 to 1440 pixels.

Safari, Firefox and actual screen-reader verification were not performed. See `qa-report.md` for the final QA evidence. Architecture and implementation reviews found no actionable defects.
