// The north wall: old whitewash over a darker dado, the window on the square cut through it (the night beyond is
// window_out), its frame and shutters folded back, a small holy picture by it. Painted once.
const G = e.lib.G, W = G.WINDOW, R = G.ROOM;
const x0 = W.x - W.w / 2, x1 = W.x + W.w / 2;
const wall = new Path2D();
wall.rect(R.x0 - 0.05, -R.h - 0.05, R.x1 - R.x0 + 0.1, R.h + 0.07);
wall.rect(x0, -W.top, W.w, W.top - W.sill);
g.save();
g.clip(wall, 'evenodd');
const lime = g.createLinearGradient(0, -R.h, 0, 0);
lime.addColorStop(0, '#c9bea9'); lime.addColorStop(0.6, '#d4c8b1'); lime.addColorStop(1, '#c2b59c');
g.fillStyle = lime; g.fillRect(R.x0 - 0.05, -R.h - 0.05, R.x1 - R.x0 + 0.1, R.h + 0.07);
// stains and worn patches
for (let i = 0; i < 70; i++) {
  const x = R.x0 + e.rnd() * (R.x1 - R.x0), y = -R.h + e.rnd() * R.h, r = 0.05 + e.rnd() * 0.3;
  g.fillStyle = i % 3 ? 'rgba(90,70,50,0.05)' : 'rgba(255,245,225,0.05)';
  g.beginPath(); g.ellipse(x, y, r, r * 0.7, e.rnd() * 3, 0, Math.PI * 2); g.fill();
}
// the dado and its line
g.fillStyle = '#7b6a56'; g.fillRect(R.x0 - 0.05, -0.95, R.x1 - R.x0 + 0.1, 0.95);
g.fillStyle = '#5e4f3f'; g.fillRect(R.x0 - 0.05, -0.97, R.x1 - R.x0 + 0.1, 0.03);
g.fillStyle = '#4b3e31'; g.fillRect(R.x0 - 0.05, -0.12, R.x1 - R.x0 + 0.1, 0.12);
g.restore();
// the window's frame, its bars, the sill, the shutters folded back against the wall
g.fillStyle = '#5a4634';
g.fillRect(x0 - 0.06, -W.top - 0.06, W.w + 0.12, 0.06);
g.fillRect(x0 - 0.06, -W.top, 0.06, W.top - W.sill);
g.fillRect(x1, -W.top, 0.06, W.top - W.sill);
g.fillRect(x0 + W.w / 2 - 0.02, -W.top, 0.04, W.top - W.sill);
g.fillRect(x0, -W.top + (W.top - W.sill) * 0.45, W.w, 0.035);
g.fillStyle = '#8c7a66'; g.fillRect(x0 - 0.1, -W.sill, W.w + 0.2, 0.05);
for (const [sx, sgn] of [[x0 - 0.06, -1], [x1 + 0.06, 1]]) {
  g.fillStyle = '#6a5641';
  g.fillRect(sgn < 0 ? sx - 0.36 : sx, -W.top - 0.02, 0.36, W.top - W.sill + 0.02);
  g.fillStyle = '#56442f';
  for (let k = 0; k < 9; k++) g.fillRect(sgn < 0 ? sx - 0.33 : sx + 0.03, -W.top + 0.05 + k * 0.12, 0.3, 0.035);
}
// a small holy picture in a gilt frame, a dry palm frond tucked behind it
g.fillStyle = '#8a6a32'; g.fillRect(0.55, -1.98, 0.26, 0.34);
g.fillStyle = '#3d4a6e'; g.fillRect(0.58, -1.95, 0.2, 0.28);
g.fillStyle = '#d9c9a0'; g.beginPath(); g.ellipse(0.68, -1.85, 0.035, 0.045, 0, 0, Math.PI * 2); g.fill();
g.fillStyle = '#c9b48a'; g.beginPath(); g.moveTo(0.64, -1.78); g.lineTo(0.72, -1.78); g.lineTo(0.75, -1.68); g.lineTo(0.61, -1.68); g.fill();
g.strokeStyle = '#8f8a52'; g.lineWidth = 0.012;
g.beginPath(); g.moveTo(0.78, -1.98); g.quadraticCurveTo(0.9, -2.15, 0.98, -2.3); g.stroke();
