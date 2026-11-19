// 멜론님의 마지막 퇴근길: 첫 화면 배경 장면
(() => {
const root = document.getElementById('sky');
if (!root) return;
const hero = document.getElementById('top');
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const NS = 'http://www.w3.org/2000/svg';
const el = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; };
const lerp = (a, b, t) => a + (b - a) * t, clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const mixA = (a, b, t) => { const A = typeof a === 'string' ? hex(a) : a, B = typeof b === 'string' ? hex(b) : b; return A.map((v, i) => Math.round(lerp(v, B[i], t))); };
const rgb = a => 'rgb(' + a.join(',') + ')';
const mix = (a, b, t) => rgb(mixA(a, b, t));
const keyed = (keys, h) => {
  if (h <= keys[0][0]) return keys[0].slice(1);
  for (let i = 1; i < keys.length; i++) if (h <= keys[i][0]) { const t = (h - keys[i - 1][0]) / (keys[i][0] - keys[i - 1][0]); return keys[i].slice(1).map((v, j) => typeof v === 'string' ? mix(keys[i - 1][j + 1], v, t) : lerp(keys[i - 1][j + 1], v, t)); }
  return keys[keys.length - 1].slice(1);
};
const toHex = s => { const m = s.match(/\d+/g); return '#' + m.slice(0, 3).map(v => (+v).toString(16).padStart(2, '0')).join(''); };
let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

const OFF = 19, HOR = 300, ROAD = { p0: [338, 482], c: [720, 468], p1: [862, 302] };
const TX = 180, TBASE = 340, TTOP = 22;

// 시각별 하늘: [시, 하늘 위, 하늘 아래, 땅 밝기, 불빛, 별]
const SKY = [
  [8.5, '#86bdea', '#f4e7d2', .93, .3, 0],
  [10, '#4f9fe6', '#d5eaf9', 1, .05, 0],
  [14, '#4596e0', '#dbecf7', 1, .05, 0],
  [16, '#5b8fcf', '#f5dbb0', .95, .2, 0],
  [17.3, '#6870b0', '#ffb47c', .84, .55, 0],
  [18.2, '#453f83', '#ff8a5c', .7, .85, .05],
  [18.75, '#2b2860', '#ee6e58', .58, 1, .2],
  [19.1, '#131737', '#3b3064', .46, 1, .75],
  [19.5, '#080b1f', '#1b1d42', .42, 1, 1]
];

root.innerHTML = `
<svg class="sky-svg" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
<defs>
  <linearGradient id="skG" gradientUnits="userSpaceOnUse" x1="0" y1="-300" x2="0" y2="330"><stop id="skA" offset="0"/><stop id="skB" offset="1"/></linearGradient>
  <linearGradient id="lkG" x1="0" y1="0" x2="0" y2="1"><stop id="lkA" offset="0"/><stop id="lkB" offset="1"/></linearGradient>
  <linearGradient id="twL" x1="0" y1="0" x2="1" y2="1"><stop id="twLa" offset="0"/><stop id="twLb" offset="1"/></linearGradient>
  <linearGradient id="twR" x1="1" y1="0" x2="0" y2="1"><stop id="twRa" offset="0"/><stop id="twRb" offset="1"/></linearGradient>
  <linearGradient id="twSheen" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
  <radialGradient id="sunGl"><stop offset="0" stop-color="#fff6cf" stop-opacity=".95"/><stop offset=".35" stop-color="#ffe9a8" stop-opacity=".35"/><stop offset="1" stop-color="#ffe9a8" stop-opacity="0"/></radialGradient>
  <radialGradient id="lampGl"><stop offset="0" stop-color="#ffe2a8" stop-opacity=".95"/><stop offset="1" stop-color="#ffcf7a" stop-opacity="0"/></radialGradient>
  <linearGradient id="grG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9cbf7d"/><stop offset="1" stop-color="#6d9a58"/></linearGradient>
  <linearGradient id="rdG" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#d9d2c6"/><stop offset="1" stop-color="#ece5d8"/></linearGradient>
  <linearGradient id="plG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e6e1d8"/><stop offset="1" stop-color="#d3cdc2"/></linearGradient>
  <filter id="skBlur" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="5"/></filter>
  <filter id="skHair"><feFlood flood-color="#2a2420"/><feComposite in2="SourceAlpha" operator="in"/></filter>
  <pattern id="twWin" width="4" height="5" patternUnits="userSpaceOnUse"><rect x=".8" y="1" width="1.6" height="2.2" fill="#ffd9a0"/></pattern>
  <clipPath id="twClip"><path id="twClipP"/></clipPath>
</defs>
<rect x="-1200" y="-1600" width="3400" height="2600" fill="url(#skG)"/>
<g id="skStars" opacity="0"></g>
<circle id="skHalo" r="120" fill="url(#sunGl)"/>
<circle id="skSun" r="22"/>
<g id="skClouds" filter="url(#skBlur)"></g>
<g id="skLine"></g>
<g id="skWorld">
  <rect x="-1200" y="${HOR}" width="3400" height="700" fill="url(#grG)"/>
  <path id="skLake" fill="url(#lkG)"/>
  <ellipse id="skGlit" rx="9" ry="34" opacity="0"/>
  <g id="skShore"></g>
  <g id="skBridge" fill="none" stroke="#f4f4f2" stroke-linecap="round"></g>
  <g id="skTower"></g>
  <rect x="-1200" y="470" width="1560" height="400" fill="url(#plG)"/>
  <path id="skRoad" fill="url(#rdG)"/>
  <g id="skPrints"></g>
  <g id="skTrees"></g>
  <g id="skLamps"></g>
  <g id="skPodium"></g>
  <g id="skMelon"></g>
  <g id="skGlass"></g>
  <g id="skBush"></g>
</g>
<g id="skLights"></g>
<g id="skSils"></g>
</svg>
<div class="sky-cap" id="skCap"></div>
<div class="sky-birds" id="skBirds"></div>`;

const $ = id => document.getElementById(id);
const svg = root.querySelector('svg');

// ---- 별 ----
for (let i = 0; i < 150; i++) el('circle', { cx: -700 + rnd() * 2400, cy: -700 + Math.pow(rnd(), .8) * 990, r: .6 + rnd() * 1.1, fill: '#fff', class: 'sk-tw', style: `animation-delay:${-rnd() * 3}s` }, $('skStars'));

// ---- 구름 ----
const clouds = [[60, 70, 1.15], [430, 120, .8], [720, 52, 1], [1040, 104, .75], [-300, 96, .9]].map(([x, y, s]) => {
  const g = el('g', {}, $('skClouds')); g._x = x; g._y = y; g._s = s;
  [[0, 0, 36], [34, -14, 30], [66, 0, 32], [30, 8, 34], [-26, 6, 24]].forEach(([cx, cy, r]) => el('ellipse', { cx, cy, rx: r * 1.35, ry: r * .62 }, g));
  return g;
});

// ---- 지평선 너머 도시 ----
const lineBlds = [];
for (let x = -1100; x < 2100;) {
  const w = 10 + rnd() * 24, h = 5 + Math.pow(rnd(), 2) * (x > 380 && x < 880 ? 22 : 34);
  lineBlds.push(el('rect', { x, y: HOR - h + 2, width: w, height: h + 2 }, $('skLine')));
  if (rnd() < .5) for (let k = 0; k < h / 7; k++) el('rect', { class: 'sk-lw', x: x + 2 + rnd() * (w - 5), y: HOR - h + 4 + k * 6, width: 1.4, height: 1.6, fill: '#ffdca6', opacity: 0 }, $('skLine'));
  x += w + rnd() * 6;
}

// ---- 길 ----
const bez = s => { const { p0, c, p1 } = ROAD, u = 1 - s; return [u * u * p0[0] + 2 * u * s * c[0] + s * s * p1[0], u * u * p0[1] + 2 * u * s * c[1] + s * s * p1[1]]; };
const depth = y => clamp((y - HOR) / (482 - HOR), .03, 1);
const tangent = s => { const a = bez(Math.max(0, s - .005)), b = bez(Math.min(1, s + .005)), dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy); return [dx / l, dy / l]; };
const roadW = y => 30 * depth(y) + .8;
(() => {
  const L = [], R = [], inner = [];
  for (let i = 0; i <= 60; i++) {
    const s = i / 60, [x, y] = bez(s), [tx, ty] = tangent(s), w = roadW(y);
    L.push([x + ty * w, y - tx * w]); R.push([x - ty * w, y + tx * w]);
    const m = w + 14 * depth(y); inner.push([x + ty * m, y - tx * m]);
  }
  $('skRoad').setAttribute('d', 'M' + L.map(p => p.join(' ')).join(' L') + ' L' + R.reverse().map(p => p.join(' ')).join(' L') + ' Z');
  const shore = inner.filter(p => p[1] > HOR + 2);
  $('skLake').setAttribute('d', `M372 ${HOR + 3} L${shore[shore.length - 1][0]} ${HOR + 3} ` + shore.reverse().map(p => 'L' + p.join(' ')).join(' ') + ` C 360 430, 372 360, 372 ${HOR + 3} Z`);
})();

