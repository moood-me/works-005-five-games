// an old saloon, side-on, heading left: dark body, pale windows, a man in a hat in the back, headlamps
g.fillStyle = '#1e2133';
g.beginPath(); g.moveTo(-2.1, -0.35); g.lineTo(-2.0, -0.85); g.quadraticCurveTo(-1.6, -0.95, -1.2, -1.0); g.lineTo(-0.6, -1.55); g.lineTo(0.9, -1.55); g.quadraticCurveTo(1.5, -1.0, 2.0, -0.95); g.lineTo(2.1, -0.4); g.lineTo(2.1, -0.2); g.lineTo(-2.1, -0.2); g.closePath(); g.fill();
g.fillStyle = '#566078'; g.fillRect(-0.5, -1.45, 1.3, 0.45);
g.fillStyle = '#111018'; g.beginPath(); g.arc(0.35, -1.18, 0.2, 0, 7); g.fill(); g.fillRect(0.12, -1.0, 0.45, 0.2);
g.fillStyle = '#0d0e18'; g.fillRect(0.0, -1.38, 0.7, 0.1);
g.fillStyle = '#05060b'; g.beginPath(); g.arc(-1.3, -0.2, 0.36, 0, 7); g.fill(); g.beginPath(); g.arc(1.35, -0.2, 0.36, 0, 7); g.fill();
g.fillStyle = '#ffe9b8'; g.beginPath(); g.arc(-2.05, -0.62, 0.13, 0, 7); g.fill();
e.layer('lamps', { blend: 'add', box: [-12, -2.5, -1.9, 1] }, h => {
  const gr = h.createLinearGradient(-2.0, 0, -11, 0);
  gr.addColorStop(0, 'rgba(255,240,200,0.5)'); gr.addColorStop(1, 'rgba(255,240,200,0)');
  h.fillStyle = gr; h.beginPath(); h.moveTo(-2.0, -0.66); h.lineTo(-11, -2.2); h.lineTo(-11, 0.8); h.lineTo(-2.0, -0.58); h.closePath(); h.fill();
});
e.light(-2.1, -0.62, 3.0, '#fff0c8', 0.9, 'head');
e.at(0.35, -1.2, 'father');
