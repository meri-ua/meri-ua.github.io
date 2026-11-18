/* 11-catalog.js — Екран «Каталог»: пошук, жанри, підбірки */

// ---------- Каталог ----------
function renderCatalog(v) {
  const q = UI.query.trim().toLowerCase();
  const filtered = SERIES.filter(s =>
    (UI.genre === "Усі" || s.genre === UI.genre) &&
    (!q || (s.title + s.desc + s.tags.join(" ") + s.genre).toLowerCase().includes(q)));
  const filtering = q || UI.genre !== "Усі";
  const popular = [...SERIES].sort((a, b) => b.views - a.views);

  v.innerHTML = `
    <div class="search-wrap">${ICONS.search}<input class="search" id="search" placeholder="Серіали, жанри, теми" value="${esc(UI.query)}" /></div>
    <div class="chips">${["Усі", ...GENRES].map(g =>
      `<button class="chip ${g === UI.genre ? "active" : ""}" data-genre="${g}">${g}</button>`).join("")}</div>
    ${filtering ? `
      ${filtered.length ? `<div class="grid" style="margin-top:12px">${filtered.map(itemHTML).join("")}</div>`
        : `<div class="empty"><div class="e">${ICONS.search}</div><b>Нічого не знайдено</b>Спробуйте інший запит або жанр.</div>`}`
    : `
      ${sectionHead("Вибір редакції")}
      <div class="row wide">${popular.slice(0, 5).map(wideHTML).join("")}</div>
      ${sectionHead("Популярне")}
      <div class="row">${popular.slice(5, 12).map(itemHTML).join("")}</div>
      ${sectionHead("Новинки")}
      <div class="row">${SERIES.filter(s => s.isNew).map(itemHTML).join("")}</div>
      ${sectionHead("Від незалежних авторів")}
      <div class="row">${SERIES.filter(s => s.creator.startsWith("Незалежний") || s.creator.startsWith("Студія")).map(itemHTML).join("")}</div>
      ${sectionHead("Meri AI Studio")}
      <div class="row">${SERIES.filter(s => s.creator === "Meri AI Studio").map(itemHTML).join("")}</div>`}
  `;
  $("#search").addEventListener("input", e => {
    UI.query = e.target.value; const pos = e.target.selectionStart;
    renderCatalog(v); const n = $("#search"); n.focus(); n.setSelectionRange(pos, pos);
  });
}

