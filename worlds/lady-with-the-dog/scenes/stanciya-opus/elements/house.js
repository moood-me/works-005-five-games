// The little station house, its end toward the platform (metres, origin at the middle of its foot): pale ochre
// plaster, a dull-green iron roof, a double door with a fanlight, two windows, the station bell on its bracket by
// the door and a lamp on the other side. Its lit panes are another element (house_lit), so they shine.
const wall = '#d6c39e', shade = '#bba987', roof = '#6c7766', dark = '#4b3a2e', frame = '#efe6d2';
g.fillStyle = wall; g.fillRect(-3.6, -3.7, 7.2, 3.7);
g.fillStyle = shade; g.fillRect(-3.6, -0.45, 7.2, 0.45);
g.fillStyle = 'rgba(120,100,70,0.18)';
for (let i = 0; i < 40; i++) { const x = -3.5 + e.rnd() * 7, y = -3.6 + e.rnd() * 3; g.fillRect(x, y, 0.3 + e.rnd() * 0.6, 0.03); }
// the eaves board and the roof: a hip seen end on, a chimney
g.fillStyle = frame; g.fillRect(-3.8, -3.85, 7.6, 0.18);
g.fillStyle = roof;
g.beginPath(); g.moveTo(-3.95, -3.8); g.lineTo(-1.4, -5.5); g.lineTo(1.4, -5.5); g.lineTo(3.95, -3.8); g.closePath(); g.fill();
g.strokeStyle = 'rgba(40,48,40,0.35)'; g.lineWidth = 0.03;
for (let x = -3.4; x < 3.6; x += 0.45) { g.beginPath(); g.moveTo(x, -3.8); g.lineTo(x * 0.38, -5.5); g.stroke(); }
g.fillStyle = '#9a8670'; g.fillRect(1.6, -5.8, 0.45, 1.3);
g.fillStyle = '#6f6050'; g.fillRect(1.55, -5.85, 0.55, 0.1);
// the door and its fanlight (the panes are house_lit's)
g.fillStyle = frame; g.fillRect(-0.8, -3.05, 1.6, 3.05);
g.fillStyle = dark; g.fillRect(-0.68, -2.45, 1.36, 2.45);
g.strokeStyle = '#3a2d24'; g.lineWidth = 0.03;
g.beginPath(); g.moveTo(0, -2.45); g.lineTo(0, 0); g.stroke();
for (const x of [-0.55, 0.1]) { g.strokeRect(x, -2.25, 0.45, 0.9); g.strokeRect(x, -1.15, 0.45, 0.9); }
// two windows, their frames (the panes are house_lit's)
for (const x of [-2.4, 2.4]) {
  g.fillStyle = frame; g.fillRect(x - 0.58, -2.75, 1.16, 1.75);
  g.fillStyle = '#3f3a3a'; g.fillRect(x - 0.45, -2.62, 0.9, 1.45);
  g.fillStyle = frame; g.fillRect(x - 0.65, -1.02, 1.3, 0.08);
}
// the bell on its bracket, left of the door
g.strokeStyle = '#3c3a38'; g.lineWidth = 0.05;
g.beginPath(); g.moveTo(-1.05, -3.0); g.lineTo(-1.5, -3.0); g.lineTo(-1.5, -2.85); g.stroke();
g.fillStyle = '#b08a46';
g.beginPath(); g.moveTo(-1.5, -2.85); g.bezierCurveTo(-1.68, -2.82, -1.7, -2.5, -1.74, -2.42); g.lineTo(-1.26, -2.42); g.bezierCurveTo(-1.3, -2.5, -1.32, -2.82, -1.5, -2.85); g.closePath(); g.fill();
g.strokeStyle = '#6e5a3a'; g.lineWidth = 0.015;
g.beginPath(); g.moveTo(-1.5, -2.42); g.lineTo(-1.5, -2.0); g.stroke();
e.at(-1.5, -2.6, 'bell');
// the lamp on the right of the door
g.fillStyle = '#3c4140'; g.fillRect(1.05, -2.95, 0.35, 0.04); g.fillRect(1.35, -2.95, 0.04, 0.2);
g.fillStyle = '#e9d6a6';
g.beginPath(); g.moveTo(1.27, -2.75); g.lineTo(1.23, -2.45); g.lineTo(1.51, -2.45); g.lineTo(1.47, -2.75); g.closePath(); g.fill();
g.fillStyle = '#3c4140'; g.beginPath(); g.moveTo(1.2, -2.75); g.lineTo(1.37, -2.86); g.lineTo(1.54, -2.75); g.closePath(); g.fill();
e.light(1.37, -2.6, 0.16, '#ffd08a', 1.3, 'lamp');
e.at(0, -1.3, 'door');
