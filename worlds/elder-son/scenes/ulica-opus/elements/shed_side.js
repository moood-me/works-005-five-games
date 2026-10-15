// The shed's side: weathered boards, snow drifted against them. Metres; 2 deep.
g.fillStyle = '#54493f';
g.fillRect(-1.0, -2.4, 2.0, 2.43);
g.strokeStyle = 'rgba(25,20,16,0.6)';
g.lineWidth = 0.025;
for (let x = -0.85; x < 1.0; x += 0.16) {
  g.beginPath();
  g.moveTo(x, -2.4);
  g.lineTo(x, 0);
  g.stroke();
}
e.kit.izby.drift(g, e, -1.1, 1.1, 0.35);
