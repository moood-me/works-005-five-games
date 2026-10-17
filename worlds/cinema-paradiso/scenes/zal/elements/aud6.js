
// The painted audience of one row (aud1…aud8 share this code by their own row number): heads and shoulders above
// the seat backs, from behind; standing — a layer of raised arms. Lifted by the wave of `rise` (animate).
const P = e.lib, row = +e.id.slice(3);
e.layer('p', { box: [-5.3, -2.0, 5.3, 0.05] }, g2 => P.audience(g2, row, row * 13));
e.layer('arms', { box: [-5.3, -2.0, 5.3, 0.05] }, g2 => P.arms(g2, row, row * 13));
