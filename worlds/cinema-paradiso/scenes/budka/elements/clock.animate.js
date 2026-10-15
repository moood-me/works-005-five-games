const h = e.state.era === 'ruin' ? 4.6 : Math.max(6, Math.min(10, e.state.clock || 6));
e.layer('hour').rotate = (h % 12) / 12 * Math.PI * 2; e.layer('min').rotate = (h % 1) * Math.PI * 2;
