// Yokohama only: the crowd on the landing before Batulcar's stage — townsfolk standing, seen from behind, their faces
// to the stage (each a part at its own depth): dark kimonos, black hair, a straw hat here and there; the footlights
// light them.
if (e.lib.portOf(e.state) === 'yokohama') {
  const h = e.anim.hash, robes = ['#3a3a4a', '#4a3a30', '#2e3a3a', '#5a4a3a', '#3a2e3a'];
  for (let i = 0; i < 16; i++) {
    const x = i < 7 ? -6.6 + 0.62 * i + 0.2 * h(i, 3) : 1.6 + 0.62 * (i - 7) + 0.2 * h(i, 3);
    const dz = 0.5 * h(i, 5), tall = 1.5 + 0.2 * h(i, 7);
    e.part(x, dz, g => {
      g.fillStyle = robes[i % robes.length];
      g.beginPath();
      g.moveTo(-0.24, 0);
      g.lineTo(-0.22, -tall + 0.35);
      g.quadraticCurveTo(0, -tall + 0.25, 0.22, -tall + 0.35);
      g.lineTo(0.24, 0);
      g.closePath();
      g.fill();
      g.fillStyle = '#1a1614';
      g.beginPath();
      g.arc(0, -tall + 0.12, 0.13, 0, Math.PI * 2);
      g.fill();
      if (h(i, 9) < 0.3) {
        g.fillStyle = '#b89a5a';
        g.beginPath();
        g.moveTo(-0.32, -tall + 0.12);
        g.lineTo(0, -tall - 0.12);
        g.lineTo(0.32, -tall + 0.12);
        g.closePath();
        g.fill();
      }
    }, [-0.4, -2, 0.4, 0.05]);
  }
}
