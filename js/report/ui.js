/* =====================================================================
   LabGenie Report Engine · ui.js
   Mobile-first editor: page tabs, patient, page/specimen setup with
   conflict validation, profile picker + single-test search, result rows,
   live quality checks, interpretation, e-signatures, letterhead, cases.
   Uses its own data attributes (data-ra / data-x / data-rw …) so it never
   collides with the legacy handlers in index.html.
   ===================================================================== */
(function () {
  'use strict';
  const R = window.LGR, X = R.X, E = R.E;
  const sheet = h => LGI.sheet(h), closeS = () => LGI.closeS(), ask = (m, f) => LGI.ask(m, f), hap = () => { try { LGI.hap(); } catch (_) {} };
  const $1 = s => document.querySelector(s);

  S.rxu = Object.assign({ sec: { pt: 1, spec: 1, tests: 1, qc: 1, cm: 1, sig: 0, lay: 0 }, cat: 'sug', q: '' }, ST.get('rxu', {}));
  S.rxu.q = '';
  S.rxsel = ST.get('rxsel', null);
  S.rximg = ST.get('rximg', {});
  const saveU = () => ST.set('rxu', { sec: S.rxu.sec, cat: S.rxu.cat });

  /* ---------------- icons ---------------- */
  const IC = {
    eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    down: '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
    save: '<path d="M5 3h11l3 3v15H5z"/><path d="M8 3v5h8V3M8 21v-7h8v7"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
    more: '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
    folder: '<path d="M3 6h6l2 2h10v11H3z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4.5-6 8-6s7 2 8 6"/>'
  };
  const ico = n => `<svg viewBox="0 0 24 24" aria-hidden="true">${IC[n]}</svg>`;

  /* ---------------- path binding: pt.* pg.* lab.* L.* sig.l.* ---------------- */
  const root = a => (a === 'pt' ? S.rx.pt : a === 'pg' ? R.page() : a === 'lab' ? R.lab() : a === 'L' ? (S.lab = S.lab || {}) : a === 'sig' ? S.rx.sig : null);
  const getP = p => { const [a, b, c] = p.split('.'), o = root(a); if (!o) return ''; return c ? (o[b] || {})[c] : o[b]; };
  const setP = (p, v) => { const [a, b, c] = p.split('.'), o = root(a); if (!o) return; if (c) { o[b] = o[b] || {}; o[b][c] = v; } else o[b] = v; };
  const attrV = v => E(v == null ? '' : v);

  const fld = (p, l, o = {}) => `<div class="fd${o.h ? ' h' : ''}"><label>${l}</label><div class="in"><input data-x="${p}"${o.t ? ` type="${o.t}"` : ''}${o.ph ? ` placeholder="${E(o.ph)}"` : ''}${o.list ? ` list="${o.list}"` : ''}${o.im ? ` inputmode="${o.im}"` : ''} autocomplete="off" value="${attrV(getP(p))}">${o.btn || ''}</div></div>`;
  const sel = (p, l, opts, o = {}) => { const v = String(getP(p) == null ? '' : getP(p)); return `<div class="fd${o.h ? ' h' : ''}"><label>${l}</label><select data-x="${p}">${opts.map(([k, t]) => `<option value="${E(k)}"${v === String(k) ? ' selected' : ''}>${E(t)}</option>`).join('')}</select></div>`; };
  const chk = (p, l) => `<div class="fd"><label class="ck rx-cb"><input type="checkbox" data-x="${p}"${getP(p) ? ' checked' : ''}> <span>${l}</span></label></div>`;
  const seg = (p, opts) => { const v = String(getP(p)); return `<div class="seg rx-seg">${opts.map(([k, t]) => `<button class="${v === String(k) ? 'on' : ''}" data-ra="seg" data-k="${p}" data-v="${E(k)}">${t}</button>`).join('')}</div>`; };
  const sec = (id, title, sub, body, badge) => `<details class="rx-sec" data-sec="${id}" id="rx-${id}"${S.rxu.sec[id] ? ' open' : ''}><summary><span class="rx-st">${title}${badge || ''}</span><small>${sub}</small></summary><div class="rx-sb">${body}</div></details>`;

  const DEPTS = ['Hematology', 'Biochemistry', 'Clinical Pathology', 'Microbiology', 'Serology', 'Immunology', 'Coagulation', 'Endocrinology', 'Blood Bank', 'Andrology', 'Histopathology', 'Molecular Biology'];
  const STATUS = ['Completed', 'Preliminary', 'Pending verification', 'Amended', 'Corrected'];
  const PST = ['OPD', 'IPD', 'Emergency', 'ICU', 'Day care', 'Home collection', 'Referred sample'];
  const POPULAR = ['cbc', 'urme', 'lipid', 'lft', 'rft', 'glupp', 'hba1c', 'thyroid', 'lyte', 'vit', 'esr', 'srme', 'crp', 'dengue', 'widal', 'viral'];

  /* ---------------- top: patient chip + case actions ---------------- */
  const hero = () => {
    const c = S.rx, pt = c.pt, nm = pt.p || 'New patient', ini = ((nm.match(/\b[A-Za-zঀ-৿]/g) || ['?']).slice(0, 2).join('')).toUpperCase();
    const sub = [pt.pid && 'ID ' + pt.pid, R.ageSex(pt), c.pages.length + ' page' + (c.pages.length > 1 ? 's' : '')].filter(Boolean).map(E).join(' · ');
    return `<div class="rx-hero"><div class="rx-av">${E(ini)}</div><div class="rx-who"><b id="rx-hn">${E(nm)}</b><small>${sub}</small></div><button class="rx-hb" data-ra="cases">${ico('folder')}<span>Cases</span></button><button class="rx-hb" data-ra="newcase">${ico('plus')}<span>New</span></button></div>
${c.demo ? '<div class="rx-demo"><span><b>Demo report.</b> Every field is editable — explore, then start a fresh case.</span><button data-ra="newblank">Start blank</button><button class="rx-dx" data-ra="hidedemo" aria-label="Dismiss">✕</button></div>' : ''}`;
  };
  const tabs = () => {
    const c = S.rx;
    return `<div class="rx-tabs" role="tablist">${c.pages.map((p, i) => { const n = R.printable(p).filter(x => !x.h && !x.sub).length, cf = R.conflicts(p).length; return `<button class="rx-tab${i === c.cur ? ' on' : ''}${cf ? ' bad' : ''}" role="tab" aria-selected="${i === c.cur}" data-ra="pg" data-n="${i}"><span id="rx-tn-${i}">${E(p.nm || 'Page ' + (i + 1))}</span><i>${cf ? '!' : n}</i></button>`; }).join('')}<button class="rx-tab add" data-ra="pgadd">+ Page</button></div>`;
  };
  const pageBar = () => {
    const c = S.rx;
    return `<div class="rx-pb"><div class="in"><input data-x="pg.nm" aria-label="Page name" placeholder="Page name" value="${attrV(R.page().nm)}"></div><button class="ib" data-ra="pgmv" data-d="-1" aria-label="Move page left"${c.cur === 0 ? ' disabled' : ''}>‹</button><button class="ib" data-ra="pgmv" data-d="1" aria-label="Move page right"${c.cur === c.pages.length - 1 ? ' disabled' : ''}>›</button><button class="ib" data-ra="pgmenu" aria-label="Page options">${ico('more')}</button></div>`;
  };

  /* ---------------- sections ---------------- */
  const secPatient = () => sec('pt', 'Patient', 'Shared by every page of this case',
    `<div class="rx-g">${fld('pt.lno', 'Lab / invoice no.', { h: 1, btn: '<button class="rx-ib" data-ra="lno">Auto</button>' })}${fld('pt.pid', 'Patient ID / reg. no.', { h: 1 })}${fld('pt.p', 'Patient name')}${fld('pt.age', 'Age (e.g. 35 or 2M)', { h: 1 })}${sel('pt.sx', 'Gender', [['', '—'], ['Male', 'Male'], ['Female', 'Female'], ['Other', 'Other']], { h: 1 })}${fld('pt.rb', 'Referred by (doctor)')}${fld('pt.pst', 'Patient type', { h: 1, list: 'rxo-pst' })}${fld('pt.bed', 'Bed / ward', { h: 1 })}${fld('pt.ph', 'Phone', { h: 1, t: 'tel' })}${fld('pt.dt', 'Report date', { h: 1, t: 'date' })}${fld('pt.cd', 'Collected', { h: 1, t: 'datetime-local' })}${fld('pt.rd', 'Received', { h: 1, t: 'datetime-local' })}${fld('pt.deliv', 'Reported', { h: 1, t: 'datetime-local' })}${fld('pt.ivl', 'Report after (hours)', { h: 1, t: 'number', im: 'decimal' })}</div>
<div class="rx-row"><button class="btn" data-ra="pts">${ico('user')} Patient list</button><button class="btn" data-ra="ptsave">Save patient</button></div>`);

  const specSelect = pg => {
    const fams = [...new Set(R.SPEC.map(s => s[3]))];
    return `<div class="fd"><label>Specimen type</label><select data-x="pg.sp"><option value="">— Select specimen —</option>${fams.map(f => `<optgroup label="${f}">${R.SPEC.filter(s => s[3] === f).map(s => `<option value="${s[0]}"${pg.sp === s[0] ? ' selected' : ''}>${E(s[1])}</option>`).join('')}</optgroup>`).join('')}</select></div>`;
  };
  const secPage = () => {
    const pg = R.page(), cf = R.conflicts(pg), sp = R.SPEC_BY[pg.sp], u1 = R.units(pg)[0];
    const hint = sp ? `<p class="rx-hint">🧪 ${E(sp[2] || sp[1])}${pg.spAuto && u1 ? ' · auto-selected for ' + E(u1.row.n) : ''}</p>` : '';
    const warn = cf.length ? `<div class="rx-warn bad"><b>Specimen conflict.</b> ${cf.map(u => `“${E(u.row.n)}” needs ${E(R.specLabel(u.row.acc[0]))}`).join('; ')}. One report page should carry one specimen type.<div class="rx-row"><button class="btn" data-ra="splitpg">Move to separate pages</button><button class="btn" data-ra="seg" data-k="pg.mix" data-v="1">Allow mixed on this page</button></div></div>` : '';
    return sec('spec', 'Page setup & specimen', 'Department, specimen, status and title',
      `<div class="rx-g">${specSelect(pg)}${pg.sp === 'other' ? fld('pg.spx', 'Specimen (type it)') : ''}</div>${hint}${warn}
<div class="rx-g">${chk('pg.mix', 'Allow mixed specimens on this page (specimen printed beside each panel)')}${fld('pg.dept', 'Department', { h: 1, list: 'rxo-dept' })}${sel('pg.st', 'Report status', STATUS.map(s => [s, s]), { h: 1 })}${fld('pg.ttl', 'Report title (optional)', { ph: (pg.dept || 'Laboratory') + ' Report' })}${fld('pg.mn', 'Method note under title (optional)')}</div>`);
  };

  const plist = () => {
    const pg = R.page(), q = S.rxu.q.trim().toLowerCase(), cat = S.rxu.cat, units = R.units(pg).length;
    let ps;
    if (q) ps = R.PROF.filter(p => (p.n + ' ' + p.id + ' ' + p.cat).toLowerCase().includes(q));
    else if (cat === 'sug') ps = pg.sp && units ? R.PROF.filter(p => p.acc.includes(pg.sp)) : POPULAR.map(id => R.PROF_BY[id]);
    else if (cat === 'all') ps = R.PROF;
    else ps = R.PROF.filter(p => p.cat === cat);
    let h = ps.map(p => {
      const on = R.hasProfile(pg, p.id), ok = !pg.sp || pg.mix || !units || p.acc.includes(pg.sp);
      return `<button class="rx-pc${on ? ' on' : ''}${ok ? '' : ' x'}" data-ra="padd" data-id="${p.id}"><b>${E(p.n)}</b><small>${p.t.filter(t => t[0] !== '#').length} tests · ${E(p.spl || R.specLabel(p.acc[0]))}</small>${on ? '<i>✓ on this page</i>' : ok ? '' : '<i class="w">different specimen</i>'}</button>`;
    }).join('');
    if (q) {
      const ts = R.TESTS.filter(x => x.t[1].toLowerCase().includes(q) || x.t[0] === q).slice(0, 14);
      h += ts.map(x => `<button class="rx-tc" data-ra="tadd" data-k="${E(R.norm(x.t[1]))}"><b>+ ${E(x.t[1])}</b><small>single test · ${E(x.t[2] || 'qualitative')} · ${E(R.specLabel(x.p.acc[0]))}</small></button>`).join('');
      h += `<button class="rx-tc cu" data-ra="tcust"><b>+ Add “${E(S.rxu.q.trim())}” as a custom test</b></button>`;
    }
    return h || '<p class="rx-hint">No profiles here.</p>';
  };
  const picker = () => {
    const cats = [['sug', 'Suggested'], ['all', 'All']].concat(R.CATS.map(c => [c, c]));
    return `<div class="rx-cats">${cats.map(([k, l]) => `<button class="chip${S.rxu.cat === k ? ' on' : ''}" data-ra="pcat" data-k="${E(k)}">${l}</button>`).join('')}</div>
<label class="rx-q">${ico('search')}<input data-rxq="1" placeholder="Search profiles or single tests — CBC, TSH, creatinine…" autocomplete="off" value="${E(S.rxu.q)}"></label>
<div class="rx-pl" id="rx-pl">${plist()}</div>`;
  };
  const isNum = (x, sx) => !x.o && (x.a || !!R.lim(R.ref(x, sx)) || R.val(x.r) != null);
  const rowsHTML = () => {
    const pg = R.page(), sx = R.sexOf(S.rx), lab = R.lab(), conf = new Set(R.conflicts(pg).map(u => u.i));
    if (!pg.rows.length) return '<div class="rx-empty">No tests on this page yet. Tap a profile above — results come pre-filled with typical values, so you only change what is abnormal.</div>';
    return '<div class="rx-rh"><span></span><span>Test</span><span>Result</span><span>Unit</span><span>Reference range</span><span></span></div>' + pg.rows.map((x, i) => {
      if (x.h) return `<div class="rx-ph${conf.has(i) ? ' bad' : ''}"><input class="rx-hn" data-rw="${i}" data-c="n" value="${attrV(x.n)}" aria-label="Panel heading" placeholder="Panel heading"><span class="rx-spb">${x.acc && x.acc.length ? E(x.spl || R.specLabel(pg.mix && x.psp ? x.psp : x.acc[0])) : 'any specimen'}</span><button class="rx-x" data-ra="pdel" data-i="${i}" aria-label="Remove whole panel">${ico('trash')}</button></div>`;
      if (x.sub) return `<div class="rx-sbh"><input data-rw="${i}" data-c="n" value="${attrV(x.n)}" aria-label="Sub-heading"><button class="rx-x" data-ra="rdel" data-i="${i}" aria-label="Remove sub-heading">${ico('x')}</button></div>`;
      const f = R.flag(x, sx);
      return `<div class="rx-r${x.off ? ' off' : ''}${x.a ? ' au' : ''}${conf.has(i) ? ' bad' : ''}">
<input type="checkbox" class="rx-ck" data-rwk="${i}"${x.off ? '' : ' checked'} aria-label="Print this row">
<input class="rx-n" data-rw="${i}" data-c="n" value="${attrV(x.n)}" placeholder="Test name" aria-label="Test name">
<div class="rx-v"><input data-rw="${i}" data-c="r" value="${attrV(x.r)}" placeholder="${x.a ? 'auto' : 'Result'}"${x.o ? ` list="rxo-${x.o}"` : ''}${isNum(x, sx) ? ' inputmode="decimal"' : ''} autocomplete="off" enterkeyhint="next" aria-label="Result for ${attrV(x.n)}"><b class="rx-f${f.c ? ' c' : f.f ? ' h' : ''}" id="rxf-${i}">${E(R.flagTxt(f, lab))}</b>${x.a && x.man ? `<button class="rx-re" data-ra="rre" data-i="${i}" title="Back to auto value" aria-label="Back to auto value">↺</button>` : ''}</div>
<input class="rx-u" data-rw="${i}" data-c="u" value="${attrV(x.u)}" placeholder="Unit" aria-label="Unit">
<input class="rx-rg" data-rw="${i}" data-c="g" value="${attrV(R.ref(x, sx))}" placeholder="Reference" aria-label="Reference range">
<button class="rx-x" data-ra="rdel" data-i="${i}" aria-label="Remove test">${ico('x')}</button></div>`;
    }).join('');
  };
  const secTests = () => {
    const pg = R.page(), n = pg.rows.filter(x => !x.h && !x.sub).length;
    return sec('tests', 'Tests & results', 'Tap a profile to add it — every value stays editable', `${picker()}<div id="rx-rows">${rowsHTML()}</div>
<div class="rx-add"><button class="btn" data-ra="radd">+ Test</button><button class="btn" data-ra="rsub">+ Sub-heading</button><button class="btn" data-ra="rhead">+ Panel heading</button><button class="btn" data-ra="pfill">Typical values</button><button class="btn d" data-ra="pclr">Clear results</button></div>
<p class="rx-hint">✓ prints the row · rows without a result are left off · shaded rows calculate themselves (type to override, ↺ to restore) · H/L/A flags update live.</p>`, `<em class="rx-bd">${n}</em>`);
  };

  const qcBody = () => {
    const c = S.rx, all = R.checks(c), cur = c.cur, mine = all.filter(x => x.pg === cur || x.pg === -1), other = all.filter(x => x.pg !== cur && x.pg !== -1 && (x.lv === 'err' || x.lv === 'crit'));
    const icon = { err: '⛔', crit: '🚨', warn: '⚠️', info: 'ℹ️' };
    let h = mine.map(x => `<div class="rx-qi ${x.lv}"><span>${icon[x.lv]}</span><p>${E(x.msg)}</p>${x.act ? `<button class="btn" data-ra="${x.act.ra}" data-i="${x.act.i}" data-pg="${x.act.pg}">Fix</button>` : ''}</div>`).join('');
    if (other.length) h += `<div class="rx-qi warn"><span>📄</span><p>${other.length} issue${other.length > 1 ? 's' : ''} on other pages (${[...new Set(other.map(x => E(c.pages[x.pg].nm)))].join(', ')}).</p></div>`;
    return h || '<div class="rx-qi ok"><span>✅</span><p>All checks passed for this page.</p></div>';
  };
  const qcBadge = () => { const n = R.checks(S.rx).filter(x => (x.pg === S.rx.cur || x.pg === -1) && (x.lv === 'err' || x.lv === 'crit')).length; return n ? `<em class="rx-bd bad">${n}</em>` : ''; };
  const secQC = () => sec('qc', 'Quality checks', 'Live pre-release validation', `<div id="rx-qcb">${qcBody()}</div>`, `<span id="rx-qcbd">${qcBadge()}</span>`);

  const secComment = () => sec('cm', 'Comment & interpretation', 'Auto-written from results, fully editable',
    `${chk('pg.acm', 'Auto-generate from results (stops once you edit the text)')}<textarea id="rx-cm" data-x="pg.cm" placeholder="Comment / interpretation…">${E(R.page().cm)}</textarea><div class="rx-row"><button class="btn" data-ra="cmre">Regenerate</button><button class="btn" data-ra="cmclr">Clear</button></div>`);

  /* ---------------- signatures ---------------- */
  const sigSlot = s => {
    const g = S.rx.sig[s], lab = R.lab(), lbl = s === 'l' ? 'Left signature' : 'Right signature';
    let h = `<div class="rx-sgc"><label class="ck rx-cb"><input type="checkbox" data-x="sig.${s}.on"${g.on ? ' checked' : ''}> <b>${lbl}</b></label>`;
    if (!g.on) return h + '</div>';
    if (lab.lib.length) h += `<div class="fd"><label>Use a saved signatory</label><select data-sglib="${s}"><option value="">— Choose —</option>${lab.lib.map((x, i) => `<option value="${i}">${E(x.n)}${x.d ? ' · ' + E(x.d) : ''}</option>`).join('')}</select></div>`;
    h += `<div class="rx-g">${fld(`sig.${s}.n`, 'Name')}${fld(`sig.${s}.d`, 'Designation', { h: 1 })}${fld(`sig.${s}.q`, 'Qualification / reg. no.', { h: 1 })}${fld(`sig.${s}.h`, 'Organisation (optional)')}</div>`;
    h += `<p class="rx-lb">Signature</p>${seg(`sig.${s}.m`, [['font', 'Typed e-sign'], ['img', 'Upload image'], ['', 'Sign by hand']])}`;
    if (g.m === 'font') {
      h += `<div class="rx-g">${sel(`sig.${s}.f`, 'Style', R.sig.FONTS.map(f => [f, f]), { h: 1 })}${fld(`sig.${s}.t`, 'Text (blank = name)', { h: 1 })}</div><div class="rx-sgp" id="rx-sgp-${s}" style="font-family:'${E(g.f || R.sig.FONTS[1])}',cursive">${E(g.t || g.n || 'Signature')}</div>`;
    } else if (g.m === 'img') {
      h += `<div class="rx-sgi">${g.img ? `<img src="${g.img.u}" alt="Signature preview">` : '<span>No signature image yet</span>'}</div>
<div class="rx-row"><label class="btn rx-up">PNG (transparent)<input type="file" accept="image/png" data-sgf="${s}" hidden></label><label class="btn rx-up">JPG / photo — auto-extract<input type="file" accept="image/jpeg,image/jpg,image/webp,image/heic,image/*" data-sgf="${s}" hidden></label>${R.sigSrc[s] ? `<button class="btn" data-ra="sgadj" data-s="${s}">Adjust</button>` : ''}${g.img ? `<button class="btn d" data-ra="sgrm" data-s="${s}">Remove</button>` : ''}</div>
<p class="rx-hint">Photograph a signature on white paper — the background, shadows and paper tint are removed, the ink is cropped and resized automatically.</p>`;
    } else h += '<p class="rx-hint">A blank line is printed for a wet signature.</p>';
    h += `<div class="rx-row"><button class="btn" data-ra="sgsave" data-s="${s}">Save to signatory library</button></div></div>`;
    return h;
  };
  const secSig = () => {
    const lib = R.lab().lib;
    return sec('sig', 'Signatures', 'Typed or uploaded e-signatures, saved for reuse', sigSlot('l') + sigSlot('r') + (lib.length ? `<p class="rx-lb">Signatory library</p>${lib.map((x, i) => `<div class="rw"><span>${E(x.n)}<small>${E(x.d || '')}</small></span><div><button class="ib" data-ra="sglibdel" data-i="${i}" aria-label="Delete signatory">${ico('trash')}</button></div></div>`).join('')}` : ''));
  };

  /* ---------------- letterhead & layout ---------------- */
  const secLayout = () => {
    const lab = R.lab();
    let h = `<p class="rx-lb">Header</p>${seg('lab.hdr', [['lab', 'Lab letterhead'], ['gap', 'Blank (pre-printed pad)'], ['img', 'Header image']])}`;
    if (lab.hdr === 'lab') h += `<div class="rx-g">${fld('L.n', 'Lab name')}${fld('lab.tag', 'Tagline / accreditation (optional)')}${fld('L.a', 'Address')}${fld('L.t', 'Phone', { h: 1, t: 'tel' })}${fld('lab.em', 'E-mail', { h: 1, t: 'email' })}${fld('lab.web', 'Website (optional)')}</div>
<div class="rx-logo">${lab.logo ? `<img src="${lab.logo.u}" alt="Lab logo">` : '<span>No logo</span>'}<label class="btn rx-up">Upload logo<input type="file" accept="image/*" data-lgf="logo" hidden></label>${lab.logo ? '<button class="btn d" data-ra="lgrm" data-k="logo">Remove</button>' : ''}</div>`;
    else if (lab.hdr === 'gap') h += `<div class="rx-g">${fld('lab.gap', 'Blank space at top (mm)', { h: 1, t: 'number', im: 'numeric' })}</div>`;
    else h += `<div class="rx-logo wide">${lab.himg ? `<img src="${lab.himg.u}" alt="Header image">` : '<span>No header image</span>'}<label class="btn rx-up">Upload header<input type="file" accept="image/*" data-lgf="himg" hidden></label>${lab.himg ? '<button class="btn d" data-ra="lgrm" data-k="himg">Remove</button>' : ''}</div>`;
    h += `<p class="rx-lb">Flags</p>${seg('lab.flg', [['hl', 'H / L'], ['ar', '↑ / ↓']])}
<p class="rx-lb">Print colours</p>${seg('lab.col', [['bw', 'Black & white'], ['acc', 'Accent colour']])}${lab.col === 'acc' ? `<div class="fd"><label>Accent colour</label><input type="color" data-x="lab.acc" value="${E(lab.acc)}" class="rx-col"></div>` : ''}
<p class="rx-lb">Text size</p>${seg('lab.fs', [['s', 'Compact'], ['n', 'Normal'], ['l', 'Large']])}
<div class="rx-g">${chk('lab.bc', 'Barcode (lab no. / patient ID)')}${chk('lab.wm', 'Watermark when status is not “Completed”')}${chk('lab.pn', 'Page numbers (Page x of y)')}${chk('lab.nts', 'Method notes and interpretive footnotes')}${chk('lab.eor', '“*** End of report ***” line')}${chk('lab.seal', 'Machine-generated copy seal')}${chk('lab.prefill', 'Pre-fill typical results when adding a profile')}</div>
<p class="rx-lb">Footer</p><div class="rx-g">${fld('lab.pby', 'Printed by', { h: 1 })}${fld('lab.pw', 'Powered by', { h: 1 })}${fld('lab.disc', 'Disclaimer line')}${fld('lab.pre', 'Lab no. prefix', { h: 1 })}<div class="fd h"><label>Next auto no.</label><div class="rx-nx">${E(nextLno(1))}</div></div></div>`;
    return sec('lay', 'Letterhead & layout', 'Logo, header, flags, colours, footer — saved for all reports', h);
  };

  const actions = () => `<div class="rx-act"><button data-ra="xprev">${ico('eye')}<span>Preview</span></button><button class="pri" data-ra="export">${ico('down')}<span>Export</span></button><button data-ra="csave">${ico('save')}<span>Save</span></button></div>`;
  const datalists = () => {
    const used = new Set();
    S.rx.pages.forEach(p => p.rows.forEach(x => x.o && used.add(x.o)));
    return [...used].map(k => `<datalist id="rxo-${k}">${(R.OPT[k] || []).map(o => `<option value="${E(o)}"></option>`).join('')}</datalist>`).join('') +
      `<datalist id="rxo-dept">${DEPTS.map(d => `<option value="${d}"></option>`).join('')}</datalist><datalist id="rxo-pst">${PST.map(d => `<option value="${d}"></option>`).join('')}</datalist>`;
  };

  R.view = () => `<div id="rx">${hero()}${tabs()}${pageBar()}${secPatient()}${secPage()}${secTests()}${secQC()}${secComment()}${secSig()}${secLayout()}${actions()}${datalists()}</div>`;
  R.redraw = () => { const el = $1('#rx'); if (!el) return; const y = scrollY; R.auto(S.rx); el.outerHTML = R.view(); scrollTo(0, y); };
  const live = () => {
    const pg = R.page(), sx = R.sexOf(S.rx), lab = R.lab(), act = document.activeElement;
    pg.rows.forEach((x, i) => {
      if (x.h || x.sub) return;
      const f = R.flag(x, sx), b = document.getElementById('rxf-' + i);
      if (b) { b.textContent = R.flagTxt(f, lab); b.className = 'rx-f' + (f.c ? ' c' : f.f ? ' h' : ''); }
      if (x.a) { const inp = document.querySelector(`[data-rw="${i}"][data-c="r"]`); if (inp && inp !== act && inp.value !== x.r) inp.value = x.r; }
    });
    const q = $1('#rx-qcb'); if (q) q.innerHTML = qcBody();
    const qb = $1('#rx-qcbd'); if (qb) qb.innerHTML = qcBadge();
    const cm = $1('#rx-cm'); if (cm && cm !== act && cm.value !== pg.cm) cm.value = pg.cm;
  };

  /* ---------------- lab number ---------------- */
  function nextLno(peek) {
    const lab = R.lab(), d = new Date(), p = n => String(n).padStart(2, '0'), seq = (+lab.seq || 0) + 1;
    if (!peek) { lab.seq = seq; R.saveLab(); }
    return (lab.pre ? lab.pre + '-' : '') + String(d.getFullYear()).slice(2) + p(d.getMonth() + 1) + p(d.getDate()) + '-' + String(seq).padStart(4, '0');
  }
  X.lno = () => { S.rx.pt.lno = nextLno(); R.save(); R.redraw(); toast('Lab no. ' + S.rx.pt.lno); };

  /* ---------------- input handling ---------------- */
  const times = k => {
    const pt = S.rx.pt, setI = (p, v) => { const e = document.querySelector(`[data-x="${p}"]`); if (e) e.value = v; };
    if (k === 'rd') pt.rdMan = 1;
    if (k === 'deliv') pt.dvMan = 1;
    if (k === 'cd' && !pt.rdMan) { pt.rd = pt.cd; setI('pt.rd', pt.rd); }
    if ((k === 'cd' || k === 'ivl') && !pt.dvMan) { pt.deliv = R.tadd(pt.cd, pt.ivl); setI('pt.deliv', pt.deliv); }
  };
  const onX = (el, structural) => {
    const p = el.dataset.x, v = el.type === 'checkbox' ? (el.checked ? 1 : 0) : el.value, [a, k, k2] = p.split('.');
    setP(p, v);
    if (a === 'lab') R.saveLab();
    if (a === 'L') ST.set('lab', S.lab);
    if (a === 'pt') {
      if (/^(cd|rd|deliv|ivl)$/.test(k)) times(k);
      if (k === 'sx' || k === 'age') { R.auto(S.rx); structural = 1; }
      if (k === 'p') { const h = $1('#rx-hn'); if (h) h.textContent = v || 'New patient'; }
    }
    if (a === 'pg') {
      const pg = R.page();
      if (k === 'nm') { const t = document.getElementById('rx-tn-' + S.rx.cur); if (t) t.textContent = v || 'Page'; }
      if (k === 'cm') pg.cmMan = String(v).trim() ? 1 : 0;
      if (k === 'sp') { pg.spAuto = 0; structural = 1; }
      if (k === 'acm' && v) { pg.cmMan = 0; R.auto(S.rx); }
    }
    if (a === 'sig' && (k2 === 'n' || k2 === 't')) { const pv = document.getElementById('rx-sgp-' + k), g = S.rx.sig[k]; if (pv) pv.textContent = g.t || g.n || 'Signature'; }
    R.save();
    if (structural) R.redraw();
  };
  const onRow = el => {
    const i = +el.dataset.rw, c = el.dataset.c, pg = R.page(), x = pg.rows[i];
    if (!x) return;
    let v = el.value;
    if (c === 'r') {
      if (/[০-৯]/.test(v)) { v = v.replace(/[০-৯]/g, d => '০১২৩৪৫৬৭৮৯'.indexOf(d)); el.value = v; }
      x.r = v;
      if (x.a) x.man = v.trim() ? 1 : 0;
    } else if (c === 'g') { x.g = v; x.gm = 1; } else x[c] = v;
    if (c === 'r' || c === 'g') { R.auto(S.rx); live(); }
    R.save();
  };
  const inRx = el => el.closest && (el.closest('#rx') || el.closest('#ov'));
  document.addEventListener('input', e => {
    const el = e.target, d = el.dataset;
    if (!inRx(el) || el.type === 'checkbox' || el.tagName === 'SELECT' || el.type === 'file') return;
    if (d.x !== undefined) onX(el, 0);
    else if (d.rw !== undefined) onRow(el);
    else if (d.rxq !== undefined) { S.rxu.q = el.value; const l = $1('#rx-pl'); if (l) l.innerHTML = plist(); }
    else if (d.sga !== undefined) { S.rxsg.k = +el.value; clearTimeout(sgT); sgT = setTimeout(sgRun, 90); }
    else if (d.rxcq !== undefined) { S.rxcq = el.value; const l = $1('#rx-cl'); if (l) l.innerHTML = caseList(); }
  });
  document.addEventListener('change', e => {
    const el = e.target, d = el.dataset;
    if (!inRx(el)) return;
    if (d.sgf !== undefined) return sigFile(el);
    if (d.lgf !== undefined) return logoFile(el);
    if (d.sglib !== undefined) { const x = R.lab().lib[+el.value]; if (x) { const g = S.rx.sig[d.sglib]; Object.assign(g, R.clone(x), { on: 1 }); delete g.id; R.save(); R.redraw(); toast('Signatory applied'); } return; }
    if (d.rwk !== undefined) { const x = R.page().rows[+d.rwk]; if (x) { x.off = el.checked ? 0 : 1; el.closest('.rx-r').classList.toggle('off', !el.checked); R.save(); live(); } return; }
    if (d.x !== undefined && (el.type === 'checkbox' || el.tagName === 'SELECT')) onX(el, 1);
    else if (d.x !== undefined && el.type === 'color') onX(el, 0);
  });
  document.addEventListener('toggle', e => { const d = e.target; if (d.dataset && d.dataset.sec && d.closest('#rx')) { S.rxu.sec[d.dataset.sec] = d.open ? 1 : 0; saveU(); } }, true);
  document.addEventListener('click', e => { const b = e.target.closest('[data-ra]'); if (!b) return; const f = X[b.dataset.ra]; if (f) { e.preventDefault(); f(b.dataset, b); } });
  document.addEventListener('keydown', e => {
    const el = e.target;
    if (e.key !== 'Enter' || el.dataset.c !== 'r' || el.dataset.rw === undefined) return;
    e.preventDefault();
    const all = [...document.querySelectorAll('#rx [data-c="r"]')], i = all.indexOf(el);
    if (all[i + 1]) all[i + 1].focus(); else el.blur();
  });
  // stop the app's swipe-to-next-tool gesture while editing a report
  document.addEventListener('touchend', e => { if (e.target.closest && e.target.closest('#rx')) e.stopPropagation(); }, { passive: true });
  addEventListener('hashchange', () => document.body.classList.remove('rxon'));

  /* ---------------- generic actions ---------------- */
  X.seg = d => {
    let v = d.v;
    if (/^lab\.(gap)$/.test(d.k)) v = +v;
    if (d.k === 'pg.mix') v = +v;
    setP(d.k, v);
    if (d.k.startsWith('lab.')) R.saveLab();
    R.save();
    R.redraw();
  };
  X.hidedemo = () => { S.rx.demo = 0; R.save(); R.redraw(); };

  /* ---------------- pages ---------------- */
  X.pg = d => { S.rx.cur = +d.n; S.rxu.q = ''; R.save(); R.redraw(); hap(); };
  X.pgadd = () => {
    const c = S.rx;
    c.pages.push(R.newPage('Page ' + (c.pages.length + 1)));
    c.cur = c.pages.length - 1;
    S.rxu.sec.tests = 1; S.rxu.sec.spec = 1; S.rxu.cat = 'sug'; S.rxu.q = '';
    R.save(); R.redraw();
    setTimeout(() => { const t = $1('#rx-tests'); t && t.scrollIntoView({ block: 'start', behavior: 'smooth' }); }, 40);
    toast('New page added — pick a profile');
  };
  X.pgmv = d => {
    const c = S.rx, i = c.cur, j = i + +d.d;
    if (j < 0 || j >= c.pages.length) return;
    [c.pages[i], c.pages[j]] = [c.pages[j], c.pages[i]];
    c.cur = j; R.save(); R.redraw();
  };
  X.pgmenu = () => sheet(`<h3>${E(R.page().nm)}</h3><div class="rx-menu"><button data-ra="pgdup">⧉ Duplicate page</button><button data-ra="pfill">✎ Fill typical values</button><button data-ra="pclr">⌫ Clear all results</button><button data-ra="selcur">⤓ Export this page only</button><button class="bad" data-ra="pgdel">🗑 Delete page</button></div>`);
  X.pgdup = () => {
    const c = S.rx, p = R.clone(R.page());
    p.id = R.uid(); p.nm += ' (copy)';
    c.pages.splice(c.cur + 1, 0, p); c.cur++;
    closeS(); R.save(); R.redraw(); toast('Page duplicated');
  };
  X.pgdel = () => {
    closeS();
    const c = S.rx, i = c.cur;
    if (c.pages.length === 1) { const old = R.clone(c.pages[0]); c.pages[0] = R.newPage('Page 1'); R.save(); R.redraw(); toast('Page cleared', () => { c.pages[0] = old; R.save(); R.redraw(); }); return; }
    const [p] = c.pages.splice(i, 1);
    c.cur = Math.max(0, i - 1);
    R.save(); R.redraw();
    toast('Page “' + p.nm + '” deleted', () => { c.pages.splice(i, 0, p); c.cur = i; R.save(); R.redraw(); });
  };

  /* ---------------- adding profiles with specimen validation ---------------- */
  const doAdd = (pg, p, psp) => {
    R.addProfile(pg, p, R.lab().prefill);
    const h = pg.rows.slice().reverse().find(x => x.h && x.pid === p.id);
    if (h && psp) h.psp = psp;
    S.rxu.q = '';
    R.auto(S.rx); R.save(); R.redraw(); hap();
    toast(p.n + ' added');
  };
  const doAddTest = (pg, hit) => {
    const row = R.mkRow(hit.t, hit.p, R.lab().prefill);
    row.acc = hit.p.acc.slice();
    pg.rows = pg.rows.filter(x => x.h || x.sub || x.n || x.r);
    if (!R.units(pg).length && (!pg.sp || pg.spAuto)) { pg.sp = row.acc[0]; pg.spAuto = 1; if (!pg.dept) pg.dept = hit.p.dept; }
    pg.rows.push(row);
    S.rxu.q = '';
    R.auto(S.rx); R.save(); R.redraw(); hap();
    toast(hit.t[1] + ' added');
  };
  // returns true if added right away; otherwise opens the conflict sheet
  const place = (acc, name, add, kind, id) => {
    const c = S.rx, pg = R.page(), units = R.units(pg);
    if (!units.length || !pg.sp || pg.sp === 'other' || pg.mix || acc.includes(pg.sp)) { add(pg, pg.mix ? acc[0] : ''); return; }
    const common = R.commonSpec(units.map(u => u.row.acc).concat([acc])), other = c.pages.findIndex((p, i) => i !== c.cur && !p.mix && p.sp && acc.includes(p.sp));
    sheet(`<h3>Specimen conflict</h3><p class="rx-sub"><b>${E(name)}</b> is tested on <b>${E(acc.map(a => R.specLabel(a)).join(' / '))}</b>, but this page is <b>${E(R.specLabel(pg.sp, pg.spx))}</b>. Each report page should carry one specimen type.</p><div class="rx-menu">
${common.length ? `<button data-ra="cfx" data-o="switch" data-sp="${common[0]}" data-kind="${kind}" data-id="${E(id)}">⇄ Switch page to ${E(R.specLabel(common[0]))} (accepted by every test here)</button>` : ''}
${other >= 0 ? `<button data-ra="cfx" data-o="page" data-pg="${other}" data-kind="${kind}" data-id="${E(id)}">→ Add to page “${E(c.pages[other].nm)}” (${E(R.specLabel(c.pages[other].sp))})</button>` : ''}
<button class="pri" data-ra="cfx" data-o="new" data-kind="${kind}" data-id="${E(id)}">＋ Add on a new page (recommended)</button>
<button data-ra="cfx" data-o="mix" data-kind="${kind}" data-id="${E(id)}">⚠ Add anyway — mixed specimens on this page</button>
<button data-ra="cfxno">Cancel</button></div>`);
  };
  const addFns = (kind, id) => {
    if (kind === 'p') { const p = R.PROF_BY[id]; return { acc: p.acc, name: p.n, add: (pg, psp) => doAdd(pg, p, psp) }; }
    const hit = R.TEST_BY_NAME[id]; return { acc: hit.p.acc, name: hit.t[1], add: pg => doAddTest(pg, hit) };
  };
  X.padd = d => {
    const p = R.PROF_BY[d.id], pg = R.page();
    if (!p) return;
    const go = () => place(p.acc, p.n, (pg2, psp) => doAdd(pg2, p, psp), 'p', p.id);
    if (R.hasProfile(pg, p.id)) { S.cb = go; sheet(`<h3>${E(p.n)} is already on this page</h3><p class="rx-sub">Add it a second time (e.g. a repeat sample)?</p><div class="ac"><button data-a="no">Cancel</button><button data-a="yes">Add again</button></div>`); return; }
    go();
  };
  X.tadd = d => { const hit = R.TEST_BY_NAME[d.k]; if (!hit) return; place(hit.p.acc, hit.t[1], pg => doAddTest(pg, hit), 't', d.k); };
  X.tcust = () => { const pg = R.page(), n = S.rxu.q.trim(); if (!n) return; pg.rows.push({ n, r: '', u: '', g: '' }); S.rxu.q = ''; R.save(); R.redraw(); setTimeout(() => { const l = document.querySelectorAll('#rx [data-c="r"]'); l.length && l[l.length - 1].focus(); }, 30); };
  X.cfxno = () => closeS();
  X.cfx = d => {
    closeS();
    const c = S.rx, f = addFns(d.kind, d.id);
    if (d.o === 'switch') { const pg = R.page(); pg.sp = d.sp; pg.spAuto = 0; f.add(pg, ''); toast('Page specimen → ' + R.specLabel(d.sp)); }
    else if (d.o === 'page') { c.cur = +d.pg; f.add(R.page(), ''); }
    else if (d.o === 'new') { const p = R.newPage('Page ' + (c.pages.length + 1)); c.pages.push(p); c.cur = c.pages.length - 1; f.add(p, ''); }
    else if (d.o === 'mix') { const pg = R.page(); pg.mix = 1; f.add(pg, f.acc[0]); }
  };
  X.pcat = d => { S.rxu.cat = d.k; S.rxu.q = ''; saveU(); R.redraw(); };
  X.splitpg = () => {
    const c = S.rx, from = R.page(), fi = c.cur;
    let moved = 0;
    for (let g = 0; g < 50; g++) {
      const u = R.conflicts(from)[0];
      if (!u) break;
      const k = R.pageFor(c, u.row.acc, fi);
      R.moveUnit(from, u.i, c.pages[k]);
      moved++;
    }
    R.save(); R.redraw(); toast(moved + ' item' + (moved > 1 ? 's' : '') + ' moved to matching pages');
  };
  X.fixsp = d => {
    const c = S.rx, from = c.pages[+d.pg], u = from && from.rows[+d.i];
    if (!u || !u.acc) return;
    const k = R.pageFor(c, u.acc, +d.pg);
    R.moveUnit(from, +d.i, c.pages[k]);
    c.cur = k; R.save(); R.redraw(); toast('Moved “' + u.n + '” to page ' + c.pages[k].nm);
  };

  /* ---------------- rows ---------------- */
  const focusLastName = () => setTimeout(() => { const l = document.querySelectorAll('#rx .rx-n,#rx .rx-hn,#rx .rx-sbh input'); l.length && l[l.length - 1].focus(); }, 30);
  X.radd = () => { R.page().rows.push({ n: '', r: '', u: '', g: '' }); R.save(); R.redraw(); focusLastName(); };
  X.rsub = () => { R.page().rows.push({ sub: 1, n: 'Sub-heading' }); R.save(); R.redraw(); focusLastName(); };
  X.rhead = () => { R.page().rows.push({ h: 1, n: 'New panel', acc: [] }); R.save(); R.redraw(); focusLastName(); };
  X.rdel = d => { const pg = R.page(), i = +d.i, [x] = pg.rows.splice(i, 1); R.auto(S.rx); R.save(); R.redraw(); toast('Removed ' + (x.n || 'row'), () => { pg.rows.splice(i, 0, x); R.save(); R.redraw(); }); };
  X.pdel = d => { const pg = R.page(), i = +d.i, rows = R.removePanel(pg, i); R.auto(S.rx); R.save(); R.redraw(); toast('Removed ' + (rows[0] ? rows[0].n : 'panel'), () => { pg.rows.splice(i, 0, ...rows); R.save(); R.redraw(); }); };
  X.rre = d => { const x = R.page().rows[+d.i]; if (x) { x.man = 0; R.auto(S.rx); R.save(); R.redraw(); } };
  const typical = x => { const p = R.PROF_BY[x.pid], t = p && p.t.find(t => t[0] === x.k); return t ? t[4] : null; };
  X.pfill = () => {
    closeS();
    const pg = R.page(), old = R.clone(pg.rows);
    let n = 0;
    pg.rows.forEach(x => { if (x.h || x.sub || x.a) return; const v = typical(x); if (v != null && v !== '' && x.r !== v) { x.r = v; n++; } });
    R.auto(S.rx); R.save(); R.redraw();
    toast(n ? n + ' values set to typical' : 'Nothing to fill', n ? () => { pg.rows = old; R.save(); R.redraw(); } : null);
  };
  X.pclr = () => {
    closeS();
    const pg = R.page(), old = R.clone(pg.rows);
    pg.rows.forEach(x => { if (!x.h && !x.sub) { x.r = ''; x.man = 0; } });
    R.auto(S.rx); R.save(); R.redraw();
    toast('Results cleared', () => { pg.rows = old; R.save(); R.redraw(); });
  };
  X.cmre = () => { const pg = R.page(); pg.acm = 1; pg.cmMan = 0; R.auto(S.rx); R.save(); R.redraw(); };
  X.cmclr = () => { const pg = R.page(); pg.cm = ''; pg.acm = 0; pg.cmMan = 1; R.save(); R.redraw(); };

  /* ---------------- signatures ---------------- */
  R.sigSrc = {};
  let sgT;
  async function sigFile(el) {
    const f = el.files && el.files[0], s = el.dataset.sgf;
    el.value = '';
    if (!f) return;
    try {
      const img = await R.sig.loadImage(f), png = /png/i.test(f.type), alpha = png && R.sig.hasAlpha(img);
      R.sigSrc[s] = { img, alpha };
      S.rxsg = { s, img, rm: alpha ? 0 : 1, k: 50, ink: 'auto' };
      sgOpen();
    } catch (e) { toast(e.message || 'Could not read the image'); }
  }
  function sgRun() {
    const g = S.rxsg, o = $1('#rx-sgo'), info = $1('#rx-sginfo');
    try {
      g.out = g.rm ? R.sig.extract(g.img, { k: g.k, ink: g.ink }) : R.sig.direct(g.img, g.ink);
      if (o) o.src = g.out.u;
      if (info) info.textContent = `${g.out.w} × ${g.out.h} px · transparent PNG`;
    } catch (e) { g.out = null; if (info) info.textContent = e.message; if (o) o.removeAttribute('src'); }
  }
  function sgOpen() {
    const g = S.rxsg;
    sheet(`<h3>Signature</h3><div class="rx-sgi big"><img id="rx-sgo" alt="Extracted signature"></div><p class="rx-hint" id="rx-sginfo"></p>
<div class="fd"><label class="ck rx-cb"><input type="checkbox" data-sgbg="1"${g.rm ? ' checked' : ''}> <span>Remove background automatically${R.sigSrc[g.s] && R.sigSrc[g.s].alpha ? ' (PNG already transparent)' : ''}</span></label></div>
${g.rm ? `<div class="fd"><label>Background removal strength</label><input type="range" min="0" max="100" value="${g.k}" data-sga="k" style="width:100%"></div>` : ''}
<p class="rx-lb">Ink colour</p><div class="seg rx-seg">${[['auto', 'Original'], ['black', 'Black'], ['blue', 'Blue']].map(([k, l]) => `<button class="${g.ink === k ? 'on' : ''}" data-ra="sgink" data-v="${k}">${l}</button>`).join('')}</div>
<div class="ac"><button data-ra="cfxno">Cancel</button><button data-ra="sgapply" style="color:var(--pr)">Use signature</button></div>`);
    setTimeout(sgRun, 20);
  }
  X.sgbg = (d, b) => { S.rxsg.rm = b.checked ? 1 : 0; sgOpen(); };
  X.sgink = d => { S.rxsg.ink = d.v; sgOpen(); };
  X.sgadj = d => { const src = R.sigSrc[d.s]; if (!src) return; S.rxsg = { s: d.s, img: src.img, rm: src.alpha ? 0 : 1, k: 50, ink: 'auto' }; sgOpen(); };
  X.sgapply = () => {
    const g = S.rxsg;
    if (!g || !g.out) return toast('No signature found in the image');
    const slot = S.rx.sig[g.s];
    slot.img = { u: g.out.u, w: g.out.w, h: g.out.h }; slot.m = 'img'; slot.on = 1;
    closeS(); R.save(); R.redraw(); toast('Signature ready');
  };
  X.sgrm = d => { const g = S.rx.sig[d.s], old = g.img; g.img = null; R.save(); R.redraw(); toast('Signature image removed', () => { g.img = old; R.save(); R.redraw(); }); };
  X.sgsave = d => {
    const g = S.rx.sig[d.s], lab = R.lab();
    if (!g.n) return toast('Enter a name first');
    const o = { n: g.n, d: g.d || '', q: g.q || '', h: g.h || '', m: g.m, f: g.f, t: g.t || '', img: g.img || null }, i = lab.lib.findIndex(x => x.n === g.n);
    i >= 0 ? (lab.lib[i] = o) : lab.lib.push(o);
    if (R.saveLab()) toast('Saved to signatory library');
    R.redraw();
  };
  X.sglibdel = d => { const lab = R.lab(), [x] = lab.lib.splice(+d.i, 1); R.saveLab(); R.redraw(); toast('Deleted ' + x.n, () => { lab.lib.splice(+d.i, 0, x); R.saveLab(); R.redraw(); }); };
  document.addEventListener('change', e => { if (e.target.dataset && e.target.dataset.sgbg) X.sgbg(e.target.dataset, e.target); });

  /* ---------------- logo & header image ---------------- */
  async function logoFile(el) {
    const f = el.files && el.files[0], k = el.dataset.lgf;
    el.value = '';
    if (!f) return;
    try {
      const o = await R.sig.fit(f, k === 'logo' ? 360 : 1600, k === 'logo' ? 180 : 300);
      R.lab()[k] = o;
      if (R.saveLab()) toast(k === 'logo' ? 'Logo added' : 'Header image added');
      R.redraw();
    } catch (e) { toast('Could not read the image'); }
  }
  X.lgrm = d => { R.lab()[d.k] = null; R.saveLab(); R.redraw(); };

  /* ---------------- patients ---------------- */
  const ptList = () => (S.pts || []).map((x, i) => `<div class="rw"><span>${E(x.p || '(no name)')}<small>${E([x.pid, x.age, x.sx].filter(Boolean).join(' · '))}</small></span><div><button class="btn" data-ra="ptload" data-i="${i}">Use</button> <button class="ib" data-ra="ptdel" data-i="${i}" aria-label="Delete patient">${ico('trash')}</button></div></div>`).join('') || '<p class="rx-hint">No saved patients yet.</p>';
  X.pts = () => sheet(`<h3>Patient list</h3>${ptList()}<button class="calc" style="width:100%;margin-top:12px" data-ra="ptsave">Save current patient</button>`);
  X.ptsave = () => {
    const pt = S.rx.pt;
    if (!pt.pid && !pt.p) return toast('Enter a patient name or ID first');
    S.pts = S.pts || [];
    const o = { p: S.priv ? '' : pt.p, pid: pt.pid, age: pt.age, sx: pt.sx, ph: pt.ph, rb: pt.rb }, i = S.pts.findIndex(x => (pt.pid && x.pid === pt.pid) || (!pt.pid && x.p === pt.p));
    i < 0 ? S.pts.push(o) : (S.pts[i] = o);
    ST.set('pts', S.pts); toast('Patient saved');
    if ($1('#ov.on')) X.pts();
  };
  X.ptload = d => { Object.assign(S.rx.pt, S.pts[+d.i]); closeS(); R.auto(S.rx); R.save(); R.redraw(); };
  X.ptdel = d => { S.pts.splice(+d.i, 1); ST.set('pts', S.pts); X.pts(); };

  /* ---------------- cases (saved reports) ---------------- */
  const imgKey = u => { let h = 5381; for (let i = 0; i < u.length; i += 7) h = ((h * 33) ^ u.charCodeAt(i)) >>> 0; return 'i' + h.toString(36) + u.length.toString(36); };
  const pack = c => {
    const o = R.clone(c);
    ['l', 'r'].forEach(s => { const im = o.sig[s] && o.sig[s].img; if (im && im.u) { const k = imgKey(im.u); S.rximg[k] = im.u; o.sig[s].img = { ref: k, w: im.w, h: im.h }; } });
    if (S.priv) o.pt.p = '';
    return o;
  };
  const unpack = o => {
    const c = R.clone(o);
    ['l', 'r'].forEach(s => { const im = c.sig[s] && c.sig[s].img; if (im && im.ref) c.sig[s].img = S.rximg[im.ref] ? { u: S.rximg[im.ref], w: im.w, h: im.h } : null; });
    return c;
  };
  const pruneImg = () => {
    const used = new Set();
    S.rxs.forEach(x => ['l', 'r'].forEach(s => { const im = x.c.sig[s] && x.c.sig[s].img; if (im && im.ref) used.add(im.ref); }));
    Object.keys(S.rximg).forEach(k => used.has(k) || delete S.rximg[k]);
    R.store('rximg', S.rximg);
  };
  const caseName = c => (c.pt.p || '(no name)') + ' · ' + (c.pt.pid || c.pt.lno || '—');
  const caseList = () => {
    const q = String(S.rxcq || '').toLowerCase();
    return S.rxs.filter(x => !q || (x.n + ' ' + x.c.pages.map(p => p.nm).join(' ')).toLowerCase().includes(q)).map(x => {
      const i = S.rxs.indexOf(x);
      return `<div class="rw${x.c.id === S.rx.id ? ' rx-curc' : ''}"><span>${E(x.n)}<small>${new Date(x.ts).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })} · ${x.c.pages.map(p => E(p.nm)).join(', ')}</small></span><div><button class="btn" data-ra="copen" data-i="${i}">Open</button> <button class="ib" data-ra="cdup" data-i="${i}" aria-label="Open as a copy">⧉</button> <button class="ib" data-ra="cdel" data-i="${i}" aria-label="Delete case">${ico('trash')}</button></div></div>`;
    }).join('') || '<p class="rx-hint">No saved cases yet. Tap Save on the report to keep it here.</p>';
  };
  X.cases = () => {
    const leg = (S.rps || []).length;
    sheet(`<h3>Saved cases</h3><label class="rx-q">${ico('search')}<input data-rxcq="1" placeholder="Search name, ID or page" value="${E(S.rxcq || '')}"></label><div id="rx-cl">${caseList()}</div>
${leg ? `<p class="rx-lb">Older single-page reports (${leg})</p>${S.rps.map((x, i) => `<div class="rw"><span>${E(x.n)}<small>${new Date(x.ts).toLocaleDateString()}</small></span><div><button class="btn" data-ra="limp" data-i="${i}">Import</button></div></div>`).join('')}` : ''}
<div class="rx-row" style="margin-top:12px"><button class="calc" style="flex:1" data-ra="csave">Save current case</button></div>`);
  };
  X.csave = () => {
    R.auto(S.rx);
    const o = { id: S.rx.id, ts: Date.now(), n: caseName(S.rx), c: pack(S.rx) }, i = S.rxs.findIndex(x => x.id === S.rx.id);
    i >= 0 ? (S.rxs[i] = o) : S.rxs.unshift(o);
    S.rxs = S.rxs.slice(0, 150);
    if (R.store('rximg', S.rximg) && R.store('rxs', S.rxs)) { toast(i >= 0 ? 'Case updated' : 'Case saved'); R.audit('save report'); }
    if ($1('#ov.on')) X.cases();
  };
  const openCase = c => { S.rx = c; S.rx.cur = 0; S.rxsel = null; ST.set('rxsel', null); closeS(); R.auto(S.rx); R.saveNow(); R.redraw(); scrollTo(0, 0); };
  X.copen = d => { const x = S.rxs[+d.i]; if (!x) return; openCase(unpack(x.c)); toast('Opened — edit, then Save to update'); };
  X.cdup = d => { const x = S.rxs[+d.i]; if (!x) return; const c = unpack(x.c); c.id = R.uid(); c.demo = 0; openCase(c); toast('Opened as a new copy'); };
  X.cdel = d => { const i = +d.i, [x] = S.rxs.splice(i, 1); R.store('rxs', S.rxs); X.cases(); toast('Case deleted', () => { S.rxs.splice(i, 0, x); R.store('rxs', S.rxs); X.cases(); }); pruneLater(); };
  let prT; const pruneLater = () => { clearTimeout(prT); prT = setTimeout(pruneImg, 5000); };
  X.limp = d => { const x = S.rps[+d.i]; if (!x) return; openCase(R.fromLegacy(x.rp)); toast('Imported — Save to keep it as a case'); };

  X.newcase = () => sheet(`<h3>New case</h3><div class="rx-menu">
<button class="pri" data-ra="newblank">＋ Blank case<small>Keeps your signatures and letterhead</small></button>
<button data-ra="newsame">↻ Same patient, new visit<small>Copies patient details and test layout, clears results</small></button>
<button data-ra="newdemo">★ Demo case<small>Four filled pages showing every feature</small></button>
<button data-ra="cfxno">Cancel</button></div><p class="rx-hint">Tip: tap Save first if you want to keep the current case.</p>`);
  const replaceCase = (c, msg) => {
    const old = S.rx;
    openCase(c);
    toast(msg, () => { S.rx = old; R.saveNow(); R.redraw(); });
  };
  X.newblank = () => replaceCase(R.newCase(S.rx), 'New blank case');
  X.newsame = () => {
    const c = R.newCase(S.rx);
    Object.assign(c.pt, { pid: S.rx.pt.pid, p: S.rx.pt.p, age: S.rx.pt.age, sx: S.rx.pt.sx, ph: S.rx.pt.ph, rb: S.rx.pt.rb, pst: S.rx.pt.pst });
    c.pages = S.rx.pages.map(p => { const q = R.clone(p); q.id = R.uid(); q.rows.forEach(x => { if (!x.h && !x.sub) { x.r = ''; x.man = 0; } }); q.cm = ''; q.cmMan = 0; return q; });
    replaceCase(c, 'New visit for ' + (c.pt.p || 'patient'));
  };
  X.newdemo = () => replaceCase(R.buildDemo(), 'Demo case loaded');

  /* ---------------- hook into the app ---------------- */
  window.rep = function () {
    R.init();
    R.auto(S.rx);
    document.body.classList.add('rxon');
    R.sig.ready(R.fontsFor(S.rx));
    return R.view();
  };
  if (S.cur && S.cur.x === 'rep' && typeof render === 'function') render();
})();
