// The gilt frame of the mirror on the wall (metres, origin at its foot line's middle, the glass from 0.95 to 2.35 m).
const L = e.lib, M = L.MIRROR, w = M.w / 2;
g.fillStyle = '#a8873e';
g.beginPath(); g.rect(-w - 0.12, -M.y1 - 0.12, M.w + 0.24, M.y1 - M.y0 + 0.24); g.rect(w, -M.y1, -M.w, M.y1 - M.y0); g.fill('evenodd');
g.fillStyle = '#e6c879';
for (let i = 0; i < 14; i++) { g.beginPath(); g.arc(-w - 0.06, -M.y1 + 0.05 + i * 0.1, 0.018, 0, Math.PI * 2); g.fill(); g.beginPath(); g.arc(w + 0.06, -M.y1 + 0.05 + i * 0.1, 0.018, 0, Math.PI * 2); g.fill(); }
g.beginPath(); g.moveTo(-0.2, -M.y1 - 0.12); g.quadraticCurveTo(0, -M.y1 - 0.32, 0.2, -M.y1 - 0.12); g.closePath(); g.fill();
