// The brass samovar the waiter brings (metres, origin at its foot); shown by `samovar`.
e.layer('all', {}, gs => {
  gs.fillStyle = '#b58f4c';
  gs.beginPath(); gs.ellipse(0, -0.02, 0.12, 0.02, 0, 0, Math.PI * 2); gs.fill();
  gs.fillRect(-0.05, -0.12, 0.1, 0.1);
  gs.beginPath(); gs.moveTo(-0.15, -0.12); gs.bezierCurveTo(-0.2, -0.3, -0.16, -0.42, -0.1, -0.46); gs.lineTo(0.1, -0.46); gs.bezierCurveTo(0.16, -0.42, 0.2, -0.3, 0.15, -0.12); gs.closePath(); gs.fill();
  gs.fillStyle = 'rgba(255,230,170,0.45)'; gs.fillRect(-0.06, -0.42, 0.03, 0.28);
  gs.fillStyle = '#9a7840'; gs.fillRect(-0.03, -0.56, 0.06, 0.1);
  gs.fillStyle = '#e8e2d6'; gs.beginPath(); gs.ellipse(0, -0.57, 0.05, 0.025, 0, 0, Math.PI * 2); gs.fill();
  gs.fillStyle = '#8a6c3a'; gs.fillRect(0.15, -0.2, 0.06, 0.02);
});
