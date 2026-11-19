/* 17-me.js — Ваш профіль у стилі TikTok, «Редагувати профіль» і ваші серіали в каталозі */

// ---------- Мій профіль ----------
// Кольори аватара й обкладинок (пари для градієнта) і символи на вибір.
const PALETTE = [["#5e5ce6", "#0a84ff"], ["#134e5e", "#71b280"], ["#cb2d3e", "#ef473a"],
  ["#f7971e", "#ffd200"], ["#232526", "#414345"], ["#ee9ca7", "#ffdde1"], ["#8e2de2", "#4a00e0"]];
const ME_EMOJI = ["🎬", "✍️", "🎭", "🎥", "🌻", "🦋", "🐺", "⭐"];

const meName = () => S.me.name.trim() || "Гість";
const meHandle = () => S.me.handle || "guest";
const meColors = () => PALETTE[S.me.color] || PALETTE[0];
function meAvatarHTML(size = "md", ring = false) {
  const c = { id: "me", emoji: S.me.emoji || "🎬", colors: meColors() };
  return avatarHTML(c, size, ring ? "live" : false);
}

// Шапка підсторінки: «назад», заголовок по центру, необов'язкова кнопка праворуч.
function pageBarHTML(title, right = "") {
  return `<div class="ig-bar page-bar">
    <button class="ig-back" data-back aria-label="Назад">${ICONS.back}</button>
    <b class="pb-title">${title}</b><span class="pb-right">${right}</span>
  </div>`;
}

// Опубліковані вами серіали стають частиною каталогу: автор «me» і його серіали
// додаються в CREATORS і SERIES. Викликати після будь-якої зміни профілю чи подач.
function syncMine() {
  for (let i = SERIES.length - 1; i >= 0; i--) if (SERIES[i].creatorId === "me") SERIES.splice(i, 1);
  const ci = CREATORS.findIndex(c => c.id === "me"); if (ci >= 0) CREATORS.splice(ci, 1);
  const pub = S.submissions.filter(d => d.status === "published");
  if (!pub.length) return;
  CREATORS.push({ id: "me", name: meName(), handle: meHandle(), type: "indie", city: S.me.city.trim() || "Україна",
    since: new Date().getFullYear(), verified: false, followers: 0, emoji: S.me.emoji || "🎬", colors: meColors(),
    bio: S.me.bio.trim() || "Автор на Meri." });
  pub.forEach(d => SERIES.push(seriesFromSubmission(d)));
}
function seriesFromSubmission(d) {
  return {
    id: d.id, title: d.title, genre: d.genre, tags: [d.genre, "Від автора"], desc: d.desc,
    episodes: d.episodes, freeEps: d.freeEps, rating: null, views: 0, isNew: true, creatorId: "me",
    colors: PALETTE[d.color] || PALETTE[0], emoji: d.cover ? "" : d.emoji, cover: d.cover || "",
    beats: [d.desc.split(/(?<=[.!?…])\s/)[0].slice(0, 90), `Серія від @${meHandle()}`],
    vote: { q: "Що має статися далі?", options: ["Продовження історії", "Новий сезон", "Спін-оф про героя"] }
  };
}

// ---------- Екран профілю ----------
const SUB_STATUS = { draft: ["Чернетка", "draft"], review: ["На модерації", "mod"], published: ["Опубліковано", "ok"] };

