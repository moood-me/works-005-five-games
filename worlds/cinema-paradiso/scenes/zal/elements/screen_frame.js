// The screen's black border in the proscenium and, in 1988, the torn grey sheet behind where the film was
const W = 3.5, top = -6.2, bot = -2.2;
g.fillStyle = '#0d0c0c'; g.fillRect(-W - 0.15, top - 0.15, 2 * W + 0.3, bot - top + 0.3);
if (e.state.era !== 'ruin') { g.fillStyle = '#d8d3c6'; g.fillRect(-W, top, 2 * W, bot - top); return; }
g.fillStyle = '#9a968c'; g.fillRect(-W, top, 2 * W, bot - top);
g.fillStyle = '#0d0c0c';
g.beginPath(); g.moveTo(0.6, top); g.lineTo(1.6, top + 1.4); g.lineTo(1.1, top + 2.2); g.lineTo(2.2, bot); g.lineTo(3.5, bot); g.lineTo(3.5, top + 1.0); g.lineTo(2.0, top); g.closePath(); g.fill();
g.fillStyle = 'rgba(70,60,50,0.4)'; for (let i = 0; i < 14; i++) g.fillRect(-W + e.anim.hash(i, 5) * 6, top, 0.05, 1 + e.anim.hash(i, 6) * 2.5);
