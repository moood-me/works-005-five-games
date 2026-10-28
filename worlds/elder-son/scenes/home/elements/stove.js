// The kitchen stove's front, against the left wall: whitewashed brick, the iron cooking plate at 0.8 m (the kettle on
// it when `kettle_at` is stove), the fire door over the ash door, the oven's door; above, the stove's whitewashed
// mass and its chimney to the ceiling. The fire behind its door — a layer that flickers; the door — a layer that opens
// by `stove_door` (animate); the fire's light `fire`. Its points: door (the handle), fire. Metres; 1.2 wide,
// x = the plan's z − 1.6.
const brick = (x0, y0, x1, y1) => {
  g.strokeStyle = 'rgba(150,138,118,0.28)';
  g.lineWidth = 0.008;
  for (let y = y1, r = 0; y > y0; y -= 0.075, r++) {
    g.beginPath();
    g.moveTo(x0, y);
    g.lineTo(x1, y);
    for (let x = x0 + (r % 2 ? 0.125 : 0); x < x1; x += 0.25) {
      g.moveTo(x, y);
      g.lineTo(x, Math.max(y0, y - 0.075));
    }
    g.stroke();
  }
};
g.fillStyle = '#e8e1d2';
g.fillRect(-0.6, -2.0, 1.2, 2.02);
g.fillRect(-0.26, -2.62, 0.52, 0.64);
brick(-0.6, -2.0, 0.6, 0);
brick(-0.26, -2.62, 0.26, -2.0);
// soot over the plate and up the chimney
const soot = g.createLinearGradient(0, -0.86, 0, -1.6);
soot.addColorStop(0, 'rgba(70,60,52,0.35)');
soot.addColorStop(1, 'rgba(70,60,52,0)');
g.fillStyle = soot;
g.fillRect(-0.6, -1.6, 1.2, 0.74);
g.fillStyle = '#d6cdbb';
g.fillRect(-0.6, -2.04, 1.2, 0.06);
// the plate, its rings
g.fillStyle = '#2d2b2a';
g.fillRect(-0.6, -0.86, 1.2, 0.07);
g.fillStyle = '#4a4542';
g.fillRect(-0.46, -0.87, 0.3, 0.02);
g.fillRect(0.12, -0.87, 0.3, 0.02);
if (e.state.kettle_at === 'stove') {
  g.fillStyle = '#3e5a73';
  g.beginPath();
  g.moveTo(0.14, -0.87);
  g.quadraticCurveTo(0.1, -1.04, 0.2, -1.07);
  g.lineTo(0.42, -1.07);
  g.quadraticCurveTo(0.52, -1.04, 0.48, -0.87);
  g.closePath();
  g.fill();
  g.strokeStyle = '#2e3e4c';
  g.lineWidth = 0.02;
  g.beginPath();
  g.moveTo(0.2, -1.07);
  g.quadraticCurveTo(0.31, -1.2, 0.42, -1.07);
  g.moveTo(0.14, -0.96);
  g.lineTo(0.04, -1.04);
  g.stroke();
  g.fillStyle = '#e8e4da';
  g.beginPath();
  g.arc(0.31, -1.08, 0.025, 0, Math.PI * 2);
  g.fill();
}
// the iron doors: the oven's, the ash door, the frame of the fire door
g.fillStyle = '#2b2725';
g.fillRect(0.2, -0.7, 0.32, 0.3);
g.fillRect(-0.1, -0.3, 0.2, 0.14);
g.fillStyle = '#56504b';
g.fillRect(0.47, -0.58, 0.03, 0.06);
g.fillStyle = '#1e1b1a';
g.fillRect(-0.18, -0.7, 0.36, 0.32);
// the fire within (its own layer: it flickers)
e.layer('flame', { flicker: 0.5 }, f => {
  const fire = f.createRadialGradient(0, -0.5, 0.02, 0, -0.54, 0.2);
  fire.addColorStop(0, '#ffe08a');
  fire.addColorStop(0.45, '#f39a3a');
  fire.addColorStop(1, '#8a2c14');
  f.fillStyle = fire;
  f.fillRect(-0.15, -0.67, 0.3, 0.26);
});
// the fire door, hinged on its left
e.layer('door', { pivot: [-0.15, -0.54] }, d => {
  d.fillStyle = '#26211e';
  d.fillRect(-0.15, -0.67, 0.3, 0.26);
  d.strokeStyle = '#4a403a';
  d.lineWidth = 0.012;
  d.strokeRect(-0.13, -0.65, 0.26, 0.22);
  d.fillStyle = '#6a5e54';
  d.fillRect(0.08, -0.57, 0.05, 0.05);
});
e.light(0, -0.54, 0.25, '#e47a32', 1.2, 'fire');
e.at(0.1, -0.54, 'door');
e.at(0, -0.54, 'fire');
