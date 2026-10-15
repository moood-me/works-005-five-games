// the corridor's side of the left wall (seen from the corridor), plain and dark round the door
const G = e.lib.G, H = 3.2, d0 = G.DOOR[0], d1 = G.DOOR[1];
g.save(); g.beginPath(); g.rect(-3, -H, 6, H); g.rect(-(d1 - (d0 + d1) / 2), -2.6, d1 - d0, 2.6); g.clip('evenodd');
g.fillStyle = '#4e4741'; g.fillRect(-3, -H, 6, H);
g.fillStyle = '#35302b'; g.fillRect(-3, -1.0, 6, 1.0);
g.restore();
