/* =====================================================================
   LabGenie SOP Guidebook · visuals.js
   Pure-SVG illustration renderers used by guide sections:
     { h, v: '<type>', d: <data> }   (may be combined with li / st / tb / tip)
   Types: plates · fields · cells · pbf · bio · bags · ast · morph · tree
          sw · flow · agg
   Everything is drawn in code (no image files) so it works offline and
   stays crisp at any size. Drawings are schematic, not photographs.
   ===================================================================== */
(function () {
  'use strict';
  const G = (window.SOPG = window.SOPG || {});
  const E = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const P = v => Math.round(v * 10) / 10;
  const hash = s => { let h = 2166136261; for (const ch of String(s)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return ((h >>> 0) % 2147483646) + 1; };
  const rng = s => { let x = hash(s); return () => (x = (x * 16807) % 2147483647) / 2147483647; };
  let N = 0;
  const pol = (cx, cy, f, n = 120) => { let d = ''; for (let i = 0; i < n; i++) { const t = (i / n) * Math.PI * 2, r = f(t); d += (i ? 'L' : 'M') + P(cx + Math.cos(t) * r) + ' ' + P(cy + Math.sin(t) * r); } return d + 'Z'; };

  /* =========================== petri plate =========================== */
  const COLK = { dot: [1.8, 3.2, [20, 11, 6, 3]], big: [3.6, 5.6, [9, 6, 3, 2]], muc: [4.6, 7.4, [7, 5, 3, 2]], tiny: [0.8, 1.4, [38, 20, 10, 5]], pin: [1.1, 2, [30, 16, 8, 4]], fried: [3, 4.8, [9, 6, 3, 2]], dry: [3.4, 5.8, [9, 6, 3, 2]] };
  const plate = p => {
    const r = rng(p.n + '|' + (p.k || '') + (p.col || '') + (p.bg || ''));
    let back = '', fore = '';
    const k = p.k || 'dot';
    if (k === 'swarm') {
      for (let i = 5; i > 0; i--) back += `<circle cx="60" cy="60" r="${i * 9.4}" fill="none" stroke="${p.col}" stroke-opacity=".5" stroke-width="2.6"/>`;
      back += `<circle cx="60" cy="60" r="47" fill="${p.col}" fill-opacity=".22"/>`;
    } else if (k === 'fluff') {
      [[44, 46, 17], [76, 52, 14], [56, 80, 12]].forEach(([x, y, s]) => {
        let rays = '';
        for (let i = 0; i < 28; i++) { const a = (i / 28) * 6.283; rays += `<path d="M${x} ${y}L${P(x + Math.cos(a) * s * 1.15)} ${P(y + Math.sin(a) * s * 1.15)}" stroke="${p.col}" stroke-opacity=".55" stroke-width=".8"/>`; }
        fore += `${rays}<circle cx="${x}" cy="${y}" r="${s}" fill="${p.col}" fill-opacity=".9"/><circle cx="${x}" cy="${y}" r="${P(s * 0.45)}" fill="${p.ctr || p.col}"/>`;
      });
    } else if (k !== 'none') {
      const [a, b, cnt] = COLK[k] || COLK.dot;
      cnt.forEach((n, q) => {
        for (let i = 0; i < n; i++) {
          const s = a + r() * (b - a), ang = (q * 90 - 45 + (r() - 0.5) * 78) * Math.PI / 180, rad = 9 + r() * (41 - s);
          const x = P(60 + Math.cos(ang) * rad), y = P(60 + Math.sin(ang) * rad), c = p.col2 && r() < 0.45 ? p.col2 : p.col;
          if (p.halo) back += `<circle cx="${x}" cy="${y}" r="${P(s + (p.hr || 3.6))}"/>`;
          fore += `<circle cx="${x}" cy="${y}" r="${P(s)}" fill="${c}"${p.st ? ` stroke="${p.st}" stroke-width=".7"` : ''}/>`;
          if (k === 'muc' || k === 'big') fore += `<circle cx="${P(x - s * 0.35)}" cy="${P(y - s * 0.35)}" r="${P(s * 0.3)}" fill="#fff" fill-opacity=".45"/>`;
          if (p.ctr) fore += `<circle cx="${x}" cy="${y}" r="${P(s * 0.48)}" fill="${p.ctr}"/>`;
          if (k === 'dry') fore += `<path d="M${P(x - s * 0.55)} ${y}q${P(s * 0.27)} ${P(-s * 0.4)} ${P(s * 0.55)} 0t${P(s * 0.55)} 0" stroke="#0004" fill="none" stroke-width=".6"/>`;
        }
      });
      if (p.halo) back = `<g fill="${p.halo}" opacity="${p.ho || 0.6}">${back}</g>`;
    }
    const id = 'svp' + ++N;
    return `<svg class="sv-pl" viewBox="0 0 120 120" role="img" aria-label="${E(p.n)}"><defs><clipPath id="${id}"><circle cx="60" cy="60" r="52"/></clipPath></defs><circle cx="60" cy="60" r="58" fill="#eef2f6" stroke="#9fb0bf" stroke-width="1.4"/><circle cx="60" cy="60" r="52.5" fill="${p.bg}"/><g clip-path="url(#${id})">${back}${fore}</g><path d="M27 32a40 40 0 0 1 38-17" stroke="#fff" stroke-opacity=".6" stroke-width="4" fill="none" stroke-linecap="round"/></svg>`;
  };

  /* ======================= microscope field shapes ======================= */
  const ci = (x, y, r, c, ex) => `<circle cx="${P(x)}" cy="${P(y)}" r="${r}" fill="${c}"${ex || ''}/>`;
  const rot = (x, y, a, inner) => `<g transform="translate(${P(x)} ${P(y)}) rotate(${P(a * 57.3)})">${inner}</g>`;
  const SH = {
    cl: (x, y, c, r) => { let s = ''; for (let i = 0; i < 8; i++) s += ci(x + (r() - 0.5) * 9, y + (r() - 0.5) * 9, 2.2, c); return s; },
    ch: (x, y, c, r, a) => { let s = ''; for (let i = 0; i < 7; i++) { s += ci(x, y, 2.1, c); x += Math.cos(a) * 4.4; y += Math.sin(a) * 4.4; a += (r() - 0.5) * 0.6; } return s; },
    dp: (x, y, c, r, a) => rot(x, y, a, `<path d="M-.6 -3a2.4 3 0 1 0 0 6z" fill="${c}"/><path d="M.6 -3a2.4 3 0 1 1 0 6z" fill="${c}"/>`),
    ln: (x, y, c, r, a) => rot(x, y, a, `<ellipse cx="-3" cy="0" rx="3.1" ry="2" fill="${c}"/><ellipse cx="3" cy="0" rx="3.1" ry="2" fill="${c}"/><ellipse cx="0" cy="0" rx="7.5" ry="4.2" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width=".9"/>`),
    rd: (x, y, c, r, a) => rot(x, y, a, `<rect x="-5" y="-1.7" width="10" height="3.4" rx="1.7" fill="${c}"/>`),
    sr: (x, y, c, r, a) => rot(x, y, a, `<rect x="-2.8" y="-1.7" width="5.6" height="3.4" rx="1.7" fill="${c}"/>`),
    br: (x, y, c, r, a, it) => rot(x, y, a, `<rect x="-7.5" y="-2.1" width="15" height="4.2" rx=".7" fill="${c}"/>${it.sp ? `<ellipse cx="${it.sp === 't' ? 5.6 : 0}" cy="0" rx="2" ry="1.6" fill="${it.spc || '#f4f4f4'}"/>` : ''}`),
    afb: (x, y, c, r, a) => rot(x, y, a, `<path d="M-6 0q3 -1.6 6 0t6 0" fill="none" stroke="${c}" stroke-width="1.5" stroke-dasharray="1.4 .5" stroke-linecap="round"/>`),
    gr: (x, y, c, r, a, it) => rot(x, y, a, `<rect x="-5.5" y="-1.4" width="11" height="2.8" rx="1.2" fill="${c}"/>${ci(-4.4, 0, 1.2, it.g || '#1b1b3a')}${ci(4.4, 0, 1.2, it.g || '#1b1b3a')}`),
    ye: (x, y, c, r, a) => rot(x, y, a, `<ellipse cx="0" cy="0" rx="3.6" ry="2.8" fill="${c}"/><ellipse cx="4.6" cy="-.6" rx="1.9" ry="1.6" fill="${c}"/>`),
    ps: (x, y, c, r, a) => { let s = ''; for (let i = 0; i < 5; i++) { s += rot(x, y, a, `<ellipse cx="0" cy="0" rx="3.4" ry="1.6" fill="${c}"/>`); x += Math.cos(a) * 6.4; y += Math.sin(a) * 6.4; a += (r() - 0.5) * 0.5; } return s; },
    hy: (x, y, c, r, a) => { let d = `M${P(x)} ${P(y)}`, s = ''; for (let i = 0; i < 6; i++) { x += Math.cos(a) * 7; y += Math.sin(a) * 7; d += `L${P(x)} ${P(y)}`; if (i === 2) s += `<path d="M${P(x)} ${P(y)}l${P(Math.cos(a + 0.8) * 12)} ${P(Math.sin(a + 0.8) * 12)}" stroke="${c}" stroke-width="2.4" stroke-linecap="round"/>`; a += (r() - 0.5) * 0.4; } return `<path d="${d}" stroke="${c}" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-dasharray="6.4 .7"/>${s}`; },
    pmn: (x, y) => ci(x, y, 7, '#e9c6d6') + [[-2.6, -1.6], [1.4, -2.6], [2.6, 1.6], [-1.2, 2.4]].map(([dx, dy]) => ci(x + dx, y + dy, 1.9, '#6a3c90')).join(''),
    ep: (x, y, c, r) => `<path d="${pol(x, y, t => 15 + 3 * Math.sin(3 * t + r() * 6) + 2 * Math.cos(5 * t), 30)}" fill="#f1d3df" stroke="#c89bb2" stroke-width=".7" opacity=".95"/>${ci(x + 2, y - 1, 2.6, '#7a4c96')}`,
    rbc: (x, y) => ci(x, y, 4.4, '#f0b6be', ' stroke="#d58591" stroke-width=".8"'),
    sp: (x, y, c, r, a) => rot(x, y, a, `<path d="M-8 0q1 -2 2 0t2 0t2 0t2 0t2 0t2 0t2 0t2 0" fill="none" stroke="${c}" stroke-width="1"/>`),
    cap: (x, y, c) => ci(x, y, 7, '#f6f1dc') + ci(x, y, 3.4, c || '#cdb88d') + ci(x + 4.2, y - 3.2, 1.6, c || '#cdb88d'),
    asc: (x, y) => ci(x, y, 9.5, '#a8722e', ' stroke="#6b4316" stroke-width="2.2" stroke-dasharray="1.6 1"') + ci(x, y, 5.4, '#7a4f1c'),
    hk: (x, y, c, r, a) => rot(x, y, a, `<ellipse rx="11" ry="6.6" fill="#f4efe2" stroke="#8f8a78" stroke-width=".9"/>${[[-3.4, -1.6], [0, -2], [3.4, -1.4], [-2, 2], [1.8, 2.1]].map(([dx, dy]) => ci(dx, dy, 2.1, '#b7ad8e')).join('')}`),
    tt: (x, y, c, r, a) => rot(x, y, a, `<path d="M-9 -4.6q9 -2.6 18 0l2 4.6-2 4.6q-9 2.6 -18 0l-2 -4.6z" fill="#b07b34" stroke="#6a4416" stroke-width="1"/><ellipse cx="-10.4" rx="1.4" ry="2" fill="#f3e7c8"/><ellipse cx="10.4" rx="1.4" ry="2" fill="#f3e7c8"/>`),
    gd: (x, y, c, r, a) => rot(x, y, a, `<ellipse rx="7.4" ry="4.8" fill="#eadfb8" stroke="#8a7a4a" stroke-width=".8"/>${[[-3.4, -1.4], [-3.4, 1.4], [3.4, -1.4], [3.4, 1.4]].map(([dx, dy]) => ci(dx, dy, 1, '#5a4a2a')).join('')}<path d="M-5 0h10" stroke="#8a7a4a" stroke-width=".7"/>`),
    eh: (x, y) => ci(x, y, 7, '#e7dcae', ' stroke="#8a7a4a" stroke-width=".8"') + [[-2.4, -2], [2.4, -2], [-2.2, 2.4], [2.4, 2.2]].map(([dx, dy]) => ci(x + dx, y + dy, 1.2, 'none', ' stroke="#5a4a2a" stroke-width=".7"')).join('') + `<rect x="${P(x - 3)}" y="${P(y - 0.6)}" width="6" height="1.4" rx=".7" fill="#5a4a2a"/>`,
    tri: (x, y, c, r, a) => rot(x, y, a, `<path d="M-6 0q0 -6 6 -5q5 1 5 5t-5 5q-6 1 -6 -5z" fill="#cfe0d8" stroke="#7ba08f" stroke-width=".8"/>${ci(-1, 0, 1.6, '#4c7a68')}<path d="M5 0l5 -2M5 0l5 2M-6 0l-4 0" stroke="#7ba08f" stroke-width=".7"/>`),
    blob: (x, y, c, r) => `<path d="${pol(x, y, t => 6 + 2 * Math.sin(3 * t + r() * 5), 24)}" fill="${c}" opacity=".85"/>`
  };
  const fieldSVG = f => {
    const r = rng(JSON.stringify(f.it) + f.bg), id = 'svf' + ++N;
    let g = '';
    f.it.forEach(it => { for (let i = 0; i < (it.n || 8); i++) { const rad = Math.sqrt(r()) * 45, an = r() * 6.283; g += (SH[it.s] || SH.cl)(60 + Math.cos(an) * rad, 60 + Math.sin(an) * rad, it.c, r, r() * 6.283, it); } });
    return `<svg class="sv-fd" viewBox="0 0 120 120" role="img" aria-label="${E(f.n)}"><defs><clipPath id="${id}"><circle cx="60" cy="60" r="54"/></clipPath><radialGradient id="${id}g"><stop offset=".72" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></radialGradient></defs><circle cx="60" cy="60" r="59" fill="#17171c"/><g clip-path="url(#${id})"><circle cx="60" cy="60" r="54" fill="${f.bg}"/>${g}<circle cx="60" cy="60" r="54" fill="url(#${id}g)"/></g></svg>`;
  };

  /* ============================ blood cells ============================ */
  const RB = '#e38f9b', PL = '#f8d5da', NU = '#4a2a7c', NL = '#7c5cae';
  const rbc = (x, y, r, p) => ci(x, y, r, RB) + (p ? ci(x, y, p, PL) : '');
  const lobes = (pts, rr) => `<path d="M${pts.map(p => p.join(' ')).join('L')}" stroke="${NU}" stroke-width="${rr * 0.75}" fill="none" stroke-linecap="round"/>` + pts.map(p => ci(p[0], p[1], rr, NU)).join('');
  const dots = (seed, n, cx, cy, R, rr, c) => { const r = rng(seed); let s = ''; for (let i = 0; i < n; i++) { const a = r() * 6.283, d = Math.sqrt(r()) * R; s += ci(cx + Math.cos(a) * d, cy + Math.sin(a) * d, rr, c); } return s; };
  const neut = n => ci(30, 30, 21, '#f0dae2') + dots('ng' + n, 26, 30, 30, 18, 0.55, '#c9a0c0');
  const CELL = {
    nrm: () => rbc(30, 30, 17, 7),
    mic: () => ci(30, 30, 11.5, RB) + ci(30, 30, 8.4, PL),
    mac: () => rbc(30, 30, 23, 7),
    sph: () => ci(30, 30, 13.5, '#cf6273'),
    tgt: () => rbc(30, 30, 18, 12.5) + ci(30, 30, 5.6, RB),
    ell: () => `<ellipse cx="30" cy="30" rx="22" ry="10" fill="${RB}"/><ellipse cx="30" cy="30" rx="12" ry="3.4" fill="${PL}"/>`,
    tear: () => `<path d="${pol(30, 30, t => 14 + 15 * Math.pow(Math.max(0, Math.cos(t - 2.6)), 8))}" fill="${RB}"/>${ci(31, 29, 5.5, PL)}`,
    sic: () => `<path d="M7 41Q24 4 54 17Q46 22 38 23Q22 26 13 42Z" fill="#cf6273"/>`,
    sch: () => `<path d="M11 39L15 20Q30 9 46 20L50 39Q41 30 31 34Q21 30 11 39Z" fill="${RB}"/>`,
    ech: () => `<path d="${pol(30, 30, t => 16 + 2.6 * Math.pow(Math.max(0, Math.cos(14 * t)), 3), 240)}" fill="${RB}"/>${ci(30, 30, 6, PL)}`,
    aca: () => `<path d="${pol(30, 30, t => 12.5 + [0.4, 1.5, 2.3, 3.6, 4.5, 5.6].reduce((s, a) => s + 6.5 * Math.exp(-Math.pow(Math.atan2(Math.sin(t - a), Math.cos(t - a)), 2) / 0.012), 0), 240)}" fill="#d36d7d"/>`,
    sto: () => ci(30, 30, 18, RB) + `<rect x="21" y="27" width="18" height="6" rx="3" fill="${PL}"/>`,
    pol: () => ci(30, 30, 21, '#c49ac0') + ci(30, 30, 5, '#d8b8d4'),
    bs: () => rbc(30, 30, 18, 6) + dots('bs', 22, 30, 30, 15, 0.9, '#3d2f86'),
    hj: () => rbc(30, 30, 18, 7) + ci(40, 23, 2.8, '#3a2268'),
    pap: () => rbc(30, 30, 18, 7) + [[17, 34], [19, 37], [16, 38], [20, 33]].map(p => ci(p[0], p[1], 1.1, '#2d3a86')).join(''),
    nrbc: () => ci(30, 30, 16, '#e5b0bb') + ci(30, 30, 8.4, '#33195a'),
    ring: () => rbc(30, 30, 18, 6) + ci(37, 24, 4.4, 'none', ` stroke="#5146b8" stroke-width="1.5"`) + ci(40.5, 21.4, 1.8, '#b3245a') + ci(22, 37, 3.4, 'none', ` stroke="#5146b8" stroke-width="1.2"`) + ci(24.6, 35, 1.4, '#b3245a'),
    gam: () => `<path d="M8 36Q30 10 52 36Q30 24 8 36Z" fill="#8a72c4"/>` + ci(30, 27.6, 2.6, '#3b2a1a') + dots('gm', 6, 30, 28, 4, 0.7, '#2b1d10'),
    viv: () => ci(30, 30, 23, '#eaa7b1') + dots('sf', 40, 30, 30, 21, 0.8, '#c4405e') + `<path d="${pol(28, 31, t => 7 + 3 * Math.sin(3 * t) + 2 * Math.cos(5 * t), 40)}" fill="#6d79c9"/>` + ci(26, 29, 2.2, '#b3245a') + ci(30, 33, 0.9, '#3b2a1a'),
    rou: () => [10, 20, 30, 40, 50].map((x, i) => ci(x, 22 + i * 4, 10.5, i % 2 ? '#da8592' : RB, ' stroke="#c4707e" stroke-width=".6"')).join(''),
    agg: () => [[22, 22], [32, 20], [40, 28], [27, 31], [36, 38], [20, 38], [30, 44], [44, 40]].map(([x, y]) => ci(x, y, 7.6, RB, ' stroke="#bd6676" stroke-width=".6"')).join(''),
    neu: () => neut(1) + lobes([[20, 25], [28, 20], [37, 24], [35, 35], [25, 37]], 4.6),
    hyp: () => neut(2) + lobes([[17, 28], [21, 19], [30, 16], [39, 20], [43, 29], [38, 38], [28, 41]], 4),
    band: () => neut(3) + `<path d="M19 38Q15 19 30 18Q45 19 41 38" stroke="${NU}" stroke-width="7" fill="none" stroke-linecap="round"/>`,
    tox: () => ci(30, 30, 21, '#efd6e0') + dots('tx', 70, 30, 30, 19, 0.85, '#3c1f66') + lobes([[21, 26], [30, 21], [38, 27], [31, 36]], 4.4) + ci(18, 38, 1.8, '#fff') + ci(41, 39, 1.5, '#fff'),
    lym: () => ci(30, 30, 16, '#a6c2ec') + ci(31.5, 31, 13, NU) + dots('ly', 12, 31, 31, 10, 1, '#2c1450'),
    alym: () => `<path d="${pol(30, 30, t => 25 + 2.6 * Math.sin(3 * t + 1) + 1.6 * Math.cos(5 * t), 80)}" fill="#a3c0ea" stroke="#5b83c7" stroke-width="2.6"/>` + `<ellipse cx="23" cy="26" rx="10" ry="11.5" fill="#5c3e90"/>` + dots('al', 8, 23, 26, 8, 0.9, '#3a2068'),
    mono: () => ci(30, 30, 25, '#cdd3e6') + [[40, 38], [16, 40], [44, 24]].map(p => ci(p[0], p[1], 1.8, '#f6f6fb')).join('') + `<path d="M15 25Q17 13 31 15Q44 17 42 29Q37 26 33 31Q30 41 21 39Q13 34 15 25Z" fill="${NL}"/>`,
    eos: () => ci(30, 30, 21, '#f5d6c8') + dots('eo', 70, 30, 30, 19, 1.4, '#e2643f') + lobes([[22, 25], [38, 25]], 6.4),
    baso: () => ci(30, 30, 18, '#dccdea') + ci(30, 30, 9, '#8d74b8') + dots('ba', 32, 30, 30, 16, 1.8, '#2a1747'),
    blast: () => ci(30, 30, 24, '#9fbbe6') + ci(30, 31, 19.5, NL) + dots('bl', 40, 30, 31, 17, 0.6, '#5f4196') + ci(25, 26, 2.8, '#c8b7e3') + ci(35, 34, 2.5, '#c8b7e3'),
    auer: () => ci(30, 30, 24, '#9fbbe6') + ci(26, 32, 17, NL) + dots('au', 30, 26, 32, 15, 0.6, '#5f4196') + ci(23, 28, 2.6, '#c8b7e3') + `<path d="M40 13L48 25" stroke="#c4243d" stroke-width="1.7" stroke-linecap="round"/>` + dots('ag', 10, 42, 20, 6, 0.6, '#c4243d'),
    plasma: () => `<ellipse cx="32" cy="30" rx="25" ry="17" fill="#5a7fc4"/>` + ci(33, 30, 7, '#cddbf2') + ci(18, 30, 10.5, '#3a2160') + [[18, 23], [24.6, 27], [24.6, 33], [18, 37], [11.6, 33], [11.6, 27], [18, 30]].map(p => ci(p[0], p[1], 1.4, '#7a62a8')).join(''),
    smudge: () => `<path d="${pol(30, 30, t => 16 + 5 * Math.sin(2 * t + 0.4) + 3 * Math.sin(5 * t), 60)}" fill="${NL}" opacity=".7"/><path d="M17 25q12 6 26 -2M15 34q13 5 28 1" stroke="#5f4196" stroke-width="1.2" fill="none" opacity=".7"/>`,
    plt: () => [[16, 18, 3], [40, 16, 2.6], [30, 33, 3.2], [15, 42, 2.4], [45, 42, 2.8]].map(([x, y, r]) => `<path d="${pol(x, y, t => r + 0.6 * Math.sin(4 * t + x), 18)}" fill="#a88ad0"/>` + dots('p' + x, 4, x, y, r * 0.6, 0.55, '#5b3a90')).join(''),
    gplt: () => `<path d="${pol(30, 30, t => 12 + 1.2 * Math.sin(5 * t), 40)}" fill="#b597d6"/>` + dots('gp', 30, 30, 30, 10, 0.7, '#5b3a90') + ci(10, 12, 3.6, RB) + ci(50, 50, 3.6, RB),
    myelo: () => ci(30, 30, 21, '#ecd0dc') + dots('my', 40, 30, 30, 19, 0.7, '#b04f86') + ci(24, 31, 10.5, NL),
    bite: () => `<path d="${pol(30, 30, t => 17 - 10 * Math.exp(-Math.pow(Math.atan2(Math.sin(t + 0.6), Math.cos(t + 0.6)), 2) / 0.09), 160)}" fill="${RB}"/>` + ci(27, 31, 5, PL),
    retic: () => ci(30, 30, 19, '#cfe0dc') + `<path d="M17 24q6 4 10 -2t9 3t8 -1M18 33q7 -5 12 1t11 -2M24 40q4 -4 9 0t7 -3" stroke="#1f3f8f" stroke-width="1.3" fill="none"/>` + dots('rt', 10, 30, 30, 13, 0.9, '#1f3f8f'),
    heinz: () => ci(30, 30, 18, '#d9e6e2') + [[14, 28, 2.6], [44, 34, 2.2], [36, 15, 2], [22, 45, 1.8]].map(([x, y, r]) => ci(x, y, r, '#33307a')).join(''),
    hbh: () => ci(30, 30, 18, '#d6e3e0') + (() => { let s = ''; for (let y = 16; y <= 44; y += 4.2) for (let x = 16; x <= 44; x += 4.2) if ((x - 30) ** 2 + (y - 30) ** 2 < 220) s += ci(x, y, 1.3, '#3b4f9a'); return s; })(),
    sidero: () => ci(30, 30, 17, '#d9c9d6') + ci(30, 30, 9, '#6a4b8e') + [...Array(10).keys()].map(i => ci(30 + Math.cos(i * 0.63) * 11.5, 30 + Math.sin(i * 0.63) * 11.5, 1.4, '#1d4fb0')).join('')
  };
  const cellSVG = k => `<svg class="sv-cl" viewBox="0 0 60 60" role="img" aria-label="${E(k)}"><rect width="60" height="60" rx="10" fill="#fbf3f6"/>${(CELL[k] || CELL.nrm)()}</svg>`;

  /* ============================ test tubes ============================ */
  const tubeSVG = sp => {
    const s = typeof sp === 'string' ? { c: sp } : sp || {}, lv = s.lv || 30;
    let g = '';
    if (s.slide) {
      g = `<rect x="1" y="30" width="28" height="22" rx="2" fill="#eef4f8" stroke="#8fa0ae"/><ellipse cx="15" cy="41" rx="9" ry="6" fill="${s.slide}"/>${s.clump ? dots('ck' + s.slide, 14, 15, 41, 6, 1.1, s.clump) : ''}${s.bub ? [[12, 39, 2], [17, 42, 1.6], [15, 37, 1.3], [19, 39, 1.2], [11, 43, 1.1]].map(([x, y, r]) => ci(x, y, r, 'none', ' stroke="#fff" stroke-width=".9"')).join('') : ''}`;
      return `<svg class="sv-tb" viewBox="0 0 30 84">${g}</svg>`;
    }
    if (s.strip) {
      g = `<rect x="6" y="16" width="18" height="52" rx="2" fill="#fbfbf8" stroke="#a9b3bb"/><circle cx="15" cy="40" r="6.5" fill="${s.strip}"/>`;
      return `<svg class="sv-tb" viewBox="0 0 30 84">${g}</svg>`;
    }
    g += `<path d="M6 4h18v66a9 9 0 0 1-18 0z" fill="#f3f6f9"/>`;
    if (s.c) g += `<path d="M7 ${lv}h16v40a8 8 0 0 1-16 0z" fill="${s.c}"/>`;
    if (s.b) g += `<path d="M7 50h16v20a8 8 0 0 1-16 0z" fill="${s.b}"/><path d="M7 50V22L23 42v8z" fill="${s.s || s.b}"/>`;
    if (s.mot === '+') g += `<path d="M7 ${lv}h16v40a8 8 0 0 1-16 0z" fill="#000" fill-opacity=".16"/>`;
    if (s.mot === '-') g += `<path d="M15 ${lv + 2}V72" stroke="#000" stroke-opacity=".35" stroke-width="2"/>`;
    if (s.h2s) g += `<path d="M7 ${s.b ? 58 : 60}h16v12a8 8 0 0 1-16 0z" fill="#151515" opacity=".88"/>`;
    if (s.gas) g += `<ellipse cx="15" cy="64" rx="5" ry="2.2" fill="#fff" opacity=".9"/><path d="M9 56l5 3-3 3" stroke="#fff" fill="none" stroke-width=".9"/>`;
    if (s.ring) g += `<rect x="7" y="${lv - 5}" width="16" height="5.4" fill="${s.ring}"/>`;
    if (s.clot) g += `<path d="M10 50q5-9 10 0q3 9-5 11q-8-2-5-11z" fill="${s.clot}"/>`;
    if (s.bub) g += [[11, lv - 3, 2], [17, lv - 5, 2.4], [14, lv - 9, 1.7], [19, lv - 11, 1.4]].map(([x, y, r]) => ci(x, y, r, 'none', ' stroke="#9aa9b6" stroke-width=".8"')).join('');
    g += `<path d="M6 4h18v66a9 9 0 0 1-18 0z" fill="none" stroke="#8fa0ae" stroke-width="1.2"/><rect x="4.5" y="1" width="21" height="5" rx="1.5" fill="${s.cap || '#d9cfb8'}"/>`;
    return `<svg class="sv-tb" viewBox="0 0 30 84">${g}</svg>`;
  };

  /* ============================ blood bag ============================ */
  const bagSVG = b => `<svg class="sv-bg" viewBox="0 0 48 66"><path d="M18 2h4v7h-4zM26 2h4v7h-4z" fill="#b9c4cc"/><rect x="5" y="8" width="38" height="54" rx="9" fill="#f6f8fa" stroke="#93a3b0" stroke-width="1.3"/><path d="M6 ${P(61 - 50 * (b.f || 0.75))}h36v${P(50 * (b.f || 0.75) - 7)}a8 8 0 0 1-8 8H14a8 8 0 0 1-8-8z" fill="${b.c}"/><rect x="13" y="18" width="22" height="13" rx="2" fill="#fff" opacity=".88"/><path d="M16 22h16M16 26h10" stroke="#9aa9b6" stroke-width="1.2"/></svg>`;

  /* ============================ AST plate ============================ */
  const astSVG = d => {
    const pos = [[60, 60], ...[0, 1, 2, 3, 4, 5].map(i => [60 + Math.cos(i * 1.047 - 1.57) * 31, 60 + Math.sin(i * 1.047 - 1.57) * 31])];
    const id = 'sva' + ++N;
    const z = d.disks.slice(0, 7).map((k, i) => ci(pos[i][0], pos[i][1], P(Math.max(3.4, k[1] * 0.58)), '#f4ead0')).join('');
    const ds = d.disks.slice(0, 7).map((k, i) => ci(pos[i][0], pos[i][1], 3.6, '#fff', ' stroke="#9aa" stroke-width=".5"') + `<text x="${P(pos[i][0])}" y="${P(pos[i][1] + 1.2)}" text-anchor="middle" font-size="3.1" font-weight="700" fill="#333">${E(k[0])}</text>`).join('');
    return `<svg class="sv-pl" viewBox="0 0 120 120" role="img" aria-label="Disc diffusion plate"><defs><clipPath id="${id}"><circle cx="60" cy="60" r="52"/></clipPath><pattern id="${id}p" width="3" height="3" patternUnits="userSpaceOnUse"><rect width="3" height="3" fill="#d8c084"/><circle cx="1.5" cy="1.5" r=".6" fill="#c9ad6a"/></pattern></defs><circle cx="60" cy="60" r="58" fill="#eef2f6" stroke="#9fb0bf" stroke-width="1.4"/><g clip-path="url(#${id})"><circle cx="60" cy="60" r="52.5" fill="url(#${id}p)"/>${z}${ds}</g></svg>`;
  };

  /* ======================== colony morphology ======================== */
  const MORPH = {
    form: [
      ['Circular', `<circle cx="25" cy="25" r="15"/>`],
      ['Irregular', `<path d="${pol(25, 25, t => 14 + 3 * Math.sin(3 * t) + 2.2 * Math.cos(5 * t + 1))}"/>`],
      ['Punctiform', `<circle cx="25" cy="25" r="3.2"/>`],
      ['Filamentous', `<circle cx="25" cy="25" r="6"/>` + [...Array(14).keys()].map(i => { const a = i * 0.449; return `<path d="M${P(25 + Math.cos(a) * 6)} ${P(25 + Math.sin(a) * 6)}q${P(Math.cos(a + 0.6) * 6)} ${P(Math.sin(a + 0.6) * 6)} ${P(Math.cos(a) * 14)} ${P(Math.sin(a) * 14)}" fill="none" stroke-width="1.2"/>`; }).join('')],
      ['Rhizoid', `<circle cx="25" cy="25" r="5"/>` + [0, 1.3, 2.5, 3.8, 5.1].map(a => { const x = 25 + Math.cos(a) * 12, y = 25 + Math.sin(a) * 12; return `<path d="M25 25L${P(x)} ${P(y)}L${P(x + Math.cos(a + 0.6) * 7)} ${P(y + Math.sin(a + 0.6) * 7)}M${P(x)} ${P(y)}L${P(x + Math.cos(a - 0.6) * 7)} ${P(y + Math.sin(a - 0.6) * 7)}" fill="none" stroke-width="1.6"/>`; }).join('')],
      ['Spindle', `<path d="M6 25Q25 12 44 25Q25 38 6 25Z"/>`]
    ],
    elev: [
      ['Flat', `<rect x="8" y="29" width="34" height="3" rx="1"/>`],
      ['Raised', `<path d="M8 32L11 24H39L42 32Z"/>`],
      ['Convex', `<path d="M8 32Q25 14 42 32Z"/>`],
      ['Pulvinate', `<path d="M10 32Q8 12 25 12Q42 12 40 32Z"/>`],
      ['Umbonate', `<path d="M8 32Q14 24 20 23Q22 15 25 15Q28 15 30 23Q36 24 42 32Z"/>`],
      ['Crateriform', `<path d="M8 32Q10 20 16 20Q20 20 22 27Q25 29 28 27Q30 20 34 20Q40 20 42 32Z"/>`]
    ],
    margin: [
      ['Entire', `<circle cx="25" cy="25" r="15"/>`],
      ['Undulate', `<path d="${pol(25, 25, t => 14.5 + 1.4 * Math.sin(9 * t))}"/>`],
      ['Lobate', `<path d="${pol(25, 25, t => 12 + 4 * Math.abs(Math.sin(3 * t)))}"/>`],
      ['Erose', `<path d="${pol(25, 25, (() => { const r = rng('erose'), j = [...Array(48)].map(() => r()); return t => 13.5 + 2.4 * j[Math.floor((t / 6.2832) * 48) % 48]; })(), 48)}"/>`],
      ['Filiform', `<circle cx="25" cy="25" r="11"/>` + [...Array(26).keys()].map(i => { const a = i * 0.2417; return `<path d="M${P(25 + Math.cos(a) * 11)} ${P(25 + Math.sin(a) * 11)}l${P(Math.cos(a + 0.3) * 6)} ${P(Math.sin(a + 0.3) * 6)}" stroke-width=".9"/>`; }).join('')],
      ['Curled', `<circle cx="25" cy="25" r="15" fill-opacity=".35"/><path d="M25 25m-12 0a12 12 0 1 1 6 10.4M25 25m-7 0a7 7 0 1 1 3.5 6" fill="none" stroke-width="1.6"/>`]
    ]
  };

  /* ============================ renderers ============================ */
  const tx = s => (s ? `<p>${E(s)}</p>` : '');
  const V = {
    plates: d => `<div class="sv sv-g">${d.map(p => `<figure class="sv-c">${plate(p)}<figcaption><b>${E(p.n)}</b>${p.m ? `<i>${E(p.m)}</i>` : ''}${tx(p.t)}</figcaption></figure>`).join('')}</div>`,
    fields: d => `<div class="sv sv-g">${d.map(f => `<figure class="sv-c">${fieldSVG(f)}<figcaption><b>${E(f.n)}</b>${f.m ? `<i>${E(f.m)}</i>` : ''}${tx(f.t)}</figcaption></figure>`).join('')}</div>`,
    cells: d => `<div class="sv sv-g3">${d.map(([k, n, t]) => `<figure class="sv-c sv-cc">${cellSVG(k)}<figcaption><b>${E(n)}</b>${tx(t)}</figcaption></figure>`).join('')}</div>`,
    pbf: d => `<div class="sv">${d.map(x => `<div class="sv-dx"><h4>${E(x.n)}</h4><div class="sv-row">${(x.k || []).map(k => `<span class="sv-th">${cellSVG(k)}</span>`).join('')}</div>${x.up && x.up.length ? `<div class="sv-ch"><em class="u">▲</em>${x.up.map(v => `<span class="u">${E(v)}</span>`).join('')}</div>` : ''}${x.dn && x.dn.length ? `<div class="sv-ch"><em class="d">▼</em>${x.dn.map(v => `<span class="d">${E(v)}</span>`).join('')}</div>` : ''}${x.nm && x.nm.length ? `<div class="sv-ch"><em>＝</em>${x.nm.map(v => `<span>${E(v)}</span>`).join('')}</div>` : ''}${tx(x.f)}${x.tip ? `<p class="sv-tip">💡 ${E(x.tip)}</p>` : ''}</div>`).join('')}</div>`,
    bio: d => `<div class="sv">${d.map(x => `<div class="sv-bio"><div class="sv-bh"><h4>${E(x.n)}</h4>${x.pr ? `<p>${E(x.pr)}</p>` : ''}</div><div class="sv-tubes">${x.rs.map(([l, sp, sub]) => `<figure>${tubeSVG(sp)}<figcaption><b>${E(l)}</b>${sub ? `<i>${E(sub)}</i>` : ''}</figcaption></figure>`).join('')}</div>${x.how ? `<p class="sv-how"><b>Method:</b> ${E(x.how)}</p>` : ''}${x.use ? `<p class="sv-how"><b>Use:</b> ${E(x.use)}</p>` : ''}</div>`).join('')}</div>`,
    bags: d => `<div class="sv sv-g">${d.map(b => `<div class="sv-c sv-bc">${bagSVG(b)}<div><b>${E(b.n)}</b><span class="sv-tp ${b.tc || 'c'}">🌡 ${E(b.t)}</span><span class="sv-lf">⏳ ${E(b.life)}</span>${b.ag ? `<span class="sv-lf">↔ ${E(b.ag)}</span>` : ''}${tx(b.x)}</div></div>`).join('')}</div>`,
    ast: d => `<div class="sv sv-ast"><figure class="sv-c">${astSVG(d)}<figcaption>${tx(d.cap)}</figcaption></figure><div class="sv-tw"><table class="sp-tbl"><thead><tr><th>Disc</th><th>Zone</th><th>Result</th></tr></thead><tbody>${d.disks.map(k => `<tr><td><b>${E(k[0])}</b>${k[3] ? `<br><small>${E(k[3])}</small>` : ''}</td><td>${k[1]} mm</td><td><span class="sv-sir ${E(k[2])}">${E(k[2])}</span></td></tr>`).join('')}</tbody></table></div></div>`,
    morph: () => `<div class="sv">${[['form', 'Form (top view)'], ['elev', 'Elevation (side view)'], ['margin', 'Margin (edge)']].map(([k, h]) => `<h5 class="sv-h5">${h}</h5><div class="sv-g6">${MORPH[k].map(([n, s]) => `<figure class="sv-m"><svg viewBox="0 0 50 ${k === 'elev' ? 40 : 50}" fill="#e7b75a" stroke="#a7791f">${k === 'elev' ? '<path d="M2 32H48" stroke="#8a6a4a" stroke-width="1.4"/>' : ''}${s}</svg><figcaption>${n}</figcaption></figure>`).join('')}</div>`).join('')}</div>`,
    tree: d => { const n = x => `<li><div class="sv-nd${x.r ? ' r' : ''}"><b>${E(x.t)}</b>${x.s ? `<small>${E(x.s)}</small>` : ''}</div>${x.c && x.c.length ? `<ul>${x.c.map(n).join('')}</ul>` : ''}</li>`; return `<div class="sv sv-trw"><ul class="sv-tree">${n(d)}</ul></div>`; },
    sw: d => `<div class="sv sv-sw">${d.map(([l, c, t]) => `<div><i style="background:${c}"></i><span><b>${E(l)}</b>${t ? `<small>${E(t)}</small>` : ''}</span></div>`).join('')}</div>`,
    flow: d => `<ol class="sv sv-fl">${d.map(([r, t, c, n]) => `<li><i style="--c:${c || '#888'}"></i><div><b>${E(r)}</b>${t ? `<span>${E(t)}</span>` : ''}${n ? `<small>${E(n)}</small>` : ''}</div></li>`).join('')}</ol>`,
    agg: d => `<div class="sv sv-tw"><table class="sp-tbl sv-agt"><thead><tr><th>Group</th>${d.h.map(h => `<th>${E(h)}</th>`).join('')}</tr></thead><tbody>${d.r.map(([g, ...v]) => `<tr><td><b>${E(g)}</b></td>${v.map(x => `<td>${aggDot(x, g)}</td>`).join('')}</tr>`).join('')}</tbody></table><p class="sp-note">● clumped = agglutination (positive) · smooth = no agglutination (negative)</p></div>`
  };
  const aggDot = (pos, seed) => `<svg class="sv-ag" viewBox="0 0 30 30"><circle cx="15" cy="15" r="13" fill="${pos ? '#fbeef0' : '#e7a1ab'}" stroke="#c9b9bd"/>${pos ? dots('ag' + seed + pos, 9, 15, 15, 8, 2.4, '#b0283e') : ''}</svg>`;

  G.VIS = V;
  G.cellSVG = cellSVG;
  G.plateSVG = plate;
})();
