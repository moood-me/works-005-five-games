// The armchair by the fire, turned to it, its back to you: one deep leather form. The fire lights its side.
const shape = () => {
  g.beginPath();
  g.moveTo(-0.5, -0.06);
  g.lineTo(-0.52, -0.62);
  g.quadraticCurveTo(-0.53, -0.98, -0.2, -1.0);
  g.lineTo(0.22, -0.99);
  g.quadraticCurveTo(0.5, -0.97, 0.5, -0.66);
  // the arm, rolled, toward the fire
  g.quadraticCurveTo(0.74, -0.7, 0.76, -0.56);
  g.lineTo(0.74, -0.06);
  g.closePath();
};
g.fillStyle = '#3c2520';
shape();
g.fill();
// small dark feet
g.fillStyle = '#140c0a';
g.fillRect(-0.46, -0.06, 0.05, 0.06);
g.fillRect(0.66, -0.06, 0.05, 0.06);
e.at(0.1, -0.9, 'armchair');
