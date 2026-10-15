
// Toto's suitcase at his feet on the platform, until he takes it (then it is his: the cast's part `suitcase`)
const w = e.state.toto_with;
if (e.state.era === 'now' || (Array.isArray(w) && w.includes('suitcase'))) return;
g.fillStyle = '#6b4a30'; g.fillRect(-0.32, -0.42, 0.64, 0.42);
g.fillStyle = '#4a3220'; g.fillRect(-0.32, -0.25, 0.64, 0.03); g.fillRect(-0.06, -0.48, 0.12, 0.06);
g.fillStyle = '#b8a070'; g.fillRect(-0.25, -0.4, 0.04, 0.04); g.fillRect(0.21, -0.4, 0.04, 0.04);
e.at(0, -0.45);
