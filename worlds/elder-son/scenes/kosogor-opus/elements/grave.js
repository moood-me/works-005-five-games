// The fresh grave: a long mound of frozen earth half under new snow, a temporary wooden obelisk with a star and a
// photograph's dark oval, two wreaths of fir with paper flowers leaning on it. Metres; 2.6 wide.
g.fillStyle = '#5a4a40';
g.beginPath();
g.moveTo(-1.3, 0.05);
g.quadraticCurveTo(-0.9, -0.55, 0, -0.6);
g.quadraticCurveTo(0.9, -0.55, 1.3, 0.05);
g.closePath();
g.fill();
g.fillStyle = '#e6ebf3';
g.beginPath();
g.moveTo(-1.1, -0.2);
g.quadraticCurveTo(-0.3, -0.62, 0.6, -0.48);
g.quadraticCurveTo(0.2, -0.38, -1.1, -0.2);
g.fill();
// the obelisk
g.fillStyle = '#6c6157';
g.fillRect(-0.12, -1.45, 0.24, 1.0);
g.beginPath();
g.moveTo(-0.14, -1.45);
g.lineTo(0, -1.6);
g.lineTo(0.14, -1.45);
g.fill();
g.fillStyle = '#a3302a';
g.beginPath();
g.arc(0, -1.62, 0.05, 0, Math.PI * 2);
g.fill();
g.fillStyle = '#2a2624';
g.beginPath();
g.ellipse(0, -1.18, 0.06, 0.08, 0, 0, Math.PI * 2);
g.fill();
// the wreaths
for (const [x, s] of [[-0.42, 1], [0.38, 0.9]]) {
  g.strokeStyle = '#2f4436';
  g.lineWidth = 0.08 * s;
  g.beginPath();
  g.ellipse(x, -0.62, 0.28 * s, 0.32 * s, 0, 0, Math.PI * 2);
  g.stroke();
  g.fillStyle = '#c8b3a4';
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    g.beginPath();
    g.arc(x + Math.cos(a) * 0.28 * s, -0.62 + Math.sin(a) * 0.32 * s, 0.035, 0, Math.PI * 2);
    g.fill();
  }
}
