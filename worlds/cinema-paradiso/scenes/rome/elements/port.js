// The port's frame round the opening (seen from the booth and from the room): dark wood, a little glass-less
// sill; its point `window` — the port itself, what the player touches to let the reel run
const G = e.lib.G, pw = G.PORT_W / 2, ph = G.PORT_H / 2;
g.fillStyle = '#3b2b20';
g.fillRect(-pw - 0.09, -ph - 0.09, 2 * pw + 0.18, 0.09); g.fillRect(-pw - 0.09, ph, 2 * pw + 0.18, 0.11);
g.fillRect(-pw - 0.09, -ph, 0.09, 2 * ph); g.fillRect(pw, -ph, 0.09, 2 * ph);
g.fillStyle = '#5a4230'; g.fillRect(-pw - 0.1, ph, 2 * pw + 0.2, 0.025);
e.at(0, 0.08, 'window');
e.at(0, 0);
