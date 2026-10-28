// Iron bollards at the quay's edge where the parapet opens — each a part where it stands.
for (const x of [-20, -10.2, -5.8, 9.6, 14.4, 28.6, 47.6]) {
  e.part(x, 0.1, g => {
    g.fillStyle = '#1e1f22';
    g.fillRect(-0.16, -0.55, 0.32, 0.55);
    g.beginPath();
    g.ellipse(0, -0.58, 0.24, 0.08, 0, 0, Math.PI * 2);
    g.fill();
  });
}
