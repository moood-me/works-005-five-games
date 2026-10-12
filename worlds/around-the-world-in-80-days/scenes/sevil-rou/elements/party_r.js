// The party wall on the right of Fogg's rooms (x toward the street).
const P = e.lib.plan;
g.fillStyle = '#a7a69e';
g.fillRect(-P.house.room, -P.parapet, P.house.room, P.parapet - P.floors[0]);
