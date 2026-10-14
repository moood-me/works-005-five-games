// The one warm window: orange glass, a cross of frame, a dark shape of a head and shoulders of someone inside.
const gr = g.createLinearGradient(0, -2.2, 0, -0.9);
gr.addColorStop(0, '#f6c070');
gr.addColorStop(1, '#e8963a');
g.fillStyle = gr;
g.fillRect(-0.7, -2.2, 1.4, 1.2);
g.fillStyle = 'rgba(60,30,14,0.55)';
g.beginPath(); g.ellipse(0.2, -1.5, 0.17, 0.19, 0, 0, 6.283); g.fill();
g.beginPath(); g.moveTo(-0.15, -1.0); g.quadraticCurveTo(0.2, -1.45, 0.55, -1.0); g.closePath(); g.fill();
g.strokeStyle = '#3a2418'; g.lineWidth = 0.07;
g.strokeRect(-0.7, -2.2, 1.4, 1.2);
g.beginPath(); g.moveTo(0, -2.2); g.lineTo(0, -1.0); g.moveTo(-0.7, -1.6); g.lineTo(0.7, -1.6); g.stroke();
e.light(0, -1.6, 1.0, '#e8863a', 1.0, 'win');
