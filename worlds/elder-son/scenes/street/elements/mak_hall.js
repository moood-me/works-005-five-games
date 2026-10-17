// Makarskaya's passage behind her door: plank walls in the warm light of a bulb inside (seen only with the door open). Metres.
const gr = g.createRadialGradient(0.2, -1.9, 0.1, 0, -1.3, 1.5);
gr.addColorStop(0, '#d9a868');
gr.addColorStop(0.6, '#9a6a3e');
gr.addColorStop(1, '#4e3523');
g.fillStyle = gr;
g.fillRect(-1.0, -2.4, 2.0, 2.42);
g.strokeStyle = 'rgba(60,38,22,0.4)';
g.lineWidth = 0.02;
for (let x = -0.95; x < 1.0; x += 0.17) {
  g.beginPath();
  g.moveTo(x, -2.4);
  g.lineTo(x, 0);
  g.stroke();
}
g.fillStyle = '#3a2c24';
g.fillRect(0.35, -1.7, 0.06, 1.0);
g.fillStyle = '#6b3a2c';
g.fillRect(0.3, -1.55, 0.3, 0.75);
