// Зал — what the paintings and the script share: the hall in metres, the films on its screen, the rows and the
// painted audience. Metres: across x (right of the start's line of sight), distance z (north, toward the screen).
// The start stands at the back of the hall, in the middle, looking at the screen.

const G = {
  WALL_X: 6.5, BACK_Z: -1.5, FRONT_Z: 19, CEIL: 7.4,
  ROWS: [12.5, 11.5, 10.5, 9.5, 8.5, 7.5, 6.5, 5.5],     // the seat backs of rows 1…8 (row 1 nearest the screen)
  SEAT_W: 0.55, SEATS: 18, SEAT_X0: -4.675,               // seat i at SEAT_X0 + i·SEAT_W
  HIP: 0.32,                                              // a sitter's hips in front of their seat back
  AISLE_X: -5.7,                                          // the left aisle (the right one at +5.7)
  DOOR: [5.9, 7.9],                                       // the curtained side door in the left wall (z), 2.6 m high
  BACK_DOOR: [-5.2, -1.5],                                // the way out at the back, left
  LION: [2.4, -1.42, 4.6],                                // the lion's mouth on the back wall, right of the middle: the booth's port
  SCREEN: [0, 18.9, 4.2], SCREEN_W: 7, SCREEN_H: 4,
  STAGE_Z: 17.2, STAGE_H: 0.8,
};
G.seat = (row, i) => [G.SEAT_X0 + i * G.SEAT_W, G.ROWS[row - 1] + G.HIP];
G.PRIEST = G.seat(5, 3);                                  // the priest's seat: row 5, left of the middle

const hash = (n, s) => anim.hash(n, s);

