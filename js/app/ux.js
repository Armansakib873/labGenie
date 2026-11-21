/* =====================================================================
   LabGenie · ux.js
   • Command search: one box for calculators, guidebook tests & guides,
     patients / saved cases and settings. Opens from the header search
     button, Ctrl/⌘+K or "/". Arrow keys + Enter to navigate.
   • Smooth page transitions (respects reduced-motion).
   • Bottom sheets can be swiped down to close.
   ===================================================================== */
(function () {
  'use strict';
  const E = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const RM = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ST2 = { get: (k, d) => { try { const v = localStorage.getItem('lg.' + k); return v == null ? d : JSON.parse(v); } catch (_) { return d; } }, set: (k, v) => { try { localStorage.setItem('lg.' + k, JSON.stringify(v)); } catch (_) {} } };
  const SV = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>';

  /* ---------------- data sources ---------------- */
  const SETTINGS = [
    ['Appearance & dark mode', 'theme dark light accent colour text size density', '#more'],
    ['Lab profile (name, address, phone)', 'lab name address phone profile', '#more'],
    ['Privacy, PIN & audit log', 'privacy pin lock audit disclaimer', '#more'],
    ['Export / import data', 'backup export import json csv data', '#more'],
    ['Install the app', 'install pwa home screen offline', '#more'],
    ['About & author', 'about version author contact', '#more'],
    ['Report template: letterhead, signatures, seals', 'report letterhead logo signature seal footer page settings', '#manual-report-template'],
    ['Saved results', 'history saved results patient', '#history'],
    ['Batch mode', 'batch multiple rows calculate', '#batch'],
    ['Self-test', 'self test formula check', '#selftest'],
    ['SOP Guidebook', 'guidebook sop guide tests', '#sop'],
    ['MCQ quiz', 'quiz mcq exam practice', '#sop?g=quiz'],
    ['Pattern finder', 'pattern finder interpretation', '#sop?g=pattern']
  ];
  const tools = () => ((window.LGI && LGI.T) || []).map(t => ({ g: 'Calculators', t: t.t, s: t.d || '', k: (t.k || '') + ' ' + t.id, go: '#' + t.id }));
  const guide = () => {
    const G = window.SOPG;
    if (!G || !G.ready) return [];
    return [...G.TESTS.map(t => ({ g: 'Tests', t: t.n, s: t.dept + ' · ' + t.sp, k: (t.aka || '') + ' ' + t.cat, go: '#sop?t=' + t.id })), ...G.GUIDES.map(g => ({ g: 'Guides', t: g.n, s: g.cat, k: g.aka || '', go: '#sop?g=' + g.id }))];
  };
  const patients = () => {
    const out = [];
    try { (window.S && S.rxs || []).forEach((x, i) => out.push({ g: 'Patients & cases', t: x.n || 'Saved case', s: 'Report case · ' + new Date(x.ts).toLocaleDateString(), k: (x.c && x.c.pt ? [x.c.pt.p, x.c.pt.pid, x.c.pt.lno].join(' ') : ''), act: () => { location.hash = 'manual-report-template'; setTimeout(() => clickData('ra', 'copen', i), 120); } })); } catch (_) {}
    try { (window.S && S.hist || []).slice(0, 80).forEach((h, i) => out.push({ g: 'Patients & cases', t: (h.id || '—') + ' · ' + (h.nm || ''), s: 'Saved result · ' + new Date(h.ts).toLocaleDateString(), k: (h.nt || ''), act: () => clickData('a', 'hopen', i) })); } catch (_) {}
    return out;
  };
  const settings = () => [{ g: 'Actions', t: 'Toggle dark / light theme', s: 'Action', k: 'theme dark light mode', act: () => clickData('a', 'tgl') }, ...SETTINGS.map(([t, k, go]) => ({ g: 'Settings & pages', t, s: '', k, go }))];
  const clickData = (attr, v, i) => { const b = document.createElement('button'); b.dataset[attr] = v; if (i != null) b.dataset.i = i; b.style.display = 'none'; document.body.appendChild(b); b.click(); b.remove(); };

  /* ---------------- palette UI ---------------- */
  let el, q = '', sel = 0, list = [], rec = ST2.get('cmdr', []);
  const score = (it, w) => { const t = it.t.toLowerCase(), k = (it.k + ' ' + it.s).toLowerCase(); let s = 0; for (const x of w) { if (t.startsWith(x)) s += 12; else if (t.includes(x)) s += 8; else if (k.includes(x)) s += 2; else return 0; } return s + (it.g === 'Actions' ? 1 : 0); };
  const build = () => {
    const w = q.toLowerCase().split(/\s+/).filter(Boolean);
    const all = [...settings(), ...tools(), ...guide(), ...patients()];
    if (!w.length) {
      const r = rec.map(x => all.find(a => a.t === x)).filter(Boolean).map(a => Object.assign({}, a, { g: 'Recent' }));
      list = [...r, ...all.filter(a => a.g === 'Actions' || /Guidebook|quiz|Pattern/.test(a.t)).slice(0, 5), ...tools().slice(0, 6)];
    } else list = all.map(a => ({ a, s: score(a, w) })).filter(x => x.s).sort((x, y) => y.s - x.s).slice(0, 40).map(x => x.a);
    sel = Math.min(sel, Math.max(0, list.length - 1));
    const G = window.SOPG, loading = G && !G.ready;
    let h = '', last = '';
    list.forEach((it, i) => { if (it.g !== last) { h += `<div class="ck-g">${E(it.g)}</div>`; last = it.g; } h += `<button class="ck-i${i === sel ? ' on' : ''}" data-ck="${i}"><b>${E(it.t)}</b>${it.s ? `<small>${E(it.s)}</small>` : ''}</button>`; });
    if (!list.length) h = `<div class="ck-e">${loading ? 'Loading guidebook…' : 'No matches. Try a test, calculator, patient ID or setting.'}</div>`;
    el.querySelector('.ck-l').innerHTML = h;
    const on = el.querySelector('.ck-i.on'); on && on.scrollIntoView({ block: 'nearest' });
  };
  const go = it => {
    if (!it) return;
    rec = [it.t, ...rec.filter(x => x !== it.t)].slice(0, 6); ST2.set('cmdr', rec);
    close();
    if (it.act) it.act(); else location.hash = it.go.slice(1);
  };
  const open = () => {
    if (!el) {
      el = document.createElement('div'); el.id = 'cmdk';
      el.innerHTML = `<div class="ck-b" role="dialog" aria-modal="true" aria-label="Search everything"><label class="ck-q">${SV}<input type="search" placeholder="Search calculators, tests, guides, patients, settings…" autocomplete="off" enterkeyhint="go" aria-label="Search everything"><kbd>Esc</kbd></label><div class="ck-l" role="listbox"></div><div class="ck-f"><span>↑↓ move · ↵ open · Esc close</span><span>LabGenie</span></div></div>`;
      document.body.appendChild(el);
      const inp = el.querySelector('input');
      inp.addEventListener('input', () => { q = inp.value; sel = 0; build(); });
      inp.addEventListener('keydown', e => {
        if (e.key === 'ArrowDown') { sel = Math.min(list.length - 1, sel + 1); build(); e.preventDefault(); }
        else if (e.key === 'ArrowUp') { sel = Math.max(0, sel - 1); build(); e.preventDefault(); }
        else if (e.key === 'Enter') { go(list[sel]); e.preventDefault(); }
        else if (e.key === 'Escape') close();
      });
      el.addEventListener('click', e => { const b = e.target.closest('[data-ck]'); if (b) go(list[+b.dataset.ck]); else if (e.target === el) close(); });
    }
    q = ''; sel = 0;
    const inp = el.querySelector('input'); inp.value = '';
    el.classList.add('on'); build();
    setTimeout(() => inp.focus(), 30);
    const G = window.SOPG; if (G && G.load && !G.ready) G.load().then(() => el.classList.contains('on') && build(), () => {});
  };
  const close = () => { if (el) el.classList.remove('on'); };
  window.LGCMD = { open, close };

  // header search button → palette (capture so the old handler does not run)
  document.addEventListener('click', e => { const b = e.target.closest('#bar [data-a="srch"], #bar [data-sa="focus"]'); if (!b) return; e.preventDefault(); e.stopPropagation(); open(); }, true);
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); el && el.classList.contains('on') ? close() : open(); return; }
    if (e.key === '/' && !/input|textarea|select/i.test((document.activeElement || {}).tagName || '') && !(document.activeElement || {}).isContentEditable) { e.preventDefault(); open(); }
    if (e.key === 'Escape' && el && el.classList.contains('on')) close();
  });

  /* ---------------- page transitions ---------------- */
  let lastHash = location.hash;
  const r0 = window.render;
  if (typeof r0 === 'function') {
    window.render = function () {
      const back = (window.S && S.navDir) || 0;
      r0.apply(this, arguments);
      const v = document.getElementById('v');
      const changed = location.hash !== lastHash;
      lastHash = location.hash;
      if (!v || RM() || !changed) return;
      v.classList.remove('vt-in', 'vt-back');
      void v.offsetWidth;
      v.classList.add(back ? 'vt-back' : 'vt-in');
    };
  }
  addEventListener('popstate', () => { if (window.S) S.navDir = 1; setTimeout(() => { if (window.S) S.navDir = 0; }, 400); });

  /* ---------------- swipe-down to close bottom sheets ---------------- */
  let y0 = null, dy = 0, sh = null;
  document.addEventListener('touchstart', e => {
    const b = e.target.closest && e.target.closest('#ov .bs');
    if (!b) return;
    const grabbed = e.target.closest('.grab') || e.touches[0].clientY - b.getBoundingClientRect().top < 48;
    if (b.scrollTop > 0 && !grabbed) return;
    sh = b; y0 = e.touches[0].clientY; dy = 0; sh.style.transition = 'none';
  }, { passive: true });
  document.addEventListener('touchmove', e => {
    if (!sh || y0 == null) return;
    dy = Math.max(0, e.touches[0].clientY - y0);
    if (dy > 0 && sh.scrollTop <= 0) sh.style.transform = `translateY(${dy}px)`;
  }, { passive: true });
  document.addEventListener('touchend', () => {
    if (!sh) return;
    const b = sh; sh = null; y0 = null;
    b.style.transition = 'transform .22s ease';
    if (dy > 90) { b.style.transform = 'translateY(110%)'; setTimeout(() => { b.style.transform = ''; b.style.transition = ''; try { LGI.closeS(); } catch (_) { const o = document.getElementById('ov'); if (o) o.className = ''; } }, 200); }
    else { b.style.transform = ''; setTimeout(() => { b.style.transition = ''; }, 230); }
    dy = 0;
  });
})();

