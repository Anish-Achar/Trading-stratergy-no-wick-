// Ghost Ball (project 05): the drag-the-balls demo, and wiring the project into the overlay.
// Self-contained on purpose: it doesn't import anything from main.js.

const $ = (s, r = document) => r.querySelector(s);
const panel = $('.po-panel[data-project="ghostball"]');
const po = $('#po');
const BAR = { num: '05', title: 'Ghost Ball', sub: 'Computer vision · Geometry · JavaScript' };

/* ======================= overlay wiring =======================
   main.js opens a project from #projects/<id>. If it already handles this one, all that happens here is the
   title bar being filled in. If it doesn't, the overlay is opened through a light project (the TikTok one)
   and its panel swapped for this one, so the overlay keeps main.js's own open/close/minimise behaviour. */
const OURS = /^#\/?projects\/ghostball\/?$/;
const isOurs = () => OURS.test(location.hash);
const visible = (el) => !!el && !el.hidden && getComputedStyle(el).display !== 'none' && getComputedStyle(el).visibility !== 'hidden';
let wanted = OURS.test(window.__gbHash || '') ? performance.now() : null; // a deep link, captured before main.js ran
const fresh = () => wanted !== null && performance.now() - wanted < 1500;
let swapping = false;

function fillBar() {
  const set = (id, v) => { const el = document.getElementById(id); if (el && el.textContent !== v) el.textContent = v; };
  set('po-num', BAR.num); set('po-title', BAR.title); set('po-sub', BAR.sub);
}
function ensureOpen(tries = 0) {
  if (!panel || !po) return;
  if (!isOurs() && !fresh()) return;
  if (visible(po) && !panel.hidden) { fillBar(); wanted = null; return; }
  if (tries < 6) { setTimeout(() => ensureOpen(tries + 1), 50); return; } // give main.js ~300 ms first
  wanted = null; swapping = true;
  document.documentElement.classList.add('gb-swap');
  location.replace('#projects/tiktok'); // replace, so Back still returns to the projects page
  const t0 = performance.now();
  (function swap() {
    if (!visible(po) && performance.now() - t0 < 1500) { requestAnimationFrame(swap); return; }
    document.querySelectorAll('.po-panel').forEach((p) => { p.hidden = p !== panel; });
    history.replaceState(history.state, '', '#projects/ghostball');
    fillBar();
    const body = $('#po-body'); if (body) body.scrollTop = 0;
    document.documentElement.classList.remove('gb-swap');
    swapping = false;
  })();
}
// Links into this project: note the intent before main.js sees the click (it may rewrite unknown hashes).
document.addEventListener('click', (e) => {
  const a = e.target.closest && e.target.closest('a[href]');
  if (a && OURS.test(a.getAttribute('href'))) wanted = performance.now();
}, true);
window.addEventListener('hashchange', () => {
  if (swapping) return;
  if (isOurs() || fresh()) { ensureOpen(); return; }
  const video = $('#gb-video'); if (video && !video.paused) video.pause();
  // another project opening: make sure this panel isn't left showing alongside it
  if (/^#\/?projects\/[^/]+/.test(location.hash) && panel) panel.hidden = true;
});
if (wanted || isOurs()) ensureOpen();

// buttons that jump within the panel (plain #anchors would be read as routes by the site's router)
document.addEventListener('click', (e) => {
  const b = e.target.closest && e.target.closest('[data-gb-scroll]');
  if (!b) return;
  e.preventDefault();
  const to = document.getElementById(b.dataset.gbScroll);
  if (to) to.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
});

/* ======================= the demo =======================
   The same maths as the app, for straight pots on a UK 7ft table (canonical units: the playing area is
   1200 x 600, the length of the table = 1830 mm). */
const L = 1200, HALF = 600, DEG = Math.PI / 180, MAX_CUT = 80;
const KMM = L / 1830, R = 50.8 / 2 * KMM, RC = 47.6 / 2 * KMM, S = R + RC, WC = 88 * KMM, WM = 92 * KMM;
const SKILLS = {
  beginner: { label: 'Beginner', sigma: 0.2, cutErr: 2.0 },
  club: { label: 'Club', sigma: 0.1, cutErr: 1.2 },
  strong: { label: 'Strong', sigma: 0.05, cutErr: 0.7 },
};
const wrap = (a) => { a = (a + Math.PI) % (2 * Math.PI); if (a < 0) a += 2 * Math.PI; return a - Math.PI; };
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
function erf(x) {
  const s = Math.sign(x); x = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * x);
  return s * (1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x));
}
const Phi = (z) => 0.5 * (1 + erf(z / Math.SQRT2));
const chance = (phi, lo, hi, sd) => Phi(wrap(hi - phi) / sd) - Phi(wrap(lo - phi) / sd);
const POCKETS = (() => {
  const a = WC / Math.SQRT2, hm = WM / 2;
  return [
    { name: 'Top-left', pt: [0, 0], jaws: [[a, 0], [0, a]] },
    { name: 'Top middle', pt: [L / 2, 0], jaws: [[L / 2 - hm, 0], [L / 2 + hm, 0]] },
    { name: 'Top-right', pt: [L, 0], jaws: [[L - a, 0], [L, a]] },
    { name: 'Bottom-right', pt: [L, HALF], jaws: [[L, HALF - a], [L - a, HALF]] },
    { name: 'Bottom middle', pt: [L / 2, HALF], jaws: [[L / 2 + hm, HALF], [L / 2 - hm, HALF]] },
    { name: 'Bottom-left', pt: [0, HALF], jaws: [[a, HALF], [0, HALF - a]] },
  ];
})();
// Directions a ball at T can leave in and still drop between the jaws, each jaw cleared by a ball radius.
function jawWindow(T, jaws, r) {
  let [J1, J2] = jaws;
  let a1 = Math.atan2(J1[1] - T[1], J1[0] - T[0]);
  const a2 = Math.atan2(J2[1] - T[1], J2[0] - T[0]);
  let span = wrap(a2 - a1);
  if (span < 0) { [J1, J2] = [J2, J1]; a1 = a2; span = -span; }
  const d1 = dist(J1, T), d2 = dist(J2, T);
  if (d1 <= r || d2 <= r) return null;
  const lo = a1 + Math.asin(r / d1), hi = a1 + span - Math.asin(r / d2);
  return hi > lo ? { lo, hi, J1, J2 } : null;
}
// The window of the white's directions (from C) that send the ball at T inside [lo, hi], found by bisection.
function hitWindow(C, T, s, lo, hi) {
  const psi = Math.atan2(T[1] - C[1], T[0] - C[0]), D = dist(T, C);
  if (D < s * 0.98) return null;
  const bmax = Math.asin(Math.min(1, s / D)) - 1e-6, lim = Math.PI / 2 - 0.02;
  let rlo = wrap(lo - psi), rhi = wrap(hi - psi);
  if (rhi < rlo) return null;
  rlo = Math.max(rlo, -lim); rhi = Math.min(rhi, lim);
  if (rhi <= rlo) return null;
  const wx = T[0] - C[0], wy = T[1] - C[1];
  const at = (beta) => {
    const ang = psi + beta, ux = Math.cos(ang), uy = Math.sin(ang), bb = ux * wx + uy * wy;
    const t = bb - Math.sqrt(Math.max(0, bb * bb - (D * D - s * s)));
    const G = [C[0] + t * ux, C[1] + t * uy];
    return { G, u: [ux, uy], phi: wrap(Math.atan2(T[1] - G[1], T[0] - G[0]) - psi) };
  };
  const dec = at(-bmax).phi > at(bmax).phi;
  const solve = (target) => {
    let a = -bmax, b = bmax;
    for (let i = 0; i < 50; i++) { const m = (a + b) / 2; if ((at(m).phi > target) === dec) a = m; else b = m; }
    return (a + b) / 2;
  };
  const b1 = solve(rlo), b2 = solve(rhi);
  const hit = (dir) => {
    const beta = wrap(dir - psi), h = at(beta), eps = 1e-5;
    const slope = Math.abs(at(beta + eps).phi - at(beta - eps).phi) / (2 * eps);
    const phi = psi + h.phi;
    return { G: h.G, u: h.u, phi, dvec: [Math.cos(phi), Math.sin(phi)], cut: Math.abs(wrap(h.phi - beta)) / DEG, slope };
  };
  return { lo: psi + Math.min(b1, b2), hi: psi + Math.max(b1, b2), aim: psi + (b1 + b2) / 2, wlo: psi + rlo, whi: psi + rhi, hit };
}
const onTable = (p, rad) => p[0] >= rad && p[0] <= L - rad && p[1] >= rad && p[1] <= HALF - rad;
function mouth(T, d, w) {
  const ex = w.J2[0] - w.J1[0], ey = w.J2[1] - w.J1[1], den = d[0] * ey - d[1] * ex;
  if (Math.abs(den) < 1e-9) return null;
  const t = ((w.J1[0] - T[0]) * ey - (w.J1[1] - T[1]) * ex) / den;
  return t > 0 ? [T[0] + d[0] * t, T[1] + d[1] * t] : null;
}
function solve(C, T, sk, only) {
  let best = null;
  POCKETS.forEach((pk, i) => {
    if (only != null && i !== only) return;
    const w = jawWindow(T, pk.jaws, R), h = w && hitWindow(C, T, S, w.lo, w.hi);
    if (!h) return;
    const k = h.hit(h.aim);
    if (k.cut > MAX_CUT || !onTable(k.G, RC)) return;
    const sd = Math.max(1e-6, Math.hypot(sk.sigma * DEG * k.slope, sk.cutErr * DEG * Math.sin(k.cut * DEG)));
    const P = chance(k.phi, h.wlo, h.whi, sd);
    if (!best || P > best.P) best = { i, pk, w, h, k, P, sd, E: mouth(T, k.dvec, w) || pk.pt };
  });
  return best;
}

