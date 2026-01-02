const LOCALES = ["en", "ko"];
async function loadLocale(lang) {
  if (!LOCALES.includes(lang)) lang = "en";
  try {
    const res = await fetch(`/locales/${lang}.json`);
    const dict = await res.json();
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (key in dict) el.textContent = dict[key];
    });
    document.documentElement.lang = lang;
  } catch (e) {
    console.error("i18n load failed", e);
  }
}
function initI18n() {
  const sel = document.getElementById("lang-select");
  if (!sel) return;
  const saved =
    localStorage.getItem("site_lang") ||
    navigator.language.split("-")[0] ||
    "en";
  sel.value = LOCALES.includes(saved) ? saved : "en";
  loadLocale(sel.value);
  sel.addEventListener("change", (e) => {
    const v = e.target.value;
    localStorage.setItem("site_lang", v);
    loadLocale(v);
  });
}
document.addEventListener("DOMContentLoaded", initI18n);