// 맞은편 호숫가 나무
for (let x = 376; x < 850; x += 5 + rnd() * 5) el('circle', { class: 'sk-leaf', cx: x, cy: HOR + 1 - rnd() * 2, r: 2.4 + rnd() * 2.6, fill: ['#d9862f', '#c45a2c', '#e7b347', '#7f9a55', '#b84432'][Math.floor(rnd() * 5)] }, $('skShore'));

// 다리
(() => {
  const b = $('skBridge');
  el('path', { d: 'M430 338 L770 331', 'stroke-width': 2.4 }, b);
  el('path', { d: 'M520 336 Q 600 296 690 333', 'stroke-width': 2 }, b);
  for (let x = 540; x <= 670; x += 13) { const t = (x - 520) / 170, y = (1 - t) * (1 - t) * 336 + 2 * (1 - t) * t * 296 + t * t * 333; el('path', { d: `M${x} ${y} L${x} ${338 - (x - 430) * 7 / 340}`, 'stroke-width': .7 }, b); }
})();

// ---- 타워 ----
const hw = y => { const t = (TBASE - y) / (TBASE - TTOP); return 3.5 + 44 * Math.pow(1 - t, .6); };
(() => {
  const g = $('skTower'), Lp = [], Rp = [];
  for (let y = TBASE; y >= TTOP; y -= 4) { Lp.push([TX - hw(y), y]); Rp.push([TX + hw(y), y]); }
  const left = `M${TX} ${TBASE} L` + Lp.map(p => p.join(' ')).join(' L') + ` L${TX - 1} ${TTOP - 6} L${TX} ${TTOP + 30} Z`;
  const right = `M${TX} ${TBASE} L` + Rp.map(p => p.join(' ')).join(' L') + ` L${TX + 1} ${TTOP - 6} L${TX} ${TTOP + 30} Z`;
  el('path', { d: left, fill: 'url(#twL)' }, g);
  el('path', { d: right, fill: 'url(#twR)' }, g);
  $('twClipP').setAttribute('d', 'M' + Lp.map(p => p.join(' ')).join(' L') + ` L${TX} ${TTOP - 6} L` + Rp.reverse().map(p => p.join(' ')).join(' L') + ' Z');
  el('rect', { x: TX - 50, y: TTOP - 10, width: 40, height: TBASE, fill: 'url(#twSheen)', 'clip-path': 'url(#twClip)', id: 'skSheen', opacity: .5 }, g);
  el('path', { d: `M${TX} ${TBASE} L${TX} ${TTOP + 30}`, stroke: '#fff', 'stroke-opacity': .35, 'stroke-width': .8 }, g);
  el('path', { d: `M${TX - .3} ${TTOP - 5} L${TX - 1.4} ${TTOP + 30} L${TX + 1.4} ${TTOP + 30} L${TX + .3} ${TTOP - 5} Z`, fill: '#1f2a3a', opacity: .75 }, g);
  [.17, .34, .5, .63, .75, .84].forEach(t => { const y = TBASE - t * (TBASE - TTOP), w = hw(y); el('rect', { x: TX - w, y: y - 1.2, width: w * 2, height: 2.4, fill: '#24324a', opacity: .32 }, g); });
  // 밤 불빛
  const L = $('skLights');
  el('rect', { id: 'skTwWin', x: TX - 60, y: TTOP, width: 120, height: TBASE - TTOP - 8, fill: 'url(#twWin)', 'clip-path': 'url(#twClip)', opacity: 0 }, L);
  el('ellipse', { id: 'skCrown', cx: TX, cy: TTOP + 18, rx: 9, ry: 26, fill: '#fff6e0', opacity: 0, filter: 'url(#skBlur)' }, L);
  el('circle', { id: 'skAvi', cx: TX, cy: TTOP - 7, r: 1.6, fill: '#ff4a4a', opacity: 0 }, L);
})();

