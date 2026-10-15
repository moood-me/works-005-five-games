// The right wall (its x runs from the ports' wall toward the opposite one: x = 3.5 − z): over the bench a shelf of
// cans; the door's opening (the leaf is booth_door); the nail where the slate hangs in 1988 (slate_nail)
const L = e.lib, G = L.G, H = G.CEIL, ruin = e.state.era === 'ruin', X = z => 3.5 - z;
const d0 = X(G.DOOR[1]), d1 = X(G.DOOR[0]);
g.save(); g.beginPath(); g.rect(-0.1, -H - 0.1, 3.7, H + 0.15); g.rect(d0, -G.DOOR_H, d1 - d0, G.DOOR_H); g.clip('evenodd');
L.plaster(g, -0.1, -H - 0.1, 3.7, H + 0.15, ruin ? '#7e7466' : '#7c6852', 37, ruin);
g.fillStyle = '#3e3024'; g.fillRect(-0.1, -0.12, 3.7, 0.12);
g.restore();
g.fillStyle = '#3a2c20'; g.fillRect(d0 - 0.07, -G.DOOR_H - 0.07, 0.07, G.DOOR_H + 0.07); g.fillRect(d1, -G.DOOR_H - 0.07, 0.07, G.DOOR_H + 0.07); g.fillRect(d0 - 0.07, -G.DOOR_H - 0.07, d1 - d0 + 0.14, 0.07);
L.cans(g, X(G.BENCH[3]) + 0.02, -1.8, G.BENCH[3] - G.BENCH[2] - 0.04, 7, ruin);
g.strokeStyle = '#3a2c20'; g.lineWidth = 0.02; g.beginPath(); g.moveTo(X(G.BENCH[3]) + 0.05, -1.8); g.lineTo(X(G.BENCH[3]) + 0.15, -1.66); g.moveTo(X(G.BENCH[2]) - 0.05, -1.8); g.lineTo(X(G.BENCH[2]) - 0.15, -1.66); g.stroke();
// a poster of a film pinned by the bench
if (!ruin) { g.fillStyle = '#c9b48a'; g.fillRect(X(2.95) - 0.2, -2.15, 0.4, 0.55); e.kit.kino.frame(g, 'romance', X(2.95) - 0.17, -2.1, 0.34, 0.26); g.fillStyle = '#7a2a22'; g.fillRect(X(2.95) - 0.17, -1.78, 0.34, 0.06); }
g.fillStyle = '#2a2420'; g.fillRect(X(G.SLATE[0]) - 0.01, -G.SLATE[1] - 0.02, 0.02, 0.02);   // the nail
