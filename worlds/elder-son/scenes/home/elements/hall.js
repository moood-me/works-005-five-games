// The hall beyond the door: dark planks, cold — seen only when the door is open.
g.fillStyle = '#2e2a2c';
g.fillRect(-1.4, -2.4, 2.8, 2.42);
g.strokeStyle = 'rgba(80,70,64,0.5)';
g.lineWidth = 0.02;
for (let x = -1.35; x < 1.4; x += 0.18) {
  g.beginPath();
  g.moveTo(x, -2.4);
  g.lineTo(x, 0);
  g.stroke();
}
