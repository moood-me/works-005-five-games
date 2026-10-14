// the screen on poles: a canvas, a black-and-white film still (a man in a hat, a woman at a window)
const W = 7, H = 3.9;
g.strokeStyle = '#2b2218'; g.lineWidth = 0.14;
g.beginPath(); g.moveTo(-W / 2 + 0.2, 0); g.lineTo(-W / 2 + 0.2, -H - 0.9); g.moveTo(W / 2 - 0.2, 0); g.lineTo(W / 2 - 0.2, -H - 0.9); g.stroke();
const gr = g.createRadialGradient(0, -H / 2 - 0.5, 0.3, 0, -H / 2 - 0.5, 4.5);
gr.addColorStop(0, '#f1efe4'); gr.addColorStop(1, '#8a897f'); g.fillStyle = gr; g.fillRect(-W / 2, -H - 0.5, W, H);
e.layer('film', { box: [-W / 2, -H - 0.5, W / 2, -0.5] }, f => {
  f.fillStyle = '#6d6c64'; f.fillRect(0.4, -3.9, 2.6, 3.2);
  f.fillStyle = '#c8c6ba'; f.fillRect(0.55, -3.75, 2.3, 2.9);
  f.fillStyle = '#2a2927';
  f.beginPath(); f.arc(1.7, -2.9, 0.38, 0, 7); f.fill();
  f.beginPath(); f.moveTo(1.1, -0.85); f.quadraticCurveTo(1.0, -2.4, 1.7, -2.5); f.quadraticCurveTo(2.4, -2.4, 2.3, -0.85); f.closePath(); f.fill();
  f.fillStyle = '#1b1a19';
  f.beginPath(); f.arc(-1.7, -2.5, 0.42, 0, 7); f.fill();
  f.fillRect(-2.4, -2.62, 1.4, 0.09); f.beginPath(); f.arc(-1.7, -2.65, 0.43, Math.PI, 0); f.fill();
  f.beginPath(); f.moveTo(-3.0, -0.5); f.quadraticCurveTo(-3.0, -2.0, -1.7, -2.05); f.quadraticCurveTo(-0.4, -2.0, -0.35, -0.5); f.closePath(); f.fill();
});
e.light(0, -H / 2 - 0.5, 7, '#ffe4b8', 0.9, 'glow');
e.at(0, -H / 2 - 0.5, 'screen');
