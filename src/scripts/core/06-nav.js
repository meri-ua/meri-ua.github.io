/* 06-nav.js — Навігація між вкладками і головний render() */

// ---------- Навігація ----------
function renderTabbar() {
  $("#tabbar").innerHTML = Object.keys(TAB_NAMES).map(t =>
    `<button data-tab="${t}" class="${t === UI.tab ? "active" : ""}">${ICONS[t]}<span>${TAB_NAMES[t]}</span></button>`).join("");
}
function go(tab) {
  UI.tab = tab; UI.detail = null; UI.creator = null; UI.stack = [];
  renderTabbar(); render(); $("#view").scrollTop = 0;
}
// Запам'ятати поточний екран, щоб «назад» повернув саме сюди.
function pushScreen() { if (UI.detail || UI.creator) UI.stack.push({ detail: UI.detail, creator: UI.creator, creatorTab: UI.creatorTab }); }
function openDetail(id) { pushScreen(); UI.detail = id; UI.creator = null; render(); $("#view").scrollTop = 0; }
function openCreator(id, tab = "series") {
  if (!creatorById(id)) return;
  pushScreen(); UI.creator = id; UI.detail = null; UI.creatorTab = tab;
  if (!S.seenCreators.includes(id)) { S.seenCreators.push(id); save(); }
  render(); $("#view").scrollTop = 0;
}
function goBack() {
  const prev = UI.stack.pop() || { detail: null, creator: null, creatorTab: "series" };
  Object.assign(UI, prev); render();
}

function render() {
  const v = $("#view"), app = $("#app");
  const feed = UI.tab === "foryou" && !UI.detail && !UI.creator;
  app.classList.toggle("feed", feed);
  app.classList.toggle("detail", !!(UI.detail || UI.creator));
  v.classList.toggle("feed-mode", feed);
  $("#pageTitle").innerHTML = feed ? `<span class="logo">Meri<span>.ua</span></span>` : TITLES[UI.tab];
  if (UI.creator) return renderCreator(v, creatorById(UI.creator));
  if (UI.detail) return renderDetail(v, byId(UI.detail));
  ({ foryou: renderForYou, catalog: renderCatalog, my: renderMy, coins: renderCoins, profile: renderProfile })[UI.tab](v);
}

