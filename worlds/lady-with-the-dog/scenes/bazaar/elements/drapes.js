// Heavy drapes at the window's sides, dull grey-green, gathered; a pelmet over them (metres, origin at the window's
// middle across, on the floor).
const draw = (x, s) => {
  g.fillStyle = '#5b6658';
  g.beginPath(); g.moveTo(x, -3.15); g.lineTo(x + s * 0.42, -3.15); g.bezierCurveTo(x + s * 0.3, -2.0, x + s * 0.18, -1.4, x + s * 0.3, 0); g.lineTo(x - s * 0.02, 0); g.closePath(); g.fill();
  g.fillStyle = 'rgba(30,36,30,0.35)';
  for (let i = 1; i < 4; i++) g.fillRect(x + s * i * 0.08 - 0.012, -3.1, 0.024, 3.1);
};
draw(-1.22, 1); draw(1.22, -1);
g.fillStyle = '#4c5649'; g.fillRect(-1.25, -3.25, 2.5, 0.22);
g.fillStyle = '#b39a5c'; g.fillRect(-1.25, -3.05, 2.5, 0.03);
