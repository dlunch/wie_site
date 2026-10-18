# Website localization

Add English alongside existing Korean on the Jekyll site. Default to the browser's primary system language, matching Korean regional variants; use English for all other languages. Add an accessible header selector with System / 한국어 / English, remember explicit choices across pages and visits, and allow returning to System. Localize all four pages, shared chrome, alerts, accessible labels, titles and descriptions. Preserve existing URLs, content, game identifiers and layout. Game names may retain their original Korean names as proper nouns. Storage restrictions must not prevent switching within the current page. English is the fallback for missing translations and without JavaScript.

Use existing Jekyll and browser primitives without runtime dependencies. Verify language resolution, persistence, switching back to system, translation completeness, metadata and page integration. Keep the implementation cohesive and small.
