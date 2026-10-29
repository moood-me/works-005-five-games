// The white spitz and its red leash — one dog for every scene of the world (spitz.md says how to use it).
// paint(g, e): its layers, once per view and pose, always head to the right; live(e): in animate — the way it faces
// (a mirror of the layers, no repainting), breath, tail, head, legs by its speed, the leash sagging to the hand.
const LEASH = '#a8322c';
const BODY = ['legs_far', 'body', 'legs_near', 'head', 'tail'];
const STRAPS = ['leash0', 'leash1', 'leash2', 'leash3'];
const BOX = [-0.5, -0.8, 0.5, 0.12];            // every layer of the dog's own (the element's box is the leash's)
const STRAP_BOX = [-0.02, -0.03, 1.02, 0.03];   // a strap: 1 m along +x from its pivot (0, 0)
const LENGTH = 2;                                // the leash, m
const W = 0.027;                                 // its width: wider than truth, or it is thinner than a pixel far off
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const num = (v, d = 0) => (Number.isFinite(Number(v)) && v !== null && v !== '' ? Number(v) : d);

// a fluffy outline: an ellipse whose edge is a row of soft scallops
function fluff(g, cx, cy, rx, ry, n, color) {
  g.fillStyle = color;
  g.beginPath();
  let px = 0, py = 0;
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2, b = ((i + 0.5) / n) * Math.PI * 2;
    const x = cx + Math.cos(a) * rx, y = cy + Math.sin(a) * ry;
    if (i === 0) g.moveTo(x, y);
    else g.quadraticCurveTo(px, py, x, y);
    px = cx + Math.cos(b) * rx * 1.13; py = cy + Math.sin(b) * ry * 1.13;
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

// A view's geometry, head to the right: where its layers turn (pivots) and its points. `side` — side on; `front3q` —
// three-quarters toward us (the length foreshortened, the muzzle short, both eyes); `back` — from behind.
function shape(view, act) {
  const P = pose(act);
  if (view === 'back') {
    const cy = P.body[1], r = act === 'lie' ? 0.16 : 0.15, hy = cy - r * 0.95;
    return { view, P, r, cy, head: [0, hy], collar: [0, cy - r * 0.3], back: [0, cy - r],
      pivot: { legs_far: [0, cy], body: [0, 0], legs_near: [0, 0], head: [0, cy - r * 0.6], tail: [0, cy - r * 0.2] } };
  }
  const k = view === 'front3q' ? 0.62 : 1;
  const [bx0, by, brx, bry] = P.body, [hx0, hy] = P.head, [tx0, ty] = P.tail;
  const bx = bx0 * k, hx = hx0 * k, tx = tx0 * k;
  return { view, P, k, bx, by, brx: brx * (k < 1 ? 0.78 : 1), bry, hx, hy, tx, ty,
    head: [hx, hy], collar: [hx - 0.06 * k, hy + 0.06], back: [bx, by - bry],
    pivot: { legs_far: [0, by], body: [bx, 0], legs_near: [0, by], head: [hx - 0.05 * k, hy + 0.05], tail: [tx, ty + 0.03] } };
}

const VIEWS = ['side', 'back', 'front3q'];
const viewOf = (e, v) => {
  if (v == null || v === '') return 'side';
  if (!VIEWS.includes(v)) { e.warn(`spitz: spitz_view "${v}" is not one of side, back, front3q`); return 'side'; }
  return v;
};

function paint(g, e) {
  const s = e.state, view = viewOf(e, s.spitz_view), act = s.spitz_do || 'stand';
  const old = num(s.spitz_old) > 0.5;
  const fur = old ? '#ebe2cb' : '#f7f5f0', fur2 = old ? '#d9cfb4' : '#e6e4e8', dark = '#2a2422';
  const G = shape(view, act), P = G.P;
  const leg = (gc, x, top, len) => { gc.fillStyle = fur2; gc.beginPath(); gc.ellipse(x, top + len / 2, 0.026, len / 2, 0, 0, Math.PI * 2); gc.fill(); };
  const L = (name, gc) => e.layer(name, { pivot: G.pivot[name], box: BOX }, gc);
  if (view === 'back') {
    // seen from behind: the rump a round ball of fur, the tail's ring on it, the ears over it
    const { cy, r } = G, ry = P.body[3];
    // (every layer paints something, whatever the pose: live() moves them all by name)
    L('legs_far', gl => { leg(gl, -0.07, Math.min(cy, -0.06), -Math.min(cy, -0.06)); leg(gl, 0.07, Math.min(cy, -0.06), -Math.min(cy, -0.06)); });
    L('body', gb => fluff(gb, 0, cy, r, act === 'lie' ? ry : r, 18, fur));
    L('legs_near', gl => { gl.fillStyle = fur2; for (const sx of [-1, 1]) { gl.beginPath(); gl.ellipse(sx * 0.07, -0.015, 0.035, 0.018, 0, 0, Math.PI * 2); gl.fill(); } });
    L('head', gh => {
      fluff(gh, 0, G.head[1], 0.08, 0.075, 12, fur);
      gh.fillStyle = fur2;
      for (const sx of [-1, 1]) { gh.beginPath(); gh.moveTo(sx * 0.07, G.head[1] - 0.03); gh.lineTo(sx * 0.045, G.head[1] - 0.12); gh.lineTo(sx * 0.015, G.head[1] - 0.05); gh.closePath(); gh.fill(); }
    });
    L('tail', gt => { fluff(gt, 0, cy - r * 0.45, 0.085, 0.07, 12, fur); fluff(gt, 0, cy - r * 0.45, 0.035, 0.028, 8, fur2); });
  } else {
    const { k, bx, by, brx, bry, hx, hy, tx, ty } = G, q = k < 1;
    // three-quarters: the tail's curl stands behind the body (painted first); side on — over the rump
    const tail = () => L('tail', gt => {
      fluff(gt, tx + 0.02 * k, ty - 0.06, 0.085, 0.075, 14, fur);
      fluff(gt, tx + 0.03 * k, ty - 0.07, 0.035, 0.03, 8, fur2);
    });
    if (q) tail();
    L('legs_far', gl => {
      if (P.legs === 'stand') { leg(gl, -0.07 * k, by + 0.04, -by - 0.04); leg(gl, 0.13 * k, by + 0.04, -by - 0.04); }
      else if (P.legs === 'up') leg(gl, -0.03 * k, by + 0.1, -by - 0.1);
      else leg(gl, 0.1 * k, by, -by);       // lying, sitting: a far leg tucked under, hidden by the body
    });
    L('body', gb => {
      fluff(gb, bx, by, brx, bry, 22, fur);
      // the ruff about the neck — fuller seen three-quarters, the chest toward us
      fluff(gb, bx + brx * 0.55, by - bry * 0.2, brx * (q ? 0.75 : 0.55), bry * (q ? 1.15 : 1.05), 14, fur);
    });
    L('legs_near', gl => {
      if (P.legs === 'stand') { leg(gl, -0.11 * k, by + 0.04, -by - 0.04); leg(gl, 0.09 * k, by + 0.04, -by - 0.04); }
      if (P.legs === 'sit') { leg(gl, 0.06 * k, by + 0.05, -by - 0.05); gl.fillStyle = fur; gl.beginPath(); gl.ellipse(-0.06 * k, -0.04, 0.09 * k, 0.045, 0, 0, Math.PI * 2); gl.fill(); }
      if (P.legs === 'up') { leg(gl, -0.06 * k, by + 0.1, -by - 0.1); leg(gl, 0.1 * k, by - 0.12, 0.12); }
      if (!P.legs) { gl.fillStyle = fur2; for (const x of [0.24, 0.31]) { gl.beginPath(); gl.ellipse(x * k, -0.022, 0.045, 0.022, 0, 0, Math.PI * 2); gl.fill(); } }   // lying: the front paws out
    });
    L('head', gh => {
      // the ears, the round head, the fox's muzzle (in profile; three-quarters — short), the nose, the eyes
      gh.fillStyle = fur;
      const ears = q ? [[-0.05, 0.95], [0.03, 1]] : [[-0.035, 0.9], [0.0, 1]];
      for (const [ex, kk] of ears) {
        gh.beginPath(); gh.moveTo(hx + ex - 0.03, hy - 0.05); gh.lineTo(hx + ex + 0.005, hy - 0.05 - 0.085 * kk); gh.lineTo(hx + ex + 0.035, hy - 0.045); gh.closePath(); gh.fill();
      }
      fluff(gh, hx, hy, 0.085, 0.078, 14, fur);
      const m = q ? 0.085 : 0.13;           // how far the muzzle's tip stands out
      gh.beginPath(); gh.moveTo(hx + 0.03, hy - 0.035); gh.quadraticCurveTo(hx + m * 0.77, hy - 0.02, hx + m, hy + 0.004 + (q ? 0.012 : 0));
      gh.quadraticCurveTo(hx + m * 0.62, hy + 0.035 + (q ? 0.01 : 0), hx + 0.03, hy + 0.04); gh.closePath(); gh.fill();
      gh.fillStyle = dark;
      gh.beginPath(); gh.arc(hx + m - 0.002, hy + 0.004 + (q ? 0.012 : 0), 0.013, 0, Math.PI * 2); gh.fill();
      gh.beginPath(); gh.arc(hx + (q ? 0.0 : 0.04), hy - 0.018, 0.009, 0, Math.PI * 2); gh.fill();
      if (q) { gh.beginPath(); gh.ellipse(hx + 0.05, hy - 0.022, 0.006, 0.008, 0, 0, Math.PI * 2); gh.fill(); }   // the far eye
    });
    if (!q) tail();
  }
  // the points as painted (head to the right); live() marks them where the mirror and the head put them, every frame
  e.at(G.head[0], G.head[1]);
  e.at(G.head[0], G.head[1], 'head');
  e.at(G.collar[0], G.collar[1], 'collar');
  e.at(G.back[0], G.back[1], 'back');
  // the leash: four straps of 1 m from (0, 0) along +x — live() lays them from the collar to the hand
  for (const n of STRAPS) e.layer(n, { pivot: [0, 0], box: STRAP_BOX }, gl => {
    gl.fillStyle = LEASH;
    gl.fillRect(0, -W / 2, 1, W);
    gl.fillStyle = 'rgba(255,190,170,0.35)';      // a thin light edge along it: it reads against dark stone
    gl.fillRect(0, -W / 2, 1, W * 0.28);
  });
}

// a layer's transform at its pivot (rotate, scale, offset — the engine's order), mirrored left-right when dir < 0:
// the mirror of p ↦ pivot + R(r)·S·(p − pivot) + o is pivot + R(−r)·S(−sx, sy)·(p − pivot) + (−2·pivot.x − o.x, o.y)
function put(L, piv, dir, r, sx, sy, ox, oy) {
  L.rotate = dir < 0 ? -r : r;
  L.scaleX = dir < 0 ? -sx : sx;
  L.scaleY = sy;
  L.x = dir < 0 ? -2 * piv[0] - ox : ox;
  L.y = oy;
}
// where a point painted at p is now: through its layer's transform (unmirrored), then the mirror
function moved(p, piv, r, sx, sy, ox, oy, dir, out) {
  const dx = (p[0] - piv[0]) * sx, dy = (p[1] - piv[1]) * sy, c = Math.cos(r), s = Math.sin(r);
  out[0] = (piv[0] + c * dx - s * dy + ox) * dir;
  out[1] = piv[1] + s * dx + c * dy + oy;
  return out;
}

const HEAD = [0, 0], COLLAR = [0, 0], BACK = [0, 0], PTS = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];

