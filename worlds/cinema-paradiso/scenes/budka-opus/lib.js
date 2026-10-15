
// Будка — what the paintings and the script share: the booth in metres, the projectors' profile, the walls.
// Metres: across x (right of the start's line of sight), distance z (north, toward the hall). The start stands by
// the booth's south wall, in the middle, looking north at the two projectors and the ports into the hall.

const G = {
  W: 2.0, S: -0.3, N: 3.2, CEIL: 2.6,                 // walls x ±2, south z −0.3, north z 3.2 (the ports), ceiling
  P1: [-1.12, 2.25], P2: [0.12, 2.25],                // the projectors (their middle on the floor), lenses north
  HALF: 0.18, BACK: -0.36, FRONT: 0.5,                // a projector's half width; its back and its lens from the middle
  LENS_H: 1.35, PORT_H: 1.36, PORT_W: 0.3,            // the lens's height; the ports' middle height and width
  LOOK: [-0.5, 3.2, 1.55],                            // the look port between the projectors (0.4 × 0.3)
  DOOR: [0.1, 1.0], DOOR_H: 2.0,                      // the door in the east wall (z), hinged at its north jamb
  CAL: [1.99, 1.45, 1.45],                            // the calendar on the east wall behind the open leaf
  BENCH: [1.5, 2.0, 2.0, 3.1], BENCH_H: 0.85,         // the bench along the east wall: x 1.5…2, z 2.0…3.1
  WINDOW: [1.0, 1.6, 1.1, 1.75],                      // the window on the square, west wall: z 1.0…1.6, 1.1…1.75 m up
  STOOL: [0.55, 1.95], CRATE: [-0.5, 2.1],            // Alfredo's stool by projector 2; the boy's crate between them
};

const hash = (n, s) => anim.hash(n, s);

// A projector of the forties in profile, painted in its own side's metres: x toward its lens (north), y down from
// its top, the floor at y 0. Pedestal, the mechanism, the lamp house with its chimney behind, the lens; the reels are
// layers of the element (painted by `reels`). side: 'e' (its east face: the motor crank and the lever are on it).
function projector(g, side) {
  g.fillStyle = '#2b2a2c';                                           // the cast-iron pedestal and its foot
  g.beginPath(); g.moveTo(-0.3, 0); g.lineTo(0.34, 0); g.lineTo(0.2, -0.08); g.lineTo(0.1, -0.85); g.lineTo(-0.12, -0.85); g.lineTo(-0.2, -0.08); g.closePath(); g.fill();
  g.fillStyle = '#3c3b3f'; g.fillRect(-0.3, -1.08, 0.66, 0.26);       // the mechanism's lower box
  g.fillStyle = '#46454a'; g.fillRect(-0.12, -1.55, 0.46, 0.5);       // the head with the gate
  g.fillStyle = '#56565c'; g.fillRect(-0.1, -1.52, 0.42, 0.04);
  g.fillStyle = '#323136'; g.fillRect(-0.4, -1.72, 0.3, 0.6);         // the lamp house behind
  g.fillStyle = '#28272a'; g.fillRect(-0.33, -1.92, 0.15, 0.22);      // its chimney
  for (let k = 0; k < 4; k++) { g.fillStyle = '#1c1b1e'; g.fillRect(-0.37, -1.62 + k * 0.1, 0.24, 0.035); }   // its vents
  g.fillStyle = '#1b1b1e'; g.fillRect(0.32, -1.42, 0.2, 0.13);        // the lens barrel
  g.fillStyle = '#8f8c84'; g.fillRect(0.5, -1.41, 0.03, 0.11);
  g.strokeStyle = '#2a292d'; g.lineWidth = 0.025;                     // the reels' arms
  g.beginPath(); g.moveTo(0.1, -1.55); g.lineTo(0.06, -1.95); g.moveTo(0.05, -0.82); g.lineTo(0.02, -0.62); g.stroke();
  if (side === 'e') {
    g.fillStyle = '#5a4a32'; g.fillRect(-0.24, -1.0, 0.07, 0.07);      // the crank's boss (the crank is a layer)
    g.fillStyle = '#7a3a2a'; g.fillRect(0.2, -1.32, 0.03, 0.2);        // the lever
    g.fillStyle = '#c0b8a8'; g.beginPath(); g.arc(0.215, -1.34, 0.03, 0, Math.PI * 2); g.fill();
  }
}
// its two reels (layers turning about their hubs): the feed reel above, the take-up below
function reel(r, x, y, R) {
  r.fillStyle = '#4a4b50'; r.beginPath(); r.arc(x, y, R, 0, Math.PI * 2); r.fill();
  r.fillStyle = '#26272b'; r.beginPath(); r.arc(x, y, R * 0.72, 0, Math.PI * 2); r.fill();
  r.fillStyle = '#6d6f75'; for (let k = 0; k < 3; k++) { const a = k * 2.094; r.beginPath(); r.ellipse(x + Math.cos(a) * R * 0.45, y + Math.sin(a) * R * 0.45, R * 0.17, R * 0.17, 0, 0, Math.PI * 2); r.fill(); }
  r.fillStyle = '#a5a7ad'; r.beginPath(); r.arc(x, y, R * 0.1, 0, Math.PI * 2); r.fill();
}
const REEL_TOP = [0.06, -2.2, 0.28], REEL_LOW = [0.02, -0.55, 0.24];

