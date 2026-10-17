// a tall wooden rack against the wall opposite the ports (its +x is the room's left): film cans in stacks, spare reels
// standing on edge, a hand-written card; in 1988 nearly empty
const an = e.anim, ruin = e.state.era === 'ruin';
const wood = ruin ? '#4e4438' : '#4a3424', dark = ruin ? '#3a332c' : '#2e2118';
g.fillStyle = dark; g.fillRect(-0.48, -2.1, 0.96, 2.1);
g.fillStyle = wood; g.fillRect(-0.48, -2.1, 0.05, 2.1); g.fillRect(0.43, -2.1, 0.05, 2.1);
for (const y of [-2.05, -1.55, -1.05, -0.55, -0.08]) g.fillRect(-0.48, y, 0.96, 0.04);
for (let r = 0; r < 4; r++) {
  const y0 = -1.55 + r * 0.5;
  let x = -0.42;
  while (x < 0.38) {
    const kind = an.hash(Math.round(x * 100) + r * 31, 5), w = kind < 0.6 ? 0.2 : 0.1;
    if (ruin && an.hash(Math.round(x * 100) + r, 9) < 0.7) { x += w + 0.03; continue; }
    if (kind < 0.6) { const n = 2 + Math.floor(an.hash(Math.round(x * 100), r) * 6); for (let k = 0; k < n; k++) { g.fillStyle = k % 2 ? '#6a6a64' : '#7c7b74'; g.fillRect(x, y0 - 0.035 * (k + 1), 0.2, 0.03); } }
    else { g.fillStyle = '#4a4b50'; g.beginPath(); g.arc(x + 0.05, y0 - 0.18, 0.17, 0, Math.PI * 2); g.fill(); g.fillStyle = '#2a2b2e'; g.beginPath(); g.arc(x + 0.05, y0 - 0.18, 0.12, 0, Math.PI * 2); g.fill(); }
    x += w + 0.03;
  }
}
g.fillStyle = ruin ? '#8a8072' : '#d8ccb0'; g.fillRect(-0.36, -1.98, 0.22, 0.12);
g.fillStyle = 'rgba(40,30,24,0.7)'; for (let k = 0; k < 3; k++) g.fillRect(-0.34, -1.95 + k * 0.03, 0.16 - k * 0.03, 0.008);
