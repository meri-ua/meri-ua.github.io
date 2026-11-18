/* 99-start.js — Старт: усе готово — малюємо перший екран */

// ---------- Старт ----------
if (EMBED) { document.documentElement.style.setProperty("--st", "54px"); document.documentElement.style.setProperty("--sb", "22px"); }
$("#coinIco").innerHTML = COIN;
applyVariant();
resetAdsIfNewDay();
updateCoins();
renderTabbar();
if (params.get("open")) UI.detail = params.get("open");
render();