// plaster with stains over a w×h rectangle at (x, y), clipped to it
function plaster(g, x, y, w, h, base, seed) {
  g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
  g.fillStyle = base; g.fillRect(x, y, w, h);
  for (let i = 0; i < w * h * 3; i++) {
    const px = x + hash(i, seed) * w, py = y + hash(i, seed + 1) * h, r = 0.08 + hash(i, seed + 2) * 0.35;
    g.fillStyle = i % 3 ? 'rgba(60,46,36,0.035)' : 'rgba(255,236,210,0.025)';
    g.beginPath(); g.ellipse(px, py, r, r * 0.7, hash(i, seed + 3) * 3, 0, Math.PI * 2); g.fill();
  }
  g.restore();
}
// film cans stacked on a shelf (a w-wide shelf at y)
function cans(g, x0, y, w, seed) {
  g.fillStyle = '#4a3726'; g.fillRect(x0, y, w, 0.03);
  let x = x0 + 0.04;
  while (x < x0 + w - 0.36) {
    const n = 1 + Math.floor(hash(x * 10, seed) * 4);
    for (let k = 0; k < n; k++) { g.fillStyle = k % 2 ? '#5a5a5e' : '#6a6964'; g.fillRect(x, y - 0.035 * (k + 1), 0.34, 0.03); }
    x += 0.38;
  }
}

