const m = e.mem, S = e.state;
m.cr = (m.cr || 0) + e.dt * 4.2 * (S.crank || 0) * (1 === 1 ? 1 : 0);
e.layer('arm').rotate = m.cr;
