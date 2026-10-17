// The sky over the sea: by day clear and high with a few flat clouds drifting; the dawn's rose and gold over it, the
// night's deep blue with stars, the fog's grey — layers its animate shows as far as `dawn`, `night`, `fog` are come.
// The dawn's sun low to starboard ahead (sky#sun: the dawn's light comes from it), the moon to starboard (sky#moon: the
// night's light, and its path on the sea).
const L = e.lib, w = e.aspect;
const band = (stops) => {
  const gr = g.createLinearGradient(0, -0.35, 0, 0.47);
  stops.forEach(([o, c]) => gr.addColorStop(o, c));
  return gr;
};
const fill = (g, gr) => { g.fillStyle = gr; g.fillRect(-0.3, -0.35, w + 0.6, 1.6); };
fill(g, band([[0, '#5f8fbe'], [0.55, '#9cc0dc'], [0.92, '#d8e8ee'], [1, '#e8f0f0']]));
// flat clouds, drifting slowly aft
e.layer('clouds', { drift: [-0.0025, 0], box: [-0.3, -0.35, w + 0.3, 0.46] }, g => {
  for (let i = 0; i < 9; i++) {
    const x = -0.2 + ((w + 0.4) * i) / 9 + 0.08 * L.clamp01(e.rnd()), y = 0.08 + 0.26 * e.rnd(), s = 0.05 + 0.07 * e.rnd();
    g.fillStyle = L.rgba(L.mixc('#f4f6f6', '#d4dce4', y * 2.2), 0.92);
    g.beginPath();
    g.ellipse(x, y, s * 3.2, s * 0.55, 0, 0, Math.PI * 2);
    g.ellipse(x - s * 1.2, y - s * 0.25, s * 1.5, s * 0.7, 0, 0, Math.PI * 2);
    g.ellipse(x + s * 1.1, y - s * 0.35, s * 1.3, s * 0.8, 0, 0, Math.PI * 2);
    g.fill();
  }
});
e.layer('dawn', {}, g => {
  fill(g, band([[0, '#53608e'], [0.5, '#c48ea0'], [0.84, '#f2b48e'], [1, '#ffd8a8']]));
  for (let i = 0; i < 6; i++) {
    const x = -0.1 + ((w + 0.2) * i) / 6 + 0.1 * e.rnd(), y = 0.18 + 0.2 * e.rnd(), s = 0.05 + 0.05 * e.rnd();
    g.fillStyle = L.rgba(L.mixc('#e89a8c', '#ffc898', y * 2), 0.85);
    g.beginPath();
    g.ellipse(x, y, s * 4, s * 0.35, 0, 0, Math.PI * 2);
    g.fill();
  }
});
e.layer('night', {}, g => {
  fill(g, band([[0, '#0b1326'], [0.6, '#1c2a48'], [1, '#34466a']]));
  g.fillStyle = '#e8ecf4';
  for (let i = 0; i < 240; i++) {
    const x = -0.3 + (w + 0.6) * e.rnd(), y = -0.35 + 0.72 * e.rnd() ** 1.4, r = 0.0007 + 0.0016 * e.rnd() ** 3;
    g.globalAlpha = 0.4 + 0.6 * e.rnd();
    g.beginPath();
    g.arc(x, y, r, 0, Math.PI * 2);
    g.fill();
  }
  g.globalAlpha = 1;
});
e.layer('fog', {}, g => fill(g, band([[0, '#b4b8b8'], [0.7, '#cacbc6'], [1, '#d6d6d0']])));
// the dawn's sun, low to starboard ahead
const SX = w * 0.8, SY = 0.36;
e.layer('sun', {}, g => {
  L.glow(g, SX, SY, 0.45, '#ffd2a0', 0.5, 0.5);
  g.fillStyle = '#fff0d0';
  g.beginPath();
  g.arc(SX, SY, 0.022, 0, Math.PI * 2);
  g.fill();
  e.light(SX, SY, 0.035, '#ffd0a0', 1, 'sun');
  e.at(SX, SY, 'sun');
});
// the moon, to starboard, over the people at the rail
const MX = w * 0.7, MY = 0.2;
e.layer('moon', {}, g => {
  L.glow(g, MX, MY, 0.16, '#c8d4ec', 0.3);
  g.fillStyle = '#f2f2ee';
  g.beginPath();
  g.arc(MX, MY, 0.02, 0, Math.PI * 2);
  g.fill();
  e.light(MX, MY, 0.03, '#d0dcf4', 1, 'moon');
  e.at(MX, MY, 'moon');
});
