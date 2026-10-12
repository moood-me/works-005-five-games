// A gull's sprite, three ways its wings are (each gull one of them: up, gliding, down) — the gulls wheeling over the
// harbour are particles.
const wings = [-0.32, -0.08, 0.14];
wings.forEach((lift, k) => {
  const cx = -1 + k;
  g.strokeStyle = '#e9e8e2';
  g.lineCap = 'round';
  g.lineWidth = 0.07;
  g.beginPath();
  g.moveTo(cx - 0.45, lift);
  g.quadraticCurveTo(cx - 0.2, lift - 0.1, cx, 0.02);
  g.quadraticCurveTo(cx + 0.2, lift - 0.1, cx + 0.45, lift);
  g.stroke();
  g.strokeStyle = '#3a3a3c';
  g.lineWidth = 0.06;
  for (const s of [-1, 1]) {
    g.beginPath();
    g.moveTo(cx + s * 0.36, lift - 0.02);
    g.lineTo(cx + s * 0.46, lift);
    g.stroke();
  }
  g.fillStyle = '#f2f1ec';
  g.beginPath();
  g.ellipse(cx, 0.03, 0.12, 0.045, 0, 0, Math.PI * 2);
  g.fill();
});
