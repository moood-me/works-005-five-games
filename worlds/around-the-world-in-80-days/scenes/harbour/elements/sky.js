// The sky over the harbour, painted once at its three moments, each a layer over the one before — by day pale in the
// haze, in the evening red and gold, at night deep blue (its animate lets the evening and the night show as far as
// they are come). The sun — a layer of its own (white by day, red and low in the evening, its two looks), carried down
// toward the water on the right as the evening comes; the moon high on the right at night. Both marked (e.at: the
// scene's sunlight and moonlight shine from where they are) and glowing (e.light): their paths lie on the water.
const L = e.lib;
const w = e.aspect;
const band = (top, mid, low) => {
  const gr = g.createLinearGradient(0, -0.35, 0, 0.55);
  gr.addColorStop(0, top);
  gr.addColorStop(0.7, mid);
  gr.addColorStop(1, low);
  return gr;
};
const fill = (g, gr) => { g.fillStyle = gr; g.fillRect(-0.3, -0.35, w + 0.6, 1.6); };
fill(g, band('#9db2c4', '#d4dcde', '#eceee8'));
e.layer('evening', {}, g => fill(g, band('#5d5876', '#d89a78', '#f2c08a')));
e.layer('night', {}, g => fill(g, band('#0e1626', '#1e2a40', '#33405a')));
// the sun where it stands by day (the animate carries it down to where it stands in the evening)
const SX = w * 0.62, SY = 0.12;
e.layer('sun_day', {}, g => {
  L.glow(g, SX, SY, 0.5, '#fff6e4', 0.35, 0.55);
  g.fillStyle = '#fffaf0';
  g.beginPath();
  g.arc(SX, SY, 0.02, 0, Math.PI * 2);
  g.fill();
  e.light(SX, SY, 0.03, '#fff6e4', 1, 'sun_day');
  e.at(SX, SY, 'sun');
});
e.layer('sun_eve', {}, g => {
  L.glow(g, SX, SY, 0.5, '#ffb070', 0.35, 0.55);
  g.fillStyle = '#ffc888';
  g.beginPath();
  g.arc(SX, SY, 0.02, 0, Math.PI * 2);
  g.fill();
  e.light(SX, SY, 0.03, '#ffb070', 1, 'sun_eve');
});
const MX = w * 0.84, MY = 0.33;
e.layer('moon', {}, g => {
  L.glow(g, MX, MY, 0.14, '#c8d4ec', 0.25);
  g.fillStyle = '#eef0f2';
  g.beginPath();
  g.arc(MX, MY, 0.014, 0, Math.PI * 2);
  g.fill();
  e.light(MX, MY, 0.025, '#c8d4ec', 0.9, 'moon');
  e.at(MX, MY, 'moon');
});
