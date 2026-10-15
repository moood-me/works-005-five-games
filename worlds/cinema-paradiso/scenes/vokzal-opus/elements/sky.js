
// The sky all round: dawn of the past — pale blue above, a band of apricot low in the east-north-east where the sun
// is about to come; 1988's cool evening — lilac steel, the afterglow low in the west. Painted once per era.
const A = e.aspect, an = e.anim, now = e.state.era === 'now', H = 0.5;
const brg = d => A / 2 + d * Math.PI / 180;
const gr = g.createLinearGradient(0, -0.35, 0, H);
gr.addColorStop(0, now ? '#3a3e5c' : '#6f86b0'); gr.addColorStop(0.7, now ? '#6e6c88' : '#aebad0'); gr.addColorStop(1, now ? '#9a90a4' : '#d8d0d0');
g.fillStyle = gr; g.fillRect(-0.3, -0.35, A + 0.6, H + 0.36);
g.fillStyle = now ? '#545068' : '#9aa0b0'; g.fillRect(-0.3, H, A + 0.6, 1.25 - H);
// a glow low over the horizon: a soft ellipse (drawn again a full turn either side, so the ends meet)
const glow = (deg, width, color, height, alpha) => {
  for (const off of [-A, 0, A]) {
    const x = brg(deg) + off;
    g.save(); g.translate(x, H); g.scale(width, height);
    const rg = g.createRadialGradient(0, 0, 0, 0, 0, 1);
    rg.addColorStop(0, color); rg.addColorStop(1, 'rgba(0,0,0,0)');
    g.globalAlpha = alpha; g.fillStyle = rg; g.beginPath(); g.arc(0, 0, 1, Math.PI, 0); g.fill(); g.restore();
  }
  g.globalAlpha = 1;
};
if (now) glow(-95, 1.2, '#b08a98', 0.22, 0.8); else { glow(115, 1.6, '#f2c6a0', 0.32, 0.85); glow(115, 0.5, '#ffe0b8', 0.1, 0.7); }
g.fillStyle = now ? 'rgba(90,86,110,0.45)' : 'rgba(150,150,170,0.35)';
for (let i = 0; i < 12; i++) { const x = -0.3 + an.hash(i, 3) * (A + 0.6), y = -0.2 + an.hash(i, 4) * 0.5, w = 0.15 + an.hash(i, 5) * 0.4; g.beginPath(); g.ellipse(x, y, w, w * 0.12, 0, 0, Math.PI * 2); g.fill(); }
