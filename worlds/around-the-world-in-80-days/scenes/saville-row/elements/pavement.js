// The far pavement, seen from above: big flagstones before the houses, and before the club its forecourt,
// out to the steps; open where the side street crosses it. Wet, a dimmer mirror than the roadway.
const P = e.lib.plan;
const ax = 5; // the plane's across
const zc = 22.2; // its distance
const X = a => a - ax;
const Y = d => zc - d;
const flags = (a0, a1, d0, d1) => {
  g.fillStyle = '#8c8b86';
  g.fillRect(X(a0), Y(d1), a1 - a0, d1 - d0);
  g.fillStyle = 'rgba(30,30,30,0.3)';
  for (let a = a0 + 0.9; a < a1; a += 0.9) g.fillRect(X(a), Y(d1), 0.025, d1 - d0);
  for (let d = d0 + 0.75; d < d1; d += 0.75) g.fillRect(X(a0), Y(d), a1 - a0, 0.025);
  // the kerbstones along its edge
  g.fillStyle = 'rgba(200,198,190,0.35)';
  g.fillRect(X(a0), Y(d0) - 0.3, a1 - a0, 0.3);
};
flags(P.street[0], P.side[0], P.road[1], P.front);
flags(P.side[1], P.block[1], P.road[1], P.front);
flags(P.block[1], P.street[1], P.road[1], P.club.d);
