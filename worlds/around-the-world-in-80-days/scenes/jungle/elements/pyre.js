// The pyre on the clearing: sandalwood stacked in crossed courses — long logs lying along it, the cut ends of those laid
// across them —, no two alike (thick and thin, pale and dark, a little out of line), brushwood pushed in between,
// marigold garlands along its top. Lit (`pyre_fire`), it burns: its tongues of fire are the elements pyre_fire and
// pyre_fire_near, its embers particles (pyre_embers) from its top (`pyre#flames`), its light the scene's (lights: pyre,
// of its e.light `fire`), its smoke the particles `smoke`; the heart of the stack glows between the logs (a layer its
// shader lights as the fire is).
const h = e.anim.hash, COURSES = 6, STEP = 0.24;
const WOOD = ['#7a6248', '#6a543c', '#84694a', '#5e4a36', '#735a40'];
const wood = n => WOOD[Math.floor(h(n, 5) * WOOD.length)];
// a log lying along the stack, seen from its side: from x0 to x1, its middle at y, r thick; its bark in long streaks, a
// knot or two, its ends cut a little aslant
const lying = (x0, x1, y, r, n) => {
  g.fillStyle = wood(n);
  g.beginPath();
  g.moveTo(x0 + 0.03, y - r);
  g.lineTo(x1 - 0.02, y - r * (0.9 + 0.1 * h(n, 6)));
  g.quadraticCurveTo(x1 + 0.03, y, x1 - 0.03, y + r);
  g.lineTo(x0 + 0.02, y + r * (0.9 + 0.1 * h(n, 7)));
  g.quadraticCurveTo(x0 - 0.03, y, x0 + 0.03, y - r);
  g.fill();
  g.strokeStyle = 'rgba(40,28,18,0.3)';
  g.lineWidth = 0.012;
  for (let k = 0; k < 3; k++) {
    const yy = y - r * 0.6 + r * 1.2 * h(n * 3 + k, 8), a = x0 + (x1 - x0) * 0.6 * h(n * 3 + k, 9);
    g.beginPath();
    g.moveTo(a, yy);
    g.lineTo(a + (x1 - x0) * (0.2 + 0.2 * h(n * 3 + k, 10)), yy + 0.01);
    g.stroke();
  }
  g.fillStyle = 'rgba(40,28,18,0.45)';
  g.beginPath();
  g.ellipse(x0 + (x1 - x0) * (0.2 + 0.6 * h(n, 11)), y + r * 0.2, 0.03, 0.018, 0, 0, Math.PI * 2);
  g.fill();
};
// a log laid across, its cut end toward us: the bark's ring, the pale heartwood, its rings and a crack
const end = (x, y, r, n) => {
  g.fillStyle = wood(n);
  g.beginPath();
  g.ellipse(x, y, r, r * (0.9 + 0.1 * h(n, 12)), 0, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = '#b89a70';
  g.beginPath();
  g.ellipse(x, y, r * 0.8, r * 0.74, 0, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = 'rgba(96,68,40,0.5)';
  g.lineWidth = 0.008;
  for (const k of [0.3, 0.55]) {
    g.beginPath();
    g.ellipse(x + r * 0.08, y, r * k, r * k * 0.9, 0, 0, Math.PI * 2);
    g.stroke();
  }
  const a = h(n, 13) * Math.PI * 2;
  g.beginPath();
  g.moveTo(x + r * 0.08, y);
  g.lineTo(x + Math.cos(a) * r * 0.75, y + Math.sin(a) * r * 0.7);
  g.stroke();
};
// what lies in each course, bottom to top — every course a little other than the one under it: [x0, x1, r] of the logs
// along it, or [x, r] of the ends across it
for (let k = 0; k < COURSES; k++) {
  const y = -STEP * (k + 0.5);
  if (k % 2) {
    // (the ends: between ten and twelve, thick and thin, shouldering each other)
    let x = -1.42 + 0.06 * h(k, 21);
    for (let i = 0; x < 1.38; i++) {
      const r = 0.085 + 0.035 * h(k * 31 + i, 22);
      end(x + r, y + (STEP / 2 - r), r, k * 31 + i);
      x += 2 * r + 0.012 * h(k * 31 + i, 23);
    }
  } else {
    // (two or three long logs end to end, their joints never one over another; the top course thinner)
    const cut = [-1.62 + 0.08 * h(k, 24), -0.5 + 1.0 * h(k, 25), 1.58 + 0.1 * h(k, 26)];
    for (let i = 0; i < 2; i++) {
      const r = STEP / 2 - 0.004 - 0.02 * h(k * 7 + i, 27);
      lying(cut[i] + 0.015, cut[i + 1] - 0.015, y + (STEP / 2 - r), r, k * 7 + i);
    }
  }
}
// brushwood pushed in between the courses, its ends sticking out either side
g.strokeStyle = '#4c3a28';
g.lineCap = 'round';
for (let i = 0; i < 22; i++) {
  const side = i % 2 ? 1 : -1, y = -STEP * (1 + Math.floor(h(i, 31) * (COURSES - 1))) + 0.01, len = 0.15 + 0.3 * h(i, 32);
  const x0 = side * (1.2 + 0.25 * h(i, 33));
  g.lineWidth = 0.012 + 0.014 * h(i, 34);
  g.beginPath();
  g.moveTo(x0, y);
  g.lineTo(x0 + side * len, y - 0.1 * h(i, 35) + 0.03);
  g.stroke();
}
// garlands of marigolds hanging along its top
g.fillStyle = '#d8902c';
for (let j = 0; j < 4; j++) {
  for (let k = 0; k <= 10; k++) {
    const u = k / 10;
    g.beginPath();
    g.arc(-1.5 + 0.75 * j + 0.75 * u, -1.42 + 0.22 * Math.sin(Math.PI * u), 0.045, 0, Math.PI * 2);
    g.fill();
  }
}
// the fire's heat between the logs: thin seams of glow along the courses' joints, brightest at the top
e.layer('heat', {}, gl => {
  for (let k = 0; k < COURSES; k++) {
    const y = -STEP * (k + 1) + 0.005, a = 0.25 + 0.12 * k;
    gl.fillStyle = `rgba(255,150,60,${a})`;
    for (let x = -1.5; x < 1.5; x += 0.3) gl.fillRect(x + 0.06 * h(k * 13 + x * 10, 3), y, 0.1 + 0.1 * h(k * 17 + x * 10, 4), 0.025);
  }
});
// the fire's light from the middle of its flames; where they stand (flames), where their smoke leaves them (smoke)
e.light(0, -2.4, 3.2, '#ff9040', 0.6, 'fire');
e.at(0, -1.45, 'flames');
e.at(0, -2.9, 'smoke');
e.at(0, -1.2, 'pyre');
