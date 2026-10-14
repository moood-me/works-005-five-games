const k = e.state.headlights * (e.state.car !== 'none' ? 1 : 0);
e.layer('hl').alpha = k;
e.glow('tip', k);
