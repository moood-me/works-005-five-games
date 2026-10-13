// Grey's sea coat hung over the back of his father's chair: dark blue cloth over the top, the shoulders, the sleeves
// down the back. One layer, painted hung; `coat_on_chair` 0…1 brings it down over the back (coat.animate.js).
e.layer("coat", { pivot: [0, -1.17] }, (c) => {
  c.fillStyle = "#2f3b4d";
  c.beginPath();
  c.moveTo(-0.3, -1.17);
  c.quadraticCurveTo(0, -1.21, 0.3, -1.17);
  c.quadraticCurveTo(0.42, -1.12, 0.4, -0.95);
  c.lineTo(0.36, -0.42);
  c.quadraticCurveTo(0, -0.36, -0.36, -0.42);
  c.lineTo(-0.4, -0.95);
  c.quadraticCurveTo(-0.42, -1.12, -0.3, -1.17);
  c.fill();
  c.fillStyle = "#1d2531";
  c.fillRect(-0.4, -1.0, 0.09, 0.62);
  c.fillRect(0.31, -1.0, 0.09, 0.62);
  c.fillStyle = "rgba(200,170,110,0.7)";
  for (const y of [-0.85, -0.7, -0.55]) c.fillRect(-0.005, y, 0.012, 0.012);
});
e.at(0, -1.0, "coat");
