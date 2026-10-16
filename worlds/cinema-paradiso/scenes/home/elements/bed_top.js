// The bed from above (y toward the start, the head at the far end): the grey blanket smoothed, the pillow, a folded
// sheet at the foot. Painted once.
const B = e.lib.G.BED, w = B.x1 - B.x0, d = B.z1 - B.z0;
g.fillStyle = '#5a5e66'; g.fillRect(-w / 2, -d / 2, w, d);
g.fillStyle = 'rgba(30,30,40,0.25)'; for (let y = -d / 2 + 0.5; y < d / 2; y += 0.3) g.fillRect(-w / 2, y, w, 0.015);
g.fillStyle = '#ddd6c6'; g.beginPath(); g.ellipse(0, -d / 2 + 0.22, w * 0.4, 0.15, 0, 0, Math.PI * 2); g.fill();
g.fillStyle = '#cfc6b2'; g.fillRect(-w / 2 + 0.02, -d / 2 + 0.4, w - 0.04, 0.12);
e.at(0, -d / 2 + 0.22, 'pillow');