// ---- films: one frame each, on a w×h rectangle at (x, y); old black-and-white prints, silhouettes, no faces ----
function filmBg(g, x, y, w, h, a, b) {
  const bg = g.createLinearGradient(x, y, x + w, y + h);
  bg.addColorStop(0, a); bg.addColorStop(0.6, b); bg.addColorStop(1, a);
  g.fillStyle = bg; g.fillRect(x, y, w, h);
}
function vignette(g, x, y, w, h) {
  const v = g.createRadialGradient(x + w / 2, y + h / 2, h * 0.3, x + w / 2, y + h / 2, w * 0.62);
  v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(10,10,10,0.55)');
  g.fillStyle = v; g.fillRect(x, y, w, h);
}
// the man in a hat, in profile facing right; his head's centre at (hx, hy), s — his scale (the frame's height)
function hatMan(g, hx, hy, s, lean) {
  g.save(); g.translate(hx, hy); g.rotate(lean || 0);
  g.fillStyle = '#141312';
  g.beginPath(); g.moveTo(-0.17 * s, 0.75 * s); g.lineTo(-0.13 * s, 0.22 * s); g.quadraticCurveTo(-0.02 * s, 0.1 * s, 0.1 * s, 0.2 * s);
  g.lineTo(0.16 * s, 0.75 * s); g.fill();
  g.beginPath(); g.ellipse(0.01 * s, 0, 0.055 * s, 0.1 * s, 0.1, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.ellipse(0.035 * s, 0.01 * s, 0.03 * s, 0.03 * s, 0, 0, Math.PI * 2); g.fill();   // the nose's line
  g.fillRect(-0.09 * s, -0.11 * s, 0.2 * s, 0.025 * s);
  g.beginPath(); g.ellipse(0.01 * s, -0.12 * s, 0.06 * s, 0.06 * s, 0, Math.PI, 0); g.fill();
  g.restore();
}
// the woman, in profile facing left, hair up; head at (hx, hy)
function lady(g, hx, hy, s, lean) {
  g.save(); g.translate(hx, hy); g.rotate(lean || 0);
  g.fillStyle = '#262422';
  g.beginPath(); g.moveTo(-0.1 * s, 0.75 * s); g.lineTo(-0.07 * s, 0.25 * s); g.quadraticCurveTo(-0.05 * s, 0.12 * s, 0.0, 0.11 * s);
  g.quadraticCurveTo(0.06 * s, 0.12 * s, 0.07 * s, 0.27 * s); g.lineTo(0.11 * s, 0.75 * s); g.fill();
  g.beginPath(); g.ellipse(-0.005 * s, 0, 0.042 * s, 0.09 * s, -0.15, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.ellipse(0.025 * s, -0.04 * s, 0.05 * s, 0.075 * s, 0.4, 0, Math.PI * 2); g.fill();
  g.restore();
}
function film(g, name, x, y, w, h) {
  g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
  if (name === 'white') { g.fillStyle = '#f4f2ec'; g.fillRect(x, y, w, h); g.restore(); return; }
  if (name === 'comedy') {
    // «Пожарные из Виджу»: the fat one and the thin one with a ladder against a house front, the ladder tipping
    filmBg(g, x, y, w, h, '#8e8c86', '#d2cfc6');
    g.fillStyle = '#a9a69e'; g.fillRect(x + w * 0.55, y, w * 0.45, h);                       // a house front
    g.fillStyle = '#5d5b57'; for (const [u, v] of [[0.62, 0.15], [0.82, 0.15], [0.62, 0.48], [0.82, 0.48]]) g.fillRect(x + w * u, y + h * v, w * 0.1, h * 0.2);
    g.strokeStyle = '#2a2826'; g.lineWidth = w * 0.012;                                      // the ladder, leaning
    g.save(); g.translate(x + w * 0.42, y + h); g.rotate(0.42);
    g.beginPath(); g.moveTo(-w * 0.04, 0); g.lineTo(-w * 0.04, -h * 0.95); g.moveTo(w * 0.04, 0); g.lineTo(w * 0.04, -h * 0.95);
    for (let k = 1; k < 9; k++) { g.moveTo(-w * 0.04, -h * 0.1 * k); g.lineTo(w * 0.04, -h * 0.1 * k); } g.stroke(); g.restore();
    g.fillStyle = '#161514';
    // the fat one at the foot, holding it, a helmet
    const fx = x + w * 0.3, fy = y + h;
    g.beginPath(); g.ellipse(fx, fy - h * 0.3, w * 0.09, h * 0.24, 0, 0, Math.PI * 2); g.fill();
    g.fillRect(fx - w * 0.06, fy - h * 0.12, w * 0.12, h * 0.12);
    g.beginPath(); g.ellipse(fx + w * 0.01, fy - h * 0.6, w * 0.04, h * 0.075, 0, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.ellipse(fx + w * 0.01, fy - h * 0.66, w * 0.055, h * 0.035, 0, Math.PI, 0); g.fill();
    // the thin one high on the ladder, arms flung out
    const tx = x + w * 0.63, ty = y + h * 0.28;
    g.fillRect(tx - w * 0.012, ty, w * 0.024, h * 0.3);
    g.beginPath(); g.ellipse(tx, ty - h * 0.05, w * 0.025, h * 0.05, 0, 0, Math.PI * 2); g.fill();
    g.lineWidth = w * 0.012; g.strokeStyle = '#161514';
    g.beginPath(); g.moveTo(tx, ty + h * 0.04); g.lineTo(tx - w * 0.08, ty - h * 0.06); g.moveTo(tx, ty + h * 0.04); g.lineTo(tx + w * 0.07, ty - h * 0.08);
    g.moveTo(tx, ty + h * 0.29); g.lineTo(tx - w * 0.05, ty + h * 0.42); g.moveTo(tx, ty + h * 0.29); g.lineTo(tx + w * 0.04, ty + h * 0.43); g.stroke();
    vignette(g, x, y, w, h); g.restore(); return;
  }
  // romance — a man in a hat and a woman at a window; romance_kiss — the same, their heads come together
  filmBg(g, x, y, w, h, '#9c9a94', '#cfccc4');
  const wx = x + w * 0.56, wy = y + h * 0.1, ww = w * 0.3, wh = h * 0.62;
  g.fillStyle = '#efede6'; g.fillRect(wx, wy, ww, wh);
  g.fillStyle = '#4a4844'; g.fillRect(wx + ww / 2 - w * 0.008, wy, w * 0.016, wh); g.fillRect(wx, wy + wh * 0.45, ww, h * 0.02);
  g.fillStyle = 'rgba(80,78,74,0.55)'; g.fillRect(wx - w * 0.04, wy - h * 0.04, w * 0.06, wh + h * 0.08);
  if (name === 'romance_kiss') {
    hatMan(g, x + w * 0.47, y + h * 0.33, h, 0.18);
    lady(g, x + w * 0.545, y + h * 0.36, h * 0.95, -0.22);
  } else {
    hatMan(g, x + w * 0.27, y + h * 0.3, h, 0);
    lady(g, wx + ww * 0.42, y + h * 0.37, h * 0.95, 0);
  }
  vignette(g, x, y, w, h);
  g.restore();
}

// ---- the rows ----
// a row of seats as seen from behind: velvet backs on iron standards; ruin — the bare frames, a few backs hanging
function seatRow(g, ruin) {
  const n = G.SEATS, w = G.SEAT_W, x0 = G.SEAT_X0;
  for (let i = 0; i <= n; i++) {                                   // the iron standards between the seats
    const x = x0 - w / 2 + i * w;
    g.fillStyle = ruin ? '#3f3a35' : '#2b2622';
    g.fillRect(x - 0.025, -0.66, 0.05, 0.66);
    g.fillStyle = ruin ? '#5a4f42' : '#4a3626';                     // the armrest
    g.fillRect(x - 0.035, -0.68, 0.07, 0.04);
  }
  for (let i = 0; i < n; i++) {
    const x = x0 + i * w, r = hash(i, ruin ? 41 : 40);
    if (!ruin) {
      g.fillStyle = '#5e2326';
      g.beginPath(); g.moveTo(x - 0.24, -0.44); g.lineTo(x - 0.24, -0.88); g.quadraticCurveTo(x, -0.97, x + 0.24, -0.88); g.lineTo(x + 0.24, -0.44); g.closePath(); g.fill();
      g.fillStyle = '#3e2a1c'; g.fillRect(x - 0.245, -0.47, 0.49, 0.04);          // the wooden rail at its foot
      g.fillStyle = 'rgba(255,220,200,0.07)'; g.fillRect(x - 0.2, -0.86, 0.4, 0.05);
    } else if (r < 0.55) {                                                         // the bare frame of the back
      g.strokeStyle = '#4b443c'; g.lineWidth = 0.025;
      g.beginPath(); g.moveTo(x - 0.22, -0.46); g.lineTo(x - 0.22, -0.86); g.lineTo(x + 0.22, -0.86); g.lineTo(x + 0.22, -0.46); g.stroke();
    } else if (r < 0.8) {                                                          // a back hanging askew, the velvet grey
      g.save(); g.translate(x - 0.22, -0.46); g.rotate(0.25 + r * 0.3);
      g.fillStyle = '#5a4c4a'; g.fillRect(0, -0.42, 0.44, 0.42); g.restore();
    }
  }
}
// the painted audience of one row, from behind: heads and shoulders above the seat backs (a few seats empty).
// standing — the same people, their arms up (a layer of their own)
function audience(g, row, seed) {
  const n = G.SEATS, w = G.SEAT_W, x0 = G.SEAT_X0;
  for (let i = 0; i < n; i++) {
    if (row === 5 && i === 3) continue;                           // the priest's own seat
    if (hash(i, seed) < 0.1) continue;
    const x = x0 + i * w + (hash(i, seed + 1) - 0.5) * 0.08, kind = Math.floor(hash(i, seed + 2) * 5);
    const s = kind === 4 ? 0.78 : 0.94 + hash(i, seed + 3) * 0.1, coat = ['#2c2a2e', '#3b3230', '#2e3338', '#45392f', '#33302c'][Math.floor(hash(i, seed + 4) * 5)];
    g.save(); g.translate(x, 0); g.scale(s, s);
    g.fillStyle = coat;
    g.beginPath(); g.moveTo(-0.22, -0.55); g.quadraticCurveTo(-0.25, -0.98, -0.16, -1.07); g.quadraticCurveTo(0, -1.14, 0.16, -1.07);
    g.quadraticCurveTo(0.25, -0.98, 0.22, -0.55); g.closePath(); g.fill();
    g.fillStyle = '#211a16'; g.beginPath(); g.ellipse(0, -1.2, 0.09, 0.105, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = ['#3a3532', '#4b3f39', '#2c2b2d', '#5a4a40'][Math.floor(hash(i, seed + 5) * 4)];
    if (kind === 0) { g.beginPath(); g.ellipse(0, -1.27, 0.105, 0.05, 0, Math.PI, 0); g.fill(); g.fillRect(-0.12, -1.28, 0.24, 0.022); }          // a cap
    else if (kind === 1) { g.beginPath(); g.moveTo(-0.115, -1.12); g.quadraticCurveTo(-0.12, -1.34, 0, -1.33); g.quadraticCurveTo(0.12, -1.34, 0.115, -1.12); g.lineTo(0.06, -1.05); g.lineTo(-0.06, -1.05); g.fill(); } // a headscarf
    else if (kind === 2) { g.fillRect(-0.15, -1.29, 0.3, 0.02); g.fillRect(-0.085, -1.38, 0.17, 0.1); }   // a hat
    else if (kind === 3) { g.beginPath(); g.ellipse(0, -1.31, 0.06, 0.05, 0, 0, Math.PI * 2); g.fill(); } // hair in a bun
    g.restore();
  }
}
function arms(g, row, seed) {
  const n = G.SEATS, w = G.SEAT_W, x0 = G.SEAT_X0;
  g.strokeStyle = '#2b2828'; g.lineWidth = 0.07; g.lineCap = 'round';
  for (let i = 0; i < n; i++) {
    if ((row === 5 && i === 3) || hash(i, seed) < 0.1 || hash(i, seed + 6) < 0.45) continue;
    const x = x0 + i * w, both = hash(i, seed + 7) < 0.5, a = (hash(i, seed + 8) - 0.5) * 0.5;
    g.beginPath(); g.moveTo(x + 0.17, -1.02); g.lineTo(x + 0.25 + a * 0.3, -1.58);
    if (both) { g.moveTo(x - 0.17, -1.02); g.lineTo(x - 0.27 + a * 0.3, -1.55); }
    g.stroke();
  }
}

// plaster with its own stains: a w×h rectangle at (x, y)
function plaster(g, x, y, w, h, base, seed, ruin) {
  g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
  g.fillStyle = base; g.fillRect(x, y, w, h);
  for (let i = 0; i < w * h * 0.5; i++) {
    const px = x + hash(i, seed) * w, py = y + hash(i, seed + 1) * h, r = 0.2 + hash(i, seed + 2) * (ruin ? 1.2 : 0.7);
    g.fillStyle = i % 3 ? 'rgba(60,48,40,0.06)' : 'rgba(255,240,220,0.05)';
    g.beginPath(); g.ellipse(px, py, r, r * 0.7, hash(i, seed + 3) * 3, 0, Math.PI * 2); g.fill();
  }
  if (ruin) for (let i = 0; i < w * h * 0.05; i++) {                 // flakes of fallen plaster: the brick shows
    const px = x + hash(i, seed + 9) * w, py = y + hash(i, seed + 10) * h, r = 0.1 + hash(i, seed + 11) * 0.35;
    g.fillStyle = 'rgba(104,88,78,0.7)';
    g.beginPath(); g.moveTo(px - r, py); g.lineTo(px - r * 0.3, py - r * 0.6); g.lineTo(px + r, py - r * 0.2); g.lineTo(px + r * 0.4, py + r * 0.5); g.closePath(); g.fill();
  }
  g.restore();
}

return { G, film, seatRow, audience, arms, plaster };
