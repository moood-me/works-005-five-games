// The party wall on the left of Fogg's rooms, from the front back to their back walls (x away from the
// street): what a window seen at a slant shows of a room's side.
const P = e.lib.plan;
g.fillStyle = '#a7a69e';
g.fillRect(0, -P.parapet, P.house.room, P.parapet - P.floors[0]);
