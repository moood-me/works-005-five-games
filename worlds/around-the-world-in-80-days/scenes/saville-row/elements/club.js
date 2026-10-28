// The Reform Club at the street's end, behind its forecourt: a palazzo of nine bays and three floors, plain
// and exact, its windows' panes cut out — its rooms are lit behind them (club_rooms); its doorway in the
// middle, over its steps. To its right the next house of Pall Mall, dark.
const L = e.lib;
const P = L.plan;
const half = P.club.half;
const top = P.clubTop;
const door = [0, P.club.rise, 2.0, 3.6];
const wins = P.clubBays.flatMap(x => P.clubFloors.filter(([sill]) => x !== 0 || sill > 5).map(([sill, h, w]) => [x, sill, w, h]));
const wall = () => {
  g.beginPath();
  g.rect(-half, -top, 2 * half, top);
  for (const win of wins) for (const [x, y, w, h] of L.panes(win, 3)) g.rect(x, y, w, h);
  g.rect(-door[2] / 2, -door[1] - door[3], door[2], door[3]);
};
wall();
g.fillStyle = '#c4bfb2';
g.fill('evenodd');
// on the wall only: the ground floor's courses, the bands under the floors, the cornice, the sash frames and
// the thin cornice over each first-floor window
g.save();
wall();
g.clip('evenodd');
g.fillStyle = 'rgba(40,36,30,0.2)';
for (let y = 0.5; y < 6; y += 0.5) g.fillRect(-half, -y, 2 * half, 0.04);
g.fillRect(-half, -6.1, 2 * half, 0.25);
g.fillRect(-half, -11.3, 2 * half, 0.15);
g.fillStyle = 'rgba(40,36,30,0.35)';
g.fillRect(-half, -top, 2 * half, 1.1);
g.fillStyle = 'rgba(40,36,30,0.25)';
for (const x of P.clubBays) g.fillRect(x - 1.0, -7.0 - 3.6 - 0.3, 2.0, 0.12);
g.fillStyle = '#e4e2dc';
for (const [x, sill, w, h] of wins) g.fillRect(x - w / 2, -sill - h, w, h);
g.restore();
// the next house, dark, its windows shut
g.fillStyle = '#8a857a';
g.fillRect(half, -13.5, 16, 13.5);
g.fillStyle = '#2a2b2e';
for (let x = half + 1.8; x < half + 15; x += 3.2) for (const [sill, h] of [[1.6, 2.2], [4.8, 2.6], [8.6, 2.2]]) g.fillRect(x, -sill - h, 1.1, h);
e.at(0, -P.club.rise - 1.8);
