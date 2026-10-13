// Bushes at the wood's edge over the beach, left of the mouth: low airy shrubs of small leaves, each stirring in the
// wind from its foot
const A = e.anim;
for (let i = 0; i < 7; i++) {
  const cx = (A.hash(i, 1) - 0.5) * 3.6;
  const r = 0.5 + 0.45 * A.hash(i, 2);
  e.layer(`shrub${i}`, { pivot: [cx, 0.1], wind: { strength: 0.12, gust: 0.6, scale: 2 }, box: [cx - 1.3 * r - 0.25, -r - 0.25, cx + 1.3 * r + 0.25, 0.12] }, (g) => {
    g.globalAlpha = 0.65;
    for (let j = 0; j < 40; j++) {
      const n = i * 40 + j;
      const a = A.hash(n, 3) * Math.PI;
      const k = Math.sqrt(A.hash(n, 4));
      const s = 0.07 + 0.09 * A.hash(n, 5);
      g.fillStyle = ["#b6c0a8", "#a7b39a", "#c5ccb8"][n % 3];
      g.beginPath();
      g.ellipse(cx + Math.cos(a) * r * 1.3 * k, -Math.sin(a) * r * k - 0.05, s * 1.3, s, 0, 0, 7);
      g.fill();
    }
  });
}
e.at(0, -1, "bushes");
