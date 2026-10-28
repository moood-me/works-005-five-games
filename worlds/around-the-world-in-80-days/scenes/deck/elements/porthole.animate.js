// he roars and bangs: the face shaking, never in a cycle one can see
const l = e.layer('speedy'), n = e.anim.noise;
l.x = 0.006 * n(e.t * 7, 1);
l.y = 0.008 * n(e.t * 6, 2);
l.rotate = 0.02 * n(e.t * 4, 3);
