const m = e.mem;
m.cr = (m.cr || 0) + e.dt * 4.2 * (e.state.crank || 0) * (2 === 1 ? 1 : 0);
e.layer('k').y = 0.12 * Math.cos(m.cr);
