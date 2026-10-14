// The white spitz and its red leash — one dog for every scene of the world (shpic.md says how to use it).
// paint(g, e): its layers, once per pose; live(e): in animate — breath, tail, head, legs, the leash to the hand.
const LEASH = '#a8322c';
const LAYERS = ['legs_far', 'body', 'legs_near', 'head', 'tail', 'leash'];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// a fluffy outline: an ellipse whose edge is a row of soft scallops
function fluff(g, cx, cy, rx, ry, n, color) {
  g.fillStyle = color;
  g.beginPath();
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2, b = ((i + 0.5) / n) * Math.PI * 2;
    const x = cx + Math.cos(a) * rx, y = cy + Math.sin(a) * ry;
    const qx = cx + Math.cos(b) * rx * 1.13, qy = cy + Math.sin(b) * ry * 1.13;
    if (i === 0) g.moveTo(x, y);
    else g.quadraticCurveTo(px, py, x, y);
    var px = qx, py = qy;
  }
  g.closePath();
  g.fill();
}

// the pose's numbers, side on, head to the right (x right, y down, metres from the feet's middle)
function pose(act) {
  if (act === 'lie') return { body: [0, -0.1, 0.2, 0.095], head: [0.22, -0.17], tail: [-0.17, -0.15], legs: false };
  if (act === 'sit') return { body: [-0.03, -0.17, 0.12, 0.14], head: [0.08, -0.36], tail: [-0.12, -0.08], legs: 'sit' };
  if (act === 'up') return { body: [0, -0.32, 0.12, 0.17], head: [0.07, -0.55], tail: [-0.1, -0.2], legs: 'up' };
  return { body: [0, -0.22, 0.17, 0.115], head: [0.18, -0.33], tail: [-0.15, -0.3], legs: 'stand' };
}

