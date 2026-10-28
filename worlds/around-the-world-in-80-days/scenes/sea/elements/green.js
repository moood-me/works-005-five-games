// Green water over the port bow: a sheet of sea pouring over the rail and running aft over the deck, white where it
// breaks — layers its animate brings in as `green_water` rises and lets drain away.
const L = e.lib;
e.layer('sheet', { pivot: [-2.0, -1.2] }, g => {
  g.fillStyle = 'rgba(96,140,132,0.8)';
  g.beginPath();
  g.moveTo(-2.2, -2.4);
  g.quadraticCurveTo(-0.6, -2.6, 0.6, -1.0);
  g.quadraticCurveTo(1.6, 0.1, 2.2, 0.15);
  g.lineTo(-2.2, 0.15);
  g.closePath();
  g.fill();
  g.fillStyle = 'rgba(232,240,238,0.85)';
  g.beginPath();
  g.moveTo(-2.2, -2.5);
  g.quadraticCurveTo(-0.6, -2.7, 0.5, -1.2);
  g.quadraticCurveTo(-0.6, -2.1, -2.2, -1.9);
  g.closePath();
  g.fill();
  for (let k = 0; k < 18; k++) { const x = -2 + 4 * e.rnd(); g.fillRect(x, -0.05 - 0.3 * e.rnd(), 0.3 + 0.4 * e.rnd(), 0.07); }
});
