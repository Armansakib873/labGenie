/* =====================================================================
   LabGenie SOP Guidebook · micro.js — Microbiology workspace
   A structured notebook for the laboratory's OWN validated microbiology
   references. Ships empty: every organism, medium and specimen entry is
   typed or imported by the user from their textbook / lab SOP.
   • Media library  • Specimen → media map  • Organism cards
   • Drawings built from the entered traits (cells, Gram colour, plates)
   • Organism finder  • Quiz generated from the user's cards
   • CSV / JSON import & export, "validated" flag per entry
   Everything is stored on this device (localStorage key lg.mb).
   ===================================================================== */
(function () {
  'use strict';
  const G = (window.SOPG = window.SOPG || {});
  G.GCATS.includes('Microbiology') || G.GCATS.push('Microbiology');
  const E = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const ST2 = { get: (k, d) => { try { const v = localStorage.getItem('lg.' + k); return v == null ? d : JSON.parse(v); } catch (_) { return d; } }, set: (k, v) => { try { localStorage.setItem('lg.' + k, JSON.stringify(v)); } catch (_) { toast('Storage is full — export a backup'); } } };
  const toast = m => { try { window.toast && window.toast(m); } catch (_) {} };
  G.TOOLX = G.TOOLX || {};
  G.ACT = G.ACT || {};
  const refresh = () => G.refreshTool && G.refreshTool();
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const low = s => String(s || '').trim().toLowerCase();

  /* ---------------- data ---------------- */
  let D = ST2.get('mb', null) || {};
  ['media', 'spec', 'org'].forEach(k => Array.isArray(D[k]) || (D[k] = []));
  const save = () => ST2.set('mb', D);

  /* trait vocabulary (category labels only — the values come from the user) */
  const V = {
    gram: [['pos', 'Gram positive'], ['neg', 'Gram negative'], ['var', 'Gram variable'], ['na', 'Not Gram-stained / N/A']],
    shape: [['cocci', 'Cocci'], ['bacilli', 'Bacilli (rods)'], ['cocb', 'Coccobacilli'], ['curved', 'Curved / comma'], ['spiral', 'Spiral'], ['pleo', 'Pleomorphic'], ['yeast', 'Yeast (budding)'], ['other', 'Other']],
    arr: [['single', 'Single'], ['pairs', 'Pairs'], ['chains', 'Chains'], ['clusters', 'Clusters'], ['tetrads', 'Tetrads'], ['palisade', 'Palisade / angular'], ['other', 'Other']],
    o2: [['aer', 'Obligate aerobe'], ['ana', 'Obligate anaerobe'], ['fac', 'Facultative anaerobe'], ['micro', 'Microaerophilic']],
    lac: [['lf', 'Lactose fermenter (LF)'], ['late', 'Late LF'], ['nlf', 'Non-lactose fermenter (NLF)'], ['na', 'Not applicable']],
    hae: [['a', 'Alpha (α)'], ['b', 'Beta (β)'], ['g', 'Gamma (γ, none)'], ['na', 'Not applicable']],
    mot: [['y', 'Motile'], ['n', 'Non-motile']],
    spore: [['y', 'Spore former'], ['n', 'Non-spore former']],
    cap: [['y', 'Capsulated'], ['n', 'Non-capsulated']]
  };
  const TR = [['gram', 'Gram reaction'], ['shape', 'Shape'], ['arr', 'Arrangement'], ['o2', 'Oxygen'], ['lac', 'Lactose'], ['hae', 'Haemolysis'], ['mot', 'Motility'], ['spore', 'Spores'], ['cap', 'Capsule']];
  const LB = (k, v) => { const r = (V[k] || []).find(x => x[0] === v); return r ? r[1] : ''; };
  const SIZES = [['s', 'Small'], ['m', 'Medium'], ['l', 'Large']];
  const media = n => D.media.find(m => low(m.n) === low(n));

  /* ---------------- colour helpers ---------------- */
  let cx0;
  const hex = c => { if (!c) return ''; if (/^#[0-9a-f]{6}$/i.test(c)) return c.toLowerCase(); try { cx0 = cx0 || document.createElement('canvas').getContext('2d'); cx0.fillStyle = '#000001'; cx0.fillStyle = String(c).trim(); return cx0.fillStyle === '#000001' ? '' : cx0.fillStyle; } catch (_) { return ''; } };
  const GC = { pos: '#6b2fa0', neg: '#e0457b', var: '#a05a9c', na: '#8a8f98' };

  /* ---------------- drawings ---------------- */
  /* deterministic pseudo-random from a string, so a card always looks the same */
  const rng = s => { let h = 2166136261; for (const ch of String(s)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909)) >>> 0) / 4294967296; };

  const unit = (sh, x, y, a, c) => {
    const t = `transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${a.toFixed(0)})"`, f = `fill="${c}"`;
    switch (sh) {
      case 'bacilli': return `<rect ${t} x="-8" y="-2.8" width="16" height="5.6" rx="2.8" ${f}/>`;
      case 'cocb': return `<rect ${t} x="-4.6" y="-3" width="9.2" height="6" rx="3" ${f}/>`;
      case 'curved': return `<path ${t} d="M-7 2 Q0 -6 7 2" stroke="${c}" stroke-width="3.6" stroke-linecap="round" fill="none"/>`;
      case 'spiral': return `<path ${t} d="M-12 0 q3 -5 6 0 t6 0 t6 0 t6 0" stroke="${c}" stroke-width="2.4" stroke-linecap="round" fill="none"/>`;
      case 'pleo': return `<path ${t} d="M-7 -1 q2 -4 6 -2 q5 1 7 4 q-1 3 -6 2 q-5 1 -7 -4z" ${f}/>`;
      case 'yeast': return `<g ${t}><ellipse rx="6" ry="4.8" ${f}/><circle cx="6.6" cy="-3.2" r="2.4" ${f}/></g>`;
      case 'other': return `<rect ${t} x="-4" y="-4" width="8" height="8" rx="2" ${f}/>`;
      default: return `<circle ${t} r="3.6" ${f}/>`;
    }
  };
  /* positions for an arrangement inside a 120×80 field */
  const layout = (arr, sh, r) => {
    const P = [], rod = sh === 'bacilli' || sh === 'cocb' || sh === 'pleo', step = rod ? (sh === 'bacilli' ? 17 : 10) : sh === 'yeast' ? 13 : 8;
    const jit = k => (r() - 0.5) * k;
    const chain = (x, y, n, ang) => { const rad = (ang * Math.PI) / 180; for (let i = 0; i < n; i++) { const a2 = ang + jit(18); P.push([x + Math.cos(rad) * step * i + jit(1.2), y + Math.sin(rad) * step * i + jit(1.2) + (rod ? 0 : Math.sin(i * 0.9) * 2), rod ? a2 : 0]); } };
    switch (arr) {
      case 'pairs': for (let i = 0; i < 5; i++) { const x = 16 + r() * 88, y = 14 + r() * 52, a = r() * 180; const rad = (a * Math.PI) / 180; P.push([x, y, rod ? a : 0], [x + Math.cos(rad) * step, y + Math.sin(rad) * step, rod ? a : 0]); } break;
      case 'chains': chain(10, 22, rod ? 6 : 12, 8); chain(14, 58, rod ? 5 : 11, -6); break;
      case 'clusters': [[38, 38], [82, 44]].forEach(([cx, cy]) => { for (let i = 0; i < 13; i++) { const a = r() * 6.28, d = Math.sqrt(r()) * (rod ? 16 : 13); P.push([cx + Math.cos(a) * d, cy + Math.sin(a) * d, r() * 180]); } }); break;
      case 'tetrads': [[26, 24], [74, 22], [46, 58], [92, 58]].forEach(([cx, cy]) => [[0, 0], [step, 0], [0, step], [step, step]].forEach(([dx, dy]) => P.push([cx + dx + jit(0.8), cy + dy + jit(0.8), 0]))); break;
      case 'palisade': for (let i = 0; i < 7; i++) P.push([22 + i * 6.5 + jit(1), 30 + jit(3), 90 + jit(14)]); for (let i = 0; i < 4; i++) P.push([70 + i * 9, 56 + (i % 2 ? 6 : -6), i % 2 ? 35 : -35]); break;
      default: for (let i = 0; i < 9; i++) P.push([12 + r() * 96, 12 + r() * 56, r() * 180]);
    }
    return P;
  };
  const cells = (o, cls) => {
    const sh = o.shape || 'cocci', c = GC[o.gram] || GC.na, r = rng((o.n || '') + sh + (o.arr || ''));
    const P = layout(o.arr || 'single', sh, r);
    return `<svg class="mb-d ${cls || ''}" viewBox="0 0 120 80" role="img" aria-label="Cell shape drawing"><rect width="120" height="80" rx="10" fill="#f6f1ea"/>${o.cap === 'y' ? P.map(([x, y]) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${sh === 'bacilli' ? 10 : 6.4}" fill="#fff" opacity=".75"/>`).join('') : ''}${P.map(([x, y, a]) => unit(sh, x, y, a, c)).join('')}</svg>`;
  };
  const HALO = { b: 'rgba(255,248,235,.82)', a: 'rgba(98,150,70,.55)' };
  const CSZ = { s: 2.6, m: 4.2, l: 6.2 };
  const plate = (mc, col, opt) => {
    opt = opt || {};
    const base = hex(mc) || '#e9e2d0', cc = hex(col) || '#f4f1e8', r = rng((opt.k || '') + base + cc), R = CSZ[opt.sz] || CSZ.m;
    let col2 = '';
    if (opt.col !== false && (col || opt.sz)) {
      const n = opt.sz === 'l' ? 11 : opt.sz === 's' ? 30 : 18, pts = [];
      for (let i = 0; i < n * 3 && pts.length < n; i++) { const a = r() * 6.28, d = Math.sqrt(r()) * 40; const x = 60 + Math.cos(a) * d, y = 60 + Math.sin(a) * d; if (pts.every(([px, py]) => (px - x) ** 2 + (py - y) ** 2 > (R * 2.6) ** 2)) pts.push([x, y]); }
      const h = HALO[opt.hae];
      col2 = (h ? pts.map(([x, y]) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(R * 2).toFixed(1)}" fill="${h}"/>`).join('') : '') + pts.map(([x, y]) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(R * (0.8 + r() * 0.35)).toFixed(1)}" fill="${cc}" stroke="rgba(0,0,0,.18)" stroke-width=".5"/><circle cx="${(x - R * 0.3).toFixed(1)}" cy="${(y - R * 0.3).toFixed(1)}" r="${(R * 0.28).toFixed(1)}" fill="#fff" opacity=".35"/>`).join('');
    }
    return `<svg class="mb-d mb-pl ${opt.cls || ''}" viewBox="0 0 120 120" role="img" aria-label="Plate drawing"><circle cx="60" cy="60" r="57" fill="#eef2f5" stroke="#b8c2cc" stroke-width="1.5"/><circle cx="60" cy="60" r="51" fill="${base}"/><circle cx="60" cy="60" r="51" fill="url(#mbsh)"/>${col2}<ellipse cx="42" cy="30" rx="22" ry="8" fill="#fff" opacity=".22" transform="rotate(-28 42 30)"/><defs><radialGradient id="mbsh" cx=".5" cy=".5" r=".5"><stop offset=".7" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".16"/></radialGradient></defs></svg>`;
  };
  const gchip = g => (g ? `<span class="mb-gc" style="--c:${GC[g] || GC.na}">${E(LB('gram', g))}</span>` : '');
  const tag = (k, v) => (v ? `<i class="mb-t">${E(LB(k, v))}</i>` : '');
  const vbadge = x => (x.ok ? '<span class="mb-ok">✔ Validated</span>' : '<span class="mb-nv">Unverified</span>');
  const dot = n => { const m = media(n); return `<span class="mb-md"><i style="background:${E(hex(m && m.col) || '#ddd')}"></i>${E(n)}</span>`; };
  const empty = (msg, act, lbl) => `<div class="mb-empty"><b>${msg}</b>${act ? `<button class="qz-go" data-sa="${act}">${lbl}</button>` : ''}<button class="sp-btn" data-sa="mbgo" data-v="mbdata">Import from CSV / backup</button></div>`;

  /* ---------------- shared helpers for forms ---------------- */
  const sel = (key, list, cur, ph) => `<select data-sx="${key}"><option value="">${ph || '—'}</option>${list.map(([v, l]) => `<option value="${E(v)}"${cur === v ? ' selected' : ''}>${E(l)}</option>`).join('')}</select>`;
  const inp = (key, cur, ph, lbl, area) => `<label>${lbl}${area ? `<textarea data-sx="${key}" placeholder="${E(ph || '')}">${E(cur || '')}</textarea>` : `<input data-sx="${key}" value="${E(cur || '')}" placeholder="${E(ph || '')}" autocomplete="off">`}</label>`;
  const mlist = () => `<datalist id="mb-ml">${D.media.map(m => `<option value="${E(m.n)}">`).join('')}</datalist>`;
  const okBox = (key, cur) => `<label class="mb-ck"><input type="checkbox" data-sx="${key}"${cur ? ' checked' : ''}> I have checked this entry against my source (mark as validated)</label>`;

  /* ======================= ORGANISM CARDS ======================= */
  const O = { v: 'list', id: '', d: null, q: '', g: '' };
  const blankOrg = () => ({ id: '', n: '', cls: '', gram: '', shape: '', arr: '', o2: '', lac: '', hae: '', mot: '', spore: '', cap: '', dis: '', tests: '', notes: '', src: '', ok: false, mg: [] });
  const orgRow = o => `<button class="mb-row" data-sa="mbo" data-v="${o.id}">${cells(o, 'mb-th')}<span class="mb-rt"><b>${E(o.n)}</b><small>${[LB('gram', o.gram), LB('shape', o.shape), LB('arr', o.arr)].filter(Boolean).map(E).join(' · ') || 'Traits not entered'}</small><span class="mb-tg">${tag('o2', o.o2)}${tag('lac', o.lac)}${tag('hae', o.hae)}${o.ok ? '' : '<i class="mb-t mb-tn">Unverified</i>'}</span></span></button>`;
  const orgCard = o => {
    const rows = TR.filter(([k]) => o[k]).map(([k, l]) => `<tr><th>${l}</th><td>${E(LB(k, o[k]))}</td></tr>`).join('');
    return `<div class="mb-card"><div class="mb-ch"><button class="mb-bk" data-sa="mbol" aria-label="Back to list">‹ All organisms</button>${vbadge(o)}</div>
<h3 class="mb-nm">${E(o.n)}</h3>${o.cls ? `<p class="mb-cls">${E(o.cls)}</p>` : ''}
<div class="mb-hero">${cells(o, 'mb-big')}<div class="mb-hs">${gchip(o.gram)}<span>${E([LB('shape', o.shape), LB('arr', o.arr)].filter(Boolean).join(' in ') || 'Shape not entered')}</span>${o.cap === 'y' ? '<small>Halo = capsule</small>' : ''}</div></div>
${rows ? `<div class="sp-tw"><table class="sp-tbl mb-tr"><tbody>${rows}</tbody></table></div>` : ''}
${o.mg.length ? `<h5 class="pf-h">Appearance on media</h5><div class="mb-pg">${o.mg.map((g, i) => { const m = media(g.m); return `<figure>${plate(m && m.col, g.col, { sz: g.sz || 'm', hae: g.hae || (m && /blood/i.test(m.n) ? o.hae : ''), k: o.n + i })}<figcaption><b>${E(g.m || 'Medium')}</b>${g.desc ? `<span>${E(g.desc)}</span>` : ''}</figcaption></figure>`; }).join('')}</div>` : ''}
${o.dis ? `<h5 class="pf-h">Diseases / clinical significance</h5><p class="mb-p">${E(o.dis)}</p>` : ''}
${o.tests ? `<h5 class="pf-h">Key identification tests</h5><p class="mb-p">${E(o.tests)}</p>` : ''}
${o.notes ? `<h5 class="pf-h">Notes</h5><p class="mb-p">${E(o.notes)}</p>` : ''}
${o.src ? `<p class="mb-src">Source: ${E(o.src)}</p>` : ''}
<div class="mb-acts"><button class="qz-go" data-sa="mboe" data-v="${o.id}">✏️ Edit</button><button class="sp-btn" data-sa="mbod" data-v="${o.id}">🗑 Delete</button></div></div>`;
  };
  const orgForm = () => {
    const d = O.d;
    return `<div class="mb-form"><div class="mb-ch"><button class="mb-bk" data-sa="mbox">‹ Cancel</button><b>${d.id ? 'Edit organism' : 'New organism'}</b></div>
<div class="mb-prev">${cells(d, 'mb-big')}<div>${gchip(d.gram)}<small>Live preview from the traits you pick</small></div></div>
${inp('mb.o.n', d.n, 'Organism name', 'Name *')}${inp('mb.o.cls', d.cls, 'Family / group / class', 'Classification')}
<div class="mb-g2">${TR.map(([k, l]) => `<label>${l}${sel('mb.o.' + k, V[k], d[k])}</label>`).join('')}</div>
<h5 class="pf-h">Appearance on media</h5>${mlist()}
${d.mg.map((g, i) => { const m = media(g.m); return `<div class="mb-mg">${plate(m && m.col, g.col, { sz: g.sz || 'm', hae: g.hae, k: d.n + i, cls: 'mb-mini' })}<div class="mb-mgf"><input data-sx="mb.om.${i}.m" list="mb-ml" value="${E(g.m)}" placeholder="Medium name"><div class="mb-g3"><label>Colony<input type="color" data-sx="mb.om.${i}.col" value="${E(hex(g.col) || '#f4f1e8')}"></label><label>Size${sel('mb.om.' + i + '.sz', SIZES, g.sz || 'm', 'Size')}</label><label>Zone${sel('mb.om.' + i + '.hae', V.hae.slice(0, 3), g.hae, 'none')}</label></div><textarea data-sx="mb.om.${i}.desc" placeholder="Colony description (size, colour, shape, smell, pigment…)">${E(g.desc)}</textarea><button class="mb-rm" data-sa="mbomr" data-v="${i}">Remove medium</button></div></div>`; }).join('')}
<button class="sp-btn" data-sa="mboma">＋ Add medium appearance</button>
${inp('mb.o.dis', d.dis, 'Diseases caused, clinical significance', 'Diseases', 1)}${inp('mb.o.tests', d.tests, 'Biochemical / identification tests and expected results', 'Key tests', 1)}${inp('mb.o.notes', d.notes, 'Anything else', 'Notes', 1)}${inp('mb.o.src', d.src, 'Book, edition, page / lab SOP number', 'Source')}
${okBox('mb.o.ok', d.ok)}
<div class="mb-acts"><button class="qz-go" data-sa="mbos">💾 Save organism</button><button class="sp-btn" data-sa="mbox">Cancel</button></div></div>`;
  };
  G.TOOLX.mborg = () => {
    if (O.v === 'edit' && O.d) return orgForm();
    const cur = O.v === 'card' && D.org.find(o => o.id === O.id);
    if (cur) return orgCard(cur);
    const q = low(O.q), L = D.org.filter(o => (!O.g || o.gram === O.g) && (!q || low([o.n, o.cls, o.dis, o.tests, o.notes].join(' ')).includes(q))).sort((a, b) => a.n.localeCompare(b.n));
    return `<h3>🦠 Organism cards</h3><p class="sp-sub">Your own reference cards — ${D.org.length} saved on this device.</p>
${D.org.length ? `<label class="mb-s"><input data-sx="mb.q" value="${E(O.q)}" placeholder="Search name, disease, test…" autocomplete="off"></label><div class="pf-ch">${[['', 'All'], ...V.gram.slice(0, 3)].map(([v, l]) => `<button class="${O.g === v ? 'on' : ''}" data-sa="mbog" data-v="${v}">${E(l)}</button>`).join('')}</div>
<button class="qz-go" data-sa="mbon">＋ Add organism</button><div class="mb-list">${L.map(orgRow).join('') || '<div class="sp-empty">No match.</div>'}</div>` : empty('No organisms yet. Add your first card, or import a CSV.', 'mbon', '＋ Add organism')}`;
  };
  G.ACT.mbo = (b, v) => { O.v = 'card'; O.id = v; refresh(); top(); };
  G.ACT.mbol = () => { O.v = 'list'; refresh(); };
  G.ACT.mbog = (b, v) => { O.g = v; refresh(); };
  G.ACT.mbon = () => { O.d = blankOrg(); O.v = 'edit'; refresh(); top(); };
  G.ACT.mboe = (b, v) => { const o = D.org.find(x => x.id === v); if (!o) return; O.d = JSON.parse(JSON.stringify(o)); O.v = 'edit'; refresh(); top(); };
  G.ACT.mbox = () => { O.v = O.d && O.d.id ? 'card' : 'list'; O.d = null; refresh(); };
  G.ACT.mboma = () => { O.d.mg.push({ m: '', col: '', sz: 'm', hae: '', desc: '' }); refresh(); };
  G.ACT.mbomr = (b, v) => { O.d.mg.splice(+v, 1); refresh(); };
  G.ACT.mbos = () => {
    const d = O.d; d.n = String(d.n || '').trim();
    if (!d.n) { toast('Enter the organism name'); return; }
    const dup = D.org.find(o => low(o.n) === low(d.n) && o.id !== d.id);
    if (dup) { toast('An organism with this name already exists'); return; }
    d.mg = d.mg.filter(g => g.m || g.desc);
    if (!d.id) { d.id = uid(); D.org.push(d); } else D.org[D.org.findIndex(o => o.id === d.id)] = d;
    d.t = Date.now(); save(); O.id = d.id; O.v = 'card'; O.d = null; refresh(); toast('Saved');
  };
  G.ACT.mbod = (b, v) => { const o = D.org.find(x => x.id === v); if (!o) return; del(`Delete “${o.n}”?`, () => { D.org = D.org.filter(x => x.id !== v); save(); O.v = 'list'; refresh(); toast('Deleted'); }); };

  /* ======================= MEDIA LIBRARY ======================= */
  const M = { d: null };
  const mediaForm = () => { const d = M.d; return `<div class="mb-form mb-inl"><div class="mb-prev">${plate(d.col, '', { col: false, cls: 'mb-mid' })}<div><b>${E(d.n || 'New medium')}</b><small>Plate colour preview</small></div></div>${inp('mb.m.n', d.n, 'e.g. Blood agar', 'Medium name *')}<div class="mb-g2"><label>Plate colour<input type="color" data-sx="mb.m.col" value="${E(hex(d.col) || '#e9e2d0')}"></label>${inp('mb.m.type', d.type, 'Enriched / selective / differential…', 'Type')}</div>${inp('mb.m.notes', d.notes, 'Purpose, principle, incubation, QC organisms…', 'Notes', 1)}${inp('mb.m.src', d.src, 'Book / SOP reference', 'Source')}${okBox('mb.m.ok', d.ok)}<div class="mb-acts"><button class="qz-go" data-sa="mbms">💾 Save medium</button><button class="sp-btn" data-sa="mbmx">Cancel</button>${d.id ? `<button class="sp-btn" data-sa="mbmd" data-v="${d.id}">🗑 Delete</button>` : ''}</div></div>`; };
  G.TOOLX.mbmedia = () => {
    if (M.d) return mediaForm();
    const L = [...D.media].sort((a, b) => a.n.localeCompare(b.n));
    const used = n => D.spec.filter(s => s.m.some(x => low(x) === low(n))).length + D.org.filter(o => o.mg.some(g => low(g.m) === low(n))).length;
    return `<h3>🧫 Media library</h3><p class="sp-sub">${D.media.length} media · colours are used for every plate drawing in the app.</p>
${L.length ? `<button class="qz-go" data-sa="mbmn">＋ Add medium</button><div class="mb-mg2">${L.map(m => `<button class="mb-mc" data-sa="mbme" data-v="${m.id}">${plate(m.col, '', { col: false, cls: 'mb-mid' })}<b>${E(m.n)}</b>${m.type ? `<small>${E(m.type)}</small>` : ''}${m.notes ? `<span>${E(m.notes)}</span>` : ''}<em>${used(m.n)} links · ${m.ok ? '✔ validated' : 'unverified'}</em></button>`).join('')}</div>` : empty('No media yet. Add the media your lab uses.', 'mbmn', '＋ Add medium')}`;
  };
  G.ACT.mbmn = () => { M.d = { id: '', n: '', col: '#e9e2d0', type: '', notes: '', src: '', ok: false }; refresh(); top(); };
  G.ACT.mbme = (b, v) => { const m = D.media.find(x => x.id === v); if (m) { M.d = { ...m }; refresh(); top(); } };
  G.ACT.mbmx = () => { M.d = null; refresh(); };
  G.ACT.mbms = () => {
    const d = M.d; d.n = String(d.n || '').trim();
    if (!d.n) { toast('Enter the medium name'); return; }
    const old = d.id && D.media.find(m => m.id === d.id), dup = D.media.find(m => low(m.n) === low(d.n) && m.id !== d.id);
    if (dup) { toast('A medium with this name already exists'); return; }
    if (old && old.n !== d.n) { D.spec.forEach(s => (s.m = s.m.map(x => (low(x) === low(old.n) ? d.n : x)))); D.org.forEach(o => o.mg.forEach(g => { if (low(g.m) === low(old.n)) g.m = d.n; })); }
    if (!d.id) { d.id = uid(); D.media.push(d); } else D.media[D.media.findIndex(m => m.id === d.id)] = d;
    save(); M.d = null; refresh(); toast('Saved');
  };
  G.ACT.mbmd = (b, v) => { const m = D.media.find(x => x.id === v); if (m) del(`Delete medium “${m.n}”? Specimen and organism entries keep its name.`, () => { D.media = D.media.filter(x => x.id !== v); save(); M.d = null; refresh(); }); };

  /* ======================= SPECIMEN → MEDIA MAP ======================= */
  const SP = { d: null, add: '' };
  const specForm = () => { const d = SP.d; return `<div class="mb-form mb-inl">${inp('mb.s.t', d.t, 'e.g. Urine, Blood, Pus, CSF, Sputum', 'Sample type *')}${inp('mb.s.n', d.n, 'e.g. Midstream urine, wound swab', 'Specimen name *')}
<h5 class="pf-h">Media to inoculate</h5><div class="pf-ch">${D.media.map(m => `<button class="${d.m.some(x => low(x) === low(m.n)) ? 'on' : ''}" data-sa="mbsm" data-v="${E(m.n)}"><i class="mb-dt" style="background:${E(hex(m.col))}"></i>${E(m.n)}</button>`).join('')}${d.m.filter(x => !media(x)).map(x => `<button class="on" data-sa="mbsm" data-v="${E(x)}">${E(x)} ✕</button>`).join('')}</div>
${mlist()}<div class="mb-addm"><input data-sx="mb.sadd" list="mb-ml" value="${E(SP.add)}" placeholder="Other medium name"><button class="sp-btn" data-sa="mbsa">Add</button></div>
${inp('mb.s.inc', d.inc, 'Temperature, atmosphere, duration', 'Incubation')}${inp('mb.s.notes', d.notes, 'Collection, transport, processing, quantitation…', 'Notes', 1)}${inp('mb.s.src', d.src, 'Book / SOP reference', 'Source')}${okBox('mb.s.ok', d.ok)}
<div class="mb-acts"><button class="qz-go" data-sa="mbss">💾 Save</button><button class="sp-btn" data-sa="mbsx">Cancel</button>${d.id ? `<button class="sp-btn" data-sa="mbsd" data-v="${d.id}">🗑 Delete</button>` : ''}</div></div>`; };
  G.TOOLX.mbspec = () => {
    if (SP.d) return specForm();
    const types = [...new Set(D.spec.map(s => s.t))].sort();
    return `<h3>🧪 Specimen → media map</h3><p class="sp-sub">Which plates to set up for each specimen — ${D.spec.length} entries.</p>
${D.spec.length ? `<button class="qz-go" data-sa="mbsn">＋ Add specimen</button>${types.map(t => `<h5 class="pf-h">${E(t)}</h5>${D.spec.filter(s => s.t === t).sort((a, b) => a.n.localeCompare(b.n)).map(s => `<button class="mb-sr" data-sa="mbse" data-v="${s.id}"><span class="mb-plr">${s.m.slice(0, 4).map((n, i) => { const m = media(n); return `<span style="z-index:${9 - i}">${plate(m && m.col, '', { col: false, cls: 'mb-tiny' })}</span>`; }).join('')}</span><span class="mb-rt"><b>${E(s.n)}</b><span class="mb-tg">${s.m.map(dot).join('')}</span>${s.inc ? `<small>🌡 ${E(s.inc)}</small>` : ''}${s.notes ? `<small>${E(s.notes)}</small>` : ''}${s.ok ? '' : '<i class="mb-t mb-tn">Unverified</i>'}</span></button>`).join('')}`).join('')}` : empty('No specimens yet. Add your media first, then map each specimen.', 'mbsn', '＋ Add specimen')}`;
  };
  G.ACT.mbsn = () => { SP.d = { id: '', t: '', n: '', m: [], inc: '', notes: '', src: '', ok: false }; SP.add = ''; refresh(); top(); };
  G.ACT.mbse = (b, v) => { const s = D.spec.find(x => x.id === v); if (s) { SP.d = JSON.parse(JSON.stringify(s)); SP.add = ''; refresh(); top(); } };
  G.ACT.mbsx = () => { SP.d = null; refresh(); };
  G.ACT.mbsm = (b, v) => { const d = SP.d; d.m = d.m.some(x => low(x) === low(v)) ? d.m.filter(x => low(x) !== low(v)) : [...d.m, v]; refresh(); };
  G.ACT.mbsa = () => { const v = String(SP.add || '').trim(); if (v && !SP.d.m.some(x => low(x) === low(v))) SP.d.m.push(v); SP.add = ''; refresh(); };
  G.ACT.mbss = () => {
    const d = SP.d; d.t = String(d.t || '').trim(); d.n = String(d.n || '').trim();
    if (!d.t || !d.n) { toast('Enter the sample type and specimen name'); return; }
    if (!d.id) { d.id = uid(); D.spec.push(d); } else D.spec[D.spec.findIndex(s => s.id === d.id)] = d;
    save(); SP.d = null; refresh(); toast('Saved');
  };
  G.ACT.mbsd = (b, v) => { const s = D.spec.find(x => x.id === v); if (s) del(`Delete “${s.n}”?`, () => { D.spec = D.spec.filter(x => x.id !== v); save(); SP.d = null; refresh(); }); };

  /* ======================= ORGANISM FINDER ======================= */
  const F = ST2.get('mbf', {});
  G.TOOLX.mbfind = () => {
    if (!D.org.length) return `<h3>🔎 Organism finder</h3>${empty('Add organism cards first — the finder searches your own cards.', 'mbgo2', 'Open organism cards')}`;
    const keys = Object.keys(F).filter(k => F[k]);
    const res = D.org.map(o => { let m = 0, x = 0, u = 0; keys.forEach(k => { if (!o[k]) u++; else if (o[k] === F[k]) m++; else x++; }); return { o, m, x, u }; });
    const exact = res.filter(r => keys.length && !r.x).sort((a, b) => b.m - a.m || a.u - b.u), close = res.filter(r => keys.length && r.x === 1 && r.m).sort((a, b) => b.m - a.m);
    return `<h3>🔎 Organism finder</h3><p class="sp-sub">Pick what you observed. Matches come from your ${D.org.length} organism cards.</p>
${TR.map(([k, l]) => `<h5 class="pf-h">${l}</h5><div class="pf-ch">${V[k].filter(v => v[0] !== 'na').map(([v, n]) => `<button class="${F[k] === v ? 'on' : ''}" data-sa="mbft" data-v="${k}:${v}">${E(n)}</button>`).join('')}</div>`).join('')}
<div class="pf-bar"><span>${keys.length} selected</span>${keys.length ? '<button data-sa="mbfc">Clear</button>' : ''}</div>
${!keys.length ? '<div class="sp-empty">Select at least one trait.</div>' : `<h5 class="pf-h">Matches (${exact.length})</h5><div class="mb-list">${exact.map(r => orgRow(r.o) + (r.u ? `<p class="mb-un">${r.u} selected trait(s) not filled in on this card</p>` : '')).join('') || '<div class="sp-empty">No card matches every trait.</div>'}</div>${close.length ? `<h5 class="pf-h">Close — one trait differs</h5><div class="mb-list">${close.map(r => orgRow(r.o)).join('')}</div>` : ''}`}`;
  };
  G.ACT.mbft = (b, v) => { const [k, x] = v.split(':'); F[k] = F[k] === x ? '' : x; ST2.set('mbf', F); refresh(); };
  G.ACT.mbfc = () => { Object.keys(F).forEach(k => delete F[k]); ST2.set('mbf', F); refresh(); };
  G.ACT.mbo2 = G.ACT.mbo;
  const goOrg = id => { O.v = 'card'; O.id = id; location.hash = 'sop?g=mborg'; };
  G.ACT.mbgo2 = () => { location.hash = 'sop?g=mborg'; };
  G.ACT.mbgo = (b, v) => { location.hash = 'sop?g=' + v; };

  /* ======================= QUIZ FROM YOUR CARDS ======================= */
  const shuf = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pick = (arr, n, not) => shuf([...new Set(arr.filter(x => x && x !== not))]).slice(0, n);
  const mkQ = () => {
    const Q = [], org = D.org.filter(o => o.n);
    org.forEach(o => {
      const desc = TR.filter(([k]) => o[k]).map(([k]) => LB(k, o[k]).toLowerCase());
      const others = pick(org.map(x => x.n), 3, o.n);
      if (desc.length >= 3 && others.length === 3) Q.push({ q: `Which organism in your cards is: ${desc.join(', ')}?`, o: shuf([o.n, ...others]), a: o.n, w: o });
      [['gram', 'What is the Gram reaction of'], ['hae', 'Which haemolysis does'], ['lac', 'Lactose fermentation of'], ['o2', 'Oxygen requirement of'], ['shape', 'Cell shape of']].forEach(([k, s]) => {
        if (!o[k]) return;
        const opts = pick(V[k].filter(v => v[0] !== 'na').map(v => v[1]), 3, LB(k, o[k]));
        if (opts.length >= 2) Q.push({ q: `${s} ${o.n}${k === 'hae' ? ' show on blood-containing media' : ''}?`, o: shuf([LB(k, o[k]), ...opts]), a: LB(k, o[k]), w: o });
      });
      o.mg.forEach(g => { if (!g.desc || !g.m) return; const others2 = pick(org.flatMap(x => x.mg.filter(y => y.desc && y.desc !== g.desc).map(y => y.desc)), 3); if (others2.length >= 2) Q.push({ q: `How does ${o.n} appear on ${g.m}?`, o: shuf([g.desc, ...others2]), a: g.desc, w: o }); });
    });
    D.spec.forEach(s => { if (!s.m.length) return; const ok = s.m.join(' + '), others = pick(D.spec.map(x => x.m.join(' + ')), 3, ok); if (others.length >= 2) Q.push({ q: `Which media are set up for ${s.n} (${s.t})?`, o: shuf([ok, ...others]), a: ok }); });
    return Q;
  };
  const Z = { st: 'home', L: [], i: 0, pick: null, s: 0, n: 10 };
  G.TOOLX.mbquiz = () => {
    if (Z.st === 'run') {
      const q = Z.L[Z.i], done = Z.pick != null;
      return `<div class="qz"><div class="qz-top"><button class="qz-x" data-sa="mbqh" aria-label="Quit">✕</button><div class="qz-pg"><i style="width:${(Z.i / Z.L.length) * 100}%"></i></div><span>${Z.i + 1}/${Z.L.length}</span></div>${q.w ? `<div class="mb-qd">${cells(done ? q.w : { shape: 'other' }, 'mb-th')}</div>` : ''}<p class="qz-q">${E(q.q)}</p>
<div class="qz-o">${q.o.map((t, k) => `<button class="${!done ? '' : t === q.a ? 'ok' : k === Z.pick ? 'no' : 'dim'}" data-sa="mbqa" data-v="${k}"${done ? ' disabled' : ''}><i>${'ABCD'[k]}</i><span>${E(t)}</span></button>`).join('')}</div>
${done ? `<div class="qz-fb ${q.o[Z.pick] === q.a ? 'ok' : 'no'}"><b>${q.o[Z.pick] === q.a ? '✅ Correct' : '❌ Answer: ' + E(q.a)}</b>${q.w ? `<p><a href="#sop?g=mborg" data-sa="mbqo" data-v="${q.w.id}">Open card for ${E(q.w.n)}</a></p>` : ''}</div><button class="qz-go" data-sa="mbqn">${Z.i + 1 < Z.L.length ? 'Next →' : 'Finish'}</button>` : ''}</div>`;
    }
    if (Z.st === 'done') return `<div class="qz"><div class="qz-res"><h4>${Z.s}/${Z.L.length} correct</h4><p>Questions are generated from your own cards.</p></div><div class="qz-btns"><button class="qz-go" data-sa="mbqg">↻ New round</button><button class="sp-btn" data-sa="mbqh">Back</button></div></div>`;
    const pool = mkQ().length;
    return `<div class="qz"><div class="qz-hero"><b>🦠 Quiz from your cards</b><p>${pool} possible questions from ${D.org.length} organisms and ${D.spec.length} specimens.</p></div>${pool >= 3 ? `<h5 class="pf-h">Questions</h5><div class="sp-seg">${[5, 10, 20].map(n => `<button class="${Z.n === n ? 'on' : ''}" data-sa="mbqk" data-v="${n}">${n}</button>`).join('')}</div><button class="qz-go" data-sa="mbqg">Start</button>` : '<div class="sp-empty">Add at least 4 organism cards with traits filled in to generate questions.</div>'}</div>`;
  };
  G.ACT.mbqk = (b, v) => { Z.n = +v; refresh(); };
  G.ACT.mbqg = () => { Z.L = shuf(mkQ()).slice(0, Z.n); Z.i = 0; Z.s = 0; Z.pick = null; Z.st = Z.L.length ? 'run' : 'home'; refresh(); };
  G.ACT.mbqa = (b, v) => { if (Z.pick != null) return; Z.pick = +v; if (Z.L[Z.i].o[Z.pick] === Z.L[Z.i].a) Z.s++; try { navigator.vibrate && navigator.vibrate(12); } catch (_) {} refresh(); };
  G.ACT.mbqn = () => { Z.i++; Z.pick = null; if (Z.i >= Z.L.length) Z.st = 'done'; refresh(); };
  G.ACT.mbqh = () => { Z.st = 'home'; refresh(); };
  G.ACT.mbqo = (b, v) => goOrg(v);

  /* ======================= IMPORT / EXPORT ======================= */
  const COLS = {
    org: ['name', 'class', 'gram', 'shape', 'arrangement', 'oxygen', 'lactose', 'haemolysis', 'motility', 'spore', 'capsule', 'diseases', 'key_tests', 'notes', 'source', 'media_appearance', 'validated'],
    media: ['name', 'colour', 'type', 'notes', 'source', 'validated'],
    spec: ['sample_type', 'specimen', 'media', 'incubation', 'notes', 'source', 'validated']
  };
  const FN = { org: 'labgenie-organisms.csv', media: 'labgenie-media.csv', spec: 'labgenie-specimens.csv' };
  const csvCell = v => (/[",\n\r]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v == null ? '' : v));
  const toCSV = rows => '﻿' + rows.map(r => r.map(csvCell).join(',')).join('\r\n');
  const parseCSV = t => {
    t = t.replace(/^﻿/, ''); const R = []; let row = [], c = '', q = 0;
    for (let i = 0; i < t.length; i++) {
      const ch = t[i];
      if (q) { if (ch === '"') { if (t[i + 1] === '"') { c += '"'; i++; } else q = 0; } else c += ch; }
      else if (ch === '"') q = 1; else if (ch === ',') { row.push(c); c = ''; }
      else if (ch === '\n' || ch === '\r') { if (ch === '\r' && t[i + 1] === '\n') i++; row.push(c); R.push(row); row = []; c = ''; }
      else c += ch;
    }
    if (c || row.length) { row.push(c); R.push(row); }
    return R.filter(r => r.some(x => String(x).trim()));
  };
  const ALIAS = { gram: { '+': 'pos', positive: 'pos', gp: 'pos', '-': 'neg', negative: 'neg', gn: 'neg', variable: 'var' }, hae: { alpha: 'a', 'α': 'a', beta: 'b', 'β': 'b', gamma: 'g', 'γ': 'g', none: 'g', non: 'g' }, lac: { lf: 'lf', nlf: 'nlf', 'late lf': 'late', non: 'nlf' }, o2: { aerobic: 'aer', anaerobic: 'ana', facultative: 'fac', microaerophilic: 'micro' }, mot: { yes: 'y', no: 'n', '+': 'y', '-': 'n', motile: 'y', 'non-motile': 'n' }, spore: { yes: 'y', no: 'n', '+': 'y', '-': 'n' }, cap: { yes: 'y', no: 'n', '+': 'y', '-': 'n' }, shape: { rods: 'bacilli', rod: 'bacilli', bacillus: 'bacilli', coccus: 'cocci', coccobacillus: 'cocb', comma: 'curved', yeast: 'yeast' }, arr: { pair: 'pairs', chain: 'chains', cluster: 'clusters', tetrad: 'tetrads' } };
  const norm = (k, x) => { x = low(x); if (!x) return ''; const L = V[k]; if (L.some(v => v[0] === x)) return x; if (ALIAS[k] && ALIAS[k][x]) return ALIAS[k][x]; const f = L.find(v => low(v[1]).startsWith(x)) || L.find(v => low(v[1]).includes(x)); return f ? f[0] : ''; };
  const yes = x => /^(1|y|yes|true|✔|validated)$/i.test(String(x || '').trim());
  const exportCSV = kind => {
    let rows;
    if (kind === 'org') rows = D.org.map(o => [o.n, o.cls, LB('gram', o.gram), LB('shape', o.shape), LB('arr', o.arr), LB('o2', o.o2), LB('lac', o.lac), LB('hae', o.hae), LB('mot', o.mot), LB('spore', o.spore), LB('cap', o.cap), o.dis, o.tests, o.notes, o.src, o.mg.map(g => [g.m, hex(g.col), (SIZES.find(s => s[0] === g.sz) || ['', ''])[1], g.hae ? LB('hae', g.hae) : '', g.desc].join(' : ')).join(' | '), o.ok ? 'yes' : '']);
    else if (kind === 'media') rows = D.media.map(m => [m.n, hex(m.col), m.type, m.notes, m.src, m.ok ? 'yes' : '']);
    else rows = D.spec.map(s => [s.t, s.n, s.m.join('; '), s.inc, s.notes, s.src, s.ok ? 'yes' : '']);
    dl(new Blob([toCSV([COLS[kind], ...rows])], { type: 'text/csv' }), FN[kind]);
  };
  const importCSV = text => {
    const R = parseCSV(text); if (!R.length) throw new Error('The file is empty');
    const h = R[0].map(x => low(x).replace(/\s+/g, '_')), ix = n => h.indexOf(n), g = (r, n) => (ix(n) >= 0 ? String(r[ix(n)] || '').trim() : '');
    let kind = h.includes('specimen') ? 'spec' : h.includes('media_appearance') || h.includes('gram') ? 'org' : h.includes('colour') || h.includes('color') ? 'media' : '';
    if (!kind) throw new Error('Unknown columns — use a LabGenie CSV template');
    let add = 0, upd = 0;
    R.slice(1).forEach(r => {
      if (kind === 'media') {
        const n = g(r, 'name'); if (!n) return;
        const rec = { n, col: hex(g(r, 'colour') || g(r, 'color')) || '#e9e2d0', type: g(r, 'type'), notes: g(r, 'notes'), src: g(r, 'source'), ok: yes(g(r, 'validated')) };
        const ex = media(n); if (ex) { Object.assign(ex, rec); upd++; } else { D.media.push({ id: uid(), ...rec }); add++; }
      } else if (kind === 'spec') {
        const t = g(r, 'sample_type'), n = g(r, 'specimen'); if (!t || !n) return;
        const rec = { t, n, m: g(r, 'media').split(/[;|]/).map(x => x.trim()).filter(Boolean), inc: g(r, 'incubation'), notes: g(r, 'notes'), src: g(r, 'source'), ok: yes(g(r, 'validated')) };
        const ex = D.spec.find(s => low(s.t) === low(t) && low(s.n) === low(n)); if (ex) { Object.assign(ex, rec); upd++; } else { D.spec.push({ id: uid(), ...rec }); add++; }
      } else {
        const n = g(r, 'name'); if (!n) return;
        const mg = g(r, 'media_appearance').split('|').map(x => x.trim()).filter(Boolean).map(x => { const p = x.split(':').map(y => y.trim()); let sz = 'm', hae = ''; const s2 = norm2(p[2]); if (s2) sz = s2; hae = p[3] ? norm('hae', p[3]) : ''; return { m: p[0] || '', col: hex(p[1]) || '', sz, hae, desc: p.slice(4).join(': ') || (p.length <= 2 ? '' : '') }; });
        const rec = { n, cls: g(r, 'class'), gram: norm('gram', g(r, 'gram')), shape: norm('shape', g(r, 'shape')), arr: norm('arr', g(r, 'arrangement')), o2: norm('o2', g(r, 'oxygen')), lac: norm('lac', g(r, 'lactose')), hae: norm('hae', g(r, 'haemolysis') || g(r, 'hemolysis')), mot: norm('mot', g(r, 'motility')), spore: norm('spore', g(r, 'spore')), cap: norm('cap', g(r, 'capsule')), dis: g(r, 'diseases'), tests: g(r, 'key_tests'), notes: g(r, 'notes'), src: g(r, 'source'), ok: yes(g(r, 'validated')), mg };
        const ex = D.org.find(o => low(o.n) === low(n)); if (ex) { Object.assign(ex, rec); upd++; } else { D.org.push({ id: uid(), ...rec }); add++; }
      }
    });
    save();
    return `${add} added, ${upd} updated (${{ org: 'organisms', media: 'media', spec: 'specimens' }[kind]})`;
  };
  const norm2 = x => { x = low(x); return x ? (SIZES.find(s => s[0] === x || low(s[1]).startsWith(x)) || [''])[0] : ''; };
  const importJSON = text => {
    const j = JSON.parse(text);
    if (!j || j.kind !== 'labgenie-micro') throw new Error('Not a LabGenie microbiology backup');
    let n = 0;
    (j.media || []).forEach(m => { const ex = media(m.n); if (ex) Object.assign(ex, m, { id: ex.id }); else D.media.push({ ...m, id: uid() }); n++; });
    (j.spec || []).forEach(s => { const ex = D.spec.find(x => low(x.t) === low(s.t) && low(x.n) === low(s.n)); if (ex) Object.assign(ex, s, { id: ex.id }); else D.spec.push({ ...s, id: uid(), m: s.m || [] }); n++; });
    (j.org || []).forEach(o => { const ex = D.org.find(x => low(x.n) === low(o.n)); if (ex) Object.assign(ex, o, { id: ex.id }); else D.org.push({ ...blankOrg(), ...o, id: uid(), mg: o.mg || [] }); n++; });
    save();
    return `${n} entries imported`;
  };
  const dl = (b, name) => { if (window.LGI && LGI.dl) LGI.dl(b, name); else { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = name; a.click(); } };
  const del = (m, fn) => { if (window.LGI && LGI.ask) LGI.ask(m, fn); else if (confirm(m)) fn(); };
  let fileIn;
  const pickFile = () => {
    if (!fileIn) { fileIn = document.createElement('input'); fileIn.type = 'file'; fileIn.accept = '.csv,.json,text/csv,application/json,text/plain'; fileIn.multiple = true; fileIn.style.display = 'none'; document.body.appendChild(fileIn);
      fileIn.addEventListener('change', async () => { const msgs = []; for (const f of fileIn.files) { try { const t = await f.text(); msgs.push(/^\s*\{/.test(t) ? importJSON(t) : importCSV(t)); } catch (e) { msgs.push(f.name + ': ' + (e.message || 'could not read')); } } fileIn.value = ''; refresh(); toast(msgs.join(' · ')); }); }
    fileIn.click();
  };
  G.TOOLX.mbdata = () => {
    const nv = D.org.filter(o => !o.ok).length + D.media.filter(o => !o.ok).length + D.spec.filter(o => !o.ok).length;
    return `<h3>📦 Import · export · backup</h3><div class="sp-kpi"><div><em>Organisms</em><b>${D.org.length}</b></div><div><em>Media</em><b>${D.media.length}</b></div><div><em>Specimens</em><b>${D.spec.length}</b></div><div><em>Unverified</em><b>${nv}</b></div></div>
<button class="qz-go" data-sa="mbimp">📥 Import CSV or backup file</button><p class="mb-hint">Pick one or more files. Rows with a name that already exists update that entry; nothing is deleted.</p>
<h5 class="pf-h">Blank CSV templates (open in Excel / Google Sheets, fill, save as CSV)</h5><div class="mb-acts mb-w"><button class="sp-btn" data-sa="mbtpl" data-v="media">Media template</button><button class="sp-btn" data-sa="mbtpl" data-v="spec">Specimen template</button><button class="sp-btn" data-sa="mbtpl" data-v="org">Organism template</button></div>
<h5 class="pf-h">Export</h5><div class="mb-acts mb-w"><button class="sp-btn" data-sa="mbcsv" data-v="media">Media CSV</button><button class="sp-btn" data-sa="mbcsv" data-v="spec">Specimens CSV</button><button class="sp-btn" data-sa="mbcsv" data-v="org">Organisms CSV</button><button class="sp-btn" data-sa="mbjson">Full backup (.json)</button></div>
<h5 class="pf-h">Danger zone</h5><button class="sp-btn mb-dz" data-sa="mbclr">Delete all microbiology data on this device</button>`;
  };
  G.MB = { importCSV: t => { const m = importCSV(t); refresh(); return m; }, importJSON: t => { const m = importJSON(t); refresh(); return m; }, data: () => D };
  G.ACT.mbimp = () => pickFile();
  G.ACT.mbtpl = (b, v) => dl(new Blob([toCSV([COLS[v]])], { type: 'text/csv' }), FN[v].replace('.csv', '-template.csv'));
  G.ACT.mbcsv = (b, v) => exportCSV(v);
  G.ACT.mbjson = () => dl(new Blob([JSON.stringify({ kind: 'labgenie-micro', v: 1, at: new Date().toISOString(), media: D.media, spec: D.spec, org: D.org }, null, 1)], { type: 'application/json' }), 'labgenie-microbiology-backup.json');
  G.ACT.mbclr = () => del('Delete ALL organisms, media and specimens on this device? Export a backup first — this cannot be undone.', () => { D = { media: [], spec: [], org: [] }; save(); refresh(); toast('Microbiology data cleared'); });

  /* ---------------- form inputs ---------------- */
  const top = () => { const el = document.getElementById('sp-tool'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  let tmr;
  const onIn = e => {
    const el = e.target, k = el.dataset && el.dataset.sx;
    if (!k || !k.startsWith('mb.')) return;
    const val = el.type === 'checkbox' ? el.checked : el.value, live = el.tagName === 'SELECT' || el.type === 'color';
    if (e.type === 'change' && !live && el.type !== 'checkbox') return;
    const p = k.split('.');
    if (k === 'mb.q') { O.q = val; clearTimeout(tmr); tmr = setTimeout(refresh, 200); return; }
    if (k === 'mb.sadd') { SP.add = val; return; }
    let tgt = p[1] === 'o' ? O.d : p[1] === 'm' ? M.d : p[1] === 's' ? SP.d : p[1] === 'om' ? O.d && O.d.mg[+p[2]] : null;
    if (!tgt) return;
    tgt[p[1] === 'om' ? p[3] : p[2]] = val;
    if (live && e.type === 'input' && el.tagName === 'SELECT') return; /* handle selects on change */
    if (live) { clearTimeout(tmr); tmr = setTimeout(refresh, el.type === 'color' ? 120 : 0); }
  };
  document.addEventListener('input', onIn);
  document.addEventListener('change', onIn);

  /* ---------------- guide entries ---------------- */
  const SAFE = { h: 'About this section', li: ['Starts empty — you add the content from your textbook, practical manual or laboratory SOP.', 'Every entry has a Source field and an “Unverified / Validated” mark so you can review before relying on it.', 'Data stays on this device — export a backup regularly and share it with colleagues.'] };
  G.GUIDES.push(
    { id: 'mborg', n: 'Organism Cards (Microbiology)', ic: '🦠', cat: 'Microbiology', tool: 'mborg', aka: 'microbiology bacteria organism card gram positive negative cocci bacilli lactose fermenter haemolysis hemolysis alpha beta gamma aerobic anaerobic colony morphology media disease identification', sec: [{ h: 'How to use', li: ['Tap “Add organism”, enter the name and pick the traits — the cell drawing updates as you choose.', 'Add each medium with the colony colour, size and description; a plate drawing is generated for you.', 'Traits drive the organism finder and the quiz, so fill in as many as you can.'] }] },
    { id: 'mbspec', n: 'Specimen → Media Map', ic: '🧪', cat: 'Microbiology', tool: 'mbspec', aka: 'microbiology specimen sample type media inoculation urine blood pus csf sputum swab stool culture plates set up', sec: [{ h: 'How to use', li: ['Add your media in the Media library first so they show as tappable chips with their colour.', 'Group specimens by sample type (Urine, Blood, Pus…). Each entry lists the plates and incubation.'] }] },
    { id: 'mbmedia', n: 'Culture Media Library', ic: '🧫', cat: 'Microbiology', tool: 'mbmedia', aka: 'microbiology culture media agar plate blood agar macconkey chocolate cled uti agar selective differential enriched', sec: [{ h: 'How to use', li: ['Set the plate colour — it is used for every plate drawing in organism cards and the specimen map.', 'Renaming a medium updates it everywhere it is used.'] }] },
    { id: 'mbfind', n: 'Organism Finder', ic: '🔎', cat: 'Microbiology', tool: 'mbfind', aka: 'microbiology identify organism finder gram shape arrangement lactose haemolysis', sec: [{ h: 'How to use', li: ['Tap what you observed (Gram, shape, haemolysis…). Matching cards appear below.', 'It only searches your own cards — the result is as good as the data you entered.'] }] },
    { id: 'mbquiz', n: 'Microbiology Quiz (from your cards)', ic: '🎯', cat: 'Microbiology', tool: 'mbquiz', aka: 'microbiology quiz mcq practice organisms media', sec: [{ h: 'How it works', li: ['Questions are generated from your organism cards and specimen map: traits, Gram reaction, haemolysis, colony appearance, media sets.', 'The more cards you complete, the more varied the questions.'] }] },
    { id: 'mbdata', n: 'Microbiology Import / Export', ic: '📦', cat: 'Microbiology', tool: 'mbdata', aka: 'microbiology import export csv excel backup template share', sec: [SAFE, { h: 'CSV formats', tb: { hd: ['File', 'Columns'], r: [['Media', COLS.media.join(', ')], ['Specimens', COLS.spec.join(', ') + ' — media separated by “;”'], ['Organisms', COLS.org.join(', ')], ['media_appearance', 'Medium : colour : size : zone : description — several separated by “|”'], ['Traits', 'Words like positive / negative, cocci / rods, alpha / beta / gamma, LF / NLF, yes / no are understood']] } }] }
  );
})();
