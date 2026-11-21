/* =====================================================================
   LabGenie SOP Guidebook · sop.js
   Routes:  #sop            home (search, browse tests / guides / saved)
            #sop?t=<id>     test guide
            #sop?g=<id>     SOP / QC guide (with interactive tools)
   Uses its own data-sa / data-sx attributes (no clash with app handlers).
   ===================================================================== */
(function () {
  'use strict';
  const G = window.SOPG;
  const E = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const $1 = s => document.querySelector(s);
  const ST2 = { get: (k, d) => { try { const v = localStorage.getItem('lg.' + k); return v == null ? d : JSON.parse(v); } catch (_) { return d; } }, set: (k, v) => { try { localStorage.setItem('lg.' + k, JSON.stringify(v)); } catch (_) {} } };
  const U = (G.ui = { tab: 'tests', by: 'dept', f: '', q: '', u: 0, gc: '' });
  let fav = ST2.get('sopf', []), rec = ST2.get('sopr', []);

  const IC = {
    book: '<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5z"/><path d="M4 21.5A2.5 2.5 0 0 1 6.5 19H20v3H6.5"/><path d="M9 7h7M9 11h5"/>',
    back: '<path d="M15 18l-6-6 6-6"/>', search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
    star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>', copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>',
    up: '<path d="M12 19V5M6 11l6-6 6 6"/>', dn: '<path d="M12 5v14M6 13l6 6 6-6"/>', chev: '<path d="M9 6l6 6-6 6"/>', x: '<path d="M6 6l12 12M18 6L6 18"/>'
  };
  const ico = n => `<svg viewBox="0 0 24 24" aria-hidden="true">${IC[n]}</svg>`;
  const isFav = k => fav.includes(k);
  const tube = k => G.TUBES[k] || ['', '#999'];
  const T = id => G.TESTS.find(t => t.id === id), GD = id => G.GUIDES.find(g => g.id === id);

  /* ---------------- search index ---------------- */
  const flat = o => (o == null ? '' : typeof o === 'string' ? o : Array.isArray(o) ? o.map(flat).join(' ') : typeof o === 'object' ? Object.values(o).map(flat).join(' ') : String(o));
  const IDX = [
    ...G.TESTS.map(t => ({ k: 't:' + t.id, t, name: t.n.toLowerCase(), aka: (t.aka || '').toLowerCase(), all: flat(t).toLowerCase() })),
    ...G.GUIDES.map(g => ({ k: 'g:' + g.id, g, name: g.n.toLowerCase(), aka: (g.aka || '').toLowerCase(), all: flat(g).toLowerCase() }))
  ];
  const search = q => {
    const w = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!w.length) return [];
    return IDX.map(x => {
      let s = 0;
      for (const t of w) {
        const n = x.name.includes(t) ? 10 : 0, a = x.aka.includes(t) ? 6 : 0, al = x.all.includes(t) ? 1 : 0;
        if (!n && !a && !al) return null;
        s += n + a + al + (x.name.startsWith(t) ? 4 : 0);
      }
      return { x, s };
    }).filter(Boolean).sort((a, b) => b.s - a.s).map(r => r.x);
  };
  const snippet = (x, q) => {
    const t = q.toLowerCase().split(/\s+/).filter(Boolean)[0];
    if (!t || x.name.includes(t)) return '';
    const src = x.t || x.g, txt = flat(src), i = txt.toLowerCase().indexOf(t);
    if (i < 0) return '';
    const a = Math.max(0, i - 50), s = txt.slice(a, i + t.length + 70);
    return (a ? '…' : '') + E(s).replace(new RegExp('(' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'), '<mark>$1</mark>') + '…';
  };

  /* ---------------- shared bits ---------------- */
  const testCard = (t, q) => `<a class="sp-card" href="#sop?t=${t.id}" style="--c:${tube(t.tube)[1]}"><i class="sp-tb"></i><span><b>${E(t.n)}</b><small>${E(t.dept)} · ${E(t.sp)}</small>${q ? `<em>${snippet(IDX.find(x => x.k === 't:' + t.id), q)}</em>` : ''}</span>${isFav('t:' + t.id) ? '<i class="sp-fv">★</i>' : ''}${ico('chev')}</a>`;
  const guideCard = (g, q) => `<a class="sp-card g" href="#sop?g=${g.id}"><i class="sp-gi">${g.ic}</i><span><b>${E(g.n)}</b><small>${E(g.cat)}${g.tool ? ' · interactive tool' : ''}</small>${q ? `<em>${snippet(IDX.find(x => x.k === 'g:' + g.id), q)}</em>` : ''}</span>${isFav('g:' + g.id) ? '<i class="sp-fv">★</i>' : ''}${ico('chev')}</a>`;
  const chips = (list, cur, attr) => `<div class="sp-chips">${list.map(([v, l, n]) => `<button class="sp-chip${cur === v ? ' on' : ''}" data-sa="${attr}" data-v="${E(v)}">${E(l)}${n != null ? ` <i>${n}</i>` : ''}</button>`).join('')}</div>`;
  const seg = (list, cur, attr) => `<div class="sp-seg">${list.map(([v, l]) => `<button class="${cur === v ? 'on' : ''}" data-sa="${attr}" data-v="${v}">${l}</button>`).join('')}</div>`;

  /* ---------------- home ---------------- */
  const QUICK = [['westgard', '🚦', 'Westgard checker'], ['iqc', '📈', 'QC statistics'], ['centri', '🌀', 'RPM ⇄ RCF'], ['draw', '🧪', 'Order of draw'], ['conv', '🔁', 'Unit converter'], ['critical', '🚨', 'Critical values'], ['spill', '🧯', 'Needle-stick / spill'], ['reject', '⛔', 'Rejection criteria']];
  const listBody = () => {
    if (U.q.trim()) {
      const r = search(U.q.trim());
      return `<p class="sp-cnt">${r.length} result${r.length === 1 ? '' : 's'} for “${E(U.q.trim())}”</p>` + (r.map(x => (x.t ? testCard(x.t, U.q) : guideCard(x.g, U.q))).join('') || '<div class="sp-empty">Nothing found. Try a test name, specimen, tube colour or keyword (e.g. “haemolysis”, “fasting”, “dialysis”).</div>');
    }
    if (U.tab === 'saved') {
      const items = fav.map(k => (k[0] === 't' ? T(k.slice(2)) && testCard(T(k.slice(2))) : GD(k.slice(2)) && guideCard(GD(k.slice(2))))).filter(Boolean);
      const rc = rec.map(k => (k[0] === 't' ? T(k.slice(2)) && testCard(T(k.slice(2))) : GD(k.slice(2)) && guideCard(GD(k.slice(2))))).filter(Boolean);
      return `<h3 class="sp-h3">★ Bookmarked</h3>${items.join('') || '<div class="sp-empty">Tap ☆ on any guide to bookmark it here.</div>'}${rc.length ? `<h3 class="sp-h3">Recently viewed</h3>${rc.join('')}` : ''}`;
    }
    if (U.tab === 'guides') {
      const cats = G.GCATS.map(c => [c, c, G.GUIDES.filter(g => g.cat === c).length]);
      const L = G.GUIDES.filter(g => !U.gc || g.cat === U.gc);
      return chips([['', 'All', G.GUIDES.length], ...cats], U.gc, 'gc') + (U.gc ? L.map(g => guideCard(g)).join('') : G.GCATS.map(c => `<h3 class="sp-h3">${E(c)}</h3>${G.GUIDES.filter(g => g.cat === c).map(g => guideCard(g)).join('')}`).join(''));
    }
    // tests
    const byOpts = [['dept', 'Department'], ['cat', 'Category'], ['spec', 'Specimen'], ['az', 'A–Z']];
    let h = seg(byOpts, U.by, 'by');
    const key = t => (U.by === 'dept' ? t.dept : U.by === 'cat' ? t.cat : U.by === 'spec' ? tube(t.tube)[0].split(' (')[0] : t.n[0].toUpperCase());
    const groups = [...new Set(G.TESTS.map(key))].sort((a, b) => (U.by === 'dept' ? G.DEPTS.indexOf(a) - G.DEPTS.indexOf(b) : a.localeCompare(b)));
    h += chips([['', 'All', G.TESTS.length], ...groups.map(g => [g, g, G.TESTS.filter(t => key(t) === g).length])], U.f, 'f');
    const show = U.f ? [U.f] : groups;
    h += show.map(g => `<h3 class="sp-h3">${U.by === 'spec' ? `<i class="sp-dot" style="background:${tube((G.TESTS.find(t => key(t) === g) || {}).tube)[1]}"></i>` : ''}${E(g)}</h3>${G.TESTS.filter(t => key(t) === g).sort((a, b) => a.n.localeCompare(b.n)).map(t => testCard(t)).join('')}`).join('');
    return h;
  };
  const home = () => `<div class="sp" id="sp">
<section class="sp-hero"><div class="sp-ht"><span class="sp-hi">${ico('book')}</span><div><h2>SOP Guidebook</h2><p>${G.TESTS.length} test guides · ${G.GUIDES.length} SOP, QC & safety guides</p></div></div>
<label class="sp-q">${ico('search')}<input id="spq" data-sx="q" placeholder="Search tests, SOPs, QC, keywords…" value="${E(U.q)}" autocomplete="off" enterkeyhint="search">${U.q ? `<button data-sa="qclr" aria-label="Clear search">${ico('x')}</button>` : ''}</label></section>
${U.q ? '' : `<div class="sp-quick">${QUICK.map(([id, i, l]) => `<a href="#sop?g=${id}"><i>${i}</i><span>${l}</span></a>`).join('')}</div>`}
${U.q ? '' : seg([['tests', '🔬 Tests'], ['guides', '📘 SOP & QC'], ['saved', '★ Saved']], U.tab, 'tab')}
<div id="spl">${listBody()}</div>
<p class="sp-disc">Reference values and procedures are typical guidance from standard textbooks (Tietz, Henry, CLSI, WHO). Always follow your laboratory’s validated SOPs and the reagent kit insert.</p></div>`;

  /* ---------------- detail: test ---------------- */
  const sec = (ic, h, body, open) => body ? `<details class="sp-sec"${open ? ' open' : ''}><summary><i>${ic}</i>${h}</summary><div class="sp-sb">${body}</div></details>` : '';
  const ul = a => (a && a.length ? `<ul class="sp-ul">${a.map(x => `<li>${E(x)}</li>`).join('')}</ul>` : '');
  const refTable = t => {
    const r = t.ref; if (!r) return '';
    const two = r.r.some(x => x[2]);
    return `${two ? seg([[0, E(r.u[0])], [1, E(r.u[1])], [2, 'Both']], U.u, 'u') : ''}<div class="sp-tw"><table class="sp-tbl"><thead><tr><th>Group</th>${U.u !== 1 || !two ? `<th>${E(r.u[0])}</th>` : ''}${two && U.u !== 0 ? `<th>${E(r.u[1])}</th>` : ''}</tr></thead><tbody>${r.r.map(x => `<tr><td>${E(x[0])}</td>${U.u !== 1 || !two ? `<td><b>${E(x[1])}</b></td>` : ''}${two && U.u !== 0 ? `<td><b>${E(x[2] || '—')}</b></td>` : ''}</tr>`).join('')}</tbody></table></div><p class="sp-note">Approximate adult values unless stated. Verify with your method / kit insert.</p>`;
  };
  const testView = t => {
    const tb = tube(t.tube), list = G.TESTS, i = list.indexOf(t), prev = list[i - 1], next = list[i + 1];
    const rel = list.filter(x => x !== t && (x.cat === t.cat || x.dept === t.dept)).slice(0, 8);
    return `<div class="sp sp-d" id="sp">
<section class="sp-dh" style="--c:${tb[1]}"><div class="sp-tags"><span>${E(t.dept)}</span><span>${E(t.cat)}</span></div><h2>${E(t.n)}</h2>
<div class="sp-act"><button data-sa="fav" data-k="t:${t.id}" class="${isFav('t:' + t.id) ? 'on' : ''}">${ico('star')}${isFav('t:' + t.id) ? 'Saved' : 'Save'}</button><button data-sa="copy" data-k="t:${t.id}">${ico('copy')}Copy</button></div></section>
<div class="sp-facts"><div><em>Specimen</em><b>${E(t.sp)}</b></div><div><em>Container</em><b><i class="sp-dot" style="background:${tb[1]}"></i>${E(tb[0])}</b></div><div><em>Volume</em><b>${E(t.vol)}</b></div><div class="w"><em>Best collection time / preparation</em><b>${E(t.time)}</b></div></div>
${t.crit ? `<div class="sp-crit"><b>🚨 Critical values</b>${E(t.crit)}</div>` : ''}
${sec('🧑‍⚕️', 'Collection precautions', ul(t.pre), 1)}
${sec('🌀', 'Sample processing & stability', ul(t.proc), 1)}
${sec('📏', 'Reference values (age / sex / units)', refTable(t), 1)}
${t.hi || t.lo ? sec('📊', 'Result interpretation', `<div class="sp-hl">${t.hi ? `<div class="hi"><h4>${ico('up')} Increased</h4>${ul(t.hi)}</div>` : ''}${t.lo ? `<div class="lo"><h4>${ico('dn')} Decreased</h4>${ul(t.lo)}</div>` : ''}</div>`, 1) : ''}
${sec('🔗', 'Correlation with other parameters', ul(t.corr), 1)}
${sec('🗂️', 'Patient history to check', ul(t.hx), 0)}
${sec('⚠️', 'Interferences & pitfalls', ul(t.int), 0)}
${rel.length ? `<h3 class="sp-h3">Related tests</h3><div class="sp-rel">${rel.map(x => `<a href="#sop?t=${x.id}">${E(x.n.split(' (')[0])}</a>`).join('')}</div>` : ''}
<div class="sp-pn">${prev ? `<a href="#sop?t=${prev.id}">‹ ${E(prev.n.split(' (')[0])}</a>` : '<span></span>'}${next ? `<a href="#sop?t=${next.id}">${E(next.n.split(' (')[0])} ›</a>` : '<span></span>'}</div>
<p class="sp-disc">Guidance only — follow your laboratory’s validated SOP and kit insert.</p></div>`;
  };

  /* ---------------- detail: guide ---------------- */
  const block = s => {
    if (s.li) return ul(s.li);
    if (s.st) return `<ol class="sp-ol">${s.st.map(x => `<li>${E(x)}</li>`).join('')}</ol>`;
    if (s.tb) return `<div class="sp-tw"><table class="sp-tbl"><thead><tr>${s.tb.hd.map(h => `<th>${E(h)}</th>`).join('')}</tr></thead><tbody>${s.tb.r.map(r => `<tr>${r.map((c, i) => `<td>${i ? E(c) : `<b>${E(c)}</b>`}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    if (s.tip) return `<p class="sp-tip">💡 ${E(s.tip)}</p>`;
    return '';
  };
  const guideView = g => {
    const list = G.GUIDES, i = list.indexOf(g), prev = list[i - 1], next = list[i + 1];
    return `<div class="sp sp-d" id="sp">
<section class="sp-dh g"><div class="sp-tags"><span>${E(g.cat)}</span>${g.tool ? '<span>Interactive</span>' : ''}</div><h2><i>${g.ic}</i> ${E(g.n)}</h2>
<div class="sp-act"><button data-sa="fav" data-k="g:${g.id}" class="${isFav('g:' + g.id) ? 'on' : ''}">${ico('star')}${isFav('g:' + g.id) ? 'Saved' : 'Save'}</button><button data-sa="copy" data-k="g:${g.id}">${ico('copy')}Copy</button></div></section>
${g.tool ? `<section class="sp-tool" id="sp-tool">${TOOLS[g.tool]()}</section>` : ''}
${g.sec.map((s, k) => sec('§', E(s.h), block(s), k < 3 || g.sec.length <= 4)).join('')}
<div class="sp-pn">${prev ? `<a href="#sop?g=${prev.id}">‹ ${E(prev.n)}</a>` : '<span></span>'}${next ? `<a href="#sop?g=${next.id}">${E(next.n)} ›</a>` : '<span></span>'}</div>
<p class="sp-disc">Adopt and approve locally before use — this is a general template, not a substitute for your lab’s controlled SOP.</p></div>`;
  };

  /* ---------------- interactive tools ---------------- */
  const TS = (G.ts = Object.assign({ mean: '100', sd: '2', vals: '101, 99.5, 102.1, 98.7, 103.2, 104.6, 100.4, 102.9, 103.1, 102.7', st: '', r: '10', rpm: '3000', rcf: '', cv: 'glucose', cvv: '100', dir: 0 }, ST2.get('sopts', {})));
  const saveTS = () => ST2.set('sopts', TS);
  const nums = s => String(s).split(/[\s,;]+/).map(x => parseFloat(x)).filter(x => isFinite(x));
  const ljSVG = (vals, mean, sd, bad) => {
    if (!vals.length || !(sd > 0)) return '';
    const W = 320, H = 170, pad = 22, n = vals.length, y = v => H / 2 - (v - mean) / sd * (H - 20) / 8, x = i => pad + (n === 1 ? (W - pad - 6) / 2 : i * (W - pad - 6) / (n - 1));
    const lines = [3, 2, 1, 0, -1, -2, -3].map(k => `<line x1="${pad}" x2="${W - 4}" y1="${y(mean + k * sd)}" y2="${y(mean + k * sd)}" class="lj${Math.abs(k)}"/><text x="2" y="${y(mean + k * sd) + 3}">${k ? (k > 0 ? '+' : '') + k + 's' : 'x̄'}</text>`).join('');
    const pts = vals.map((v, i) => [x(i), Math.max(4, Math.min(H - 4, y(v)))]);
    return `<svg class="sp-lj" viewBox="0 0 ${W} ${H}" role="img" aria-label="Levey-Jennings chart">${lines}<polyline points="${pts.map(p => p.join(',')).join(' ')}"/>${pts.map((p, i) => `<circle cx="${p[0]}" cy="${p[1]}" r="3.6" class="${bad[i] === 2 ? 'r' : bad[i] === 1 ? 'w' : ''}"/>`).join('')}</svg>`;
  };
  const westgard = (vals, mean, sd) => {
    const z = vals.map(v => (v - mean) / sd), n = z.length, L = n - 1, out = [], bad = z.map(() => 0);
    if (!n) return { out, bad, z };
    const last = z[L];
    const hit = (rule, rej, desc, idx) => { out.push({ rule, rej, desc }); idx.forEach(i => (bad[i] = Math.max(bad[i], rej ? 2 : 1))); };
    if (Math.abs(last) > 3) hit('1-3s', 1, 'Last value is beyond ±3 SD — random error.', [L]);
    if (n >= 2 && ((z[L] > 2 && z[L - 1] > 2) || (z[L] < -2 && z[L - 1] < -2))) hit('2-2s', 1, 'Two consecutive values beyond the same 2 SD limit — systematic error.', [L, L - 1]);
    if (n >= 2 && ((z[L] > 2 && z[L - 1] < -2) || (z[L] < -2 && z[L - 1] > 2))) hit('R-4s', 1, 'Consecutive values span more than 4 SD (one > +2 SD, one < −2 SD) — random error.', [L, L - 1]);
    if (n >= 4) { const s = z.slice(-4); if (s.every(v => v > 1) || s.every(v => v < -1)) hit('4-1s', 1, 'Four consecutive values beyond the same 1 SD limit — systematic shift.', [L, L - 1, L - 2, L - 3]); }
    if (n >= 10) { const s = z.slice(-10); if (s.every(v => v > 0) || s.every(v => v < 0)) hit('10x', 1, 'Ten consecutive values on the same side of the mean — systematic shift / bias.', [...Array(10).keys()].map(k => L - k)); }
    if (Math.abs(last) > 2 && !out.some(o => o.rej)) hit('1-2s', 0, 'Last value is beyond ±2 SD — warning: check other rules (none violated) — run may be accepted.', [L]);
    z.forEach((v, i) => { if (!bad[i] && Math.abs(v) > 2) bad[i] = 1; });
    return { out, bad, z };
  };
  const TOOLS = {
    westgard: () => {
      const v = nums(TS.vals), m = parseFloat(TS.mean), s = parseFloat(TS.sd), ok = v.length && s > 0 && isFinite(m);
      const r = ok ? westgard(v, m, s) : { out: [], bad: [], z: [] }, rej = r.out.some(o => o.rej), warn = r.out.length && !rej;
      return `<h3>🚦 Westgard rule checker</h3><p class="sp-sub">Enter your control’s target mean and SD, then QC results in date order (oldest first). The latest value is judged.</p>
<div class="sp-in2"><label>Mean<input data-sx="ts.mean" inputmode="decimal" value="${E(TS.mean)}"></label><label>SD<input data-sx="ts.sd" inputmode="decimal" value="${E(TS.sd)}"></label></div>
<label class="sp-in1">QC values<textarea data-sx="ts.vals" rows="3">${E(TS.vals)}</textarea></label>
<div id="sp-wg">${ok ? `<div class="sp-verdict ${rej ? 'r' : warn ? 'w' : 'g'}">${rej ? '⛔ REJECT RUN' : warn ? '⚠️ WARNING (1-2s) — accept if no other rule fails' : '✅ ACCEPT RUN'}<small>Last value ${v[v.length - 1]} · z = ${r.z[r.z.length - 1].toFixed(2)} SD · CV of target ${(s / m * 100).toFixed(2)} %</small></div>${r.out.map(o => `<div class="sp-rule ${o.rej ? 'r' : 'w'}"><b>${o.rule}</b>${E(o.desc)}</div>`).join('')}${ljSVG(v, m, s, r.bad)}<p class="sp-note">Limits: ±1 SD ${(m - s).toFixed(2)}–${(m + s).toFixed(2)} · ±2 SD ${(m - 2 * s).toFixed(2)}–${(m + 2 * s).toFixed(2)} · ±3 SD ${(m - 3 * s).toFixed(2)}–${(m + 3 * s).toFixed(2)}</p>` : '<p class="sp-note">Enter a mean, a positive SD and at least one value.</p>'}</div>`;
    },
    stats: () => {
      const v = nums(TS.st), n = v.length, m = n ? v.reduce((a, b) => a + b, 0) / n : 0, sd = n > 1 ? Math.sqrt(v.reduce((a, b) => a + (b - m) * (b - m), 0) / (n - 1)) : 0, f = x => (Math.abs(x) >= 100 ? x.toFixed(1) : x.toFixed(3));
      return `<h3>📈 QC statistics & Levey-Jennings limits</h3><p class="sp-sub">Paste ≥ 20 control results (one control level) to establish your own mean and SD.</p>
<label class="sp-in1">Control values<textarea data-sx="ts.st" rows="4" placeholder="e.g. 98 101 99.5 100.2 …">${E(TS.st)}</textarea></label>
<div id="sp-st">${n > 1 ? `<div class="sp-kpi"><div><em>n</em><b>${n}</b></div><div><em>Mean</em><b>${f(m)}</b></div><div><em>SD</em><b>${f(sd)}</b></div><div><em>CV %</em><b>${(sd / m * 100).toFixed(2)}</b></div></div>
<div class="sp-tw"><table class="sp-tbl"><thead><tr><th>Limit</th><th>Low</th><th>High</th></tr></thead><tbody>${[1, 2, 3].map(k => `<tr><td><b>±${k} SD</b></td><td>${f(m - k * sd)}</td><td>${f(m + k * sd)}</td></tr>`).join('')}</tbody></table></div>${n < 20 ? '<p class="sp-note">⚠️ Fewer than 20 values — treat limits as provisional.</p>' : ''}${ljSVG(v, m, sd, v.map(x => (Math.abs(x - m) > 3 * sd ? 2 : Math.abs(x - m) > 2 * sd ? 1 : 0)))}<button class="sp-btn" data-sa="usews">Use this mean & SD in the Westgard checker</button>` : '<p class="sp-note">Enter at least two values.</p>'}</div>`;
    },
    rcf: () => {
      const r = parseFloat(TS.r), rpm = parseFloat(TS.rpm), g = r > 0 && rpm > 0 ? 1.118e-5 * r * rpm * rpm : NaN, rc = parseFloat(TS.rcf), rp = r > 0 && rc > 0 ? Math.sqrt(rc / (1.118e-5 * r)) : NaN;
      return `<h3>🌀 RPM ⇄ RCF (g-force) calculator</h3><p class="sp-sub">RCF = 1.118 × 10⁻⁵ × radius (cm) × RPM². Radius = centre of rotor to the bottom of the tube.</p>
<div class="sp-in2"><label>Rotor radius (cm)<input data-sx="ts.r" inputmode="decimal" value="${E(TS.r)}"></label><label>Speed (RPM)<input data-sx="ts.rpm" inputmode="decimal" value="${E(TS.rpm)}"></label></div>
<div class="sp-res" id="sp-rcf1">${isFinite(g) ? `= <b>${Math.round(g)} × g</b>` : '—'}</div>
<div class="sp-in2"><label>Required RCF (× g)<input data-sx="ts.rcf" inputmode="decimal" value="${E(TS.rcf)}" placeholder="e.g. 1500"></label><label>&nbsp;<span class="sp-res sm" id="sp-rcf2">${isFinite(rp) ? `set <b>${Math.round(rp)} RPM</b>` : '—'}</span></label></div>`;
    },
    draw: () => {
      const L = [['bc', 'Blood culture bottles', 'Sterile — always first'], ['blue', 'Citrate (light blue)', 'Coagulation: PT, aPTT, D-dimer'], ['red', 'Plain / clot activator (red)', 'Serology, blood bank'], ['gold', 'SST gel (gold)', 'Chemistry, hormones, serology'], ['green', 'Heparin (green)', 'Plasma chemistry, ammonia (Li-hep), STAT tests'], ['lav', 'EDTA (lavender)', 'CBC, HbA1c, blood group, ESR (diluted), PTH'], ['grey', 'Fluoride-oxalate (grey)', 'Glucose, lactate, alcohol']];
      return `<h3>🧪 Order of draw (CLSI GP41)</h3><ol class="sp-draw">${L.map(([k, n, u], i) => `<li style="--c:${tube(k)[1]}"><span class="sp-cap"></span><div><b>${i + 1}. ${E(n)}</b><small>${E(u)}</small></div></li>`).join('')}</ol><p class="sp-note">Mnemonic: “<b>B</b>oys <b>C</b>an <b>R</b>un <b>G</b>reat <b>G</b>reen <b>L</b>awn <b>G</b>ames” — Blood culture, Citrate, Red, Gold, Green, Lavender, Grey.</p>`;
    },
    conv: () => {
      const C = CONV(), k = C[TS.cv] ? TS.cv : Object.keys(C)[0], c = C[k], x = parseFloat(TS.cvv), out = isFinite(x) ? (TS.dir ? x / c[2] : x * c[2]) : NaN;
      return `<h3>🔁 Unit converter</h3><label class="sp-in1">Analyte<select data-sx="ts.cv">${Object.entries(C).map(([id, a]) => `<option value="${id}"${id === k ? ' selected' : ''}>${E(a[0])}</option>`).join('')}</select></label>
<div class="sp-in2"><label>${E(TS.dir ? c[3] : c[1])}<input data-sx="ts.cvv" inputmode="decimal" value="${E(TS.cvv)}"></label><label>&nbsp;<button class="sp-btn" data-sa="cvdir">⇄ Swap</button></label></div>
<div class="sp-res" id="sp-cvo">${isFinite(out) ? `= <b>${+out.toPrecision(5)} ${E(TS.dir ? c[1] : c[3])}</b>` : '—'}</div><p class="sp-note">Factor: ${E(c[1])} × ${c[2]} = ${E(c[3])}</p>`;
    }
  };
  const CONV = () => {
    const g = GD('conv'), o = {};
    g.sec[0].tb.r.forEach((r, i) => { const f = parseFloat(r[2]); if (isFinite(f) && /^[\d.]+$/.test(r[2])) o[R(r[0])] = [r[0], r[1], f, r[3]]; });
    return o;
    function R(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, '-'); }
  };
  const refreshTool = () => { const g = GD(G.cur), el = $1('#sp-tool'); if (g && g.tool && el) { const a = document.activeElement, id = a && a.dataset && a.dataset.sx, pos = a && a.selectionStart; el.innerHTML = TOOLS[g.tool](); if (id) { const n = el.querySelector(`[data-sx="${id}"]`); if (n) { n.focus(); try { n.setSelectionRange(pos, pos); } catch (_) {} } } } };

  /* ---------------- copy text ---------------- */
  const asText = k => {
    if (k[0] === 't') {
      const t = T(k.slice(2)), L = [t.n, `Dept: ${t.dept} · Specimen: ${t.sp} · Container: ${tube(t.tube)[0]} · Volume: ${t.vol}`, 'Collection: ' + t.time];
      const add = (h, a) => a && a.length && L.push('', h + ':', ...a.map(x => '• ' + x));
      add('Precautions', t.pre); add('Processing', t.proc);
      if (t.ref) L.push('', 'Reference values:', ...t.ref.r.map(r => `• ${r[0]}: ${r[1]}${r[2] ? ' (' + r[2] + ')' : ''}`));
      add('Increased in', t.hi); add('Decreased in', t.lo); add('Correlation', t.corr); add('Patient history', t.hx);
      if (t.crit) L.push('', 'Critical: ' + t.crit);
      return L.join('\n');
    }
    const g = GD(k.slice(2));
    return [g.n, ...g.sec.flatMap(s => ['', s.h + ':', ...(s.li || []).map(x => '• ' + x), ...(s.st || []).map((x, i) => i + 1 + '. ' + x), ...(s.tb ? s.tb.r.map(r => r.join(' | ')) : []), ...(s.tip ? [s.tip] : [])])].join('\n');
  };

  /* ---------------- routing & events ---------------- */
  const route = () => { const h = location.hash, m = h.match(/[?&]([tg])=([\w-]+)/); return m ? { k: m[1], id: m[2] } : null; };
  G.view = () => {
    const r = route();
    G.cur = r ? r.id : '';
    if (r) {
      const key = r.k + ':' + r.id, item = r.k === 't' ? T(r.id) : GD(r.id);
      if (item) { rec = [key, ...rec.filter(x => x !== key)].slice(0, 8); ST2.set('sopr', rec); return r.k === 't' ? testView(item) : guideView(item); }
    }
    return home();
  };
  window.VW = window.VW || {};
  VW.sop = G.view;
  const redraw = () => { const el = $1('#sp'); if (!el) return; const y = scrollY; el.outerHTML = G.view(); scrollTo(0, y); };

  document.addEventListener('click', e => {
    const b = e.target.closest('[data-sa]');
    if (!b) return;
    const a = b.dataset.sa, v = b.dataset.v;
    e.preventDefault();
    if (a === 'open') { location.hash = 'sop'; return; }
    if (a === 'back') { if (history.length > 1 && /#sop\?/.test(location.hash)) history.back(); else location.hash = /#sop\?/.test(location.hash) ? 'sop' : 'home'; return; }
    if (a === 'focus') { if (!/^#sop$/.test(location.hash)) location.hash = 'sop'; setTimeout(() => { const q = $1('#spq'); q && q.focus(); }, 80); return; }
    if (a === 'tab') { U.tab = v; U.f = ''; }
    else if (a === 'by') { U.by = v; U.f = ''; }
    else if (a === 'f') U.f = v;
    else if (a === 'gc') U.gc = v;
    else if (a === 'u') U.u = +v;
    else if (a === 'qclr') { U.q = ''; }
    else if (a === 'fav') { const k = b.dataset.k; fav = isFav(k) ? fav.filter(x => x !== k) : [k, ...fav]; ST2.set('sopf', fav); if (window.toast) toast(isFav(k) ? 'Bookmarked' : 'Bookmark removed'); }
    else if (a === 'copy') { const t = asText(b.dataset.k); (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => window.toast && toast('Copied'), () => window.cp && cp(t)); return; }
    else if (a === 'usews') { const vv = nums(TS.st), n = vv.length, m = vv.reduce((x, y) => x + y, 0) / n, sd = Math.sqrt(vv.reduce((x, y) => x + (y - m) * (y - m), 0) / (n - 1)); TS.mean = m.toPrecision(5); TS.sd = sd.toPrecision(4); saveTS(); location.hash = 'sop?g=westgard'; return; }
    else if (a === 'cvdir') { TS.dir = TS.dir ? 0 : 1; saveTS(); refreshTool(); return; }
    redraw();
  });
  let qT;
  document.addEventListener('input', e => {
    const el = e.target, k = el.dataset && el.dataset.sx;
    if (!k) return;
    if (k === 'q') { U.q = el.value; clearTimeout(qT); qT = setTimeout(() => { const l = $1('#spl'); if (l) l.innerHTML = listBody(); const hero = $1('.sp-quick'), sg = $1('#sp > .sp-seg'); if (hero) hero.style.display = U.q ? 'none' : ''; if (sg) sg.style.display = U.q ? 'none' : ''; }, 120); return; }
    if (k.startsWith('ts.')) { TS[k.slice(3)] = el.value; saveTS(); clearTimeout(qT); qT = setTimeout(refreshTool, el.tagName === 'SELECT' ? 0 : 250); }
  });
  document.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.id === 'spq') e.target.blur(); });

  /* ---------------- header: book icon beside search; own header on guide pages ---------------- */
  const bar0 = window.bar;
  if (typeof bar0 === 'function') {
    window.bar = function (tab, t) {
      bar0(tab, t);
      const b = $1('#bar');
      if (!b) return;
      if (!t && /^#sop/.test(location.hash)) {
        const r = route(), it = r && (r.k === 't' ? T(r.id) : GD(r.id));
        b.innerHTML = `<button class="ib" data-sa="back" aria-label="Back">${ico('back')}</button><h1>${it ? E(it.n.split(' (')[0]) : 'SOP Guidebook'}</h1><button class="ib" data-sa="focus" aria-label="Search guidebook">${ico('search')}</button>`;
        document.title = (it ? it.n + ' · ' : '') + 'SOP Guidebook | LabGenie';
      } else if (!t) {
        const s = b.querySelector('[data-a="srch"]');
        if (s && !b.querySelector('[data-sa="open"]')) s.insertAdjacentHTML('beforebegin', `<button class="ib sp-bk" data-sa="open" aria-label="SOP guidebook" title="SOP guidebook">${ico('book')}</button>`);
      }
    };
  }
  if (typeof render === 'function') render();
})();
