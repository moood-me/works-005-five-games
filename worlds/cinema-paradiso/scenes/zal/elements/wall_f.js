// The screen wall: dark plaster, the proscenium arch with the velvet curtains drawn aside, the name over it; the
// screen itself is its own element. 1988: the curtains rotten and grey, letters fallen.
const P = e.lib, G = P.G, ruin = e.state.era === 'ruin', H = G.CEIL;
P.plaster(g, -6.5, -H - 0.05, 13, H + 0.05, ruin ? '#7c766c' : '#4e4034', 19, ruin);
g.fillStyle = ruin ? '#9a9284' : '#86704f';
g.beginPath(); g.moveTo(-4.6, -0.8); g.lineTo(-4.6, -6.0); g.quadraticCurveTo(0, -7.25, 4.6, -6.0); g.lineTo(4.6, -0.8); g.lineTo(4.25, -0.8);
g.lineTo(4.25, -5.85); g.quadraticCurveTo(0, -6.95, -4.25, -5.85); g.lineTo(-4.25, -0.8); g.closePath(); g.fill();
g.fillStyle = ruin ? '#2a2724' : '#151214'; g.beginPath(); g.moveTo(-4.25, -0.8); g.lineTo(-4.25, -5.85); g.quadraticCurveTo(0, -6.95, 4.25, -5.85); g.lineTo(4.25, -0.8); g.closePath(); g.fill();
for (const s of [-1, 1]) {
  for (let k = 0; k < 6; k++) {
    const x = s * (4.2 - k * 0.12);
    g.fillStyle = ruin ? (k % 2 ? '#5a504c' : '#4c4442') : (k % 2 ? '#6a1e22' : '#561719');
    g.beginPath(); g.moveTo(x, -6.3 + k * 0.05); g.quadraticCurveTo(x - s * 0.3, -3.5, x - s * 0.08, -0.8); g.lineTo(x - s * 0.2, -0.8); g.quadraticCurveTo(x - s * 0.4, -3.5, x - s * 0.12, -6.3 + k * 0.05); g.fill();
  }
  if (ruin) { g.fillStyle = '#2a2724'; g.beginPath(); g.moveTo(s * 3.6, -2.2); g.lineTo(s * 3.9, -1.5); g.lineTo(s * 3.5, -1.2); g.closePath(); g.fill(); }
}
g.fillStyle = ruin ? '#4c4442' : '#4a1216';
g.beginPath(); g.moveTo(-4.25, -5.9); g.quadraticCurveTo(0, -6.95, 4.25, -5.9); g.lineTo(4.25, -5.55); g.quadraticCurveTo(0, -6.5, -4.25, -5.55); g.closePath(); g.fill();
g.font = '600 0.42px serif'; g.textAlign = 'center'; g.fillStyle = ruin ? '#5c564c' : '#c8b07a';
g.fillText(ruin ? 'C  NE A  PA AD SO' : 'CINEMA  PARADISO', 0, -6.72);
