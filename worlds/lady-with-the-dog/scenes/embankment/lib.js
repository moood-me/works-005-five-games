// The sea-front at Yalta: what the paintings and the script share — the place in metres, the hour's sky, what its
// elements paint, the shots, the film in beats (FILM: modules/beats.js plays it). Everything is painted once in the
// day's colours: the hour is the world's sky (kit.sky) and the scene's light (light.looks); what moves is moved by
// layers, animates, places and the engine (notes.md).
//   The start stands on the sea-front facing the sea (south): the parapet across the view at 8.5 m, the sea beyond it;
// the pier runs out to sea on the left (across −40…−24); the pavilion (across 10…18), the gardens with their tables
// (≈ 20…27) and the avenue under the acacias (along across 34) on the right, between the start and the parapet.
const N = kit.sky;
const { clamp, mix, span, ease } = anim;
const HORIZON = 0.5;
const WATER = -1.0;                                   // the sea's surface (the sea-front's stones are 0)
const PARAPET = { z: 8.5, top: 0.8, back: 8.95 };
const NECK = { x0: -32, x1: -28, z0: 8.95, z1: 18 };  // the pier: its neck out from the parapet …
const HEAD = { x0: -40, x1: -24, z0: 18, z1: 26 };    // … and its head, where the steamer comes alongside
const GANG = { x: -34, z0: 23.6, z1: 27.2, top: 1.1 };// the gangway: from the pier up to the steamer's deck (1.1 m)
const STEAMER = { a: -32, d: 30.2, e: 1.2 };          // alongside: its middle (its near side at 26.7); 1.2 m over the
                                                      // sea's bed — on the water
const PAVILION = { x0: 10, x1: 18, z0: -4, z1: 2.6, floor: 0.12, roof: 3.1 };
const TABLE_G = [21.6, 3.8], TABLE_A = [24.1, 3.8];   // the gardens: Gurov's table, hers (2.5 m apart)
const SEAT_G = [21.75, 4.45, 0.46], SEAT_A = [23.95, 4.45, 0.46];   // they sit behind them, facing the promenade
const TABLE_P = [14.75, 2.0], SEAT_P = [14.55, 1.35, 0.58];         // the pavilion: his table, his seat (the floor 0.12)
const ALLEY_X = 34;

// ── the land: 0 on the sea-front and under the pier; the sea's bed −2.2 beyond the parapet ──
function ground(a, d) {
  const neck = span(a, -32.3, -32) * (1 - span(a, -28, -27.7)) * (1 - span(d, 18, 18.3));
  const head = span(a, -40.3, -40) * (1 - span(a, -24, -23.7)) * span(d, 17.7, 18) * (1 - span(d, 26, 26.3));
  return -2.2 * span(d, 8.95, 9.5) * (1 - Math.max(neck, head));
}

// ── the sky (kit.sky): the sun crosses over the sea from the left (east) to the right (west), above the frame at
// noon; the moon by night stands over the sea a little right of the middle, its path on the water toward us ──
const SKY = {
  horizon: HORIZON,
  sun: (u, height, state, out) => {
    out[0] = mix(0.15, 1.65, clamp(u, -0.1, 1.1));
    out[1] = HORIZON - height * 0.62 + (u < 0 || u > 1 ? 0.06 : 0);
  },
  moon: (u, height, state, out) => {
    out[0] = mix(1.55, 0.35, clamp(u, 0, 1));
    out[1] = HORIZON - 0.04 - height * 0.38;
  },
  clouds: [[0.3, 0.22, 1.1, 0.014], [1.2, 0.3, 0.9, 0.01], [1.7, 0.16, 1.0, 0.016], [0.75, 0.4, 1.3, 0.008]],
};
// the hour's light with the hour, for a beat's `from` and a shot (so a shot made ahead has its own light)
const hourOf = h => ({ hour: h, ...N.keys(h) });

// ── the steamer: `steamer` 0 far out at sea → 0.5 turning in toward the pier → 1 alongside the pier's head ──
function steamerAt(k) {
  const u = clamp(Number(k) || 0, 0, 1);
  if (u < 0.5) {
    const v = ease.inOut(u / 0.5);
    return [mix(-420, -95, v), mix(900, 150, v), mix(250, 212, v)];
  }
  const v = ease.inOut((u - 0.5) / 0.5);
  return [mix(-95, STEAMER.a, v), mix(150, STEAMER.d, v), mix(212, 180, v)];
}

// ── paintings ──
const STONE = '#d8d0bf', STONE_D = '#bdb3a0', STONE_L = '#ece6d8';
function rgba(c, a) { return N.rgba(c, a); }

