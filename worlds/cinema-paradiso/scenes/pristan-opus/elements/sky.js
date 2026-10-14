// The Sicilian sky all round (roam: x 0…2π, straight ahead — north, over the sea — at e.aspect/2).
// Painted once per hour and era: the warm night of the past, the dusk with its afterglow in the north-west, the cool
// lilac evening of 1988. The moon stands over the sea, a little right of the mole; far capes with a few village
// lights lie along the horizon. The stars are a layer the shader makes twinkle.
const S = e.state, A = e.aspect, H = 0.55, an = e.anim;
const now = S.era === 'now', dusk = S.hour < 0.84;
const bearing = deg => A / 2 + deg * Math.PI / 180;

const top = now ? '#141a2e' : dusk ? '#243362' : '#0b1534';
const mid = now ? '#2c3050' : dusk ? '#53608f' : '#18295a';
const low = now ? '#5e5a78' : dusk ? '#c49a95' : '#2e4a7c';
const gr = g.createLinearGradient(0, -0.35, 0, H);
gr.addColorStop(0, top); gr.addColorStop(0.62, mid); gr.addColorStop(1, low);
g.fillStyle = gr; g.fillRect(-0.3, -0.35, A + 0.6, H + 0.002);
g.fillStyle = now ? '#2a2c40' : '#1b2a48'; g.fillRect(-0.3, H, A + 0.6, 1.25 - H);

// the afterglow (dusk) low in the north-west, and a faint warmth of the town's sky behind (south) at night
const glow = (deg, width, color, height, alpha) => {
  const xc = bearing(deg), n = 90;
  for (let i = 0; i < n; i++) {
    const x0 = -0.3 + (A + 0.6) * i / n, w = (A + 0.6) / n + 0.002;
    let d = Math.abs(x0 + w / 2 - xc); d = Math.min(d, Math.abs(d - A), Math.abs(d + A));
    const k = Math.exp(-(d / width) * (d / width)) * alpha;
    if (k < 0.01) continue;
    const vg = g.createLinearGradient(0, H - height, 0, H);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, color);
    g.globalAlpha = k; g.fillStyle = vg; g.fillRect(x0, H - height, w, height);
  }
  g.globalAlpha = 1;
};
if (dusk) { glow(-50, 0.9, now ? '#9a7d90' : '#f0b183', 0.3, 0.85); glow(-50, 0.35, '#ffd0a0', 0.08, 0.6); }
else if (!now) glow(180, 1.2, '#3a4a78', 0.2, 0.5);
// a band of haze at the horizon
const hz = g.createLinearGradient(0, H - 0.04, 0, H);
hz.addColorStop(0, 'rgba(0,0,0,0)'); hz.addColorStop(1, now ? 'rgba(120,116,140,0.5)' : dusk ? 'rgba(220,180,170,0.45)' : 'rgba(80,110,160,0.45)');
g.fillStyle = hz; g.fillRect(-0.3, H - 0.04, A + 0.6, 0.04);

// the moon over the sea
const mx = bearing(7), my = H - (dusk ? 0.33 : now ? 0.23 : 0.27), mr = 0.022;
const halo = g.createRadialGradient(mx, my, mr, mx, my, mr * 5);
halo.addColorStop(0, dusk ? 'rgba(230,230,240,0.14)' : 'rgba(200,214,255,0.2)'); halo.addColorStop(1, 'rgba(200,214,255,0)');
g.fillStyle = halo; g.fillRect(mx - mr * 5, my - mr * 5, mr * 10, mr * 10);
const md = g.createRadialGradient(mx - mr * 0.3, my - mr * 0.3, mr * 0.1, mx, my, mr);
md.addColorStop(0, dusk ? '#f4efe4' : '#fffbef'); md.addColorStop(1, dusk ? '#d9d2c4' : '#e9e3d0');
g.fillStyle = md; g.beginPath(); g.arc(mx, my, mr, 0, Math.PI * 2); g.fill();
g.fillStyle = 'rgba(150,150,140,0.25)';
for (const [dx, dy, r] of [[-0.3, -0.2, 0.28], [0.25, 0.1, 0.22], [-0.05, 0.35, 0.18]]) { g.beginPath(); g.arc(mx + dx * mr, my + dy * mr, r * mr, 0, Math.PI * 2); g.fill(); }
e.at(mx, my, 'disc');
e.light(mx, my, 0.012, '#dfe6ff', dusk ? 0.25 : 0.4, 'halo');

// far capes: the coast to the east, a long low headland to the west; a few lights in the eastern villages
const ridge = (d0, d1, h, seed, color) => {
  g.fillStyle = color; g.beginPath(); g.moveTo(bearing(d0), H + 0.004);
  for (let d = d0; d <= d1; d += 1) {
    const u = (d - d0) / (d1 - d0), env = Math.sin(Math.PI * Math.min(1, u * 1.6)) * (1 - 0.6 * u);
    g.lineTo(bearing(d), H - h * env * (0.65 + 0.35 * (an.noise(d * 0.09, seed) * 0.5 + 0.5)));
  }
  g.lineTo(bearing(d1), H + 0.004); g.closePath(); g.fill();
};
ridge(28, 112, 0.045, 3, now ? '#34324a' : dusk ? '#5a5070' : '#1c2a4a');
ridge(48, 140, 0.026, 7, now ? '#2c2b3e' : dusk ? '#4a4260' : '#17233f');
ridge(-160, -58, 0.03, 11, now ? '#30304a' : dusk ? '#5e5272' : '#1a2848');
if (!dusk) for (let i = 0; i < 9; i++) {
  const d = 40 + i * 7 + an.hash(i, 4) * 5, y = H - 0.004 - an.hash(i, 5) * 0.012;
  e.light(bearing(d), y, 0.0035, now ? '#e8e0c8' : '#ffe2a8', 0.55, 'village' + i);
}

// the stars, twinkling in the shader
e.layer('stars', {}, s => {
  const n = now ? 260 : dusk ? 180 : 620;
  for (let i = 0; i < n; i++) {
    const x = -0.3 + an.hash(i, 21) * (A + 0.6), y = -0.35 + Math.pow(an.hash(i, 22), 1.4) * (H - 0.06 + 0.35);
    if (Math.hypot(x - mx, y - my) < 0.09) continue;
    const r = 0.0007 + Math.pow(an.hash(i, 23), 3) * 0.0022;
    s.fillStyle = an.hash(i, 24) < 0.2 ? '#ffe9cf' : an.hash(i, 24) < 0.5 ? '#dbe6ff' : '#ffffff';
    s.globalAlpha = 0.45 + an.hash(i, 25) * 0.55 - (y > H - 0.15 ? 0.3 : 0);
    s.beginPath(); s.arc(x, y, r, 0, Math.PI * 2); s.fill();
  }
});
