// The dark of a projection booth with its lamp somewhere low on the right: near black, a breath of warm air round the
// lamp and along the strip's line, nothing else. Painted once.
const A = e.aspect, L = e.lib.lampAt(A);
g.fillStyle = '#070605';
g.fillRect(-0.3, -0.35, A + 0.6, 1.6);
const air = g.createRadialGradient(L.x, L.y, 0, L.x, L.y, 1.1);
air.addColorStop(0, 'rgba(120,78,40,0.38)');
air.addColorStop(0.35, 'rgba(70,44,24,0.16)');
air.addColorStop(1, 'rgba(0,0,0,0)');
g.fillStyle = air;
g.fillRect(-0.3, -0.35, A + 0.6, 1.6);
const band = g.createLinearGradient(0, 0.2, 0, 0.8);
band.addColorStop(0, 'rgba(60,40,22,0)');
band.addColorStop(0.5, 'rgba(60,40,22,0.18)');
band.addColorStop(1, 'rgba(60,40,22,0)');
g.fillStyle = band;
g.fillRect(-0.3, 0.2, A + 0.6, 0.6);
