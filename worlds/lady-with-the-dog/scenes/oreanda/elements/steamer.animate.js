// `lights` 0…3: how many of the three lights still burn — the deck's go out first, the masthead's last
const n = Math.max(0, Math.min(3, Number(e.state.lights) || 0));
e.glow('l2', Math.max(0, Math.min(1, n - 2)));
e.glow('l3', Math.max(0, Math.min(1, n - 1)));
e.glow('l1', Math.max(0, Math.min(1, n)));
