// What lies on the table: Grey's bundle — a knotted cloth (layer `bundle`, shown by `bundle`: table.animate.js) — and
// where his note lies (the note itself is `note`, flat on the top): the game picks them here (`bundle`, `note`).
e.layer("bundle", {}, (c) => {
  c.fillStyle = "#b9ae99";
  c.beginPath();
  c.moveTo(-0.32, 0);
  c.quadraticCurveTo(-0.34, -0.2, -0.17, -0.22);
  c.quadraticCurveTo(-0.08, -0.2, -0.02, 0);
  c.closePath();
  c.fill();
  c.fillStyle = "#a29680";
  c.beginPath();
  c.moveTo(-0.2, -0.21);
  c.quadraticCurveTo(-0.24, -0.3, -0.18, -0.3);
  c.quadraticCurveTo(-0.12, -0.3, -0.15, -0.21);
  c.fill();
});
e.at(-0.17, -0.2, "bundle");
e.at(0.07, -0.01, "note");
