// Shared chrome for every page: glass top nav, mobile menu, theme toggle, footer.
(function () {
  // Apply saved theme before paint
  if (localStorage.theme === 'light') document.documentElement.classList.remove('dark');

  const NAV = [
    { href: 'index.html', label: 'Home' },
    { href: 'about.html', label: 'About' },
    { href: 'projects.html', label: 'Projects' },
    {
      label: 'Content', children: [
        { href: 'articles.html', label: 'Articles' },
        { href: 'videos.html', label: 'Videos' },
        { href: 'reads.html', label: 'Daily Reads' },
        { href: 'podcast.html', label: 'Podcast' },
      ],
    },
    { href: 'crypto.html', label: 'Crypto' },
    { href: 'invest.html', label: 'Invest' },
    { href: 'assets.html', label: 'Free Assets' },
    { href: 'community.html', label: 'Community' },
    { href: 'contact.html', label: 'Contact' },
  ];

  const here = location.pathname.split('/').pop() || 'index.html';

  function link(item) {
    const active = item.href === here ? ' active' : '';
    return `<a href="${item.href}" class="nav-item${active}">${item.label}</a>`;
  }

  const desktopItems = NAV.map(item => {
    if (!item.children) return link(item);
    const open = item.children.some(c => c.href === here);
    return `
      <div class="relative group">
        <button class="nav-item${open ? ' active' : ''} flex items-center gap-1">${item.label}
          <svg class="w-3 h-3 fill-current opacity-60" viewBox="0 0 12 12"><path d="M2 4l4 4 4-4"/></svg>
        </button>
        <div class="absolute left-0 top-full pt-2 hidden group-hover:block">
          <div class="glass rounded-2xl p-2 flex flex-col min-w-[10rem]">
            ${item.children.map(c => `<a href="${c.href}" class="nav-item px-3 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10${c.href === here ? ' active' : ''}">${c.label}</a>`).join('')}
          </div>
        </div>
      </div>`;
  }).join('');

  const mobileItems = NAV.flatMap(item => item.children ? item.children : [item])
    .map(link).join('');

  const nav = document.createElement('header');
  nav.id = 'site-nav';
  nav.innerHTML = `
    <div class="glass">
      <div class="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
        <a href="index.html" class="flex items-center gap-3 shrink-0">
          <span class="w-9 h-9 rounded-full bg-gradient-to-tr from-btc to-indigo-500 flex items-center justify-center text-white font-bold">B</span>
          <img src="images/signature-black.png" alt="Benjamin JB Smith" class="h-12 hidden sm:inline dark:sm:hidden">
          <img src="images/signature-white.png" alt="Benjamin JB Smith" class="h-12 hidden dark:sm:inline">
        </a>
        <nav class="hidden lg:flex items-center gap-5" aria-label="Main">${desktopItems}</nav>
        <div class="flex items-center gap-2">
          <button id="theme-toggle" class="glass-btn w-9 h-9 rounded-full flex items-center justify-center" aria-label="Toggle dark mode">
            <svg class="w-4 h-4 fill-amber-400 hidden dark:block" viewBox="0 0 20 20"><path d="M10 14a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0-13 1.5 3h-3L10 1Zm0 18-1.5-3h3L10 19ZM1 10l3-1.5v3L1 10Zm18 0-3 1.5v-3l3 1.5ZM3.6 3.6l3.2 1.1-2.1 2.1-1.1-3.2Zm12.8 12.8-3.2-1.1 2.1-2.1 1.1 3.2Zm0-12.8-1.1 3.2-2.1-2.1 3.2-1.1ZM3.6 16.4l1.1-3.2 2.1 2.1-3.2 1.1Z"/></svg>
            <svg class="w-4 h-4 fill-slate-500 dark:hidden" viewBox="0 0 20 20"><path d="M17.3 12.2A8 8 0 0 1 7.8 2.7 8 8 0 1 0 17.3 12.2Z"/></svg>
          </button>
          <button id="menu-toggle" class="glass-btn w-9 h-9 rounded-full flex items-center justify-center lg:hidden" aria-label="Menu">
            <svg class="w-4 h-4 fill-slate-600 dark:fill-slate-300" viewBox="0 0 16 16"><path d="M1 3h14v2H1V3Zm0 4h14v2H1V7Zm0 4h14v2H1v-2Z"/></svg>
          </button>
        </div>
      </div>
      <div id="mobile-menu" class="lg:hidden border-t border-black/5 dark:border-white/10 px-6 py-4">
        <div class="flex flex-col gap-3">${mobileItems}</div>
      </div>
    </div>`;
  document.body.prepend(nav);

  document.getElementById('menu-toggle').addEventListener('click', () => {
    document.getElementById('mobile-menu').classList.toggle('open');
  });

  document.getElementById('theme-toggle').addEventListener('click', () => {
    const root = document.documentElement;
    root.classList.toggle('dark');
    localStorage.theme = root.classList.contains('dark') ? 'dark' : 'light';
  });

  // Pointer-tracking spotlight glow: cards pick up a hue-shifting border glow
  // that follows the cursor (orange-leaning, per the crypto theme).
  document.addEventListener('pointermove', (e) => {
    const root = document.documentElement.style;
    root.setProperty('--x', e.clientX.toFixed(2));
    root.setProperty('--xp', (e.clientX / window.innerWidth).toFixed(3));
    root.setProperty('--y', e.clientY.toFixed(2));
    root.setProperty('--yp', (e.clientY / window.innerHeight).toFixed(3));
  }, { passive: true });

  function applyGlow() {
    document.querySelectorAll('.glass, #ventures-grid > a').forEach(el => {
      if (!el.closest('#site-nav')) el.setAttribute('data-glow', '');
    });
  }
  applyGlow();
  // Re-apply after page scripts render dynamic cards (ventures, feeds)
  window.addEventListener('load', applyGlow);

  // Footer (rendered into #site-footer if the page provides one)
  const SOCIALS = [
    { name: 'Instagram', url: 'https://instagram.com/benjaminjbsmith', icon: '<path d="M8 0C5.8 0 5.6 0 4.7.1 3.9.1 3.3.2 2.8.4c-.5.2-.9.5-1.4.9-.4.5-.7.9-.9 1.4-.2.5-.3 1.1-.3 1.9C.1 5.6 0 5.8 0 8s0 2.4.1 3.3c0 .8.1 1.4.3 1.9.2.5.5.9.9 1.4.5.4.9.7 1.4.9.5.2 1.1.3 1.9.3.9.1 1.1.1 3.4.1s2.4 0 3.3-.1c.8 0 1.4-.1 1.9-.3.5-.2.9-.5 1.4-.9.4-.5.7-.9.9-1.4.2-.5.3-1.1.3-1.9.1-.9.1-1.1.1-3.3s0-2.4-.1-3.3c0-.8-.1-1.4-.3-1.9-.2-.5-.5-.9-.9-1.4-.5-.4-.9-.7-1.4-.9-.5-.2-1.1-.3-1.9-.3C10.4 0 10.2 0 8 0Zm0 1.4c2.2 0 2.4 0 3.2.1.8 0 1.2.2 1.5.3.4.1.6.3.9.6.3.3.5.5.6.9.1.3.3.7.3 1.5.1.8.1 1 .1 3.2s0 2.4-.1 3.2c0 .8-.2 1.2-.3 1.5-.1.4-.3.6-.6.9-.3.3-.5.5-.9.6-.3.1-.7.3-1.5.3-.8.1-1 .1-3.2.1s-2.4 0-3.2-.1c-.8 0-1.2-.2-1.5-.3-.4-.1-.6-.3-.9-.6-.3-.3-.5-.5-.6-.9-.1-.3-.3-.7-.3-1.5C1.4 10.4 1.4 10.2 1.4 8s0-2.4.1-3.2c0-.8.2-1.2.3-1.5.1-.4.3-.6.6-.9.3-.3.5-.5.9-.6.3-.1.7-.3 1.5-.3.8-.1 1-.1 3.2-.1Zm0 2.5a4.1 4.1 0 1 0 0 8.2 4.1 4.1 0 0 0 0-8.2Zm0 6.8a2.7 2.7 0 1 1 0-5.4 2.7 2.7 0 0 1 0 5.4Zm5.2-7a1 1 0 1 1-1.9 0 1 1 0 0 1 1.9 0Z"/>' },
    { name: 'TikTok', url: 'https://www.tiktok.com/@benjaminjbsmith', icon: '<path d="M11.4 0h-2.7v10.8a2.3 2.3 0 1 1-2.3-2.3c.2 0 .5 0 .7.1V5.8a5 5 0 1 0 4.3 5V5.4A6.3 6.3 0 0 0 15 6.6V4a3.9 3.9 0 0 1-3.6-4Z"/>' },
    { name: 'YouTube', url: 'https://www.youtube.com/@benjaminjbsmith', icon: '<path d="M15.7 4.1a2 2 0 0 0-1.4-1.4C13 2.3 8 2.3 8 2.3s-5 0-6.3.4A2 2 0 0 0 .3 4.1C0 5.4 0 8 0 8s0 2.6.3 3.9a2 2 0 0 0 1.4 1.4c1.3.4 6.3.4 6.3.4s5 0 6.3-.4a2 2 0 0 0 1.4-1.4C16 10.6 16 8 16 8s0-2.6-.3-3.9ZM6.4 10.4V5.6L10.6 8l-4.2 2.4Z"/>' },
    { name: 'Facebook', url: 'https://www.facebook.com/benjaminjbsmith', icon: '<path d="M16 8a8 8 0 1 0-9.25 7.9v-5.59H4.72V8h2.03V6.24c0-2 1.19-3.11 3.02-3.11.88 0 1.79.16 1.79.16v1.97h-1.01c-.99 0-1.3.62-1.3 1.25V8h2.22l-.36 2.31H9.25v5.59A8 8 0 0 0 16 8Z"/>' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/benjaminjbsmith', icon: '<path d="M3.6 1.8a1.8 1.8 0 1 1-3.6 0 1.8 1.8 0 0 1 3.6 0ZM.2 5.4h3.2V16H.2V5.4Zm5.4 0h3v1.5h.1c.4-.8 1.5-1.7 3-1.7 3.2 0 3.8 2.1 3.8 4.9V16h-3.2v-5.2c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V16H5.6V5.4Z"/>' },
  ];

  const footerHost = document.getElementById('site-footer');
  if (footerHost) {
    footerHost.innerHTML = `
      <footer class="max-w-7xl mx-auto px-6 md:px-12 py-10 mt-8 border-t border-slate-200 dark:border-slate-800 space-y-4 text-sm text-slate-500 dark:text-slate-400">
        <div class="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <p>© 2026 Benjamin Smith. All rights reserved.</p>
          <div class="flex gap-4">
            ${SOCIALS.map(s => `<a href="${s.url}" target="_blank" rel="noopener" class="hover:text-indigo-500 transition" aria-label="${s.name}" title="${s.name}"><svg class="w-4 h-4 fill-current" viewBox="0 0 16 16">${s.icon}</svg></a>`).join('')}
          </div>
        </div>
        <a href="https://popl.co/card/7kmqlK11/4/dash" target="_blank" rel="noopener" class="flex items-center justify-center gap-2 opacity-70 hover:opacity-100 transition">
          <span class="text-xs uppercase tracking-wide">Powered by</span>
          <img src="images/vaura-black.png" alt="Vaura" class="h-6 dark:hidden">
          <img src="images/vaura-white.png" alt="Vaura" class="h-6 hidden dark:block">
        </a>
      </footer>`;
  }
})();
