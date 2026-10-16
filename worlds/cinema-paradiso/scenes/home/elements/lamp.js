// The lamp hanging over the table on its cord: a white enamel shade, the bulb under it (its glow the engine's; the
// scene's light `lamp_light` is it). The cord to the ceiling. Painted once; its glow by `lamp` (animate).
const G = e.lib.G, up = G.ROOM.h - G.LAMP.y;
g.strokeStyle = '#1e1a16'; g.lineWidth = 0.008;
g.beginPath(); g.moveTo(0, -up); g.lineTo(0, -0.1); g.stroke();
g.fillStyle = '#e9e4d8';
g.beginPath(); g.moveTo(-0.04, -0.12); g.lineTo(0.04, -0.12); g.lineTo(0.22, 0.02); g.lineTo(-0.22, 0.02); g.closePath(); g.fill();
g.fillStyle = '#2a2622'; g.fillRect(-0.22, 0.015, 0.44, 0.012);
g.fillStyle = '#fff1cf'; g.beginPath(); g.ellipse(0, 0.04, 0.05, 0.035, 0, 0, Math.PI * 2); g.fill();
e.light(0, 0.04, 0.25, '#ffd79a', 1.2, 'bulb');
e.at(0, 0.04, 'bulb');
