/* 04-utils.js — Дрібні помічники: пошук, екранування, постери */

// ---------- Утиліти ----------
const $ = (sel, root = document) => root.querySelector(sel);
const byId = id => SERIES.find(s => s.id === id);
const creatorById = id => CREATORS.find(c => c.id === id);
const creatorOf = s => creatorById(s.creatorId);
const seriesOf = c => SERIES.filter(s => s.creatorId === c.id);
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
  <div class="meta" style="margin-top:6px">${esc(creatorOf(s).name)}</div></div>`;
const sectionHead = (title, link) => `<div class="section-head"><h2>${title}</h2>${link ? `<a data-genre="${link}">Усі</a>` : ""}</div>`;
// Лічильники автора: серіали, сумарні перегляди, підписники (+1, якщо стежите ви).
function creatorStats(c) {
  const list = seriesOf(c);
  return { count: list.length, views: list.reduce((a, s) => a + s.views, 0),
           followers: c.followers + (S.following.includes(c.id) ? 1 : 0) };
}
const fmtCount = n => n >= 1e6 ? fmtViews(n) : n >= 1e3 ? (n / 1e3).toFixed(1).replace(".0", "").replace(".", ",") + " тис" : String(n);
const plural = (n, one, few, many) => {
  const a = n % 10, b = n % 100;
  return a === 1 && b !== 11 ? one : a >= 2 && a <= 4 && (b < 12 || b > 14) ? few : many;
};
// Круглий аватар; ring — кольорове кільце як у сторіз: true — сіре, якщо сторінку вже бачили,
// "live" — завжди кольорове (на самій сторінці автора).
function avatarHTML(c, size = "md", ring = false) {
  const ava = `<div class="ava ava-${size}" style="background:linear-gradient(160deg, ${c.colors[0]}, ${c.colors[1]})">${esc(c.emoji)}</div>`;
  return ring ? `<div class="ring ring-${size} ${ring === true && S.seenCreators.includes(c.id) ? "seen" : ""}">${ava}</div>` : ava;
}
const verifiedHTML = c => c.verified ? `<span class="vf" title="Перевірений автор">${ICONS.check}</span>` : "";
const rowIco = (icon, color) => `<span class="row-ico" style="background:${color}">${ICONS[icon]}</span>`;

