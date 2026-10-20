// The platform's bench from the front: its back's slats, the concrete legs, the seat's front edge; snow on it at dawn
// (`bench_snow`: the beat's cut sets it).
g.fillStyle = '#6b6e74';
for (const x of [-0.9, 0.9]) g.fillRect(x - 0.08, -0.95, 0.16, 0.95);
g.fillStyle = '#7a5a3e';
for (const y of [-0.92, -0.76, -0.6]) g.fillRect(-1.15, y, 2.3, 0.11);
g.fillStyle = '#64492f';
g.fillRect(-1.15, -0.47, 2.3, 0.06);
if (e.state.bench_snow) {
  g.fillStyle = '#e8eef6';
  g.beginPath();
  g.moveTo(-1.2, -0.93);
  for (let x = -1.2; x <= 1.2; x += 0.1) g.lineTo(x, -0.97 - 0.05 * e.rnd());
  g.lineTo(1.2, -0.93);
  g.fill();
}
