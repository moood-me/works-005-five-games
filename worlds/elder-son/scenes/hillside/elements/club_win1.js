// a lit window of the club: warm, a bar across, shapes of people dancing against it
const w = 1.1, h = 1.2;
const gr = g.createRadialGradient(0, -h * 0.55, 0.05, 0, -h * 0.55, Math.max(w, h) * 0.8);
gr.addColorStop(0, '#ffd8a0');
gr.addColorStop(0.6, '#f0a85a');
gr.addColorStop(1, '#c97a35');
g.fillStyle = gr;
g.fillRect(-w / 2, -h, w, h);
g.fillStyle = 'rgba(70,40,20,0.35)';
g.beginPath();
g.ellipse(-0.2, -h * 0.45, 0.12, 0.28, 0, 0, Math.PI * 2);
g.ellipse(0.22, -h * 0.4, 0.13, 0.3, 0, 0, Math.PI * 2);
g.fill();
g.fillStyle = '#d8d3c6';
g.fillRect(-0.03, -h, 0.06, h);
g.fillRect(-w / 2, -h * 0.6, w, 0.05);
e.light(0, -h * 0.5, 1.6, '#f2a850', 1.3, 'pane');
e.at(0, -h * 0.5);
