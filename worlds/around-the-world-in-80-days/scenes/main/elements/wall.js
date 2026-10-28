// The window wall onto Pall Mall: tall windows in a dark plastered wall, the fog beyond them, and the doorway
// to the hall cut through it; it runs on past the partition, to the right (seen when the camera comes past it). The windows' depth in the wall is their reveals (jamb…, sill…, soffit…), the
// glazing stands at its back (glazing). Painted in its own colours; the room's light falls on it.
const L = e.lib;
const P = L.plan;
const W = P.win;
g.beginPath();
g.rect(-34, -16, 52, 16);
for (const c of P.windows) g.rect(c - W.w / 2, -W.top, W.w, W.top - W.sill);
g.rect(P.door.across - P.door.w / 2, -P.door.h, P.door.w, P.door.h);
g.fillStyle = '#36323a';
g.fill('evenodd');
// the doorway's architrave: a plain frame round the opening
g.strokeStyle = '#2a2628';
g.lineWidth = 0.2;
g.strokeRect(P.door.across - P.door.w / 2 - 0.1, -P.door.h - 0.1, P.door.w + 0.2, P.door.h + 0.1);
