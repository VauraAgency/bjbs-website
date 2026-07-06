// ---------- Theme toggle ----------
document.getElementById('theme-toggle').addEventListener('click', () => {
  const root = document.documentElement;
  root.classList.toggle('dark');
  localStorage.theme = root.classList.contains('dark') ? 'dark' : 'light';
});

// ---------- Content feed ----------
// Swap `url: '#'` with real links as content gets published.
const CONTENT = [
  { cat: 'video',   label: 'Video',       date: 'Coming soon', title: 'Bitcoin DCA: why it beats timing the market', desc: 'Dollar cost averaging, compound returns, and why BTC is the best-performing asset class.', hue: [39, 92], url: '#' },
  { cat: 'video',   label: 'Video',       date: 'Coming soon', title: 'The 3 types of traders', desc: 'Day trader wakes up panicking. Swing trader hits the gym. Long-term holder wakes up at 3pm.', hue: [239, 84], url: '#' },
  { cat: 'article', label: 'Article',     date: 'Coming soon', title: 'Entrepreneurship is lead gen, sales, and follow-up. Repeat.', desc: 'Every business has a formula — the fundamentals that apply from lawn care to real estate.', hue: [199, 89], url: '#' },
  { cat: 'podcast', label: 'Podcast',     date: 'Coming soon', title: 'Storytime with Benji: booking one-way flights', desc: 'I remember when I used to fear missing flights. Now I book one-ways. Tulum, Basel, and beyond.', hue: [280, 80], url: '#' },
  { cat: 'photo',   label: 'Photography', date: 'Coming soon', title: 'Skyscapes: a drone series over Minneapolis', desc: 'JPG Benji drone work — golden hour over the skyline and the lakes.', hue: [160, 84], url: '#' },
  { cat: 'article', label: 'Article',     date: 'Coming soon', title: 'Build systems so discipline isn’t required', desc: 'Procedures plus protocols equals proficiency — how I run multiple ventures without burning out.', hue: [24, 90], url: '#' },
  { cat: 'video',   label: 'Video',       date: 'Coming soon', title: 'Do you own or rent in Minnesota?', desc: 'Stopping strangers in Minneapolis to talk real estate — BensEstates in the wild.', hue: [335, 78], url: '#' },
  { cat: 'photo',   label: 'Photography', date: 'Coming soon', title: 'Moving photos: stills that breathe', desc: 'A photo and a short video of the same frame — an experiment in living images.', hue: [190, 90], url: '#' },
];

const grid = document.getElementById('articles-grid');
let feed = [...CONTENT];
let activeCat = 'all';

function thumb(c) {
  if (c.thumb) return `<div class="aspect-video rounded-xl mb-3 overflow-hidden"><img src="${c.thumb}" alt="" loading="lazy" class="w-full h-full object-cover transition group-hover:scale-105"></div>`;
  return `<div class="aspect-video rounded-xl mb-3 transition group-hover:opacity-90" style="background:linear-gradient(135deg,hsl(${c.hue[0]} ${c.hue[1]}% 55%),hsl(${(c.hue[0] + 60) % 360} ${c.hue[1]}% 45%))"></div>`;
}

function render(cat) {
  activeCat = cat;
  grid.innerHTML = feed.filter(c => cat === 'all' || c.cat === cat)
    .map(c => `
      <a href="${c.url}" ${c.url.startsWith('http') ? 'target="_blank" rel="noopener"' : ''} class="group block">
        ${thumb(c)}
        <p class="text-xs uppercase tracking-wide text-indigo-500 font-semibold mb-1">${c.label} · ${c.date}</p>
        <h3 class="font-bold text-lg leading-snug mb-1 text-slate-900 dark:text-slate-100 group-hover:text-indigo-500 transition">${c.title}</h3>
        <p class="text-sm text-slate-500 dark:text-slate-400">${c.desc}</p>
      </a>`).join('');
}
render('all');

// Live feed: data/videos.json is refreshed daily by GitHub Actions from the
// YouTube channel RSS. Real videos replace the placeholder video cards.
fetch('data/videos.json')
  .then(r => r.ok ? r.json() : [])
  .then(videos => {
    if (!videos.length) return;
    const longform = videos.filter(v => v.cat === 'video').slice(0, 6);
    const reels = videos.filter(v => v.cat === 'reel').slice(0, 6);
    feed = [...longform, ...reels, ...CONTENT.filter(c => c.cat !== 'video')];
    render(activeCat);
  })
  .catch(() => {});