// ---- 몰 (회사 1층) ----
const podWins = [];
(() => {
  const g = $('skPodium');
  el('path', { d: 'M-1200 482 L-1200 336 L300 336 Q 344 336 344 380 L344 482 Z', fill: '#e9edf1' }, g);
  el('rect', { x: -1200, y: 336, width: 1500, height: 4, fill: '#cfd6de' }, g);
  for (let x = -560; x < 300; x += 52) { const w = el('rect', { x, y: 348, width: 44, height: 36, rx: 2, fill: '#c3dcef' }, g); podWins.push({ x, y: 348, w }); }
  el('rect', { x: -1200, y: 392, width: 1530, height: 2, fill: '#cfd6de' }, g);
  el('rect', { x: -1200, y: 396, width: 1532, height: 86, fill: '#f6efe3' }, g);
  // 로비 안 책상, 모니터, 화분
  el('rect', { x: 100, y: 452, width: 82, height: 6, rx: 2, fill: '#c8b497' }, g);
  el('rect', { x: 106, y: 458, width: 5, height: 24, fill: '#ad9879' }, g); el('rect', { x: 171, y: 458, width: 5, height: 24, fill: '#ad9879' }, g);
  el('rect', { x: 118, y: 432, width: 30, height: 20, rx: 2, fill: '#3a3f47' }, g); el('rect', { x: 131, y: 452, width: 4, height: 1, fill: '#3a3f47' }, g);
  el('rect', { x: 32, y: 462, width: 14, height: 20, rx: 3, fill: '#d9cbb6' }, g);
  [[39, 448, 9], [33, 455, 7], [45, 456, 7]].forEach(([cx, cy, r]) => el('circle', { cx, cy, r, fill: '#6f9a5b' }, g));
  el('rect', { x: 296, y: 404, width: 40, height: 78, fill: '#dde6ec' }, g);
  el('rect', { x: 315, y: 404, width: 2, height: 78, fill: '#c3ccd3' }, g);
  // 유리
  const gl = $('skGlass');
  el('rect', { x: -1200, y: 396, width: 1496, height: 86, fill: '#bfe0f4', opacity: .26 }, gl);
  for (let x = -560; x < 300; x += 62) el('rect', { x, y: 396, width: 1.4, height: 86, fill: '#fff', opacity: .55 }, gl);
  el('path', { d: 'M70 396 L46 482 M214 396 L190 482', stroke: '#fff', 'stroke-opacity': .32, 'stroke-width': 9 }, gl);
  // 불 켜진 창
  podWins.forEach(p => { p.lit = el('rect', { x: p.x, y: p.y, width: 44, height: 36, rx: 2, fill: '#ffd38a', opacity: 0 }, $('skLights')); });
  el('rect', { id: 'skLobby', x: -1200, y: 396, width: 1496, height: 86, fill: '#ffcf86', opacity: 0, style: 'mix-blend-mode:multiply' }, $('skLights'));
})();

