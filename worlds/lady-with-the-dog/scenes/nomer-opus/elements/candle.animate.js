// the candle burns down: the wax shortens from its foot, the flame comes down with it, a little dimmer and warmer
const c = e.lib.clamp01(e.state.candle);
e.layer('wax').scaleY = 1 - 0.75 * c;
e.layer('flame').y = 0.28 * 0.75 * c;
e.glow('flame', 1 - 0.3 * c);
