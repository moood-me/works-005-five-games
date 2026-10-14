g.fillStyle = '#b5aa92'; g.fillRect(0, -5, 10, 5);
for (let i = 0; i < 26; i++) { const x = e.rnd() * 10; g.fillStyle = 'rgba(60,50,40,' + (0.04 + e.rnd() * 0.08) + ')'; g.fillRect(x, -5 + e.rnd() * 2, 0.1 + e.rnd() * 0.5, 1 + e.rnd() * 3); }
g.fillStyle = '#6e685d'; g.fillRect(0, -0.9, 10, 0.9);
g.fillStyle = '#4a3a30'; g.fillRect(-0.2, -5.4, 10.4, 0.5);
g.fillStyle = '#6a5646'; g.fillRect(0, -4.9, 10, 0.25);
g.fillStyle = '#d0c6ae'; g.fillRect(3.0, -2.85, 2.2, 0.25);
g.fillStyle = '#3a2d22'; g.fillRect(3.2, -2.6, 1.8, 2.6);
g.strokeStyle = '#241a12'; g.lineWidth = 0.04;
for (let i = 1; i < 6; i++) { g.beginPath(); g.moveTo(3.2 + i * 0.3, -2.6); g.lineTo(3.2 + i * 0.3, 0); g.stroke(); }
g.fillStyle = '#8a7a5a'; g.beginPath(); g.arc(4.75, -1.2, 0.05, 0, 6.28); g.fill();
for (const wx of [0.9, 7.0]) {
  g.fillStyle = '#1b2236'; g.fillRect(wx, -3.5, 1.1, 1.6);
  g.fillStyle = '#5c6a52'; g.fillRect(wx - 0.55, -3.5, 0.52, 1.6); g.fillRect(wx + 1.13, -3.5, 0.52, 1.6);
  g.fillStyle = '#d0c6ae'; g.fillRect(wx - 0.05, -1.9, 1.2, 0.08);
}
g.strokeStyle = '#2a2a2a'; g.lineWidth = 0.05; g.beginPath(); g.moveTo(2.4, -3.9); g.lineTo(2.4, -3.5); g.stroke();
g.fillStyle = '#ffdc96'; g.beginPath(); g.arc(2.4, -3.35, 0.14, 0, 6.28); g.fill();
e.light(2.4, -3.35, 3.4, '#ffb866', 1.0, 'lamp');
e.at(4.1, -1.2, 'door');
