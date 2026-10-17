// the crowd as far as `crowd_outside` has come: each group shown as the key passes it (the earlier groups first), swaying
// a little, each in its own time; the lanterns lit with their group, brighter once the gas is lit
const L = e.lib, C = L.CROWD, a = e.anim, many = a.clamp(+e.state.crowd_outside || 0, 0, 1);
const gas = 0.4 + 0.6 * e.kit.light.gas(e.state.day);
for (let gi = 0; gi < C.groups; gi++) {
  const layer = e.layer(`g${gi}`);
  layer.alpha = a.clamp(many * C.groups - gi, 0, 1);
  layer.x = 0.05 * a.noise(e.t * 0.4 + gi * 1.7, gi);
  layer.y = 0.02 * a.noise(e.t * 0.6 + gi * 3.1, 20 + gi);
}
for (let i = 0; i < C.lanterns; i++) e.glow(`l${i}`, a.clamp(many * C.groups - L.crowdGroup(i, C.lanterns), 0, 1) * gas);
