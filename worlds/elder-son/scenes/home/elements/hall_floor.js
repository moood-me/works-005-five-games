// The passage's floor beyond the front door: worn grey boards, a little snow trodden in. Metres; 2.9 × 1.6.
g.fillStyle = '#5a5250';
g.fillRect(-1.45, -0.8, 2.9, 1.6);
g.strokeStyle = 'rgba(30,26,24,0.5)';
g.lineWidth = 0.012;
for (let x = -1.45; x < 1.45; x += 0.15) {
  g.beginPath();
  g.moveTo(x, -0.8);
  g.lineTo(x, 0.8);
  g.stroke();
}
g.fillStyle = 'rgba(220,226,236,0.35)';
g.beginPath();
g.ellipse(0, 0.4, 0.4, 0.25, 0, 0, Math.PI * 2);
g.fill();
