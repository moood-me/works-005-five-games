// The lane seen from above (x across, y toward the viewer; the plane's middle at distance 50): the road between the
// kerbs, the pavements to the house fronts, the cross street at 30…38. Winter — trodden snow, the sledges' runners
// worn into it, the pavements whiter; the thaw — brown slush and dark wet setts, puddles (the plane is a mirror by
// `puddles`), grey snow left along the walls.
const L = e.lib;
const season = L.seasonOf(e.state.season);
const Z = 50;                                    // the plane's middle
const y = z => Z - z;                            // lane distance → the plane's y
const thaw = season === 'thaw';
const rnd = () => e.rnd();
// everything: the road's colour
g.fillStyle = thaw ? '#6c675f' : '#dfe3ea';
g.fillRect(-30, -62, 60, 124);
// the pavements (the cross street's road between them), the kerbstones' line
g.fillStyle = thaw ? '#7c7a76' : '#eceff4';
for (const [x0, x1] of [[L.KERB_R, 30], [-30, L.KERB_L]]) {
  g.fillRect(x0, y(30), x1 - x0, 42);              // from behind the viewer to the cross street
  g.fillRect(x0, -62, x1 - x0, y(38) + 62);         // beyond it
}
g.fillStyle = thaw ? '#5d5d5f' : '#a9adb5';
for (const x of [L.KERB_R, L.KERB_L]) {
  g.fillRect(x - 0.06, y(30), 0.12, 42);
  g.fillRect(x - 0.06, -62, 0.12, y(38) + 62);
}
if (thaw) {
  // dark wet setts showing through, the slush in streaks, puddles; grey snow along the walls
  for (let i = 0; i < 900; i++) {
    g.fillStyle = `rgba(45,42,40,${0.15 + 0.2 * rnd()})`;
    g.fillRect(-4 + rnd() * 6, -62 + rnd() * 124, 0.3 + rnd() * 1.2, 0.2 + rnd() * 0.5);
  }
  for (let i = 0; i < 120; i++) {
    const cx = -3.2 + rnd() * 4.4, cy = -62 + rnd() * 124, r = 0.4 + rnd() * 1.4;
    g.fillStyle = 'rgba(40,46,56,0.75)';
    g.beginPath();
    g.ellipse(cx, cy, r, r * (0.4 + 0.4 * rnd()), rnd() * 3, 0, Math.PI * 2);
    g.fill();
  }
  g.fillStyle = '#a4a6a8';
  for (const x of [L.XR - 0.45, L.XL]) for (let i = 0; i < 160; i++) g.fillRect(x + rnd() * 0.4, -62 + rnd() * 124, 0.25 + rnd() * 0.3, 0.5 + rnd() * 1.6);
} else {
  // the runners' ruts, long and bluish; hoofprints between them; footprints on the pavements
  g.strokeStyle = 'rgba(120,132,152,0.35)';
  g.lineWidth = 0.07;
  for (const x of [-2.6, -1.9, -0.6, 0.1, 0.9]) {
    g.beginPath();
    g.moveTo(x, -62);
    for (let k = 0; k <= 40; k++) g.lineTo(x + Math.sin(k * 0.7 + x) * 0.08, -62 + k * 3.1);
    g.stroke();
  }
  for (let i = 0; i < 1400; i++) {
    g.fillStyle = `rgba(110,120,138,${0.08 + 0.12 * rnd()})`;
    g.fillRect(-3.2 + rnd() * 4.4, -62 + rnd() * 124, 0.12, 0.16);
  }
  for (let i = 0; i < 1600; i++) {
    const side = rnd() < 0.5;
    g.fillStyle = 'rgba(140,150,168,0.18)';
    g.fillRect(side ? L.KERB_R + 0.3 + rnd() * 1.8 : -5.1 + rnd() * 1.5, -62 + rnd() * 124, 0.1, 0.24);
  }
  // the soft heaps of shovelled snow along the kerbs
  g.fillStyle = '#f4f6f9';
  for (const x of [L.KERB_R + 0.1, L.KERB_L - 0.5]) for (let i = 0; i < 60; i++) g.fillRect(x, -62 + rnd() * 124, 0.35, 1 + rnd() * 2.5);
}
