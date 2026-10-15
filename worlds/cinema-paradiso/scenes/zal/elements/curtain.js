// The velvet curtain hanging on the hall's side of the side door (seen from the corridor: x from its north edge at the
// boy's side, 0, south along the wall to 2.0 — wider than the door, so it closes it but for a slit at the north
// jamb). As `peek` grows the boy pulls it: it gathers toward its south end (the layer `drape`, its folds bunching —
// animate), the hall opening behind. Its free edge at the boy's eye is the point `gap`. Gone in 1988. The element
// paints nothing but this layer: so the layer is the first (and only) sheet of its plane and is drawn solid — it
// hides what is behind it, people's lines too (a layer over a painting of its own plane is drawn blended). The rod:
// `curtain_rod`.
if (e.state.era === 'ruin') return;
const W = 2.0, H = 2.62;
e.layer('drape', { pivot: [W, 0] }, d => {
  d.fillStyle = '#7a2228'; d.fillRect(0, -H, W, H);
  for (let k = 0; k < 16; k++) {
    const x = k * W / 16;
    const gr = d.createLinearGradient(x, 0, x + W / 16, 0);
    gr.addColorStop(0, '#5e1a20'); gr.addColorStop(0.45, '#a8383e'); gr.addColorStop(1, '#5e1a20');
    d.fillStyle = gr;
    d.beginPath(); d.moveTo(x, -H); d.quadraticCurveTo(x + 0.03, -H / 2, x + 0.01, -0.02); d.lineTo(x + W / 16, -0.02); d.quadraticCurveTo(x + W / 16 + 0.02, -H / 2, x + W / 16, -H); d.closePath(); d.fill();
  }
  d.fillStyle = '#c8a050'; d.fillRect(0, -0.16, W, 0.04);            // a gold braid near the hem
  d.fillStyle = '#3a0f12'; d.fillRect(0, -0.1, W, 0.1);
});
e.at(0, -1.15, 'gap');
e.at(0, -1.15, 'edge');
