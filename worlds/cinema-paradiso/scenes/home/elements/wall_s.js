// The south wall behind the start: whitewash, the dado. Painted once.
const R = e.lib.G.ROOM;
g.fillStyle = '#cfc3ad'; g.fillRect(-R.x1 - 0.05, -R.h - 0.05, R.x1 - R.x0 + 0.1, R.h + 0.07);
g.fillStyle = '#7b6a56'; g.fillRect(-R.x1 - 0.05, -0.95, R.x1 - R.x0 + 0.1, 0.95);
g.fillStyle = '#4b3e31'; g.fillRect(-R.x1 - 0.05, -0.12, R.x1 - R.x0 + 0.1, 0.12);
// (x runs west: world x = −x) a wardrobe against it west of the middle, the wall clock, a shelf of pots by the door
g.fillStyle = '#4e3a29'; g.fillRect(0.55, -2.05, 1.1, 2.05);
g.fillStyle = '#5d4632'; g.fillRect(0.6, -1.98, 0.5, 1.9); g.fillRect(1.1, -1.98, 0.5, 1.9);
g.fillStyle = '#3e2e21'; g.fillRect(0.5, -2.12, 1.2, 0.08);
g.fillStyle = '#8f7a52'; g.fillRect(1.06, -1.1, 0.03, 0.08); g.fillRect(1.12, -1.1, 0.03, 0.08);
g.fillStyle = '#6a5a48'; g.fillRect(0.75, -2.3, 0.35, 0.18);
g.fillStyle = '#3a2a1e'; g.fillRect(-0.45, -2.22, 0.3, 0.36);
g.fillStyle = '#e8e0cc'; g.beginPath(); g.arc(-0.3, -2.06, 0.11, 0, Math.PI * 2); g.fill();
g.strokeStyle = '#1e1a16'; g.lineWidth = 0.01; g.beginPath(); g.moveTo(-0.3, -2.06); g.lineTo(-0.3, -2.14); g.moveTo(-0.3, -2.06); g.lineTo(-0.25, -2.04); g.stroke();
g.fillStyle = '#a89058'; g.fillRect(-0.32, -1.9, 0.04, 0.1); g.beginPath(); g.arc(-0.3, -1.78, 0.035, 0, Math.PI * 2); g.fill();
g.fillStyle = '#4e3a29'; g.fillRect(1.9, -1.55, 0.7, 0.04);
for (let i = 0; i < 4; i++) { g.fillStyle = i % 2 ? '#7a5a3e' : '#8a8478'; g.beginPath(); g.ellipse(2.0 + i * 0.17, -1.62, 0.07, 0.07, 0, Math.PI, 0); g.fill(); g.fillRect(1.93 + i * 0.17, -1.62, 0.14, 0.07); }
