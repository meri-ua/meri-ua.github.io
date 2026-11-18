/* Meri.ua — MVP прототип платформи українських вертикальних серіалів.
   Без бекенду: стан зберігається в localStorage. Відео симулюється анімованими сценами. */

// ---------- Налаштування економіки ----------
const CFG = {
  START_COINS: 30,
  FREE_EPS: 5,          // перші серії безкоштовно
  EP_COST: 10,          // ціна відкриття серії в монетах
  AD_REWARD: 5,         // монет за одну рекламу
  AD_LIMIT: 30,         // реклам на день
  AD_COOLDOWN: 20,      // секунд між рекламами
  AD_SECONDS: 5,        // тривалість демо-реклами
  CHECKIN_REWARD: 10,   // щоденний бонус
  EP_SECONDS: 12,       // тривалість демо-серії
  SUB_PRICE: 149        // грн/міс за Meri+
};

// ---------- Варіанти дизайну ----------
const VARIANTS = [
  { id: "ios", name: "iOS Classic", hint: "Системні кольори, згруповані списки, синій акцент" },
  { id: "music", name: "Cinema", hint: "Темний кінорежим, великі обкладинки, рожевий акцент" },
  { id: "glass", name: "Liquid Glass", hint: "Скляні панелі, плаваючий таб-бар, м'які градієнти" }
];

// ---------- Іконки (у стилі SF Symbols) ----------
const svg = (d, cls = "i") => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
const ICONS = {
  foryou: svg('<rect x="4" y="2.5" width="16" height="19" rx="4"/><path d="M10 9l5 3-5 3z" fill="currentColor"/>'),
  catalog: svg('<rect class="fillable" x="3.5" y="3.5" width="7" height="7" rx="2"/><rect class="fillable" x="13.5" y="3.5" width="7" height="7" rx="2"/><rect class="fillable" x="3.5" y="13.5" width="7" height="7" rx="2"/><rect class="fillable" x="13.5" y="13.5" width="7" height="7" rx="2"/>'),
  my: svg('<path class="fillable" d="M6 3.5h12a1 1 0 011 1v16l-7-4.2-7 4.2v-16a1 1 0 011-1z"/>'),
  coins: svg('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5v9M9.5 10a2.5 2 0 015 0c0 2.6-5 1.4-5 4a2.5 2 0 005 0" />'),
  profile: svg('<circle class="fillable" cx="12" cy="8" r="4"/><path class="fillable" d="M4 20.5c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5z"/>'),
  heart: svg('<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0112 7a4.3 4.3 0 017.5 2.8C19.5 15.4 12 20 12 20z"/>'),
  bookmark: svg('<path d="M6.5 3.5h11a1 1 0 011 1v16l-6.5-4-6.5 4v-16a1 1 0 011-1z"/>'),
  list: svg('<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1" fill="currentColor"/><circle cx="4.5" cy="12" r="1" fill="currentColor"/><circle cx="4.5" cy="18" r="1" fill="currentColor"/>'),
  next: svg('<path d="M5 5.5l9 6.5-9 6.5z" fill="currentColor"/><path d="M18.5 5v14"/>'),
  close: svg('<path d="M6 6l12 12M18 6L6 18"/>'),
  back: svg('<path d="M15 5l-7 7 7 7"/>'),
  chev: svg('<path d="M9 5l7 7-7 7"/>'),
  play: svg('<path d="M7 4.5l13 7.5-13 7.5z"/>'),
  lock: svg('<rect x="5" y="10.5" width="14" height="10" rx="2.5" fill="currentColor" stroke="none"/><path d="M8 10.5V7.5a4 4 0 018 0v3"/>'),
  search: svg('<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L20 20"/>'),
  tv: svg('<rect x="3" y="5" width="18" height="12" rx="2.5"/><path d="M8 20.5h8"/>'),
  sparkle: svg('<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>'),
  gift: svg('<rect x="3.5" y="8.5" width="17" height="4" rx="1"/><path d="M5 12.5v8h14v-8M12 8.5v12M12 8.5S10.5 4 8 4.5 7 8.5 12 8.5zM12 8.5s1.5-4.5 4-4 1 4-4 4z"/>'),
  film: svg('<rect x="3.5" y="4" width="17" height="16" rx="2.5"/><path d="M7.5 4v16M16.5 4v16M3.5 9h4M3.5 15h4M16.5 9h4M16.5 15h4"/>'),
  palette: svg('<path d="M12 3.5a8.5 8.5 0 100 17c1.2 0 1.6-1 1-1.9-.7-1 0-2.1 1.2-2.1H17a3.5 3.5 0 003.5-3.5c0-5.3-3.8-9.5-8.5-9.5z"/><circle cx="7.5" cy="11" r="1.2" fill="currentColor"/><circle cx="10.5" cy="7.5" r="1.2" fill="currentColor"/><circle cx="15" cy="7.8" r="1.2" fill="currentColor"/>'),
  clock: svg('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'),
  captions: svg('<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M10.5 10.2a2 2 0 100 3.6M16.5 10.2a2 2 0 100 3.6"/>'),
  hand: svg('<path d="M12 21a7 7 0 01-7-7V9.5a1.5 1.5 0 013 0V12M8 12V5.5a1.5 1.5 0 013 0V11M11 11V4.5a1.5 1.5 0 013 0V11M14 11V6.5a1.5 1.5 0 013 0V14a7 7 0 01-5 7"/>'),
  vote: svg('<path d="M4 20.5h16M6 16.5V10M12 16.5V5M18 16.5v-4"/>')
};
const COIN = `<svg class="coin" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="var(--coin)"/><circle cx="12" cy="12" r="7" fill="none" stroke="rgba(0,0,0,.18)" stroke-width="1.5"/><path d="M12 7.5v9M9.8 10.2c0-1.1 1-1.7 2.2-1.7s2.2.6 2.2 1.6c0 2.4-4.4 1.2-4.4 3.8 0 1 1 1.6 2.2 1.6s2.2-.6 2.2-1.7" fill="none" stroke="rgba(0,0,0,.45)" stroke-width="1.6" stroke-linecap="round"/></svg>`;

