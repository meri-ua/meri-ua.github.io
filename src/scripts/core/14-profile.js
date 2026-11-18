/* 14-profile.js — Екран «Профіль»: Meri+, оформлення, налаштування */

// ---------- Профіль ----------
function renderProfile(v) {
  const hist = [...S.history].reverse().slice(0, 8);
  const cur = URL_VARIANT || S.design;
  const sw = (key, label, icon, color) => `<div class="list-row">${rowIco(icon, color)}<div style="flex:1">${label}</div>
    <button class="switch ${S.settings[key] ? "on" : ""}" data-setting="${key}" aria-label="${label}"></button></div>`;
  v.innerHTML = `
    <div class="group" style="margin-top:8px">
      <div class="list-row" style="padding:14px 16px">
        <div class="avatar">Г</div>
        <div style="flex:1"><b style="font-size:20px">Гість</b><div class="sub">Увійдіть, щоб синхронізувати перегляд</div></div>
        <span class="chev">›</span>
      </div>
    </div>

    <div class="sub-card" style="margin-top:16px">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <b style="font-size:22px">Meri+</b><span class="small" style="opacity:.75">${CFG.SUB_PRICE} грн/міс</span>
      </div>
      <ul class="rules"><li>Усі серії відкриті</li><li>Без реклами</li><li>Ранній доступ до прем'єр</li><li>Подвійна вага голосу</li></ul>
      <button class="btn block ${S.sub ? "glass" : "white"}" id="subBtn">${S.sub ? "Скасувати підписку (демо)" : "Спробувати Meri+"}</button>
    </div>

    <h3>Оформлення</h3>
    <div class="group">${VARIANTS.map(x => `
      <div class="list-row" data-variant="${x.id}" style="cursor:pointer">
        ${rowIco("palette", x.id === "ios" ? "#0a84ff" : x.id === "music" ? "#fa2d48" : "#5e5ce6")}
        <div style="flex:1">${x.name}<div class="sub">${x.hint}</div></div>
        ${x.id === cur ? `<span style="color:var(--tint);font-weight:700">✓</span>` : ""}
      </div>`).join("")}
    </div>

    <h3>Відтворення</h3>
    <div class="group">
      ${sw("autoplay", "Автовідтворення", "play", "#34c759")}
      ${sw("subs", "Субтитри", "captions", "#8e8e93")}
      ${sw("adsPersonal", "Персоналізована реклама", "hand", "#ff9f0a")}
    </div>

    <h3>Історія</h3>
    ${hist.length ? `<div class="group">${hist.map(h => { const s = byId(h.id); return s ? `
      <div class="list-row" data-play="${s.id}" data-ep="${h.ep}"><div style="flex:1">${esc(s.title)}<div class="sub">Серія ${h.ep} · ${new Date(h.ts).toLocaleString("uk-UA", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</div></div><span class="chev">›</span></div>` : ""; }).join("")}</div>`
      : `<div class="group"><div class="list-row muted">Історія порожня</div></div>`}

    <h3>Для творців</h3>
    <div class="group">
      <div class="list-row" id="creatorBtn" style="cursor:pointer">${rowIco("film", "#af52de")}
        <div style="flex:1">Подати свій серіал<div class="sub">Частка доходу для незалежних авторів</div></div><span class="chev">›</span></div>
    </div>

    <div class="group" style="margin-top:28px">
      <button class="list-row" id="resetBtn" style="width:100%;justify-content:center;color:var(--red)">Скинути демо-дані</button>
    </div>
    <p class="footnote" style="text-align:center">Meri.ua · MVP прототип<br/>версія ${esc(window.MERI_BUILD || "dev")}</p>
  `;
  $("#subBtn").onclick = () => { S.sub = !S.sub; save(); toast(S.sub ? "Meri+ активовано (демо)" : "Підписку скасовано"); renderProfile(v); };
  $("#creatorBtn").onclick = () => toast("Повідомимо, коли кабінет творця відкриється");
  $("#resetBtn").onclick = () => { if (confirm("Скинути монети, історію та прогрес?")) { S = DEFAULT_STATE(); save(); applyVariant(); render(); toast("Дані скинуто"); } };
}

