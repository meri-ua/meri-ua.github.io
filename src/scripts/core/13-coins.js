/* 13-coins.js — Екран «Монети»: реклама, бонус, покупки */

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

