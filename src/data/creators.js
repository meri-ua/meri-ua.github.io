// Автори та студії — сторінки в стилі Instagram (16-creator.js).
// Усі вигадані. У продукті це прийде з API разом із кабінетом творця.
// type: originals — наші серіали, studio — студія, indie — незалежний автор, ai — AI-студія.
// followers — стартова кількість підписників (поки немає сервера й справжніх акаунтів).
const CREATOR_TYPES = { originals: "Meri Originals", studio: "Студія", indie: "Незалежний автор", ai: "AI-студія" };

const CREATORS = [
  {
    id: "originals", name: "Meri Originals", handle: "meri.originals", type: "originals",
    city: "Київ", since: 2026, verified: true, followers: 48200, emoji: "M", colors: ["#ffd500", "#0057b7"],
    bio: "Власні серіали Meri: українські актори, професійна озвучка, історії, які впізнаєш."
  },
  {
    id: "ai-studio", name: "Meri AI Studio", handle: "meri.ai", type: "ai",
    city: "Онлайн", since: 2026, verified: true, followers: 9300, emoji: "🤖", colors: ["#8e2de2", "#4a00e0"],
    bio: "Експериментальні серіали: сценарій, голоси й переклад з допомогою AI. Тестуємо нові формати швидко."
  },
  {
    id: "chorne-more", name: "Студія «Чорне море»", handle: "chorne.more", type: "studio",
    city: "Одеса", since: 2026, verified: true, followers: 15700, emoji: "⚓", colors: ["#0f2027", "#2c5364"],
    bio: "Детективи з присмаком солі. Порт, туман і люди, які завжди щось приховують."
  },
  {
    id: "sich", name: "Студія «Січ Продакшн»", handle: "sich.production", type: "studio",
    city: "Запоріжжя", since: 2026, verified: true, followers: 6800, emoji: "⚔", colors: ["#5f2c82", "#49a09d"],
    bio: "Історичні драми про козацьку добу: листи, печатки, кохання і вибір між серцем та обов'язком."
  },
  {
    id: "teplahata", name: "Студія «Тепла хата»", handle: "teplahata", type: "studio",
    city: "Полтава", since: 2026, verified: true, followers: 12400, emoji: "🏡", colors: ["#cb2d3e", "#ef473a"],
    bio: "Сімейні комедії про те, що болить і смішить кожну українську родину. Знімаємо з любов'ю до борщу 🍲"
  },
  {
    id: "persha-parta", name: "Студія «Перша парта»", handle: "persha.parta", type: "studio",
    city: "Львів", since: 2026, verified: false, followers: 7100, emoji: "🔔", colors: ["#ee9ca7", "#ffdde1"],
    bio: "Молодіжні історії про перше кохання, дружбу і сміливість бути собою."
  },
  {
    id: "hutsul", name: "Олекса Гуцул", handle: "o.hutsul", type: "indie",
    city: "Яремче", since: 2026, verified: false, followers: 3900, emoji: "🏔", colors: ["#134e5e", "#71b280"],
    bio: "Незалежний режисер. Знімаю трилери в Карпатах — там тиша говорить голосніше за слова."
  },
  {
    id: "bondar", name: "Катерина Бондар", handle: "k.bondar", type: "indie",
    city: "Дніпро", since: 2026, verified: false, followers: 2600, emoji: "💼", colors: ["#232526", "#414345"],
    bio: "Сценаристка й режисерка. Пишу про владу, гроші й ціну чесного імені."
  }
];
