// Gray's fire on the glade by the cliff's edge: a ring of stones, a few branches crossed in it — there while the fire
// is (its animate); the flame is particles (flame, embers), its light the scene's fire_light (the `fire` element)
const A = e.anim;
e.layer("pit", {}, (g) => {
  for (let i = 0; i < 11; i++) {
    const a = Math.PI * (0.05 + (i / 10) * 0.9);
    g.fillStyle = i % 2 ? "#8a8882" : "#7b7974";
    g.beginPath();
    g.ellipse(-Math.cos(a) * 0.42, -0.03 - Math.sin(a) * 0.05, 0.07 + 0.03 * A.hash(i, 1), 0.055, 0, 0, 7);
    g.fill();
  }
  g.strokeStyle = "#4f4842";
  g.lineWidth = 0.045;
  g.lineCap = "round";
  g.beginPath();
  for (const [x0, y0, x1, y1] of [[-0.3, -0.04, 0.22, -0.16], [0.28, -0.03, -0.2, -0.17], [-0.06, -0.02, 0.05, -0.22], [0.1, -0.03, -0.12, -0.12]]) {
    g.moveTo(x0, y0);
    g.lineTo(x1, y1);
  }
  g.stroke();
});
