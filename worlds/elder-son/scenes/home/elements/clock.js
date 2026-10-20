// The wall clock (ходики): a painted wooden case with a little roof, the face, the weights on their chains; the
// pendulum swings (a layer, animate). Its point: face. Metres; the face at y −0.74.
g.fillStyle = '#5b4632';
g.fillRect(-0.15, -0.9, 0.3, 0.32);
g.beginPath();
g.moveTo(-0.19, -0.9);
g.lineTo(0, -0.98);
g.lineTo(0.19, -0.9);
g.closePath();
g.fill();
g.fillStyle = '#efe9da';
g.beginPath();
g.arc(0, -0.74, 0.11, 0, Math.PI * 2);
g.fill();
g.fillStyle = '#7d4b3a';
for (let i = 0; i < 12; i++) {
  const a = i * Math.PI / 6;
  g.fillRect(Math.sin(a) * 0.09 - 0.005, -0.74 - Math.cos(a) * 0.09 - 0.005, 0.01, 0.01);
}
g.strokeStyle = '#2a2420';
g.lineWidth = 0.008;
g.beginPath();
g.moveTo(0, -0.74);
g.lineTo(0.05, -0.79);
g.moveTo(0, -0.74);
g.lineTo(0, -0.66);
g.moveTo(-0.08, -0.58);
g.lineTo(-0.08, -0.1);
g.moveTo(0.08, -0.58);
g.lineTo(0.08, -0.3);
g.stroke();
g.fillStyle = '#2a2420';
g.fillRect(-0.105, -0.12, 0.05, 0.12);
g.fillRect(0.055, -0.32, 0.05, 0.12);
e.layer('pendulum', { pivot: [0, -0.58] }, p => {
  p.strokeStyle = '#3a2e24';
  p.lineWidth = 0.006;
  p.beginPath();
  p.moveTo(0, -0.58);
  p.lineTo(0, -0.3);
  p.stroke();
  p.fillStyle = '#b08a3a';
  p.beginPath();
  p.arc(0, -0.29, 0.03, 0, Math.PI * 2);
  p.fill();
});
e.at(0, -0.74, 'face');
