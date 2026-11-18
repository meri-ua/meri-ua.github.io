# CODEMAP — карта коду

> **Цей файл створює скрипт. Руками не правити** — зміни зітруться.
> Перебудувати: `npm run map`. Чи не відстала карта — скаже `npm run check`.
>
> Карта веде в `src/`, а не в `dist/index.html`: `dist` перезбирається щоразу.
> **Навіщо:** спершу карта — потім читати лише потрібний файл.

## Огляд

| Метрика | Значення |
|---|---|
| Файлів JS | 16 |
| Файлів CSS | 2 |
| Сутностей верхнього рівня | 71 |

Позначки: `name()` — функція, `name` — значення; число — рядок у файлі.

## Файли

### `src/data/series.js` — 120 рядків

`GENRES`:3, `SERIES`:5, `ADS`:105, `COIN_PACKS`:114

### `src/scripts/core/01-config.js` — 24 рядків
_Налаштування економіки й варіанти дизайну_

`CFG`:4, `VARIANTS`:18

### `src/scripts/core/02-icons.js` — 33 рядків
_Іконки в стилі SF Symbols і значок монети_

`svg`():4, `ICONS`:5, `COIN`:31

### `src/scripts/core/03-state.js` — 41 рядків
_Стан застосунку: що зберігається в localStorage_

`STORE_KEY`:4, `ymdLocal`():7, `today`():9, `DEFAULT_STATE`():10, `S`:23, `params`:28, `EMBED`:29, `URL_VARIANT`:30, `save`():31, `UI`:33, `TITLES`:34, `TAB_NAMES`:35, `applyVariant`():37

### `src/scripts/core/04-utils.js` — 39 рядків
_Дрібні помічники: пошук, екранування, постери_

`$`():4, `byId`():5, `esc`():6, `grad`():7, `fmtViews`():8, `hash`():9, `toast`():11, `updateCoins`():15, `resetAdsIfNewDay`():17, `isUnlocked`():21, `watchedOf`():22, `toggleIn`():23, `posterHTML`():25, `itemHTML`():32, `wideHTML`():34, `sectionHead`():36, `rowIco`():37

### `src/scripts/core/05-recommend.js` — 27 рядків
_Рекомендації для стрічки «Для тебе»_

`recommend`():4

### `src/scripts/core/06-nav.js` — 25 рядків
_Навігація між вкладками і головний render()_

`renderTabbar`():4, `go`():8, `openDetail`():12, `render`():14

### `src/scripts/core/10-foryou.js` — 25 рядків
_Екран «Для тебе»: вертикальна стрічка_

`renderForYou`():4

### `src/scripts/core/11-catalog.js` — 37 рядків
_Екран «Каталог»: пошук, жанри, підбірки_

`renderCatalog`():4

### `src/scripts/core/12-my.js` — 31 рядків
_Екран «Медіатека»: продовження, збережене, голоси_

`renderMy`():4

### `src/scripts/core/13-coins.js` — 95 рядків
_Екран «Монети»: реклама, бонус, покупки_

`adStatus`():4, `renderCoins`():10, `watchAd`():50, `closeModal`():79, `buyPack`():81

### `src/scripts/core/14-profile.js` — 63 рядків
_Екран «Профіль»: Meri+, оформлення, налаштування_

`renderProfile`():4

### `src/scripts/core/15-detail.js` — 44 рядків
_Сторінка серіалу і голосування_

`voteHTML`():4, `renderDetail`():20

### `src/scripts/core/20-player.js` — 151 рядків
_Плеєр: серії, замок, фінал, свайпи_

`P`:4, `openPlayer`():6, `closePlayer`():11, `startEpisode`():17, `renderPlayer`():29, `play`():57, `togglePlay`():66, `endEpisode`():70, `nextEp`():80, `prevEp`():84, `overlay`():86, `showLock`():91, `showFinale`():113, `castVote`():125, `touchY`:130, `wheelLock`:138

### `src/scripts/core/30-events.js` — 27 рядків
_Один обробник кліків на весь застосунок_


### `src/scripts/core/99-start.js` — 13 рядків
_Старт: усе готово — малюємо перший екран_


### `src/styles/01-base.css` — 332 рядків

Навігаційна панель з великим заголовком:58 · Таб-бар (матеріал з розмиттям):75 · Типографіка:87 · Кнопки:96 · Згруповані списки та картки:110 · Постери:146 · Стрічка «Для тебе»:169 · Продовжити перегляд:193 · Монети:205 · Профіль:225 · Сторінка серіалу:235 · Плеєр:256 · Голосування:298 · Аркуш (sheet):306

### `src/styles/02-variants.css` — 112 рядків

Варіант B: Cinema (у дусі Apple TV / Music):5 · Варіант C: Liquid Glass (скло, плаваючий таб-бар):42
