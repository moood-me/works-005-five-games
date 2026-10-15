
// The hall's screen far below and ahead, seen through the ports and the look port: the film on it (romance) shining
// while the beam is on (the shader); round it the dark of the hall.
g.fillStyle = '#e8e4da'; g.fillRect(-3.5, -4, 7, 4);
g.fillStyle = '#6a2226'; g.fillRect(-4.3, -4.6, 0.7, 4.6); g.fillRect(3.6, -4.6, 0.7, 4.6);
const W = 3.5;
g.save(); g.beginPath(); g.rect(-W + 0.1, -3.9, 2 * W - 0.2, 3.8); g.clip();
g.fillStyle = '#b8b4ac'; g.fillRect(-W, -4, 2 * W, 4);
g.fillStyle = '#efede6'; g.fillRect(0.6, -3.4, 1.8, 2.4);
g.fillStyle = '#1a1918'; g.beginPath(); g.ellipse(-1.4, -2.6, 0.32, 0.42, 0, 0, Math.PI * 2); g.fill(); g.fillRect(-2.0, -2.2, 1.2, 2.2);
g.fillRect(-1.85, -3.1, 0.9, 0.12);
g.fillStyle = '#262422'; g.beginPath(); g.ellipse(1.5, -2.5, 0.26, 0.38, 0, 0, Math.PI * 2); g.fill(); g.fillRect(1.1, -2.1, 0.8, 2.1);
g.restore();
