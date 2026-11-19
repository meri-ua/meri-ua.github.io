/* 18-submit.js — Подача серіалу: 4 кроки, чернетка, модерація, публікація в каталог */

// ---------- Подача серіалу ----------
// Кроки: 1 Основне → 2 Обкладинка → 3 Серії → 4 Умови. Чернетка зберігається на кожному
// натисканні клавіші, тож закрити майстер і повернутись пізніше — безпечно.
// Демо: заявка нікуди не надсилається, «модерація» — таймер CFG.MODERATION_SECONDS.
const STEP_NAMES = ["Основне", "Обкладинка", "Серії", "Умови"];
const SUB_EMOJI = ["🎬", "🌲", "🏔", "💔", "🕵️", "🔥", "🌊", "🐺", "✨", "🏙", "👑", "🚀"];
const VOICES = { ua: "Українська озвучка", ai: "AI-озвучка", subs: "Оригінал + субтитри" };

const draft = () => S.submissions.find(d => d.id === UI.draftId);

function newSubmission() {
  if (!S.me.handle) { toast("Спершу заповніть профіль"); return openPage("edit-me"); }
  const d = { id: "my-" + Date.now().toString(36), status: "draft", step: 1, createdAt: Date.now(),
    title: "", genre: "", desc: "", emoji: "🎬", color: 0, cover: "",
    episodes: 12, minutes: 2, freeEps: CFG.FREE_EPS, voice: "ua", agreeOriginal: false, agreeRules: false };
  S.submissions.push(d); save();
  UI.draftId = d.id; openPage("submit");
}
ACTIONS["new-submission"] = newSubmission;

// Перевірка кроку: порожній рядок — усе гаразд, інакше — що виправити.
function stepError(d, step) {
  if (step === 1) {
    if (d.title.trim().length < 2) return "Дайте серіалу назву — щонайменше 2 символи.";
    if (!d.genre) return "Оберіть жанр.";
    if (d.desc.trim().length < 20) return "Опишіть історію — хоча б одне речення (20+ символів).";
  }
  if (step === 3) {
    if (!(d.episodes >= 3 && d.episodes <= 100)) return "Кількість серій — від 3 до 100.";
    if (!(d.minutes >= 1 && d.minutes <= 5)) return "Тривалість серії — від 1 до 5 хвилин.";
    if (!(d.freeEps >= 1 && d.freeEps <= d.episodes)) return "Безкоштовних серій — від 1 до загальної кількості.";
  }
  if (step === 4 && !(d.agreeOriginal && d.agreeRules)) return "Підтвердьте обидва пункти, щоб надіслати.";
  return "";
}

