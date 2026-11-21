/* =====================================================================
   LabGenie Report Engine · export.js
   Page picker (checkboxes) → Preview / Print / multi-page PDF / JPG /
   Word / Share / Copy text. Sheets are rasterised through an SVG
   foreignObject at 2× (≈192 dpi) and packed into a native PDF writer.
   ===================================================================== */
(function () {
  'use strict';
  const R = window.LGR;
  const X = (R.X = R.X || {});
  const E = R.E;
  const sheet = h => LGI.sheet(h), closeS = () => LGI.closeS(), dl = (b, n) => LGI.dl(b, n);

  /* ---------------- selection ---------------- */
  R.selIdx = () => {
    const ids = S.rxsel;
    const all = S.rx.pages.map((p, i) => i);
    if (!ids) return all;
    const o = all.filter(i => ids.includes(S.rx.pages[i].id));
    return o;
  };
  const fname = ext => {
    const c = S.rx, base = (c.pt.p || c.pt.pid || 'report').trim().replace(/[^\w-]+/g, '_').slice(0, 40);
    const idx = R.selIdx(), pg = idx.length === 1 ? '_' + S.rx.pages[idx[0]].nm.replace(/[^\w-]+/g, '_') : '';
    return 'LabReport_' + base + pg + (c.pt.dt ? '_' + c.pt.dt : '') + '.' + ext;
  };
  const prep = () => {
    R.auto(S.rx);
    return R.sig.ready(R.fontsFor(S.rx)).then(() => {
      const idx = R.selIdx();
      if (!idx.length) { toast('Select at least one page'); throw new Error('none'); }
      return idx;
    });
  };

  /* ---------------- page picker sheet ---------------- */
  X.export = () => {
    R.auto(S.rx);
    const c = S.rx, sel = R.selIdx(), chk = R.checks(c);
    const nE = chk.filter(x => x.lv === 'err').length, nC = chk.filter(x => x.lv === 'crit').length, nW = chk.filter(x => x.lv === 'warn').length;
    const share = !!(navigator.canShare && window.File && navigator.canShare({ files: [new File([''], 'a.pdf', { type: 'application/pdf' })] }));
    const list = c.pages.map((pg, i) => {
      const n = R.printable(pg).filter(x => !x.h && !x.sub).length, cf = R.conflicts(pg).length;
      return `<label class="rx-pk${sel.includes(i) ? ' on' : ''}"><input type="checkbox" data-rxsel="${i}"${sel.includes(i) ? ' checked' : ''}><span><b>${E(pg.nm)}</b><small>${E(R.pageSpecLabel(pg))} · ${n} result${n === 1 ? '' : 's'} · ${E(pg.st || 'Completed')}${cf ? ' · <i class="bad">specimen conflict</i>' : ''}</small></span></label>`;
    }).join('');
    const sum = nE || nC || nW ? `<div class="rx-chk">${nE ? `<span class="bad">● ${nE} error${nE > 1 ? 's' : ''}</span>` : ''}${nC ? `<span class="crit">● ${nC} critical</span>` : ''}${nW ? `<span class="warn">● ${nW} warning${nW > 1 ? 's' : ''}</span>` : ''}<button class="lnk" data-ra="goqc">Review</button></div>` : '<div class="rx-chk"><span class="ok">✓ Pre-release checks passed</span></div>';
    sheet(`<h3>Export / print report</h3><p class="rx-sub">Choose which report pages to include for <b>${E(c.pt.p || 'this patient')}</b>.</p>
<div class="rx-pkl">${list}</div>
<div class="rx-pka"><button class="btn" data-ra="selall">Select all</button><button class="btn" data-ra="selnone">None</button><button class="btn" data-ra="selcur">Current page only</button></div>
${sum}
<div class="rx-fmt">
<button data-ra="xprev"><b>👁</b>Preview</button><button data-ra="xprint"><b>🖨</b>Print</button><button data-ra="xpdf"><b>📄</b>PDF</button>
<button data-ra="xjpg"><b>🖼</b>JPG</button><button data-ra="xdoc"><b>📝</b>Word</button>${share ? '<button data-ra="xshare"><b>📤</b>Share PDF</button>' : ''}<button data-ra="xtxt"><b>📋</b>Copy text</button>
</div>`);
  };
  const setSel = ids => { S.rxsel = ids; ST.set('rxsel', ids); };
  X.selall = () => { setSel(S.rx.pages.map(p => p.id)); X.export(); };
  X.selnone = () => { setSel([]); X.export(); };
  X.selcur = () => { setSel([R.page().id]); X.export(); };
  document.addEventListener('change', e => {
    const el = e.target;
    if (el.dataset.rxsel === undefined) return;
    const id = S.rx.pages[+el.dataset.rxsel].id, cur = R.selIdx().map(i => S.rx.pages[i].id);
    setSel(el.checked ? [...new Set([...cur, id])] : cur.filter(x => x !== id));
    el.closest('.rx-pk').classList.toggle('on', el.checked);
  });
  X.goqc = () => { closeS(); S.rxu.sec.qc = 1; R.redraw(); setTimeout(() => { const q = document.getElementById('rx-qc'); q && q.scrollIntoView({ block: 'start' }); }, 50); };

  /* ---------------- preview ---------------- */
  X.xprev = () => prep().then(idx => {
    closeS();
    const sh = R.sheets(S.rx, idx), z = Math.min(1, (innerWidth - 24) / 794), o = document.getElementById('rv');
    const share = !!(navigator.canShare && window.File);
    o.innerHTML = `<div class="rvt rx-rvt"><button class="btn" data-ra="xclose">✕ Close</button><span class="rx-rvn">${idx.length} page${idx.length > 1 ? 's' : ''} · ${sh.length} sheet${sh.length > 1 ? 's' : ''}</span><button class="btn" data-ra="xprint">Print</button><button class="btn" data-ra="xpdf">PDF</button><button class="btn" data-ra="xjpg">JPG</button><button class="btn" data-ra="xdoc">Word</button>${share ? '<button class="btn" data-ra="xshare">Share</button>' : ''}</div><div class="rvb rx-rvb">${sh.map(h => `<div class="rx-shw" style="width:${Math.round(794 * z)}px;height:${Math.round(1123 * z)}px"><div style="transform:scale(${z});transform-origin:0 0">${h}</div></div>`).join('')}</div>`;
    o.className = 'on';
  }).catch(() => {});
  X.xclose = () => { const o = document.getElementById('rv'); o.className = ''; o.innerHTML = ''; };

  /* ---------------- print ---------------- */
  X.xprint = () => prep().then(idx => {
    closeS();
    document.getElementById('pr').innerHTML = R.sheets(S.rx, idx).join('');
    setTimeout(() => print(), 60);
  }).catch(() => {});

  /* ---------------- rasterise one sheet ---------------- */
  const raster = html => new Promise((res, rej) => {
    const d = document.createElement('div');
    d.innerHTML = html;
    const xml = new XMLSerializer().serializeToString(d.firstElementChild);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="794" height="1123"><foreignObject x="0" y="0" width="794" height="1123"><div xmlns="http://www.w3.org/1999/xhtml"><style>${R.CSS.replace(/@media print\{[\s\S]*$/, '')}</style>${xml}</div></foreignObject></svg>`;
    const im = new Image();
    im.onload = () => {
      try {
        const c = document.createElement('canvas'), K = 2;
        c.width = 794 * K; c.height = 1123 * K;
        const x = c.getContext('2d');
        x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height);
        x.scale(K, K); x.drawImage(im, 0, 0);
        c.toDataURL('image/jpeg', 0.1); // throws if the canvas is tainted
        res(c);
      } catch (e) { rej(e); }
    };
    im.onerror = () => rej(new Error('render'));
    im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  });
  const rasterAll = async idx => {
    const sh = R.sheets(S.rx, idx), out = [];
    for (let i = 0; i < sh.length; i++) {
      if (sh.length > 1) toast(`Rendering sheet ${i + 1} of ${sh.length}…`);
      out.push(await raster(sh[i]));
    }
    return out;
  };
  const jpegBytes = c => { const u = atob(c.toDataURL('image/jpeg', 0.92).split(',')[1]), b = new Uint8Array(u.length); for (let i = 0; i < u.length; i++) b[i] = u.charCodeAt(i); return b; };
  const fail = e => { if (e && e.message === 'none') return; toast('Image export is blocked in this browser — use Print → Save as PDF'); };

  /* ---------------- multi-page PDF writer ---------------- */
  R.pdf = imgs => {
    const enc = new TextEncoder(), parts = [], off = [];
    let len = 0;
    const o = b => { b = typeof b === 'string' ? enc.encode(b) : b; parts.push(b); len += b.length; };
    const obj = (k, fn) => { off[k] = len; o(k + ' 0 obj\n'); fn(); o('\nendobj\n'); };
    const W = 595.28, H = 841.89, n = imgs.length, total = 3 + n * 3;
    o('%PDF-1.4\n'); o(new Uint8Array([37, 226, 227, 207, 211, 10]));
    obj(1, () => o('<</Type/Catalog/Pages 2 0 R>>'));
    obj(2, () => o(`<</Type/Pages/Kids[${imgs.map((_, i) => 3 + i * 3 + ' 0 R').join(' ')}]/Count ${n}>>`));
    imgs.forEach((im, i) => {
      const p = 3 + i * 3, I = p + 1, C = p + 2, cs = `q ${W} 0 0 ${H} 0 0 cm /Im${i} Do Q`;
      obj(p, () => o(`<</Type/Page/Parent 2 0 R/MediaBox[0 0 ${W} ${H}]/Resources<</XObject<</Im${i} ${I} 0 R>>>>/Contents ${C} 0 R>>`));
      obj(I, () => { o(`<</Type/XObject/Subtype/Image/Width ${im.w}/Height ${im.h}/ColorSpace/DeviceRGB/BitsPerComponent 8/Filter/DCTDecode/Length ${im.b.length}>>\nstream\n`); o(im.b); o('\nendstream'); });
      obj(C, () => o(`<</Length ${cs.length}>>\nstream\n${cs}\nendstream`));
    });
    const x = len;
    let xr = `xref\n0 ${total}\n0000000000 65535 f \n`;
    for (let k = 1; k < total; k++) xr += String(off[k]).padStart(10, '0') + ' 00000 n \n';
    o(xr + `trailer<</Size ${total}/Root 1 0 R>>\nstartxref\n${x}\n%%EOF`);
    return new Blob(parts, { type: 'application/pdf' });
  };
  const makePdf = idx => rasterAll(idx).then(cs => R.pdf(cs.map(c => ({ b: jpegBytes(c), w: c.width, h: c.height }))));

  X.xpdf = () => prep().then(idx => { closeS(); return makePdf(idx); }).then(b => { dl(b, fname('pdf')); toast('PDF saved'); R.audit('export pdf'); }).catch(fail);
  X.xshare = () => prep().then(idx => { closeS(); return makePdf(idx); }).then(b => {
    const f = new File([b], fname('pdf'), { type: 'application/pdf' });
    if (navigator.canShare && navigator.canShare({ files: [f] })) return navigator.share({ files: [f], title: 'Lab report' }).catch(() => {});
    dl(b, fname('pdf'));
  }).catch(fail);
  X.xjpg = () => prep().then(idx => { closeS(); return rasterAll(idx); }).then(async cs => {
    const blobs = await Promise.all(cs.map(c => new Promise(r => c.toBlob(r, 'image/jpeg', 0.92))));
    const base = fname('jpg').replace(/\.jpg$/, '');
    const files = blobs.map((b, i) => new File([b], base + (blobs.length > 1 ? '_' + (i + 1) : '') + '.jpg', { type: 'image/jpeg' }));
    if (files.length > 1 && navigator.canShare && navigator.canShare({ files })) return navigator.share({ files, title: 'Lab report' }).catch(() => {});
    files.forEach((f, i) => setTimeout(() => dl(f, f.name), i * 450));
    toast(files.length > 1 ? files.length + ' JPG files saved' : 'JPG saved');
  }).catch(fail);
  X.xdoc = () => prep().then(idx => { closeS(); dl(new Blob(['﻿', R.word(S.rx, idx)], { type: 'application/msword' }), fname('doc')); toast('Word file saved'); }).catch(() => {});
  X.xtxt = () => prep().then(idx => { closeS(); cp(R.text(S.rx, idx)); }).catch(() => {});
})();
