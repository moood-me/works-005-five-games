// The Greys' old cask amidships on the poop (turned to the one who looks from over the starboard rail), standing on its end, dark with age, its hoops; two pewter
// mugs on its head — a layer its animate shows as `cask` says
e.layer("cask", {}, g => {
  g.fillStyle = "#4e3a2a";
  g.beginPath();
  g.moveTo(-0.3, 0);
  g.quadraticCurveTo(-0.38, -0.42, -0.3, -0.85);
  g.lineTo(0.3, -0.85);
  g.quadraticCurveTo(0.38, -0.42, 0.3, 0);
  g.closePath();
  g.fill();
  g.fillStyle = "#2a2622";
  for (const y of [-0.1, -0.3, -0.55, -0.75]) g.fillRect(-0.36, y, 0.72, 0.035);
  g.fillStyle = "#8e8e88";
  g.fillRect(-0.2, -1.0, 0.11, 0.15);
  g.fillRect(0.06, -0.99, 0.11, 0.14);
});
e.at(0, -0.85, "cask");
