/* 30-events.js — Один обробник кліків на весь застосунок */

// ---------- Делегування кліків ----------
document.addEventListener("click", e => {
  const el = e.target.closest("[data-tab],[data-go],[data-open],[data-play],[data-like],[data-save],[data-genre],[data-pack],[data-setting],[data-vote],[data-back],[data-close],[data-design],[data-follow],[data-creator],[data-ctab],[data-share-creator],[data-act],[data-page]");
  if (!el) { if (e.target.id === "modal") closeModal(); return; }
  const d = el.dataset;
  if (d.act) { if (ACTIONS[d.act]) ACTIONS[d.act](el, e); }
  else if (d.page) openPage(d.page);
  else if (d.tab) go(d.tab);
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
  // Не data-variant: цей атрибут має сам #app, і тоді будь-який клік «перемикав дизайн».
  else if (d.design) { S.design = d.design; save(); applyVariant(); render(); }
  else if (d.vote !== undefined && !el.closest(".lock-screen")) { castVote(el); render(); }
  else if (d.follow) toggleFollow(d.follow);
  else if (d.shareCreator) shareCreator(d.shareCreator);
  else if (d.ctab) { UI.creatorTab = d.ctab; render(); }
  else if (d.creator) { if (!$("#player").classList.contains("hidden")) closePlayer(); openCreator(d.creator); }
  else if ("back" in d) goBack();
  else if ("close" in d) closeModal();
});

