const c = Math.max(0, Math.min(1, Number(e.state.curtain) || 0));
e.layer('cloth').alpha = c;
const sh = e.layer('shadows');
sh.alpha = c * Math.max(0, Math.min(1, Number(e.state.shadows) || 0));
sh.x = 0.015 * e.anim.noise(e.t * 0.4, 3);
