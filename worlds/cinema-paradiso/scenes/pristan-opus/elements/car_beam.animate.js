if (e.state.car !== 'old' && e.state.car !== 'new') return;
const h = Math.max(0, Math.min(1, e.state.headlights || 0)), r = Math.max(0, Math.min(1, e.state.rain || 0));
e.uniform('on', h * (0.35 + 0.65 * r));
e.glow('pool', h);
