# CODEMAP — карта коду

> **Цей файл створює скрипт. Руками не правити** — зміни зітруться.
> Перебудувати: `npm run map`. Чи не відстала карта — скаже `npm run check`.
>
> Карта веде в `src/`, а не в `dist/index.html`: `dist` перезбирається щоразу.
> **Навіщо:** спершу карта — потім читати лише потрібний файл.

## Огляд

| Метрика | Значення |
|---|---|
| Файлів JS | 20 |
| Файлів CSS | 2 |
| Сутностей верхнього рівня | 118 |

Позначки: `name()` — функція, `name` — значення; число — рядок у файлі.

## Файли

### `src/data/creators.js` — 49 рядків

`CREATOR_TYPES`:5, `CREATORS`:7

### `src/data/series.js` — 120 рядків

`GENRES`:3, `SERIES`:5, `ADS`:105, `COIN_PACKS`:114

### `src/scripts/core/01-config.js` — 26 рядків
_Налаштування економіки й варіанти дизайну_

`CFG`:4, `VARIANTS`:20

### `src/scripts/core/02-icons.js` — 39 рядків
_Іконки в стилі SF Symbols і значок монети_

`svg`():4, `ICONS`:5, `COIN`:37

### `src/scripts/core/03-state.js` — 49 рядків
_Стан застосунку: що зберігається в localStorage_

`STORE_KEY`:4, `ymdLocal`():7, `today`():9, `DEFAULT_STATE`():10, `S`:27, `params`:32, `EMBED`:33, `URL_VARIANT`:34, `save`():35, `UI`:39, `TITLES`:42, `TAB_NAMES`:43, `applyVariant`():45

### `src/scripts/core/04-utils.js` — 65 рядків
_Дрібні помічники: пошук, екранування, постери_

`$`():4, `byId`():5, `creatorById`():6, `creatorOf`():7, `seriesOf`():8, `esc`():9, `grad`():11, `fmtViews`():12, `ratingText`():14, `hash`():15, `toast`():17, `updateCoins`():21, `resetAdsIfNewDay`():23, `freeEpsOf`():28, `isUnlocked`():29, `watchedOf`():30, `toggleIn`():31, `posterHTML`():33, `itemHTML`():40, `wideHTML`():42, `sectionHead`():44, `creatorStats`():46, `fmtCount`():51, `plural`():52, `avatarHTML`():58, `verifiedHTML`():62, `rowIco`():63

### `src/scripts/core/05-recommend.js` — 30 рядків
_Рекомендації для стрічки «Для тебе»_

`recommend`():4

### `src/scripts/core/06-nav.js` — 51 рядків
_Навігація між вкладками і головний render()_

`ACTIONS`:5, `renderTabbar`():6, `go`():10, `pushScreen`():15, `openDetail`():19, `openCreator`():20, `openPage`():27, `goBack`():32, `render`():37

### `src/scripts/core/10-foryou.js` — 25 рядків
_Екран «Для тебе»: вертикальна стрічка_

`renderForYou`():4

### `src/scripts/core/11-catalog.js` — 39 рядків
_Екран «Каталог»: пошук, жанри, підбірки_

`renderCatalog`():4

### `src/scripts/core/12-my.js` — 39 рядків
_Екран «Медіатека»: продовження, збережене, голоси_

`renderMy`():4

### `src/scripts/core/13-coins.js` — 95 рядків
_Екран «Монети»: реклама, бонус, покупки_

`adStatus`():4, `renderCoins`():10, `watchAd`():50, `closeModal`():79, `buyPack`():81

### `src/scripts/core/14-profile.js` — 64 рядків
_Налаштування (⚙︎ у профілі): Meri+, оформлення, відтворення, історія_

`renderSettings`():4

### `src/scripts/core/15-detail.js` — 44 рядків
_Сторінка серіалу і голосування_

`voteHTML`():4, `renderDetail`():20

### `src/scripts/core/16-creator.js` — 101 рядків
_Сторінка автора чи студії в стилі Instagram_

`renderCreator`():6, `toggleFollow`():60, `shareCreator`():68, `creatorsStoriesHTML`():82, `creatorRowHTML`():91

### `src/scripts/core/17-me.js` — 168 рядків
_Ваш профіль у стилі TikTok, «Редагувати профіль» і ваші серіали в каталозі_

`PALETTE`:5, `ME_EMOJI`:7, `meName`():9, `meHandle`():10, `meColors`():11, `meAvatarHTML`():12, `pageBarHTML`():18, `syncMine`():27, `seriesFromSubmission`():37, `SUB_STATUS`:48, `renderProfile`():50, `renderEditMe`():124, `cleanHandle`():148

### `src/scripts/core/18-submit.js` — 185 рядків
_Подача серіалу: 4 кроки, чернетка, модерація, публікація в каталог_

`STEP_NAMES`:7, `SUB_EMOJI`:8, `VOICES`:9, `draft`():11, `newSubmission`():13, `stepError`():24, `renderSubmit`():39, `downscaleImage`():112, `onSubmitField`():127, `pickDraft`():140, `checkModeration`():166, `scheduleModeration`():180

### `src/scripts/core/20-player.js` — 151 рядків
_Плеєр: серії, замок, фінал, свайпи_

`P`:4, `openPlayer`():6, `closePlayer`():11, `startEpisode`():17, `renderPlayer`():29, `play`():57, `togglePlay`():66, `endEpisode`():70, `nextEp`():80, `prevEp`():84, `overlay`():86, `showLock`():91, `showFinale`():113, `castVote`():125, `touchY`:130, `wheelLock`:138

### `src/scripts/core/30-events.js` — 34 рядків
_Один обробник кліків на весь застосунок_


### `src/scripts/core/99-start.js` — 16 рядків
_Старт: усе готово — малюємо перший екран_


### `src/styles/01-base.css` — 441 рядків

Навігаційна панель з великим заголовком:58 · Таб-бар (матеріал з розмиттям):75 · Типографіка:87 · Кнопки:96 · Згруповані списки та картки:110 · Постери:146 · Стрічка «Для тебе»:169 · Продовжити перегляд:193 · Монети:205 · Профіль:225 · Сторінка серіалу:235 · Плеєр:256 · Голосування:298 · Аркуш (sheet):306 · Сторінка автора (Instagram-стиль):333 · Мій профіль і подача серіалу:383

### `src/styles/02-variants.css` — 112 рядків

Варіант B: Cinema (у дусі Apple TV / Music):5 · Варіант C: Liquid Glass (скло, плаваючий таб-бар):42
