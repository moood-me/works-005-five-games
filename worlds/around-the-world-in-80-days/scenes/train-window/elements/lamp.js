// The table lamp: a small brass foot, a slender stem, a pleated shade — painted in daylight; its shade lit from within
// is a layer its shader adds as light as much as the lamps are on at night (its animate), and its bulb's light is the
// scene's (light table_lamp, on at night).
const brass = '#8a6a3c', shade = '#6a5a48';
const cone = g => {
  g.beginPath();
  g.moveTo(-0.06, -0.36);
  g.lineTo(0.06, -0.36);
  g.lineTo(0.105, -0.25);
  g.lineTo(-0.105, -0.25);
  g.closePath();
  g.fill();
};
g.fillStyle = brass;
g.beginPath();
g.ellipse(0, -0.012, 0.06, 0.012, 0, 0, Math.PI * 2);
g.fill();
g.fillRect(-0.008, -0.27, 0.016, 0.26);
g.fillStyle = shade;
cone(g);
e.light(0, -0.29, 0.8, '#ffc880', 0.7, 'bulb');
e.at(0, -0.3, 'lamp');
e.layer('lights', {}, g => {
  g.fillStyle = '#ffd9a0';
  cone(g);
});
