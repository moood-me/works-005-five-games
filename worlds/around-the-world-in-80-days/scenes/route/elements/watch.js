// Fogg's pocket watch lying on the map, open: the silver case and its bow, the lid open beside it, the chain trailing
// off across the paper; the white dial, its numerals as strokes, the hour and minute hands; the second hand a layer its
// animate moves. Its point watch — the dial's middle.
const R = 0.42;
// the chain, in loose loops away to the left
g.strokeStyle = '#8f8a7e';
g.lineWidth = 0.025;
g.beginPath();
g.moveTo(0, -2 * R - 0.12);
g.bezierCurveTo(-0.4, -2.75 * R, -0.9, -1.6 * R, -1.3, -2.4 * R);
g.bezierCurveTo(-1.6, -3 * R, -2.0, -1.8 * R, -2.4, -2.1 * R);
g.stroke();
// the lid, open at its side
g.fillStyle = '#a9a69c';
g.beginPath();
g.ellipse(0.95 * R + R * 0.95, -R, R * 0.92, R * 0.98, 0, 0, Math.PI * 2);
g.fill();
g.strokeStyle = '#6e6a62';
g.lineWidth = 0.02;
g.stroke();
// (its inside, polished, and an engraved ring)
g.fillStyle = '#d4d1c6';
g.beginPath();
g.ellipse(0.95 * R + R * 0.95, -R, R * 0.74, R * 0.8, 0, 0, Math.PI * 2);
g.fill();
g.strokeStyle = 'rgba(110,105,95,0.6)';
g.lineWidth = 0.012;
g.beginPath();
g.ellipse(0.95 * R + R * 0.95, -R, R * 0.5, R * 0.55, 0, 0, Math.PI * 2);
g.stroke();
// the case and its bow
g.fillStyle = '#c9c6bc';
g.beginPath();
g.arc(0, -R, R, 0, Math.PI * 2);
g.fill();
g.strokeStyle = '#7a766c';
g.lineWidth = 0.025;
g.stroke();
g.fillStyle = '#b8b4a8';
g.fillRect(-0.05, -2 * R - 0.1, 0.1, 0.11);
g.beginPath();
g.arc(0, -2 * R - 0.14, 0.07, 0, Math.PI * 2);
g.strokeStyle = '#8f8a7e';
g.lineWidth = 0.025;
g.stroke();
// the dial, its hours
g.fillStyle = '#f4efe2';
g.beginPath();
g.arc(0, -R, R * 0.84, 0, Math.PI * 2);
g.fill();
g.strokeStyle = '#2a2622';
for (let h = 0; h < 12; h++) {
  const a = (h / 12) * Math.PI * 2, s = Math.sin(a), c = -Math.cos(a), r0 = R * (h % 3 ? 0.68 : 0.62);
  g.lineWidth = h % 3 ? 0.012 : 0.022;
  g.beginPath();
  g.moveTo(s * r0, -R + c * r0);
  g.lineTo(s * R * 0.76, -R + c * R * 0.76);
  g.stroke();
}
// the hands at a quarter to nine
g.lineCap = 'round';
for (const [turn, len, w] of [[(8.75 / 12) * Math.PI * 2, 0.4, 0.03], [0.75 * Math.PI * 2, 0.62, 0.02]]) {
  g.lineWidth = w;
  g.beginPath();
  g.moveTo(0, -R);
  g.lineTo(Math.sin(turn) * R * len, -R - Math.cos(turn) * R * len);
  g.stroke();
}
e.layer('second', { pivot: [0, -R] }, S => {
  S.strokeStyle = '#8a2a20';
  S.lineWidth = 0.008;
  S.beginPath();
  S.moveTo(0, -R + R * 0.12);
  S.lineTo(0, -R - R * 0.7);
  S.stroke();
});
g.fillStyle = '#2a2622';
g.beginPath();
g.arc(0, -R, 0.02, 0, Math.PI * 2);
g.fill();
e.at(0, -R, 'watch');
