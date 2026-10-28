// The land where people go (the street itself is painted: its elements are "onLand": false): the roadway level, the
// pavements a kerb higher; up Fogg's steps — one slope, as the `steps` plane lies — to the ground floor, and its hall.
const P = lib.plan, kerb = P.kerb, door = P.house.across + P.door.x, half = P.steps.w / 2 + 0.05;
const floor = P.floors[0];
if (distance < P.road[0] || (distance > P.road[1] && distance < P.rail)) return kerb;
if (distance <= P.road[1]) return 0;
const H = P.house;
if (distance > P.front && Math.abs(across - H.across) < H.half) return floor;
if (Math.abs(across - door) < half && distance < P.front) return kerb + ((floor - kerb) * (distance - P.rail)) / (P.front - P.rail);
return kerb;
