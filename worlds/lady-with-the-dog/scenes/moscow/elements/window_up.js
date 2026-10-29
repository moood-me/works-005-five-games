// The window upstairs: its frame and bars, its glass (faint: who stands behind it is seen), the sill; its point is where
// the voice from the window comes from
const L = e.lib;
const season = L.seasonOf(e.state.season);
g.fillStyle = 'rgba(150,170,195,0.14)';
g.fillRect(-0.4, -1.6, 0.8, 1.6);
g.strokeStyle = '#ebe5d8';
g.lineWidth = 0.06;
g.strokeRect(-0.37, -1.57, 0.74, 1.54);
g.lineWidth = 0.04;
g.beginPath();
g.moveTo(0, -1.6);
g.lineTo(0, 0);
g.moveTo(-0.4, -1.1);
g.lineTo(0.4, -1.1);
g.stroke();
L.PAINT.fillRect(g, '#8f8a82', -0.52, -0.02, 0.52, 0.06);
L.PAINT.snowLedge(g, season, -0.52, 0.52, -0.02, 0.07, () => e.rnd());
e.at(0, -0.8);
