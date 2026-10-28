// The carriage wall and its big window: walnut, the window's rounded opening cut out (the land shows through it), a slim
// frame, the blind rolled up under the top, a brass rack above, two lamps on the wall — painted in daylight; their glass
// lit from within is a layer its shader adds as light as much as the lamps are on (its animate), and their light is the
// scene's (lights sconce_l, sconce_r, on at night). Points: window#window (the window's middle), window#pane_r and
// window#pane_l (where palms lie on the glass).
const L = e.lib, W = L.plan.win;
const wood = '#4a3426', brass = '#a88250';

// the wall, the window cut out of it
g.beginPath();
g.rect(-3.8, -2.8, 7.6, 2.8);
L.opening(g);
g.fillStyle = wood;
g.fill('evenodd');

// the panels: plain, a hair darker at their joints
g.fillStyle = 'rgba(0,0,0,0.25)';
for (const x of [-2.6, -1.25, 1.25, 2.6]) g.fillRect(x - 0.01, -2.8, 0.02, 2.8);
g.fillRect(-3.8, -W.sill + 0.02, 7.6, 0.02);

// the frame round the glass
g.beginPath();
L.opening(g);
g.strokeStyle = '#2a1c14';
g.lineWidth = 0.07;
g.stroke();
e.at(0, -(W.top + W.sill) / 2, 'window');
e.at(0.95, -1.32, 'pane_r');
e.at(0.53, -1.32, 'pane_l');

// the blind rolled up under the top, its cord and ring
g.fillStyle = '#3a2a20';
g.fillRect(-W.w / 2 + 0.14, -W.top + 0.03, W.w - 0.28, 0.045);
g.fillRect(-0.006, -W.top + 0.075, 0.012, 0.16);
g.strokeStyle = 'rgba(190,150,90,0.8)';
g.lineWidth = 0.008;
g.beginPath();
g.arc(0, -W.top + 0.27, 0.018, 0, Math.PI * 2);
g.stroke();

// the brass rack above the window
g.fillStyle = brass;
g.fillRect(-1.4, -2.42, 2.8, 0.02);
g.fillRect(-1.4, -2.36, 2.8, 0.012);
for (const x of [-1.3, 0, 1.3]) g.fillRect(x - 0.01, -2.42, 0.02, 0.1);

// the wall lamps: a brass arm and a tulip of glass
const tulip = (g, x) => {
  g.beginPath();
  g.moveTo(x - 0.05, -1.62);
  g.quadraticCurveTo(x - 0.08, -1.76, x - 0.06, -1.82);
  g.lineTo(x + 0.06, -1.82);
  g.quadraticCurveTo(x + 0.08, -1.76, x + 0.05, -1.62);
  g.closePath();
  g.fill();
};
const LAMPS = [[-1.1, 'sconce_l'], [1.1, 'sconce_r']];
for (const [x, name] of LAMPS) {
  g.fillStyle = brass;
  g.fillRect(x - 0.015, -1.62, 0.03, 0.12);
  g.fillRect(x - 0.05, -1.52, 0.1, 0.02);
  g.fillStyle = 'rgba(138,122,100,0.85)';
  tulip(g, x);
  e.light(x, -1.72, 0.7, '#ffcf8a', 0.7, name);
}
// their glass lit from within
e.layer('lights', {}, g => {
  g.fillStyle = '#fff0d0';
  for (const [x] of LAMPS) tulip(g, x);
});
