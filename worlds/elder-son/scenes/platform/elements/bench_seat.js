// The bench's seat from above: its slats; under snow at dawn (`bench_snow`)
g.fillStyle = '#7a5a3e';
for (let y = -0.2; y < 0.2; y += 0.1) g.fillRect(-1.15, y, 2.3, 0.08);
if (e.state.bench_snow) {
  g.fillStyle = 'rgba(234,240,248,0.92)';
  g.fillRect(-1.15, -0.22, 2.3, 0.44);
}