// ---------- Стан ----------
const STORE_KEY = "meri.state.v1";
const today = () => new Date().toISOString().slice(0, 10);
const DEFAULT_STATE = () => ({
  coins: CFG.START_COINS,
  ads: { date: today(), count: 0, last: 0 },
  checkin: "",
  unlocked: {},       // {seriesId: [ep,...]}
  progress: {},       // {seriesId: {ep, watched:[...], ts}}
  saved: [], liked: [],
  history: [],        // [{id, ep, ts}]
  votes: {},          // {seriesId: optionIndex}
  sub: false,
  settings: { autoplay: true, subs: true, adsPersonal: false },
  design: "glass"
});
let S;
try { S = Object.assign(DEFAULT_STATE(), JSON.parse(localStorage.getItem(STORE_KEY) || "{}")); }
catch { S = DEFAULT_STATE(); }

// ?v=glass у URL перекриває збережений варіант (для сторінки порівняння); ?embed — без запису стану
const params = new URLSearchParams(location.search);
const EMBED = params.has("embed");
const URL_VARIANT = params.get("v");
const save = () => { if (!EMBED) try { localStorage.setItem(STORE_KEY, JSON.stringify(S)); } catch {} updateCoins(); };

let UI = { tab: params.get("tab") || "foryou", genre: "Усі", query: "", detail: null };
const TITLES = { foryou: "", catalog: "Каталог", my: "Мої серіали", coins: "Монети", profile: "Профіль" };
const TAB_NAMES = { foryou: "Для тебе", catalog: "Каталог", my: "Медіатека", coins: "Монети", profile: "Профіль" };

function applyVariant() {
  document.getElementById("app").dataset.variant = URL_VARIANT || S.design || "glass";
}

// ---------- Утиліти ----------
const $ = (sel, root = document) => root.querySelector(sel);
const byId = id => SERIES.find(s => s.id === id);
const esc = str => String(str).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const grad = s => `linear-gradient(160deg, ${s.colors[0]}, ${s.colors[1]})`;
const fmtViews = n => n >= 1e6 ? (n / 1e6).toFixed(1).replace(".0", "") + " млн" : Math.round(n / 1e3) + " тис";
const hash = str => [...str].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

function toast(msg) {
  const t = $("#toast"); t.textContent = msg; t.classList.add("show");
  clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("show"), 2200);
}
function updateCoins() { $("#coinBalance").textContent = S.sub ? "∞" : S.coins; }

function resetAdsIfNewDay() {
  if (S.ads.date !== today()) { S.ads = { date: today(), count: 0, last: 0 }; save(); }
}

const isUnlocked = (s, ep) => ep <= CFG.FREE_EPS || S.sub || (S.unlocked[s.id] || []).includes(ep);
const watchedOf = id => (S.progress[id] && S.progress[id].watched) || [];
const toggleIn = (arr, v) => arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v];

function posterHTML(s, opts = {}) {
  return `<div class="poster" style="background:${grad(s)}">
    <div class="p-top">${s.isNew ? '<span class="badge">NEW</span>' : ""}</div>
    <span>${s.emoji}</span>
    ${opts.title ? `<div class="p-title">${esc(s.title)}</div>` : ""}
  </div>`;
}
const itemHTML = s => `<div class="item" data-open="${s.id}">${posterHTML(s)}
  <div class="name">${esc(s.title)}</div><div class="meta">${s.genre} · ${s.episodes} серій</div></div>`;