function paint(g, e) {
  const s = e.state, view = s.spitz_view || 'side', act = s.spitz_do || 'stand';
  const dir = Number(s.spitz_dir ?? 1) < 0 ? -1 : 1, old = Number(s.spitz_old) > 0.5;
  const fur = old ? '#ebe2cb' : '#f7f5f0', fur2 = old ? '#d9cfb4' : '#e6e4e8', dark = '#2a2422';
  if (view !== 'side' && view !== 'back') e.warn(`shpic: spitz_view "${view}" is not drawn (side, back)`);
  const P = pose(act);
  const X = x => x * dir;
  const leg = (gc, x, top, len) => { gc.fillStyle = fur2; gc.beginPath(); gc.ellipse(X(x), top + len / 2, 0.026, len / 2, 0, 0, Math.PI * 2); gc.fill(); };
  if (view === 'back') {
    // seen from behind: the rump a round ball of fur, the tail's ring on it, the ears over it
    const [cx, cy, , ry] = P.body, r = act === 'lie' ? 0.16 : 0.15;
    // (every layer paints something, whatever the pose: live() moves them all by name)
    e.layer('legs_far', { pivot: [0, cy] }, gl => { leg(gl, -0.07, Math.min(cy, -0.06), -Math.min(cy, -0.06)); leg(gl, 0.07, Math.min(cy, -0.06), -Math.min(cy, -0.06)); });
    e.layer('body', { pivot: [0, 0] }, gb => fluff(gb, cx, cy, r, act === 'lie' ? ry : r, 18, fur));
    e.layer('legs_near', {}, gl => { gl.fillStyle = fur2; for (const sx of [-1, 1]) { gl.beginPath(); gl.ellipse(sx * 0.07, -0.015, 0.035, 0.018, 0, 0, Math.PI * 2); gl.fill(); } });
    e.layer('head', { pivot: [0, cy - r * 0.6] }, gh => {
      fluff(gh, 0, cy - r * 0.95, 0.08, 0.075, 12, fur);
      gh.fillStyle = fur2;
      for (const sx of [-1, 1]) { gh.beginPath(); gh.moveTo(sx * 0.07, cy - r * 0.95 - 0.03); gh.lineTo(sx * 0.045, cy - r * 0.95 - 0.12); gh.lineTo(sx * 0.015, cy - r * 0.95 - 0.05); gh.closePath(); gh.fill(); }
      e.at(0, cy - r * 0.95);
    });
    e.layer('tail', { pivot: [0, cy - r * 0.2] }, gt => { fluff(gt, 0, cy - r * 0.45, 0.085, 0.07, 12, fur); fluff(gt, 0, cy - r * 0.45, 0.035, 0.028, 8, fur2); });
    e.at(0, cy - r * 0.3, 'collar');
    e.at(0, cy - r, 'back');
  } else {
    const [bx, by, brx, bry] = P.body, [hx, hy] = P.head, [tx, ty] = P.tail;
    e.layer('legs_far', { pivot: [0, by] }, gl => {
      if (P.legs === 'stand') { leg(gl, -0.07, by + 0.04, -by - 0.04); leg(gl, 0.13, by + 0.04, -by - 0.04); }
      else if (P.legs === 'up') leg(gl, -0.03, by + 0.1, -by - 0.1);
      else leg(gl, 0.1, by, -by);       // lying, sitting: a far leg tucked under, hidden by the body
    });
    e.layer('body', { pivot: [X(bx), 0] }, gb => {
      fluff(gb, X(bx), by, brx, bry, 22, fur);
      fluff(gb, X(bx + brx * 0.55), by - bry * 0.2, brx * 0.55, bry * 1.05, 14, fur);   // the ruff about the neck
    });
    e.layer('legs_near', { pivot: [0, by] }, gl => {
      if (P.legs === 'stand') { leg(gl, -0.11, by + 0.04, -by - 0.04); leg(gl, 0.09, by + 0.04, -by - 0.04); }
      if (P.legs === 'sit') { leg(gl, 0.06, by + 0.05, -by - 0.05); gl.fillStyle = fur; gl.beginPath(); gl.ellipse(X(-0.06), -0.04, 0.09, 0.045, 0, 0, Math.PI * 2); gl.fill(); }
      if (P.legs === 'up') { leg(gl, -0.06, by + 0.1, -by - 0.1); leg(gl, 0.1, by - 0.12, 0.12); }
      if (!P.legs) { gl.fillStyle = fur2; for (const x of [0.24, 0.31]) { gl.beginPath(); gl.ellipse(X(x), -0.022, 0.045, 0.022, 0, 0, Math.PI * 2); gl.fill(); } }   // lying: the front paws out
    });
    e.layer('head', { pivot: [X(hx - 0.05), hy + 0.05] }, gh => {
      // the ears, the round head, the fox's muzzle in profile, the nose, the eye
      gh.fillStyle = fur;
      for (const [ex, k] of [[-0.035, 0.9], [0.0, 1]]) {
        gh.beginPath(); gh.moveTo(X(hx + ex - 0.03), hy - 0.05); gh.lineTo(X(hx + ex + 0.005), hy - 0.05 - 0.085 * k); gh.lineTo(X(hx + ex + 0.035), hy - 0.045); gh.closePath(); gh.fill();
      }
      fluff(gh, X(hx), hy, 0.085, 0.078, 14, fur);
      gh.beginPath(); gh.moveTo(X(hx + 0.03), hy - 0.035); gh.quadraticCurveTo(X(hx + 0.1), hy - 0.02, X(hx + 0.13), hy + 0.004);
      gh.quadraticCurveTo(X(hx + 0.08), hy + 0.035, X(hx + 0.03), hy + 0.04); gh.closePath(); gh.fill();
      gh.fillStyle = dark;
      gh.beginPath(); gh.arc(X(hx + 0.128), hy + 0.004, 0.013, 0, Math.PI * 2); gh.fill();
      gh.beginPath(); gh.arc(X(hx + 0.04), hy - 0.018, 0.009, 0, Math.PI * 2); gh.fill();
      e.at(X(hx), hy);
    });
    e.layer('tail', { pivot: [X(tx), ty + 0.03] }, gt => {
      fluff(gt, X(tx + 0.02), ty - 0.06, 0.085, 0.075, 14, fur);
      fluff(gt, X(tx + 0.03), ty - 0.07, 0.035, 0.03, 8, fur2);
    });
    e.at(X(hx - 0.06), hy + 0.06, 'collar');
    e.at(X(bx), by - bry, 'back');
  }
  // the leash: a strap 1 m long from the collar along +x — live() turns and stretches it to the hand
  const c = view === 'back' ? [0, P.body[1] - 0.045] : [X(P.head[0] - 0.06), P.head[1] + 0.06];
  e.layer('leash', { pivot: c, box: [-2.6, -2.2, 2.6, 0.3] }, gl => {
    gl.fillStyle = LEASH;
    gl.fillRect(c[0], c[1] - 0.0135, 1, 0.027);
  });
}

