// The tower's upper stage, its front face, leaning in.
const T = e.lib.plan.temple.tower;
const [a, y0] = T[1];
const [b, y1] = T[1 + 1];
e.lib.towerFace(g, a, b, Math.hypot(y1 - y0, a - b));
