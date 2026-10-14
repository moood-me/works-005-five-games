// the arm is up (barrier 0) or lying across the road (1); its point — the middle of it — goes with it
const a = -1.25 * (1 - Math.min(1, Math.max(0, e.state.barrier)));
e.layer('arm').rotate = a;
e.at(2.8 * Math.cos(a), -1.05 + 2.8 * Math.sin(a));
