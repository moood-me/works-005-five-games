// The door of No. 7, painted from its hinge (x 0 → its width): black, four plain panels, a brass knob and
// letter plate. The engine turns it on its hinge (place.facing: door_leaf, which script.js sets from `door`):
// it opens into the hall.
const D = e.lib.plan.door;
g.fillStyle = '#16181b';
g.fillRect(0, -D.h, D.w, D.h);
g.strokeStyle = 'rgba(255,255,255,0.07)';
g.lineWidth = 0.02;
for (const x of [0.12, D.w / 2 + 0.04]) {
  g.strokeRect(x, -D.h + 0.18, D.w / 2 - 0.16, D.h * 0.42);
  g.strokeRect(x, -D.h * 0.46, D.w / 2 - 0.16, D.h * 0.38);
}
g.fillStyle = '#b8964e';
g.beginPath();
g.arc(D.w - 0.12, -1.05, 0.035, 0, Math.PI * 2);
g.fill();
g.fillRect(D.w / 2 - 0.13, -1.12, 0.26, 0.05);
e.at(D.w / 2, -1.4);
e.at(D.w - 0.12, -1.05, 'handle');
