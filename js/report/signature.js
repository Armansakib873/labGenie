/* =====================================================================
   LabGenie Report Engine · signature.js
   E-signatures: typed (font → PNG), direct PNG upload (trim + resize),
   JPG / photo upload with automatic ink extraction:
     1. paper-brightness map (block percentile, smoothed, bilinear)
     2. luminance normalised against the paper → removes shadows / tint
     3. Otsu threshold on "ink darkness" (user strength slider shifts it)
     4. soft alpha edge, speckle (small component) removal
     5. auto-crop to the strokes and resize for print
   ===================================================================== */
(function () {
  'use strict';
  const R = window.LGR;
  const G = (R.sig = {});
  G.FONTS = ['Mrs Saint Delafield', 'Great Vibes', 'Dancing Script', 'Allura', 'Homemade Apple'];
  G.MAXW = 640;
  G.MAXH = 220;

  /* ---------- typed signature ---------- */
  const cache = {};
  const fontOK = f => !document.fonts || document.fonts.check('64px "' + f + '"');
  G.ready = fonts => {
    if (!document.fonts) return Promise.resolve();
    const need = [...new Set(fonts)].filter(f => f && !fontOK(f));
    if (!need.length) return Promise.resolve();
    return Promise.race([Promise.all(need.map(f => document.fonts.load('64px "' + f + '"', 'Aa'))), new Promise(r => setTimeout(r, 2500))]).catch(() => {});
  };
  G.typed = (text, font) => {
    const k = font + '|' + text;
    if (cache[k]) return cache[k];
    const px = 72, fn = `${px}px "${font}",cursive`, c = document.createElement('canvas'), x = c.getContext('2d');
    x.font = fn;
    const m = x.measureText(text),
      a = Math.ceil(m.actualBoundingBoxAscent || px * 0.8),
      d = Math.ceil(m.actualBoundingBoxDescent || px * 0.3),
      l = Math.ceil(m.actualBoundingBoxLeft || 0),
      w = Math.ceil(l + (m.actualBoundingBoxRight || m.width)) + 14;
    c.width = Math.max(w, 10);
    c.height = a + d + 14;
    x.font = fn;
    x.fillStyle = '#10163a';
    x.textBaseline = 'alphabetic';
    x.fillText(text, 7 + l, 7 + a);
    const o = { u: c.toDataURL('image/png'), w: c.width, h: c.height };
    if (fontOK(font)) cache[k] = o;
    return o;
  };

  /* ---------- helpers ---------- */
  G.loadImage = file =>
    new Promise((res, rej) => {
      const u = URL.createObjectURL(file), im = new Image();
      im.onload = () => { URL.revokeObjectURL(u); res(im); };
      im.onerror = () => { URL.revokeObjectURL(u); rej(new Error('Could not read this image')); };
      im.src = u;
    });
  G.loadURL = u => new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = rej; im.src = u; });
  const toCanvas = (img, max) => {
    const iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height, s = Math.min(1, max / Math.max(iw, ih));
    const c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(iw * s));
    c.height = Math.max(1, Math.round(ih * s));
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    return c;
  };
  const fitOut = (src, sx, sy, sw, sh, maxW, maxH, type, q) => {
    const s = Math.min(maxW / sw, maxH / sh, 2), c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(sw * s));
    c.height = Math.max(1, Math.round(sh * s));
    const x = c.getContext('2d');
    x.imageSmoothingQuality = 'high';
    if (type === 'image/jpeg') { x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); }
    x.drawImage(src, sx, sy, sw, sh, 0, 0, c.width, c.height);
    return { u: c.toDataURL(type || 'image/png', q || 0.9), w: c.width, h: c.height };
  };

  /* resize a logo / header image (keeps PNG transparency) */
  G.fit = async (file, maxW, maxH) => {
    const im = await G.loadImage(file), png = /png|svg|webp|gif/i.test(file.type);
    const c = toCanvas(im, Math.max(maxW, maxH) * 2);
    return fitOut(c, 0, 0, c.width, c.height, maxW, maxH, png ? 'image/png' : 'image/jpeg', 0.88);
  };

  /* does this image already carry a transparent background? */
  G.hasAlpha = img => {
    const c = toCanvas(img, 400), d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
    let t = 0;
    for (let i = 3; i < d.length; i += 4) if (d[i] < 200) t++;
    return t / (d.length / 4) > 0.04;
  };

  /* direct PNG: trim transparent margin, recolour optional, resize */
  G.direct = (img, ink) => {
    const c = toCanvas(img, 1600), x = c.getContext('2d'), W = c.width, H = c.height, id = x.getImageData(0, 0, W, H), d = id.data;
    let x0 = W, y0 = H, x1 = -1, y1 = -1;
    const col = INK[ink];
    for (let y = 0; y < H; y++)
      for (let xx = 0; xx < W; xx++) {
        const i = (y * W + xx) * 4;
        if (d[i + 3] > 12) {
          if (xx < x0) x0 = xx; if (xx > x1) x1 = xx; if (y < y0) y0 = y; if (y > y1) y1 = y;
          if (col) { d[i] = col[0]; d[i + 1] = col[1]; d[i + 2] = col[2]; }
        }
      }
    if (x1 < 0) throw new Error('The PNG looks empty (fully transparent).');
    if (col) x.putImageData(id, 0, 0);
    const p = 4;
    x0 = Math.max(0, x0 - p); y0 = Math.max(0, y0 - p); x1 = Math.min(W - 1, x1 + p); y1 = Math.min(H - 1, y1 + p);
    return fitOut(c, x0, y0, x1 - x0 + 1, y1 - y0 + 1, G.MAXW, G.MAXH);
  };

  const INK = { black: [18, 18, 26], blue: [16, 40, 140], auto: null };

  /* automatic signature extraction from a photo / scan */
  G.extract = (img, o) => {
    o = Object.assign({ k: 50, ink: 'auto' }, o || {});
    const c = toCanvas(img, 1400), x = c.getContext('2d'), W = c.width, H = c.height, N = W * H;
    const id = x.getImageData(0, 0, W, H), d = id.data, lum = new Float32Array(N);
    for (let i = 0, j = 0; i < N; i++, j += 4) lum[i] = d[j + 3] < 128 ? 255 : 0.299 * d[j] + 0.587 * d[j + 1] + 0.114 * d[j + 2];

    // 1) paper brightness on a coarse grid (90th percentile per block)
    const B = Math.max(8, Math.round(Math.min(W, H) / 22)), gw = Math.ceil(W / B), gh = Math.ceil(H / B), grid = new Float32Array(gw * gh), hist = new Uint32Array(256);
    for (let gy = 0; gy < gh; gy++)
      for (let gx = 0; gx < gw; gx++) {
        hist.fill(0);
        let n = 0;
        const xe = Math.min(W, (gx + 1) * B), ye = Math.min(H, (gy + 1) * B);
        for (let y = gy * B; y < ye; y++) for (let xx = gx * B; xx < xe; xx++) { hist[lum[y * W + xx] | 0]++; n++; }
        let acc = 0, v = 255;
        const target = n * 0.9;
        for (let b = 0; b < 256; b++) { acc += hist[b]; if (acc >= target) { v = b; break; } }
        grid[gy * gw + gx] = v;
      }
    const sm = new Float32Array(gw * gh);
    for (let gy = 0; gy < gh; gy++)
      for (let gx = 0; gx < gw; gx++) {
        let s = 0, n = 0;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const yy = gy + dy, xx = gx + dx; if (yy >= 0 && yy < gh && xx >= 0 && xx < gw) { s += Math.max(grid[yy * gw + xx], grid[gy * gw + gx] * 0.85); n++; } }
        sm[gy * gw + gx] = s / n;
      }
    const bgAt = (xx, y) => {
      const fx = Math.min(gw - 1, Math.max(0, xx / B - 0.5)), fy = Math.min(gh - 1, Math.max(0, y / B - 0.5)),
        x0 = Math.floor(fx), y0 = Math.floor(fy), x1 = Math.min(gw - 1, x0 + 1), y1 = Math.min(gh - 1, y0 + 1), ax = fx - x0, ay = fy - y0;
      return (sm[y0 * gw + x0] * (1 - ax) + sm[y0 * gw + x1] * ax) * (1 - ay) + (sm[y1 * gw + x0] * (1 - ax) + sm[y1 * gw + x1] * ax) * ay;
    };

    // 2) ink darkness relative to the paper
    const dark = new Float32Array(N), dh = new Uint32Array(101);
    for (let y = 0; y < H; y++)
      for (let xx = 0; xx < W; xx++) {
        const i = y * W + xx, bg = Math.max(40, bgAt(xx, y)), v = Math.max(0, Math.min(1, 1 - lum[i] / bg));
        dark[i] = v;
        dh[Math.round(v * 100)]++;
      }

    // 3) Otsu threshold on darkness
    let sum = 0;
    for (let t = 0; t <= 100; t++) sum += t * dh[t];
    let sB = 0, wB = 0, best = 0, tO = 25;
    for (let t = 0; t <= 100; t++) {
      wB += dh[t];
      if (!wB) continue;
      const wF = N - wB;
      if (!wF) break;
      sB += t * dh[t];
      const mB = sB / wB, mF = (sum - sB) / wF, b = wB * wF * (mB - mF) * (mB - mF);
      if (b > best) { best = b; tO = t; }
    }
    const auto = Math.min(0.45, Math.max(0.1, tO / 100)), thr = auto * (0.5 + o.k / 100), lo = thr * 0.65, span = thr * 0.7;

    // 4) alpha + colour
    const alpha = new Float32Array(N);
    for (let i = 0; i < N; i++) alpha[i] = Math.max(0, Math.min(1, (dark[i] - lo) / span));
    // speckle removal (8-connected components on the solid mask)
    const lab = new Int32Array(N), stack = new Int32Array(N), minSize = Math.max(8, Math.round(N * 0.00005));
    let L = 0;
    for (let i = 0; i < N; i++) {
      if (alpha[i] < 0.3 || lab[i]) continue;
      L++;
      let sp = 0, cnt = 0;
      stack[sp++] = i;
      lab[i] = L;
      const members = [];
      while (sp) {
        const p = stack[--sp];
        cnt++;
        if (cnt <= minSize) members.push(p);
        const py = (p / W) | 0, px = p - py * W;
        for (let dy = -1; dy <= 1; dy++)
          for (let dx = -1; dx <= 1; dx++) {
            const qx = px + dx, qy = py + dy;
            if (qx < 0 || qy < 0 || qx >= W || qy >= H) continue;
            const q = qy * W + qx;
            if (!lab[q] && alpha[q] >= 0.3) { lab[q] = L; stack[sp++] = q; }
          }
      }
      if (cnt < minSize) members.forEach(p => (alpha[p] = 0));
    }
    // faint pixels that are not touching a kept stroke are dropped
    for (let i = 0; i < N; i++) if (alpha[i] > 0 && alpha[i] < 0.3) {
      const py = (i / W) | 0, px = i - py * W;
      let near = 0;
      for (let dy = -1; dy <= 1 && !near; dy++) for (let dx = -1; dx <= 1; dx++) { const qx = px + dx, qy = py + dy; if (qx >= 0 && qy >= 0 && qx < W && qy < H && alpha[qy * W + qx] >= 0.3) { near = 1; break; } }
      if (!near) alpha[i] = 0;
    }
    const col = INK[o.ink];
    let x0 = W, y0 = H, x1 = -1, y1 = -1;
    for (let y = 0; y < H; y++)
      for (let xx = 0; xx < W; xx++) {
        const i = y * W + xx, j = i * 4, a = alpha[i];
        if (a > 0.08) { if (xx < x0) x0 = xx; if (xx > x1) x1 = xx; if (y < y0) y0 = y; if (y > y1) y1 = y; }
        if (col) { d[j] = col[0]; d[j + 1] = col[1]; d[j + 2] = col[2]; }
        else { const k = 0.82; d[j] *= k; d[j + 1] *= k; d[j + 2] *= k; }
        d[j + 3] = Math.round(a * 255);
      }
    if (x1 < 0) throw new Error('No signature strokes found — try a lower removal strength or a clearer photo.');
    x.putImageData(id, 0, 0);
    const pad = 6;
    x0 = Math.max(0, x0 - pad); y0 = Math.max(0, y0 - pad); x1 = Math.min(W - 1, x1 + pad); y1 = Math.min(H - 1, y1 + pad);
    const out = fitOut(c, x0, y0, x1 - x0 + 1, y1 - y0 + 1, G.MAXW, G.MAXH);
    out.auto = auto;
    return out;
  };

  /* image size for print (keeps aspect, fits the signature box) */
  G.printSize = (img, boxW, boxH) => { const s = Math.min(boxW / img.w, boxH / img.h); return { w: Math.round(img.w * s), h: Math.round(img.h * s) }; };
})();