function renderSubmit(v) {
  const d = draft();
  if (!d || d.status !== "draft") { UI.page = null; return render(); }
  const st = d.step;
  const poster = `<div class="poster cover-prev" style="background:${grad({ colors: PALETTE[d.color] || PALETTE[0], cover: d.cover })}">
      ${d.cover ? "" : `<span>${d.emoji}</span>`}<div class="p-title">${esc(d.title || "Назва серіалу")}</div></div>`;
  let body;
  if (st === 1) body = `
    <div class="field"><label for="sTitle">Назва</label><input id="sTitle" data-sfield="title" maxlength="40" value="${esc(d.title)}" placeholder="Вовча стежка" /></div>
    <div class="lbl">Жанр</div>
    <div class="chips wrap">${GENRES.map(g => `<button class="chip ${g === d.genre ? "active" : ""}" data-act="s-genre" data-v="${g}">${g}</button>`).join("")}</div>
    <div class="field"><label for="sDesc">Про що історія</label><textarea id="sDesc" data-sfield="desc" maxlength="220" rows="4"
      placeholder="Лісничка з Карпат знаходить слід, якого не може бути…">${esc(d.desc)}</textarea>
      <div class="hint"><span id="descN">${d.desc.length}</span>/220</div></div>`;
  else if (st === 2) body = `
    <div class="cover-row">${poster}
      <div style="flex:1;min-width:0">
        <div class="lbl" style="margin-top:0">Символ</div>
        <div class="pick">${SUB_EMOJI.map(e => `<button class="pick-e ${e === d.emoji && !d.cover ? "on" : ""}" data-act="s-emoji" data-v="${e}">${e}</button>`).join("")}</div>
        <div class="lbl">Колір</div>
        <div class="pick">${PALETTE.map((p, i) => `<button class="sw ${i === d.color ? "on" : ""}" data-act="s-color" data-v="${i}"
          style="background:linear-gradient(160deg, ${p[0]}, ${p[1]})" aria-label="Колір ${i + 1}"></button>`).join("")}</div>
      </div>
    </div>
    <div class="lbl" style="margin-top:18px">Або власний постер</div>
    <label class="upload">${ICONS.share} ${d.cover ? "Замінити зображення" : "Обрати зображення 9:16"}
      <input type="file" accept="image/*" id="coverIn" hidden /></label>
    ${d.cover ? `<button class="btn plain block" data-act="s-cover-remove">Прибрати постер</button>` : ""}
    <p class="footnote" style="margin:10px 0 0">Демо: зображення зменшується до 360×640 і лишається на цьому пристрої.</p>`;
  else if (st === 3) body = `
    <div class="field-row">
      <div class="field"><label for="sEp">Серій</label><input id="sEp" type="number" inputmode="numeric" min="3" max="100" data-sfield="episodes" value="${d.episodes}" /></div>
      <div class="field"><label for="sMin">Хвилин на серію</label><input id="sMin" type="number" inputmode="numeric" min="1" max="5" data-sfield="minutes" value="${d.minutes}" /></div>
    </div>
    <div class="field"><label for="sFree">Безкоштовних серій на початку</label><input id="sFree" type="number" inputmode="numeric" min="1" data-sfield="freeEps" value="${d.freeEps}" />
      <div class="hint">Далі глядач відкриває серії монетами (${CFG.EP_COST} за серію), рекламою або з Meri+</div></div>
    <div class="lbl">Звук</div>
    <div class="chips wrap">${Object.entries(VOICES).map(([k, n]) => `<button class="chip ${k === d.voice ? "active" : ""}" data-act="s-voice" data-v="${k}">${n}</button>`).join("")}</div>`;
  else body = `
    <div class="group">
      <div class="list-row">${rowIco("coins", "#34c759")}<div style="flex:1">Ваша частка<div class="sub">Від реклами, монет і Meri+ за перегляди ваших серій</div></div><b style="color:var(--tint);font-size:20px">${CFG.AUTHOR_SHARE}%</b></div>
      <div class="list-row">${rowIco("clock", "#ff9f0a")}<div style="flex:1">Модерація<div class="sub">Перевіряємо оригінальність і якість. Демо — ~${CFG.MODERATION_SECONDS} с</div></div></div>
    </div>
    <label class="check"><input type="checkbox" data-sfield="agreeOriginal" ${d.agreeOriginal ? "checked" : ""} />
      <span>Це мій оригінальний серіал, і я маю права на все, що в ньому є</span></label>
    <label class="check"><input type="checkbox" data-sfield="agreeRules" ${d.agreeRules ? "checked" : ""} />
      <span>Без реклами азартних ігор, ненависті та чужого контенту</span></label>
    <div class="sum">${poster}<div><b>${esc(d.title)}</b><div class="sub">${esc(d.genre)} · ${d.episodes} серій · ${VOICES[d.voice]}</div></div></div>`;

  v.innerHTML = `
    <div class="ig-bar page-bar">
      <button class="ig-back" data-act="s-close" aria-label="Закрити і зберегти чернетку">${ICONS.close}</button>
      <b class="pb-title">Новий серіал</b><span class="pb-right step-n">${st} / 4</span>
    </div>
    <div class="steps">${STEP_NAMES.map((_, i) => `<i class="${i < st ? "on" : ""}"></i>`).join("")}</div>
    <h2 style="margin-top:14px">${STEP_NAMES[st - 1]}</h2>
    ${body}
    <div class="err" id="sErr"></div>
    <div class="wiz-btns">
      ${st > 1 ? `<button class="btn secondary" data-act="s-prev">Назад</button>` : `<button class="btn plain danger" data-act="s-delete">Видалити</button>`}
      <button class="btn" data-act="s-next" style="flex:2">${st < 4 ? `Далі: ${STEP_NAMES[st].toLowerCase()}` : "Надіслати на модерацію"}</button>
    </div>
  `;
  const fileIn = $("#coverIn");
  if (fileIn) fileIn.addEventListener("change", async () => {
    const f = fileIn.files && fileIn.files[0]; if (!f) return;
    try { d.cover = await downscaleImage(f); save(); render(); }
    catch { $("#sErr").textContent = "Не вдалося прочитати зображення. Спробуйте інше (JPG чи PNG)."; }
  });
}

