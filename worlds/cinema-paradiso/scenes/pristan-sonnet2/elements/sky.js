// night sky over the sea: deep blue, cold moon in the north, stars
const A = e.aspect;
const gr = g.createLinearGradient(0, -0.35, 0, 0.5);
gr.addColorStop(0, '#070c24'); gr.addColorStop(0.6, '#142349'); gr.addColorStop(1, '#2f4577');
g.fillStyle = gr; g.fillRect(-0.3, -0.35, A + 0.6, 0.9);
g.fillStyle = '#2f4577'; g.fillRect(-0.3, 0.5, A + 0.6, 0.8);
for (let i = 0; i < 420; i++) {
  const x = -0.2 + e.rnd() * (A + 0.4), y = -0.3 + e.rnd() * 0.75;
  g.globalAlpha = 0.25 + e.rnd() * 0.6; g.fillStyle = '#dfe6ff';
  g.beginPath(); g.arc(x, y, 0.0009 + e.rnd() * 0.0016, 0, 7); g.fill();
}
g.globalAlpha = 1;
const mx = A / 2 + 0.42, my = 0.17;
const halo = g.createRadialGradient(mx, my, 0.02, mx, my, 0.28);
halo.addColorStop(0, 'rgba(190,205,255,0.55)'); halo.addColorStop(1, 'rgba(190,205,255,0)');
g.fillStyle = halo; g.fillRect(mx - 0.3, my - 0.3, 0.6, 0.6);
g.fillStyle = '#e9eeff'; g.beginPath(); g.arc(mx, my, 0.04, 0, 7); g.fill();
g.fillStyle = 'rgba(150,165,205,0.5)';
g.beginPath(); g.arc(mx - 0.012, my - 0.008, 0.009, 0, 7); g.fill();
g.beginPath(); g.arc(mx + 0.014, my + 0.012, 0.006, 0, 7); g.fill();
e.at(mx, my, 'disc');
e.light(mx, my, 0.3, '#b8c8f0', 0.7);
