// The mole's head from above: the wider platform at its end, paved, coped round its edge.
const P = e.lib;
// (its paving laid on from the mole's: the same stones, the rows and joints running on across z 50 without a seam)
g.save(); g.beginPath(); g.rect(-7, -7, 14, 14); g.clip(); g.translate(-0.18, 0.04); P.paving(g, 7.8, 7.92, 7); g.restore();
g.fillStyle = '#c6b493';
g.fillRect(-7, -7, 14, 0.42); g.fillRect(-7, -7, 0.42, 14); g.fillRect(6.58, -7, 0.42, 14);
g.fillRect(-7, 6.58, 3.5, 0.42); g.fillRect(3.5, 6.58, 3.5, 0.42);
