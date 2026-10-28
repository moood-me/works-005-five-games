// the beam's end rising and falling as the engine turns (as fast as the ship goes)
if (e.lib.shipOf(e.state) === 'general_grant') {
  const m = e.mem, v = e.lib.clamp01(e.state.speed);
  m.p = ((m.p ?? 0) + v * 0.9 * e.dt) % 1000;
  e.layer('beam').y = 0.45 * Math.sin(m.p * 2 * Math.PI);
}
