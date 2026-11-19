/* 16-creator.js — Сторінка автора чи студії в стилі Instagram */

// ---------- Сторінка автора ----------
// Шапка: аватар у кільці + лічильники; ім'я, тип, місто, опис;
// кнопки «Стежити» / «Поділитися»; вкладки «Серіали» (сітка як Reels) і «Про автора».
function renderCreator(v, c) {
  if (!c) { UI.creator = null; return render(); }
  const st = creatorStats(c);
  const following = S.following.includes(c.id);
  const list = seriesOf(c).sort((a, b) => b.views - a.views);
  const tab = UI.creatorTab;

  const grid = `<div class="ig-grid">${list.map(s => `
      <button class="ig-cell" data-open="${s.id}" style="background:${grad(s)}" aria-label="${esc(s.title)}">
        <span class="em">${s.emoji}</span>
        ${s.isNew ? '<span class="badge">NEW</span>' : ""}
        <span class="v">${ICONS.play} ${fmtViews(s.views)}</span>
      </button>`).join("")}
      ${list.length % 3 ? `<div class="ig-cell soon">Скоро<br/>прем'єра</div>` : ""}
    </div>`;

  const about = `<div class="group" style="margin-top:12px">
      <div class="list-row">${rowIco("film", "#5e5ce6")}<div style="flex:1">Тип<div class="sub">${CREATOR_TYPES[c.type]}</div></div></div>
      <div class="list-row">${rowIco("pin", "#ff9f0a")}<div style="flex:1">Місто<div class="sub">${esc(c.city)}</div></div></div>
      <div class="list-row">${rowIco("clock", "#34c759")}<div style="flex:1">На Meri з<div class="sub">${c.since} року</div></div></div>
      <div class="list-row">${rowIco("coins", "#0a84ff")}<div style="flex:1">Модель<div class="sub">${c.type === "originals" || c.type === "ai"
        ? "Власне виробництво платформи" : "Отримує частку доходу від переглядів"}</div></div></div>
    </div>
    <p class="footnote">Хочете так само? Подайте свій серіал у Профілі → «Для творців».</p>`;

  v.innerHTML = `
    <div class="ig-bar">
      <button class="ig-back" data-back aria-label="Назад">${ICONS.back}</button>
      <b>@${esc(c.handle)}</b>${verifiedHTML(c)}
    </div>
    <div class="ig-head">
      ${avatarHTML(c, "lg", "live")}
      <div class="ig-stats">
        <div><b>${st.count}</b><span>${plural(st.count, "серіал", "серіали", "серіалів")}</span></div>
        <div><b>${fmtViews(st.views)}</b><span>переглядів</span></div>
        <div><b>${fmtCount(st.followers)}</b><span>підписників</span></div>
      </div>
    </div>
    <div class="ig-name">${esc(c.name)} ${verifiedHTML(c)}</div>
    <div class="ig-type">${CREATOR_TYPES[c.type]} · ${esc(c.city)}</div>
    <div class="ig-bio">${esc(c.bio)}</div>
    <div class="ig-btns">
      ${c.id === "me" ? `<button class="btn secondary" data-page="edit-me">Редагувати</button>`
        : `<button class="btn ${following ? "secondary" : ""}" data-follow="${c.id}">${following ? `${ICONS.check} Ви стежите` : "Стежити"}</button>`}
      <button class="btn secondary" data-share-creator="${c.id}">${ICONS.share} Поділитися</button>
    </div>
    <div class="ig-tabs" role="tablist">
      <button role="tab" class="${tab === "series" ? "on" : ""}" data-ctab="series">${ICONS.grid} Серіали</button>
      <button role="tab" class="${tab === "about" ? "on" : ""}" data-ctab="about">${ICONS.info} Про автора</button>
    </div>
    ${tab === "about" ? about : grid}
  `;
}

function toggleFollow(id) {
  const c = creatorById(id); if (!c) return;
  S.following = toggleIn(S.following, id); save();
  toast(S.following.includes(id) ? `Ви стежите за @${c.handle}` : `Ви більше не стежите за @${c.handle}`);
  render();
}

// Посилання на сторінку автора: https://…/?creator=teplahata
async function shareCreator(id) {
  const c = creatorById(id); if (!c) return;
  const url = `${location.origin}${location.pathname}?creator=${encodeURIComponent(id)}`;
  try {
    if (navigator.share) { await navigator.share({ title: c.name, text: `${c.name} на Meri`, url }); return; }
    await navigator.clipboard.writeText(url);
    toast("Посилання скопійовано");
  } catch (e) {
    if (e && e.name === "AbortError") return; // людина сама закрила меню «Поділитися»
    toast(url);
  }
}

// Рядок «Автори» в стилі сторіз (Каталог).
function creatorsStoriesHTML() {
  // Ви — першим (як «Ваша історія» в Instagram), далі ще не переглянуті, далі — за підписниками.
  const order = [...CREATORS].sort((a, b) => ((b.id === "me") - (a.id === "me")) ||
    (S.seenCreators.includes(a.id) - S.seenCreators.includes(b.id)) || (b.followers - a.followers));
  return `<div class="stories">${order.map(c => `
    <button class="story" data-creator="${c.id}">${avatarHTML(c, "md", true)}<span>${esc(c.name.replace(/^Студія «(.+)»$/, "$1"))}</span></button>`).join("")}</div>`;
}

// Рядок автора на сторінці серіалу: аватар, ім'я, підписники, «Стежити».
function creatorRowHTML(c) {
  const st = creatorStats(c), f = S.following.includes(c.id);
  return `<div class="group creator-row">
    <div class="list-row" data-creator="${c.id}" style="cursor:pointer">
      ${avatarHTML(c, "sm")}
      <div style="flex:1;min-width:0">${esc(c.name)} ${verifiedHTML(c)}<div class="sub">@${esc(c.handle)} · ${fmtCount(st.followers)} підписників</div></div>
      ${c.id === "me" ? `<span class="chip">Це ви</span>` : `<button class="btn small-btn ${f ? "secondary" : ""}" data-follow="${c.id}">${f ? "Ви стежите" : "Стежити"}</button>`}
    </div>
  </div>`;
}
