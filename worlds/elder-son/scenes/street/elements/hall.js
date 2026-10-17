// The passage behind the door, lit by a bare bulb: plank walls in warm light, a bucket, felt boots. Seen only
// through the open door. Metres.
const gr = g.createRadialGradient(0, -1.9, 0.1, 0, -1.4, 1.6);
gr.addColorStop(0, '#f6c98a');
gr.addColorStop(0.6, '#c98d52');
gr.addColorStop(1, '#7a5233');
g.fillStyle = gr;
g.fillRect(-1.25, -2.4, 2.5, 2.42);
g.strokeStyle = 'rgba(80,50,30,0.35)';
g.lineWidth = 0.02;
for (let x = -1.2; x < 1.25; x += 0.18) {
  g.beginPath();
  g.moveTo(x, -2.4);
  g.lineTo(x, 0);
  g.stroke();
}
g.fillStyle = '#6a6460';
g.fillRect(0.45, -0.38, 0.28, 0.38);
g.fillStyle = '#3c3430';
g.fillRect(-0.7, -0.4, 0.13, 0.4);
g.fillRect(-0.53, -0.4, 0.13, 0.4);