// One face of a projector (the element's painting): flip — the face's x runs south (a west-looking face of P1, the
// inner face of P2), inner — the operator's face (the crank, the lever). Reels and crank are layers; points: lens,
// gate, lever (inner), and the crank's handle `motor` (marked by projMove).
function projFace(g, e, flip, inner) {
  const f = flip ? -1 : 1;
  g.save(); g.scale(f, 1); projector(g, inner ? 'e' : 'w'); g.restore();
  e.layer('rt', { pivot: [f * REEL_TOP[0], REEL_TOP[1]] }, r => { r.scale(f, 1); reel(r, REEL_TOP[0], REEL_TOP[1], REEL_TOP[2]); });
  e.layer('rl', { pivot: [f * REEL_LOW[0], REEL_LOW[1]] }, r => { r.scale(f, 1); reel(r, REEL_LOW[0], REEL_LOW[1], REEL_LOW[2]); });
  if (inner) e.layer('crank', { pivot: [f * -0.205, -0.965] }, c => {
    c.scale(f, 1); c.strokeStyle = '#2a2622'; c.lineWidth = 0.025; c.lineCap = 'round';
    c.beginPath(); c.moveTo(-0.205, -0.965); c.lineTo(-0.205, -0.845); c.stroke();
    c.fillStyle = '#5a3a24'; c.fillRect(-0.215, -0.86, 0.02, 0.05);
  });
  e.at(f * 0.53, -1.35, 'lens');
  e.at(f * 0.1, -1.3, 'gate');
  if (inner) e.at(f * 0.215, -1.34, 'lever');
  e.at(0, -1.5);
}
function projMove(e, flip, inner, motor, crank) {
  const m = e.mem, f = flip ? -1 : 1;
  m.ph = (m.ph || 0) + e.dt * 3.0 * (motor || 0);
  m.cr = (m.cr || 0) + e.dt * 4.2 * (crank || 0);
  e.layer('rt').rotate = f * m.ph; e.layer('rl').rotate = f * m.ph * 1.25;
  if (inner) {
    e.layer('crank').rotate = f * m.cr;
    e.at(f * (-0.205 - Math.sin(m.cr) * 0.12), -0.965 + Math.cos(m.cr) * 0.12, 'motor');
  }
}
// a projector seen from behind (a card facing the room, its middle on the floor)
function projBack(g, e) {
  g.fillStyle = '#2b2a2c'; g.beginPath(); g.moveTo(-0.2, 0); g.lineTo(0.2, 0); g.lineTo(0.1, -0.85); g.lineTo(-0.1, -0.85); g.closePath(); g.fill();
  g.fillStyle = '#3c3b3f'; g.fillRect(-0.18, -1.08, 0.36, 0.26);
  g.fillStyle = '#323136'; g.fillRect(-0.15, -1.72, 0.3, 0.62);
  g.fillStyle = '#28272a'; g.fillRect(-0.06, -1.92, 0.12, 0.22);
  for (let k = 0; k < 4; k++) { g.fillStyle = '#171619'; g.fillRect(-0.11, -1.62 + k * 0.1, 0.22, 0.02); }   // the vents' slits (their glow: the lamp's light)
  g.fillStyle = '#4a3a2a'; g.fillRect(-0.04, -1.25, 0.08, 0.05);
  e.light(0, -1.45, 0.14, '#ffb860', 0.8, 'vents');
  e.at(0, -1.45, 'vents');
}
// a beam from a lens (the anchor) 20.5 m to the screen far down the hall: the cone, the motes (shader: smoke)
function beamPaint(e) {
  const len = 20.5, top = -0.85, bot = 3.15;
  e.layer('cone', {}, c => {
    const gr = c.createLinearGradient(0, 0, len, 0);
    gr.addColorStop(0, 'rgba(255,232,186,1)'); gr.addColorStop(0.03, 'rgba(255,222,165,0.55)');
    gr.addColorStop(0.3, 'rgba(255,210,150,0.2)'); gr.addColorStop(1, 'rgba(255,205,145,0.1)');
    c.fillStyle = gr; c.beginPath(); c.moveTo(0, -0.03); c.lineTo(len, top); c.lineTo(len, bot); c.lineTo(0, 0.03); c.closePath(); c.fill();
  });
  e.layer('dust', { drift: [0.6, 0], box: [0, -0.9, len, 3.2] }, d => {
    for (let i = 0; i < 260; i++) {
      const u = Math.pow(hash(i, 81), 1.6), x = u * len, y = -0.85 * u + (hash(i, 82)) * 4.0 * u + 0.02, r = 0.006 + hash(i, 83) * 0.02 * (0.3 + u);
      d.fillStyle = 'rgba(255,236,200,' + (0.4 + hash(i, 84) * 0.5) + ')';
      d.beginPath(); d.arc(x, y, r, 0, Math.PI * 2); d.fill();
    }
  });
  e.light(0.02, 0, 0.06, '#ffe2b0', 1, 'mouth');
  e.at(0.3, 0.02, 'beam');
}

return { G, projector, reel, REEL_TOP, REEL_LOW, plaster, cans, projFace, projMove, projBack, beamPaint };
