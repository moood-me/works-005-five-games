// The booth's floor from above (x right, y toward the opposite wall): worn boards, dark at the projectors' feet;
// in 1988 pigeons' down, glass, plaster fallen. Its points: where Alfredo fell (path0) and by the door (path1).
const L = e.lib, G = L.G, an = e.anim, ruin = e.state.era === 'ruin';
const Y = z => 1.75 - z;
g.fillStyle = ruin ? '#4a4038' : '#4b3a2a'; g.fillRect(-2.05, -1.8, 4.1, 3.6);
for (let k = 0, x = -2.05; x < 2.05; x += 0.14, k++) { g.fillStyle = ruin ? (k % 2 ? '#4f453c' : '#463d35') : k % 2 ? '#523f2d' : '#473624'; g.fillRect(x, -1.8, 0.13, 3.6); }
g.fillStyle = 'rgba(20,14,10,0.35)';
for (const p of [G.P1, G.P2]) { g.beginPath(); g.ellipse(p[0], Y(p[1]), 0.5, 0.45, 0, 0, Math.PI * 2); g.fill(); }
if (ruin) {
  for (let i = 0; i < 140; i++) {
    const x = -1.9 + an.hash(i, 3) * 3.8, y = -1.7 + an.hash(i, 4) * 3.4;
    g.fillStyle = i % 3 ? 'rgba(220,214,200,0.55)' : 'rgba(140,130,118,0.6)';
    g.beginPath(); g.ellipse(x, y, 0.015 + an.hash(i, 5) * 0.04, 0.01 + an.hash(i, 6) * 0.02, an.hash(i, 7) * 3, 0, Math.PI * 2); g.fill();
  }
  g.fillStyle = 'rgba(200,196,186,0.5)';
  for (let i = 0; i < 12; i++) { const x = -1.8 + an.hash(i, 9) * 1.2, y = Y(1.2 + an.hash(i, 10) * 0.7); g.fillRect(x, y, 0.06 + an.hash(i, 11) * 0.08, 0.02); }
} else {
  g.strokeStyle = '#2a2622'; g.lineWidth = 0.02; g.beginPath(); g.moveTo(1.1, -0.1); g.quadraticCurveTo(1.3, 0.2, 1.0, 0.4); g.stroke();
}
e.at(G.PATH0[0], Y(G.PATH0[1]), 'path0');
e.at(G.PATH1[0], Y(G.PATH1[1]), 'path1');
