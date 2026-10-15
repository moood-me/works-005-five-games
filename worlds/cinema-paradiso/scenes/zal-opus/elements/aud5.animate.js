
// shown by `hall` (and in 1988 only in the memory, by `past`); `rise` lifts the rows one after another, front first;
// `laugh` shakes their shoulders, each row its own phase
const s = e.state, row = +e.id.slice(3), an = e.anim;
const shown = s.hall === 'empty' ? 0 : (s.era === 'ruin' ? Math.max(0, Math.min(1, s.past)) : 1);
const up = s.hall === 'standing' ? 1 : Math.max(0, Math.min(1, e.was('rise', (row - 1) * 0.16) || 0));
const shake = (s.laugh || 0) * 0.025 * Math.abs(Math.sin(e.t * 9 + row * 1.7));
const p = e.layer('p'), a = e.layer('arms');
p.alpha = shown; a.alpha = shown * (s.hall === 'standing' ? 1 : 0);
p.y = -0.42 * up - shake + an.noise(e.t * 0.3, row) * 0.01; a.y = p.y;
// the priest's hand when he rings (row 5 holds his seat): over his right shoulder, shaken while `bell` rings — 3 s
// from its start; the script makes his right hand reach for this point
const m = e.mem, sx = e.lib.G.PRIEST[0];
if (s.bell && !m.on) { m.on = true; m.t0 = e.t; }
if (!s.bell) m.on = false;
const ring = m.on && e.t - m.t0 < 3 ? 1 : 0;
e.at(sx + 0.16 + ring * Math.sin(e.t * 22) * 0.07, -1.3 - ring * 0.32, 'ring');
