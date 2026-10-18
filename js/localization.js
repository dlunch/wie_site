(() => {
  const translations = JSON.parse(document.getElementById('translations').textContent);
  const select = document.getElementById('language-select');
  let preference = 'system';
  try {
    const saved = localStorage.getItem('wie-language');
    if (saved === 'ko' || saved === 'en') preference = saved;
  } catch {
    // Browser storage restrictions must not prevent language selection.
  }
  let language;
  const translate = key => translations[language][key] ?? translations.en[key];

  function applyLanguage() {
    language = preference === 'system'
      ? (navigator.language.toLowerCase().split('-')[0] === 'ko' ? 'ko' : 'en')
      : preference;
    document.documentElement.lang = language;
    select.value = preference;
    for (const node of document.querySelectorAll('[data-i18n]')) {
      node.textContent = translate(node.dataset.i18n);
    }
    for (const node of document.querySelectorAll('[data-i18n-html]')) {
      node.innerHTML = translate(node.dataset.i18nHtml);
    }
    for (const attribute of ['alt', 'aria-label', 'content']) {
      for (const node of document.querySelectorAll(`[data-i18n-${attribute}]`)) {
        node.setAttribute(attribute, translate(node.getAttribute(`data-i18n-${attribute}`)));
      }
    }
  }

  select.addEventListener('change', () => {
    preference = select.value;
    try {
      if (preference === 'system') localStorage.removeItem('wie-language');
      else localStorage.setItem('wie-language', preference);
    } catch {
      // Keep the current page selection even when it cannot be saved.
    }
    applyLanguage();
  });
  window.addEventListener('languagechange', () => {
    if (preference === 'system') applyLanguage();
  });
  for (const button of document.querySelectorAll('[data-i18n-alert]')) {
    button.addEventListener('click', event => {
      event.preventDefault();
      alert(translate(button.dataset.i18nAlert));
    });
  }
  applyLanguage();
  select.parentElement.hidden = false;
})();