const wideHTML = s => `<div class="item" data-open="${s.id}">${posterHTML(s, { title: true })}
  <div class="meta" style="margin-top:6px">${esc(s.creator)}</div></div>`;
const sectionHead = (title, link) => `<div class="section-head"><h2>${title}</h2>${link ? `<a data-genre="${link}">Усі</a>` : ""}</div>`;
const rowIco = (icon, color) => `<span class="row-ico" style="background:${color}">${ICONS[icon]}</span>`;

// ---------- Рекомендації ----------
function recommend() {
  const genreW = {}, watchedIds = new Set(S.history.map(h => h.id));
  S.history.forEach(h => { const s = byId(h.id); if (s) genreW[s.genre] = (genreW[s.genre] || 0) + 1; });
  [...S.saved, ...S.liked].forEach(id => { const s = byId(id); if (s) genreW[s.genre] = (genreW[s.genre] || 0) + 2; });
  const lastSeenByGenre = {};
  [...S.history].reverse().forEach(h => { const s = byId(h.id); if (s && !lastSeenByGenre[s.genre]) lastSeenByGenre[s.genre] = s; });

  return SERIES.map(s => {
    const g = genreW[s.genre] || 0;
    const p = S.progress[s.id];
    const finished = p && p.watched.length >= s.episodes;
    let score = g * 3 + s.rating * 2 + Math.log10(s.views) + (s.isNew ? 1.5 : 0) - (finished ? 20 : 0);
    if (watchedIds.has(s.id) && !finished) score += 4; // продовжити
    let why;
    if (p && !finished) why = `Продовжити з ${p.ep}-ї серії`;
    else if (g && lastSeenByGenre[s.genre] && lastSeenByGenre[s.genre].id !== s.id) why = `Бо вам сподобався «${lastSeenByGenre[s.genre].title}»`;
    else if (s.isNew) why = "Новинка тижня";
    else if (s.views > 2e6) why = "Популярне в Україні";
    else why = `${s.genre} · ★ ${s.rating}`;
    return { s, score, why };
  }).sort((a, b) => b.score - a.score);
}

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

// ---------- Для тебе ----------
function renderForYou(v) {
  v.innerHTML = `<div class="feed">${recommend().map(({ s, why }) => {
    const p = S.progress[s.id];
    return `<div class="slide" style="background:${grad(s)}">
      <div class="bg-emoji">${s.emoji}</div>
      <div class="side">
        <button class="side-btn ${S.liked.includes(s.id) ? "on" : ""}" data-like="${s.id}"><b>${ICONS.heart}</b>${fmtViews(s.views)}</button>
        <button class="side-btn save ${S.saved.includes(s.id) ? "on" : ""}" data-save="${s.id}"><b>${ICONS.bookmark}</b>Зберегти</button>
        <button class="side-btn" data-open="${s.id}"><b>${ICONS.list}</b>Серії</button>
      </div>
      <div class="why">${esc(why)}</div>
      <h1>${esc(s.title)}</h1>
      <div class="desc">${esc(s.desc)}</div>
      <div style="display:flex;gap:6px;margin-bottom:16px"><span class="chip">${s.genre}</span><span class="chip">★ ${s.rating}</span><span class="chip">UA озвучка</span></div>
      <div class="actions">
        <button class="btn white" data-play="${s.id}" data-ep="${p ? p.ep : 1}">${ICONS.play.replace('class="i"', 'class="i" style="fill:currentColor;stroke:none;width:18px;height:18px"')} ${p ? `Серія ${p.ep}` : "Дивитись"}</button>
      </div>
    </div>`;
  }).join("")}</div>`;
}

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

