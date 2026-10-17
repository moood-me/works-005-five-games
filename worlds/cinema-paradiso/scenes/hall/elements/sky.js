// The sky over Giancaldo (the world's sky), seen only through the hole in the ruined roof of 1988 — the cool evening
// of the present (the hall's `ruin` is the sky's `now`)
const E = Object.create(e);
Object.defineProperty(E, "state", { value: { ...e.state, era: e.state.era === 'ruin' ? 'now' : 'past' } });
e.kit.sky.sky(g, E, { horizon: 0.5, round: true, moon: null });
