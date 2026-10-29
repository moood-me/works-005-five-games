// Her window upstairs — the one the piano is heard behind: lit (`window` 1 — a warm lamp behind a muslin curtain, a
// shadow of a palm in a pot) or dark (0). Its light is the scene's `window_l`.
const lit = Number(e.state.window) > 0.5;
g.fillStyle = '#e4e2dc'; g.fillRect(-0.58, -4.68, 1.16, 1.36);
if (lit) {
  const gr = g.createLinearGradient(0, -4.6, 0, -3.4); gr.addColorStop(0, '#ffe0a8'); gr.addColorStop(1, '#f0b870');
  g.fillStyle = gr; g.fillRect(-0.5, -4.6, 1.0, 1.2);
  g.fillStyle = 'rgba(250,240,220,0.55)'; g.fillRect(-0.5, -4.6, 0.32, 1.2); g.fillRect(0.18, -4.6, 0.32, 1.2);
  g.fillStyle = 'rgba(90,70,50,0.45)'; g.beginPath(); g.ellipse(0.05, -3.62, 0.14, 0.2, 0, 0, Math.PI * 2); g.fill();
  e.light(0, -4.0, 0.6, '#ffd08a', 0.8, 'pane');
} else {
  g.fillStyle = '#2a2c34'; g.fillRect(-0.5, -4.6, 1.0, 1.2);
  e.light(0, -4.0, 0.01, '#ffd08a', 0, 'pane');
}
g.fillStyle = '#e4e2dc'; g.fillRect(-0.025, -4.6, 0.05, 1.2); g.fillRect(-0.5, -4.12, 1.0, 0.04);
