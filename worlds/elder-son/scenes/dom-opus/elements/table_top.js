// The table top from above: the checked oilcloth, the bread bin, two glasses in holders, the snuffbox when it is
// there (`box_at` table). Its points: bread, glass (Бусыгин's), box. Metres; 1.6 × 0.8, y toward the near side.
g.fillStyle = '#cdc8b6';
g.fillRect(-0.8, -0.4, 1.6, 0.8);
g.fillStyle = 'rgba(80,110,140,0.3)';
for (let x = -0.8; x < 0.8; x += 0.12) g.fillRect(x, -0.4, 0.06, 0.8);
for (let y = -0.4; y < 0.4; y += 0.12) g.fillRect(-0.8, y, 1.6, 0.06);
g.fillStyle = '#7a5a3c';
g.fillRect(-0.12, -0.32, 0.3, 0.2);
e.at(0.03, -0.22, 'bread');
for (const [x, name] of [[-0.48, 'glass'], [0.5, 'glass2']]) {
  g.fillStyle = '#8f8a80';
  g.beginPath();
  g.arc(x, 0.05, 0.045, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = 'rgba(160,90,40,0.8)';
  g.beginPath();
  g.arc(x, 0.05, 0.03, 0, Math.PI * 2);
  g.fill();
  e.at(x, 0.05, name);
}
if (e.state.box_at === 'table') {
  g.fillStyle = '#b9bcc0';
  g.fillRect(-0.08, 0.02, 0.16, 0.1);
  g.strokeStyle = '#6f7378';
  g.lineWidth = 0.008;
  g.strokeRect(-0.07, 0.03, 0.14, 0.08);
}
e.at(0, 0.07, 'box');
