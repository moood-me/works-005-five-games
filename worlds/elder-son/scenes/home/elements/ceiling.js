// The ceilings: whitewashed boards, a beam over the wall between, smoked a little over the stove. Metres; 8 × 4.
g.fillStyle = '#ddd5c6';
g.fillRect(-4, -2, 8, 4);
g.strokeStyle = 'rgba(90,80,70,0.22)';
g.lineWidth = 0.015;
for (let x = -4; x < 4; x += 0.2) {
  g.beginPath();
  g.moveTo(x, -2);
  g.lineTo(x, 2);
  g.stroke();
}
g.fillStyle = '#9c8e7c';
g.fillRect(-0.03, -2, 0.08, 4);
const soot = g.createRadialGradient(-3.6, 0, 0, -3.6, 0, 1.0);
soot.addColorStop(0, 'rgba(70,60,50,0.3)');
soot.addColorStop(1, 'rgba(70,60,50,0)');
g.fillStyle = soot;
g.fillRect(-4, -1.2, 1.6, 2.4);
