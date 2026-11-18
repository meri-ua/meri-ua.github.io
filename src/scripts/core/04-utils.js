/* 04-utils.js — Дрібні помічники: пошук, екранування, постери */

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

