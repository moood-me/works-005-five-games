// A column under the balcony's front: cream scagliola, a gilt capital and base (a form turned on a lathe: the painting
// is the way round, ≈ 1 m, by the profile's length, ≈ 3.2 m).
g.fillStyle = '#ddd0b4'; g.fillRect(-0.5, -3.25, 1.0, 3.25);
g.fillStyle = '#c4a463'; g.fillRect(-0.5, -3.25, 1.0, 0.5); g.fillRect(-0.5, -0.3, 1.0, 0.3);
g.strokeStyle = 'rgba(150,130,100,0.35)'; g.lineWidth = 0.015;
for (let x = -0.47; x < 0.5; x += 0.08) { g.beginPath(); g.moveTo(x, -2.7); g.lineTo(x, -0.35); g.stroke(); }
e.form(e.kit.revolve([[0.0, 3.0], [0.24, 3.0], [0.24, 2.85], [0.17, 2.75], [0.15, 2.6], [0.15, 0.3], [0.19, 0.2], [0.22, 0.05], [0.22, 0]]), { closed: 'u' });