document.getElementById('category-tabs').addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  document.querySelectorAll('#category-tabs button').forEach(b => b.className = 'tab px-3 py-1.5 rounded-full text-sm font-medium transition');
  btn.className = 'tab-active px-3 py-1.5 rounded-full text-sm font-medium transition';
  render(btn.dataset.cat);
});

// ---------- Ventures ----------
const VENTURES = [
  { name: 'Vaura', tag: 'Branding & Marketing Agency', desc: 'All-in-one digital branding and marketing — websites, social, and growth for local businesses.', url: 'https://popl.co/card/7kmqlK11/4/dash',
    icon: '<img src="images/vaura-black.png" alt="Vaura logo" class="w-10 h-10 object-contain dark:hidden"><img src="images/vaura-white.png" alt="Vaura logo" class="w-10 h-10 object-contain hidden dark:block">' },
  { name: '@BensEstates', tag: 'Real Estate', desc: 'Helping buyers, sellers, and investors win in the Minneapolis market — with content that keeps it real.', url: 'https://linktr.ee/bensestates',
    icon: '<span class="text-3xl leading-none">🏠</span>' },
  { name: '@JPGBenji', tag: 'Photography', desc: 'Portraits, real estate, events, and aerial work. Series projects: skyscapes, strangers, moving photos.', url: 'https://instagram.com/JPGBenji',
    icon: '<span class="text-3xl leading-none">📸</span>' },
  { name: 'Mow Bros MN', tag: 'Lawn Care', desc: 'North metro lawn care done right — proof that the fundamentals of business work in any industry.', url: 'https://share.google/I07Zv9gb9vr2mikUy',
    icon: '<img src="images/mowbros.png" alt="Mow Bros logo" class="w-10 h-10 object-contain rounded bg-white">' },
];

document.getElementById('ventures-grid').innerHTML = VENTURES.map(v => `
  <a href="${v.url}" target="_blank" rel="noopener" class="block p-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 transition bg-slate-50 dark:bg-slate-850">
    <div class="h-10 flex items-center mb-4">${v.icon}</div>
    <h3 class="font-semibold mb-0.5 text-slate-900 dark:text-slate-100">${v.name}</h3>
    <p class="text-xs uppercase tracking-wide text-indigo-500 font-semibold mb-2">${v.tag}</p>
    <p class="text-sm text-slate-500 dark:text-slate-400">${v.desc}</p>
  </a>`).join('');

