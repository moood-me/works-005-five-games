// The carpet bag by the door (`bag` 0…1): there as soon as packing starts, filling out as it is packed, shut and
// strapped at 1 — twenty thousand pounds go in it. Painted once full (the layer 'bag', from its bottom) with its clasp
// (the layer 'clasp'); its animate fills it out — scales it up from half — and shows the clasp as it is shut.
const w = 0.46, h = 0.32;
e.layer('bag', { pivot: [0, 0] }, g => {
  g.fillStyle = '#5a3a28';
  g.beginPath();
  g.moveTo(-w / 2, 0);
  g.lineTo(-w / 2 - 0.03, -h * 0.7);
  g.quadraticCurveTo(-w / 2, -h, -w / 4, -h);
  g.lineTo(w / 4, -h);
  g.quadraticCurveTo(w / 2, -h, w / 2 + 0.03, -h * 0.7);
  g.lineTo(w / 2, 0);
  g.closePath();
  g.fill();
  // its woven band, the frame along its mouth, the handles
  g.fillStyle = 'rgba(160,110,70,0.35)';
  g.fillRect(-w / 2, -h * 0.55, w, h * 0.22);
  g.fillStyle = '#2a201a';
  g.fillRect(-w / 4, -h - 0.015, w / 2, 0.03);
  g.strokeStyle = '#2a201a';
  g.lineWidth = 0.02;
  g.beginPath();
  g.arc(0, -h, 0.1, Math.PI, 0);
  g.stroke();
});
e.layer('clasp', {}, g => {
  g.fillStyle = '#b8964e';
  g.fillRect(-0.02, -h - 0.02, 0.04, 0.04);
});
