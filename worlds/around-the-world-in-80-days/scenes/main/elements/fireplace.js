// The fireplace: no surround — an opening cut in the partition (its recess: hearth, the fire in it: flames, embers), a
// slim mantel shelf over it; the warm heart of the room. Its light — how far it reaches and how it flickers — is the
// scene's ("lights": fire_light), as much as `fire` (0 embers … 1 a full blaze).
g.fillStyle = '#2a201c';
g.fillRect(-1.05, -1.3, 2.1, 0.06);
e.light(0, -0.35, 2.4, '#ff9a4a', 0.75, 'fire');
e.at(0, -0.35, 'fire');
