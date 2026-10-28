// The winter dusk over the field: deep blue above, a cold lilac glow low in the west (left), the night as a layer
// that comes over it by `night` (animate), a few stars in it. Screen heights; the horizon at 0.45.
const A = e.aspect;
const x0 = -0.3;
const w = A + 0.6;

const dusk = g.createLinearGradient(0, -0.35, 0, 0.47);
dusk.addColorStop(0, '#16203a');
dusk.addColorStop(0.35, '#26345a');
dusk.addColorStop(0.7, '#4b5a86');
dusk.addColorStop(0.9, '#7f84a6');
dusk.addColorStop(1, '#a297aa');
g.fillStyle = dusk;
g.fillRect(x0, -0.35, w, 1.6);

// the last of the light, low on the left, soft
const glow = g.createRadialGradient(A * 0.18, 0.47, 0, A * 0.18, 0.47, 0.55);
glow.addColorStop(0, 'rgba(196,170,180,0.55)');
glow.addColorStop(0.5, 'rgba(150,140,170,0.22)');
glow.addColorStop(1, 'rgba(120,120,160,0)');
g.fillStyle = glow;
g.fillRect(x0, -0.1, w, 0.6);

e.layer('night', {}, n => {
  const gr = n.createLinearGradient(0, -0.35, 0, 0.47);
  gr.addColorStop(0, '#070b16');
  gr.addColorStop(0.5, '#0e1529');
  gr.addColorStop(0.85, '#1f2945');
  gr.addColorStop(1, '#3a4262');
  n.fillStyle = gr;
  n.fillRect(x0, -0.35, w, 1.6);
});

e.layer('stars', {}, s => {
  for (let i = 0; i < 140; i++) {
    const x = x0 + e.rnd() * w;
    const y = -0.33 + e.rnd() * e.rnd() * 0.7;
    const r = 0.0007 + e.rnd() * 0.0011;
    s.fillStyle = e.rnd() < 0.2 ? '#ffe9cf' : '#dfe8ff';
    s.beginPath();
    s.arc(x, y, r, 0, Math.PI * 2);
    s.fill();
  }
});
