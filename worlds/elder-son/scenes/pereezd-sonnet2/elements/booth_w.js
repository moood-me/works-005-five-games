// тёплое окно будки: светится само, оранжевое только здесь
const gr = g.createLinearGradient(0, -2.1, 0, -0.9);
gr.addColorStop(0, '#f5b866'); gr.addColorStop(1, '#e8963a');
g.fillStyle = '#1b2030'; g.fillRect(-1.95, -2.15, 1.5, 1.3);
g.fillStyle = gr; g.fillRect(-1.88, -2.08, 1.36, 1.16);
g.fillStyle = '#1b2030'; g.fillRect(-1.24, -2.08, 0.1, 1.16); g.fillRect(-1.88, -1.55, 1.36, 0.08);
g.fillStyle = 'rgba(120,60,20,0.55)'; g.beginPath(); g.moveTo(-1.88, -2.08); g.lineTo(-1.5, -2.08); g.lineTo(-1.88, -1.4); g.closePath(); g.fill(); // занавеска
g.fillStyle = 'rgba(70,35,15,0.8)'; g.beginPath(); g.arc(-0.85, -1.55, 0.18, 0, 6.3); g.fill(); g.fillRect(-1.1, -1.4, 0.5, 0.5); // силуэт дежурной
e.light(-1.2, -1.5, 1.3, '#e8963a', 1.6, 'window');
e.at(-1.2, -1.5, 'window');
