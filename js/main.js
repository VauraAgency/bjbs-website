// ---------- Theme toggle ----------
document.getElementById('theme-toggle').addEventListener('click', () => {
  const root = document.documentElement;
  root.classList.toggle('dark');
  localStorage.theme = root.classList.contains('dark') ? 'dark' : 'light';
});

// ---------- Articles (placeholder data — swap with your real posts) ----------
const ARTICLES = [
  { cat: 'coding',    date: 'Jun 24, 2026', title: 'How I structure every new TypeScript project', desc: 'The folder layout, tooling, and conventions I reach for on day one of every build.', hue: [239, 84] },
  { cat: 'startups',  date: 'Jun 12, 2026', title: 'Pricing your first SaaS: lessons from 3 launches', desc: 'What actually moved the needle when I stopped guessing and started testing prices.', hue: [199, 89] },
  { cat: 'tutorials', date: 'May 30, 2026', title: 'Build a realtime dashboard with server-sent events', desc: 'Skip the websocket complexity — SSE gets you live updates with a fraction of the code.', hue: [160, 84] },
  { cat: 'indie',     date: 'May 18, 2026', title: 'One year of building in public: the honest numbers', desc: 'Revenue, traffic, churn, and everything I would do differently starting over.', hue: [280, 80] },
  { cat: 'coding',    date: 'May 02, 2026', title: 'Stop writing brittle tests — test behavior, not code', desc: 'A practical guide to tests that survive refactors and actually catch regressions.', hue: [24, 90] },
  { cat: 'tutorials', date: 'Apr 20, 2026', title: 'Deploy a static site to GitHub Pages in 5 minutes', desc: 'From empty repo to live URL, with a custom domain and HTTPS thrown in for free.', hue: [335, 78] },
  { cat: 'startups',  date: 'Apr 08, 2026', title: 'Finding your first 100 users without an audience', desc: 'The unglamorous channels that actually worked when nobody knew who I was.', hue: [45, 93] },
  { cat: 'indie',     date: 'Mar 27, 2026', title: 'The maker schedule that finally stuck for me', desc: 'How I balance a full-time maker life without burning out — deep work blocks and all.', hue: [190, 90] },
];

const grid = document.getElementById('articles-grid');

function thumb(hue) {
  // decorative gradient thumbnail (no external images needed)
  return `<div class="aspect-video rounded-xl mb-3 transition group-hover:opacity-90" style="background:linear-gradient(135deg,hsl(${hue[0]} ${hue[1]}% 55%),hsl(${(hue[0] + 60) % 360} ${hue[1]}% 45%))"></div>`;
}

function render(cat) {
  grid.innerHTML = ARTICLES.filter(a => cat === 'all' || a.cat === cat)
    .map(a => `
      <a href="#" class="group block">
        ${thumb(a.hue)}
        <p class="text-xs uppercase tracking-wide text-indigo-500 font-semibold mb-1">${a.date}</p>
        <h3 class="font-bold text-lg leading-snug mb-1 text-slate-900 dark:text-slate-100 group-hover:text-indigo-500 transition">${a.title}</h3>
        <p class="text-sm text-slate-500 dark:text-slate-400">${a.desc}</p>
      </a>`).join('');
}
render('all');

// ---------- Category tabs ----------
document.getElementById('category-tabs').addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  document.querySelectorAll('#category-tabs button').forEach(b => b.className = 'tab px-3 py-1.5 rounded-full text-sm font-medium transition');
  btn.className = 'tab-active px-3 py-1.5 rounded-full text-sm font-medium transition';
  render(btn.dataset.cat);
});

// ---------- Community avatars ----------
const avatars = document.getElementById('community-avatars');
const hues = [10, 60, 120, 200, 260, 320];
avatars.innerHTML = hues.map((h, i) => `
  <div class="w-10 h-10 rounded-full ring-2 ring-white dark:ring-slate-850 flex items-center justify-center text-white text-sm font-bold"
       style="background:hsl(${h} 70% 50%)">${String.fromCharCode(65 + i)}</div>`).join('');
