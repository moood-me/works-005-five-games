// The painted scenery of “The Geisha” at the back of the stage: a pale evening sky, a far mountain, a little arched
// bridge over a stream, a blossoming tree in white, paper lanterns in pale yellow — a provincial painter's Japan.
g.fillStyle = '#c9d2d8'; g.fillRect(-6, -6.2, 12, 6.2);
g.fillStyle = '#e8dcc4'; g.fillRect(-6, -2.6, 12, 2.6);
g.fillStyle = '#aab4c4'; g.beginPath(); g.moveTo(-6, -2.6); g.lineTo(-1.4, -5.1); g.lineTo(-0.6, -4.95); g.lineTo(3.6, -2.6); g.fill();
g.fillStyle = '#f2efe6'; g.beginPath(); g.moveTo(-1.85, -4.85); g.lineTo(-1.4, -5.1); g.lineTo(-0.6, -4.95); g.lineTo(-0.3, -4.75); g.fill();
g.fillStyle = '#9fb6ba'; g.fillRect(-6, -1.0, 12, 0.5);
g.strokeStyle = '#6a5a4a'; g.lineWidth = 0.12;
g.beginPath(); g.moveTo(-2.4, -0.8); g.quadraticCurveTo(-1.2, -2.2, 0, -0.8); g.stroke();
g.lineWidth = 0.05; for (let x = -2.2; x < 0; x += 0.3) { g.beginPath(); g.moveTo(x, -0.95 - Math.sin((x + 2.4) / 2.4 * Math.PI) * 1.1); g.lineTo(x, -1.4 - Math.sin((x + 2.4) / 2.4 * Math.PI) * 1.1); g.stroke(); }
g.strokeStyle = '#4a3a2e'; g.lineWidth = 0.18;
g.beginPath(); g.moveTo(3.2, 0); g.quadraticCurveTo(3.0, -2.0, 2.2, -3.4); g.moveTo(3.05, -1.8); g.quadraticCurveTo(3.8, -2.6, 4.6, -3.0); g.stroke();
for (let i = 0; i < 60; i++) {
  const a = e.anim.hash(i, 31) * Math.PI * 2, r = e.anim.hash(i, 32) ** 0.6 * 1.5;
  g.fillStyle = i % 3 ? '#f4f0ea' : '#e8dede';
  g.beginPath(); g.arc(3.3 + Math.cos(a) * r * 1.2, -3.4 + Math.sin(a) * r * 0.6, 0.18 + e.anim.hash(i, 33) * 0.15, 0, Math.PI * 2); g.fill();
}
for (const [x, y] of [[-4.6, -3.6], [-3.6, -3.75], [-2.6, -3.85]]) {
  g.strokeStyle = '#6a5a4a'; g.lineWidth = 0.02; g.beginPath(); g.moveTo(x, -4.6); g.lineTo(x, y - 0.25); g.stroke();
  g.fillStyle = '#f2dc9c'; g.beginPath(); g.ellipse(x, y, 0.2, 0.26, 0, 0, Math.PI * 2); g.fill();
  g.strokeStyle = 'rgba(120,90,50,0.5)'; g.beginPath(); g.moveTo(x - 0.2, y); g.lineTo(x + 0.2, y); g.stroke();
}
