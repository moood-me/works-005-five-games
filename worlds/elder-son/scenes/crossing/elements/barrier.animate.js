// `barrier` 1 — down across the road; 0 — up. Its point (for the game) at the arm's middle, wherever the arm is.
const r = -(1 - e.state.barrier) * 1.42;
e.layer('arm').rotate = r;
e.at(2.6 * Math.cos(r), -1.0 + 2.6 * Math.sin(r));