// 창가에서 손 흔드는 동료들
const sils = [-144, 64, 168, 220, -40, 116].map((x, i) => {
  const g = el('g', { class: 'sk-sil', opacity: 0 }, $('skSils')), y = 348, cx = x + 22;
  el('circle', { cx, cy: y + 17, r: 6.5, fill: '#3b3342' }, g);
  el('rect', { x: cx - 11, y: y + 24, width: 22, height: 12, rx: 6, fill: '#3b3342' }, g);
  el('rect', { class: 'sk-hand', x: cx + (i % 2 ? -15 : 10), y: y + 8, width: 4, height: 16, rx: 2, fill: '#3b3342' }, g);
  return g;
});

// ---- 호숫가 나무, 가로등, 덤불 ----
const LEAF = ['#e39a35', '#cf5f2e', '#eec24c', '#b9442f', '#8aa65a', '#de7a32'];
const lamps = [];
(() => {
  const T = $('skTrees'), Lm = $('skLamps'), B = $('skBush');
  for (let s = .09; s < .9; s += .085 + rnd() * .04) {
    const [x, y] = bez(s), [tx, ty] = tangent(s), d = depth(y), m = roadW(y) + 9 * d, bx = x + ty * m, by = y - tx * m, sz = 21 * d * (.8 + rnd() * .45);
    const g = el('g', {}, T);
    el('rect', { x: bx - 1.6 * d, y: by - sz * .9, width: 3.2 * d, height: sz * .9, fill: '#6b5440' }, g);
    const c = LEAF[Math.floor(rnd() * LEAF.length)];
    [[0, -1.05, .5], [-.32, -.8, .38], [.33, -.82, .4], [0, -.7, .42]].forEach(([ox, oy, r]) => el('circle', { class: 'sk-leaf', cx: bx + ox * sz, cy: by + oy * sz, r: r * sz, fill: c }, g));
  }
  [.1, .24, .38, .51, .63, .73, .82].forEach(s => {
    const [x, y] = bez(s), [tx, ty] = tangent(s), d = depth(y), m = roadW(y) + 5 * d, bx = x - ty * m, by = y + tx * m, h = 52 * d;
    el('rect', { x: bx - .9 * d, y: by - h, width: 1.8 * d, height: h, fill: '#4a4f57' }, Lm);
    el('rect', { x: bx - 3 * d, y: by - h - 3 * d, width: 6 * d, height: 3.4 * d, rx: 1.2 * d, fill: '#4a4f57' }, Lm);
    lamps.push(el('circle', { cx: bx, cy: by - h + 1 * d, r: 16 * d, fill: 'url(#lampGl)', opacity: 0 }, $('skLights')));
  });
  for (let s = .03; s < .8; s += .05 + rnd() * .04) {
    const [x, y] = bez(s), [tx, ty] = tangent(s), d = depth(y), m = roadW(y) + 16 * d, bx = x - ty * m, by = y + tx * m, c = LEAF[Math.floor(rnd() * LEAF.length)];
    [[-.6, 0, .55], [0, -.2, .7], [.6, 0, .5]].forEach(([ox, oy, r]) => el('circle', { class: 'sk-leaf', cx: bx + ox * 12 * d, cy: by + oy * 12 * d, r: r * 12 * d, fill: c }, B));
  }
})();

