// The warehouse's long wall at the mole's root, its face to the east (x runs north from z 1 to 14): old lime plaster
// over limestone, a big arched door (where the spectators run from the rain), a barred window, a faded painted sign,
// the bench below (its own element). Painted in daylight colours; the night is the scene's light.
const an = e.anim, L = 13, H = 5.6;
g.fillStyle = '#cdb994'; g.fillRect(0, -H, L, H);
// the limestone under the plaster: courses of blocks, seen where the plaster has fallen in patches
for (let i = 0; i < 26; i++) {
  const x0 = an.hash(i, 61) * (L - 1.4), y0 = -0.5 - an.hash(i, 62) * (H - 1.4), w = 0.5 + an.hash(i, 63) * 1.0, h = 0.4 + an.hash(i, 64) * 0.5;
  g.save(); g.beginPath(); g.ellipse(x0 + w / 2, y0 - h / 2, w / 2, h / 2, 0, 0, Math.PI * 2); g.clip();
  g.fillStyle = '#b8a27e'; g.fillRect(x0, y0 - h, w, h);
  g.strokeStyle = 'rgba(90,74,56,0.5)'; g.lineWidth = 0.025;
  for (let y = Math.ceil(y0 / 0.3) * 0.3; y > y0 - h; y -= 0.3) { g.beginPath(); g.moveTo(x0, y); g.lineTo(x0 + w, y); g.stroke(); }
  g.restore();
}
// the plaster's own weather: fine streaks down from the cornice, a few damp marks
for (let i = 0; i < 90; i++) {
  const x = an.hash(i, 71) * L, y = -H + 0.45, len = 0.6 + an.hash(i, 72) * 2.6;
  g.fillStyle = 'rgba(120,100,76,' + (0.05 + an.hash(i, 73) * 0.07) + ')';
  g.fillRect(x, y, 0.03 + an.hash(i, 74) * 0.08, len);
}
const base = g.createLinearGradient(0, -1.2, 0, 0);
base.addColorStop(0, 'rgba(110,96,78,0)'); base.addColorStop(1, 'rgba(110,96,78,0.55)');
g.fillStyle = base; g.fillRect(0, -1.2, L, 1.2);
g.fillStyle = '#b7a27e'; g.fillRect(0, -H, L, 0.35); g.fillStyle = '#a8936f'; g.fillRect(0, -H + 0.35, L, 0.08);  // cornice
// the arched door
const dx = 8.4, dw = 2.4, dh = 3.3;
g.fillStyle = '#d8c7a4'; g.beginPath(); g.moveTo(dx - 0.25, 0); g.lineTo(dx - 0.25, -dh + 0.9); g.arc(dx + dw / 2, -dh + 0.9, dw / 2 + 0.25, Math.PI, 0); g.lineTo(dx + dw + 0.25, 0); g.fill();
g.fillStyle = '#2f4848'; g.beginPath(); g.moveTo(dx, 0); g.lineTo(dx, -dh + 0.9); g.arc(dx + dw / 2, -dh + 0.9, dw / 2, Math.PI, 0); g.lineTo(dx + dw, 0); g.fill();
g.strokeStyle = '#243a3a'; g.lineWidth = 0.04;
for (let x = dx + 0.3; x < dx + dw; x += 0.3) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, -dh + 0.6); g.stroke(); }
g.fillStyle = '#1b2626'; g.fillRect(dx + dw / 2 - 0.02, -dh + 0.4, 0.04, dh - 0.4);
// a barred window
g.fillStyle = '#d8c7a4'; g.fillRect(2.35, -3.95, 1.5, 1.4);
g.fillStyle = '#26303a'; g.fillRect(2.5, -3.8, 1.2, 1.1);
g.fillStyle = '#3a3633'; for (let x = 2.65; x < 3.7; x += 0.22) g.fillRect(x, -3.8, 0.035, 1.1);
// the faded sign
g.fillStyle = 'rgba(120,60,40,0.55)'; g.font = 'bold 0.62px serif'; g.textAlign = 'center';
g.fillText('MAGAZZINO DEL PORTO', L / 2, -4.55);
e.at(dx + dw / 2, -1.6, 'door');
