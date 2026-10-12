// The crowd outside on Pall Mall: heads, hats and umbrellas in the fog, lanterns held up among them — the street waiting
// with the club. Nobody comes in; only their lights. Painted once, whole, in its groups (lib.js CROWD) — each a layer the
// animate shows as `crowd_outside` comes to it, swaying a little in its own time; the lanterns' glows with them.
// In a London day's colours, each figure fading into the fog the farther it stands; the look on `day` makes the night.
const L = e.lib, C = L.CROWD, h = e.anim.hash, svet = e.kit.svet;
const facade = '#8e9599', low = '#c9ccc8';
const base = -L.plan.street;
const figure = (w, i) => {
  // a steady place and look for each
  const x = -34 + 34 * h(i, 1);
  const far = h(i, 2);
  const k = 1 - far * 0.35;
  const y = base - far * 1.4;
  w.save();
  w.translate(x, y);
  w.scale(k, k);
  w.fillStyle = svet.rgba(svet.mixc(svet.mixc(facade, '#06080b', 0.6), low, far * 0.6));
  const tall = 1.62 + 0.18 * h(i, 3);
  const wide = 0.26 + 0.08 * h(i, 6);
  w.beginPath();
  w.moveTo(-wide, 0);
  w.lineTo(-wide, -tall + 0.44);
  w.quadraticCurveTo(-wide + 0.02, -tall + 0.28, 0, -tall + 0.28);
  w.quadraticCurveTo(wide - 0.02, -tall + 0.28, wide, -tall + 0.44);
  w.lineTo(wide, 0);
  w.closePath();
  w.fill();
  w.beginPath();
  w.ellipse(0, -tall + 0.16, 0.09, 0.11, 0, 0, Math.PI * 2);
  w.fill();
  const hat = h(i, 4);
  if (hat < 0.45) w.fillRect(-0.09, -tall - 0.12, 0.18, 0.2);
  else if (hat < 0.75) {
    w.beginPath();
    w.ellipse(0, -tall + 0.06, 0.13, 0.08, 0, Math.PI, 0);
    w.fill();
  }
  if (hat < 0.75) w.fillRect(-0.15, -tall + 0.05, 0.3, 0.025);
  if (h(i, 5) < 0.12) {
    w.beginPath();
    w.moveTo(-0.55, -tall - 0.2);
    w.quadraticCurveTo(0, -tall - 0.75, 0.55, -tall - 0.2);
    w.closePath();
    w.fill();
  }
  w.restore();
};
// a lantern or a torch held up, warm in the fog: its glass, and its glow ("l<i>")
const lantern = (w, i) => {
  const x = -33 + 32 * h(i, 11);
  const y = base - 2.0 - 0.5 * h(i, 12);
  w.fillStyle = 'rgba(255,214,150,0.9)';
  w.beginPath();
  w.arc(x, y, 0.07, 0, Math.PI * 2);
  w.fill();
  e.light(x, y, 0.8, '#ffc27a', 0.35 * (0.6 + 0.4 * h(i, 13)), `l${i}`);
};
for (let gi = 0; gi < C.groups; gi++) {
  e.layer(`g${gi}`, { pivot: [-17, base] }, w => {
    for (let i = 0; i < C.people; i++) if (L.crowdGroup(i, C.people) === gi) figure(w, i);
    for (let i = 0; i < C.lanterns; i++) if (L.crowdGroup(i, C.lanterns) === gi) lantern(w, i);
  });
}