// 길에 남는 포스트잇
const prints = [.13, .3, .46, .6].map((s, i) => {
  const [x, y] = bez(s), d = depth(y), w = 11 * d;
  return { s, r: el('rect', { x: x + (i % 2 ? 8 : -18) * d, y: y - w * .4, width: w, height: w, fill: ['#fff1a8', '#ffd6e0', '#cdf2d6', '#d4e8ff'][i], opacity: 0, transform: `rotate(${i % 2 ? 9 : -12} ${x} ${y})` }, $('skPrints')) };
});

// ---- 멜론님 ----
const M = $('skMelon');
M.innerHTML = `<g class="sk-bob">
  <rect class="sk-leg sk-l" x="-13" y="-40" width="11" height="40" rx="5" fill="#2c3440"/>
  <rect class="sk-leg sk-r" x="2" y="-40" width="11" height="40" rx="5" fill="#2c3440"/>
  <g id="skArmL"><rect x="-30" y="-80" width="10" height="40" rx="5" fill="#2d7a3e"/></g>
  <rect x="-24" y="-86" width="48" height="52" rx="16" fill="#2d7a3e"/>
  <g id="skBag"><rect x="-19" y="-82" width="38" height="40" rx="10" fill="#ff9f45"/><rect x="-12" y="-62" width="24" height="12" rx="4" fill="#e8873a"/></g>
  <g id="skArmR"><rect x="20" y="-80" width="10" height="40" rx="5" fill="#2d7a3e"/><circle cx="25" cy="-40" r="6" fill="#f2c9a5"/></g>
  <g id="skHead">
    <image id="skFace" href="melon-face.png" x="-29" y="-162" width="58" height="81"/>
    <image id="skBack" href="melon-face.png" x="-29" y="-162" width="58" height="81" filter="url(#skHair)" opacity="0"/>
  </g></g>`;
const INSIDE = .5;
function place(h) {
  if (h < 14.4) return { x: 150, y: 482, sc: INSIDE, back: false, inside: true };
  if (h < 15) { const t = ease((h - 14.4) / .6); return { x: lerp(150, 330, t), y: 482, sc: INSIDE, back: t > .5, inside: true }; }
  const s = lerp(.02, .8, ease(clamp((h - 15) / 3.9))), [x, y] = bez(s);
  return { x, y, sc: INSIDE * depth(y), back: true, inside: false, s };
}
let LIGHT = 1, H = 9, seq = false, done = false;
function setMelon(x, y, sc, back) {
  M.setAttribute('transform', `translate(${x} ${y}) scale(${sc})`);
  $('skFace').setAttribute('opacity', back ? 0 : 1); $('skBack').setAttribute('opacity', back ? 1 : 0);
  $('skBag').style.display = back ? '' : 'none';
  M.style.filter = H >= 15 ? `brightness(${Math.min(1.5, .95 / LIGHT)})` : '';
  M._x = x; M._y = y;
}

// ---- 카메라 ----
let VB = [0, 0, 1000, 560], camOverride = null;
function baseView() {
  const r = root.getBoundingClientRect(), a = r.width / Math.max(1, r.height);
  const w = a >= 1000 / 560 ? 560 * a : a >= .9 ? 1000 : 420, h = w / a, y = 560 - h + (a < .9 ? 52 : 0);
  if (w >= 1000) return [500 - w / 2, y, w, h];
  const fx = done ? 300 : (M._x ?? 150) + w * .12;
  return [clamp(fx - w / 2, -260, 1180 - w), y, w, h];
}
function applyView() { VB = camOverride || baseView(); svg.setAttribute('viewBox', VB.map(v => v.toFixed(1)).join(' ')); }
addEventListener('resize', () => applyView());