/* ---------------- desktop sidebar: brand + main navigation (≥900px) ---------------- */
(function () {
  'use strict';
  const sd = document.getElementById('side');
  if (!sd) return;
  const EN = { home: 'Home', tools: 'Tools', saved: 'Saved', more: 'More', calcs: 'Calculators' };
  const T = k => { let v; try { v = typeof tr === 'function' ? tr(k) : ''; } catch (_) {} return v && v !== k ? v : EN[k] || k; };
  const I = n => { try { return typeof ic === 'function' ? ic(n) : ''; } catch (_) { return ''; } };
  const BOOK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5z"/><path d="M4 21.5A2.5 2.5 0 0 1 6.5 19H20v3H6.5"/><path d="M9 7h7M9 11h5"/></svg>';
  /* the app rebuilds #side on its own; we add the brand + nav block on top whenever it does */
  const paint = () => {
    if (innerWidth < 900 || !sd.querySelector('.srch')) return;
    let top = sd.querySelector(':scope > .sd-top');
    if (!top) { top = document.createElement('div'); top.className = 'sd-top'; sd.prepend(top); }
    const h = decodeURIComponent(location.hash.slice(1).split('?')[0]) || 'home';
    const main = ['home', 'tools', 'history', 'more', 'sop'];
    const act = main.includes(h) ? h : 'tools';
    const nav = [['home', T('home'), I('home')], ['tools', T('tools'), I('grid')], ['history', T('saved'), I('hist')], ['sop', 'SOP Guidebook', BOOK], ['more', T('more'), I('more')]];
    const html = `<a class="sd-brand" href="#home"><div class="logo"><svg viewBox="0 0 24 24" style="width:22px;height:22px;stroke-width:2.6"><path d="M12 5v14M5 12h14"/></svg></div><div><b>LabGenie</b><small>Version ${window.LG_SWV || ''}</small></div></a><nav class="sd-nav" aria-label="Main">${nav.map(([k, l, i]) => `<a href="#${k}" class="${act === k ? 'on' : ''}"${act === k ? ' aria-current="page"' : ''}>${i}<span>${l}</span></a>`).join('')}</nav><div class="sd-lbl"><span>${EN.calcs}</span><span>${(window.LGI && LGI.T || []).length || ''}</span></div>`;
    if (top.innerHTML !== html) top.innerHTML = html;
  };
  new MutationObserver(paint).observe(sd, { childList: true });
  addEventListener('hashchange', () => setTimeout(paint, 0));
  addEventListener('resize', () => setTimeout(paint, 0));
  paint();
})();
