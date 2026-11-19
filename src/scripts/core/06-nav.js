/* 06-nav.js — Навігація між вкладками і головний render() */

// ---------- Навігація ----------
// Дії кнопок з атрибутом data-act="назва" — їх реєструють екрани (17-me.js, 18-submit.js).
const ACTIONS = {};
function renderTabbar() {
  $("#tabbar").innerHTML = Object.keys(TAB_NAMES).map(t =>
    `<button data-tab="${t}" class="${t === UI.tab ? "active" : ""}">${ICONS[t]}<span>${TAB_NAMES[t]}</span></button>`).join("");
}
function go(tab) {
  UI.tab = tab; UI.detail = null; UI.creator = null; UI.page = null; UI.stack = [];
  renderTabbar(); render(); $("#view").scrollTop = 0;
}
// Запам'ятати поточний екран, щоб «назад» повернув саме сюди.
function pushScreen() {
  if (UI.detail || UI.creator || UI.page)
    UI.stack.push({ detail: UI.detail, creator: UI.creator, creatorTab: UI.creatorTab, page: UI.page });
}
function openDetail(id) { pushScreen(); UI.detail = id; UI.creator = null; UI.page = null; render(); $("#view").scrollTop = 0; }
function openCreator(id, tab = "series") {
  if (!creatorById(id)) return;
  pushScreen(); UI.creator = id; UI.detail = null; UI.page = null; UI.creatorTab = tab;
  if (!S.seenCreators.includes(id)) { S.seenCreators.push(id); save(); }
  render(); $("#view").scrollTop = 0;
}
// Підсторінка профілю (налаштування, редагування, подача серіалу).
function openPage(page) {
  if (UI.tab !== "profile") { UI.tab = "profile"; UI.stack = []; UI.detail = UI.creator = null; renderTabbar(); }
  if (page === "edit-me") UI.meForm = null;   // свіжа форма з поточного профілю
  pushScreen(); UI.page = page; UI.detail = UI.creator = null; render(); $("#view").scrollTop = 0;
}
function goBack() {
  const prev = UI.stack.pop() || { detail: null, creator: null, creatorTab: "series", page: null };
  Object.assign(UI, prev); render();
}

function render() {
  const v = $("#view"), app = $("#app");
  const feed = UI.tab === "foryou" && !UI.detail && !UI.creator;
  app.classList.toggle("feed", feed);
  // Свою шапку (а не великий заголовок) мають серіал, автор, ваш профіль і його підсторінки.
  app.classList.toggle("detail", !!(UI.detail || UI.creator || UI.page || UI.tab === "profile"));
  v.classList.toggle("feed-mode", feed);
  $("#pageTitle").innerHTML = feed ? `<span class="logo">Meri<span>.ua</span></span>` : TITLES[UI.tab];
  if (UI.page) return ({ settings: renderSettings, "edit-me": renderEditMe, submit: renderSubmit })[UI.page](v);
  if (UI.creator) return renderCreator(v, creatorById(UI.creator));
  if (UI.detail) return renderDetail(v, byId(UI.detail));
  ({ foryou: renderForYou, catalog: renderCatalog, my: renderMy, coins: renderCoins, profile: renderProfile })[UI.tab](v);
}

