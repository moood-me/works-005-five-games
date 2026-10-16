// Toto's chest of drawers against the east wall of his corner, by the partition (its x runs south): three drawers,
// a small mirror over it, on the top a framed photo of a boy at his first communion, a jar of brushes, a stack of film
// magazines; his jacket on a hook beside it. Painted once.
g.fillStyle = '#5a4230'; g.fillRect(-0.45, -0.88, 0.9, 0.88);
g.fillStyle = '#4a3626'; g.fillRect(-0.48, -0.92, 0.96, 0.05);
for (let k = 0; k < 3; k++) {
  g.fillStyle = '#654a36'; g.fillRect(-0.41, -0.82 + k * 0.27, 0.82, 0.23);
  g.fillStyle = '#a08a5a'; g.fillRect(-0.2, -0.72 + k * 0.27, 0.06, 0.02); g.fillRect(0.14, -0.72 + k * 0.27, 0.06, 0.02);
}
// the mirror: dark glass in a frame, a pale glint
g.fillStyle = '#4a3626'; g.fillRect(-0.24, -1.62, 0.48, 0.58);
g.fillStyle = '#3c4048'; g.fillRect(-0.2, -1.58, 0.4, 0.5);
g.fillStyle = 'rgba(220,226,235,0.25)'; g.beginPath(); g.moveTo(-0.16, -1.55); g.lineTo(-0.08, -1.55); g.lineTo(-0.18, -1.2); g.lineTo(-0.2, -1.3); g.fill();
// on the top: the communion photo, a jar, magazines
g.fillStyle = '#2e2117'; g.fillRect(0.22, -1.12, 0.14, 0.2);
g.fillStyle = '#d9cfb6'; g.fillRect(0.235, -1.1, 0.11, 0.16);
g.fillStyle = '#ece6d8'; g.beginPath(); g.ellipse(0.29, -1.0, 0.025, 0.05, 0, 0, Math.PI * 2); g.fill();
g.fillStyle = '#6a7a8a'; g.fillRect(-0.36, -1.04, 0.07, 0.12);
g.strokeStyle = '#3a2a1c'; g.lineWidth = 0.008; for (const dx of [-0.34, -0.32, -0.3]) { g.beginPath(); g.moveTo(-0.32, -1.04); g.lineTo(dx, -1.14); g.stroke(); }
for (let k = 0; k < 4; k++) { g.fillStyle = ['#b9472e', '#d8c49a', '#5a6a8a', '#c9b48a'][k]; g.fillRect(-0.12, -0.93 - k * 0.012, 0.24, 0.011); }
// the jacket on its hook beside it (south of it)
g.fillStyle = '#3a3b44';
g.beginPath(); g.moveTo(0.52, -1.72); g.lineTo(0.62, -1.7); g.lineTo(0.78, -1.62); g.lineTo(0.8, -0.98); g.lineTo(0.5, -0.96); g.closePath(); g.fill();
g.fillStyle = '#2a2a30'; g.fillRect(0.6, -1.72, 0.04, 0.6);