function demo(root) {
  const svg = $('.gb-play-svg', root), NS = 'http://www.w3.org/2000/svg';
  const el = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; };
  const pos = { C: [736, 371], T: [1009, 342] }; // the sample table's best shot (overwritten from data-start)
  try { Object.assign(pos, JSON.parse(root.dataset.start || '{}')); } catch (e) { /* keep defaults */ }
  let skill = 'club', locked = null;

  // static table
  el('rect', { x: -60, y: -60, width: L + 120, height: HALF + 120, rx: 28, class: 'rail-o' }, svg);
  el('rect', { x: 0, y: 0, width: L, height: HALF, class: 'cloth' }, svg);
  el('rect', { x: 0, y: 0, width: L, height: HALF, class: 'nose' }, svg);
  const pk = POCKETS.map((p, i) => {
    const c = el('circle', { cx: p.pt[0], cy: p.pt[1], r: (i % 3 === 1 ? WM : WC) * 0.55, class: 'pkt', tabindex: 0, role: 'button', 'aria-label': `${p.name} pocket: aim for this pocket` }, svg);
    const pick = () => { locked = locked === i ? null : i; update(); };
    c.addEventListener('click', pick);
    c.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
    return c;
  });
  // dynamic layers
  const wedge = el('path', { class: 'wedge' }, svg), we1 = el('line', { class: 'wedge-e' }, svg), we2 = el('line', { class: 'wedge-e' }, svg);
  const stun = el('line', { class: 'stunline' }, svg), aimx = el('line', { class: 'aimext' }, svg), aim = el('line', { class: 'aimline' }, svg);
  const obj = el('line', { class: 'objline' }, svg), head = el('path', { class: 'objhead' }, svg);
  const ghost = el('circle', { r: RC, class: 'ghost' }, svg), contact = el('circle', { r: 7, class: 'contact' }, svg);
  const nope = el('text', { class: 'nope', x: L / 2, y: HALF / 2, 'text-anchor': 'middle' }, svg);
  const ball = (key, cls, r, label) => {
    const g = el('g', { class: 'ball', tabindex: 0, role: 'button', 'aria-label': `${label}. Drag it, or use the arrow keys` }, svg);
    g._hit = el('circle', { r: r + 26, class: 'hit' }, g); el('circle', { r: r + 7, class: 'ring' }, g);
    el('circle', { r, class: cls }, g); el('circle', { r: r * 0.24, cx: -r * 0.36, cy: -r * 0.38, class: 'shine' }, g);
    g._key = key; g._r = r; return g;
  };
  const W = ball('C', 'w', RC, 'White ball'), O = ball('T', 'o', R, 'Red ball');
  const labW = el('text', { class: 'lab', 'text-anchor': 'middle' }, svg), labO = el('text', { class: 'lab', 'text-anchor': 'middle' }, svg);
  labW.textContent = 'WHITE'; labO.textContent = 'RED';
  // on a phone the table is small: keep each ball's touch target at least 48 px across, and the labels legible
  let unit = 1; // table units per CSS pixel
  const fit = () => {
    const w = svg.getBoundingClientRect().width; if (!w) return;
    unit = 1320 / w;
    [W, O].forEach((g) => g._hit.setAttribute('r', Math.max(g._r + 26, 24 * unit)));
    [labW, labO].forEach((t) => t.style.fontSize = `${Math.max(22, 10.5 * unit)}px`);
    update();
  };
  if ('ResizeObserver' in window) new ResizeObserver(fit).observe(svg);

  const out = {
    pct: $('[data-gb="pct"]', root), lvl: $('[data-gb="lvl"]', root), pocket: $('[data-gb="pocket"]', root),
    cut: $('[data-gb="cut"]', root), tol: $('[data-gb="tol"]', root), win: $('[data-gb="win"]', root),
    mag: $('[data-gb="mag"]', root), sd: $('[data-gb="sd"]', root), bell: $('.gb-bell', root),
  };
  const set = (e, v) => { if (e && e.textContent !== v) e.textContent = v; };
  const line = (e, a, b) => { e.setAttribute('x1', a[0]); e.setAttribute('y1', a[1]); e.setAttribute('x2', b[0]); e.setAttribute('y2', b[1]); };

  function bell(res) {
    const B = out.bell; if (!B) return;
    B.textContent = '';
    const w = 320, h = 110, base = 92, sd = res ? res.sd : 1;
    const g = (tag, a) => el(tag, a, B);
    g('line', { x1: 0, y1: base, x2: w, y2: base, class: 'axis' });
    if (!res) return;
    const lo = wrap(res.h.wlo - res.k.phi), hi = wrap(res.h.whi - res.k.phi);
    const span = Math.max(4 * sd, 1.25 * Math.max(Math.abs(lo), Math.abs(hi)));
    const X = (a) => w / 2 + a / span * (w / 2), pdf = (a) => Math.exp(-0.5 * (a / sd) ** 2);
    let d = '', fillD = `M${X(Math.max(lo, -span))},${base}`;
    for (let i = 0; i <= 120; i++) {
      const a = -span + 2 * span * i / 120, y = base - 74 * pdf(a);
      d += (i ? 'L' : 'M') + X(a).toFixed(1) + ',' + y.toFixed(1);
      if (a >= lo && a <= hi) fillD += `L${X(a).toFixed(1)},${y.toFixed(1)}`;
    }
    fillD += `L${X(Math.min(hi, span))},${base}Z`;
    g('path', { d: fillD, class: 'in' }); g('path', { d, class: 'pdf' });
    [lo, hi].forEach((a) => { if (Math.abs(a) <= span) g('line', { x1: X(a), y1: 14, x2: X(a), y2: base, class: 'edge' }); });
    const t = (x, y, s, anchor) => { const e = g('text', { x, y, 'text-anchor': anchor }); e.textContent = s; };
    t(4, h - 3, `−${(span / DEG).toFixed(1)}°`, 'start'); t(w - 4, h - 3, `+${(span / DEG).toFixed(1)}°`, 'end');
    t(w / 2, h - 3, 'OBJECT BALL DIRECTION', 'middle'); t(w / 2, 10, 'INSIDE THE JAWS', 'middle');
  }

  function update() {
    const sk = SKILLS[skill], C = pos.C, T = pos.T;
    W.setAttribute('transform', `translate(${C[0]} ${C[1]})`); O.setAttribute('transform', `translate(${T[0]} ${T[1]})`);
    const gap = Math.max(34, 22 * unit);
    labW.setAttribute('x', C[0]); labW.setAttribute('y', C[1] + RC + gap);
    labO.setAttribute('x', T[0]); labO.setAttribute('y', T[1] + R + gap);
    const res = solve(C, T, sk, locked);
    pk.forEach((c, i) => c.classList.toggle('on', res ? res.i === i : locked === i));
    const show = !!res;
    [wedge, we1, we2, stun, aimx, aim, obj, head, ghost, contact].forEach((e) => e.style.display = show ? '' : 'none');
    nope.style.display = show ? 'none' : '';
    if (!res) {
      nope.textContent = locked != null ? `No clean pot into the ${POCKETS[locked].name.toLowerCase()}` : 'No clean straight pot from here';
      set(out.pct, '–'); set(out.pocket, locked != null ? POCKETS[locked].name : '–');
      ['cut', 'tol', 'win', 'mag', 'sd'].forEach((k) => set(out[k], '–'));
      set(out.lvl, `${sk.label} player`); bell(null); return;
    }
    const { k, h, w, E } = res;
    // the window: every direction that drops, drawn as a wedge from the red to the pocket mouth
    const m1 = mouth(T, [Math.cos(h.wlo), Math.sin(h.wlo)], w) || w.J1, m2 = mouth(T, [Math.cos(h.whi), Math.sin(h.whi)], w) || w.J2;
    wedge.setAttribute('d', `M${T[0]},${T[1]}L${m1[0]},${m1[1]}L${m2[0]},${m2[1]}Z`); line(we1, T, m1); line(we2, T, m2);
    line(aim, C, k.G);
    line(aimx, k.G, [k.G[0] + k.u[0] * 260, k.G[1] + k.u[1] * 260]);
    const ud = k.u[0] * k.dvec[0] + k.u[1] * k.dvec[1], vt = [k.u[0] - ud * k.dvec[0], k.u[1] - ud * k.dvec[1]], nt = Math.hypot(vt[0], vt[1]) || 1;
    line(stun, k.G, [k.G[0] + vt[0] / nt * 240 * Math.min(1, nt * 2), k.G[1] + vt[1] / nt * 240 * Math.min(1, nt * 2)]);
    const end = [E[0] - k.dvec[0] * 18, E[1] - k.dvec[1] * 18];
    line(obj, T, [end[0] - k.dvec[0] * 14, end[1] - k.dvec[1] * 14]);
    const n = [-k.dvec[1], k.dvec[0]];
    head.setAttribute('d', `M${end[0]},${end[1]}L${end[0] - k.dvec[0] * 28 + n[0] * 12},${end[1] - k.dvec[1] * 28 + n[1] * 12}L${end[0] - k.dvec[0] * 28 - n[0] * 12},${end[1] - k.dvec[1] * 28 - n[1] * 12}Z`);
    ghost.setAttribute('cx', k.G[0]); ghost.setAttribute('cy', k.G[1]);
    contact.setAttribute('cx', k.G[0] + k.dvec[0] * RC); contact.setAttribute('cy', k.G[1] + k.dvec[1] * RC);
    const pct = Math.max(1, Math.min(99, Math.round(res.P * 100)));
    set(out.pct, `${pct}%`); set(out.lvl, `${sk.label} player`); set(out.pocket, res.pk.name);
    set(out.cut, `${k.cut.toFixed(0)}°`);
    set(out.tol, `±${((h.hi - h.lo) / 2 / DEG).toFixed(2)}°`);
    set(out.win, `${((h.whi - h.wlo) / DEG).toFixed(1)}°`);
    set(out.mag, `×${k.slope.toFixed(2)}`);
    set(out.sd, `${(res.sd / DEG).toFixed(2)}°`);
    bell(res);
  }

  // dragging (pointer) and nudging (keyboard), keeping both balls on the cloth and apart
  const clampBall = (key, p) => {
    const r = key === 'C' ? RC : R, other = pos[key === 'C' ? 'T' : 'C'];
    let x = Math.min(L - r, Math.max(r, p[0])), y = Math.min(HALF - r, Math.max(r, p[1]));
    const d = Math.hypot(x - other[0], y - other[1]);
    if (d < S + 2) { const ux = d ? (x - other[0]) / d : 1, uy = d ? (y - other[1]) / d : 0; x = other[0] + ux * (S + 2); y = other[1] + uy * (S + 2); }
    return [Math.min(L - r, Math.max(r, x)), Math.min(HALF - r, Math.max(r, y))];
  };
  const toTable = (e) => {
    const m = svg.getScreenCTM(); if (!m) return null;
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
    return [p.x, p.y];
  };
  [W, O].forEach((g) => {
    let off = null;
    g.addEventListener('pointerdown', (e) => {
      const p = toTable(e); if (!p) return;
      off = [pos[g._key][0] - p[0], pos[g._key][1] - p[1]];
      g.setPointerCapture(e.pointerId); g.classList.add('drag'); e.preventDefault();
    });
    g.addEventListener('pointermove', (e) => {
      if (!off) return;
      const p = toTable(e); if (!p) return;
      pos[g._key] = clampBall(g._key, [p[0] + off[0], p[1] + off[1]]); update();
    });
    const end = () => { off = null; g.classList.remove('drag'); };
    g.addEventListener('pointerup', end); g.addEventListener('pointercancel', end);
    g.addEventListener('keydown', (e) => {
      const step = e.shiftKey ? 40 : 10, d = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key];
      if (!d) return;
      e.preventDefault();
      const p = pos[g._key]; pos[g._key] = clampBall(g._key, [p[0] + d[0], p[1] + d[1]]); update();
    });
  });
  root.querySelectorAll('[data-gb-skill]').forEach((b) => b.addEventListener('click', () => {
    skill = b.dataset.gbSkill;
    root.querySelectorAll('[data-gb-skill]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    update();
  }));
  const reset = $('[data-gb-reset]', root);
  if (reset) {
    const start = JSON.parse(JSON.stringify(pos));
    reset.addEventListener('click', () => { pos.C = start.C.slice(); pos.T = start.T.slice(); locked = null; update(); });
  }
  update();
}
document.querySelectorAll('.gb-play').forEach(demo);

