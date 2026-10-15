// The sky over the town, seen only through the hole in the ruined roof (1988, a grey-lilac evening); in the old
// hall the roof is whole and nothing of it shows. Painted all round (roam), plain, a few torn clouds.
const A = e.aspect, an = e.anim;
const gr = g.createLinearGradient(0, -0.35, 0, 1.25);
gr.addColorStop(0, '#5d6584'); gr.addColorStop(0.5, '#8d90a8'); gr.addColorStop(1, '#b4adb8');
g.fillStyle = gr; g.fillRect(-0.3, -0.35, A + 0.6, 1.6);
g.fillStyle = 'rgba(70,74,98,0.35)';
for (let i = 0; i < 14; i++) {
  const x = -0.3 + an.hash(i, 3) * (A + 0.6), y = -0.3 + an.hash(i, 4) * 0.6, w = 0.2 + an.hash(i, 5) * 0.5;
  g.beginPath(); g.ellipse(x, y, w, w * 0.18, 0, 0, Math.PI * 2); g.fill();
}