// ---- 그리기 ----
const cap = $('skCap');
function render(h) {
  H = h;
  const [top, bot, light, lit, st] = keyed(SKY, h); LIGHT = light;
  $('skA').setAttribute('stop-color', top); $('skB').setAttribute('stop-color', bot);
  $('skWorld').style.filter = `brightness(${light.toFixed(3)}) saturate(${lerp(.78, 1, light).toFixed(3)})`;
  $('skStars').setAttribute('opacity', st);
  const dusk = clamp((h - 16) / 2.8);
  // 해
  const u = clamp((h - 8.5) / 10.5), sx = lerp(300, ROAD.p1[0], u), sy = lerp(64, HOR + 14, u * u), sunC = mix('#fff4c2', '#ff6236', clamp((h - 16) / 2.8));
  $('skSun').setAttribute('cx', sx); $('skSun').setAttribute('cy', sy); $('skSun').setAttribute('fill', sunC);
  $('skHalo').setAttribute('cx', sx); $('skHalo').setAttribute('cy', sy);
  const sunVis = 1 - clamp((h - 18.95) / .08);
  $('skSun').setAttribute('opacity', sunVis); $('skHalo').setAttribute('opacity', sunVis * (1 - .3 * dusk));
  // 호수
  $('lkA').setAttribute('stop-color', mix(toHex(bot), '#ffffff', .12)); $('lkB').setAttribute('stop-color', mix(toHex(top), '#2c4a68', .18));
  const gl = $('skGlit'); gl.setAttribute('cx', Math.min(sx, 790)); gl.setAttribute('cy', HOR + 36); gl.setAttribute('fill', sunC); gl.setAttribute('opacity', clamp((h - 16.5) / 1.5) * (1 - clamp((h - 18.6) / .3)) * .8);
  // 구름
  const ct = performance.now() / 1000;
  const cc = mix('#ffffff', '#ffb995', dusk), co = lerp(.92, .25, clamp((h - 17.6) / 1.5));
  clouds.forEach((g, i) => { const x = ((g._x + 300 + ct * (3 + i * .6)) % 1900) - 600; g.setAttribute('transform', `translate(${x.toFixed(1)} ${g._y}) scale(${g._s})`); g.setAttribute('fill', cc); g.setAttribute('opacity', co); });
  // 지평선 도시
  const lc = mix(toHex(bot), '#8792a3', .3 - .12 * dusk), lcN = mix(toHex(lc), '#1a1d33', clamp((h - 18) / 1.2) * .6);
  lineBlds.forEach(b => b.setAttribute('fill', lcN));
  root.querySelectorAll('.sk-lw').forEach(w => w.setAttribute('opacity', lit * .8));
  // 타워 유리: 하늘을 비추고, 해가 있는 쪽 면이 밝다
  const k = clamp((sx - TX) / 360, -1, 1);
  const glassTop = mixA(toHex(top), '#dfeaf5', .35), glassBot = mixA(toHex(top), '#9fb6cc', .4), shade = '#33465f';
  $('twLa').setAttribute('stop-color', rgb(mixA(glassTop, shade, .12 + .25 * Math.max(0, k))));
  $('twLb').setAttribute('stop-color', rgb(mixA(glassBot, shade, .22 + .25 * Math.max(0, k))));
  $('twRa').setAttribute('stop-color', rgb(mixA(mixA(glassTop, shade, .5 - .32 * Math.max(0, k)), hex('#ff8f5a'), dusk * .35)));
  $('twRb').setAttribute('stop-color', rgb(mixA(mixA(glassBot, shade, .52 - .3 * Math.max(0, k)), hex('#ff9d6a'), dusk * .5)));
  $('skSheen').setAttribute('x', TX - 46 + k * 30); $('skSheen').setAttribute('opacity', .55 * (1 - dusk * .7));
  $('skTwWin').setAttribute('opacity', clamp((h - 17.4) / 1.2) * .5);
  $('skCrown').setAttribute('opacity', clamp((h - 18.3) / .6) * .9);
  $('skAvi').setAttribute('opacity', clamp((h - 17.8) / .5));
  podWins.forEach((p, i) => { p.lit.setAttribute('opacity', lit * (h > 19.2 && i % 3 === 0 ? .2 : .85)); p.w.setAttribute('fill', mix('#c3dcef', '#4c5a79', dusk)); });
  $('skLobby').setAttribute('opacity', lit * .45);
  lamps.forEach(l => l.setAttribute('opacity', clamp((h - 17.4) / .5)));
  sils.forEach((g, i) => { g.setAttribute('opacity', h > 15 + i * .22 && h < 19.3 ? 1 : 0); g.classList.toggle('wav', h > 15); });

  if (!seq) {
    if (h >= OFF + .03) M.style.opacity = 0;
    else { const p = place(Math.min(h, OFF)); setMelon(p.x, p.y, p.sc, p.back); M.style.opacity = 1; M.classList.toggle('sk-typing', h >= 9 && h < 14.4); }
    const p = place(h);
    prints.forEach(pr => pr.r.setAttribute('opacity', (p.s ?? -1) > pr.s + .04 || h >= OFF ? 1 : 0));
    if (h >= OFF + .03) { cap.innerHTML = '멜론님, 퇴근 완료.<small>그동안 정말 수고 많으셨어요</small>'; cap.classList.add('on'); }
    else cap.classList.remove('on');
    applyView();
  }
}

