const r = e.state.rain;
e.layer('boat').alpha = 1 - r;
e.layer('boat').x = r * (e.id === 'boat_l' ? -3.5 : 3.5);
e.glow('lamp', 1 - r);
