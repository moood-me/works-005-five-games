// The four fingers: grip1…grip4, 1 holds … 0 let go (the game moves them).
const S = e.state;
e.kit.closeups.live(e, "hold", { grip: [S.grip1, S.grip2, S.grip3, S.grip4] });
