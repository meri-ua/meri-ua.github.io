/* 15-detail.js — Сторінка серіалу і голосування */

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
      <div class="small">${s.genre} · ${ratingText(s)} · ${s.episodes} серій · ${fmtViews(s.views)} переглядів</div>
    </div>
    <div class="detail-actions">
      <button class="btn" style="flex:1" data-play="${s.id}" data-ep="${p ? p.ep : 1}">${p ? `Продовжити · серія ${p.ep}` : "Дивитись"}</button>
      <button class="btn secondary" data-save="${s.id}" aria-label="Зберегти" style="width:50px;padding:0">${ICONS.bookmark.replace('class="i"', `class="i" style="${S.saved.includes(s.id) ? "fill:currentColor" : ""}"`)}</button>
    </div>
    <p class="detail-desc">${esc(s.desc)}</p>
    <div class="chips">${s.tags.map(t => `<span class="chip">${esc(t)}</span>`).join("")}<span class="chip">Українська озвучка</span></div>
    ${creatorRowHTML(creatorOf(s))}
    <h2>Серії</h2>
    <div class="ep-grid">${Array.from({ length: s.episodes }, (_, i) => i + 1).map(n =>
      `<button class="ep ${watched.includes(n) ? "watched" : ""} ${isUnlocked(s, n) ? "" : "locked"}" data-play="${s.id}" data-ep="${n}">${n}${isUnlocked(s, n) ? "" : ICONS.lock.replace('class="i"', 'class="i lk"')}</button>`).join("")}</div>
    <h2>Голосування</h2>
    ${voteHTML(s)}
  `;
}

