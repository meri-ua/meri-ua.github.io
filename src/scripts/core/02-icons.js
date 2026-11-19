/* 02-icons.js — Іконки в стилі SF Symbols і значок монети */

// ---------- Іконки (у стилі SF Symbols) ----------
const svg = (d, cls = "i") => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
const ICONS = {
  foryou: svg('<rect x="4" y="2.5" width="16" height="19" rx="4"/><path d="M10 9l5 3-5 3z" fill="currentColor"/>'),
  catalog: svg('<rect class="fillable" x="3.5" y="3.5" width="7" height="7" rx="2"/><rect class="fillable" x="13.5" y="3.5" width="7" height="7" rx="2"/><rect class="fillable" x="3.5" y="13.5" width="7" height="7" rx="2"/><rect class="fillable" x="13.5" y="13.5" width="7" height="7" rx="2"/>'),
  my: svg('<path class="fillable" d="M6 3.5h12a1 1 0 011 1v16l-7-4.2-7 4.2v-16a1 1 0 011-1z"/>'),
  coins: svg('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5v9M9.5 10a2.5 2 0 015 0c0 2.6-5 1.4-5 4a2.5 2 0 005 0" />'),
  profile: svg('<circle class="fillable" cx="12" cy="8" r="4"/><path class="fillable" d="M4 20.5c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5z"/>'),
  heart: svg('<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0112 7a4.3 4.3 0 017.5 2.8C19.5 15.4 12 20 12 20z"/>'),
  bookmark: svg('<path d="M6.5 3.5h11a1 1 0 011 1v16l-6.5-4-6.5 4v-16a1 1 0 011-1z"/>'),
  list: svg('<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1" fill="currentColor"/><circle cx="4.5" cy="12" r="1" fill="currentColor"/><circle cx="4.5" cy="18" r="1" fill="currentColor"/>'),
  next: svg('<path d="M5 5.5l9 6.5-9 6.5z" fill="currentColor"/><path d="M18.5 5v14"/>'),
  close: svg('<path d="M6 6l12 12M18 6L6 18"/>'),
  back: svg('<path d="M15 5l-7 7 7 7"/>'),
  chev: svg('<path d="M9 5l7 7-7 7"/>'),
  play: svg('<path d="M7 4.5l13 7.5-13 7.5z"/>'),
  lock: svg('<rect x="5" y="10.5" width="14" height="10" rx="2.5" fill="currentColor" stroke="none"/><path d="M8 10.5V7.5a4 4 0 018 0v3"/>'),
  search: svg('<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L20 20"/>'),
  tv: svg('<rect x="3" y="5" width="18" height="12" rx="2.5"/><path d="M8 20.5h8"/>'),
  sparkle: svg('<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>'),
  gift: svg('<rect x="3.5" y="8.5" width="17" height="4" rx="1"/><path d="M5 12.5v8h14v-8M12 8.5v12M12 8.5S10.5 4 8 4.5 7 8.5 12 8.5zM12 8.5s1.5-4.5 4-4 1 4-4 4z"/>'),
  film: svg('<rect x="3.5" y="4" width="17" height="16" rx="2.5"/><path d="M7.5 4v16M16.5 4v16M3.5 9h4M3.5 15h4M16.5 9h4M16.5 15h4"/>'),
  palette: svg('<path d="M12 3.5a8.5 8.5 0 100 17c1.2 0 1.6-1 1-1.9-.7-1 0-2.1 1.2-2.1H17a3.5 3.5 0 003.5-3.5c0-5.3-3.8-9.5-8.5-9.5z"/><circle cx="7.5" cy="11" r="1.2" fill="currentColor"/><circle cx="10.5" cy="7.5" r="1.2" fill="currentColor"/><circle cx="15" cy="7.8" r="1.2" fill="currentColor"/>'),
  clock: svg('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'),
  captions: svg('<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M10.5 10.2a2 2 0 100 3.6M16.5 10.2a2 2 0 100 3.6"/>'),
  hand: svg('<path d="M12 21a7 7 0 01-7-7V9.5a1.5 1.5 0 013 0V12M8 12V5.5a1.5 1.5 0 013 0V11M11 11V4.5a1.5 1.5 0 013 0V11M14 11V6.5a1.5 1.5 0 013 0V14a7 7 0 01-5 7"/>'),
  gear: svg('<circle cx="12" cy="12" r="3"/><path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7"/><circle cx="12" cy="12" r="6.6"/>'),
  check: svg('<path d="M6 12.5l4 4 8-9"/>'),
  grid: svg('<rect x="3.5" y="3.5" width="17" height="17" rx="2.5"/><path d="M9.2 3.5v17M14.8 3.5v17M3.5 9.2h17M3.5 14.8h17"/>'),
  info: svg('<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5"/><circle cx="12" cy="7.8" r="1" fill="currentColor" stroke="none"/>'),
  share: svg('<path d="M12 3.5v11M8 7.5l4-4 4 4"/><path d="M7 11H5.5v9.5h13V11H17"/>'),
  pin: svg('<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0113 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>'),
  vote: svg('<path d="M4 20.5h16M6 16.5V10M12 16.5V5M18 16.5v-4"/>')
};
const COIN = `<svg class="coin" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="var(--coin)"/><circle cx="12" cy="12" r="7" fill="none" stroke="rgba(0,0,0,.18)" stroke-width="1.5"/><path d="M12 7.5v9M9.8 10.2c0-1.1 1-1.7 2.2-1.7s2.2.6 2.2 1.6c0 2.4-4.4 1.2-4.4 3.8 0 1 1 1.6 2.2 1.6s2.2-.6 2.2-1.7" fill="none" stroke="rgba(0,0,0,.45)" stroke-width="1.6" stroke-linecap="round"/></svg>`;

