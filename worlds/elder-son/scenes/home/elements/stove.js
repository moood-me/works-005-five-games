// The Russian stove's front: whitewashed brick, the iron plate with a kettle, the fire door (a layer that opens by
// `stove_door`, animate) over the fire behind it (its glow `fire`). Its point `door`. Metres; 1.2 wide, 2.0 high.
g.fillStyle = '#e6dfd0';
g.fillRect(-0.6, -2.0, 1.2, 2.02);
g.strokeStyle = 'rgba(150,140,120,0.35)';
g.lineWidth = 0.01;
for (let y = -1.95; y < 0; y += 0.14) {
  g.beginPath();
  g.moveTo(-0.6, y);
  g.lineTo(0.6, y);
  g.stroke();
}
g.fillStyle = '#cfc6b4';
g.fillRect(-0.6, -1.0, 1.2, 0.06);
g.fillStyle = '#2d2b2a';
g.fillRect(-0.55, -1.06, 1.1, 0.07);
g.fillStyle = '#5e5953';
g.beginPath();
g.ellipse(0.25, -1.18, 0.14, 0.11, 0, 0, Math.PI * 2);
g.fill();
g.fillRect(0.36, -1.24, 0.1, 0.03);
// the fire behind its door
const fire = g.createRadialGradient(0, -0.65, 0.02, 0, -0.65, 0.22);
fire.addColorStop(0, '#ffd27a');
fire.addColorStop(0.5, '#f08a32');
fire.addColorStop(1, '#7a2a14');
g.fillStyle = fire;
g.fillRect(-0.18, -0.8, 0.36, 0.3);
e.layer('door', { pivot: [-0.2, -0.65] }, d => {
  d.fillStyle = '#26211e';
  d.fillRect(-0.2, -0.82, 0.4, 0.34);
  d.fillStyle = '#4a403a';
  d.fillRect(0.12, -0.7, 0.05, 0.1);
});
e.light(0, -0.62, 0.3, '#e47a32', 1.2, 'fire');
e.at(0.15, -0.65, 'door');
