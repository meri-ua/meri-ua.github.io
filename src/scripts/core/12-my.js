/* 12-my.js — Екран «Медіатека»: продовження, збережене, голоси */

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

