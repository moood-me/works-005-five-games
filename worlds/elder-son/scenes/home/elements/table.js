// The table top from above, its end to the window: the checked oilcloth — or, the table laid (`table_set`, IV), a
// white cloth with plates at the six places, a salad bowl, a pie, the bread on a plate. On the oilcloth by the keys:
// the snuffbox (`box_at` table · near), the tea's puddle (`puddle`), the sheet of music (`sheet_on`). Its points (the
// game's and the people's): glass (Busygin's glass), glass_s, bread, kettle, box, sheet. Metres; 0.8 × 1.8 —
// x = the plan's x − 1.8, y = 2.7 − the plan's z (toward the near wall).
const L = e.lib, S = e.state, at = ([x, z]) => [x - 1.8, 2.7 - z];
if (S.table_set) {
  g.fillStyle = '#ece8df';
  g.fillRect(-0.4, -0.9, 0.8, 1.8);
  g.strokeStyle = 'rgba(160,150,130,0.35)';
  g.lineWidth = 0.004;
  for (let y = -0.9; y < 0.9; y += 0.3) {
    g.beginPath();
    g.moveTo(-0.4, y);
    g.lineTo(0.4, y);
    g.stroke();
  }
  // a plate and a fork at each place
  for (const [x, z, turn] of Object.values(L.SEATS)) {
    const [px, py] = at([x + (turn === 90 ? 0.6 : -0.6), z]);
    g.fillStyle = '#f7f4ec';
    g.beginPath();
    g.arc(px, py, 0.1, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = '#3f6c8e';
    g.lineWidth = 0.006;
    g.beginPath();
    g.arc(px, py, 0.085, 0, Math.PI * 2);
    g.stroke();
    g.fillStyle = '#b9b4a8';
    g.fillRect(px - 0.004, py - 0.16, 0.008, 0.12);
  }
  g.fillStyle = '#d9d2c2';
  g.beginPath();
  g.arc(0, 0.05, 0.12, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = '#c86a4a';
  g.beginPath();
  g.arc(0, 0.05, 0.09, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = '#c99a5a';
  g.beginPath();
  g.arc(0, -0.55, 0.13, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = '#8a5a2a';
  g.lineWidth = 0.008;
  for (let a = 0; a < 6; a++) {
    g.beginPath();
    g.moveTo(0, -0.55);
    g.lineTo(0.13 * Math.cos(a), -0.55 + 0.13 * Math.sin(a));
    g.stroke();
  }
  g.fillStyle = '#f2efe6';
  g.beginPath();
  g.ellipse(0.12, 0.62, 0.11, 0.07, 0, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = '#a77a4a';
  for (let i = 0; i < 4; i++) g.fillRect(0.06 + i * 0.03, 0.58, 0.022, 0.08);
} else {
  g.fillStyle = '#e4e0d4';
  g.fillRect(-0.4, -0.9, 0.8, 1.8);
  g.fillStyle = 'rgba(70,104,140,0.32)';
  for (let x = -0.4; x < 0.4; x += 0.1) g.fillRect(x, -0.9, 0.05, 1.8);
  for (let y = -0.9; y < 0.9; y += 0.1) g.fillRect(-0.4, y, 0.8, 0.05);
  g.fillStyle = 'rgba(120,90,60,0.12)';
  g.beginPath();
  g.ellipse(-0.1, 0.35, 0.2, 0.12, 0.4, 0, Math.PI * 2);
  g.fill();
}
if (S.puddle) {
  const [x, y] = at(L.ON.puddle);
  g.fillStyle = 'rgba(150,84,34,0.55)';
  g.beginPath();
  g.moveTo(x - 0.08, y);
  g.bezierCurveTo(x - 0.1, y - 0.07, x + 0.02, y - 0.09, x + 0.07, y - 0.04);
  g.bezierCurveTo(x + 0.13, y, x + 0.08, y + 0.07, x, y + 0.06);
  g.bezierCurveTo(x - 0.05, y + 0.06, x - 0.06, y + 0.03, x - 0.08, y);
  g.fill();
}
if (S.sheet_on) {
  const [x, y] = at(L.ON.sheet);
  g.save();
  g.translate(x, y);
  g.rotate(0.25);
  g.fillStyle = '#f1ece0';
  g.fillRect(-0.105, -0.15, 0.21, 0.3);
  g.strokeStyle = 'rgba(50,40,40,0.6)';
  g.lineWidth = 0.002;
  for (let s = 0; s < 6; s++) for (let l = 0; l < 5; l++) {
    const yy = -0.12 + s * 0.045 + l * 0.006;
    g.beginPath();
    g.moveTo(-0.09, yy);
    g.lineTo(0.09, yy);
    g.stroke();
  }
  g.fillStyle = 'rgba(40,30,30,0.8)';
  for (let i = 0; i < 40; i++) g.fillRect(-0.085 + e.rnd() * 0.17, -0.125 + Math.floor(e.rnd() * 6) * 0.045 + e.rnd() * 0.02, 0.006, 0.005);
  g.restore();
}
const box = S.box_at === 'near' ? at(L.ON.near) : at(L.ON.box);
if (S.box_at === 'table' || S.box_at === 'near') {
  g.fillStyle = '#c3c6ca';
  g.fillRect(box[0] - 0.045, box[1] - 0.03, 0.09, 0.06);
  g.strokeStyle = '#7a7e84';
  g.lineWidth = 0.004;
  g.strokeRect(box[0] - 0.04, box[1] - 0.025, 0.08, 0.05);
  g.beginPath();
  g.ellipse(box[0], box[1], 0.022, 0.014, 0, 0, Math.PI * 2);
  g.stroke();
}
e.at(box[0], box[1], 'box');
e.at(...at(L.ON.glass_b), 'glass');
e.at(...at(L.ON.glass_s), 'glass_s');
e.at(...at(L.ON.bread), 'bread');
e.at(...at(S.kettle_at === 'pushed' ? L.ON.kettle_pushed : L.ON.kettle), 'kettle');
e.at(...at(L.ON.sheet), 'sheet');
