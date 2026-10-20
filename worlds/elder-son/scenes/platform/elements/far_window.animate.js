const k = 0.35 + 0.65 * Math.max(0, Math.min(1, Number(e.state.warm) || 0));
e.layer('lit').alpha = k;
e.glow('glow', k);
