/* =====================================================================
   LabGenie Report Engine · render.js
   Builds print-ready A4 sheets (794 × 1123 px @ 96 dpi) for any set of
   report pages, with measured auto-pagination: long tables flow onto
   continuation sheets, panel headings stay with their first rows, and
   signatures / comments always land on the last sheet of each page.
   Also produces Word (.doc) HTML and plain text.
   ===================================================================== */
(function () {
  'use strict';
  const R = window.LGR;
  const E = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  R.E = E;
  const SW = 794, SH = 1123, PT = 30, PB = 26;

  /* ---------------- print stylesheet (also embedded in image / PDF export) ---------------- */
  R.CSS = `
.rxp{width:${SW}px;height:${SH}px;box-sizing:border-box;position:relative;overflow:hidden;background:#fff;color:#111;font:var(--fz,12.5px)/1.42 Arial,Helvetica,sans-serif;padding:${PT}px 40px ${PB}px;display:flex;flex-direction:column;-webkit-print-color-adjust:exact;print-color-adjust:exact;--ac:#111;--acl:#f1f1f1}
.rxp.rxm{height:auto;min-height:0}
.rxp *{box-sizing:border-box}
.rxp svg{fill:#000;stroke:none;flex:none}
.rxp small{color:#111;margin:0;line-height:1.3}
.rxp b{color:inherit}
.rxp.acc{--acl:color-mix(in srgb,var(--ac) 9%,#fff)}
.rxp .rq-wm{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(-32deg);font:700 92px Arial,sans-serif;letter-spacing:8px;color:rgba(0,0,0,.065);white-space:nowrap;pointer-events:none;z-index:0}
.rxp .rq-hd{display:flex;align-items:center;gap:14px;padding-bottom:9px;border-bottom:2.4px solid var(--ac);margin-bottom:10px}
.rxp .rq-hd .rq-lg{flex:0 0 auto;height:66px;width:auto;max-width:130px;display:block;object-fit:contain}
.rxp .rq-hd .rq-ht{flex:1;min-width:0;text-align:center}
.rxp .rq-hd.rq-wl .rq-ht{text-align:left}
.rxp .rq-hn{font:700 25px/1.12 Georgia,'Times New Roman',serif;color:var(--ac);letter-spacing:.3px}
.rxp .rq-htg{font:italic 11px/1.3 Arial,sans-serif;margin-top:2px;color:#333}
.rxp .rq-ha{font-size:10.8px;margin-top:3px;color:#222}
.rxp .rq-hgap{flex:0 0 auto}
.rxp .rq-himg{display:block;width:100%;height:118px;object-fit:contain;margin-bottom:8px}
.rxp .rq-ib{border:1.3px solid #111;border-radius:8px;padding:5px 11px;display:grid;grid-template-columns:1.25fr 1fr 1.05fr;gap:1px 14px;font-size:11.3px;line-height:1.36;position:relative;z-index:1;background:#fff}
.rxp .rq-ib .rq-c{display:flex;gap:4px;min-width:0;align-items:baseline}
.rxp .rq-ib .rq-k{flex:0 0 auto;min-width:60px;color:#333}
.rxp .rq-ib .rq-v{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.rxp .rq-ib .rq-v.rq-b{font-weight:700}
.rxp .rq-ib .rq-c.rq-f{grid-column:1/-1}
.rxp .rq-tr{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:10px;margin:9px 0 3px;min-height:38px;position:relative;z-index:1}
.rxp .rq-bc{font:9px/1.1 'Courier New',monospace;letter-spacing:1.5px}
.rxp .rq-bc svg{display:block;width:118px;height:28px;margin-bottom:2px}
.rxp .rq-tt{border:1.6px solid var(--ac);box-shadow:3px 3px 0 var(--ac);padding:5px 26px;font:700 19px Arial,sans-serif;text-align:center;background:#fff;color:#111;white-space:nowrap}
.rxp .rq-tt small{display:block;font:400 10px Arial,sans-serif;letter-spacing:.4px;margin-top:1px}
.rxp .rq-sp{justify-self:end;text-align:right;font-size:10.5px;line-height:1.35}
.rxp .rq-sp b{font-size:11px}
.rxp .rq-st{display:inline-block;border:1.2px solid #111;border-radius:4px;padding:0 6px;font:700 9.5px/1.6 Arial,sans-serif;letter-spacing:.6px;margin-top:2px}
.rxp .rq-mn{text-align:center;font:italic 700 11px Arial,sans-serif;margin:5px 0 2px}
.rxp table{width:100%;border-collapse:collapse;position:relative;z-index:1}
.rxp .rq-t{margin-top:6px}
.rxp .rq-t th{text-align:left;font-weight:700;font-size:12px;padding:6px 6px;border-top:2px solid var(--ac);border-bottom:2px solid var(--ac);background:var(--acl)}
.rxp .rq-t td{padding:5.5px 6px;border-bottom:1px dotted #8a8a8a;vertical-align:top}
.rxp .rq-t .rq-c1{width:38%}.rxp .rq-t .rq-c2{width:15%}.rxp .rq-t .rq-c3{width:7%}.rxp .rq-t .rq-c4{width:13%}
.rxp .rq-t .rq-ph td{padding:11px 6px 4px;border-bottom:1.4px solid #111;font-weight:700;text-transform:uppercase;letter-spacing:.5px;font-size:12px}
.rxp .rq-t .rq-ph td i{font:italic 400 10px Arial,sans-serif;text-transform:none;letter-spacing:0;margin-left:6px;color:#333}
.rxp .rq-t .rq-ph td em{float:right;font:400 10px Arial,sans-serif;text-transform:none;letter-spacing:0;border:1px solid #555;border-radius:3px;padding:0 5px;margin-top:1px}
.rxp .rq-t .rq-sb td{padding:7px 6px 3px;font-weight:700;font-style:italic;text-decoration:underline;border-bottom:0}
.rxp .rq-t .rq-rs{font-size:12.6px}
.rxp .rq-t .rq-ab .rq-rs,.rxp .rq-t .rq-ab .rq-fl{font-weight:700}
.rxp .rq-t .rq-cr td{background:var(--acl)}
.rxp .rq-t .rq-cr .rq-rs,.rxp .rq-t .rq-cr .rq-fl{font-weight:800;text-decoration:underline}
.rxp.acc .rq-t .rq-ab .rq-rs,.rxp.acc .rq-t .rq-ab .rq-fl{color:#b3261e}
.rxp .rq-t .rq-fl{white-space:nowrap}
.rxp .rq-t .rq-rg{font-size:11.5px}
.rxp .rq-ct{text-align:right;font:italic 10.5px Arial,sans-serif;margin-top:auto;padding-top:6px}
.rxp .rq-tail{margin-top:auto;padding-top:6px;position:relative;z-index:1}
.rxp .rq-cm{margin-top:10px;font-size:11.8px;white-space:pre-line;border-left:3px solid var(--ac);padding:4px 0 4px 9px;background:#fff}
.rxp .rq-cm b{display:block;font-size:11.5px;margin-bottom:1px}
.rxp .rq-nt{margin-top:7px;font-size:10px;color:#333;line-height:1.35}
.rxp .rq-lgd{margin-top:6px;font-size:9.5px;color:#333}
.rxp .rq-sg{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;margin-top:22px}
.rxp .rq-ss{flex:0 1 36%;text-align:center;line-height:1.25;font-size:10.4px}
.rxp .rq-ss b{font-size:11.4px}
.rxp .rq-si{height:48px;display:flex;align-items:flex-end;justify-content:center}
.rxp .rq-si img{display:block;margin-bottom:-4px}
.rxp .rq-sl{border-top:1px solid #111;width:62%;margin:0 auto 4px}
.rxp .rq-es{font-size:8.3px;color:#444;margin-top:1px}
.rxp .rq-sc{flex:1;display:flex;justify-content:center}
.rxp .rq-seal{width:92px;height:92px;border:2px solid #111;border-radius:50%;outline:1px solid #111;outline-offset:-6px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;font:700 8.2px/1.25 Arial,sans-serif;letter-spacing:.4px;transform:rotate(-8deg)}
.rxp .rq-seal b{font-size:19px;line-height:1}
.rxp .rq-eo{text-align:center;margin-top:12px;font-size:9.8px;letter-spacing:.5px}
.rxp .rq-ft{margin-top:8px;padding-top:5px;border-top:1px solid #111;display:flex;justify-content:space-between;flex-wrap:wrap;gap:2px 12px;font-size:9.6px;color:#222;position:relative;z-index:1}
.rxp .rq-ft .rq-ds{flex-basis:100%;text-align:center;font-style:italic;color:#444}
@media print{#pr .rxp{width:210mm;height:296.6mm;padding:8mm 10.5mm 7mm;break-after:page;page-break-after:always}#pr .rxp:last-child{break-after:auto;page-break-after:auto}}
`;
  const st = document.createElement('style');
  st.id = 'rx-print-css';
  st.textContent = R.CSS;
  document.head.appendChild(st);

  /* ---------------- Code 39 barcode (SVG) ---------------- */
  const C39P = 'nnnwwnwnn wnnwnnnnw nnwwnnnnw wnwwnnnnn nnnwwnnnw wnnwwnnnn nnwwwnnnn nnnwnnwnw wnnwnnwnn nnwwnnwnn wnnnnwnnw nnwnnwnnw wnwnnwnnn nnnnwwnnw wnnnwwnnn nnwnwwnnn nnnnnwwnw wnnnnwwnn nnwnnwwnn nnnnwwwnn wnnnnnnww nnwnnnnww wnwnnnnwn nnnnwnnww wnnnwnnwn nnwnwnnwn nnnnnnwww wnnnnnwwn nnwnnnwwn nnnnwnwwn wwnnnnnnw nwwnnnnnw wwwnnnnnn nwnnwnnnw wwnnwnnnn nwwnwnnnn nwnnnnwnw wwnnnnwnn nwwnnnwnn nwnnwnwnn'.split(' '),
    C39K = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. *';
  R.barcode = txt => {
    const s = '*' + String(txt || '0').toUpperCase().replace(/[^0-9A-Z.\- ]/g, '') + '*';
    let x = 0, b = '';
    for (const ch of s) {
      const p = C39P[C39K.indexOf(ch)] || C39P[36];
      for (let i = 0; i < 9; i++) { const w = p[i] === 'w' ? 2.5 : 1; if (i % 2 === 0) b += `<rect x="${x}" y="0" width="${w}" height="40"/>`; x += w; }
      x += 1;
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${x} 40" preserveAspectRatio="none" fill="#000">${b}</svg>`;
  };
  R.barcodePng = txt => {
    const s = R.barcode(txt), m = [...s.matchAll(/x="([\d.]+)" y="0" width="([\d.]+)"/g)], vw = +s.match(/viewBox="0 0 ([\d.]+)/)[1], c = document.createElement('canvas');
    c.width = Math.ceil(vw * 3); c.height = 90;
    const x = c.getContext('2d');
    x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, 90); x.fillStyle = '#000';
    m.forEach(a => x.fillRect(a[1] * 3, 0, a[2] * 3, 90));
    return c.toDataURL('image/png');
  };

  /* ---------------- helpers ---------------- */
  const fdt = x => {
    if (!x) return '';
    const d = new Date(x);
    if (isNaN(d)) return String(x).replace('T', ' ');
    const p = n => String(n).padStart(2, '0');
    return p(d.getDate()) + '-' + p(d.getMonth() + 1) + '-' + d.getFullYear() + (String(x).includes('T') ? ' ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '');
  };
  R.fdt = fdt;
  const nowStr = () => { const d = new Date(); return fdt(R.ltm(d)); };
  R.ageSex = pt => { const a = String(pt.age || '').trim(), ag = /^\d+(\.\d+)?$/.test(a) ? a + ' Y' : a; return [ag, pt.sx].filter(Boolean).join(' / '); };
  R.flagTxt = (f, lab) => {
    if (!f.f) return '';
    const a = lab.flg === 'ar' ? { H: '↑', L: '↓', A: 'A' }[f.f] : f.f;
    return f.c ? (lab.flg === 'ar' ? a + a : a + '*') : a;
  };

  /* printable rows of one page (results present, include ticked) */
  R.printable = pg => {
    const rows = pg.rows.filter(x => !x.off && (x.h || x.sub || (x.n && String(x.r == null ? '' : x.r).trim() !== '')));
    return rows.filter((x, i) => {
      if (!x.h && !x.sub) return true;
      for (let j = i + 1; j < rows.length; j++) { if (rows[j].h || (x.sub && rows[j].sub)) return false; if (!rows[j].sub) return true; }
      return false;
    });
  };

  /* ---------------- sheet fragments ---------------- */
  const header = (c, lab) => {
    const L = S.lab || {};
    if (lab.hdr === 'gap') return `<div class="rq-hgap" style="height:${Math.round((+lab.gap || 40) * 3.78)}px"></div>`;
    if (lab.hdr === 'img' && lab.himg) return `<img class="rq-himg" src="${lab.himg.u}" alt=""/>`;
    const contact = [L.t ? 'Tel: ' + E(L.t) : '', lab.em ? E(lab.em) : '', lab.web ? E(lab.web) : ''].filter(Boolean).join(' · ');
    return `<div class="rq-hd${lab.logo ? ' rq-wl' : ''}">${lab.logo ? `<img class="rq-lg" src="${lab.logo.u}" alt=""/>` : ''}<div class="rq-ht"><div class="rq-hn">${E(L.n || 'Clinical Laboratory')}</div>${lab.tag ? `<div class="rq-htg">${E(lab.tag)}</div>` : ''}<div class="rq-ha">${E(L.a || 'Address · City')}${contact ? '<br/>' + contact : ''}</div></div></div>`;
  };
  const infoBox = (c, pg) => {
    const pt = c.pt, cell = (k, v, b, f) => `<div class="rq-c${f ? ' rq-f' : ''}"><span class="rq-k">${k}</span><span>:</span><span class="rq-v${b ? ' rq-b' : ''}">${E(v)}</span></div>`;
    const cells = [
      cell('Name', pt.p, 1), cell('Age / Sex', R.ageSex(pt), 1), cell('Lab No', pt.lno, 1),
      cell('Patient ID', pt.pid), cell('Specimen', R.pageSpecLabel(pg)), cell('Report Date', fdt(pt.dt)),
      cell('Collected', fdt(pt.cd)), cell('Received', fdt(pt.rd)), cell('Reported', fdt(pt.deliv))
    ];
    const opt = [['Patient Type', pt.pst], ['Bed / Ward', pt.bed], ['Phone', pt.ph]].filter(a => a[1]);
    opt.forEach(a => cells.push(cell(a[0], a[1])));
    while (cells.length % 3) cells.push('<div></div>');
    cells.push(cell('Referred By', pt.rb, 0, 1));
    return `<div class="rq-ib">${cells.join('')}</div>`;
  };
  const titleRow = (c, pg, lab, contd) => {
    const code = c.pt.lno || c.pt.pid;
    const bc = lab.bc && code ? `<div class="rq-bc">${R.barcode(code)}<div>${E(String(code).toUpperCase())}</div></div>` : '<div></div>';
    const ttl = pg.ttl || (pg.dept ? pg.dept.replace(/^Serology \/ /, '') + ' Report' : 'Laboratory Report');
    return `<div class="rq-tr">${bc}<div class="rq-tt">${E(ttl)}${contd ? '<small>(continued)</small>' : ''}</div><div class="rq-sp"><b>${E(pg.nm)}</b><br/><span class="rq-st">${E(String(pg.st || 'Completed').toUpperCase())}</span></div></div>${pg.mn && !contd ? `<div class="rq-mn">${E(pg.mn)}</div>` : ''}`;
  };
  const rowHTML = (x, c, pg, lab) => {
    const sx = R.sexOf(c);
    if (x.h) {
      const psp = pg.mix ? R.specLabel(x.psp || (x.acc || [])[0]) : '';
      return `<tr class="rq-ph"><td colspan="5">${E(x.n)}${x.mn && lab.nts ? `<i>${E(x.mn)}</i>` : ''}${psp ? `<em>${E(psp)}</em>` : ''}</td></tr>`;
    }
    if (x.sub) return `<tr class="rq-sb"><td colspan="5">${E(x.n)}</td></tr>`;
    const f = R.flag(x, sx), ft = R.flagTxt(f, lab);
    return `<tr class="${f.c ? 'rq-cr rq-ab' : f.f ? 'rq-ab' : ''}"><td class="rq-c1">${E(x.n)}</td><td class="rq-c2 rq-rs">${E(x.r)}</td><td class="rq-c3 rq-fl">${E(ft)}</td><td class="rq-c4">${E(x.u)}</td><td class="rq-rg">${E(R.ref(x, sx)).replace(/\s*\|\s*/g, '<br/>')}</td></tr>`;
  };
  const sigSlot = (s, c) => {
    if (!s || !s.on) return '<div class="rq-ss"></div>';
    let img = '';
    if (s.m === 'img' && s.img) img = s.img;
    else if (s.m === 'font' && (s.t || s.n)) img = R.sig.typed(s.t || s.n, s.f || R.sig.FONTS[1]);
    const z = img ? R.sig.printSize(img, 190, 50) : null;
    return `<div class="rq-ss"><div class="rq-si">${img ? `<img src="${img.u}" alt="" style="width:${z.w}px;height:${z.h}px"/>` : ''}</div><div class="rq-sl"></div><b>${E(s.n)}</b>${s.d ? `<div>${E(s.d)}</div>` : ''}${s.q ? `<div>${E(s.q)}</div>` : ''}${s.h ? `<div>${E(s.h)}</div>` : ''}${img ? `<div class="rq-es">Electronically signed${c.pt.deliv ? ' · ' + E(fdt(c.pt.deliv)) : ''}</div>` : ''}</div>`;
  };
  const tail = (c, pg, lab, rows) => {
    const sx = R.sexOf(c), anyF = rows.some(x => !x.h && !x.sub && R.flag(x, sx).f), anyC = rows.some(x => !x.h && !x.sub && R.flag(x, sx).c);
    const notes = lab.nts ? [...new Set(pg.rows.filter(x => x.h && x.note && rows.includes(x)).map(x => x.note))] : [];
    const cm = String(pg.cm || '').trim();
    const legend = anyF ? `<div class="rq-lgd">${lab.flg === 'ar' ? '↑ High · ↓ Low' : 'H High · L Low'} · A Abnormal${anyC ? (lab.flg === 'ar' ? ' · ↑↑/↓↓ Critical value' : ' · * Critical value') : ''}</div>` : '';
    const sg = c.sig, sig = sg.l.on || sg.r.on || lab.seal ? `<div class="rq-sg">${sigSlot(sg.l, c)}<div class="rq-sc">${lab.seal ? '<div class="rq-seal"><span>MACHINE</span><span>GENERATED</span><b>✓</b><span>COPY</span></div>' : ''}</div>${sigSlot(sg.r, c)}</div>` : '';
    return `<div class="rq-tail">${cm ? `<div class="rq-cm"><b>Comment / Interpretation</b>${E(cm)}</div>` : ''}${notes.length ? `<div class="rq-nt"><b>Notes:</b> ${notes.map(E).join(' ')}</div>` : ''}${legend}${sig}${lab.eor ? '<div class="rq-eo">*** End of report ***</div>' : ''}</div>`;
  };
  const footer = (c, lab, pg) => {
    const L = [lab.pby ? `<span>Printed by: <b>${E(lab.pby)}</b></span>` : '', `<span>Printed: <b>${E(nowStr())}</b></span>`, lab.pn ? '<span>Page <b>{{P}}</b> of <b>{{N}}</b></span>' : '', lab.pw ? `<span>Powered by: <b>${E(lab.pw)}</b></span>` : ''].filter(Boolean);
    return `<div class="rq-ft">${L.join('')}${lab.disc ? `<div class="rq-ds">${E(lab.disc)}</div>` : ''}</div>`;
  };
  const sheetOpen = (lab, pg) => {
    const fz = { s: '11.8px', n: '12.5px', l: '13.4px' }[lab.fs] || '12.5px';
    const wm = lab.wm && pg.st && pg.st !== 'Completed' ? `<div class="rq-wm">${E(String(pg.st).split(' ')[0].toUpperCase())}</div>` : '';
    return `<div class="rxp${lab.col === 'acc' ? ' acc' : ''}" style="--fz:${fz};${lab.col === 'acc' ? '--ac:' + E(lab.acc) : ''}">${wm}`;
  };
  const thead = '<thead><tr><th class="rq-c1">Test Name</th><th class="rq-c2">Result</th><th class="rq-c3">Flag</th><th class="rq-c4">Unit</th><th>Reference Range</th></tr></thead>';

  /* ---------------- pagination ---------------- */
  let probe;
  const measure = html => {
    if (!probe) { probe = document.createElement('div'); probe.setAttribute('aria-hidden', 'true'); probe.style.cssText = `position:fixed;left:-12000px;top:0;width:${SW}px;visibility:hidden;pointer-events:none`; document.body.appendChild(probe); }
    probe.innerHTML = html;
    return probe.firstElementChild;
  };
  R.pageSheets = (c, pg, lab) => {
    const rows = R.printable(pg);
    const top = c => header(c, lab) + infoBox(c, pg) + titleRow(c, pg, lab, 0);
    const topC = header(c, lab) + infoBox(c, pg) + titleRow(c, pg, lab, 1);
    const rowsH = rows.map(x => rowHTML(x, c, pg, lab));
    const tl = tail(c, pg, lab, rows), ft = footer(c, lab, pg);
    // measure everything once on a single tall sheet
    const el = measure(sheetOpen(lab, pg).replace('class="rxp', 'class="rxp rxm') + top(c) + `<table class="rq-t">${thead}<tbody>${rowsH.join('')}</tbody></table><div class="rq-ct">Continued on next page…</div>` + tl + ft + '</div>');
    const rect = e => e.getBoundingClientRect(), sR = rect(el), tb = el.querySelector('table'), th = el.querySelector('thead'), trs = [...el.querySelectorAll('tbody tr')];
    const ctE = el.querySelector('.rq-ct'), tlE = el.querySelector('.rq-tail'), ftE = el.querySelector('.rq-ft');
    const topH = rect(th).top - sR.top - PT, theadH = rect(th).height, rh = trs.map(t => rect(t).height);
    const contH = rect(ctE).bottom - rect(tb).bottom, tailH = rect(tlE).bottom - rect(ctE).bottom + 4, ftH = rect(ftE).bottom - rect(tlE).bottom;
    const avail = SH - PT - PB - topH - theadH - ftH - 6;
    const chunks = [];
    let cur = [], used = 0;
    rows.forEach((x, i) => {
      if (cur.length && used + rh[i] > avail - contH) {
        // keep headings with the rows they introduce
        const carry = [];
        while (cur.length > 1 && (rows[cur[cur.length - 1]].h || rows[cur[cur.length - 1]].sub)) carry.unshift(cur.pop());
        chunks.push(cur);
        cur = carry;
        used = carry.reduce((a, j) => a + rh[j], 0);
      }
      cur.push(i);
      used += rh[i];
    });
    // last chunk must also hold the comment / signature block
    if (used + tailH > avail) {
      const move = [];
      if (cur.length > 2 && tailH < avail) {
        let freed = 0;
        while (cur.length > 1 && used - freed + tailH > avail) { const j = cur.pop(); move.unshift(j); freed += rh[j]; }
        while (cur.length > 1 && (rows[cur[cur.length - 1]].h || rows[cur[cur.length - 1]].sub)) move.unshift(cur.pop());
      }
      chunks.push(cur);
      cur = move;
    }
    chunks.push(cur);
    probe.innerHTML = '';
    return chunks.map((idx, k) => {
      const last = k === chunks.length - 1;
      const body = idx.length ? `<table class="rq-t">${thead}<tbody>${idx.map(i => rowsH[i]).join('')}</tbody></table>` : '';
      return sheetOpen(lab, pg) + (k ? topC : top(c)) + body + (last ? tl : '<div class="rq-ct">Continued on next page…</div>') + ft + '</div>';
    });
  };

  /* all sheets for the selected pages, numbered "Page x of N" */
  R.sheets = (c, idxs) => {
    const lab = R.lab(), out = [];
    idxs.forEach(i => { const pg = c.pages[i]; if (pg) out.push(...R.pageSheets(c, pg, lab)); });
    return out.map((h, i) => h.replace(/\{\{P\}\}/g, i + 1).replace(/\{\{N\}\}/g, out.length));
  };
  R.fontsFor = c => ['l', 'r'].map(k => c.sig[k]).filter(s => s && s.on && s.m === 'font').map(s => s.f || R.sig.FONTS[1]);

  /* ---------------- Word (.doc) ---------------- */
  R.word = (c, idxs) => {
    const lab = R.lab(), L = S.lab || {}, sx = R.sexOf(c);
    const page = pg => {
      const rows = R.printable(pg), code = c.pt.lno || c.pt.pid;
      const info = [['Name', c.pt.p], ['Age / Sex', R.ageSex(c.pt)], ['Lab No', c.pt.lno], ['Patient ID', c.pt.pid], ['Specimen', R.pageSpecLabel(pg)], ['Report Date', fdt(c.pt.dt)], ['Collected', fdt(c.pt.cd)], ['Received', fdt(c.pt.rd)], ['Reported', fdt(c.pt.deliv)]];
      [['Patient Type', c.pt.pst], ['Bed / Ward', c.pt.bed], ['Phone', c.pt.ph]].forEach(a => a[1] && info.push(a));
      const ir = [];
      for (let i = 0; i < info.length; i += 3) ir.push('<tr>' + [0, 1, 2].map(k => (info[i + k] ? `<td width="33%" style="padding:1pt 5pt;font-size:9.5pt">${info[i + k][0]} : <b>${E(info[i + k][1] || '')}</b></td>` : '<td></td>')).join('') + '</tr>');
      const td = (t, b, w) => `<td${w ? ` width="${w}"` : ''} style="border-bottom:.5pt dotted #777;padding:3pt 4pt;${b ? 'font-weight:bold' : ''}">${t}</td>`;
      const body = rows.map(x => {
        if (x.h) return `<tr><td colspan="5" style="padding-top:8pt;border-bottom:1pt solid #000"><b>${E(x.n).toUpperCase()}</b>${x.mn && lab.nts ? ` <i style="font-size:8pt">${E(x.mn)}</i>` : ''}</td></tr>`;
        if (x.sub) return `<tr><td colspan="5" style="padding-top:5pt"><b><i><u>${E(x.n)}</u></i></b></td></tr>`;
        const f = R.flag(x, sx);
        return '<tr>' + td(E(x.n), 0, '38%') + td(E(x.r), f.f) + td(E(R.flagTxt(f, lab)), 1) + td(E(x.u)) + td(E(R.ref(x, sx)).replace(/\s*\|\s*/g, '<br/>')) + '</tr>';
      }).join('');
      const th = t => `<th align="left" style="border-top:1.5pt solid #000;border-bottom:1.5pt solid #000;padding:3pt 4pt;font-size:10pt">${t}</th>`;
      const sgw = s => {
        if (!s || !s.on) return '<td width="38%"></td>';
        const img = s.m === 'img' && s.img ? s.img : s.m === 'font' && (s.t || s.n) ? R.sig.typed(s.t || s.n, s.f || R.sig.FONTS[1]) : null, z = img && R.sig.printSize(img, 170, 46);
        return `<td width="38%" align="center" style="font-size:9pt">${img ? `<img src="${img.u}" width="${z.w}" height="${z.h}"/>` : '<br/><br/>'}<div style="border-top:1pt solid #000;width:60%;margin:0 auto"></div><b>${E(s.n)}</b><br/>${E(s.d || '')}<br/>${E(s.q || '')}${s.h ? '<br/>' + E(s.h) : ''}</td>`;
      };
      const head = lab.hdr === 'gap' ? `<div style="height:${Math.round((+lab.gap || 40) * 2.83)}pt"></div>` : lab.hdr === 'img' && lab.himg ? `<p align="center"><img src="${lab.himg.u}" width="640"/></p>` : `<table width="100%" style="border-bottom:2pt solid #000"><tr>${lab.logo ? `<td width="90"><img src="${lab.logo.u}" height="60"/></td>` : ''}<td align="${lab.logo ? 'left' : 'center'}"><span style="font:bold 20pt Georgia">${E(L.n || 'Clinical Laboratory')}</span>${lab.tag ? `<br/><i style="font-size:9pt">${E(lab.tag)}</i>` : ''}<br/><span style="font-size:9pt">${E(L.a || '')}${L.t ? ' · Tel ' + E(L.t) : ''}${lab.em ? ' · ' + E(lab.em) : ''}</span></td></tr></table>`;
      const ttl = pg.ttl || (pg.dept ? pg.dept + ' Report' : 'Laboratory Report');
      return `${head}<table width="100%" style="border:1.2pt solid #000;margin-top:8pt;border-collapse:collapse">${ir.join('')}<tr><td colspan="3" style="padding:1pt 5pt;font-size:9.5pt">Referred By : <b>${E(c.pt.rb)}</b></td></tr></table>
<table width="100%" style="margin-top:8pt"><tr><td width="30%">${lab.bc && code ? `<img src="${R.barcodePng(code)}" width="150" height="30"/><br/><span style="font:7pt Courier New">${E(code)}</span>` : ''}</td><td width="40%" align="center" style="border:1.5pt solid #000;padding:5pt;font:bold 15pt Arial">${E(ttl)}</td><td width="30%" align="right" style="font-size:9pt"><b>${E(pg.nm)}</b><br/>${E(pg.st || '')}</td></tr></table>
${pg.mn ? `<p align="center" style="font:italic bold 9.5pt Arial">${E(pg.mn)}</p>` : ''}
<table width="100%" style="margin-top:8pt;border-collapse:collapse"><tr>${th('Test Name')}${th('Result')}${th('Flag')}${th('Unit')}${th('Reference Range')}</tr>${body}</table>
${pg.cm ? `<p style="font-size:10pt;margin-top:10pt"><b>Comment / Interpretation:</b><br/>${E(pg.cm).replace(/\n/g, '<br/>')}</p>` : ''}
${c.sig.l.on || c.sig.r.on ? `<table width="100%" style="margin-top:22pt"><tr>${sgw(c.sig.l)}<td></td>${sgw(c.sig.r)}</tr></table>` : ''}
${lab.eor ? '<p align="center" style="font-size:9pt;margin-top:12pt">*** End of report ***</p>' : ''}${lab.disc ? `<p align="center" style="font-size:8pt"><i>${E(lab.disc)}</i></p>` : ''}`;
    };
    const body = idxs.map(i => page(c.pages[i])).join('<br clear="all" style="page-break-before:always"/>');
    return `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>Report</title><!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View></w:WordDocument></xml><![endif]--><style>@page{size:A4;margin:12mm 13mm}body{font:10.5pt Arial,sans-serif;color:#000}table{border-collapse:collapse}</style></head><body>${body}</body></html>`;
  };

  /* ---------------- plain text (WhatsApp / e-mail friendly) ---------------- */
  R.text = (c, idxs) => {
    const sx = R.sexOf(c), lab = R.lab(), L = S.lab || {};
    let t = `${L.n || 'LABORATORY REPORT'}\nPatient: ${c.pt.p || '—'} (${R.ageSex(c.pt) || '—'})  ID: ${c.pt.pid || '—'}  Lab No: ${c.pt.lno || '—'}\nDate: ${fdt(c.pt.dt)}${c.pt.rb ? '\nRef. by: ' + c.pt.rb : ''}\n`;
    idxs.forEach(i => {
      const pg = c.pages[i];
      t += `\n== ${(pg.ttl || pg.nm).toUpperCase()} (${R.pageSpecLabel(pg)}) ==\n`;
      R.printable(pg).forEach(x => {
        if (x.h) t += `\n${x.n.toUpperCase()}\n`;
        else if (x.sub) t += `- ${x.n}\n`;
        else { const f = R.flagTxt(R.flag(x, sx), lab); t += `${x.n}: ${x.r} ${x.u || ''}${f ? ' [' + f + ']' : ''}${R.ref(x, sx) ? '  (ref ' + R.ref(x, sx).replace(/\s*\|\s*/g, '; ') + ')' : ''}\n`; }
      });
      if (pg.cm) t += `Comment: ${pg.cm}\n`;
    });
    return t.trim();
  };
})();
