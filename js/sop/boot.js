/* =====================================================================
   LabGenie SOP Guidebook · boot.js
   Tiny loader that ships with the app shell. The guidebook data and UI
   (~ several hundred KB) load only when the guidebook (or the command
   search) is first opened, keeping app start-up fast on low-end phones.
   ===================================================================== */
(function () {
  'use strict';
  const V = '21';
  const FILES = ['tests', 'tests2a', 'tests2b', 'handling', 'methods', 'visuals', 'guides', 'atlas-haem', 'bloodbank', 'learn', 'sop'];
  const G = (window.SOPG = window.SOPG || {});
  let p = null;
  const one = f => new Promise((ok, no) => { const s = document.createElement('script'); s.src = `js/sop/${f}.js?v=${V}`; s.onload = ok; s.onerror = () => no(new Error('Could not load ' + f)); document.head.appendChild(s); });
  G.load = () => p || (p = FILES.reduce((c, f) => c.then(() => one(f)), Promise.resolve()).then(() => { G.ready = 1; }).catch(e => { p = null; throw e; }));

  /* author credit (guidebook footer, About, quiz card) */
  G.AUTH = { n: 'Md Arman Hossen', r: 'Medical Technologist (Laboratory)', e: 'armanhossen873@gmail.com' };
  G.AUTHOR = () => `<div class="sp-auth"><span class="sp-auth-i">AH</span><div><small>Created by</small><b>${G.AUTH.n}</b><span>${G.AUTH.r}</span><a href="mailto:${G.AUTH.e}">${G.AUTH.e}</a></div></div>`;

  const skel = () => `<div class="sp" id="sp"><div class="sk sk-hero"></div><div class="sk-row">${'<div class="sk sk-tile"></div>'.repeat(4)}</div><div class="sk sk-bar"></div>${'<div class="sk sk-card"></div>'.repeat(5)}</div>`;
  window.VW = window.VW || {};
  window.VW.sop = () => {
    if (G.ready && G.view) return G.view();
    G.load().then(() => { if (/^#sop/.test(location.hash) && typeof render === 'function') render(); }, () => { const v = document.getElementById('sp'); if (v) v.innerHTML = '<div class="sp-empty">Could not load the guidebook. Check your connection and try again.</div>'; });
    return skel();
  };

  /* book icon beside the header search (all main tabs) */
  const bar0 = window.bar;
  if (typeof bar0 === 'function') {
    window.bar = function (tab, t) {
      bar0(tab, t);
      const b = document.getElementById('bar');
      if (!b || t || /^#sop/.test(location.hash)) return;
      const s = b.querySelector('[data-a="srch"]');
      if (s && !b.querySelector('.sp-bk')) s.insertAdjacentHTML('beforebegin', '<a class="ib sp-bk" href="#sop" aria-label="SOP guidebook" title="SOP guidebook"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5z"/><path d="M4 21.5A2.5 2.5 0 0 1 6.5 19H20v3H6.5"/><path d="M9 7h7M9 11h5"/></svg></a>');
    };
  }
  /* own header while the guidebook loads */
  if (/^#sop/.test(location.hash)) G.load().then(() => typeof render === 'function' && render());
  else if (typeof render === 'function') render();
})();