// ---- 19시 연출 ----
const tween = (ms, fn) => new Promise(res => { const t0 = performance.now(); const f = now => { const t = clamp((now - t0) / ms); fn(ease(t)); t < 1 ? requestAnimationFrame(f) : res(); }; requestAnimationFrame(f); });
const wait = ms => new Promise(r => setTimeout(r, ms));
const flip = async back => {
  await tween(330, t => $('skHead').setAttribute('transform', `scale(${1 - t} 1)`));
  setMelon(M._x, M._y, place(OFF).sc, back);
  await tween(330, t => $('skHead').setAttribute('transform', `scale(${t} 1)`));
};
let finaleP = null;
function inView() { const r = hero.getBoundingClientRect(); return !document.hidden && r.bottom > innerHeight * .5 && r.top < innerHeight * .5; }
function finale() {
  if (finaleP) return finaleP;
  if (done) return Promise.resolve();
  finaleP = (async () => {
    stopRun();
    if (RM || !inView()) { done = true; render(OFF + .05); return; }
    seq = true; render(OFF); M.classList.remove('sk-walking');
    hero.classList.add('sky-focus'); cap.classList.remove('on');
    const p = place(OFF), from = VB.slice(), r = root.getBoundingClientRect(), hh = 190, w = hh * r.width / r.height;
    const to = [p.x - w * .45, p.y - hh * .78, w, hh];
    await tween(2600, t => { camOverride = from.map((v, i) => lerp(v, to[i], t)); applyView(); });
    await flip(false);
    M.classList.add('sk-waving'); cap.innerHTML = '멜론님, 그동안 고마웠어요'; cap.classList.add('on');
    await wait(4200);
    M.classList.remove('sk-waving'); cap.classList.remove('on');
    await flip(true);
    M.classList.add('sk-walking');
    const z = camOverride.slice();
    await tween(3800, t => {
      const [x, y] = bez(lerp(.8, .97, t)); setMelon(x, y, INSIDE * depth(y), true); M.style.opacity = 1 - clamp((t - .5) / .5);
      seq = true; render(lerp(OFF, OFF + .03, t)); camOverride = z.map((v, i) => lerp(v, baseView()[i], t)); applyView();
    });
    M.classList.remove('sk-walking'); camOverride = null; seq = false; done = true;
    hero.classList.remove('sky-focus'); render(OFF + .05);
    await wait(1800);
  })();
  return finaleP;
}

// ---- 시간 흐름 ----
const nowH = () => { try { return OFF + (Date.now() - endDate().getTime()) / 3600e3; } catch (e) { return 12; } };
let raf = 0, ticker = 0, demo = /[?&]sky=demo/.test(location.search);
function stopRun() { cancelAnimationFrame(raf); M.classList.remove('sk-walking'); }
function runTo(target, ms) {
  return new Promise(res => {
    cancelAnimationFrame(raf); const a = H, t0 = performance.now(); M.classList.add('sk-walking');
    const f = now => {
      const t = clamp((now - t0) / ms), h = lerp(a, target, t);
      if (demo && h >= OFF && H < OFF) { render(OFF); finale().then(() => { finaleP = null; res(); }); return; }
      render(Math.min(h, done ? 99 : OFF)); t < 1 ? raf = requestAnimationFrame(f) : (M.classList.remove('sk-walking'), res());
    };
    raf = requestAnimationFrame(f);
  });
}
function liveH() { const h = nowH(); return clamp(done ? h : Math.min(h, OFF), 8.5, 19.5); }
function tick() { if (!seq && !running) render(liveH()); }
let running = false, started = false;
async function start() {
  if (started) return; started = true;
  if (nowH() >= OFF + .03) done = true;
  if (demo) { running = true; render(9); await wait(600); await runTo(19.4, 26000); running = false; }
  else if (RM) render(liveH());
  else { running = true; render(8.6); await wait(500); await runTo(liveH(), 3600); running = false; }
  if (!demo) ticker = setInterval(tick, 1000);
}
render(clamp(nowH() >= OFF + .03 ? 19.5 : 8.6, 8.5, 19.5));