// ---------- Мої серіали ----------
function renderMy(v) {
  const cont = Object.entries(S.progress)
    .map(([id, p]) => ({ s: byId(id), p })).filter(x => x.s)
    .sort((a, b) => b.p.ts - a.p.ts);
  const saved = S.saved.map(byId).filter(Boolean);
  v.innerHTML = `
    <h2 style="margin-top:8px">Продовжити перегляд</h2>
    ${cont.length ? `<div class="group">${cont.map(({ s, p }) => `
      <div class="cont" data-play="${s.id}" data-ep="${p.ep}">
        ${posterHTML(s)}
        <div class="info">
          <div class="title">${esc(s.title)}</div>
          <div class="muted small">Серія ${p.ep} з ${s.episodes}</div>
          <div class="bar"><div style="width:${Math.round(p.watched.length / s.episodes * 100)}%"></div></div>
        </div>
        <span class="play-circle">${ICONS.play}</span>
      </div>`).join("")}</div>`
    : `<div class="empty"><div class="e">${ICONS.tv}</div><b>Тут поки порожньо</b>Почніть дивитися серіал — і він з'явиться тут.<br/><br/><button class="btn small-btn" data-go="foryou">Знайти серіал</button></div>`}
    <h2>Збережене</h2>
    ${saved.length ? `<div class="grid">${saved.map(itemHTML).join("")}</div>`
      : `<div class="empty"><div class="e">${ICONS.bookmark}</div>Натисніть «Зберегти» на серіалі, щоб додати його сюди.</div>`}
    ${Object.keys(S.votes).length ? `<h2>Ваші голоси</h2><div class="group">
      ${Object.entries(S.votes).map(([id, i]) => { const s = byId(id); return s ? `<div class="list-row" data-open="${id}">
        <div>${esc(s.vote.options[i])}<div class="sub">${esc(s.title)}</div></div><span class="chev">›</span></div>` : ""; }).join("")}</div>` : ""}
  `;
}

// ---------- Монети ----------
function adStatus() {
  resetAdsIfNewDay();
  const left = CFG.AD_LIMIT - S.ads.count;
  const wait = Math.max(0, Math.ceil((S.ads.last + CFG.AD_COOLDOWN * 1000 - Date.now()) / 1000));
  return { left, wait, can: left > 0 && wait === 0 };
}
function renderCoins(v) {
  const a = adStatus();
  const checked = S.checkin === today();
  v.innerHTML = `
    <div class="balance" style="margin-top:8px">
      <div class="small">Баланс</div>
      <div class="num">${COIN}${S.sub ? "∞" : S.coins}</div>
      <div class="small">${S.sub ? "Meri+ активна — усі серії відкриті" : `1 серія = ${CFG.EP_COST} монет · перші ${CFG.FREE_EPS} серій безкоштовно`}</div>
    </div>

    <h3>Заробити безкоштовно</h3>
    <div class="group">
      <div class="list-row">
        ${rowIco("tv", "#0a84ff")}
        <div style="flex:1">Переглянути рекламу<div class="sub">+${CFG.AD_REWARD} монет · ${S.ads.count} з ${CFG.AD_LIMIT} сьогодні</div>
          <div class="bar"><div style="width:${S.ads.count / CFG.AD_LIMIT * 100}%"></div></div></div>
        <button class="btn small-btn" id="adBtn" ${a.can ? "" : "disabled"}>${a.left <= 0 ? "Ліміт" : a.wait ? `${a.wait} с` : "Дивитись"}</button>
      </div>
      <div class="list-row">
        ${rowIco("gift", "#ff9f0a")}
        <div style="flex:1">Щоденний бонус<div class="sub">+${CFG.CHECKIN_REWARD} монет щодня</div></div>
        <button class="btn small-btn ${checked ? "secondary" : ""}" id="checkinBtn" ${checked ? "disabled" : ""}>${checked ? "Отримано" : "Забрати"}</button>
      </div>
    </div>
    <p class="footnote">До ${CFG.AD_LIMIT} реклам на день з паузою ${CFG.AD_COOLDOWN} с. Лише український бізнес — без азартних ігор.</p>

    <h3>Купити монети</h3>
    <div class="packs">${COIN_PACKS.map((p, i) => `
      <div class="card pack" data-pack="${i}">
        <div class="c">${COIN}${p.coins}</div>
        <div class="bonus">${p.bonus ? `+${p.bonus} бонус` : ""}</div>
        <div class="price">${p.price} грн</div>
      </div>`).join("")}</div>
    <p class="footnote">Відкриті серії залишаються вашими назавжди.</p>
  `;
  $("#adBtn").onclick = () => watchAd(() => renderCoins(v));
  $("#checkinBtn").onclick = () => { S.checkin = today(); S.coins += CFG.CHECKIN_REWARD; save(); toast(`+${CFG.CHECKIN_REWARD} монет`); renderCoins(v); };
  if (!a.can && a.left > 0) { clearTimeout(renderCoins._t); renderCoins._t = setTimeout(() => UI.tab === "coins" && !UI.detail && renderCoins(v), 1000); }
}

function watchAd(onDone) {
  const a = adStatus();
  if (a.left <= 0) return toast("Денний ліміт реклами вичерпано");
  if (a.wait) return toast(`Наступна реклама через ${a.wait} с`);
  const ad = ADS[(S.ads.count + hash(today())) % ADS.length];
  let t = CFG.AD_SECONDS;
  const m = $("#modal");
  m.innerHTML = `<div class="sheet">
    <div class="ad-frame" style="background:linear-gradient(160deg, ${ad.color}, #111)">
      <span class="tag">Реклама</span><span class="timer" id="adT">${t}</span>
      <div class="e">${ad.emoji}</div><div class="brand">${esc(ad.brand)}</div>
      <div style="margin-top:8px;opacity:.85">${esc(ad.text)}</div>
    </div>
    <button class="btn block" id="adDone" style="margin-top:14px" disabled>Зачекайте ${t} с</button>
  </div>`;
  m.classList.remove("hidden");
  const iv = setInterval(() => {
    t--; $("#adT").textContent = Math.max(t, 0);
    const b = $("#adDone");
    if (t > 0) { b.textContent = `Зачекайте ${t} с`; return; }
    clearInterval(iv);
    b.disabled = false; b.innerHTML = `Забрати +${CFG.AD_REWARD} монет`;
    b.onclick = () => {
      S.ads.count++; S.ads.last = Date.now(); S.coins += CFG.AD_REWARD; save();
      closeModal(); toast(`+${CFG.AD_REWARD} монет · ${S.ads.count}/${CFG.AD_LIMIT} сьогодні`);
      onDone && onDone();
    };
  }, 1000);
}
function closeModal() { const m = $("#modal"); m.classList.add("hidden"); m.innerHTML = ""; }

function buyPack(i) {
  const p = COIN_PACKS[i];
  const m = $("#modal");
  m.innerHTML = `<div class="sheet" style="text-align:center">
    <div style="font-size:56px;margin:8px 0">${COIN}</div>
    <h2 style="margin:0">${p.coins + p.bonus} монет</h2>
    <p class="muted">${p.price} грн · Демо-режим: оплату (Apple Pay / Google Pay / картка) ще не підключено.</p>
    <button class="btn block" id="buyOk">Нарахувати для тесту</button>
    <button class="btn plain block" style="margin-top:4px" data-close>Скасувати</button>
  </div>`;
  m.classList.remove("hidden");
  $("#buyOk").onclick = () => { S.coins += p.coins + p.bonus; save(); closeModal(); toast(`+${p.coins + p.bonus} монет`); render(); };
}

// ---------- Профіль ----------
function renderProfile(v) {
  const hist = [...S.history].reverse().slice(0, 8);
  const cur = URL_VARIANT || S.design;
  const sw = (key, label, icon, color) => `<div class="list-row">${rowIco(icon, color)}<div style="flex:1">${label}</div>
    <button class="switch ${S.settings[key] ? "on" : ""}" data-setting="${key}" aria-label="${label}"></button></div>`;
  v.innerHTML = `
    <div class="group" style="margin-top:8px">
      <div class="list-row" style="padding:14px 16px">
        <div class="avatar">Г</div>
        <div style="flex:1"><b style="font-size:20px">Гість</b><div class="sub">Увійдіть, щоб синхронізувати перегляд</div></div>
        <span class="chev">›</span>
      </div>
    </div>

    <div class="sub-card" style="margin-top:16px">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <b style="font-size:22px">Meri+</b><span class="small" style="opacity:.75">${CFG.SUB_PRICE} грн/міс</span>
      </div>
      <ul class="rules"><li>Усі серії відкриті</li><li>Без реклами</li><li>Ранній доступ до прем'єр</li><li>Подвійна вага голосу</li></ul>
      <button class="btn block ${S.sub ? "glass" : "white"}" id="subBtn">${S.sub ? "Скасувати підписку (демо)" : "Спробувати Meri+"}</button>
    </div>

    <h3>Оформлення</h3>
    <div class="group">${VARIANTS.map(x => `
      <div class="list-row" data-variant="${x.id}" style="cursor:pointer">
        ${rowIco("palette", x.id === "ios" ? "#0a84ff" : x.id === "music" ? "#fa2d48" : "#5e5ce6")}
        <div style="flex:1">${x.name}<div class="sub">${x.hint}</div></div>
        ${x.id === cur ? `<span style="color:var(--tint);font-weight:700">✓</span>` : ""}
      </div>`).join("")}
    </div>

    <h3>Відтворення</h3>
    <div class="group">
      ${sw("autoplay", "Автовідтворення", "play", "#34c759")}
      ${sw("subs", "Субтитри", "captions", "#8e8e93")}
      ${sw("adsPersonal", "Персоналізована реклама", "hand", "#ff9f0a")}
    </div>

    <h3>Історія</h3>
    ${hist.length ? `<div class="group">${hist.map(h => { const s = byId(h.id); return s ? `
      <div class="list-row" data-play="${s.id}" data-ep="${h.ep}"><div style="flex:1">${esc(s.title)}<div class="sub">Серія ${h.ep} · ${new Date(h.ts).toLocaleString("uk-UA", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</div></div><span class="chev">›</span></div>` : ""; }).join("")}</div>`
      : `<div class="group"><div class="list-row muted">Історія порожня</div></div>`}

    <h3>Для творців</h3>
    <div class="group">
      <div class="list-row" id="creatorBtn" style="cursor:pointer">${rowIco("film", "#af52de")}
        <div style="flex:1">Подати свій серіал<div class="sub">Частка доходу для незалежних авторів</div></div><span class="chev">›</span></div>
    </div>

    <div class="group" style="margin-top:28px">
      <button class="list-row" id="resetBtn" style="width:100%;justify-content:center;color:var(--red)">Скинути демо-дані</button>
    </div>
    <p class="footnote" style="text-align:center">Meri.ua · MVP прототип</p>
  `;
  $("#subBtn").onclick = () => { S.sub = !S.sub; save(); toast(S.sub ? "Meri+ активовано (демо)" : "Підписку скасовано"); renderProfile(v); };
  $("#creatorBtn").onclick = () => toast("Повідомимо, коли кабінет творця відкриється");
  $("#resetBtn").onclick = () => { if (confirm("Скинути монети, історію та прогрес?")) { S = DEFAULT_STATE(); save(); applyVariant(); render(); toast("Дані скинуто"); } };
}

// ---------- Сторінка серіалу ----------
function voteHTML(s) {
  const mine = S.votes[s.id];
  const base = s.vote.options.map((_, i) => 200 + (hash(s.id + i) % 900));
  if (mine !== undefined) base[mine] += S.sub ? 2 : 1;
  const total = base.reduce((a, b) => a + b, 0);
  return `<div class="card" style="margin-top:12px">
    <b style="font-size:17px">${esc(s.vote.q)}</b><div class="muted small" style="margin-top:2px">Глядачі впливають на продовження історії</div>
    ${s.vote.options.map((o, i) => {
      const pct = Math.round(base[i] / total * 100);
      return `<button class="vote-opt ${mine === i ? "mine" : ""}" data-vote="${s.id}" data-i="${i}">
        ${mine !== undefined ? `<div class="fill" style="transform:scaleX(${pct / 100})"></div>` : ""}
        <span><span>${esc(o)}</span>${mine !== undefined ? `<b>${pct}%</b>` : ""}</span></button>`;
    }).join("")}
  </div>`;
}

function renderDetail(v, s) {
  const p = S.progress[s.id], watched = watchedOf(s.id);
  v.innerHTML = `
    <div class="hero" style="background:${grad(s)}">
      <button class="back" data-back aria-label="Назад">${ICONS.back}</button>
      <div class="emoji">${s.emoji}</div>
      <h1>${esc(s.title)}</h1>
      <div class="small">${s.genre} · ★ ${s.rating} · ${s.episodes} серій · ${fmtViews(s.views)} переглядів</div>
    </div>
    <div class="detail-actions">
      <button class="btn" style="flex:1" data-play="${s.id}" data-ep="${p ? p.ep : 1}">${p ? `Продовжити · серія ${p.ep}` : "Дивитись"}</button>
      <button class="btn secondary" data-save="${s.id}" aria-label="Зберегти" style="width:50px;padding:0">${ICONS.bookmark.replace('class="i"', `class="i" style="${S.saved.includes(s.id) ? "fill:currentColor" : ""}"`)}</button>
    </div>
    <p class="detail-desc">${esc(s.desc)}</p>
    <div class="chips">${s.tags.map(t => `<span class="chip">${esc(t)}</span>`).join("")}<span class="chip">Українська озвучка</span></div>
    <p class="muted small">${esc(s.creator)}</p>
    <h2>Серії</h2>
    <div class="ep-grid">${Array.from({ length: s.episodes }, (_, i) => i + 1).map(n =>
      `<button class="ep ${watched.includes(n) ? "watched" : ""} ${isUnlocked(s, n) ? "" : "locked"}" data-play="${s.id}" data-ep="${n}">${n}${isUnlocked(s, n) ? "" : ICONS.lock.replace('class="i"', 'class="i lk"')}</button>`).join("")}</div>
    <h2>Голосування</h2>
    ${voteHTML(s)}
  `;
}

// ---------- Плеєр ----------
const P = { s: null, ep: 1, t: 0, playing: false, iv: null };

function openPlayer(id, ep = 1) {
  P.s = byId(id); P.ep = Math.min(Math.max(1, +ep), P.s.episodes);
  $("#player").classList.remove("hidden");
  startEpisode();
}
function closePlayer() {
  clearInterval(P.iv); P.playing = false;
  $("#player").classList.add("hidden"); $("#player").innerHTML = "";
  render();
}

function startEpisode() {
  clearInterval(P.iv); P.t = 0;
  const s = P.s, ep = P.ep;
  renderPlayer();
  if (!isUnlocked(s, ep)) return showLock();
  const pr = S.progress[s.id] || { ep, watched: [], ts: 0 };
  pr.ep = ep; pr.ts = Date.now(); S.progress[s.id] = pr;
  S.history = S.history.filter(h => !(h.id === s.id && h.ep === ep)).concat({ id: s.id, ep, ts: Date.now() }).slice(-50);
  save();
  play();
}

function renderPlayer() {
  const s = P.s, ep = P.ep;
  const line = s.beats[(ep - 1) % s.beats.length];
  $("#player").innerHTML = `
    <div class="stage" id="stage" style="background:${grad(s)}">
      <div class="p-top">
        <button class="p-close" id="pClose" aria-label="Закрити">${ICONS.close}</button>
        <div class="t">${esc(s.title)}<div class="small">Серія ${ep} з ${s.episodes}</div></div>
      </div>
      <div class="scene"><span class="e">${s.emoji}</span>${S.settings.subs ? `<div class="line">${esc(line)}</div>` : ""}</div>
      <div class="paused hidden" id="pPaused">${ICONS.play}</div>
      <div class="p-side">
        <button class="side-btn ${S.liked.includes(s.id) ? "on" : ""}" data-like="${s.id}"><b>${ICONS.heart}</b>Лайк</button>
        <button class="side-btn save ${S.saved.includes(s.id) ? "on" : ""}" data-save="${s.id}"><b>${ICONS.bookmark}</b>Зберегти</button>
        <button class="side-btn" id="pList"><b>${ICONS.list}</b>Серії</button>
        <button class="side-btn" id="pNext"><b>${ICONS.next}</b>Далі</button>
      </div>
      <div class="p-bottom">
        <div class="subs">Українська озвучка · свайп угору — наступна серія</div>
        <div class="p-progress"><div id="pBar"></div></div>
      </div>
    </div>`;
  $("#pClose").onclick = e => { e.stopPropagation(); closePlayer(); };
  $("#pNext").onclick = e => { e.stopPropagation(); nextEp(); };
  $("#pList").onclick = e => { e.stopPropagation(); const id = s.id; closePlayer(); openDetail(id); };
  $("#stage").onclick = e => { if (!e.target.closest("button") && !$(".lock-screen")) togglePlay(); };
}

function play() {
  P.playing = true; $("#pPaused") && $("#pPaused").classList.add("hidden");
  clearInterval(P.iv);
  P.iv = setInterval(() => {
    P.t += 0.1;
    const bar = $("#pBar"); if (bar) bar.style.width = Math.min(100, P.t / CFG.EP_SECONDS * 100) + "%";
    if (P.t >= CFG.EP_SECONDS) endEpisode();
  }, 100);
}
function togglePlay() {
  if (P.playing) { P.playing = false; clearInterval(P.iv); $("#pPaused").classList.remove("hidden"); }
  else play();
}
function endEpisode() {
  clearInterval(P.iv); P.playing = false;
  const s = P.s, pr = S.progress[s.id];
  if (!pr.watched.includes(P.ep)) pr.watched.push(P.ep);
  if (P.ep < s.episodes) pr.ep = P.ep + 1;
  save();
  if (P.ep >= s.episodes) return showFinale();
  if (S.settings.autoplay) nextEp();
  else { $("#pPaused").classList.remove("hidden"); toast("Серію завершено"); }
}
function nextEp() {
  if (P.ep >= P.s.episodes) return showFinale();
  P.ep++; startEpisode();
}
function prevEp() { if (P.ep > 1) { P.ep--; startEpisode(); } }

function overlay(html) {
  const o = document.createElement("div"); o.className = "lock-screen"; o.innerHTML = html;
  $("#stage").appendChild(o); return o;
}

function showLock() {
  const s = P.s, ep = P.ep, a = adStatus();
  const enough = S.coins >= CFG.EP_COST;
  const o = overlay(`
    <div class="big">${ICONS.lock}</div>
    <h2 style="margin:0">Серія ${ep}</h2>
    <p>Відкрийте за ${CFG.EP_COST} монет · у вас ${COIN}${S.coins}</p>
    <button class="btn white" id="lkUnlock" ${enough ? "" : "disabled"}>Відкрити за ${COIN}${CFG.EP_COST}</button>
    <button class="btn" id="lkAd" ${a.can ? "" : "disabled"}>${a.left <= 0 ? "Ліміт реклами на сьогодні" : a.wait ? `Реклама через ${a.wait} с` : `Реклама · +${CFG.AD_REWARD} монет`}</button>
    <button class="btn secondary" id="lkSub">Усі серії з Meri+</button>
    ${ep > 1 ? `<button class="btn plain" id="lkPrev">Попередня серія</button>` : ""}
  `);
  $("#lkUnlock", o).onclick = () => {
    S.coins -= CFG.EP_COST; S.unlocked[s.id] = [...(S.unlocked[s.id] || []), ep]; save();
    toast(`Серію ${ep} відкрито`); startEpisode();
  };
  $("#lkAd", o).onclick = () => watchAd(() => { o.remove(); showLock(); });
  $("#lkSub", o).onclick = () => { closePlayer(); go("profile"); };
  const pv = $("#lkPrev", o); if (pv) pv.onclick = prevEp;
  if (!a.can && a.left > 0) setTimeout(() => { if (o.isConnected) { o.remove(); showLock(); } }, 1000);
}

function showFinale() {
  const s = P.s;
  const o = overlay(`<div class="big">${ICONS.vote}</div><h2 style="margin:0">Сезон завершено</h2>
    <p>Ваш голос вплине на продовження «${esc(s.title)}»</p>
    <div id="fVote" style="text-align:left"></div>
    <button class="btn plain" id="fClose">До каталогу</button>`);
  const paint = () => { $("#fVote", o).innerHTML = voteHTML(s); };
  paint();
  o.addEventListener("click", e => { const b = e.target.closest("[data-vote]"); if (b) { e.stopPropagation(); castVote(b); paint(); } });
  $("#fClose", o).onclick = () => { closePlayer(); go("catalog"); };
}

function castVote(b) {
  S.votes[b.dataset.vote] = +b.dataset.i; save(); toast("Ваш голос враховано");
}

// Свайпи та клавіатура в плеєрі
let touchY = null;
$("#player").addEventListener("touchstart", e => { touchY = e.touches[0].clientY; }, { passive: true });
$("#player").addEventListener("touchend", e => {
  if (touchY === null) return;
  const dy = e.changedTouches[0].clientY - touchY; touchY = null;
  if (Math.abs(dy) < 60) return;
  dy < 0 ? nextEp() : prevEp();
});
let wheelLock = 0;
$("#player").addEventListener("wheel", e => {
  if (Date.now() < wheelLock || Math.abs(e.deltaY) < 30 || $(".lock-screen")) return;
  wheelLock = Date.now() + 700; e.deltaY > 0 ? nextEp() : prevEp();
}, { passive: true });
document.addEventListener("keydown", e => {
  if ($("#player").classList.contains("hidden")) return;
  if (e.key === "Escape") closePlayer();
  else if (e.key === "ArrowDown") nextEp();
  else if (e.key === "ArrowUp") prevEp();
  else if (e.key === " " && !$(".lock-screen")) { e.preventDefault(); togglePlay(); }
});

// ---------- Делегування кліків ----------
document.addEventListener("click", e => {
  const el = e.target.closest("[data-tab],[data-go],[data-open],[data-play],[data-like],[data-save],[data-genre],[data-pack],[data-setting],[data-vote],[data-back],[data-close],[data-variant]");
  if (!el) { if (e.target.id === "modal") closeModal(); return; }
  const d = el.dataset;
  if (d.tab) go(d.tab);
  else if (d.go) go(d.go);
  else if (d.play) { closeModal(); openPlayer(d.play, d.ep); }
  else if (d.open) { if (!$("#player").classList.contains("hidden")) closePlayer(); openDetail(d.open); }
  else if (d.like) { S.liked = toggleIn(S.liked, d.like); save(); el.classList.toggle("on"); }
  else if (d.save) {
    S.saved = toggleIn(S.saved, d.save); save();
    toast(S.saved.includes(d.save) ? "Збережено в медіатеку" : "Прибрано з медіатеки");
    if (el.classList.contains("side-btn")) el.classList.toggle("on"); else render();
  }
  else if (d.genre) { if (UI.tab !== "catalog") { UI.tab = "catalog"; renderTabbar(); } UI.genre = d.genre; render(); }
  else if (d.pack) buyPack(+d.pack);
  else if (d.setting) { S.settings[d.setting] = !S.settings[d.setting]; save(); el.classList.toggle("on"); }
  else if (d.variant) { S.design = d.variant; save(); applyVariant(); render(); }
  else if (d.vote !== undefined && !el.closest(".lock-screen")) { castVote(el); render(); }
  else if ("back" in d) { UI.detail = null; render(); }
  else if ("close" in d) closeModal();
});

// ---------- Старт ----------
if (EMBED) { document.documentElement.style.setProperty("--st", "54px"); document.documentElement.style.setProperty("--sb", "22px"); }
$("#coinIco").innerHTML = COIN;
applyVariant();
resetAdsIfNewDay();
updateCoins();
renderTabbar();
if (params.get("open")) UI.detail = params.get("open");
render();
