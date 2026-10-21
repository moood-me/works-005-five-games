// The crest of a wave coming at the bow: a long wall of grey-green water, its back darker, lighter where it thins at
// the top, a white breaking crest along it and the spindrift torn off it (a layer drifting along). Its foot at the
// sea; it is placed by the script (`wave`: far ahead → under the bow, where it sinks under her as she rides it); its
// height by `wave_h` (the animate).
const L = e.lib;
const top = x => -4.2 - 2.2 * Math.exp(-((x / 26) ** 2)) - 0.8 * Math.sin(x * 0.11) - 0.5 * Math.sin(x * 0.27 + 1);
e.layer('body', { pivot: [0, 1] }, g => {
  const gr = g.createLinearGradient(0, -7.5, 0, 1);
  gr.addColorStop(0, '#7aa29a');
  gr.addColorStop(0.35, '#4c6e6a');
  gr.addColorStop(1, '#2c4446');
  g.fillStyle = gr;
  g.beginPath();
  g.moveTo(-70, 1.5);
  for (let x = -70; x <= 70; x += 2) g.lineTo(x, top(x) * Math.min(1, (70 - Math.abs(x)) / 25));
  g.lineTo(70, 1.5);
  g.closePath();
  g.fill();
  // the white crest breaking along its top
  g.fillStyle = '#e8eeec';
  g.beginPath();
  for (let x = -66; x <= 66; x += 2) g.lineTo(x, top(x) * Math.min(1, (70 - Math.abs(x)) / 25) - 0.15);
  for (let x = 66; x >= -66; x -= 2) g.lineTo(x, top(x) * Math.min(1, (70 - Math.abs(x)) / 25) + 0.5 + 0.3 * Math.sin(x * 0.7));
  g.closePath();
  g.fill();
  // streaks of foam down its face
  g.fillStyle = 'rgba(220,230,228,0.45)';
  for (let k = 0; k < 40; k++) {
    const x = -60 + 120 * e.rnd(), y = top(x) * 0.7 * e.rnd();
    g.fillRect(x, y, 0.4 + 2 * e.rnd(), 0.12);
  }
});
e.layer('drift', { pivot: [0, 1], drift: [3, 0], box: [-70, -9, 70, 0] }, g => {
  g.fillStyle = 'rgba(236,242,240,0.55)';
  for (let k = 0; k < 30; k++) {
    const x = -68 + 136 * (k / 30) + 3 * e.rnd(), y = top(x) * Math.min(1, (70 - Math.abs(x)) / 25) - 0.4 - 0.8 * e.rnd();
    g.beginPath();
    g.ellipse(x, y, 1.6 + 1.5 * e.rnd(), 0.3, 0, 0, Math.PI * 2);
    g.fill();
  }
});
e.at(0, -5, 'crest');
