// the club's lit hall behind its door: warm plank walls, a coat rack; seen through the open door
const gr = g.createRadialGradient(0, -1.9, 0.1, 0, -1.4, 1.6);
gr.addColorStop(0, '#f6c98a');
gr.addColorStop(0.6, '#c98d52');
gr.addColorStop(1, '#7a5233');
g.fillStyle = gr;
g.fillRect(-1.3, -2.4, 2.6, 2.42);
g.strokeStyle = 'rgba(80,50,30,0.35)';
g.lineWidth = 0.02;
for (let x = -1.25; x < 1.3; x += 0.18) {
  g.beginPath();
  g.moveTo(x, -2.4);
  g.lineTo(x, 0);
  g.stroke();
}
g.fillStyle = '#3c2e24';
g.fillRect(0.7, -1.9, 0.05, 1.9);
g.fillRect(0.5, -1.9, 0.45, 0.04);
