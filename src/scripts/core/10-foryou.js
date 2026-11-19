/* 10-foryou.js — Екран «Для тебе»: вертикальна стрічка */

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
      <div style="display:flex;gap:6px;margin-bottom:16px"><span class="chip">${s.genre}</span><span class="chip">${ratingText(s)}</span><span class="chip">UA озвучка</span></div>
      <div class="actions">
        <button class="btn white" data-play="${s.id}" data-ep="${p ? p.ep : 1}">${ICONS.play.replace('class="i"', 'class="i" style="fill:currentColor;stroke:none;width:18px;height:18px"')} ${p ? `Серія ${p.ep}` : "Дивитись"}</button>
      </div>
    </div>`;
  }).join("")}</div>`;
}

