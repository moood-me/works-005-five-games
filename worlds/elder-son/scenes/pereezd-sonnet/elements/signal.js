// The crossing's signal: a mast with a board and two red lamps (they blink by `bell`: animate).
g.fillStyle = '#2a2c34';
g.fillRect(-0.06, -3.3, 0.12, 3.3);
g.fillStyle = '#6a6e80';
g.fillRect(-0.5, -3.6, 1.0, 0.75);
g.fillStyle = '#1c1d22';
g.fillRect(-0.44, -3.54, 0.88, 0.63);
g.fillStyle = '#6a1812';
g.beginPath(); g.arc(-0.22, -3.22, 0.17, 0, 6.283); g.fill();
g.beginPath(); g.arc(0.22, -3.22, 0.17, 0, 6.283); g.fill();
g.fillStyle = '#6a6e80';
g.fillRect(-0.5, -3.7, 1.0, 0.1);
e.light(-0.22, -3.22, 0.5, '#ff3b2a', 1.2, 'l');
e.light(0.22, -3.22, 0.5, '#ff3b2a', 1.2, 'r');
e.at(0, -3.22, 'light');
