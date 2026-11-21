/* =====================================================================
   LabGenie Report Engine · engine.js
   Case / page model, auto-calculations, flagging, specimen validation,
   quality checks and interpretive comments. No DOM work in this file.
   ===================================================================== */
(function () {
  'use strict';
  const R = window.LGR;
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const clone = o => JSON.parse(JSON.stringify(o));
  const eq = (a, b) => String(a).trim().toLowerCase() === String(b).trim().toLowerCase();
  R.uid = uid;
  R.clone = clone;
  R.audit = a => { try { window.LGI && LGI.aud(a); } catch (_) {} };
  // localStorage write that reports quota problems instead of failing silently
  R.store = (k, v) => {
    try { localStorage.setItem('lg.' + k, JSON.stringify(v)); return true; }
    catch (e) { toast('Storage is full — delete old saved cases or images'); return false; }
  };

  /* ---------------- lab-level settings (persist across cases) ---------------- */
  R.LAB_DEF = {
    em: '', web: '', tag: '', logo: null, hdr: 'lab', gap: 42, himg: null,
    bc: 1, seal: 0, wm: 1, fs: 'n', flg: 'hl', pn: 1, col: 'bw', acc: '#1d3b8b',
    eor: 1, nts: 1, disc: 'Results relate only to the specimen received. Interpret in clinical context.',
    pre: 'LG', seq: 0, prefill: 1, fit: 1, lib: [], pby: '', pw: ''
  };
  R.lab = () => {
    if (!S.rxl) S.rxl = Object.assign({}, R.LAB_DEF, ST.get('rxl', {}));
    return S.rxl;
  };
  R.saveLab = () => R.store('rxl', S.rxl);

  /* ---------------- model constructors ---------------- */
  const ltm = d => { const p = n => String(n).padStart(2, '0'); return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + 'T' + p(d.getHours()) + ':' + p(d.getMinutes()); };
  R.ltm = ltm;
  R.tadd = (s, h) => { const d = new Date(s); return isNaN(d) ? '' : ltm(new Date(d.getTime() + (+h || 4) * 36e5)); };

  R.newPage = nm => ({ id: uid(), nm: nm || 'Page', dept: '', ttl: '', mn: '', sp: '', spx: '', spAuto: 1, mix: 0, rows: [], cm: '', cmMan: 0, acm: 1, st: 'Completed' });

  R.newCase = keepFrom => {
    const n = ltm(new Date());
    const c = {
      v: 2, id: uid(),
      pt: { lno: '', pid: '', p: '', age: '', sx: '', ph: '', rb: '', bed: '', pst: '', dt: n.slice(0, 10), cd: n, rd: n, deliv: R.tadd(n, 4), ivl: 4, rdMan: 0, dvMan: 0 },
      pages: [R.newPage('Page 1')], cur: 0,
      sig: keepFrom ? clone(keepFrom.sig) : { l: { on: 0, m: 'font', f: 'Great Vibes' }, r: { on: 0, m: 'font', f: 'Mrs Saint Delafield' } }
    };
    return c;
  };

  R.mkRow = (t, p, prefill) => {
    const x = t[5] || {}, g = t[3];
    return {
      k: t[0], n: t[1], u: t[2], g: typeof g === 'object' ? '' : g, gs: typeof g === 'object' ? g : null,
      r: x.a ? '' : prefill ? t[4] : '', a: x.a ? 1 : 0, c: x.c || null, o: x.o || '', nv: x.nv || null, ab: x.ab || null, nf: x.nf ? 1 : 0, pid: p ? p.id : ''
    };
  };
  R.mkHead = p => ({ h: 1, n: p.n, pid: p.id, acc: p.acc.slice(), mn: p.mn || '', note: p.note || '', sex: p.sex || '', spl: p.spl || '' });

  R.profRows = (p, prefill) => {
    const out = [R.mkHead(p)];
    p.t.forEach(t => out.push(t[0] === '#' ? { sub: 1, n: t[1] } : R.mkRow(t, p, prefill)));
    return out;
  };

  /* panels on a page: [{i (header index), end (exclusive), row}] */
  R.panels = pg => {
    const o = [];
    pg.rows.forEach((x, i) => { if (x.h) o.push({ i, row: x }); });
    o.forEach((p, j) => (p.end = j + 1 < o.length ? o[j + 1].i : pg.rows.length));
    return o;
  };
  R.hasProfile = (pg, pid) => pg.rows.some(x => x.h && x.pid === pid);

  R.addProfile = (pg, p, prefill) => {
    pg.rows = pg.rows.filter(x => x.h || x.sub || x.n || x.r);
    const first = !R.panels(pg).length && !pg.rows.some(x => x.n);
    pg.rows.push(...R.profRows(p, prefill));
    // CBC / urine / stool routine pages print without an auto interpretation
    if (p.nocm && !pg.cmMan) { pg.acm = 0; pg.cm = ''; }
    if (first) {
      if (!pg.sp || pg.spAuto) { pg.sp = p.acc[0]; pg.spAuto = 1; }
      if (!pg.dept) pg.dept = p.dept;
      if (/^Page \d+$/.test(pg.nm)) pg.nm = p.cat === 'Urine & stool' ? (p.acc.includes('stool') ? 'Stool' : 'Urine') : p.cat === 'Fluids' ? p.n.split(' ')[0] : p.cat;
    }
  };

  R.removePanel = (pg, hi) => {
    const pn = R.panels(pg).find(p => p.i === hi);
    if (!pn) return [];
    return pg.rows.splice(pn.i, pn.end - pn.i);
  };

  /* ---------------- reference ranges & flags ---------------- */
  R.sexOf = c => (/^f/i.test(c.pt.sx) ? 'f' : /^m/i.test(c.pt.sx) ? 'm' : '');
  R.ref = (row, sx) => {
    if (row.gm || !row.gs) return row.g || '';
    if (sx === 'm') return row.gs.m;
    if (sx === 'f') return row.gs.f;
    return 'M: ' + row.gs.m + ' | F: ' + row.gs.f;
  };
  // numeric value of a result ("8–10" → 10, "< 0.5" → 0.5)
  R.val = s => {
    s = String(s == null ? '' : s).trim().replace(/,/g, '.');
    if (!s) return null;
    let m = s.match(/^(-?\d*\.?\d+)\s*(?:–|—|-|to)\s*(-?\d*\.?\d+)$/);
    if (m) return +m[2];
    m = s.match(/^[<>≤≥]?\s*(-?\d*\.?\d+)$/);
    return m ? +m[1] : null;
  };
  R.lim = ref => {
    ref = String(ref || '').trim();
    if (!ref || ref.includes('|')) return null;
    let m = ref.match(/^(<|≤|up to)\s*(-?\d*\.?\d+)/i);
    if (m) return { hi: +m[2], hiX: m[1] === '<' };
    m = ref.match(/^(>|≥)\s*(-?\d*\.?\d+)/);
    if (m) return { lo: +m[2] };
    m = ref.match(/(-?\d*\.?\d+)\s*(?:–|—|-|to)\s*(-?\d*\.?\d+)/);
    if (m) return { lo: +m[1], hi: +m[2] };
    return null;
  };
  const NORMAL_WORDS = /^(nil|negative|non-reactive|absent|not seen|not found|normal|no growth|clear|no organisms seen|no afb seen|adequate)/i;
  R.flag = (row, sx) => {
    const r = String(row.r == null ? '' : row.r).trim();
    if (!r || row.nf || row.h || row.sub) return { f: '', c: 0 };
    const ref = R.ref(row, sx);
    if (row.ab) return { f: row.ab.some(a => eq(a, r)) ? 'A' : '', c: 0 };
    const tm = r.match(/^1\s*:\s*(\d+)/), trf = ref.match(/(<|≤)\s*1\s*:\s*(\d+)/);
    if (tm && trf) { const v = +tm[1], l = +trf[2]; return { f: (trf[1] === '<' ? v >= l : v > l) ? 'H' : '', c: 0 }; }
    const v = R.val(r);
    if (v == null) {
      const nv = row.nv || (ref && NORMAL_WORDS.test(ref) ? [ref] : row.o && ref && R.val(ref) == null && !R.lim(ref) ? [ref] : null);
      if (nv && !nv.some(a => eq(a, r))) return { f: 'A', c: 0 };
      return { f: '', c: 0 };
    }
    let c = 0;
    if (row.c) { if (row.c[0] != null && v < row.c[0]) c = 1; if (row.c[1] != null && v > row.c[1]) c = 1; }
    const l = R.lim(ref);
    let f = '';
    if (l) {
      if (l.lo != null && v < l.lo) f = 'L';
      else if (l.hi != null && (l.hiX ? v >= l.hi : v > l.hi)) f = 'H';
    }
    if (c && !f) f = row.c[0] != null && v < row.c[0] ? 'L' : 'H';
    return { f, c };
  };

  /* ---------------- auto calculations (by test key) ---------------- */
  R.keyOf = row => row.k || ((R.TEST_BY_NAME[R.norm(row.n)] || {}).t || [])[0] || '';
  const ckd = (cr, age, sx) => {
    if (!(cr > 0 && age >= 18 && sx)) return NaN;
    const f = sx === 'f', k = f ? 0.7 : 0.9, al = f ? -0.241 : -0.302;
    return 142 * Math.pow(Math.min(cr / k, 1), al) * Math.pow(Math.max(cr / k, 1), -1.2) * Math.pow(0.9938, age) * (f ? 1.012 : 1);
  };
  R.ageY = a => {
    a = String(a || '').trim();
    if (!a) return NaN;
    if (/^\d+(\.\d+)?\s*(m|mo|month|d|day|w)/i.test(a)) return 0;
    return parseFloat(a);
  };
  const nz = x => (isNaN(x) ? NaN : x);
  R.AC = {
    mcv: [v => v('hct') / v('rbc') * 10, 1],
    mch: [v => v('hb') / v('rbc') * 10, 1],
    mchc: [v => v('hb') / v('hct') * 100, 1],
    anc: [v => v('wbc') * v('neu') / 100, 2],
    alc: [v => v('wbc') * v('lym') / 100, 2],
    amc: [v => v('wbc') * v('mon') / 100, 2],
    aec: [v => v('wbc') * v('eos') / 100, 2],
    ibil: [v => v('tbil') - v('dbil'), 2],
    glob: [v => v('tp') - v('alb'), 1],
    agr: [v => v('alb') / (v('tp') - v('alb')), 2],
    bun: [v => v('urea') * 0.467, 1],
    bcr: [v => (isNaN(v('bun')) ? v('urea') * 0.467 : v('bun')) / v('cr'), 1],
    egfr: [(v, x) => ckd(v('cr'), x.age, x.sx), 0],
    ldl: [v => (v('tg') < 400 ? v('tc') - v('hdl') - v('tg') / 5 : NaN), 0],
    vldl: [v => (v('tg') < 400 ? v('tg') / 5 : NaN), 0],
    nhdl: [v => v('tc') - v('hdl'), 0],
    tchdl: [v => v('tc') / v('hdl'), 2],
    ldlhdl: [v => v('ldl') / v('hdl'), 2],
    inr: [v => Math.pow(v('pt') / v('ptc'), isNaN(v('isi')) ? 1 : v('isi')), 2],
    eag: [v => 28.7 * v('a1c') - 46.7, 0],
    uibc: [v => v('tibc') - v('fe'), 0],
    tsat: [v => v('fe') / v('tibc') * 100, 1],
    agap: [v => v('na') - v('cl') - v('hco3'), 0],
    cca: [v => v('ca') + 0.8 * (4 - (isNaN(v('calb')) ? v('alb') : v('calb'))), 1],
    acr: [v => v('ualb') / v('ucr') * 100, 1],
    u24: [v => v('uprot') * v('uvol') / 100, 0],
    ccl: [v => v('ucr') * v('uvol') / (v('cr') * 1440), 1],
    homa: [v => v('fbs') * v('ins') / 405, 2],
    fpsar: [v => v('fpsa') / v('psa') * 100, 1],
    stsc: [v => v('sconc') * v('svol'), 1]
  };
  // value lookup: same page first, then any page of the case
  R.getter = (c, pg) => key => {
    const find = rows => rows.find(z => !z.h && !z.sub && R.keyOf(z) === key && R.val(z.r) != null);
    let y = find(pg.rows);
    if (!y) for (const p of c.pages) { if (p !== pg && (y = find(p.rows))) break; }
    return y ? R.val(y.r) : NaN;
  };
  R.auto = c => {
    const x = { age: R.ageY(c.pt.age), sx: R.sexOf(c) };
    for (let pass = 0; pass < 2; pass++)
      c.pages.forEach(pg => {
        const v = R.getter(c, pg);
        pg.rows.forEach(row => {
          if (row.h || row.sub || !row.a || row.man) return;
          const rule = R.AC[R.keyOf(row)];
          if (!rule) return;
          let o;
          try { o = nz(rule[0](v, x)); } catch (_) { o = NaN; }
          row.r = isFinite(o) ? (+o).toFixed(rule[1]) : '';
        });
      });
    c.pages.forEach(pg => { if (pg.acm && !pg.cmMan) pg.cm = R.comment(c, pg); });
  };
  R.isAutoName = n => !!R.AC[((R.TEST_BY_NAME[R.norm(n)] || {}).t || [])[0]];

  /* ---------------- specimen compatibility ---------------- */
  /* specimen "units": panel headings, plus single tests added on their own (they carry acc) */
  R.units = pg => {
    const o = [];
    pg.rows.forEach((x, i) => { if (x.acc && x.acc.length && !x.sub) o.push({ i, row: x, single: !x.h }); });
    return o;
  };
  R.conflicts = pg => (pg.mix || !pg.sp || pg.sp === 'other' ? [] : R.units(pg).filter(u => !u.row.acc.includes(pg.sp)));
  /* move one unit (panel with its rows, or a single test) to another page */
  R.moveUnit = (from, i, to) => {
    const x = from.rows[i];
    if (!x) return;
    let rows;
    if (x.h) rows = R.removePanel(from, i);
    else rows = from.rows.splice(i, 1);
    if (!to.rows.some(r => r.n || r.h)) { to.rows = []; if (!to.sp || to.spAuto) { to.sp = x.acc[0]; to.spAuto = 1; } }
    to.rows.push(...rows);
  };
  /* find (or create) a page whose specimen suits `acc` */
  R.pageFor = (c, acc, exceptIdx, nm) => {
    let k = c.pages.findIndex((p, i) => i !== exceptIdx && !p.mix && p.sp && acc.includes(p.sp));
    if (k < 0) {
      const p = R.newPage(nm || 'Page ' + (c.pages.length + 1));
      p.sp = acc[0];
      c.pages.push(p);
      k = c.pages.length - 1;
    }
    return k;
  };
  R.commonSpec = accs => {
    const L = accs.filter(a => a && a.length);
    if (!L.length) return [];
    return L[0].filter(s => L.every(a => a.includes(s)));
  };
  R.pageSpecLabel = pg => {
    if (pg.mix) {
      const s = [...new Set(R.units(pg).map(p => p.row.psp || p.row.acc[0]).filter(Boolean))].map(id => R.specLabel(id));
      return s.length ? s.join(' + ') : 'Multiple';
    }
    const p1 = R.panels(pg)[0];
    if (p1 && p1.row.spl && R.panels(pg).length === 1) return p1.row.spl;
    return R.specLabel(pg.sp, pg.spx);
  };

  /* ---------------- quality checks ---------------- */
  R.checks = c => {
    const out = [], sx = R.sexOf(c), add = (lv, pg, msg, act) => out.push({ lv, pg, msg, act });
    if (!c.pt.p) add('warn', -1, 'Patient name is empty.');
    if (!c.pt.pid && !c.pt.lno) add('warn', -1, 'Add a patient ID or lab number (used for the barcode).');
    if (!sx) add('info', -1, 'Gender not set — sex-specific reference ranges show both M and F values.');
    c.pages.forEach((pg, pi) => {
      const v = R.getter({ pages: [pg] }, pg), ok = x => !isNaN(x);
      R.conflicts(pg).forEach(p => add('err', pi, `“${p.row.n}” needs ${p.row.acc.map(a => R.specLabel(a)).join(' / ')} — page specimen is ${R.specLabel(pg.sp, pg.spx)}.`, { ra: 'fixsp', i: p.i, pg: pi }));
      if (!pg.sp && R.units(pg).length) add('warn', pi, 'Select a specimen type for this page.');
      R.panels(pg).forEach(p => { if (p.row.sex && sx && p.row.sex !== sx) add('warn', pi, `“${p.row.n}” is a ${p.row.sex === 'm' ? 'male' : 'female'}-specific test but the patient is ${sx === 'm' ? 'male' : 'female'}.`); });
      const empty = pg.rows.filter(x => !x.h && !x.sub && !x.off && x.n && String(x.r).trim() === '').length;
      if (empty) add('info', pi, `${empty} test${empty > 1 ? 's have' : ' has'} no result — ${empty > 1 ? 'they are' : 'it is'} left off the printed report.`);
      pg.rows.forEach(x => { if (!x.h && !x.sub && !x.off) { const f = R.flag(x, sx); if (f.c) add('crit', pi, `Critical value: ${x.n} ${x.r} ${x.u || ''} — notify the clinician and document the call.`); } });
      const dc = ['neu', 'lym', 'mon', 'eos', 'bas'].map(v);
      if (dc.filter(ok).length >= 4) { const s = dc.filter(ok).reduce((a, b) => a + b, 0); if (Math.abs(s - 100) > 1) add('warn', pi, `Differential count adds up to ${s}% (should be 100%).`); }
      const hb = v('hb'), hct = v('hct');
      if (ok(hb) && ok(hct) && Math.abs(hb * 3 - hct) > 4) add('info', pi, `Rule of three: Hb × 3 = ${(hb * 3).toFixed(1)} vs Hct ${hct} — check for sample or instrument error.`);
      const mchc = v('mchc');
      if (ok(mchc) && mchc > 36.5) add('warn', pi, `MCHC ${mchc} g/dL is implausibly high — check for lipaemia, cold agglutinins or spherocytes.`);
      if (ok(v('dbil')) && ok(v('tbil')) && v('dbil') > v('tbil')) add('err', pi, 'Direct bilirubin is higher than total bilirubin.');
      if (ok(v('alb')) && ok(v('tp')) && v('alb') > v('tp')) add('err', pi, 'Albumin is higher than total protein.');
      if (ok(v('hdl')) && ok(v('tc')) && v('hdl') >= v('tc')) add('err', pi, 'HDL is higher than total cholesterol.');
      if (ok(v('tg')) && v('tg') >= 400 && pg.rows.some(x => R.keyOf(x) === 'ldl')) add('info', pi, 'TG ≥ 400 mg/dL: Friedewald LDL is not valid — measure direct LDL.');
      const ag = v('agap');
      if (ok(ag) && (ag < 3 || ag > 30)) add('warn', pi, `Anion gap ${ag} mmol/L is outside the plausible range — re-check Na, Cl, HCO₃.`);
      if (ok(v('k')) && v('k') > 6) add('info', pi, 'High potassium — exclude haemolysis, delayed separation or EDTA contamination.');
      if (pg.st && pg.st !== 'Completed') add('info', pi, `Status is “${pg.st}”${R.lab().wm ? ' — a watermark will be printed' : ''}.`);
      const keys = {};
      pg.rows.forEach(x => { const k = !x.h && !x.sub && R.keyOf(x); if (k && x.r !== '') keys[k] = (keys[k] || 0) + 1; });
      Object.entries(keys).forEach(([k, n]) => { if (n > 1) add('info', pi, `Test “${(pg.rows.find(x => !x.h && R.keyOf(x) === k) || { n: k }).n}” appears ${n} times on this page.`); });
    });
    if (!c.sig.l.on && !c.sig.r.on) add('info', -1, 'No signature block is enabled.');
    return out;
  };

  /* ---------------- interpretive comment ---------------- */
  R.comment = (c, pg) => {
    const v = R.getter({ pages: [pg] }, pg), ok = x => !isNaN(x), sx = R.sexOf(c), fem = sx === 'f', L = [];
    const has = k => pg.rows.some(x => !x.h && R.keyOf(x) === k && String(x.r).trim() !== '');
    const val = k => { const r = pg.rows.find(x => !x.h && R.keyOf(x) === k); return r ? String(r.r).trim() : ''; };
    const pos = k => /^(positive|reactive|weakly)/i.test(val(k));
    // CBC
    const hb = v('hb'), mcv = v('mcv'), mchc = v('mchc'), wbc = v('wbc'), plt = v('plt');
    if (ok(hb) && hb < (fem ? 12 : 13)) {
      const t = ok(mcv) ? (mcv < 83 ? 'microcytic' : mcv > 101 ? 'macrocytic' : 'normocytic') : '';
      const h = ok(mchc) ? (mchc < 31.5 ? ' hypochromic' : ' normochromic') : '';
      L.push(`${(t + h).trim() ? (t + h).trim().replace(/^./, s => s.toUpperCase()) + ' anaemia' : 'Anaemia'} (Hb ${hb} g/dL)${t === 'microcytic' ? ' — consider iron studies' : t === 'macrocytic' ? ' — consider vitamin B12 / folate' : ''}.`);
    }
    if (ok(wbc)) { if (wbc > 10) L.push(`Leucocytosis (WBC ${wbc} ×10³/µL)${ok(v('neu')) && v('neu') > 80 ? ' with neutrophilia' : ''}.`); else if (wbc < 4) L.push(`Leucopenia (WBC ${wbc} ×10³/µL).`); }
    if (ok(v('eos')) && v('eos') > 6) L.push('Eosinophilia.');
    if (ok(v('lym')) && v('lym') > 40 && !(ok(wbc) && wbc < 4)) L.push('Relative lymphocytosis.');
    if (ok(plt)) { if (plt < 150) L.push(`Thrombocytopenia (${plt} ×10³/µL)${plt < 50 ? ' — confirm on smear, exclude clumping' : ''}.`); else if (plt > 450) L.push('Thrombocytosis.'); }
    if (ok(v('esr')) && v('esr') > (fem ? 20 : 15)) L.push(`Raised ESR (${v('esr')} mm/hr) — non-specific marker of inflammation.`);
    // glucose / diabetes
    const fbs = v('fbs'), pp = ok(v('ppbs')) ? v('ppbs') : v('og2'), a1c = v('a1c');
    if (ok(fbs)) { if (fbs >= 126) L.push(`Fasting glucose ${fbs} mg/dL is in the diabetic range (≥ 126; confirm on repeat).`); else if (fbs >= 100) L.push(`Impaired fasting glucose (${fbs} mg/dL).`); else if (fbs < 70) L.push(`Low fasting glucose (${fbs} mg/dL).`); }
    if (ok(pp)) { if (pp >= 200) L.push(`2-hour glucose ${pp} mg/dL is in the diabetic range (≥ 200).`); else if (pp >= 140) L.push(`Impaired glucose tolerance (2-hour ${pp} mg/dL).`); }
    if (ok(a1c)) L.push(`HbA1c ${a1c}%: ${a1c >= 6.5 ? 'consistent with diabetes' + (a1c >= 7 ? ' (above the usual target of < 7%)' : '') : a1c >= 5.7 ? 'prediabetes range' : 'non-diabetic range'}${ok(v('eag')) ? `; estimated average glucose ${v('eag')} mg/dL` : ''}.`);
    // lipids
    const ldl = v('ldl'), tg = v('tg'), hdl = v('hdl'), tc = v('tc');
    if ([ldl, tg, hdl, tc].some(ok)) {
      const p = [];
      if (ok(tc) && tc >= 200) p.push('total cholesterol ' + (tc < 240 ? 'borderline high' : 'high'));
      if (ok(ldl)) p.push('LDL ' + (ldl < 100 ? 'optimal' : ldl < 130 ? 'near optimal' : ldl < 160 ? 'borderline high' : ldl < 190 ? 'high' : 'very high'));
      if (ok(tg)) p.push('triglycerides ' + (tg < 150 ? 'normal' : tg < 200 ? 'borderline high' : tg < 500 ? 'high' : 'very high'));
      if (ok(hdl)) p.push('HDL ' + (hdl < (fem ? 50 : 40) ? 'low' : 'acceptable'));
      if (p.length) L.push('Lipid profile: ' + p.join('; ') + '.');
    }
    // liver
    const alt = v('alt'), ast = v('ast'), alp = v('alp'), ggt = v('ggt'), tb = v('tbil');
    const altU = fem ? 35 : 50;
    if (ok(alt) && alt > 3 * altU) L.push(`ALT more than 3× upper limit — hepatocellular pattern of injury${ok(ast) && ast / alt > 2 ? '; AST/ALT > 2' : ''}.`);
    else if (ok(alt) && alt > altU) L.push('Mildly raised ALT.');
    if (ok(alp) && alp > 120 && ok(ggt) && ggt > (fem ? 38 : 55)) L.push('Raised ALP with raised GGT — cholestatic pattern.');
    if (ok(tb) && tb > 1.2) L.push(`Hyperbilirubinaemia (${tb} mg/dL)${ok(v('dbil')) ? (v('dbil') / tb > 0.5 ? ', predominantly conjugated' : ', predominantly unconjugated') : ''}.`);
    // kidney
    const eg = v('egfr');
    if (ok(eg)) L.push(`eGFR ${eg} mL/min/1.73m²: ${eg >= 90 ? 'G1 (normal or high)' : eg >= 60 ? 'G2 (mildly decreased)' : eg >= 45 ? 'G3a (mildly to moderately decreased)' : eg >= 30 ? 'G3b (moderately to severely decreased)' : eg >= 15 ? 'G4 (severely decreased)' : 'G5 (kidney failure)'}.`);
    else if (has('cr') && pg.rows.some(x => R.keyOf(x) === 'egfr')) L.push('eGFR not calculated — enter patient age (adult) and gender.');
    const acr = v('acr');
    if (ok(acr)) L.push(`ACR ${acr} mg/g: ${acr < 30 ? 'normal to mildly increased (A1)' : acr <= 300 ? 'moderately increased albuminuria (A2)' : 'severely increased albuminuria (A3)'}.`);
    const ccl = v('ccl');
    if (ok(ccl)) L.push(`Creatinine clearance ${ccl} mL/min${ccl < 60 ? ' — reduced' : ''}.`);
    if (ok(v('ua')) && v('ua') > (fem ? 6 : 7.2)) L.push('Hyperuricaemia.');
    // electrolytes
    const na = v('na'), k = v('k');
    if (ok(na)) { if (na < 136) L.push(`Hyponatraemia (${na} mmol/L).`); else if (na > 145) L.push(`Hypernatraemia (${na} mmol/L).`); }
    if (ok(k)) { if (k < 3.5) L.push(`Hypokalaemia (${k} mmol/L).`); else if (k > 5.1) L.push(`Hyperkalaemia (${k} mmol/L) — exclude haemolysis.`); }
    const cca = v('cca');
    if (ok(cca)) { if (cca < 8.6) L.push(`Hypocalcaemia (corrected Ca ${cca} mg/dL).`); else if (cca > 10.2) L.push(`Hypercalcaemia (corrected Ca ${cca} mg/dL).`); }
    // coagulation
    const inr = v('inr');
    if (ok(inr) && inr > 1.2) L.push(`INR ${inr} is prolonged — correlate with anticoagulant therapy, liver disease or vitamin K status.`);
    // iron
    const ts = v('tsat'), fer = v('ferr');
    if (ok(ts) && ts < 20 && ok(fer) && fer < (fem ? 13 : 30)) L.push('Low transferrin saturation with low ferritin — consistent with iron deficiency.');
    else if (ok(ts) && ts < 20) L.push(`Low transferrin saturation (${ts}%).`);
    else if (ok(ts) && ts > 50) L.push(`Raised transferrin saturation (${ts}%) — consider iron overload.`);
    // thyroid
    const tsh = v('tsh'), ft4 = ok(v('ft4')) ? v('ft4') : NaN, ft3 = v('ft3');
    if (ok(tsh)) {
      if (tsh > 4.2) L.push(ok(ft4) ? (ft4 < 0.93 ? 'Raised TSH with low FT4 — pattern of primary hypothyroidism.' : 'Raised TSH with normal FT4 — subclinical hypothyroidism; repeat in 6–8 weeks with anti-TPO.') : `Raised TSH (${tsh} µIU/mL).`);
      else if (tsh < 0.27) L.push(ok(ft4) && (ft4 > 1.7 || (ok(ft3) && ft3 > 4.4)) ? 'Suppressed TSH with raised free hormones — pattern of hyperthyroidism.' : 'Low TSH with normal free hormones — subclinical hyperthyroidism or non-thyroidal illness.');
    }
    if (ok(v('tpo')) && v('tpo') >= 34) L.push('Positive anti-TPO — suggests autoimmune thyroid disease.');
    // vitamins
    const vd = v('vitd');
    if (ok(vd)) L.push(`Vitamin D ${vd} ng/mL: ${vd < 20 ? 'deficient' : vd < 30 ? 'insufficient' : vd <= 100 ? 'sufficient' : 'potentially toxic'}.`);
    if (ok(v('b12')) && v('b12') < 197) L.push('Low vitamin B12.');
    // misc
    if (ok(v('homa')) && v('homa') >= 2.5) L.push(`HOMA-IR ${v('homa')} suggests insulin resistance.`);
    if (ok(v('psa')) && v('psa') >= 4) L.push(`Total PSA ${v('psa')} ng/mL is above 4.0 — urology correlation advised${ok(v('fpsar')) ? `; free/total ratio ${v('fpsar')}%` : ''}.`);
    if (ok(v('crp')) && v('crp') >= 10) L.push(`Raised CRP (${v('crp')} mg/L) — active inflammation / infection.`);
    if (ok(v('trop')) && v('trop') >= 0.04) L.push('Troponin I above the 99th percentile — correlate with ECG and serial sampling.');
    // urine
    const pus = v('upus');
    if (ok(pus) && pus > 5) L.push(`Pyuria (pus cells ${val('upus')} /HPF)${pos('unit') ? ' with positive nitrite' : ''} — suggestive of urinary tract infection; culture advised.`);
    if (val('upro') && !/^nil$/i.test(val('upro'))) L.push(`Proteinuria (${val('upro')}) on dipstick — quantify with urine ACR / PCR.`);
    if (val('usug') && !/^nil$/i.test(val('usug'))) L.push(`Glycosuria (${val('usug')}).`);
    if (pos('uket')) L.push('Ketonuria.');
    // serology
    if (pos('dns1')) L.push('Dengue NS1 antigen positive — consistent with early (acute) dengue infection.');
    if (pos('digm')) L.push('Dengue IgM positive — recent dengue infection.');
    if (pos('hbsag')) L.push('HBsAg reactive — confirm and evaluate with HBV markers.');
    if (pos('hcv') || pos('hiv')) L.push('Reactive viral screening result — confirmatory testing required.');
    // semen
    if (has('sconc')) {
      const p = [];
      if (ok(v('sconc')) && v('sconc') < 16) p.push(v('sconc') === 0 ? 'azoospermia' : 'oligozoospermia');
      if (ok(v('sprog')) && v('sprog') < 30) p.push('asthenozoospermia');
      if (ok(v('smor')) && v('smor') < 4) p.push('teratozoospermia');
      L.push('Semen parameters: ' + (p.length ? p.join(', ') : 'normozoospermia') + ' (WHO 2021 lower reference limits).');
    }
    return L.join('\n');
  };

  /* ---------------- persistence ---------------- */
  let svT;
  R.save = () => { clearTimeout(svT); svT = setTimeout(() => R.store('rx', S.rx), 250); };
  R.saveNow = () => { clearTimeout(svT); R.store('rx', S.rx); };
  R.page = () => S.rx.pages[S.rx.cur] || S.rx.pages[0];

  R.buildDemo = () => {
    const c = R.newCase();
    Object.assign(c.pt, R.DEMO.pt);
    c.pages = R.DEMO.pages.map(d => {
      const pg = R.newPage(d.nm);
      d.prof.forEach(id => R.addProfile(pg, R.PROF_BY[id], 1));
      pg.nm = d.nm;
      pg.rows.forEach(x => { const k = R.keyOf(x); if (!x.h && d.set[k] != null) x.r = d.set[k]; });
      return pg;
    });
    c.sig = {
      l: { on: 1, n: 'Md. Karim Hossain', d: 'Medical Technologist (Lab)', q: 'B.Sc. in Medical Technology', h: '', m: 'font', f: 'Great Vibes', t: '' },
      r: { on: 1, n: 'Dr. Nasrin Akter', d: 'Consultant Pathologist', q: 'MBBS, M.Phil (Pathology)', h: '', m: 'font', f: 'Mrs Saint Delafield', t: '' }
    };
    c.demo = 1;
    R.auto(c);
    return c;
  };

  /* convert a legacy (v1) single-page report into a case */
  R.fromLegacy = rp => {
    const c = R.newCase();
    ['lno', 'pid', 'p', 'age', 'sx', 'ph', 'rb', 'bed', 'pst', 'dt', 'cd', 'rd', 'deliv'].forEach(k => { if (rp[k] != null) c.pt[k] = rp[k]; });
    const pg = c.pages[0];
    pg.nm = rp.dept || 'Report';
    pg.dept = rp.dept || '';
    pg.mn = rp.mn || '';
    pg.cm = rp.cm || '';
    pg.cmMan = rp.cm ? 1 : 0;
    pg.st = rp.rst || 'Completed';
    const sp = R.SPEC.find(s => eq(s[1], rp.sp || '')) || (rp.sp ? null : R.SPEC[0]);
    if (sp) pg.sp = sp[0]; else { pg.sp = 'other'; pg.spx = rp.sp; }
    pg.rows = (rp.rows || []).filter(x => x.n || x.r).map(x => (x.h ? { h: 1, n: x.n, acc: [] } : { n: x.n, r: x.r, u: x.u, g: x.g, c: x.c || null, a: x.a ? 1 : 0, man: x.man ? 1 : 0, off: x.off ? 1 : 0 }));
    ['l', 'r'].forEach(s => { const p = 's' + s; c.sig[s] = { on: rp[p] ? 1 : 0, n: rp[p + 'n'] || '', d: rp[p + 'd'] || '', q: rp[p + 'q'] || '', h: rp[p + 'h'] || '', m: rp[p + 'm'] === 'f' ? 'font' : '', f: rp[p + 'f'] || 'Great Vibes', t: rp[p + 't'] || '' }; });
    return c;
  };

  R.init = () => {
    R.lab();
    if (!S.rx) {
      const c = ST.get('rx', null);
      S.rx = c && c.v === 2 && c.pages && c.pages.length ? c : R.buildDemo();
    }
    // one-time: switch off auto interpretation on pages holding CBC / urine / stool routine panels
    if (!S.rx.m3) {
      S.rx.pages.forEach(pg => { if (!pg.cmMan && pg.rows.some(x => x.h && R.PROF_BY[x.pid] && R.PROF_BY[x.pid].nocm)) { pg.acm = 0; pg.cm = ''; } });
      S.rx.m3 = 1;
      R.save();
    }
    S.rxs = S.rxs || ST.get('rxs', []);
    if (S.rx.cur >= S.rx.pages.length) S.rx.cur = 0;
  };
})();
