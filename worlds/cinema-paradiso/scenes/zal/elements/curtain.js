// The velvet curtain on the hall's side of the side door (seen from the corridor), 2 m wide: it hangs from its south
// end (the hinge, x 0: painted from it, x −2…0 running north) and closes the door but for a slit at the north jamb.
// As `peek` grows the boy pushes its free edge: the card swings into the hall about the hinge (`curtain_f`, the
// script's — a card turned by its place stays solid and hides what is behind it). Its free edge at the boy's eye is
// the point `gap`. Gone in 1988.
if (e.state.era === 'ruin') return;
const W = 2.0, H = 2.62;
g.fillStyle = '#7a2228'; g.fillRect(-W, -H, W, H);
for (let k = 0; k < 16; k++) {
  const x = -W + k * W / 16;
  const gr = g.createLinearGradient(x, 0, x + W / 16, 0);
  gr.addColorStop(0, '#5e1a20'); gr.addColorStop(0.45, '#a8383e'); gr.addColorStop(1, '#5e1a20');
  g.fillStyle = gr;
  g.beginPath(); g.moveTo(x, -H); g.quadraticCurveTo(x + 0.03, -H / 2, x + 0.01, -0.02); g.lineTo(x + W / 16, -0.02); g.quadraticCurveTo(x + W / 16 + 0.01, -H / 2, x + W / 16, -H); g.closePath(); g.fill();
}
g.fillStyle = '#c8a050'; g.fillRect(-W, -0.16, W, 0.04);            // a gold braid near the hem
g.fillStyle = '#3a0f12'; g.fillRect(-W, -0.1, W, 0.1);
e.at(-W, -1.15, 'gap');
e.at(-W, -1.15, 'edge');
