// Theme toggle + footer live in js/site.js (shared across all pages).

// ---------- Content feed ----------
// Scoped: index.html runs its own inline script in the same global
// scope, so nothing in here may leak a top-level binding.
(function () {
  // "Latest content" is one scrollable row mixing every long-form type, newest
  // first. Short-form gets its own row below it, because 19 reels would otherwise
  // swamp a feed of 4 articles and 7 reads.
  const FEED_SOURCES = [
    { url: 'data/articles.json',    cat: 'article', page: 'articles.html' },
    { url: 'data/daily-reads.json', cat: 'read',    page: 'reads.html' },
  ];

  // Type name shown on every card, so a mixed feed stays readable.
  const CAT_NAMES  = { article: 'Article', read: 'Daily Read', video: 'Video', reel: 'Short' };
  const CAT_ORDER  = ['article', 'read', 'video'];
  const CAT_LABELS = { article: 'Articles', read: 'Daily Reads', video: 'Videos' };

  const grid      = document.getElementById('articles-grid');
  const tabsWrap  = document.getElementById('category-tabs');
  const shortsRow = document.getElementById('shorts-row');

  let feed = [];
  let activeCat = 'all';

  const feedDate = (iso) => {
    if (!iso) return '';
    const d = new Date(iso + 'T00:00:00Z');
    return isNaN(d) ? iso : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
  };

  // Newest first. Dates are ISO (YYYY-MM-DD) across every feed, so a plain string
  // compare is a correct chronological sort.
  const byNewest = (arr) => [...arr].sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));

  // Referenced from inline onerror="" attributes, so it has to be global.
  window.FEED_FALLBACK = "<div class='w-full h-full bg-gradient-to-br from-btc/25 via-indigo-500/15 to-btc/10 dark:from-btc/30 dark:via-indigo-500/20 dark:to-btc/15 flex items-center justify-center'><span class='text-4xl opacity-70'>✦</span></div>";

  function feedThumb(c, ratio) {
    const inner = c.thumb
      ? `<img src="${c.thumb}" alt="" loading="lazy" class="w-full h-full object-cover transition group-hover:scale-105" onerror="this.parentNode.innerHTML=FEED_FALLBACK">`
      : FEED_FALLBACK;
    return `<div class="${ratio} rounded-xl mb-3 overflow-hidden">${inner}</div>`;
  }

  function cardHtml(c, ratio = 'aspect-video') {
    const ext = /^https?:/.test(c.url);
    return `
      <a href="${c.url}" ${ext ? 'target="_blank" rel="noopener"' : ''} class="card group block p-4">
        ${feedThumb(c, ratio)}
        <p class="text-xs uppercase tracking-wide text-indigo-500 font-semibold mb-1">${CAT_NAMES[c.cat] || c.cat}<span class="text-slate-400 dark:text-slate-500 font-medium normal-case tracking-normal">${c.topic ? ` · ${c.topic}` : ''}${c.date ? ` · ${feedDate(c.date)}` : ''}</span></p>
        <h3 class="font-bold text-lg leading-snug mb-1 text-slate-900 dark:text-slate-100 group-hover:text-indigo-500 transition line-clamp-2">${c.title}</h3>
        ${c.desc ? `<p class="text-sm text-slate-500 dark:text-slate-400 line-clamp-3">${c.desc}</p>` : ''}
      </a>`;
  }

  function renderTabs() {
    const present = [...new Set(feed.map(c => c.cat))];
    const ordered = [
      ...CAT_ORDER.filter(c => present.includes(c)),
      ...present.filter(c => !CAT_ORDER.includes(c)).sort(),
    ];
    const counts = c => feed.filter(x => x.cat === c).length;
    const btn = (cat, text) =>
      `<button data-cat="${cat}" aria-pressed="${activeCat === cat}" class="${activeCat === cat ? 'tab-active' : 'tab'} px-3 py-1.5 rounded-full text-sm font-medium transition">${text}</button>`;

    tabsWrap.innerHTML = [
      btn('all', `All <span class="opacity-60">${feed.length}</span>`),
      ...ordered.map(c => btn(c, `${CAT_LABELS[c] || c} <span class="opacity-60">${counts(c)}</span>`)),
    ].join('');
  }

  function render() {
    const items = feed.filter(c => activeCat === 'all' || c.cat === activeCat);
    grid.innerHTML = items.length
      ? items.map(c => cardHtml(c)).join('')
      : '<p class="text-sm text-slate-500 dark:text-slate-400">Nothing here yet — check back soon.</p>';
    grid.scrollLeft = 0; // a filtered row should start at the beginning
  }

  const rowSkeleton = (n) => Array.from({ length: n }).map(() => `
    <div class="p-2">
      <div class="skeleton aspect-video mb-3"></div>
      <div class="skeleton h-3 w-1/3 mb-2 rounded-full"></div>
      <div class="skeleton h-5 w-full mb-1 rounded-full"></div>
      <div class="skeleton h-3 w-2/3 rounded-full"></div>
    </div>`).join('');

  grid.innerHTML = rowSkeleton(5);
  if (shortsRow) shortsRow.innerHTML = rowSkeleton(5);

  const getJson = (url) => fetch(url).then(r => (r.ok ? r.json() : [])).catch(() => []);

  Promise.all([
    ...FEED_SOURCES.map(src =>
      getJson(src.url).then(items => items.map(i => ({
        cat: src.cat,
        topic: i.category || '',
        date: i.date,
        title: i.title,
        desc: i.excerpt,
        thumb: i.image || '',
        url: src.page,
      })))
    ),
    // videos.json carries cat ('video' | 'reel'), thumb and url. Long-form
    // entries put the topic in `label`; shorts just repeat the type there.
    getJson('data/videos.json').then(items => items.map(v => ({
      cat: v.cat,
      topic: /^(video|reel|short)$/i.test(v.label || '') ? '' : (v.label || ''),
      date: v.date,
      title: v.title,
      desc: v.desc,
      thumb: v.thumb,
      url: v.url,
    }))),
  ]).then(groups => {
    const all = groups.flat().filter(c => c.title);

    feed = byNewest(all.filter(c => c.cat !== 'reel'));
    renderTabs();
    render();

    if (shortsRow) {
      const shorts = byNewest(all.filter(c => c.cat === 'reel'));
      shortsRow.innerHTML = shorts.length
        ? shorts.map(c => cardHtml(c, 'aspect-short')).join('')
        : '<p class="text-sm text-slate-500 dark:text-slate-400">Shorts coming soon...</p>';
    }
  });

  tabsWrap.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-cat]');
    if (!btn) return;
    activeCat = btn.dataset.cat;
    renderTabs();
    render();
  });
})();

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
  <a href="${v.url}" target="_blank" rel="noopener" class="card block p-5 rounded-xl">
    <div class="h-10 flex items-center mb-4">${v.icon}</div>
    <h3 class="font-semibold mb-0.5 text-slate-900 dark:text-slate-100">${v.name}</h3>
    <p class="text-xs uppercase tracking-wide text-indigo-500 font-semibold mb-2">${v.tag}</p>
    <p class="text-sm text-slate-500 dark:text-slate-400">${v.desc}</p>
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
    .then(() => { btn.textContent = 'Subscribed ✓'; btn.classList.add('text-success'); form.email.value = ''; })
    .catch(() => { btn.textContent = 'Try again'; btn.classList.add('text-error'); });
});

// ---------- Community avatars ----------
const avatars = document.getElementById('community-avatars');
const hues = [10, 60, 120, 200, 260, 320];
avatars.innerHTML = hues.map((h, i) => `
  <div class="w-10 h-10 rounded-full ring-2 ring-white dark:ring-slate-850 flex items-center justify-center text-white text-sm font-bold"
       style="background:hsl(${h} 70% 50%)">${String.fromCharCode(65 + i)}</div>`).join('');
