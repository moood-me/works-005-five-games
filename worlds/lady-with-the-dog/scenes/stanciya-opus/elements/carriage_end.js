// The train's tail: the last carriage's end wall, seen as the train goes away (metres, origin at its foot's middle).
// Two red tail lamps — the only red here, small.
g.fillStyle = '#6a776c'; g.fillRect(-1.5, -3.95, 3.0, 2.85);
g.fillStyle = '#353335'; g.fillRect(-1.5, -1.12, 3.0, 0.32);
g.fillStyle = '#3f4440';
g.beginPath(); g.moveTo(-1.6, -3.92); g.quadraticCurveTo(0, -4.3, 1.6, -3.92); g.lineTo(1.6, -3.85); g.lineTo(-1.6, -3.85); g.closePath(); g.fill();
g.fillStyle = '#56625a'; g.fillRect(-0.4, -3.55, 0.8, 2.4);
g.fillStyle = '#3c4048'; g.fillRect(-0.28, -3.3, 0.56, 0.6);
g.fillStyle = '#2b2a2c';
for (const x of [-1.05, 1.05]) { g.beginPath(); g.arc(x, -0.48, 0.45, 0, Math.PI * 2); g.fill(); g.fillRect(x - 0.12, -1.0, 0.24, 0.12); }
for (const [x, n] of [[-1.05, 'tail_l'], [1.05, 'tail_r']]) {
  g.fillStyle = '#2e2e30'; g.fillRect(x - 0.1, -1.62, 0.2, 0.26);
  g.fillStyle = '#d8382c'; g.beginPath(); g.arc(x, -1.49, 0.07, 0, Math.PI * 2); g.fill();
  e.light(x, -1.49, 0.32, '#ff3a26', 2.4, n);
}