// the sea-front's flags, seen from above (metres, y toward the viewer): light warm stone in big slabs, the kerb by
// the parapet
function slabs(g, w, d) {
  g.fillStyle = STONE; g.fillRect(-w / 2, -d / 2, w, d);
  g.strokeStyle = 'rgba(120,108,90,0.35)'; g.lineWidth = 0.025;
  for (let y = -d / 2; y <= d / 2; y += 1.2) { g.beginPath(); g.moveTo(-w / 2, y); g.lineTo(w / 2, y); g.stroke(); }
  let row = 0;
  for (let y = -d / 2; y < d / 2; y += 1.2, row++) {
    for (let x = -w / 2 + (row % 2) * 0.8; x < w / 2; x += 1.6) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 1.2); g.stroke(); }
  }
  for (let i = 0; i < 260; i++) {
    g.fillStyle = rgba(i % 3 ? '#ffffff' : '#8a7f6c', 0.07 + 0.06 * anim.hash(i, 3));
    g.fillRect(-w / 2 + anim.hash(i, 1) * w, -d / 2 + anim.hash(i, 2) * d, 0.6 + anim.hash(i, 4) * 1.6, 0.4 + anim.hash(i, 5) * 0.9);
  }
}
// a garden's gravel (the gardens, the avenue)
function gravel(g, w, d, tone) {
  g.fillStyle = tone; g.fillRect(-w / 2, -d / 2, w, d);
  for (let i = 0; i < 1400; i++) {
    g.fillStyle = rgba(i % 2 ? '#fff8ea' : '#8c7d63', 0.18 + 0.15 * anim.hash(i, 9));
    const r = 0.02 + 0.03 * anim.hash(i, 8);
    g.fillRect(-w / 2 + anim.hash(i, 6) * w, -d / 2 + anim.hash(i, 7) * d, r, r);
  }
}
// the parapet: a stone balustrade 0.8 m high along the sea, a gap where the pier goes out (card, metres, y up −)
function parapet(g, x0, x1, gap) {
  const H = PARAPET.top;
  const run = (a, b) => {
    g.fillStyle = STONE_D; g.fillRect(a, -0.2, b - a, 0.2);                 // the plinth
    g.fillStyle = STONE; g.fillRect(a, -H, b - a, 0.12);                     // the rail
    g.fillStyle = STONE_L; g.fillRect(a, -H, b - a, 0.03);
    for (let x = a + 0.15; x < b - 0.1; x += 0.3) {                          // the balusters
      g.fillStyle = STONE;
      g.beginPath(); g.moveTo(x - 0.05, -0.2); g.quadraticCurveTo(x - 0.1, -0.42, x - 0.04, -0.5); g.quadraticCurveTo(x - 0.06, -0.62, x - 0.05, -H + 0.12);
      g.lineTo(x + 0.05, -H + 0.12); g.quadraticCurveTo(x + 0.06, -0.62, x + 0.04, -0.5); g.quadraticCurveTo(x + 0.1, -0.42, x + 0.05, -0.2); g.closePath(); g.fill();
      g.fillStyle = 'rgba(90,80,65,0.18)'; g.fillRect(x + 0.02, -0.6, 0.03, 0.38);
    }
    for (let x = a; x <= b; x += 2.4) { g.fillStyle = STONE; g.fillRect(x - 0.14, -H - 0.04, 0.28, H + 0.04); g.fillStyle = STONE_L; g.fillRect(x - 0.16, -H - 0.06, 0.32, 0.05); }
  };
  if (gap) { run(x0, gap[0]); run(gap[1], x1); } else run(x0, x1);
}
// a cast-iron lamp-post with its glass lantern (3.6 m); its light the element's glow (the scene's `lamps`)
function lamp(g, e) {
  g.fillStyle = '#3a3b3d';
  g.fillRect(-0.16, -0.35, 0.32, 0.35);
  g.beginPath(); g.moveTo(-0.07, -0.35); g.lineTo(-0.045, -3.0); g.lineTo(0.045, -3.0); g.lineTo(0.07, -0.35); g.closePath(); g.fill();
  g.fillRect(-0.09, -3.06, 0.18, 0.08);
  g.fillStyle = '#4a4b4e'; g.fillRect(-0.1, -0.9, 0.2, 0.06);
  // the lantern
  g.fillStyle = '#2f3032';
  g.beginPath(); g.moveTo(-0.17, -3.05); g.lineTo(0.17, -3.05); g.lineTo(0.12, -3.1); g.lineTo(-0.12, -3.1); g.closePath(); g.fill();
  g.fillStyle = '#f3e7c8';
  g.beginPath(); g.moveTo(-0.15, -3.1); g.lineTo(-0.19, -3.5); g.lineTo(0.19, -3.5); g.lineTo(0.15, -3.1); g.closePath(); g.fill();
  g.strokeStyle = '#2f3032'; g.lineWidth = 0.02; g.beginPath(); g.moveTo(0, -3.1); g.lineTo(0, -3.5); g.stroke();
  g.fillStyle = '#2f3032';
  g.beginPath(); g.moveTo(-0.23, -3.5); g.lineTo(0, -3.66); g.lineTo(0.23, -3.5); g.closePath(); g.fill();
  g.beginPath(); g.arc(0, -3.68, 0.035, 0, Math.PI * 2); g.fill();
  e.light(0, -3.3, 0.32, '#ffd49a', 1);
}
// an acacia: a leaning dark trunk, a broad feathery crown that sways (its layer bends in the wind)
function acacia(g, e) {
  g.fillStyle = '#5a4a3c';
  g.beginPath(); g.moveTo(-0.16, 0); g.quadraticCurveTo(-0.08, -2, -0.25, -3.6); g.lineTo(-0.05, -3.7); g.quadraticCurveTo(0.12, -2.2, 0.16, 0); g.closePath(); g.fill();
  g.strokeStyle = '#5a4a3c'; g.lineWidth = 0.09;
  g.beginPath(); g.moveTo(-0.18, -3.4); g.quadraticCurveTo(-0.9, -4.2, -1.6, -4.6); g.moveTo(-0.12, -3.5); g.quadraticCurveTo(0.6, -4.4, 1.5, -4.9); g.stroke();
  e.layer('crown', { pivot: [0, -3.6], wind: { strength: 0.25, gust: 0.4, scale: 0.6 }, box: [-3.2, -7.4, 3.2, -2.8] }, gc => {
    const blob = (x, y, rx, ry, c) => { gc.fillStyle = c; gc.beginPath(); gc.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); gc.fill(); };
    for (let i = 0; i < 26; i++) {
      const x = (anim.hash(i, 31) - 0.5) * 5, y = -4.6 - anim.hash(i, 32) * 2.2 + Math.abs(x) * 0.25;
      blob(x, y, 0.55 + anim.hash(i, 33) * 0.6, 0.32 + anim.hash(i, 34) * 0.3, i % 3 ? '#5f7a4a' : '#6f8a52');
    }
    for (let i = 0; i < 40; i++) {
      const x = (anim.hash(i, 35) - 0.5) * 4.6, y = -4.8 - anim.hash(i, 36) * 2 + Math.abs(x) * 0.25;
      blob(x, y, 0.18 + anim.hash(i, 37) * 0.25, 0.1 + anim.hash(i, 38) * 0.1, '#8aa264');
    }
  });
}
// a cypress, dark and narrow (along the gardens' back)
function cypress(g) {
  g.fillStyle = '#3d5236';
  g.beginPath(); g.moveTo(0, -7.5); g.bezierCurveTo(0.75, -5.5, 0.85, -2.2, 0.5, -0.3); g.lineTo(-0.5, -0.3); g.bezierCurveTo(-0.85, -2.2, -0.75, -5.5, 0, -7.5); g.fill();
  g.fillStyle = 'rgba(120,150,95,0.35)';
  for (let i = 0; i < 30; i++) { const y = -0.6 - anim.hash(i, 41) * 6.5, w = 0.55 * Math.sin(Math.PI * (-y / 7.6)); g.beginPath(); g.ellipse((anim.hash(i, 42) - 0.6) * w, y, 0.18, 0.1, 0, 0, Math.PI * 2); g.fill(); }
  g.fillStyle = '#5a4a3c'; g.fillRect(-0.08, -0.35, 0.16, 0.35);
}
// a round café table: its white cloth from above (a plane), and its foot and the cloth's fall (a card)
function tableTop(g) {
  g.fillStyle = '#f2efe8'; g.beginPath(); g.arc(0, 0, 0.38, 0, Math.PI * 2); g.fill();
  g.strokeStyle = 'rgba(160,150,135,0.45)'; g.lineWidth = 0.012; g.beginPath(); g.arc(0, 0, 0.33, 0, Math.PI * 2); g.stroke();
}
function tableFoot(g) {
  g.fillStyle = '#e9e5dc';
  g.beginPath(); g.moveTo(-0.39, -0.74); g.lineTo(0.39, -0.74); g.lineTo(0.37, -0.52); g.quadraticCurveTo(0.18, -0.48, 0, -0.5); g.quadraticCurveTo(-0.18, -0.48, -0.37, -0.52); g.closePath(); g.fill();
  g.fillStyle = 'rgba(150,140,125,0.35)'; g.fillRect(-0.39, -0.56, 0.78, 0.03);
  g.fillStyle = '#3a3330'; g.fillRect(-0.03, -0.5, 0.06, 0.48);
  g.beginPath(); g.moveTo(-0.22, 0); g.lineTo(0, -0.08); g.lineTo(0.22, 0); g.lineTo(0.18, 0.01); g.lineTo(0, -0.04); g.lineTo(-0.18, 0.01); g.closePath(); g.fill();
}
// a bentwood café chair seen from the front: the seat's rim, the bent back behind it
function chair(g) {
  g.strokeStyle = '#3f2f25'; g.lineWidth = 0.028; g.lineCap = 'round';
  g.beginPath();
  g.moveTo(-0.19, 0); g.lineTo(-0.17, -0.46); g.moveTo(0.19, 0); g.lineTo(0.17, -0.46);
  g.moveTo(-0.15, -0.46); g.bezierCurveTo(-0.2, -0.75, -0.16, -0.95, 0, -0.97); g.bezierCurveTo(0.16, -0.95, 0.2, -0.75, 0.15, -0.46);
  g.moveTo(-0.11, -0.62); g.bezierCurveTo(-0.08, -0.82, 0.08, -0.82, 0.11, -0.62);
  g.stroke();
  g.fillStyle = '#5a4434'; g.beginPath(); g.ellipse(0, -0.46, 0.21, 0.04, 0, 0, Math.PI * 2); g.fill();
  g.strokeStyle = '#3f2f25'; g.lineWidth = 0.016; g.beginPath(); g.ellipse(0, -0.24, 0.17, 0.025, 0, 0, Math.PI * 2); g.stroke();
}
// a garden bench: slatted seat and back, cast-iron ends (seen from the front)
function bench(g) {
  g.fillStyle = '#2f3132';
  for (const x of [-0.8, 0.8]) { g.fillRect(x - 0.04, -0.85, 0.08, 0.85); g.fillRect(x - 0.12, -0.04, 0.24, 0.04); }
  g.fillStyle = '#8a6a48';
  for (let i = 0; i < 3; i++) g.fillRect(-0.95, -0.47 + i * 0.035, 1.9, 0.028);
  for (let i = 0; i < 3; i++) g.fillRect(-0.95, -0.85 + i * 0.1, 1.9, 0.07);
}
// a clipped hedge of box (the avenue's far end)
function hedge(g, w, h) {
  g.fillStyle = '#4e6a3e'; g.fillRect(-w / 2, -h, w, h);
  for (let i = 0; i < 120; i++) { g.fillStyle = rgba(i % 2 ? '#6f8d55' : '#3c5530', 0.6); g.beginPath(); g.arc(-w / 2 + anim.hash(i, 51) * w, -anim.hash(i, 52) * h, 0.08 + anim.hash(i, 53) * 0.1, 0, Math.PI * 2); g.fill(); }
  g.fillStyle = '#5c7a48'; g.fillRect(-w / 2, -h, w, 0.06);
}
// the pier's planking from above, the boards running out to sea
function planks(g, w, d, along) {
  g.fillStyle = '#9a8468'; g.fillRect(-w / 2, -d / 2, w, d);
  g.strokeStyle = 'rgba(60,45,30,0.4)'; g.lineWidth = 0.015;
  if (along) for (let x = -w / 2; x <= w / 2; x += 0.18) { g.beginPath(); g.moveTo(x, -d / 2); g.lineTo(x, d / 2); g.stroke(); }
  else for (let y = -d / 2; y <= d / 2; y += 0.18) { g.beginPath(); g.moveTo(-w / 2, y); g.lineTo(w / 2, y); g.stroke(); }
  for (let i = 0; i < 300; i++) { g.fillStyle = rgba(i % 2 ? '#c2ab8a' : '#6e5a44', 0.2); g.fillRect(-w / 2 + anim.hash(i, 61) * w, -d / 2 + anim.hash(i, 62) * d, along ? 0.12 : 0.6 + anim.hash(i, 63), along ? 0.6 + anim.hash(i, 63) : 0.12); }
}
// a pier's railing: white posts and two rails, 1.05 m (gaps: [[from, to], …] where it opens)
function railing(g, x0, x1, gaps = []) {
  const open = x => gaps.some(([a, b]) => x > a && x < b);
  g.fillStyle = '#eceae3';
  for (let x = x0; x <= x1 + 1e-6; x += 1.5) if (!open(x)) g.fillRect(x - 0.05, -1.05, 0.1, 1.05);
  const rail = (y, t) => {
    let a = x0;
    for (const [ga, gb] of [...gaps, [x1, x1]]) { if (ga > a) g.fillRect(a, y, ga - a, t); a = gb; }
  };
  rail(-1.05, 0.06); rail(-0.55, 0.04);
}
// the kiosk on the pier: a little white booth with a striped awning (front and side, each a card)
function kiosk(g, side) {
  const w = side ? 1.6 : 2.0;
  g.fillStyle = '#efe9dc'; g.fillRect(-w / 2, -2.4, w, 2.4);
  g.fillStyle = '#c9bfae'; g.fillRect(-w / 2, -0.3, w, 0.3);
  if (!side) { g.fillStyle = '#5d6a74'; g.fillRect(-0.7, -1.9, 1.4, 0.8); g.fillStyle = '#e8dfc8'; g.fillRect(-0.75, -1.12, 1.5, 0.08); }
  for (let i = 0; i < (side ? 6 : 8); i++) { g.fillStyle = i % 2 ? '#f4f2ec' : '#8ea4b5'; g.fillRect(-w / 2 + i * w / (side ? 6 : 8), -2.72, w / (side ? 6 : 8), 0.3); }
  g.fillStyle = '#7d8f9c'; for (let i = 0; i < 8; i++) { g.beginPath(); g.arc(-w / 2 + (i + 0.5) * w / 8, -2.42, w / 16, 0, Math.PI); g.fill(); }
}
// the pavilion: the underside of its awning (a card laid back flat), its scalloped valance, its posts
function awning(g, w, d) {
  for (let i = 0; i < 16; i++) { g.fillStyle = i % 2 ? '#e6e8e6' : '#a9b8c4'; g.fillRect(-w / 2 + i * w / 16, -d, w / 16, d); }
  g.fillStyle = 'rgba(40,50,60,0.18)'; g.fillRect(-w / 2, -d, w, d);
}
function valance(g, w) {
  for (let i = 0; i < 16; i++) {
    g.fillStyle = i % 2 ? '#eef0ee' : '#a9b8c4';
    g.beginPath(); g.moveTo(-w / 2 + i * w / 16, -0.5); g.lineTo(-w / 2 + (i + 1) * w / 16, -0.5); g.lineTo(-w / 2 + (i + 1) * w / 16, -0.15);
    g.quadraticCurveTo(-w / 2 + (i + 0.5) * w / 16, 0.05, -w / 2 + i * w / 16, -0.15); g.closePath(); g.fill();
  }
  g.fillStyle = '#6c7a84'; g.fillRect(-w / 2, -0.52, w, 0.05);
}
function post(g, h) {
  g.fillStyle = '#e8e4da'; g.fillRect(-0.07, -h, 0.14, h);
  g.fillStyle = '#cfc8b8'; g.fillRect(-0.1, -0.25, 0.2, 0.25); g.fillRect(-0.1, -h, 0.2, 0.12);
}
// the pavilion's wooden floor and its low front rail
function boards(g, w, d) {
  g.fillStyle = '#8f7a5f'; g.fillRect(-w / 2, -d / 2, w, d);
  g.strokeStyle = 'rgba(50,38,26,0.35)'; g.lineWidth = 0.012;
  for (let x = -w / 2; x <= w / 2; x += 0.14) { g.beginPath(); g.moveTo(x, -d / 2); g.lineTo(x, d / 2); g.stroke(); }
}
// The far coast: the capes on either side of the bay, low and blue in the haze (a card a few km out)
function capes(g) {
  const hill = (x0, x1, top, steep, c) => {
    g.fillStyle = c; g.beginPath(); g.moveTo(x0, 0);
    for (let i = 0; i <= 40; i++) { const u = i / 40, x = mix(x0, x1, u); g.lineTo(x, -top * Math.pow(Math.sin(Math.PI * Math.pow(u, steep)), 1.3) * (0.85 + 0.15 * Math.sin(u * 17))); }
    g.lineTo(x1, 0); g.closePath(); g.fill();
  };
  hill(-5200, -1900, 260, 0.7, '#8c98a8');        // the long cape to the east (left)
  hill(1600, 5600, 420, 1.6, '#86919f');          // Ai-Todor and the mountains to the west (right)
  hill(2400, 4400, 160, 1, '#97a2b0');
}
// The sea near: its own blue-green under the mirror; the wind's ripple and its crests in two drifting layers
function sea(g, e, w, d) {
  const deep = g.createLinearGradient(0, d / 2, 0, -d / 2);
  deep.addColorStop(0, '#5f8189'); deep.addColorStop(0.02, '#557784'); deep.addColorStop(1, '#6f8da0');
  g.fillStyle = deep; g.fillRect(-w / 2, -d / 2, w, d);
  e.layer('ripple', { box: [-w / 2, -d / 2, w / 2, d / 2], drift: [1.4, 0.4] }, gr => {
    for (let i = 0; i < 1100; i++) {
      const x = -w / 2 + anim.hash(i, 1) * w, y = -d / 2 + anim.hash(i, 2) ** 0.35 * d, len = 2 + 40 * anim.hash(i, 4) * (0.2 + (y + d / 2) / d);
      gr.fillStyle = `rgba(222,232,236,${(0.15 + 0.3 * anim.hash(i, 3)).toFixed(3)})`;
      for (const k of x + len > w / 2 ? [0, -w] : [0]) gr.fillRect(x + k, y, len, 0.12 + 1.2 * anim.hash(i, 5) * ((y + d / 2) / d) ** 2);
    }
  });
}
function seaMotion(e) {
  e.layer('ripple').alpha = 0.35 + 0.65 * clamp(Number(e.state.wind) || 0, 0, 1);
}
// The steamer from Odessa (its anchor `steamer`, broadside on): the hull with its black boot-top and white sides,
// the bulwark open where the gangway goes; the deckhouse, funnel and masts behind, its lights
function hull(g) {
  g.fillStyle = '#26292e';
  g.beginPath(); g.moveTo(-25.5, 0.2); g.lineTo(23, 0.2); g.quadraticCurveTo(26.0, -0.9, 26.6, -1.62); g.lineTo(-26, -1.62); g.quadraticCurveTo(-26.4, -0.8, -25.5, 0.2); g.closePath(); g.fill();
  // the white side up to the deck (2.1 over the water); above it an open rail — those on deck seen whole through it
  g.fillStyle = '#efede6';
  g.beginPath(); g.moveTo(-26, -1.6); g.lineTo(26.6, -1.6); g.lineTo(27.1, -2.25); g.lineTo(-26, -2.25); g.closePath(); g.fill();
  g.fillStyle = '#c7c2b5'; g.fillRect(-26, -2.27, 53.2, 0.06);
  g.fillStyle = '#3b3f45';
  for (let x = -22; x < 23; x += 2.2) { g.beginPath(); g.arc(x, -1.95, 0.15, 0, Math.PI * 2); g.fill(); }   // the portholes
  g.fillStyle = '#e8e6df';
  for (let x = -25.8; x < 27; x += 1.2) if (x < -2.7 || x > -1.3) g.fillRect(x - 0.03, -3.25, 0.06, 1.0);   // the stanchions
  for (const [a, b] of [[-26, -2.7], [-1.3, 27.2]]) { g.fillRect(a, -3.3, b - a, 0.07); g.fillRect(a, -2.8, b - a, 0.035); }   // the rails, open at the gangway
}
function deckhouse(g, e) {
  g.fillStyle = '#ecebe4'; g.fillRect(-14, -6.4, 24, 3.5);                   // the deckhouse
  g.fillStyle = '#d9d6cb'; g.fillRect(-14, -6.6, 24, 0.22);
  g.fillStyle = '#e8e6de'; g.fillRect(-7, -8.6, 10, 2.1);                    // the bridge
  g.fillStyle = '#4c5560';
  for (let x = -13; x < 9.5; x += 1.6) g.fillRect(x, -5.6, 0.8, 0.9);        // its windows
  for (let x = -6.4; x < 2.6; x += 1.3) g.fillRect(x, -8.0, 0.8, 0.6);
  g.fillStyle = '#2b2b2f'; g.fillRect(-2.2, -14.5, 3.4, 6);                  // the funnel
  g.fillStyle = '#d9d6cb'; g.fillRect(-2.2, -12.6, 3.4, 0.7);
  g.strokeStyle = '#4a4a50'; g.lineWidth = 0.22;
  g.beginPath(); g.moveTo(-17, -3); g.lineTo(-17, -19); g.moveTo(14, -3); g.lineTo(14, -17.5);
  g.moveTo(-17, -19); g.lineTo(-26, -3.5); g.moveTo(-17, -19); g.lineTo(14, -17.5); g.lineTo(26.5, -3.5); g.stroke();
  e.at(-0.5, -14.6, 'funnel');
  e.at(-17, -18.6, 'mast');
  // its lights: the masthead's, the deckhouse's windows (warm, by the evening — the animate)
  e.light(-17, -18.6, 0.35, '#ffe2b0', 1.2, 'mast');
  e.light(14, -17.2, 0.3, '#ffe2b0', 1, 'mast2');
  for (let i = 0; i < 6; i++) e.light(-12.6 + i * 4, -5.15, 0.55, '#ffcf8a', 0.7, `w${i}`);
}
// The gangway: a ramp of boards with cleats, its rope rails (a plane: from above, its top the far edge)
function gangwayPlank(g, w, d) {
  g.fillStyle = '#8c765c'; g.fillRect(-w / 2, -d / 2, w, d);
  g.fillStyle = '#5e4c3a'; for (let y = -d / 2 + 0.2; y < d / 2; y += 0.35) g.fillRect(-w / 2 + 0.08, y, w - 0.16, 0.04);
  g.fillStyle = '#e6e2d8'; g.fillRect(-w / 2, -d / 2, 0.06, d); g.fillRect(w / 2 - 0.06, -d / 2, 0.06, d);
}
// The waiting crowd on the pier, painted (people of the scene beyond the twelve the engine moves): a group of three
// standing, summer clothes, white and yellow bouquets; `k` — which group (its own mix). In a layer: `crowd` thins it,
// group by group (crowdLive)
function crowd(g, e, k) { e.layer('g', {}, gl => group(gl, k)); }
function crowdLive(e, k) { e.layer('g').alpha = clamp((Number(e.state.crowd) || 0) * 4 - (k - 1), 0, 1); }
function group(g, k) {
  const fig = (x, h, dress, hat, bouquet, lady, turn) => {
    const top = -h;
    g.fillStyle = dress;
    if (lady) { g.beginPath(); g.moveTo(x - 0.1, top + 0.32); g.lineTo(x + 0.1, top + 0.32); g.lineTo(x + 0.28, -0.02); g.lineTo(x - 0.28, -0.02); g.closePath(); g.fill(); }
    else { g.fillRect(x - 0.18, top + 0.3, 0.36, h * 0.42); g.fillStyle = '#3b3a3c'; g.fillRect(x - 0.15, top + 0.3 + h * 0.42, 0.13, h * 0.58 - 0.32); g.fillRect(x + 0.02, top + 0.3 + h * 0.42, 0.13, h * 0.58 - 0.32); }
    g.fillStyle = '#e1c2a6'; g.beginPath(); g.ellipse(x + turn * 0.02, top + 0.16, 0.095, 0.115, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = hat;
    if (lady) { g.beginPath(); g.ellipse(x, top + 0.07, 0.17, 0.05, 0, 0, Math.PI * 2); g.fill(); g.fillRect(x - 0.08, top + 0.0, 0.16, 0.07); }
    else { g.fillRect(x - 0.13, top + 0.04, 0.26, 0.06); g.fillRect(x - 0.09, top - 0.06, 0.18, 0.11); }
    if (bouquet) {
      g.fillStyle = '#6f8a52'; g.fillRect(x + 0.16, top + 0.62, 0.03, 0.25);
      for (let i = 0; i < 7; i++) { g.fillStyle = i % 3 ? '#f6f3e8' : '#f0d36a'; g.beginPath(); g.arc(x + 0.17 + (anim.hash(i, k) - 0.5) * 0.16, top + 0.56 + (anim.hash(i, k + 9) - 0.5) * 0.12, 0.04, 0, Math.PI * 2); g.fill(); }
    }
  };
  const P = [['#f1eee6', '#ece6d4', true, true], ['#c9c2b2', '#3a3a40', false, false], ['#dde3ea', '#b8a98c', true, true],
    ['#5b5e66', '#e9e3d0', false, false], ['#efe8d6', '#a7b3c0', true, true], ['#e8e4dc', '#2e2e33', true, false]];
  for (let i = 0; i < 3; i++) {
    const [dress, hat, bouquet, lady] = P[(k * 2 + i) % P.length];
    fig(-0.55 + i * 0.55, (lady ? 1.58 : 1.72) + (anim.hash(i, k + 3) - 0.5) * 0.08, dress, hat, bouquet && (i + k) % 2 === 0, lady, i - 1);
  }
}

// ── the shots: where the camera stands (x, z), its eye's height, its yaw (right of straight ahead), its pitch ──
const cam = (x, z, eye, yaw = 0, pitch = 0) => ({ camera_target: null, camera_shot: null, camera_frame: null,
  camera_x: x, camera_z: z, camera_h: eye - 1.7, camera_yaw: yaw, camera_pitch: pitch, camera_roll: 0, camera_look: 0 });
const CAM = {
  NOON: cam(-0.5, 2.0, 1.5, -30),           // on the sea-front, looking along it to the left and out: the parapet and the
                                            // sea, the dog on the parapet at 7 m in the middle, Anna far off on the left
  PAVILION: cam(13.6, -2.4, 1.45, -12),     // in the pavilion's shade behind Gurov at his table (on the right): out on
                                            // the bright front, small, the lady goes off to the left
  GARDEN: cam(22.85, 1.45, 1.1, 0),         // the gardens: the two at their tables side by side, 3 m off, the eye low (at
                                            // the faces' height, under a hat's brim); the dog between them; the sea behind
  TALK: cam(22.85, 1.95, 1.3, 0),           // closer (2.5 m), medium: both in three-quarters, talking across the gap
  QUAY: cam(1.5, 2.8, 1.6, 0),              // side on along the parapet: those walking cross the frame ≈ 4.7 m off
  PIER: cam(-30.4, 12.0, 1.7, -6),          // on the pier's neck looking out: the two near, the crowd on the head, the steamer
  GANGWAY: cam(-31.7, 19.6, 1.55, -25),     // over Anna's shoulder to the gangway's foot (5.4 m): the arrivals a third
  KISS: cam(-37.25, 22.1, 1.6, 0, -3),      // the end of the pier at dusk, side on, 2.6 m: the two in profile, the steamer's lights
  GO: cam(-28.9, 17.2, 1.6, -32),           // from the neck, the pier's head across the frame: they go back to the shore
  ALLEY: cam(ALLEY_X, -3.4, 1.6, 0),        // the avenue along: the seat in the middle third, the walkers coming and going
};
const facingTo = c => 180 + c.camera_yaw;   // a card kept toward a shot (the dog: its `spitz_face`)

// ── the film ──
const PEOPLE = ['gurov', 'anna', 'waiter', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'stranger', 'stranger_lady', 'stroller1', 'stroller2', 'stroller3', 'boy'];
const ARRIVALS = ['p1', 'p2', 'p3', 'p4', 'stranger', 'p5', 'p6'];     // in the order `pass` lets them down
const WITH = { p1: ['bouquet'], p2: ['valise'], p3: ['bouquet'], p4: ['valise'], p5: ['bouquet'], p6: ['valise'] };
const at = (id, p) => ({ [`${id}_a`]: p[0], [`${id}_d`]: p[1] });
const loop = motion => ({ motion, loop: true });
// on the steamer's deck, by the gangway's top, before they come down (x, z)
const ON_DECK = { p1: [-34.4, 27.6], p2: [-33.5, 27.9], p3: [-35.3, 28.0], p4: [-32.6, 27.7], stranger: [-36.2, 27.8],
  stranger_lady: [-36.9, 28.1], p5: [-31.6, 28.0], p6: [-37.8, 27.7] };
// where each stops below, met — in the gangway's shot, by its foot, either side (x, z)
const MET = { p1: [-36.0, 23.3], p2: [-32.5, 24.1], p3: [-35.0, 22.6], p4: [-32.1, 22.9], p5: [-34.9, 24.4], p6: [-31.4, 23.9] };
const FOOT = [GANG.x, GANG.z0 - 0.15];
// the painted crowd's groups on the pier's head (four elements of two copies each — crowd1…crowd4)
const CROWD = [[[-38.4, 23.4], [-25.6, 22.2]], [[-37.6, 25.2], [-27.4, 24.8]], [[-29.0, 19.6], [-38.8, 20.2]], [[-26.0, 19.8], [-35.6, 19.4]]];
// «Lost»: the arrivals going off up the pier past the two (along its right side), from where they were met
const LEAVE_FROM = { p1: [-34.6, 21.4], p2: [-31.6, 22.4], p3: [-36.2, 20.9], p4: [-27.2, 21.6], stranger: [-33.2, 20.2], stranger_lady: [-33.9, 20.5], p5: [-35.0, 23.0], p6: [-30.6, 23.6] };
const LEAVE = [[-28.5, 18.6], [-28.4, 11.0], [-28.4, 6.0]];
const OFF_PIER = [[-29.6, 21.6], [-29.6, 17.5], [-30.0, 9.6], [-30.0, 6.5]];   // up the pier, past the camera's right
// walking at someone's side: a path `ahead` metres before them along their way, `side` metres to their left
function beside(pts, from, ahead, side) {
  const out = [];
  let prev = from;
  for (const p of pts) {
    const dx = p[0] - prev[0], dz = p[1] - prev[1], L = Math.hypot(dx, dz) || 1;
    out.push([p[0] + dx / L * ahead - dz / L * side, p[1] + dz / L * ahead + dx / L * side]);
    prev = p;
  }
  return out;
}
// the dog by her chair (0) … at his knee (1) — the gardens, «Coax»
const DOG_CHAIR = [23.45, 4.2], DOG_KNEE = [22.3, 4.05];
const dogNear = k => [mix(DOG_CHAIR[0], DOG_KNEE[0], clamp(k, 0, 1)), mix(DOG_CHAIR[1], DOG_KNEE[1], clamp(k, 0, 1))];
// his right hand lowered toward the dog (`hand` 0…1: from by his knee to low before its muzzle)
// (a person looking at the dog where it stands in the gardens: a little above its head, so the face is not bowed away)
const dogAt = p => [p[0], p[1], 0.6];
const handAt = k => [mix(22.0, 22.25, k), mix(4.15, 4.0, k), mix(0.62, 0.22, clamp(k, 0, 1))];
// the avenue: where the walkers come out (behind the hedge at its far end) and go (behind the camera)
const ALLEY_FAR = [[32.6, 8.25], [33.3, 6.9]], ALLEY_NEAR = [[33.2, -0.5], [29.0, -1.8]];   // off to the left, out of every frame
const ALLEY_SEEN = { x0: 31.4, x1: 37, z0: -3.2, z1: 7.5 };       // the avenue as the 4:3 window shows it
const BENCH = [35.95, 1.7];

function film(scene) {
  // every key every beat begins from — nobody here, the noon light — and what the beat says over it
  const base = (h, extra) => {
    const v = {
      ...hourOf(h), glare: 0, glass: 0, wind: 0, lamps: 0, steamer: 0, steamer_lit: 0, smoke: 0.35, crowd: 0,
      pass: 0, look_at: '', stranger_turned: 0, surge: 0, spitz_near: 0, hand: 0, watched: 0, seen: 0, kiss_now: 0,
      spitz_here: 1, spitz_a: 0, spitz_d: 7.6, spitz_e: 0, spitz_view: 'side', spitz_do: 'stand', spitz_dir: 0,
      spitz_look: null, spitz_old: 0, leash: 'anna#hand_l', spitz_face: 180,
    };
    for (const id of PEOPLE) Object.assign(v, { [`${id}_here`]: false, [`${id}_turn`]: 180, [`${id}_do`]: 'stand', [`${id}_look`]: null,
      [`${id}_reach`]: null, [`${id}_on`]: null, [`${id}_mood`]: null, [`${id}_gait`]: null, [`${id}_wear`]: null, [`${id}_with`]: WITH[id] ?? null });
    Object.assign(v, extra);
    if (v.camera_yaw != null && extra.spitz_face == null) v.spitz_face = 180 + v.camera_yaw;
    return v;
  };
  const NOON_DOG = [6.5, PARAPET.z + 0.22, PARAPET.top], SIT_ON = [-3.0, PARAPET.z + 0.22, PARAPET.top];
  const ANNA_FAR = [-6.5, 7.5], ANNA_FARTHER = [-9.3, 7.9];
  // the gardens in the evening: he at his table, she at hers, the dog lying by her chair, the leash trailing
  const GARDEN_SAT = extra => base(0.76, {
    ...CAM.GARDEN, lamps: 1, gurov_here: true, gurov_wear: kit.cast.characters.gurov_indoor, ...at('gurov', SEAT_G), gurov_on: SEAT_G, gurov_turn: 165, gurov_do: loop('seated'),
    anna_here: true, ...at('anna', SEAT_A), anna_on: SEAT_A, anna_turn: 195, anna_do: loop('seated'),
    spitz_a: DOG_CHAIR[0], spitz_d: DOG_CHAIR[1], spitz_do: 'lie', spitz_dir: -1, leash: 'none', ...extra,
  });
  // the dog come to his knee, he turned to it (after «Coax»)
  const COAXED = extra => GARDEN_SAT({ spitz_near: 1, ...at('spitz', dogNear(1)), spitz_do: 'stand', spitz_look: 'gurov',
    gurov_turn: 130, gurov_look: dogAt(dogNear(1)), anna_turn: 215, anna_look: dogAt(dogNear(1)), ...extra });
  // the night walk: the two by the parapet, the dog ahead on the leash
  const WALK = { anna: [4.5, 7.35], gurov: [5.1, 7.95] };
  // the pier, the evening of the holiday: the wind, the crowd, the steamer turning in
  const PIER_ON = extra => base(0.8, {
    ...CAM.PIER, wind: 1, lamps: 0.6, steamer_lit: 0.5, smoke: 0.7, crowd: 1, steamer: 0.5,
    anna_here: true, ...at('anna', [-29.6, 16.9]), anna_turn: 345, anna_look: 'steamer_house#mast',
    gurov_here: true, ...at('gurov', [-30.9, 17.3]), gurov_turn: 355, gurov_look: 'anna',
    ...at('spitz', [-29.15, 16.1]), spitz_do: 'sit', spitz_look: 'anna', spitz_dir: 1, ...extra,
  });
  // the arrivals on the deck by the gangway's top
  const ON_BOARD = () => Object.fromEntries(Object.entries(ON_DECK).flatMap(([id, p]) => [[`${id}_here`, true], [`${id}_a`, p[0]], [`${id}_d`, p[1]], [`${id}_turn`, 180 + (anim.hash(p[0] * 10, 5) - 0.5) * 50]]));
  // over her shoulder at the gangway: the lorgnette's look; the arrivals up on the deck
  // (she in the frame's left edge, 1.1 m off — her shoulder, her hand with the lorgnette; he and the dog out of it)
  const GANGWAY_AT = () => base(0.8, {
    ...CAM.GANGWAY, glass: 1, wind: 0.6, lamps: 0.6, steamer_lit: 0.5, smoke: 0.4, crowd: 1, steamer: 1,
    anna_here: true, ...at('anna', [-32.6, 20.25]), anna_turn: 336, anna_with: ['lorgnette'], anna_do: { motion: 'lorgnette_up', from: 1.9 },
    anna_look: FOOT.concat(1.6), gurov_here: true, ...at('gurov', [-31.0, 19.0]), gurov_turn: 330, gurov_look: 'anna',
    ...at('spitz', [-33.2, 20.3]), spitz_do: 'sit', spitz_look: 'anna', spitz_dir: -1,
    ...ON_BOARD(),
  });
  // «Lost»: the arrivals on the head, about to go off
  const LEAVING = () => Object.fromEntries(Object.entries(LEAVE_FROM).flatMap(([id, p]) => [[`${id}_here`, true], [`${id}_a`, p[0]], [`${id}_d`, p[1]], [`${id}_turn`, 160]]));
  const GONE = () => Object.fromEntries(Object.keys(LEAVE_FROM).map(id => [`${id}_here`, false]));
  // noon in the avenue: the two by the seat under the acacias
  const ALLEY_NOON = extra => base(0.5, {
    ...CAM.ALLEY, gurov_here: true, ...at('gurov', [35.55, 0.9]), gurov_turn: 250, gurov_look: 'anna',
    anna_here: true, ...at('anna', [34.85, 0.75]), anna_turn: 110, anna_look: 'gurov', anna_mood: 'smile',
    spitz_here: 0, ...extra,
  });

  return {
    // noon, out of the glare: the empty flags glittering; the dog runs along the parapet from the right, its leash
    // trailing; far off, her back to us, the lady goes; at the 8th second the dog sits on the parapet in the middle
    noon: {
      from: () => base(0.5, {
        ...CAM.NOON, glare: 1, spitz_a: NOON_DOG[0], spitz_d: NOON_DOG[1], spitz_e: NOON_DOG[2], spitz_do: 'run', leash: 'none',
        anna_here: true, ...at('anna', ANNA_FAR), anna_turn: 280,
      }),
      run: async s => {
        s.move('glare', 0, { over: 1.5, ease: 'out' });
        s.person('anna').walk([ANNA_FARTHER]);
        await s.path(['spitz_a', 'spitz_d', 'spitz_e'], [[2.5, NOON_DOG[1], NOON_DOG[2]]], { speed: 3.2 });
        s.set('spitz_do', 'trot');
        await s.path(['spitz_a', 'spitz_d', 'spitz_e'], [SIT_ON], { speed: 1.2 });
        s.set('spitz_do', 'sit');
        s.set('spitz_look', [SIT_ON[0] - 6, 7.5, 0.8]);
        await s.wait(2.4);
      },
    },
    // it turns its head to us, jumps down to the flags; she comes back, stoops, takes up the leash (her left hand),
    // and goes off to the left with it
    noon_turn: {
      after: 'noon',
      from: () => base(0.5, { ...CAM.NOON, spitz_a: SIT_ON[0], spitz_d: SIT_ON[1], spitz_e: SIT_ON[2], spitz_do: 'sit', spitz_dir: -1, leash: 'none',
        anna_here: true, ...at('anna', ANNA_FARTHER), anna_turn: 280 }),
      run: async s => {
        const anna = s.person('anna');
        s.set('spitz_dir', 0);
        s.set('spitz_look', [CAM.NOON.camera_x, CAM.NOON.camera_z, 1.6]);
        anna.look(kit.spitz.at(s.state));
        await s.wait(1.2);
        s.set('spitz_look', null);
        s.set('spitz_do', 'stand');
        await s.path(['spitz_a', 'spitz_d', 'spitz_e'], [[SIT_ON[0] - 0.3, 8.45, 0.95], [SIT_ON[0] - 0.5, 8.0, 0]], { over: 0.55, ease: 'in' });
        s.set('spitz_do', 'stand');
        s.set('spitz_look', 'anna');
        await anna.walk([[-4.0, 7.55]]);
        anna.turn(95);
        await anna.do('bend_take');
        s.set('leash', 'anna#hand_l');
        s.tell('noon_turn:leash');
        anna.look(null);
        s.set('spitz_look', null);
        const to = [[-14, 7.6]];
        s.path(['spitz_a', 'spitz_d'], beside(to, [-4.0, 7.55], 1.6, 0.3), { speed: 1.3 });
        anna.walk(to);
        await s.wait(3);
      },
    },
    // the pavilion's shade: Gurov at his table, his back half to us; out on the bright front the lady goes, small,
    // with her dog; he turns his head after her
    pavilion: {
      from: () => base(0.5, {
        ...CAM.PAVILION, gurov_here: true, ...at('gurov', SEAT_P), gurov_on: SEAT_P, gurov_turn: 20, gurov_do: loop('seated'),
        anna_here: true, ...at('anna', [12.5, 7.5]), anna_turn: 270, ...at('spitz', [10.9, 7.25]), spitz_do: 'trot',
      }),
      run: async s => {
        const anna = s.person('anna'), gurov = s.person('gurov');
        const to = [[4.0, 7.6]];
        s.path(['spitz_a', 'spitz_d'], beside(to, [12.5, 7.5], 1.6, 0.25), { speed: 1.3 });
        const going = anna.walk(to);
        await s.wait(2.2);
        gurov.look('anna');
        await gurov.turn(345);
        s.tell('pavilion:looks');
        await going;
        s.set('spitz_do', 'stand');
        await s.wait(1.5);
      },
    },
    // evening in the gardens, their lamps lit: he dines at his table; she comes in with the dog, sits at the next
    // table and lets the leash go — it trails; the dog lies down by her chair
    garden: {
      from: () => GARDEN_SAT({ anna_on: null, anna_do: 'stand', ...at('anna', [27.6, 5.1]), anna_turn: 270, ...at('spitz', [26.3, 4.9]),
        spitz_do: 'trot', spitz_dir: 0, leash: 'anna#hand_l', gurov_do: loop('eat_slow') }),
      run: async s => {
        const anna = s.person('anna'), gurov = s.person('gurov');
        await s.wait(1);
        s.path(['spitz_a', 'spitz_d'], [[24.4, 5.0], [DOG_CHAIR[0] + 0.1, DOG_CHAIR[1] + 0.25]], { speed: 1.3 });
        await anna.walk([[24.6, 5.05]]);
        gurov.do('seated', { loop: true });
        gurov.look('anna');
        s.set('spitz_do', 'stand');
        await anna.go('sit_down', { to: [SEAT_A[0], SEAT_A[1]], turn: 195 });
        anna.on(SEAT_A);
        anna.do('seated', { loop: true });
        s.set('leash', 'none');
        s.set('spitz_dir', -1);
        s.path(['spitz_a', 'spitz_d'], [DOG_CHAIR], { over: 0.8 });
        s.set('spitz_do', 'lie');
        s.tell('garden:sat');
        gurov.look(null);
        await s.wait(4);
      },
    },
    // the dog gets up and looks at him; he turns on his chair to it — under «Coax»
    coax: {
      after: 'garden',
      from: () => GARDEN_SAT({}),
      run: async s => {
        s.set('spitz_do', 'stand');
        s.set('spitz_look', 'gurov');
        await s.wait(0.6);
        s.person('gurov').look(dogAt(dogNear(s.state.spitz_near)));
        await s.person('gurov').turn(130);
        await s.wait(0.6);
      },
    },
    // trust 1: it noses into his palm, she has turned on her chair and watches, smiling; 0: it sits a step from him,
    // wary, and she has turned — under the choice
    coax_hold: {
      after: 'coax',
      from: () => COAXED({}),
      run: async s => {
        const anna = s.person('anna'), gurov = s.person('gurov');
        anna.look(dogAt(dogNear(s.state.spitz_near)));
        anna.turn(225);
        if (Number(s.state.trust) > 0.5) {
          s.set('hand', 1);
          s.set('spitz_do', 'sniff');
          s.set('spitz_look', 'gurov#hand_r');
          anna.mood('smile');
        } else {
          s.set('hand', 0);
          s.move('spitz_near', 0.55, { over: 0.8 });
          s.set('spitz_do', 'sit');
          s.set('spitz_look', 'gurov');
          anna.mood('surprised');
        }
        await s.wait(2.6);
      },
    },
    // he shakes a finger at it; it growls and backs off to her chair; she reaches down for the leash
    finger: {
      after: 'coax_hold',
      from: () => COAXED({ anna_turn: 225 }),
      run: async s => {
        const anna = s.person('anna'), gurov = s.person('gurov');
        s.set('hand', 0);
        gurov.mood('smile');
        const wag = gurov.do('wag_finger');
        await s.wait(0.5);
        s.set('spitz_do', 'growl');
        s.tell('finger:growl');
        s.set('spitz_dir', -1);                  // backing away, still facing him
        await s.move('spitz_near', 0, { over: 1.6 });
        s.set('spitz_do', 'sit');
        await wag;
        gurov.do('seated', { loop: true });
        anna.look(DOG_CHAIR.concat(0.05));
        anna.reach({ l: [DOG_CHAIR[0] + 0.2, DOG_CHAIR[1] - 0.05, 0.12] });
        await s.wait(1.1);
        s.set('leash', 'anna#hand_l');
        anna.reach(null);
        anna.look('gurov');
        await s.wait(1.6);
      },
    },
    // he stoops and pats it; it sits by his foot
    pat: {
      after: 'coax_hold',
      from: () => COAXED({ anna_turn: 225 }),
      run: async s => {
        const gurov = s.person('gurov');
        s.set('hand', 0);
        s.set('spitz_do', 'stand');
        s.set('spitz_look', 'gurov');
        const pat = gurov.do('pat_low');
        gurov.reach({ r: kit.spitz.at(s.state, 'back', 0.05) });
        await s.wait(1.4);
        s.set('spitz_do', 'sit');
        s.tell('pat:sits');
        await pat;
        gurov.reach(null);
        gurov.do('seated', { loop: true });
        gurov.look('anna');
        await s.wait(2);
      },
    },
    // faces: medium, from the side — the two in three-quarters; she turns on her chair to him, her hands in her lap;
    // they talk across the gap (his little smile); a waiter goes by behind them
    talk: {
      after: ['finger', 'pat'],
      from: () => COAXED({ ...CAM.TALK, anna_turn: 206, gurov_turn: 170, gurov_look: 'anna', anna_look: 'gurov' }),
      run: async s => {
        const anna = s.person('anna'), gurov = s.person('gurov'), waiter = s.person('waiter');
        const close = s.shot({ ...CAM.TALK, spitz_face: facingTo(CAM.TALK) });
        await s.until(() => close.ready);
        close.cut();
        anna.turn(206);
        anna.look('gurov');
        anna.mood(null);
        gurov.turn(170);
        gurov.look('anna');
        gurov.mood('smile');
        s.set('spitz_look', null);
        s.set('spitz_do', 'lie');
        await s.wait(1.2);
        s.tell('talk:turned');
        await s.wait(3);
        s.set(`waiter_a`, 27.4); s.set(`waiter_d`, 7.3);
        waiter.here(true);
        waiter.turn(270);
        await waiter.walk([[18.6, 7.4]]);
        waiter.here(false);
        await s.wait(2.5);
      },
    },
    // night: side on along the parapet the two walk across the frame (he at her pace), the dog ahead on the leash;
    // behind them the moon's golden path on the lilac sea
    walk_out: {
      from: () => base(0.88, {
        ...CAM.QUAY, camera_x: 3.8, lamps: 1,
        anna_here: true, ...at('anna', WALK.anna), anna_turn: 270, gurov_here: true, ...at('gurov', WALK.gurov), gurov_turn: 270,
        gurov_gait: 'stroll', gurov_look: 'anna', ...at('spitz', [WALK.anna[0] - 1.6, WALK.anna[1] - 0.3]),
      }),
      run: async s => {
        const anna = s.person('anna'), gurov = s.person('gurov');
        const to = -9.5, T = (WALK.anna[0] - to) / 1.3;
        s.move('camera_x', to + 1.2, { over: T, ease: 'linear' });
        s.path(['spitz_a', 'spitz_d'], [[to - 1.6, WALK.anna[1] - 0.3]], { speed: 1.3 });
        gurov.walk([[to + 0.6, WALK.gurov[1]]]);
        const going = anna.walk([[to, WALK.anna[1]]]);
        await s.wait(2.5);
        s.tell('walk_out:moon');
        anna.look('gurov');
        await going;
        s.set('spitz_do', 'stand');
        anna.turn(320);
        anna.look([2, 60, 1]);
        gurov.turn(330);
        await s.wait(1.5);
      },
    },
    // the pier, the holiday's evening, a dry wind and the dust; the crowd with bouquets; the steamer turning in to
    // the pier; Anna (the dog at her feet) and Gurov at the neck's edge; at the end she raises her lorgnette
    pier: {
      from: () => PIER_ON({}),
      run: async s => {
        const anna = s.person('anna');
        const coming = s.move('steamer', 1, { over: 11, ease: 'inOut' });
        await s.wait(3);
        anna.look('steamer_house#funnel');
        await s.wait(4);
        s.set('spitz_do', 'stand');
        await coming;
        anna.with(['lorgnette']);
        anna.look(FOOT.concat(1.6));
        await anna.do('lorgnette_up');
        s.tell('pier:lorgnette');
        await s.wait(0.5);
      },
    },
    // a cut: over her shoulder, the lorgnette's look (the light's `glass`: the edges darker); up on the deck by the
    // gangway the arrivals stand — under «Lorgnette» (the game lets them down by `pass`)
    gangway: {
      after: 'pier',
      from: () => GANGWAY_AT(),
      run: async s => {
        await cutTo(s, GANGWAY_AT());
        await s.wait(3);
      },
    },
    // back on the pier: the crowd has surged off and thins; she stands without her lorgnette, he beside her
    lost: {
      from: () => PIER_ON({ steamer: 1, crowd: 0.6, surge: 1, wind: 0.6, pass: 7, stranger_turned: 1,
        anna_look: [-27, 13, 1.5], anna_mood: 'afraid', spitz_do: 'stand', ...LEAVING() }),
      run: async s => {
        const anna = s.person('anna');
        s.move('crowd', 0.1, { over: 7 });
        Object.keys(LEAVE_FROM).forEach((id, i) => s.after(0.4 + i * 0.9, () => {
          s.person(id).walk(LEAVE.map(([x, z]) => [x + (i % 2) * 0.5, z]));
          s.after(9, () => s.person(id).here(false));
        }));
        await s.wait(1.5);
        anna.look([-34, 22, 1.5]);
        await s.wait(2.5);
        s.tell('lost:empty');
        anna.look('gurov');
        s.person('gurov').look('anna');
        await s.wait(6);
      },
    },
    // dusk, the end of the pier, the steamer's lights: side on, medium. fright 1 — she presses to him first, her face
    // frightened; 0 — he turns to her, they embrace. He looks back over his shoulder — his face in profile
    kiss: {
      after: 'lost',
      from: () => base(0.83, { ...CAM.KISS, steamer: 1, lamps: 1, steamer_lit: 1, wind: 0.3, crowd: 0, surge: 1, pass: 7, stranger_turned: 1,
        anna_here: true, ...at('anna', [-37.7, 24.75]), anna_turn: 95, gurov_here: true, ...at('gurov', [-36.75, 24.7]), gurov_turn: 300,
        gurov_look: [-33, 21, 1.4], ...at('spitz', [-38.6, 24.2]), spitz_do: 'sit', spitz_look: 'anna', spitz_dir: 1 }),
      run: async s => {
        const anna = s.person('anna'), gurov = s.person('gurov');
        await cutTo(s, this_kiss());
        s.move('hour', 0.85, { over: 8 });
        await s.wait(0.6);
        if (Number(s.state.fright) > 0.5) {
          anna.mood('afraid');
          anna.look('gurov');
          await anna.do('embrace_her');
          anna.reach({ r: 'gurov#back', l: 'gurov#back' });
          gurov.look('anna');
          await gurov.turn(270);
          gurov.reach({ r: 'anna#back', l: 'anna#back' });
        } else {
          gurov.look('anna');
          await gurov.turn(270);
          anna.look('gurov');
          anna.mood('sad');
          await s.all(gurov.do('embrace_him'), anna.do('embrace_her'));
          gurov.reach({ r: 'anna#back', l: 'anna#back' });
          anna.reach({ r: 'gurov#back', l: 'gurov#back' });
        }
        await s.wait(1.4);
        gurov.look([-30, 14, 1.6]);
        s.tell('kiss:look');
        await s.wait(2.6);
      },
    },
    // they go back along the pier to the shore, across the frame (he at her pace); the dog runs ahead
    go: {
      after: 'kiss',
      from: () => base(0.85, { ...CAM.GO, steamer: 1, lamps: 1, steamer_lit: 1, crowd: 0,
        anna_here: true, ...at('anna', [-37.0, 24.3]), anna_turn: 105, gurov_here: true, ...at('gurov', [-37.3, 23.6]), gurov_turn: 105,
        gurov_gait: 'stroll', ...at('spitz', [-35.6, 24.0]), spitz_do: 'stand' }),
      run: async s => {
        const anna = s.person('anna'), gurov = s.person('gurov');
        await cutTo(s, { ...this_go(), ...at('anna', [-37.0, 24.3]), anna_turn: 105, ...at('gurov', [-37.3, 23.6]),
          gurov_turn: 105, gurov_gait: 'stroll', anna_reach: null, gurov_reach: null, anna_do: 'stand', gurov_do: 'stand',
          ...at('spitz', [-35.6, 24.0]), spitz_do: 'stand', spitz_dir: 0, gurov_look: 'anna', anna_look: null });
        const way = [[-31.4, 22.6], [-30.3, 19.0], [-30.1, 12]];
        s.set('spitz_do', 'run');
        s.path(['spitz_a', 'spitz_d'], beside(way, [-35.6, 24.0], 3.5, 0), { speed: 2.4 });
        gurov.walk(way.map(([x, z]) => [x - 0.55, z + 0.2]));
        await anna.walk(way.slice(0, 2));
        await s.wait(1);
      },
    },
    // noon in the avenue under the acacias: the two stand by the seat; walkers come and go along it (the scene's
    // script) — under «Looking round» and the game's lines
    noon_garden: {
      from: () => ALLEY_NOON({}),
      run: async s => {
        await s.wait(1.5);
        s.person('gurov').look('anna#head');
        await s.wait(1.5);
      },
    },
    // noon, side on along the parapet: they walk slowly across the frame, the dog ahead; gossip 1 — a lady with a
    // parasol walks ahead of them and once looks back; the hotel boy runs up to her with a letter; she stops and reads
    days: {
      from: () => base(0.5, {
        ...CAM.QUAY, camera_x: 6.2, anna_here: true, ...at('anna', [7.0, 7.35]), anna_turn: 270, gurov_here: true,
        ...at('gurov', [7.6, 7.95]), gurov_turn: 270, gurov_gait: 'stroll', gurov_look: 'anna', ...at('spitz', [5.4, 7.05]),
        stroller1_here: Number(scene.get('gossip')) > 0.5, ...at('stroller1', [2.6, 7.6]), stroller1_turn: 270,
        boy_here: false, ...at('boy', [14.5, 6.6]), boy_with: ['note'], boy_gait: 'run',
      }),
      run: async s => {
        const anna = s.person('anna'), gurov = s.person('gurov'), boy = s.person('boy'), lady = s.person('stroller1');
        const gossip = Number(s.state.gossip) > 0.5;
        const stop = 0.6;                                  // where she stops and reads
        s.move('camera_x', stop + 0.4, { over: (7.0 - stop) / 1.3, ease: 'inOut' });
        s.path(['spitz_a', 'spitz_d'], [[stop - 1.6, 7.05]], { speed: 1.3 });
        gurov.walk([[stop + 0.7, 7.95]]);
        const going = anna.walk([[stop, 7.35]]);
        if (gossip) {
          lady.walk([[-6, 7.6]]);
          s.after(1.8, () => { lady.look('anna'); s.after(1.6, () => lady.look(null)); });
        }
        await s.wait(1.5);
        boy.here(true);
        await boy.walk([[stop + 1.3, 7.0]]);
        boy.gait(null);
        await going;
        s.set('spitz_do', 'stand');
        anna.turn(80);
        boy.turn(260);
        anna.look('boy');
        await s.all(boy.do('give_small'), anna.do('take_small'));
        boy.with(null);
        anna.with(['letter_paper']);
        anna.look('anna#letter');
        anna.do('read_letter', { loop: true });
        gurov.turn(300);
        gurov.look('anna');
        s.tell('days:letter');
        boy.gait('run');
        boy.walk([[16, 6.4]]);
        await s.wait(3.5);
        boy.here(false);
      },
    },
  };
  // (the shots cut to inside beats, with the cut's own values). A beat that follows another begins with its own cut,
  // said as it begins and made as soon as it is ready; begun by a cut to its `from` (the same shot) — no second cut
  async function cutTo(s, values) {
    const here = ['camera_x', 'camera_z', 'camera_yaw'].every(k => Math.abs(Number(s.state[k]) - values[k]) < 1e-6);
    if (here) return;
    const next = s.shot(values);
    await s.until(() => next.ready);
    next.cut();
  }
  function this_kiss() {
    return { ...CAM.KISS, ...hourOf(0.83), steamer: 1, lamps: 1, steamer_lit: 1, crowd: 0, wind: 0.3, ...GONE(),
      ...at('anna', [-37.7, 24.75]), anna_turn: 95, anna_with: null, anna_do: 'stand', anna_look: 'gurov', anna_reach: null,
      ...at('gurov', [-36.75, 24.7]), gurov_turn: 300, gurov_do: 'stand', gurov_look: [-33, 21, 1.4], gurov_reach: null,
      ...at('spitz', [-38.6, 24.2]), spitz_do: 'sit', spitz_look: 'anna', spitz_dir: 1, spitz_face: facingTo(CAM.KISS) };
  }
  function this_go() { return { ...CAM.GO, steamer: 1, spitz_face: facingTo(CAM.GO) }; }
}

return {
  HORIZON, WATER, PARAPET, NECK, HEAD, GANG, STEAMER, PAVILION, TABLE_G, TABLE_A, SEAT_G, SEAT_A, TABLE_P, SEAT_P, ALLEY_X,
  ground, SKY, hourOf, steamerAt, slabs, gravel, parapet, lamp, acacia, cypress, tableTop, tableFoot, chair, bench, hedge,
  planks, railing, kiosk, awning, valance, post, boards, capes, sea, seaMotion, hull, deckhouse, gangwayPlank, crowd, crowdLive, CROWD,
  LEAVE_FROM, LEAVE,
  cam, CAM, facingTo, dogAt, PEOPLE, ARRIVALS, WITH, ON_DECK, MET, FOOT, OFF_PIER, beside, DOG_CHAIR, DOG_KNEE, dogNear, handAt,
  ALLEY_FAR, ALLEY_NEAR, ALLEY_SEEN, BENCH, film,
};
