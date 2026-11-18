/* 20-player.js — Плеєр: серії, замок, фінал, свайпи */

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

