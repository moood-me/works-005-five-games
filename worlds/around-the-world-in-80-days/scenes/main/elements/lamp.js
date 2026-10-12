// The lamp over the whist table: a long cord out of the dark, a plain shade, warm light below it — the faint cone of its
// light in the air down to the table (the dust turning in it is the scene's: particles "dust").
// the cord, up into the dark
g.strokeStyle = '#1a1614';
g.lineWidth = 0.012;
g.beginPath();
g.moveTo(0, -0.2);
g.lineTo(0, -16);
g.stroke();
// the shade
g.fillStyle = '#1e2620';
g.beginPath();
g.moveTo(-0.11, -0.22);
g.lineTo(0.11, -0.22);
g.lineTo(0.36, 0);
g.lineTo(-0.36, 0);
g.closePath();
g.fill();
// its glowing underside
const ug = g.createRadialGradient(0, 0, 0, 0, 0, 0.36);
ug.addColorStop(0, 'rgba(255,240,205,1)');
ug.addColorStop(1, 'rgba(255,190,110,0.6)');
g.fillStyle = ug;
g.beginPath();
g.ellipse(0, 0, 0.35, 0.035, 0, 0, Math.PI * 2);
g.fill();
// the cone of light down to the table
const drop = 1.5;
e.layer('cone', { blend: 'add' }, c => {
  const cg = c.createLinearGradient(0, 0, 0, drop);
  cg.addColorStop(0, 'rgba(255,214,150,0.05)');
  cg.addColorStop(1, 'rgba(255,214,150,0.008)');
  c.fillStyle = cg;
  c.beginPath();
  c.moveTo(-0.34, 0);
  c.lineTo(0.34, 0);
  c.lineTo(0.68, drop);
  c.lineTo(-0.68, drop);
  c.closePath();
  c.fill();
});
e.light(0, 0.1, 1.6, '#ffd79a', 0.55, 'bulb');
e.at(0, 0, 'lamp');
