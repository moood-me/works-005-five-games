const m = e.mem;
m.cr = (m.cr || 0) + e.dt * 4.2 * (e.state.crank || 0) * (1 === 1 ? 1 : 0);
e.layer('k').y = 0.12 * (1 - Math.cos(m.cr)) - 0.0;
