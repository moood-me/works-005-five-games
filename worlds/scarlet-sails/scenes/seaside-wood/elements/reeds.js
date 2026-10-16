// Reeds on the right bank above the fall, where a small boat can lose itself: tall stalks, brown heads — in tufts the
// wind stirs
const A = e.anim;
const stalks = [];
for (let i = 0; i < 46; i++) {
  const x = (A.hash(i, 1) - 0.5) * 2.4;
  const h = 1.1 + 0.6 * A.hash(i, 2);
  const lean = (A.hash(i, 3) - 0.5) * 0.25;
  const head = A.hash(i, 5) < 0.4;
  stalks.push({
    x, y: 0, h, wide: Math.abs(lean) + 0.04,
    draw: (g) => {
      g.strokeStyle = i % 2 ? "#b4b393" : "#a3a383";
      g.lineWidth = 0.018;
      g.beginPath();
      g.moveTo(x, 0);
      g.quadraticCurveTo(x + lean * 0.3, -h * 0.6, x + lean, -h);
      g.stroke();
      if (head) {
        g.fillStyle = "#8a7a64";
        g.beginPath();
        g.ellipse(x + lean, -h + 0.08, 0.025, 0.1, lean, 0, 7);
        g.fill();
      }
    },
  });
}
e.lib.tufts(e, stalks, { width: 0.4, wind: { strength: 0.22, gust: 0.7, scale: 1.5 }, below: 0.3, name: "tuft" });
e.at(0, -0.8, "reeds");
