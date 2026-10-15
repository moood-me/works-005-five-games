// The milk jug on the table (layer `jug`): white glazed earthenware, a blue band. While the mother holds it
// (`jug_held`) animate carries it to her hands; its handle and spout are points for her reach.
// (1988: the table cleared — nothing on it)
if (e.state.era === 'now') return;
e.layer('jug', { box: [-0.6, -0.9, 0.6, 0.4] }, l => {
  l.fillStyle = '#e6e0d2';
  l.beginPath(); l.moveTo(-0.06, 0); l.lineTo(0.06, 0); l.quadraticCurveTo(0.09, -0.1, 0.05, -0.18); l.lineTo(0.07, -0.21); l.lineTo(-0.06, -0.2);
  l.quadraticCurveTo(-0.09, -0.1, -0.06, 0); l.fill();
  l.fillStyle = '#4a6a9a'; l.fillRect(-0.075, -0.11, 0.15, 0.018);
  l.strokeStyle = '#d9d2c2'; l.lineWidth = 0.014;
  l.beginPath(); l.arc(-0.085, -0.11, 0.045, Math.PI * 0.5, Math.PI * 1.5); l.stroke();
});
e.at(-0.12, -0.11, 'handle');
e.at(0.07, -0.2, 'spout');
