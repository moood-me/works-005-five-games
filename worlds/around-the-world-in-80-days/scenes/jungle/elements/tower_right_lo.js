// The tower's lower stage, its right face, leaning in.
const T = e.lib.plan.temple.tower;
const [a, y0] = T[0];
const [b, y1] = T[0 + 1];
e.lib.towerFace(g, a, b, Math.hypot(y1 - y0, a - b));
