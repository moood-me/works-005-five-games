// warehouse wall at the mole's root, seen from the mole: plaster, a dark door, one small window
g.fillStyle = '#5d6275'; g.fillRect(0, -4.6, 14.3, 4.6);
g.fillStyle = '#6f7482'; g.fillRect(0, -4.6, 14.3, 0.35); g.fillRect(0, -0.4, 14.3, 0.4);
for (let i = 0; i < 90; i++) { g.globalAlpha = 0.1; g.fillStyle = e.rnd() < 0.5 ? '#3b4258' : '#b4bacb';
  g.fillRect(e.rnd() * 13, -4.2 + e.rnd() * 3.8, 0.3 + e.rnd() * 1.1, 0.1 + e.rnd() * 0.5); }
g.globalAlpha = 1;
g.fillStyle = '#2a2f40'; g.fillRect(1.6, -3.2, 2.2, 2.8);
g.fillStyle = '#1b1f2e'; g.fillRect(1.8, -3.0, 1.8, 2.6);
g.fillStyle = '#3a3f52'; g.fillRect(7.0, -3.2, 1.2, 1.3);
g.fillStyle = '#1c2236'; g.fillRect(7.15, -3.05, 0.9, 1.0);
e.at(2.7, -1.6, 'door');
