// the game's «Shrouds»: how high he is, each hand closed on the rope or lifted, the ship's roll on the horizon, a slip
const S = e.state;
e.kit.closeups.live(e, "ropes", { climb: S.climb, left: S.hand_l, right: S.hand_r, roll: S.roll, slip: S.slip });