// ---- 비둘기: 동료들의 포스트잇을 말풍선으로 ----
const birds = $('skBirds');
const PIGEON = `<svg viewBox="-4 0 66 44" width="78" height="52" aria-hidden="true">
  <defs><linearGradient id="pgN" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5fa37d"/><stop offset="1" stop-color="#8a6aa8"/></linearGradient></defs>
  <path d="M6 24 L-2 20 L0 28 L-3 33 L10 29 Z" fill="#6d7680"/>
  <ellipse cx="26" cy="26" rx="20" ry="11" fill="#a3acb6"/>
  <path d="M38 16 Q 46 18 45 30 Q 38 32 34 26 Z" fill="url(#pgN)"/>
  <circle cx="46" cy="14" r="7" fill="#8f98a3"/>
  <circle cx="48.5" cy="12.6" r="1.6" fill="#ff8a3d"/><circle cx="48.8" cy="12.6" r=".7" fill="#1d1d1f"/>
  <path d="M52.5 14 L57.5 15.6 L52.5 17 Z" fill="#d9c8b8"/>
  <path d="M22 34 L20 39 M28 35 L27 40" stroke="#e48b9b" stroke-width="1.8" stroke-linecap="round"/>
  <g class="pg-wing"><path d="M14 22 Q 24 -2 40 20 Q 28 28 14 22 Z" fill="#8a939e"/><path d="M20 18 L33 21 M18 21 L31 24" stroke="#4e5660" stroke-width="1.6" stroke-linecap="round"/></g>
</svg>`;
const FALLBACK = [['구구… 멜론님 오늘 마지막 출근이래요', '비둘기'], ['포스트잇 한 장 남겨 주세요. 제가 전해 드릴게요', '비둘기']];
let lastIdx = -1, flying = 0, birdTimer = 0;
function pickNote() {
  let list = [];
  try { list = [...notes.values()].filter(n => !n.hidden && n.text); } catch (e) {}
  if (!list.length) { const f = FALLBACK[Math.floor(Math.random() * FALLBACK.length)]; return { text: f[0], author: f[1] }; }
  let i = Math.floor(Math.random() * list.length); if (list.length > 1 && i === lastIdx) i = (i + 1) % list.length; lastIdx = i;
  return list[i];
}
function launch() {
  if (flying >= (innerWidth < 700 ? 1 : 2) || document.hidden || seq || !inView()) return;
  const n = pickNote(), r = root.getBoundingClientRect(), ltr = Math.random() < .55;
  const b = document.createElement('div'); b.className = 'pg' + (ltr ? '' : ' rtl');
  const bub = document.createElement('div'); bub.className = 'pg-bub';
  const t = document.createElement('p'); const txt = String(n.text).replace(/\s+/g, ' ').trim(); t.textContent = txt.length > 54 ? txt.slice(0, 53) + '…' : txt;
  const a = document.createElement('span'); a.textContent = n.author || '익명의 동료';
  bub.append(t, a); b.innerHTML = PIGEON; b.prepend(bub); birds.appendChild(b);
  flying++;
  const W = r.width, sc = r.height / VB[3], hz = (HOR - VB[1]) * sc, y0 = hz - 78 + Math.random() * Math.min(60, r.height * .06), dur = (W < 600 ? 11 : 17) * 1000 * (.9 + Math.random() * .2), t0 = performance.now(), ph = Math.random() * 6;
  const step = now => {
    const t = (now - t0) / dur;
    if (t >= 1 || !b.isConnected) { b.remove(); flying--; return; }
    const x = ltr ? lerp(-260, W + 60, t) : lerp(W + 60, -260, t), y = y0 + Math.sin(t * 9 + ph) * 10;
    b.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
function birdsOn() { if (RM || birdTimer) return; setTimeout(launch, 2200); birdTimer = setInterval(launch, 8000); }

window.SKY = { start: () => { start(); birdsOn(); }, finale, inView, render: h => { done = h >= OFF + .03; render(h); }, get h() { return H; } };
})();