// Зменшує фото до 360×640 (обрізає по центру, як «cover») і повертає JPEG data-URL ~30–60 КБ,
// щоб постер вміщався у сховище браузера.
function downscaleImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file), img = new Image();
    img.onload = () => {
      const W = 360, H = 640, k = Math.max(W / img.width, H / img.height);
      const c = document.createElement("canvas"); c.width = W; c.height = H;
      c.getContext("2d").drawImage(img, (W - img.width * k) / 2, (H - img.height * k) / 2, img.width * k, img.height * k);
      URL.revokeObjectURL(url); resolve(c.toDataURL("image/jpeg", 0.8));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("bad image")); };
    img.src = url;
  });
}

// Поля майстра пишуться в чернетку одразу, без перемальовування (щоб не губився курсор).
function onSubmitField(e) {
  const k = e.target.dataset && e.target.dataset.sfield; const d = k && draft();
  if (!d) return;
  if (e.target.type === "checkbox") d[k] = e.target.checked;
  else if (e.target.type === "number") d[k] = Math.round(+e.target.value) || 0;
  else d[k] = e.target.value;
  if (k === "desc" && $("#descN")) $("#descN").textContent = d.desc.length;
  const err = $("#sErr"); if (err) err.textContent = "";
  save();
}
document.addEventListener("input", onSubmitField);
document.addEventListener("change", e => { if (e.target.type === "checkbox") onSubmitField(e); });

const pickDraft = (k, val) => { const d = draft(); if (!d) return; d[k] = val; save(); render(); };
ACTIONS["s-genre"] = el => pickDraft("genre", el.dataset.v);
ACTIONS["s-voice"] = el => pickDraft("voice", el.dataset.v);
ACTIONS["s-color"] = el => pickDraft("color", +el.dataset.v);
ACTIONS["s-emoji"] = el => { const d = draft(); if (d) d.cover = ""; pickDraft("emoji", el.dataset.v); };
ACTIONS["s-cover-remove"] = () => pickDraft("cover", "");
ACTIONS["s-prev"] = () => { const d = draft(); if (d && d.step > 1) { d.step--; save(); render(); $("#view").scrollTop = 0; } };
ACTIONS["s-close"] = () => { toast("Чернетку збережено в «Моїх серіалах»"); UI.meTab = "mine"; goBack(); };
ACTIONS["s-delete"] = () => {
  const d = draft(); if (!d || !confirm("Видалити чернетку? Її не можна буде повернути.")) return;
  S.submissions = S.submissions.filter(x => x.id !== d.id); save(); toast("Чернетку видалено"); goBack();
};
ACTIONS["s-next"] = () => {
  const d = draft(); if (!d) return;
  const err = stepError(d, d.step);
  if (err) { $("#sErr").textContent = err; return; }
  if (d.step < 4) { d.step++; save(); render(); $("#view").scrollTop = 0; return; }
  d.title = d.title.trim(); d.desc = d.desc.trim();
  d.status = "review"; d.submittedAt = Date.now(); save();
  toast("Серіал надіслано на модерацію");
  UI.meTab = "mine"; goBack(); scheduleModeration();
};

// ---------- Модерація (демо) ----------
// Заявка «на модерації» стає опублікованою через CFG.MODERATION_SECONDS — навіть якщо
// застосунок закрили: при наступному запуску перевірка спрацює одразу.
function checkModeration() {
  const now = Date.now(), done = [];
  S.submissions.forEach(d => {
    if (d.status === "review" && now >= d.submittedAt + CFG.MODERATION_SECONDS * 1000) {
      d.status = "published"; d.publishedAt = now; done.push(d);
    }
  });
  if (done.length) {
    save(); syncMine();
    toast(done.length === 1 ? `«${done[0].title}» опубліковано в Каталозі` : `Опубліковано серіалів: ${done.length}`);
    if (UI.tab === "profile" || UI.tab === "catalog") render();
  }
  scheduleModeration();
}
function scheduleModeration() {
  clearTimeout(scheduleModeration._t);
  const next = S.submissions.filter(d => d.status === "review").map(d => d.submittedAt + CFG.MODERATION_SECONDS * 1000);
  if (next.length) scheduleModeration._t = setTimeout(checkModeration, Math.max(250, Math.min(...next) - Date.now()));
}
