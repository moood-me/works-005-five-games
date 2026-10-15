
// The door's leaf, painted from its hinge (the north jamb) south: planks, a cross brace, an iron latch; it turns
// about the hinge into the room toward the wall as `door` opens (its facing `door_f`, the script's).
g.fillStyle = '#5a4130'; g.fillRect(0, -2.0, 0.9, 2.0);
for (let x = 0.0; x < 0.9; x += 0.15) { g.fillStyle = (x * 20) % 2 < 1 ? '#614634' : '#553d2c'; g.fillRect(x, -2.0, 0.14, 2.0); }
g.fillStyle = '#4a3424'; g.fillRect(0.03, -1.7, 0.84, 0.1); g.fillRect(0.03, -0.45, 0.84, 0.1);
g.save(); g.translate(0.45, -1.07); g.rotate(-1.2); g.fillRect(-0.62, -0.05, 1.24, 0.1); g.restore();
g.fillStyle = '#2a2724'; g.fillRect(0.76, -1.05, 0.08, 0.04);
e.at(0.82, -1.03, 'edge');
