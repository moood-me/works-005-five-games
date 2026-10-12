// The far kerb's face, a hand high, the length of the street but where the side street crosses.
const P = e.lib.plan;
const ax = 5; // the element's across
const [s0, s1] = P.street;
g.fillStyle = '#9a9890';
g.fillRect(s0 - ax, -P.kerb, P.side[0] - s0, P.kerb);
g.fillRect(P.side[1] - ax, -P.kerb, s1 - P.side[1], P.kerb);
