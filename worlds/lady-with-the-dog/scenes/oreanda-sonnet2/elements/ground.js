const gr = g.createLinearGradient(0, -4.4, 0, 4.4);
gr.addColorStop(0, '#7d8566'); gr.addColorStop(0.5, '#5f6a4e'); gr.addColorStop(1, '#434d3a');
g.fillStyle = gr; g.fillRect(-20, -4.4, 40, 8.8);
g.fillStyle = '#a79c86'; g.globalAlpha = 0.8;
g.beginPath(); g.moveTo(-20, 1.3); g.bezierCurveTo(-8, 1.1, 6, 1.7, 20, 1.2); g.lineTo(20, 2.4); g.bezierCurveTo(6, 2.9, -8, 2.2, -20, 2.5); g.closePath(); g.fill();
g.globalAlpha = 1;
for (let i = 0; i < 160; i++) { g.fillStyle = e.rnd() < 0.5 ? '#4a5640' : '#8b9370'; g.globalAlpha = 0.3; g.fillRect(-19 + e.rnd() * 38, -4.4 + e.rnd() * 8.8, 0.1, 0.25); }
g.globalAlpha = 1;
g.fillStyle = '#2f3829'; g.fillRect(-20, -4.4, 40, 0.25);