function live(e) {
  const s = e.state, t = e.t, m = e.mem;
  const here = num(s.spitz_here, 1) > 0.5;
  for (const n of BODY) e.layer(n).alpha = here ? 1 : 0;
  for (const n of STRAPS) e.layer(n).alpha = here ? 1 : 0;
  if (!here) return;
  const view = VIEWS.includes(s.spitz_view) ? s.spitz_view : 'side', act = s.spitz_do || 'stand';
  const old = num(s.spitz_old) > 0.5, slow = old ? 0.6 : 1;
  const G = shape(view, act);

  // ── which way it faces: the key `spitz_dir` (as seen: 1 right, −1 left) when it is set anew and after a cut; then
  // the way its place moves on the screen
  const key = num(s.spitz_dir, 1) < 0 ? -1 : 1;
  if (m.key !== key || m.dir == null || e.cut < (m.cut ?? Infinity)) m.dir = key;
  m.key = key;
  m.cut = e.cut;
  const a = num(s.spitz_a), d = num(s.spitz_d), el = num(s.spitz_e);
  const va = num(e.speed('spitz_a')), vd = num(e.speed('spitz_d')), v = Math.hypot(va, vd);
  if (v > 0.05) {
    const p0 = e.point([a, d, el]);
    const x0 = p0 ? p0[0] : null;
    const p1 = e.point([a + va * 0.25, d + vd * 0.25, el]);
    if (x0 != null && p1 && Math.abs(p1[0] - x0) > 0.01) m.dir = p1[0] > x0 ? 1 : -1;
  }
  const dir = view === 'back' ? 1 : m.dir;

  // ── the legs' step: by its speed (a phase added up, 1.5…4.5 a second), or on the spot when told to trot or run
  const moving = v > 0.08 || act === 'trot' || act === 'run';
  const f = v > 0.08 ? clamp(v / 0.25, 1.5, 4.5) : act === 'run' ? 4 : 2.5;
  m.ph ??= (e.id.length * 1.7) % 6;
  m.step = ((m.step ?? 0) + (moving ? 2 * Math.PI * f * slow * Math.min(e.dt, 0.1) : 0)) % (2 * Math.PI);
  const sw = moving ? (act === 'run' || v > 1.5 ? 0.55 : 0.45) * Math.sin(m.step) : 0;
  const bob = moving ? -0.012 * Math.abs(Math.sin(m.step)) : 0;
  const breath = 1 + (act === 'lie' ? 0.02 : 0.012) * Math.sin(t * 2.2 * slow + m.ph);
  put(e.layer('body'), G.pivot.body, dir, 0, 1, breath, 0, bob);
  put(e.layer('legs_near'), G.pivot.legs_near, dir, sw, 1, 1, 0, 0);
  put(e.layer('legs_far'), G.pivot.legs_far, dir, -sw, 1, 1, 0, 0);
  // the tail: a quick wag when up and glad, a slow stir lying, still growling
  const wag = act === 'lie' ? 0.05 * Math.sin(t * 1.3 + m.ph) : act === 'growl' ? 0 : 0.2 * Math.sin(t * 9 * slow);
  put(e.layer('tail'), G.pivot.tail, dir, wag, 1, 1, 0, bob);
  // the head (worked out head to the right): toward what it looks at, a little; a jerk on growl and bark; a slow
  // nod lying; down to sniff
  let hr = act === 'lie' ? 0.04 * e.anim.noise(t * 0.3, 3) : 0;
  const look = s.spitz_look;
  if (look && view !== 'back') {
    moved(G.head, G.pivot.head, 0, 1, 1, 0, bob, dir, HEAD);
    const p = e.point(look);
    if (p) hr += clamp(Math.atan2(p[1] - HEAD[1], Math.abs(p[0] - HEAD[0]) + 0.2) * 0.5, -0.35, 0.35);
  }
  if (act === 'bark' || act === 'growl') hr += (act === 'bark' ? -0.12 : -0.05) * Math.max(0, Math.sin(t * (act === 'bark' ? 7 : 14)));
  if (act === 'sniff') hr += 0.25 + 0.03 * Math.sin(t * 13);
  put(e.layer('head'), G.pivot.head, dir, hr, 1, 1, 0, bob);

  // ── its points where they are now: the head (its press, its lines), the collar, the back
  moved(G.head, G.pivot.head, hr, 1, 1, 0, bob, dir, HEAD);
  moved(G.collar, G.pivot.head, hr, 1, 1, 0, bob, dir, COLLAR);
  moved(G.back, G.pivot.body, 0, 1, breath, 0, bob, dir, BACK);
  e.at(HEAD[0], HEAD[1]);
  e.at(HEAD[0], HEAD[1], 'head');
  e.at(COLLAR[0], COLLAR[1], 'collar');
  e.at(BACK[0], BACK[1], 'back');

  // ── the leash: from the collar to the hand that holds it, sagging as much as its 2 m let it; `none` — down to the
  // ground behind and trailing along it; `chair` — to the scene's `chair#leash`
  const ref = s.leash, cx = COLLAR[0], cy = COLLAR[1];
  let hand = null;
  if (ref === 'chair') hand = e.point('chair#leash');
  else if (typeof ref === 'string' && ref && ref !== 'none') hand = e.point(ref);
  const ground = Math.max(0, el);               // the land under it (y down from its feet); the feet's own level is 0
  if (hand) {
    const hx = hand[0], hy = hand[1], dx = hx - cx, dy = hy - cy, D = Math.hypot(dx, dy);
    const sag = D < LENGTH ? Math.min(LENGTH / 2, Math.sqrt(3 * D * (LENGTH - D) / 8)) : 0;
    for (let i = 0; i <= 4; i++) {
      const u = i / 4, P = PTS[i];
      P[0] = cx + dx * u;
      P[1] = Math.min(cy + dy * u + 4 * sag * u * (1 - u), ground - 0.01);
    }
    PTS[0][1] = cy; PTS[4][1] = hy;
  } else {
    // trailing: down to the ground a quarter metre behind, then along it, a little crooked
    const back = -dir;
    PTS[0][0] = cx; PTS[0][1] = cy;
    PTS[1][0] = cx + back * 0.25; PTS[1][1] = -0.012;
    for (let i = 2; i <= 4; i++) { PTS[i][0] = PTS[i - 1][0] + back * 0.42; PTS[i][1] = -0.012 + 0.02 * Math.sin(i * 2.1 + m.ph); }
  }
  // at night the strap keeps its red: brighter as the hour goes from dusk into night (a red strap otherwise goes black)
  const h = num(s.hour, 0.5), far = Math.abs(((h % 1) + 1) % 1 - 0.5) * 2;   // 0 noon … 1 midnight
  const glow = 1 + 1.2 * clamp((far - 0.5) / 0.35, 0, 1);
  for (let i = 0; i < 4; i++) {
    const A = PTS[i], B = PTS[i + 1], L = e.layer(STRAPS[i]);
    L.rotate = Math.atan2(B[1] - A[1], B[0] - A[0]);
    L.scaleX = Math.max(0.001, Math.hypot(B[0] - A[0], B[1] - A[1]) + 0.004);
    L.scaleY = 1;
    L.x = A[0];
    L.y = A[1];
    L.brightness = glow;
  }
}

return { paint, live, LEASH };
