if (e.state.era === 'ruin') return;
const m = e.mem;
m.ph = (m.ph || 0) + e.dt * 3.0 * Math.max(0, Math.min(1, e.state.motor2 || 0));
e.layer('rt').rotate = m.ph; e.layer('rl').rotate = m.ph * 1.25;