// ---------- Social links (footer) ----------
// Fill in real profile URLs — icons render automatically.
const SOCIALS = [
  { name: 'Instagram', url: 'https://instagram.com/benjaminjbsmith', icon: '<path d="M8 0C5.8 0 5.6 0 4.7.1 3.9.1 3.3.2 2.8.4c-.5.2-.9.5-1.4.9-.4.5-.7.9-.9 1.4-.2.5-.3 1.1-.3 1.9C.1 5.6 0 5.8 0 8s0 2.4.1 3.3c0 .8.1 1.4.3 1.9.2.5.5.9.9 1.4.5.4.9.7 1.4.9.5.2 1.1.3 1.9.3.9.1 1.1.1 3.4.1s2.4 0 3.3-.1c.8 0 1.4-.1 1.9-.3.5-.2.9-.5 1.4-.9.4-.5.7-.9.9-1.4.2-.5.3-1.1.3-1.9.1-.9.1-1.1.1-3.3s0-2.4-.1-3.3c0-.8-.1-1.4-.3-1.9-.2-.5-.5-.9-.9-1.4-.5-.4-.9-.7-1.4-.9-.5-.2-1.1-.3-1.9-.3C10.4 0 10.2 0 8 0Zm0 1.4c2.2 0 2.4 0 3.2.1.8 0 1.2.2 1.5.3.4.1.6.3.9.6.3.3.5.5.6.9.1.3.3.7.3 1.5.1.8.1 1 .1 3.2s0 2.4-.1 3.2c0 .8-.2 1.2-.3 1.5-.1.4-.3.6-.6.9-.3.3-.5.5-.9.6-.3.1-.7.3-1.5.3-.8.1-1 .1-3.2.1s-2.4 0-3.2-.1c-.8 0-1.2-.2-1.5-.3-.4-.1-.6-.3-.9-.6-.3-.3-.5-.5-.6-.9-.1-.3-.3-.7-.3-1.5C1.4 10.4 1.4 10.2 1.4 8s0-2.4.1-3.2c0-.8.2-1.2.3-1.5.1-.4.3-.6.6-.9.3-.3.5-.5.9-.6.3-.1.7-.3 1.5-.3.8-.1 1-.1 3.2-.1Zm0 2.5a4.1 4.1 0 1 0 0 8.2 4.1 4.1 0 0 0 0-8.2Zm0 6.8a2.7 2.7 0 1 1 0-5.4 2.7 2.7 0 0 1 0 5.4Zm5.2-7a1 1 0 1 1-1.9 0 1 1 0 0 1 1.9 0Z"/>' },
  { name: 'TikTok', url: 'https://www.tiktok.com/@benjaminjbsmith', icon: '<path d="M11.4 0h-2.7v10.8a2.3 2.3 0 1 1-2.3-2.3c.2 0 .5 0 .7.1V5.8a5 5 0 1 0 4.3 5V5.4A6.3 6.3 0 0 0 15 6.6V4a3.9 3.9 0 0 1-3.6-4Z"/>' },
  { name: 'YouTube', url: 'https://www.youtube.com/@benjaminjbsmith', icon: '<path d="M15.7 4.1a2 2 0 0 0-1.4-1.4C13 2.3 8 2.3 8 2.3s-5 0-6.3.4A2 2 0 0 0 .3 4.1C0 5.4 0 8 0 8s0 2.6.3 3.9a2 2 0 0 0 1.4 1.4c1.3.4 6.3.4 6.3.4s5 0 6.3-.4a2 2 0 0 0 1.4-1.4C16 10.6 16 8 16 8s0-2.6-.3-3.9ZM6.4 10.4V5.6L10.6 8l-4.2 2.4Z"/>' },
  { name: 'Facebook', url: 'https://www.facebook.com/benjaminjbsmith', icon: '<path d="M16 8a8 8 0 1 0-9.25 7.9v-5.59H4.72V8h2.03V6.24c0-2 1.19-3.11 3.02-3.11.88 0 1.79.16 1.79.16v1.97h-1.01c-.99 0-1.3.62-1.3 1.25V8h2.22l-.36 2.31H9.25v5.59A8 8 0 0 0 16 8Z"/>' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/benjaminjbsmith', icon: '<path d="M3.6 1.8a1.8 1.8 0 1 1-3.6 0 1.8 1.8 0 0 1 3.6 0ZM.2 5.4h3.2V16H.2V5.4Zm5.4 0h3v1.5h.1c.4-.8 1.5-1.7 3-1.7 3.2 0 3.8 2.1 3.8 4.9V16h-3.2v-5.2c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V16H5.6V5.4Z"/>' },
];

document.getElementById('social-links').innerHTML = SOCIALS.map(s => `
  <a href="${s.url}" class="hover:text-indigo-500 transition" aria-label="${s.name}" title="${s.name}">
    <svg class="w-4 h-4 fill-current" viewBox="0 0 16 16">${s.icon}</svg>
  </a>`).join('');

// ---------- Subscribe form → Google Form ("BJBS Subscribe") → Sheets ----------
const FORM_ENDPOINT = 'https://docs.google.com/forms/d/e/1FAIpQLScI7z61fGvj_lMK-UTAmsb6dZ0inv-jbT1v8ocoo64r1m1GWw/formResponse';
const FORM_EMAIL_FIELD = 'entry.588412737';

document.getElementById('subscribe-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button');
  const body = new URLSearchParams({ [FORM_EMAIL_FIELD]: form.email.value.trim() });
  fetch(FORM_ENDPOINT, { method: 'POST', body, mode: 'no-cors' })
    .then(() => { btn.textContent = 'Subscribed ✓'; form.email.value = ''; })
    .catch(() => { btn.textContent = 'Try again'; });
});

// ---------- Community avatars ----------
const avatars = document.getElementById('community-avatars');
const hues = [10, 60, 120, 200, 260, 320];
avatars.innerHTML = hues.map((h, i) => `
  <div class="w-10 h-10 rounded-full ring-2 ring-white dark:ring-slate-850 flex items-center justify-center text-white text-sm font-bold"
       style="background:hsl(${h} 70% 50%)">${String.fromCharCode(65 + i)}</div>`).join('');