function renderProfile(v) {
  const t = UI.meTab;
  const mine = [...S.submissions].sort((a, b) => b.createdAt - a.createdAt);
  const cellFor = s => `<button class="ig-cell" data-open="${s.id}" style="background:${grad(s)}" aria-label="${esc(s.title)}">
      <span class="em">${s.emoji}</span><span class="v">${ICONS.play} ${fmtViews(s.views)}</span></button>`;
  const seriesGrid = (ids, emptyIcon, emptyText) => {
    const list = ids.map(byId).filter(Boolean);
    return list.length ? `<div class="ig-grid">${list.map(cellFor).join("")}</div>`
      : `<div class="empty"><div class="e">${ICONS[emptyIcon]}</div>${emptyText}</div>`;
  };

  let body;
  if (t === "liked") body = seriesGrid(S.liked, "heart", "Серіали, яким ви поставили ♥, з'являться тут.");
  else if (t === "saved") body = seriesGrid(S.saved, "bookmark", "Натисніть «Зберегти» на серіалі, щоб додати його сюди.");
  else if (!mine.length) body = `<div class="empty-me">
      <div class="big-plus">＋</div><b>Створіть свій перший серіал</b>
      <span>Подайте історію — після модерації вона з'явиться в Каталозі Meri під вашим ім'ям</span>
      <button class="btn small-btn" data-act="new-submission">Подати серіал</button></div>`;
  else body = `<div class="ig-grid">${mine.map(d => {
      const [label, cls] = SUB_STATUS[d.status];
      const bg = d.title || d.cover ? grad({ colors: PALETTE[d.color] || PALETTE[0], cover: d.cover }) : "var(--fill)";
      return `<button class="ig-cell" data-act="open-sub" data-id="${d.id}" style="background:${bg}" aria-label="${esc(d.title || "Чернетка")}">
        <span class="st ${cls}">${label}</span>
        ${d.cover ? "" : `<span class="em">${d.emoji}</span>`}
        ${d.title ? `<span class="v">${esc(d.title)}</span>` : ""}</button>`;
    }).join("")}
      <button class="ig-cell soon" data-act="new-submission" aria-label="Подати новий серіал"><span style="font-size:30px">＋</span>Новий серіал</button>
    </div>
    <p class="footnote" style="margin:12px 0 0">Ваша частка — ${CFG.AUTHOR_SHARE}% доходу від реклами, монет і Meri+ за перегляди ваших серій.
      Демо: заявки зберігаються лише на цьому пристрої.</p>`;

  const city = S.me.city.trim();
  v.innerHTML = `
    <div class="ig-bar page-bar">
      <span class="ig-back"></span>
      <b class="pb-title">${S.me.handle ? "@" + esc(S.me.handle) : "Мій профіль"}</b>
      <span class="pb-right"><button class="ig-back" data-page="settings" aria-label="Налаштування">${ICONS.gear}</button></span>
    </div>
    <div class="me-head">
      ${meAvatarHTML("lg", true)}
      <div class="ig-name">${esc(meName())}</div>
      <div class="ig-type">${S.me.handle ? "@" + esc(S.me.handle) : "Заповніть профіль, щоб подавати серіали"}${city ? " · " + esc(city) : ""}</div>
      <div class="tt-stats">
        <div><b>${S.following.length}</b><span>Підписки</span></div>
        <div><b>0</b><span>Підписники</span></div>
        <div><b>${S.liked.length}</b><span>Вподобання</span></div>
      </div>
      ${S.me.bio.trim() ? `<div class="ig-bio">${esc(S.me.bio)}</div>` : ""}
    </div>
    <div class="ig-btns">
      <button class="btn secondary" data-page="edit-me">Редагувати</button>
      <button class="btn" data-act="new-submission">＋ Подати серіал</button>
    </div>
    <div class="ig-tabs" role="tablist">
      <button role="tab" class="${t === "mine" ? "on" : ""}" data-act="me-tab" data-t="mine">${ICONS.grid} Мої серіали</button>
      <button role="tab" class="${t === "liked" ? "on" : ""}" data-act="me-tab" data-t="liked">${ICONS.heart} Вподобане</button>
      <button role="tab" class="${t === "saved" ? "on" : ""}" data-act="me-tab" data-t="saved">${ICONS.bookmark} Збережене</button>
    </div>
    ${body}
  `;
}

ACTIONS["me-tab"] = el => { UI.meTab = el.dataset.t; render(); };
ACTIONS["open-sub"] = el => {
  const d = S.submissions.find(x => x.id === el.dataset.id); if (!d) return;
  if (d.status === "draft") { UI.draftId = d.id; openPage("submit"); }
  else if (d.status === "review") {
    const left = Math.max(1, Math.ceil((d.submittedAt + CFG.MODERATION_SECONDS * 1000 - Date.now()) / 1000));
    toast(`«${d.title}» на модерації — ще ~${left} с`);
  } else openDetail(d.id);
};

