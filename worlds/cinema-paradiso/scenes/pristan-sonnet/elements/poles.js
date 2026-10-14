e.layer('p', { box: [-3.5, -4.9, 3.5, 0.1] }, g => {
  g.fillStyle = '#3a2d22';
  g.fillRect(-2.5, -4.6, 0.1, 4.6); g.fillRect(2.4, -4.6, 0.1, 4.6);
  g.fillRect(-2.5, -4.6, 5.1, 0.07);
  g.strokeStyle = '#4a4a4a'; g.lineWidth = 0.02;
  for (const sx of [-1, 1]) { g.beginPath(); g.moveTo(sx * 2.45, -4.5); g.lineTo(sx * 3.4, 0); g.stroke(); }
});
