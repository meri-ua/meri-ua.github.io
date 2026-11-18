/* 03-state.js — Стан застосунку: що зберігається в localStorage */

// ---------- Стан ----------
const STORE_KEY = "meri.state.v1";
// День за МІСЦЕВИМ часом (РРРР-ММ-ДД). toISOString() дав би день за UTC:
// о 01:00 у Києві там ще «вчора», і ліміт реклами скидався б не опівночі.
const ymdLocal = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const today = () => ymdLocal();
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

