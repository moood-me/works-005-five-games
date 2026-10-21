// `barrier` 1 — down across the road; 0 — up. Its point (for the game) on the arm's red tip, wherever the arm is: past
// the people standing at the arm, clear of them.
const r = -(1 - e.state.barrier) * 1.42;
e.layer('arm').rotate = r;
e.at(5.1 * Math.cos(r), -1.0 + 5.1 * Math.sin(r));