function live(e) {
  const s = e.state, t = e.t, m = e.mem;
  const here = Number(s.spitz_here ?? 1) > 0.5;
  for (const n of LAYERS) e.layer(n).alpha = here ? 1 : 0;
  if (!here) return;
  const act = s.spitz_do || 'stand', old = Number(s.spitz_old) > 0.5, slow = old ? 0.6 : 1;
  const dir = Number(s.spitz_dir ?? 1) < 0 ? -1 : 1;
  m.ph ??= (e.id.length * 1.7) % 6;
  // breath; a trot's bob
  const moving = act === 'trot' || act === 'run';
  const k = act === 'run' ? 16 : 11;
  e.layer('body').scaleY = 1 + (act === 'lie' ? 0.02 : 0.012) * Math.sin(t * 2.2 * slow + m.ph);
  e.layer('body').y = moving ? -0.012 * Math.abs(Math.sin(t * k * slow)) : 0;
  // legs swing at a trot
  const sw = moving ? 0.45 * Math.sin(t * k * slow) : 0;
  e.layer('legs_near').rotate = sw * dir;
  e.layer('legs_far').rotate = -sw * dir;
  // the tail: quick wag when up and glad, a slow stir lying
  const wag = act === 'lie' ? 0.05 * Math.sin(t * 1.3 + m.ph) : act === 'growl' ? 0 : 0.2 * Math.sin(t * 9 * slow);
  e.layer('tail').rotate = wag;
  // the head: toward what it looks at (a little), a jerk on growl/bark, a slow nod lying
  let hr = act === 'lie' ? 0.04 * e.anim.noise(t * 0.3, 3) : 0;
  const look = s.spitz_look;
  if (look) {
    const h = e.point(e.id), p = e.point(look);
    if (h && p) hr += clamp(Math.atan2(p[1] - h[1], Math.abs(p[0] - h[0]) + 0.2) * 0.5, -0.35, 0.35) * dir;
  }
  if (act === 'bark' || act === 'growl') hr += (act === 'bark' ? -0.12 : -0.05) * Math.max(0, Math.sin(t * (act === 'bark' ? 7 : 14))) * dir;
  if (act === 'sniff') hr += 0.25 * dir + 0.03 * Math.sin(t * 13);
  e.layer('head').rotate = hr;
  // the leash: from the collar to the hand that holds it, or trailing on the ground behind
  const L = e.layer('leash'), ref = s.leash;
  const c = e.point(e.id + '#collar');
  let p = null;
  if (typeof ref === 'string' && ref !== 'none' && ref !== 'chair') p = e.point(ref);
  if (!c) { L.alpha = 0; return; }
  if (!p) p = [c[0] - dir * 1.1, 0];
  const dx = p[0] - c[0], dy = p[1] - c[1], len = Math.hypot(dx, dy);
  L.alpha = 1;
  L.rotate = Math.atan2(dy, dx);
  L.scaleX = Math.max(0.01, Math.min(2.4, len));
}

return { paint, live, LEASH };
