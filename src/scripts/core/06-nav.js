/* 06-nav.js — Навігація між вкладками і головний render() */

// ---------- Навігація ----------
function renderTabbar() {
  $("#tabbar").innerHTML = Object.keys(TAB_NAMES).map(t =>
    `<button data-tab="${t}" class="${t === UI.tab ? "active" : ""}">${ICONS[t]}<span>${TAB_NAMES[t]}</span></button>`).join("");
}
function go(tab) {
  UI.tab = tab; UI.detail = null;
  renderTabbar(); render(); $("#view").scrollTop = 0;
}
function openDetail(id) { UI.detail = id; render(); $("#view").scrollTop = 0; }

function render() {
  const v = $("#view"), app = $("#app");
  const feed = UI.tab === "foryou" && !UI.detail;
  app.classList.toggle("feed", feed);
  app.classList.toggle("detail", !!UI.detail);
  v.classList.toggle("feed-mode", feed);
  $("#pageTitle").innerHTML = feed ? `<span class="logo">Meri<span>.ua</span></span>` : TITLES[UI.tab];
  if (UI.detail) return renderDetail(v, byId(UI.detail));
  ({ foryou: renderForYou, catalog: renderCatalog, my: renderMy, coins: renderCoins, profile: renderProfile })[UI.tab](v);
}

