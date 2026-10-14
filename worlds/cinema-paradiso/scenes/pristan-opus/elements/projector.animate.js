// the reels turn while the beam is on; the tarp is drawn over by `cover`; its leading edge is where Toto's hands go
const m = e.mem, s = e.state;
m.ph = (m.ph || 0) + e.dt * 3.2 * (s.beam_on || 0);
e.layer('reel_f').rotate = m.ph; e.layer('reel_b').rotate = m.ph * 0.8;
const c = Math.max(0, Math.min(1, s.cover || 0)), t = e.layer('tarp');
t.scaleX = 0.16 + 0.84 * c; t.scaleY = 0.22 + 0.78 * c;
e.at(-0.6 + 1.2 * (0.16 + 0.84 * c), -0.95 - 1.0 * (0.22 + 0.78 * c), 'tarp');
