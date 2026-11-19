/* 99-start.js — Старт: усе готово — малюємо перший екран */

// ---------- Старт ----------
if (EMBED) { document.documentElement.style.setProperty("--st", "54px"); document.documentElement.style.setProperty("--sb", "22px"); }
$("#coinIco").innerHTML = COIN;
applyVariant();
syncMine();          // ваші опубліковані серіали — у каталог
checkModeration();   // заявки, чия «модерація» минула, поки застосунок був закритий
resetAdsIfNewDay();
updateCoins();
renderTabbar();
if (params.get("open")) UI.detail = params.get("open");
if (params.get("creator") && creatorById(params.get("creator"))) { UI.creator = params.get("creator"); if (!S.seenCreators.includes(UI.creator)) { S.seenCreators.push(UI.creator); save(); } }
render();

