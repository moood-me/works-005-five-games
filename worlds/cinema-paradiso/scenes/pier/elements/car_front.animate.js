if (e.state.car !== 'old' && e.state.car !== 'new') return;
const h = Math.max(0, Math.min(1, e.state.headlights || 0));
e.glow('hl_l', h); e.glow('hl_r', h);