// ---------- Редагувати профіль ----------
// Поки людина друкує, зміни живуть у UI.meForm; у стан S.me вони потрапляють лише після «Зберегти».
function renderEditMe(v) {
  const f = UI.meForm || (UI.meForm = { ...S.me });
  const colors = PALETTE[f.color] || PALETTE[0];
  v.innerHTML = `
    ${pageBarHTML("Редагувати профіль", `<button class="pb-save" data-act="save-me">Готово</button>`)}
    <div class="me-head">
      ${avatarHTML({ id: "me", emoji: f.emoji, colors }, "lg", "live")}
    </div>
    <div class="lbl">Символ</div>
    <div class="pick">${ME_EMOJI.map(e => `<button class="pick-e ${e === f.emoji ? "on" : ""}" data-act="me-emoji" data-v="${e}">${e}</button>`).join("")}</div>
    <div class="lbl">Колір</div>
    <div class="pick">${PALETTE.map((p, i) => `<button class="sw ${i === f.color ? "on" : ""}" data-act="me-color" data-v="${i}"
      style="background:linear-gradient(160deg, ${p[0]}, ${p[1]})" aria-label="Колір ${i + 1}"></button>`).join("")}</div>
    <div class="field"><label for="meName">Ім'я</label><input id="meName" data-mefield="name" maxlength="40" value="${esc(f.name)}" placeholder="Олена Коваль" /></div>
    <div class="field"><label for="meHandle">Нікнейм</label><div class="at"><span>@</span><input id="meHandle" data-mefield="handle" maxlength="24"
      value="${esc(f.handle)}" placeholder="olena.k" autocapitalize="none" autocomplete="off" /></div>
      <div class="hint">Латиниця, цифри, крапка і _ — до 24 символів</div></div>
    <div class="field"><label for="meCity">Місто</label><input id="meCity" data-mefield="city" maxlength="40" value="${esc(f.city)}" placeholder="Київ" /></div>
    <div class="field"><label for="meBio">Про себе</label><textarea id="meBio" data-mefield="bio" maxlength="150" rows="3"
      placeholder="Пишу сценарії про любов і Карпати">${esc(f.bio)}</textarea></div>
    <div class="err" id="meErr"></div>
    <button class="btn block" data-act="save-me" style="margin-top:8px">Зберегти</button>
  `;
}
const cleanHandle = s => s.toLowerCase().replace(/[^a-z0-9._]/g, "").slice(0, 24);

document.addEventListener("input", e => {
  const k = e.target.dataset && e.target.dataset.mefield;
  if (!k || !UI.meForm) return;
  if (k === "handle") { const c = cleanHandle(e.target.value); if (c !== e.target.value) e.target.value = c; }
  UI.meForm[k] = e.target.value;
  const err = $("#meErr"); if (err) err.textContent = "";
});
ACTIONS["me-emoji"] = el => { UI.meForm.emoji = el.dataset.v; render(); };
ACTIONS["me-color"] = el => { UI.meForm.color = +el.dataset.v; render(); };
ACTIONS["save-me"] = () => {
  const f = UI.meForm; if (!f) return;
  const err = msg => { $("#meErr").textContent = msg; };
  if (f.name.trim().length < 2) return err("Вкажіть ім'я — щонайменше 2 літери.");
  if (f.handle.length < 3) return err("Нікнейм — щонайменше 3 символи.");
  if (CREATORS.some(c => c.id !== "me" && c.handle === f.handle)) return err(`Нікнейм @${f.handle} уже зайнятий. Спробуйте інший.`);
  S.me = { name: f.name.trim(), handle: f.handle, city: f.city.trim(), bio: f.bio.trim(), emoji: f.emoji, color: f.color };
  UI.meForm = null; save(); syncMine(); toast("Профіль збережено"); goBack();
};
