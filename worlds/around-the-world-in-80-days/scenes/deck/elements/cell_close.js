// Insert: the bench of the custom-house cell, close, from above — the planks of the bench, Fogg's knees in dark
// trousers and his hands lying on them, his watch open on the bench beside him (its hands — layers, turned by the
// animate as `cell_time` goes: 11:40 → 14:33); the shadow of the window's bars across it all (layer `bars`, moved by
// `cell_time`: the sun going round).
const L = e.lib, w = e.aspect;
// the floor, the bench across the frame
L.rect(g, 0, 0, w, 1, '#8c8072');
g.fillStyle = '#7a6e62';
for (let x = 0.05; x < w; x += 0.16) g.fillRect(x, 0, 0.006, 1);
L.rect(g, 0, 0.3, w, 0.42, '#9a7a58');
g.fillStyle = '#7e6044';
for (const y of [0.44, 0.58]) g.fillRect(0, y, w, 0.006);
L.rect(g, 0, 0.72, w, 0.03, '#5e4632');
// his knees and thighs from above, his hands on them
for (const x of [0.55, 0.86]) {
  g.fillStyle = '#26282e';
  g.fillRect(x - 0.12, -0.05, 0.24, 0.52);
  g.beginPath();
  g.ellipse(x, 0.47, 0.12, 0.1, 0, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = '#d8b496';
  g.beginPath();
  g.ellipse(x + 0.01, 0.42, 0.075, 0.1, 0, 0, Math.PI * 2);
  g.fill();
  L.rect(g, x - 0.075, 0.28, 0.15, 0.07, '#e6e1d6');
}
// the watch, open on the bench: its lid, the case, the dial
const W = [1.32, 0.52];
g.fillStyle = '#c8a050';
g.beginPath();
g.arc(W[0] + 0.13, W[1] - 0.05, 0.075, 0, Math.PI * 2);
g.fill();
g.beginPath();
g.arc(W[0], W[1], 0.085, 0, Math.PI * 2);
g.fill();
g.fillStyle = '#f4efe2';
g.beginPath();
g.arc(W[0], W[1], 0.07, 0, Math.PI * 2);
g.fill();
g.fillStyle = '#2a2a2a';
for (let k = 0; k < 12; k++) { const a = (k * Math.PI) / 6; g.fillRect(W[0] + Math.cos(a) * 0.058 - 0.003, W[1] + Math.sin(a) * 0.058 - 0.003, 0.006, 0.006); }
L.line(g, [[W[0] - 0.085, W[1] - 0.02], [W[0] - 0.3, W[1] - 0.1]], '#c8a050', 0.006);
e.layer('hour', { pivot: W }, g => L.rect(g, W[0] - 0.004, W[1] - 0.035, 0.008, 0.035, '#1a1a1a'));
e.layer('minute', { pivot: W }, g => L.rect(g, W[0] - 0.003, W[1] - 0.055, 0.006, 0.055, '#1a1a1a'));
e.at(W[0], W[1], 'watch');
// the bars' shadow: slanting bands across the frame (painted wider than it, to move)
e.layer('bars', { blend: 'multiply', box: [-1, 0, w + 1, 1] }, g => {
  L.rect(g, -1, 0, w + 2, 1, '#ffffff');
  g.fillStyle = '#8a8478';
  for (let x = -1.2; x < w + 1; x += 0.32) {
    g.beginPath();
    g.moveTo(x, 0);
    g.lineTo(x + 0.06, 0);
    g.lineTo(x + 0.26, 1);
    g.lineTo(x + 0.2, 1);
    g.closePath();
    g.fill();
  }
});
