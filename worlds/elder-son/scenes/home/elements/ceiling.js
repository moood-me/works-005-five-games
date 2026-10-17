// The ceilings: whitewashed boards, smoked a little over the stove. Metres; 8 × 4.
g.fillStyle = '#d8d0c0';
g.fillRect(-4, -2, 8, 4);
g.strokeStyle = 'rgba(90,80,70,0.25)';
g.lineWidth = 0.015;
for (let x = -4; x < 4; x += 0.2) {
  g.beginPath();
  g.moveTo(x, -2);
  g.lineTo(x, 2);
  g.stroke();
}
g.fillStyle = 'rgba(60,50,40,0.18)';
g.beginPath();
g.ellipse(-3.2, 0.4, 0.8, 0.9, 0, 0, Math.PI * 2);
g.fill();
