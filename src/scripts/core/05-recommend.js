/* 05-recommend.js — Рекомендації для стрічки «Для тебе» */

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
    let score = g * 3 + (s.rating || 0) * 2 + Math.log10(s.views + 1) + (s.isNew ? 1.5 : 0) - (finished ? 20 : 0);
    if (watchedIds.has(s.id) && !finished) score += 4; // продовжити
    const followed = S.following.includes(s.creatorId);
    if (followed && !finished) score += 3;             // автор, за яким стежиш
    let why;
    if (p && !finished) why = `Продовжити з ${p.ep}-ї серії`;
    else if (followed) why = `Від @${creatorOf(s).handle}, за яким ви стежите`;
    else if (g && lastSeenByGenre[s.genre] && lastSeenByGenre[s.genre].id !== s.id) why = `Бо вам сподобався «${lastSeenByGenre[s.genre].title}»`;
    else if (s.isNew) why = "Новинка тижня";
    else if (s.views > 2e6) why = "Популярне в Україні";
    else why = `${s.genre} · ${ratingText(s)}`;
    return { s, score, why };
  }).sort((a, b) => b.score - a.score);
}

