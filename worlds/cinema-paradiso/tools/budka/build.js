// Builds scenes/budka/scene.json and its elements' files (the 4th edition's booth), then the «Contract for the check» block
// of its notes.md (contract.js). lib.js, script.js, showcase.js and the rest of notes.md are written by hand.
//   node tools/budka/build.js
const fs = require('fs'), path = require('path');
const DIR = path.join(__dirname, '..', '..', 'scenes', 'budka');
// the scene's own music (a quiet bed without melody; its scale the owner's)
const MUSIC = {
  "scale": "E_MAJOR_D_FLAT_MINOR",
  "prompts": [
    {
      "text": "a projector clattering steadily in a small booth, the motor humming, twenty-four clicks a second, no melody",
      "weight": 1.3
    },
    {
      "text": "muffled film music and laughter heard through a wall from a cinema hall below, far away",
      "weight": 0.7
    },
    {
      "text": "a quiet small room at night, a clock ticking, the square outside murmuring",
      "weight": 0
    },
    {
      "text": "footsteps running down a stone stair, a door closing, then only the projector",
      "weight": 0
    },
    {
      "text": "a soft celesta motif of five slow notes, nostalgic, Sicilian, very sparse",
      "weight": 0
    },
    {
      "text": "warm analog tape hiss and a low drone, still and tender",
      "weight": 0
    },
    {
      "text": "scissors snipping film, a splicing press clicking, quiet work sounds",
      "weight": 0
    },
    {
      "text": "gentle strings, bright sadness, slow, no percussion",
      "weight": 0
    },
    {
      "text": "a summer night in a Sicilian town through a small open window, cicadas, a far voice",
      "weight": 0
    },
    {
      "text": "a film reel spinning down, the tail flapping, the motor winding down",
      "weight": 0
    },
    {
      "text": "pencil scratching on paper in a quiet room",
      "weight": 0
    },
    {
      "text": "low cello drone, solemn and tender",
      "weight": 0
    },
    {
      "text": "mandolin tremolo far away, nostalgic, very quiet",
      "weight": 0
    },
    {
      "text": "rain on a window of a small room, evening",
      "weight": 0
    },
    {
      "text": "the hum of a cinema crowd waiting, far below",
      "weight": 0
    }
  ],
  "bpm": 60,
  "density": 0.18,
  "brightness": 0.35
};
fs.rmSync(path.join(DIR, 'elements'), { recursive: true, force: true });
fs.mkdirSync(path.join(DIR, 'elements'));
const files = {};
const objects = [];
// el(spec, {code, animate, wgsl})
function el(spec, f = {}) {
  objects.push(spec);
  for (const [ext, text] of Object.entries(f)) if (text) files[`${spec.id}.${ext === 'code' ? 'js' : ext === 'animate' ? 'animate.js' : ext}`] = text.trim() + '\n';
}
const IN = { inside: true };

// ── the hall beyond the ports ──
el({ id: 'hall_dark', name: 'The hall below', across: 0, distance: 23.6, elevation: -3, facing: 180, height: 8, box: [-6, -7, 6, 1] }, { code: `
// the dark of the hall beyond the ports: only seen through them, round the far screen (as small as the ports show)
g.fillStyle = '#0d0b0a'; g.fillRect(-6, -7, 12, 8);
` });
el({ id: 'hall_screen', name: 'The hall\'s screen', across: 0, distance: 23.3, elevation: -1.25, facing: 180, glows: true, height: 3.4, box: [-2.9, -3.5, 2.9, 0.1] }, { code: `
// The hall's screen far below and ahead, seen through the ports: the film (romance; white when the reel ran out or the
// change was late), red curtains at its sides. Lit while the beam is on (animate).
const k = e.kit.kino;
g.fillStyle = '#5a1c20'; g.fillRect(-2.9, -3.5, 0.6, 3.5); g.fillRect(2.3, -3.5, 0.6, 3.5);
k.screen(g, e, { x: -2.2, y: -3.3, w: 4.4, h: 3.3, frames: ['romance', 'white'], sheet: '#2a2622' });
`, animate: `
// the film shown while the beam is on: white when the reel ran out (tail) or the change was missed (white); it
// trembles while the loop was lost (jitter)
const S = e.state, on = Math.max(0, Math.min(1, S.beam_on || 0)), w = S.white || S.tail ? 1 : 0;
e.layer('f_romance').alpha = on * (1 - w); e.layer('f_white').alpha = on * w;
const j = S.jitter ? Math.sin(e.t * 53) * 0.06 + Math.sin(e.t * 31) * 0.04 : 0;
e.layer('f_romance').y = j;
` });

// ── the room ──
el({ id: 'floor', name: 'Booth floor', plane: true, across: 0, distance: 1.75, elevation: 0, width: 4.1, depth: 3.6, walk: true, ...IN }, { code: `
// The booth's floor from above (x right, y toward the opposite wall): worn boards, dark at the projectors' feet;
// in 1988 pigeons' down, glass, plaster fallen. Its points: where Alfredo fell (path0) and by the door (path1).
const L = e.lib, G = L.G, an = e.anim, ruin = e.state.era === 'ruin';
const Y = z => 1.75 - z;
g.fillStyle = ruin ? '#4a4038' : '#4b3a2a'; g.fillRect(-2.05, -1.8, 4.1, 3.6);
for (let k = 0, x = -2.05; x < 2.05; x += 0.14, k++) { g.fillStyle = ruin ? (k % 2 ? '#4f453c' : '#463d35') : k % 2 ? '#523f2d' : '#473624'; g.fillRect(x, -1.8, 0.13, 3.6); }
g.fillStyle = 'rgba(20,14,10,0.35)';
for (const p of [G.P1, G.P2]) { g.beginPath(); g.ellipse(p[0], Y(p[1]), 0.5, 0.45, 0, 0, Math.PI * 2); g.fill(); }
if (ruin) {
  for (let i = 0; i < 140; i++) {
    const x = -1.9 + an.hash(i, 3) * 3.8, y = -1.7 + an.hash(i, 4) * 3.4;
    g.fillStyle = i % 3 ? 'rgba(220,214,200,0.55)' : 'rgba(140,130,118,0.6)';
    g.beginPath(); g.ellipse(x, y, 0.015 + an.hash(i, 5) * 0.04, 0.01 + an.hash(i, 6) * 0.02, an.hash(i, 7) * 3, 0, Math.PI * 2); g.fill();
  }
  g.fillStyle = 'rgba(200,196,186,0.5)';
  for (let i = 0; i < 12; i++) { const x = -1.8 + an.hash(i, 9) * 1.2, y = Y(1.2 + an.hash(i, 10) * 0.7); g.fillRect(x, y, 0.06 + an.hash(i, 11) * 0.08, 0.02); }
} else {
  g.strokeStyle = '#2a2622'; g.lineWidth = 0.02; g.beginPath(); g.moveTo(1.1, -0.1); g.quadraticCurveTo(1.3, 0.2, 1.0, 0.4); g.stroke();
}
e.at(G.PATH0[0], Y(G.PATH0[1]), 'path0');
e.at(G.PATH1[0], Y(G.PATH1[1]), 'path1');
` });
el({ id: 'ceiling', name: 'Ceiling', across: 0, distance: 3.5, elevation: 2.6, facing: 180, tilt: -90, height: 3.6, box: [-2.1, -3.65, 2.1, 0.05], ...IN }, { code: `
// the low ceiling seen from below, smoke-darkened over the projectors; in 1988 a hole with a lath showing
const ruin = e.state.era === 'ruin';
g.fillStyle = ruin ? '#4a443c' : '#4a4036'; g.fillRect(-2.1, -3.65, 4.2, 3.7);
if (!ruin) { const sm = g.createRadialGradient(0, -0.6, 0.2, 0, -0.6, 1.4); sm.addColorStop(0, 'rgba(20,16,12,0.22)'); sm.addColorStop(1, 'rgba(20,16,12,0)'); g.fillStyle = sm; g.fillRect(-2.1, -2.0, 4.2, 2.0); }
g.fillStyle = '#3a3128'; g.fillRect(-2.1, -1.9, 4.2, 0.12);
if (ruin) { g.fillStyle = '#2a2420'; g.beginPath(); g.ellipse(-0.9, -2.4, 0.35, 0.22, 0.3, 0, Math.PI * 2); g.fill(); }
` });
el({ id: 'wall_n', name: 'Wall with the ports to the hall', across: 0, distance: 3.5, facing: 180, height: 2.6, box: [-2.1, -2.7, 2.1, 0.05], ...IN }, { code: `
// The wall toward the hall: plaster gone brown with smoke; the two ports (holes, the hall beyond) before the
// projectors, between them the look port (its picture is the element look_port) — in 1988 their glass broken.
const L = e.lib, G = L.G, H = G.CEIL, ruin = e.state.era === 'ruin';
const holes = [[G.P1[0], G.PORT_H, G.PORT_W, G.PORT_HH], [G.P2[0], G.PORT_H, G.PORT_W, G.PORT_HH], [G.LOOK[0], (G.LOOK[1] + G.LOOK[2]) / 2, G.LOOK[3], G.LOOK[2] - G.LOOK[1]]];
g.save(); g.beginPath(); g.rect(-2.1, -H - 0.1, 4.2, H + 0.15);
for (const [x, y, w, h] of holes) g.rect(x - w / 2, -y - h / 2, w, h);
g.clip('evenodd');
L.plaster(g, -2.1, -H - 0.1, 4.2, H + 0.15, ruin ? '#7e7468' : '#7a6650', 31, ruin);
g.fillStyle = '#3e3024'; g.fillRect(-2.1, -0.12, 4.2, 0.12);
g.restore();
for (const [x, y, w, h] of holes) {
  g.strokeStyle = ruin ? '#4a3a2e' : '#2c2824'; g.lineWidth = 0.035; g.strokeRect(x - w / 2 - 0.02, -y - h / 2 - 0.02, w + 0.04, h + 0.04);
  g.fillStyle = ruin ? '#5a4a3c' : '#3a3530'; g.fillRect(x - w / 2 - 0.03, -y - h / 2 - 0.12, w + 0.06, 0.08);
  if (ruin) { g.strokeStyle = 'rgba(200,210,215,0.5)'; g.lineWidth = 0.004; g.beginPath(); g.moveTo(x - w / 2, -y - h / 2); g.lineTo(x - w * 0.1, -y + h * 0.1); g.lineTo(x - w / 2, -y + h / 2); g.stroke(); }
}
g.save(); g.scale(0.01, 0.01); g.font = '600 5px serif'; g.fillStyle = '#2a2420'; g.textAlign = 'center';
g.fillText('1', G.P1[0] * 100, -176); g.fillText('2', G.P2[0] * 100, -176); g.restore();
` });
el({ id: 'look_port', name: 'Look port', across: 0, distance: 3.485, elevation: 1.4, facing: 180, glows: true, height: 0.3, box: [-0.36, -0.44, 0.36, 0.14] }, { code: `
// What the look port shows: the hall's screen from the booth — the film, and in its upper right corner the
// changeover cue (a layer: \`cue\`); round the port, a rim of the screen's light that blinks with the cue
const k = e.kit.kino, G = e.lib.G, w = G.LOOK[3], h = G.LOOK[2] - G.LOOK[1];
g.fillStyle = '#100e0c'; g.fillRect(-w / 2, -h, w, h);
k.screen(g, e, { x: -w / 2 + 0.03, y: -h + 0.04, w: w - 0.06, h: h - 0.08, frames: ['romance', 'white'], sheet: '#1a1714' });
e.layer('cue', {}, l => k.cue(l, -w / 2 + 0.03, -h + 0.04, w - 0.06, h - 0.08));
e.layer('blink', {}, l => {
  const r = l.createRadialGradient(0, -h / 2, 0.05, 0, -h / 2, 0.36);
  r.addColorStop(0, 'rgba(255,236,200,0.9)'); r.addColorStop(1, 'rgba(255,236,200,0)');
  l.fillStyle = r; l.fillRect(-0.36, -h / 2 - 0.36, 0.72, 0.72);
  l.strokeStyle = 'rgba(255,246,226,1)'; l.lineWidth = 0.025; l.strokeRect(-w / 2 - 0.01, -h - 0.01, w + 0.02, h + 0.02);
});
e.at(0, -h / 2);
`, animate: `
const S = e.state, on = Math.max(0, Math.min(1, S.beam_on || 0)), w = S.white || S.tail ? 1 : 0, c = Math.max(0, Math.min(1, S.cue || 0));
e.layer('f_romance').alpha = on * (1 - w); e.layer('f_white').alpha = on * w;
// the loop lost: the frame jumps in the gate — the picture hops and flickers till Alfredo's palm on the gate
const jt = S.jitter ? 1 : 0;
e.layer('f_romance').y = jt * (Math.sin(e.t * 53) > 0.2 ? -0.03 : 0.012);
e.layer('f_romance').alpha = on * (1 - w) * (1 - jt * 0.45 * (0.5 + 0.5 * Math.sin(e.t * 37)));
const blink = c * (0.55 + 0.45 * Math.sin(e.t * 18));
e.layer('cue').alpha = c; e.layer('blink').alpha = blink;
` });
el({ id: 'clock', name: 'Clock', across: 0, distance: 3.47, elevation: 1.94, facing: 180, height: 0.34, box: [-0.18, -0.35, 0.18, 0.02], ...IN }, { code: `
// The clock over the look port: a white face; its hands are layers turned by \`clock\` (6…10 o'clock); in 1988 stopped
const ruin = e.state.era === 'ruin';
g.fillStyle = '#2a2826'; g.beginPath(); g.arc(0, -0.16, 0.16, 0, Math.PI * 2); g.fill();
g.fillStyle = ruin ? '#a8a092' : '#e4dccb'; g.beginPath(); g.arc(0, -0.16, 0.14, 0, Math.PI * 2); g.fill();
g.fillStyle = '#2a2826';
for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2; g.fillRect(Math.sin(a) * 0.12 - 0.004, -0.16 - Math.cos(a) * 0.12 - 0.01, 0.008, 0.02); }
e.layer('hour', { pivot: [0, -0.16] }, l => { l.strokeStyle = '#1a1816'; l.lineCap = 'round'; l.lineWidth = 0.014; l.beginPath(); l.moveTo(0, -0.16); l.lineTo(0, -0.23); l.stroke(); });
e.layer('min', { pivot: [0, -0.16] }, l => { l.strokeStyle = '#1a1816'; l.lineCap = 'round'; l.lineWidth = 0.009; l.beginPath(); l.moveTo(0, -0.16); l.lineTo(0, -0.27); l.stroke(); });
e.at(0, -0.16, 'face');
`, animate: `
const h = e.state.era === 'ruin' ? 4.6 : Math.max(6, Math.min(10, e.state.clock || 6));
e.layer('hour').rotate = (h % 12) / 12 * Math.PI * 2; e.layer('min').rotate = (h % 1) * Math.PI * 2;
` });
el({ id: 'wall_s', name: 'Wall opposite the ports', across: 0, distance: 0, facing: 0, height: 2.6, box: [-2.1, -2.7, 2.1, 0.05], ...IN }, { code: `
// the wall opposite the ports (seen from the room; its +x is the room's left): plaster, a skirting, a coat hook
const L = e.lib, ruin = e.state.era === 'ruin';
L.plaster(g, -2.1, -2.7, 4.2, 2.75, ruin ? '#7c7266' : '#7d6a54', 43, ruin);
g.fillStyle = '#3e3024'; g.fillRect(-2.1, -0.12, 4.2, 0.12);
// (its +x is the room's left: a hook with Alfredo's old jacket and cap at x 0.6, a small framed photograph at x −0.3)
if (!ruin) {
  g.save(); g.translate(1.35, 0);
  g.fillStyle = '#2a2420'; g.fillRect(-0.62, -1.78, 0.04, 0.05);
  g.fillStyle = '#3e3a34'; g.beginPath(); g.moveTo(-0.6, -1.74); g.lineTo(-0.82, -1.62); g.lineTo(-0.86, -1.0); g.lineTo(-0.34, -1.0); g.lineTo(-0.38, -1.62); g.closePath(); g.fill();
  g.fillStyle = '#2e2a26'; g.fillRect(-0.62, -1.42, 0.04, 0.42);
  g.fillStyle = '#34302c'; g.beginPath(); g.ellipse(-0.6, -1.8, 0.11, 0.05, 0, Math.PI, 0); g.fill(); g.fillRect(-0.7, -1.81, 0.2, 0.02);
  g.restore();
}
g.save(); g.translate(1.17, 0);
g.fillStyle = '#4a3a2a'; g.fillRect(0.18, -1.72, 0.26, 0.32);
g.fillStyle = ruin ? '#8a8478' : '#c2b49a'; g.fillRect(0.21, -1.69, 0.2, 0.26);
g.fillStyle = 'rgba(40,34,30,0.7)'; g.beginPath(); g.ellipse(0.31, -1.6, 0.04, 0.05, 0, 0, Math.PI * 2); g.fill(); g.fillRect(0.25, -1.55, 0.12, 0.12);
g.restore();
` });
// ── what stands along the walls beyond the middle 4:3 (21:9 is full: the room goes on to its corners) ──
el({ id: 'rack', name: 'Film rack', across: 0.25, distance: 0.16, facing: 0, height: 2.1, box: [-0.5, -2.15, 0.5, 0.02], shadow: true, ...IN }, { code: `
// a tall wooden rack against the wall opposite the ports (its +x is the room's left): film cans in stacks, spare reels
// standing on edge, a hand-written card; in 1988 nearly empty
const an = e.anim, ruin = e.state.era === 'ruin';
const wood = ruin ? '#4e4438' : '#4a3424', dark = ruin ? '#3a332c' : '#2e2118';
g.fillStyle = dark; g.fillRect(-0.48, -2.1, 0.96, 2.1);
g.fillStyle = wood; g.fillRect(-0.48, -2.1, 0.05, 2.1); g.fillRect(0.43, -2.1, 0.05, 2.1);
for (const y of [-2.05, -1.55, -1.05, -0.55, -0.08]) g.fillRect(-0.48, y, 0.96, 0.04);
for (let r = 0; r < 4; r++) {
  const y0 = -1.55 + r * 0.5;
  let x = -0.42;
  while (x < 0.38) {
    const kind = an.hash(Math.round(x * 100) + r * 31, 5), w = kind < 0.6 ? 0.2 : 0.1;
    if (ruin && an.hash(Math.round(x * 100) + r, 9) < 0.7) { x += w + 0.03; continue; }
    if (kind < 0.6) { const n = 2 + Math.floor(an.hash(Math.round(x * 100), r) * 6); for (let k = 0; k < n; k++) { g.fillStyle = k % 2 ? '#6a6a64' : '#7c7b74'; g.fillRect(x, y0 - 0.035 * (k + 1), 0.2, 0.03); } }
    else { g.fillStyle = '#4a4b50'; g.beginPath(); g.arc(x + 0.05, y0 - 0.18, 0.17, 0, Math.PI * 2); g.fill(); g.fillStyle = '#2a2b2e'; g.beginPath(); g.arc(x + 0.05, y0 - 0.18, 0.12, 0, Math.PI * 2); g.fill(); }
    x += w + 0.03;
  }
}
g.fillStyle = ruin ? '#8a8072' : '#d8ccb0'; g.fillRect(-0.36, -1.98, 0.22, 0.12);
g.fillStyle = 'rgba(40,30,24,0.7)'; for (let k = 0; k < 3; k++) g.fillRect(-0.34, -1.95 + k * 0.03, 0.16 - k * 0.03, 0.008);
` });
el({ id: 'bucket', name: 'Fire bucket', across: -0.4, distance: 0.2, facing: 0, height: 0.45, box: [-0.2, -0.75, 0.2, 0.02], ...IN }, { code: `
// a red fire bucket of sand on the floor by the rack, and its hook
const ruin = e.state.era === 'ruin';
g.fillStyle = ruin ? '#5a2a22' : '#8a2a22'; g.beginPath(); g.moveTo(-0.13, -0.32); g.lineTo(0.13, -0.32); g.lineTo(0.1, 0); g.lineTo(-0.1, 0); g.closePath(); g.fill();
g.fillStyle = ruin ? '#7a7062' : '#c8b48a'; g.fillRect(-0.13, -0.33, 0.26, 0.03);
g.strokeStyle = '#2a2420'; g.lineWidth = 0.01; g.beginPath(); g.arc(0, -0.32, 0.12, Math.PI, 0); g.stroke();
g.fillStyle = '#2a2420'; g.fillRect(-0.02, -0.72, 0.04, 0.03);
` });
el({ id: 'sconce', name: 'Bulb by the rack', across: 0.95, distance: 0.04, elevation: 1.86, facing: 0, height: 0.2, box: [-0.12, -0.2, 0.12, 0.08], ...IN }, { code: `
// a small enamel wall lamp over the rack: its bulb a second warm light in the booth (out in 1988)
const ruin = e.state.era === 'ruin';
g.fillStyle = '#2a2420'; g.fillRect(-0.02, -0.18, 0.04, 0.1);
g.fillStyle = ruin ? '#5a5650' : '#2a3a32'; g.beginPath(); g.moveTo(-0.09, 0); g.lineTo(-0.04, -0.09); g.lineTo(0.04, -0.09); g.lineTo(0.09, 0); g.closePath(); g.fill();
if (!ruin) e.light(0, 0.01, 0.05, '#ffd09a', 0.9, 'bulb');
`, animate: `if (e.state.era !== 'ruin') e.glow('bulb', Math.max(0, Math.min(1, e.state.lamp ?? 1)));` });
el({ id: 'rack_n', name: 'Shelf by the ports', across: 1.55, distance: 3.47, facing: 180, height: 2.3, box: [-0.45, -2.3, 0.45, 0.02], ...IN }, { code: `
// by the ports, right of projector 2: a shelf with spare reels and a lens case, a fuse box with its lever, a cable down
// the wall, the switch of the hall's lights
const ruin = e.state.era === 'ruin';
g.fillStyle = ruin ? '#4e4438' : '#4a3424'; g.fillRect(-0.42, -1.95, 0.84, 0.04);
if (!ruin) {
  for (const x of [-0.3, -0.05]) { g.fillStyle = '#4a4b50'; g.beginPath(); g.arc(x, -2.13, 0.16, 0, Math.PI * 2); g.fill(); g.fillStyle = '#26272b'; g.beginPath(); g.arc(x, -2.13, 0.11, 0, Math.PI * 2); g.fill(); }
  g.fillStyle = '#2a2520'; g.fillRect(0.12, -2.08, 0.26, 0.13);
}
g.fillStyle = ruin ? '#5a5248' : '#3a3a3e'; g.fillRect(-0.2, -1.6, 0.4, 0.5);
g.fillStyle = ruin ? '#3a3632' : '#4a4a50'; g.fillRect(-0.17, -1.57, 0.34, 0.44);
g.fillStyle = ruin ? '#6a3a26' : '#8a3a28'; g.fillRect(0.12, -1.45, 0.03, 0.16);
g.strokeStyle = '#1e1c1a'; g.lineWidth = 0.015; g.beginPath(); g.moveTo(0, -1.1); g.lineTo(0, -0.1); g.stroke();
g.fillStyle = ruin ? '#7a7266' : '#c8bca4'; g.fillRect(-0.06, -0.95, 0.12, 0.16); g.fillStyle = '#2a2420'; g.fillRect(-0.015, -0.92, 0.03, 0.08);
` });
el({ id: 'wall_w', name: 'Wall with the port on the square', across: -2, distance: 0, facing: 90, height: 2.6, box: [-0.1, -2.7, 3.6, 0.05], ...IN }, { code: `
// The left wall (its x runs from the opposite wall toward the ports): the window on the square cut in it, its frame
// and cross-bar (the pane and what is seen in it are the element square_window); in 1988 a pane gone.
const L = e.lib, G = L.G, H = G.CEIL, [z0, z1, h0, h1] = G.WINDOW, ruin = e.state.era === 'ruin';
g.save(); g.beginPath(); g.rect(-0.1, -H - 0.1, 3.7, H + 0.15); g.rect(z0, -h1, z1 - z0, h1 - h0); g.clip('evenodd');
L.plaster(g, -0.1, -H - 0.1, 3.7, H + 0.15, ruin ? '#807668' : '#7c6852', 51, ruin);
g.fillStyle = '#3e3024'; g.fillRect(-0.1, -0.12, 3.7, 0.12);
g.restore();
g.fillStyle = ruin ? '#5a4c40' : '#4a3a2a';
g.fillRect(z0 - 0.05, -h1 - 0.05, z1 - z0 + 0.1, 0.05); g.fillRect(z0 - 0.05, -h0, z1 - z0 + 0.1, 0.06);
g.fillRect(z0 - 0.05, -h1 - 0.05, 0.05, h1 - h0 + 0.1); g.fillRect(z1, -h1 - 0.05, 0.05, h1 - h0 + 0.1);
g.fillRect((z0 + z1) / 2 - 0.015, -h1, 0.03, h1 - h0); g.fillRect(z0, -(h0 + h1) / 2 - 0.015, z1 - z0, 0.03);
g.fillStyle = '#5a4a3a'; g.fillRect(z0 - 0.08, -h0, z1 - z0 + 0.16, 0.035);   // the sill
// toward the ports (z 2.3…3.4, beyond the middle 4:3 of the shots that look at the projectors): a shelf of spare reels
// and cans, a notice VIETATO FUMARE, a fire extinguisher on its bracket, the cable of the lamp houses along the wall
g.fillStyle = ruin ? '#4e4438' : '#4a3424'; g.fillRect(2.35, -1.92, 1.0, 0.04);
if (!ruin) for (const [z, r] of [[2.55, 0.17], [2.92, 0.15]]) { g.fillStyle = '#4a4b50'; g.beginPath(); g.arc(z, -1.92 - r, r, 0, Math.PI * 2); g.fill(); g.fillStyle = '#26272b'; g.beginPath(); g.arc(z, -1.92 - r, r * 0.68, 0, Math.PI * 2); g.fill(); }
for (let k = 0; k < (ruin ? 1 : 4); k++) { g.fillStyle = k % 2 ? '#6a6a64' : '#7c7b74'; g.fillRect(3.1, -1.95 - 0.035 * k, 0.22, 0.03); }
g.fillStyle = ruin ? '#8a8276' : '#d8ccb0'; g.fillRect(2.45, -1.62, 0.42, 0.22);
g.fillStyle = '#7a2a22'; g.fillRect(2.47, -1.6, 0.38, 0.05);
g.save(); g.scale(0.01, 0.01); g.fillStyle = '#2a2420'; g.font = '700 3.6px sans-serif'; g.textAlign = 'center'; g.fillText('VIETATO FUMARE', 266, -147); g.restore();
g.fillStyle = ruin ? '#5a2a22' : '#9a2a22'; g.fillRect(3.05, -1.25, 0.14, 0.42); g.fillStyle = '#2a2420'; g.fillRect(3.07, -1.32, 0.1, 0.07); g.fillRect(3.02, -0.95, 0.2, 0.03);
g.strokeStyle = '#1e1c1a'; g.lineWidth = 0.014; g.beginPath(); g.moveTo(2.3, -2.3); g.lineTo(3.45, -2.3); g.stroke();
` });
el({ id: 'square_window', name: 'Port on the square', across: -2.04, distance: 0, facing: 90, glows: true, height: 0.8, box: [1.15, -1.75, 1.85, -0.95] }, { code: `
// What the window shows: only the sky of the hour (the world's nebo, as a picture in the pane) — no square, no
// houses; in 1988 the glass broken, a shard left in a corner
const L = e.lib, [z0, z1, h0, h1] = L.G.WINDOW, S = e.state;
e.kit.nebo.pane(g, z0, -h1, z1, -h0, S.hour, S.era === 'ruin' ? 'now' : S.era, e.anim);
if (S.era === 'ruin') { g.fillStyle = 'rgba(210,220,225,0.18)'; g.beginPath(); g.moveTo(z0, -h1); g.lineTo(z0 + 0.2, -h1); g.lineTo(z0, -h1 + 0.25); g.fill(); }
else { g.fillStyle = 'rgba(200,210,230,0.06)'; g.fillRect(z0, -h1, z1 - z0, h1 - h0); }
e.at((z0 + z1) / 2, -(h0 + h1) / 2);
` });
el({ id: 'pane_rain', name: 'Drops on the glass', on: 'square_window', across: 1.5, elevation: 1.35, distance: -0.03, particles: { kind: 'drops', source: [0.5, 0, 0.55], flat: true, rate: 4, amount: 'rain_window' } });
el({ id: 'wall_e', name: 'Wall with the door', across: 2, distance: 3.5, facing: 270, height: 2.6, box: [-0.1, -2.7, 3.6, 0.05], ...IN }, { code: `
// The right wall (its x runs from the ports' wall toward the opposite one: x = 3.5 − z): over the bench a shelf of
// cans; the door's opening (the leaf is booth_door); the nail where the slate hangs in 1988 (slate_nail)
const L = e.lib, G = L.G, H = G.CEIL, ruin = e.state.era === 'ruin', X = z => 3.5 - z;
const d0 = X(G.DOOR[1]), d1 = X(G.DOOR[0]);
g.save(); g.beginPath(); g.rect(-0.1, -H - 0.1, 3.7, H + 0.15); g.rect(d0, -G.DOOR_H, d1 - d0, G.DOOR_H); g.clip('evenodd');
L.plaster(g, -0.1, -H - 0.1, 3.7, H + 0.15, ruin ? '#7e7466' : '#7c6852', 37, ruin);
g.fillStyle = '#3e3024'; g.fillRect(-0.1, -0.12, 3.7, 0.12);
g.restore();
g.fillStyle = '#3a2c20'; g.fillRect(d0 - 0.07, -G.DOOR_H - 0.07, 0.07, G.DOOR_H + 0.07); g.fillRect(d1, -G.DOOR_H - 0.07, 0.07, G.DOOR_H + 0.07); g.fillRect(d0 - 0.07, -G.DOOR_H - 0.07, d1 - d0 + 0.14, 0.07);
L.cans(g, X(G.BENCH[3]) + 0.02, -1.8, G.BENCH[3] - G.BENCH[2] - 0.04, 7, ruin);
g.strokeStyle = '#3a2c20'; g.lineWidth = 0.02; g.beginPath(); g.moveTo(X(G.BENCH[3]) + 0.05, -1.8); g.lineTo(X(G.BENCH[3]) + 0.15, -1.66); g.moveTo(X(G.BENCH[2]) - 0.05, -1.8); g.lineTo(X(G.BENCH[2]) - 0.15, -1.66); g.stroke();
// a poster of a film pinned by the bench
if (!ruin) { g.fillStyle = '#c9b48a'; g.fillRect(X(2.95) - 0.2, -2.15, 0.4, 0.55); e.kit.kino.frame(g, 'romance', X(2.95) - 0.17, -2.1, 0.34, 0.26); g.fillStyle = '#7a2a22'; g.fillRect(X(2.95) - 0.17, -1.78, 0.34, 0.06); }
g.fillStyle = '#2a2420'; g.fillRect(X(G.SLATE[0]) - 0.01, -G.SLATE[1] - 0.02, 0.02, 0.02);   // the nail
` });
el({ id: 'landing_floor', name: 'Stair landing', plane: true, across: 2.7, distance: 0.55, elevation: 0, width: 1.4, depth: 2.4, walk: true }, { code: `
g.fillStyle = '#4a4238'; g.fillRect(-0.7, -1.2, 1.4, 2.4);
for (let i = 0; i < 6; i++) { g.fillStyle = i % 2 ? '#4f463b' : '#453d33'; g.fillRect(-0.7, -1.2 + i * 0.4, 1.4, 0.38); }
` });
el({ id: 'landing', name: 'Stair', across: 3.3, distance: 0.55, facing: 270, height: 2.6, box: [-1.45, -2.7, 1.45, 0.05] }, { code: `
// the stair landing's far wall seen through the door: limewash, the stair going down, a bare bulb
const an = e.anim;
g.fillStyle = '#5e564c'; g.fillRect(-1.45, -2.7, 2.9, 2.75);
for (let i = 0; i < 40; i++) { g.fillStyle = 'rgba(40,32,26,0.12)'; g.fillRect(-1.3 + an.hash(i, 1) * 2.4, -2.6 + an.hash(i, 2) * 2.4, 0.1 + an.hash(i, 3) * 0.3, 0.06); }
g.fillStyle = '#3e372f'; g.fillRect(-1.45, -0.9, 2.9, 0.95);
g.strokeStyle = '#3a332b'; g.lineWidth = 0.04; g.beginPath(); g.moveTo(-1.3, -1.0); g.lineTo(0.3, -0.1); g.stroke();
g.fillStyle = '#e8e2d0'; g.beginPath(); g.arc(0.0, -2.25, 0.04, 0, Math.PI * 2); g.fill();
g.strokeStyle = '#2a2622'; g.lineWidth = 0.01; g.beginPath(); g.moveTo(0.0, -2.6); g.lineTo(0.0, -2.29); g.stroke();
e.light(0.0, -2.25, 0.08, '#efe6cc', 0.8, 'bulb');
`, animate: `e.glow('bulb', Math.max(0, Math.min(1, e.state.stair || 0)));` });
el({ id: 'landing_window', name: 'Stair window', across: 3.28, distance: 0.55, facing: 270, glows: true, height: 0.8, box: [-0.36, -2.0, 0.36, -1.15] }, { code: `
// the stair's small window, seen through the door: the same sky as the booth's window; rain runs down it (a layer by
// rain_window — autumn)
const S = e.state;
e.kit.nebo.pane(g, -0.3, -1.95, 0.3, -1.2, S.hour, S.era === 'ruin' ? 'now' : S.era, e.anim);
e.layer('rain', { drift: [0, 0.9], box: [-0.3, -1.95, 0.3, -1.2] }, l => {
  l.strokeStyle = 'rgba(210,220,235,0.55)'; l.lineWidth = 0.004;
  for (let i = 0; i < 70; i++) { const x = -0.3 + e.anim.hash(i, 7) * 0.6, y = -1.95 + e.anim.hash(i, 8) * 0.75; l.beginPath(); l.moveTo(x, y); l.lineTo(x - 0.008, y + 0.06 + e.anim.hash(i, 9) * 0.05); l.stroke(); }
});
e.layer('frame', {}, l => { l.strokeStyle = '#3a3128'; l.lineWidth = 0.04; l.strokeRect(-0.3, -1.95, 0.6, 0.75); l.fillStyle = '#3a3128'; l.fillRect(-0.015, -1.95, 0.03, 0.75); });
`, animate: `e.layer('rain').alpha = Math.max(0, Math.min(1, e.state.rain_window || 0));` });
el({ id: 'booth_door', name: 'Booth door', across: 2, distance: 0.1, facing: 270, place: { facing: 'door_f' }, height: 2, box: [-0.95, -2.05, 0.05, 0.02], ...IN }, { code: `
// The door's leaf, painted from its hinge (z 0.1, at x 0) along the wall: planks, a brace, a latch; it opens into
// the room and at door 1 lies along the opposite wall — over the calendar (door_f, the script's)
const ruin = e.state.era === 'ruin';
g.fillStyle = ruin ? '#7a6c5c' : '#8a6a4a'; g.fillRect(-0.9, -2.0, 0.9, 2.0);
for (let x = -0.9, k = 0; x < 0; x += 0.15, k++) { g.fillStyle = ruin ? (k % 2 ? '#827462' : '#766856') : k % 2 ? '#93734f' : '#866647'; g.fillRect(x, -2.0, 0.14, 2.0); }
g.fillStyle = ruin ? '#5e5244' : '#6a4c32'; g.fillRect(-0.87, -1.7, 0.84, 0.1); g.fillRect(-0.87, -0.45, 0.84, 0.1);
g.save(); g.translate(-0.45, -1.07); g.rotate(1.2); g.fillRect(-0.62, -0.05, 1.24, 0.1); g.restore();
g.fillStyle = '#2a2724'; g.fillRect(-0.84, -1.05, 0.08, 0.04);
e.at(-0.82, -1.03, 'edge');
` });
el({ id: 'wall_calendar', name: 'Calendar', across: 1.6, distance: 0.015, elevation: 1.13, facing: 0, height: 0.78, box: [-0.25, -0.8, 0.25, 0.02], ...IN }, { code: `
// The wall calendar of 1958 behind the door's leaf (scenes.md: hung only from chapter IV — month 'none': only the
// nail). 8 — open at August (Elena's pencil lines: layers by \`written\`); 9 — September, August turned up over the
// top (its edge with the pencil showing); 12 — December, the months before turned over the top; in 1988 dusty.
const m = e.state.month, ruin = e.state.era === 'ruin';
g.fillStyle = '#2a2420'; g.fillRect(-0.01, -0.79, 0.02, 0.03);
if (m === 'none' || m == null) { e.at(0, -0.35, 'page'); return; }
const NAME = { 8: 'AGOSTO', 9: 'SETTEMBRE', 12: 'DICEMBRE' }[m] ?? 'AGOSTO';
const PIC = { 8: ['#6a8ca0', '#c9b48a'], 9: ['#8a9a7a', '#b8a070'], 12: ['#8a96a8', '#e8e8e8'] }[m] ?? ['#6a8ca0', '#c9b48a'];
// the sheets turned over the top: their edges above the nail
const over = m === 12 ? 4 : m === 9 ? 1 : 0;
for (let k = 0; k < over; k++) { g.fillStyle = k % 2 ? '#cfc6ae' : '#d8cfb8'; g.fillRect(-0.22 + k * 0.004, -0.76 - k * 0.012, 0.44, 0.03); }
if (over && m === 9) { g.strokeStyle = 'rgba(50,46,48,0.8)'; g.lineWidth = 0.003; g.beginPath(); g.moveTo(-0.15, -0.75); for (let x = -0.15; x < 0.1; x += 0.012) g.lineTo(x + 0.006, -0.75 + Math.sin(x * 160) * 0.004); g.stroke(); }
g.fillStyle = ruin ? '#c4baa0' : '#d8cfb8'; g.fillRect(-0.22, -0.72, 0.44, 0.7);
g.fillStyle = PIC[0]; g.fillRect(-0.19, -0.69, 0.38, 0.22);
g.fillStyle = PIC[1]; g.beginPath(); g.moveTo(-0.19, -0.52); g.quadraticCurveTo(0, -0.58, 0.19, -0.5); g.lineTo(0.19, -0.47); g.lineTo(-0.19, -0.47); g.fill();
g.save(); g.scale(0.01, 0.01); g.fillStyle = '#7a2a22'; g.font = '700 3.5px serif'; g.textAlign = 'center'; g.fillText(NAME + ' 1958', 0, -42); g.restore();
g.strokeStyle = 'rgba(60,50,40,0.5)'; g.lineWidth = 0.002;
for (let r = 0; r < 6; r++) for (let c = 0; c < 7; c++) g.strokeRect(-0.19 + c * 0.054, -0.38 + r * 0.055, 0.054, 0.055);
if (m === 8) for (let k = 0; k < 4; k++) e.layer('line' + k, {}, l => {
  l.strokeStyle = 'rgba(50,46,48,0.85)'; l.lineWidth = 0.004;
  const y = -0.34 + k * 0.06; l.beginPath(); l.moveTo(-0.17, y);
  for (let x = -0.17; x < 0.15 - (k === 3 ? 0.12 : 0); x += 0.012) l.lineTo(x + 0.006, y + Math.sin(x * 180 + k) * 0.006);
  l.stroke();
});
if (ruin) { g.fillStyle = 'rgba(150,140,120,0.35)'; g.fillRect(-0.22, -0.72, 0.44, 0.7); }
e.at(0, -0.35, 'page');
`, animate: `
if (e.state.month !== 8) return;
const w = Math.max(0, Math.min(1, e.state.written || 0));
for (let k = 0; k < 4; k++) e.layer('line' + k).alpha = Math.max(0, Math.min(1, w * 4 - k));
` });
el({ id: 'bench', name: 'Bench', across: 1.5, distance: 1.9, facing: 270, height: 0.85, box: [-0.55, -0.9, 0.55, 0.02], ...IN }, { code: `
// The workbench's front along the right wall (its x runs from the ports' end toward the door): dark planks, a drawer;
// a pencil lies at its near end (bench#pencil)
const ruin = e.state.era === 'ruin';
g.fillStyle = ruin ? '#4a4036' : '#4a3626'; g.fillRect(-0.5, -0.85, 1.0, 0.85);
g.fillStyle = '#3a2a1c'; g.fillRect(-0.5, -0.85, 1.0, 0.05); g.fillRect(-0.46, -0.8, 0.06, 0.8); g.fillRect(0.4, -0.8, 0.06, 0.8);
g.fillStyle = ruin ? '#524638' : '#5a4430'; g.fillRect(-0.28, -0.72, 0.56, 0.18);
g.fillStyle = '#b0a080'; g.fillRect(-0.03, -0.64, 0.06, 0.02);
e.at(0.38, -0.87, 'pencil');
` });
el({ id: 'bench_top', name: 'Bench top', plane: true, across: 1.75, distance: 1.9, elevation: 0.85, width: 0.5, depth: 1.0, shadow: true, ...IN }, { code: `
const ruin = e.state.era === 'ruin';
g.fillStyle = ruin ? '#5a4e40' : '#5e4632'; g.fillRect(-0.25, -0.5, 0.5, 1.0);
g.fillStyle = 'rgba(30,20,12,0.25)'; for (let i = 0; i < 6; i++) g.fillRect(-0.25, -0.5 + i * 0.17, 0.5, 0.01);
if (!ruin) { g.fillStyle = '#a8a088'; g.fillRect(-0.15, 0.32, 0.03, 0.12); }
` });
el({ id: 'press', name: 'Press and rewinder', across: 1.78, distance: 2.2, elevation: 0.85, facing: 270, height: 0.42, box: [-0.35, -0.45, 0.35, 0.02], ...IN }, { code: `
// on the bench: the splicing press, the rewinder with a reel full of film and paper bookmarks, a pot of cement
const ruin = e.state.era === 'ruin';
g.fillStyle = ruin ? '#5a4436' : '#3a3a3e'; g.fillRect(-0.28, -0.08, 0.2, 0.08); g.fillRect(-0.24, -0.16, 0.12, 0.08);
g.fillStyle = ruin ? '#6a5040' : '#6a6a70'; g.fillRect(-0.3, -0.18, 0.24, 0.025);
g.fillStyle = '#2e2e32'; g.fillRect(0.12, -0.06, 0.03, 0.06);
if (!ruin) {
  g.fillStyle = '#4a4b50'; g.beginPath(); g.arc(0.135, -0.24, 0.17, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#26272b'; g.beginPath(); g.arc(0.135, -0.24, 0.13, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#e8e0c8'; for (const a of [-1.2, -0.6, 0.2]) { g.save(); g.translate(0.135 + Math.cos(a) * 0.13, -0.24 + Math.sin(a) * 0.13); g.rotate(a); g.fillRect(0, -0.008, 0.06, 0.016); g.restore(); }
}
g.fillStyle = '#6a5a40'; g.fillRect(-0.02, -0.07, 0.06, 0.07);
e.at(-0.18, -0.12, 'press');
` });
el({ id: 'clips', name: 'Clippings', across: 1.62, distance: 1.75, elevation: 0.86, facing: 270, height: 0.05, box: [-0.2, -0.04, 0.2, 0.01], ...IN }, { code: `
// the cut kisses lying on the bench (while \`clips\`)
if (!e.state.clips) return;
for (let i = 0; i < 3; i++) { g.save(); g.translate(-0.12 + i * 0.1, -0.012); g.rotate(-0.3 + i * 0.25); g.fillStyle = '#2a211b'; g.fillRect(-0.04, -0.01, 0.08, 0.02); g.fillStyle = '#e8e0c8'; g.fillRect(-0.01, -0.03, 0.012, 0.025); g.restore(); }
` });
el({ id: 'tin', name: 'Tin', across: 1.65, distance: 2.0, elevation: 0.85, height: 0.1, box: [-0.15, -0.2, 0.3, 0.02], ...IN }, { code: `
// The flat round film tin on the bench: its lid a layer lifted aside while \`tin_open\`; gone when it is in Alfredo's
// pocket (\`tin_at\`) and in 1988 (Salvatore brings it himself)
if (e.state.tin_at !== 'bench' || e.state.era === 'ruin') return;
g.fillStyle = '#7a7a7e'; g.beginPath(); g.ellipse(0, -0.02, 0.11, 0.035, 0, 0, Math.PI * 2); g.fill();
g.fillStyle = '#5a5a5e'; g.fillRect(-0.11, -0.02, 0.22, 0.02);
g.fillStyle = '#2a2826'; g.beginPath(); g.ellipse(0, -0.04, 0.09, 0.025, 0, 0, Math.PI * 2); g.fill();
g.fillStyle = '#c8c0b0'; for (let k = 0; k < 4; k++) g.fillRect(-0.05 + k * 0.025, -0.05, 0.015, 0.01);
e.layer('lid', { pivot: [0.11, -0.04], box: [-0.15, -0.2, 0.3, 0.02] }, l => {
  l.fillStyle = '#8a8a8e'; l.beginPath(); l.ellipse(0, -0.05, 0.115, 0.035, 0, 0, Math.PI * 2); l.fill();
  l.fillStyle = '#6a6a6e'; l.fillRect(-0.115, -0.05, 0.23, 0.015);
});
e.at(0, -0.05);
`, animate: `
if (e.state.tin_at !== 'bench' || e.state.era === 'ruin') return;
const o = Math.max(0, Math.min(1, e.state.tin_open || 0)), l = e.layer('lid');
l.rotate = -o * 2.6; l.y = -o * 0.02;
` });
el({ id: 'lamp', name: 'Lamp over the bench', across: 1.72, distance: 1.9, elevation: 1.62, height: 1, box: [-0.2, -1.0, 0.2, 0.04], ...IN }, { code: `
// the lamp over the bench: a cord from the ceiling, an enamel shade, its bulb (the scene's light lamp_light); in 1988
// a bare socket, the shade cracked
const ruin = e.state.era === 'ruin';
g.strokeStyle = '#1e1c1a'; g.lineWidth = 0.012; g.beginPath(); g.moveTo(0, -0.98); g.lineTo(0, -0.12); g.stroke();
g.fillStyle = ruin ? '#3a4038' : '#2a3a32'; g.beginPath(); g.moveTo(-0.16, 0); g.lineTo(-0.06, -0.12); g.lineTo(0.06, -0.12); g.lineTo(0.16, 0); g.closePath(); g.fill();
g.fillStyle = ruin ? '#8a8478' : '#d8d0b8'; g.beginPath(); g.ellipse(0, 0, 0.16, 0.025, 0, 0, Math.PI * 2); g.fill();
if (!ruin) e.light(0, 0.0, 0.06, '#ffd09a', 1, 'bulb');
e.at(0, -0.05);
`, animate: `if (e.state.era !== 'ruin') e.glow('bulb', Math.max(0, Math.min(1, e.state.lamp ?? 1)));` });
el({ id: 'stool', name: 'Stool', across: 0.9, distance: 1.4, height: 0.5, box: [-0.22, -0.54, 0.22, 0.02], ...IN }, { code: `
// the operator's stool: a round wooden seat on three legs
g.fillStyle = e.state.era === 'ruin' ? '#4a4036' : '#4a3624'; g.fillRect(-0.18, -0.5, 0.36, 0.05);
g.strokeStyle = '#3e2c1e'; g.lineWidth = 0.03; g.beginPath(); g.moveTo(-0.14, -0.46); g.lineTo(-0.18, 0); g.moveTo(0.14, -0.46); g.lineTo(0.18, 0); g.moveTo(0, -0.46); g.lineTo(0, 0); g.stroke();
` });
el({ id: 'crate', name: 'Crate', across: -0.75, distance: 2.03, place: { across: 'crate_a', distance: 'crate_d' }, facing: 180, height: 0.4, box: [-0.85, -0.4, 0.85, 0], shadow: true, ...IN }, { code: `
// the boy's crate (a form: a box of planks 0.5 × 0.35 × 0.4, its anchor at its front face): stencilled with a film
// company's name on its front and back
g.fillStyle = '#6b5236'; g.fillRect(-0.85, -0.4, 1.7, 0.4);
g.strokeStyle = '#4a3824'; g.lineWidth = 0.015; for (let y = -0.4; y < 0; y += 0.1) { g.beginPath(); g.moveTo(-0.85, y); g.lineTo(0.85, y); g.stroke(); }
g.fillStyle = '#4a3824'; for (const x of [-0.85, -0.35, 0, 0.5]) g.fillRect(x, -0.4, 0.025, 0.4);
g.save(); g.scale(0.01, 0.01); g.fillStyle = 'rgba(30,24,20,0.6)'; g.font = '700 5px sans-serif'; g.textAlign = 'center'; g.fillText('TITANUS', -60, -17); g.fillText('TITANUS', 25, -17); g.restore();
e.form(e.lib.boxForm(0.5, 0.35, 0.4, 0), { closed: 'u' });
` });
el({ id: 'crate_top', name: 'Crate top', plane: true, on: 'crate', across: 0, distance: 0.175, elevation: 0.4, width: 0.5, depth: 0.35, walk: true, ...IN }, { code: `
g.fillStyle = '#7a5e3e'; g.fillRect(-0.25, -0.175, 0.5, 0.35);
g.fillStyle = '#5a4428'; for (let k = 0; k < 4; k++) g.fillRect(-0.25, -0.175 + k * 0.088, 0.5, 0.008);
` });
el({ id: 'box', name: 'Box of film', across: 1.7, distance: 2.95, place: { across: 'box_a', distance: 'box_d' }, facing: 180, height: 0.36, box: [-0.74, -0.36, 0.74, 0], shadow: true, ...IN }, { code: `
// a low box of film cans (a form 0.44 × 0.3 × 0.36, its anchor at its middle): the boy's seat by the stool
g.fillStyle = '#5a4630'; g.fillRect(-0.74, -0.36, 1.48, 0.36);
g.fillStyle = '#4a3a28'; g.fillRect(-0.74, -0.36, 1.48, 0.04); for (const x of [-0.74, -0.3, 0, 0.44]) g.fillRect(x, -0.36, 0.02, 0.36);
g.save(); g.scale(0.01, 0.01); g.fillStyle = 'rgba(30,24,20,0.55)'; g.font = '700 4px sans-serif'; g.textAlign = 'center'; g.fillText('LUX FILM', -52, -16); g.fillText('LUX FILM', 22, -16); g.restore();
e.form(e.lib.boxForm(0.44, 0.3, 0.36, 0.15), { closed: 'u' });
` });
el({ id: 'box_top', name: 'Box lid', plane: true, on: 'box', across: 0, distance: 0, elevation: 0.36, width: 0.44, depth: 0.3, ...IN }, { code: `
g.fillStyle = '#665038'; g.fillRect(-0.22, -0.15, 0.44, 0.3);
` });

// ── the projectors: an unseen anchor each (projector 1 turns to the window by \`turned\`), the body a form, the
// pedestal a lathe's form, the side card in its middle (the reels, the chimney, the lens), the vents' glow, the crank,
// the beam into the hall ──
for (const [n, id, x, inner, turn] of [[1, 'projector', -0.75, 'right', 'p1_f'], [2, 'projector2', 0.75, 'left', null]]) {
  const a = `p${n}`, sgn = inner === 'right' ? 1 : -1;
  el({ id: a, name: `Projector ${n} (base)`, unseen: true, across: x, distance: 3.0, facing: 180, ...(turn ? { place: { facing: turn } } : {}) });
  el({ id, name: n === 1 ? 'Projector' : 'Second projector', on: a, across: 0, distance: 0, elevation: 0.9, facing: 180, height: 0.8, box: [-1.3, -0.8, 1.3, 0], shadow: true, ...IN }, { code: `
// Projector ${n}'s body: a box of iron (a form), the lamp house's vents and the lever at its back, the mechanism and
// the gate on its sides, the motor's crank boss on the inner side; rusted in 1988. Points: lever, motor, gate, lens, side.
e.lib.projBody(g, e, '${inner}', e.state.era === 'ruin');
e.form(e.lib.projBodyForm, { closed: 'u' });
` });
  el({ id: `${a}_ped`, name: `Projector ${n} stand`, on: a, across: 0, distance: 0, elevation: 0, facing: 180, height: 0.9, box: [-0.4, -1.0, 0.4, 0], shadow: true, ...IN }, { code: `
// the cast-iron pedestal: a column on a round foot
g.fillStyle = e.state.era === 'ruin' ? '#4a3a30' : '#2b2a2c'; g.fillRect(-0.4, -1.0, 0.8, 1.0);
g.fillStyle = 'rgba(255,255,255,0.05)'; g.fillRect(-0.4, -0.2, 0.8, 0.03);
e.form(e.kit.revolve([[0.08, 0.9], [0.09, 0.86], [0.11, 0.15], [0.22, 0.05], [0.24, 0]]), { closed: 'u' });
` });
  el({ id: `${a}_side`, name: `Projector ${n} reels`, on: a, across: 0, distance: 0, facing: 90, height: 2.5, box: [-0.5, -2.55, 0.6, 0.02], ...IN }, { code: `
// projector ${n} side-on through its middle: the reels (layers turning while its motor runs; none in 1988), their arms,
// the chimney, the lens barrel
e.lib.projProfile(g, e, e.state.era === 'ruin');
`, animate: `
if (e.state.era === 'ruin') return;
const m = e.mem;
m.ph = (m.ph || 0) + e.dt * 3.0 * Math.max(0, Math.min(1, e.state.motor${n} || 0));
e.layer('rt').rotate = m.ph; e.layer('rl').rotate = m.ph * 1.25;
` });
  el({ id: `${a}_vents`, name: `Projector ${n} lamp house`, on: a, across: 0, distance: -0.41, elevation: 0.9, facing: 180, height: 0.8, box: [-0.2, -0.8, 0.2, 0.02], ...IN }, { code: `
// the lamp house's vents glowing while projector ${n} throws its beam (its light: p${n}_lamp)
if (e.state.era === 'ruin') return;
e.light(0, -0.62, 0.12, '#ffb860', 0.8, 'vents');
e.at(0, -0.62, 'vents');
`, animate: `
const S = e.state, on = S.era === 'ruin' ? 0 : Math.max(0, Math.min(1, S.beam_on || 0)) * (S.active === ${n} ? 1 : 0);
if (S.era !== 'ruin') e.glow('vents', on * (0.9 + 0.1 * Math.sin(e.t * 13)));
` });
  el({ id: `${a}_crank`, name: `Motor ${n} crank`, on: a, across: sgn * 0.265, distance: 0, elevation: 1.1, facing: inner === 'right' ? 90 : 270, height: 0.3, box: [-0.16, -0.16, 0.16, 0.16], ...IN }, { code: `
// the motor's crank on the inner side: an arm and a wooden handle turning about the boss
e.layer('arm', { pivot: [0, 0] }, c => {
  c.strokeStyle = '#2a2622'; c.lineWidth = 0.022; c.lineCap = 'round';
  c.beginPath(); c.moveTo(0, 0); c.lineTo(0, 0.12); c.stroke();
  c.fillStyle = e.state.era === 'ruin' ? '#4a3020' : '#6a3a24'; c.fillRect(-0.015, 0.1, 0.03, 0.05);
});
`, animate: `
const m = e.mem, S = e.state;
m.cr = (m.cr || 0) + e.dt * 4.2 * (S.crank || 0) * (${n} === 1 ? 1 : 0);
e.layer('arm').rotate = m.cr;
` });
  el({ id: `${a}_knob`, name: `Motor ${n} handle`, on: a, across: sgn * 0.33, distance: 0.0, elevation: 1.1, facing: 180, height: 0.3, box: [-0.06, -0.2, 0.06, 0.2], ...IN }, { code: `
// the crank's wooden handle sticking out of the inner side, seen from behind: it rises and falls as the crank turns
e.layer('k', {}, l => {
  l.fillStyle = '#2a2622'; l.fillRect(-0.035, -0.012, 0.03, 0.024);
  l.fillStyle = e.state.era === 'ruin' ? '#5a3a26' : '#9a6a3e'; l.beginPath(); l.ellipse(0.012 * ${sgn}, 0, 0.026, 0.036, 0, 0, Math.PI * 2); l.fill();
  l.fillStyle = 'rgba(255,230,190,0.35)'; l.beginPath(); l.ellipse(0.004 * ${sgn}, -0.012, 0.01, 0.012, 0, 0, Math.PI * 2); l.fill();
});
`, animate: `
const m = e.mem;
m.cr = (m.cr || 0) + e.dt * 4.2 * (e.state.crank || 0) * (${n} === 1 ? 1 : 0);
e.layer('k').y = 0.12 * Math.cos(m.cr);
` });
  // (the beams into the hall are behind the ports' wall from anywhere in the booth: only projector 1's is seen —
  // turned to the window on the square, out through it into the night; it is short: what is past the window is not seen)
  if (n === 1) el({ id: 'beam', name: 'Beam', on: a, across: 0, distance: 0.5, elevation: 1.5, facing: 90, glows: true, height: 0.8, box: [-0.1, -0.5, 4.8, 0.5], uniforms: { on: 0 } }, { code: `
// projector 1's beam out of its lens (kino.beam: a wedge of light); seen when it is turned to the window on the square
e.kit.kino.beam(e, { len: 4.6, top: -0.32, bot: 0.32, mouth: 0.04, dust: 90, drift: 0.7, tipRadius: 0.6, tipStrength: 0.3 });
`, animate: `
const S = e.state, on = S.era === 'ruin' ? 0 : Math.max(0, Math.min(1, S.beam_on || 0)) * (S.active === ${n} ? 1 : 0);
const fl = S.jitter ? 0.6 + 0.4 * Math.abs(Math.sin(e.t * 17)) : 1;
e.kit.kino.beamMove(e, on * fl * (1 - 0.6 * Math.max(0, Math.min(1, S.fire || 0))));
` });
}

// ── fire, smoke, motes, feathers ──
el({ id: 'fire', name: 'Fire in the gate', particles: { kind: 'fire', at: 'projector#gate', amount: 'fire', size: [0.26, 0.05], rate: 120, color: ['#ffd27a', '#e8400c'], glow: [3, 1] }, ...IN });
el({ id: 'fire_lens', name: 'Fire at the lens', particles: { kind: 'fire', at: 'projector#lens', amount: 'fire', size: [0.22, 0.05], rate: 80, color: ['#ffd27a', '#e8400c'], glow: [3, 1] }, ...IN });
el({ id: 'fire_reel', name: 'Fire along the reel', particles: { kind: 'fire', at: 'p1_side#reel', amount: 'fire', size: [0.3, 0.06], rate: 140, source: [0.2, 0.35, 0.35], color: ['#ffd27a', '#e8400c'], glow: [3, 1] }, ...IN });
el({ id: 'embers', name: 'Sparks', particles: { kind: 'embers', at: 'projector#gate', amount: 'fire', rate: 12 }, ...IN });
el({ id: 'smoke_gate', name: 'Smoke from the film', particles: { kind: 'smoke', at: 'projector#gate', amount: 'smoke', rate: 8, size: [0.2, 1.4], life: [3, 6], gravity: -0.3, color: '#2e2a28', shadow: 0.4 }, ...IN });
el({ id: 'motes', name: 'Smoke and motes', particles: { kind: 'dust', at: [0, 1.75, 1.4], source: [3.8, 3.3, 2.4], rate: 25, life: [8, 14] }, ...IN });
el({ id: 'feathers', name: 'Pigeons\' down', particles: { kind: 'petals', at: [0.4, 2.6, 2.2], source: [2.4, 1.2, 0.4], burst: { on: 'pigeons', count: 60, over: 1.5 }, color: '#e4dfd4', size: [0.03, 0.02], gravity: 0.5, drag: 1.2, life: [4, 7], ground: 'stop', settle: 6 }, ...IN });

// ── 1988: the slate on its nail; the strip hanging from his hands ──
el({ id: 'slate_nail', name: 'Slate with the letters', across: 1.97, distance: 1.2, elevation: 1.24, facing: 270, height: 0.36, box: [-0.22, -0.38, 0.22, 0.02], ...IN }, { code: `
// The slate the boy taught Alfredo his name on, hanging on the nail in the ruined booth (1988 only): «ALFREDO» in
// faded chalk (the world's Italian letters, like its signs), each letter the player made crooked (\`slate_letters\`, the play's) leaning and askew
if (e.state.era !== 'ruin') return;
const L = 'ALFREDO', s = String(e.state.slate_letters ?? '').padEnd(L.length, '0'), an = e.anim;
g.strokeStyle = '#2a2420'; g.lineWidth = 0.004; g.beginPath(); g.moveTo(-0.1, -0.33); g.lineTo(0, -0.37); g.lineTo(0.1, -0.33); g.stroke();
g.fillStyle = '#6b4c32'; g.fillRect(-0.21, -0.33, 0.42, 0.3);
g.fillStyle = '#2c3030'; g.fillRect(-0.19, -0.31, 0.38, 0.26);
g.fillStyle = 'rgba(205,200,188,0.75)'; g.textAlign = 'center';
for (let i = 0; i < L.length; i++) {
  const crooked = s[i] === '1', x = (i - (L.length - 1) / 2) * 0.046;
  g.save(); g.translate(x, -0.15 + (crooked ? (an.hash(i, 3) - 0.5) * 0.03 : 0)); g.rotate(crooked ? (an.hash(i, 4) - 0.5) * 0.9 : 0);
  g.scale(0.01, 0.01); g.font = '5.5px serif'; g.fillText(L[i], 0, 0); g.restore();
}
g.fillStyle = 'rgba(150,146,138,0.3)'; g.fillRect(-0.19, -0.31, 0.38, 0.26);
e.at(0, -0.18);
` });
el({ id: 'hanging_strip', name: 'Strip in the hands', across: -1.62, distance: 1.02, facing: 250, height: 1.3, box: [-0.2, -1.3, 0.25, 0.02], ...IN }, { code: `
// the spliced strip hanging from his hands to the floor at the window (strip_end): a dark ribbon, its frames catching
// the window's light, curling on the floor
if (!e.state.hanging) return;
g.strokeStyle = '#2a211b'; g.lineWidth = 0.035; g.lineCap = 'round';
g.beginPath(); g.moveTo(0, -1.2); g.bezierCurveTo(0.03, -0.8, -0.04, -0.4, 0.02, -0.06); g.quadraticCurveTo(0.08, 0.0, 0.18, -0.02); g.stroke();
g.fillStyle = 'rgba(230,200,150,0.5)'; for (let i = 0; i < 10; i++) g.fillRect(-0.012 + Math.sin(i) * 0.012, -1.15 + i * 0.11, 0.024, 0.04);
` });

// ── the inserts (modules/closeups) ──
for (const [id, name] of [['splice', 'Splicing'], ['slate', 'Letters'], ['thread', 'Threading'], ['calendar', 'Calendar close-up'], ['strip', 'Strip against the window']]) {
  el({ id, name, insert: id }, { code: `e.kit.closeups.${id}(g, e);`, animate: `e.kit.closeups.${id}Move(e);` });
}

// ── the people ──
for (const [id, name, who, at] of [['alfredo', 'Alfredo', 'alfredo', [1.2, 1.9]], ['toto', 'Totò', 'toto_boy', [2.6, 0.5]], ['elena', 'Elena', 'elena', [2.6, 0.5]]]) {
  el({ id, name, person: { cast: 'cast', who }, across: at[0], distance: at[1], place: { across: `${id}_a`, distance: `${id}_d` }, shadow: true, ...IN });
}

// ── the spec ──
const st = (o) => o;
const spec = {
  engine: 3,
  title: 'The Booth',
  caption: 'The Paradiso\'s booth',
  horizon: 0.5,
  camera: { mode: 'roam', area: [-1.95, 1.95, 0.05, 3.45] },
  light: {
    ambient: 0.44, ambientColor: '#76666e', tint: '#2a1e22', tintStrength: 0.04, vignette: 0.42, grain: 0.2,
    haze: 0.08, hazeColor: '#3a2e24', hazeGlow: 1.1, shafts: 0, bounce: 0.55, brightness: 1.16, saturation: 0.95, inside: 0.3,
    looks: {
      night_k: { ambient: 0.34, ambientColor: '#5a5068', lights: { window_light: 0.9 } },
      eve_k: { ambient: 0.34, ambientColor: '#6a5a70', lights: { window_light: 0.7 } },
      dawn_k: { ambient: 0.42, ambientColor: '#8a8090', tint: '#6a6a80', tintStrength: 0.05, lights: { window_light: 1.4 } },
      ruin_k: { ambient: 0.82, ambientColor: '#a6abbc', saturation: 0.7, tint: '#5a6278', tintStrength: 0.06, brightness: 1.3, haze: 0.1, hazeColor: '#5a5e68', hazeGlow: 0.6, lights: { window_light: 2.6, lamp_light: 0, sconce_light: 0 } },
      smoke: { haze: 0.7, hazeColor: '#4a443e', hazeGlow: 0.9, ambient: 0.34 },
    },
  },
  lights: [
    { id: 'lamp_light', of: 'lamp#bulb', color: '#ffcf94', strength: 1.7, reach: 5, on: 'lamp' },
    { id: 'p1_lamp', of: 'p1_vents#vents', color: '#ffb860', strength: 0.9, reach: 2.4, on: 'p1_on', flicker: 0.06 },
    { id: 'p2_lamp', of: 'p2_vents#vents', color: '#ffb860', strength: 0.9, reach: 2.4, on: 'p2_on', flicker: 0.06 },
    { id: 'sconce_light', of: 'sconce#bulb', color: '#ffcf94', strength: 0.8, reach: 3.2, on: 'lamp' },
    { id: 'stair_light', of: 'landing#bulb', color: '#e8dfc4', strength: 1.0, reach: 3.5, on: 'stair' },
    { id: 'window_light', across: -1.75, distance: 1.5, elevation: 1.4, color: '#8fa4d8', strength: 0.9, reach: 5 },
    { id: 'fire_light', across: -1.0, distance: 2.75, elevation: 1.6, color: '#ff9a4a', strength: 2.2, reach: 4, on: 'fire', flicker: 0.35 },
  ],
  state: {},
  states: {},
  objects,
  modules: ['cast', 'kino', 'closeups', 'nebo', 'beats'],
  music: MUSIC,
};
// the keys (scenes.md "The booth", "Keys"; the people's are the engine's)
const S = {
  beat: [{ type: 'string', means: 'the beat the scene plays (the game sets it)' }, ''],
  beat_next: [{ type: 'string', means: 'the beat whose shot to make ready ahead (the game sets it; the module beats)' }, ''],
  hour: [{ range: [0, 1], means: '0.25 dawn, 0.78 evening, 0.9 night' }, 0.9],
  era: [{ values: ['past', 'ruin'], means: 'past — the booth alive (1949–1959); ruin — 1988: rust, projectors without reels, the panes knocked out, down, no lamp' }, 'past'],
  night_k: [{ range: [0, 1], smooth: true, means: 'internal: the night\'s light (the scene — from hour)' }, 1],
  eve_k: [{ range: [0, 1], smooth: true, means: 'internal: the evening\'s light' }, 0],
  dawn_k: [{ range: [0, 1], smooth: true, means: 'internal: the dawn\'s light' }, 0],
  ruin_k: [{ range: [0, 1], smooth: true, means: 'internal: the light of the 1988 ruin (the scene — from era)' }, 0],
  lamp: [{ range: [0, 1], smooth: true, means: 'the lamp over the bench' }, 1],
  door: [{ range: [0, 1], smooth: true, means: 'the door: 0 shut … 1 open inward, lying on the wall opposite the ports (it hides the calendar)' }, 0],
  door_f: [{ type: 'number', smooth: true, means: 'internal: the turn of the leaf, degrees (the scene — from door)' }, 270],
  stair: [{ range: [0, 1], smooth: true, means: 'the bulb on the stair beyond the door' }, 0],
  beam_on: [{ range: [0, 1], smooth: true, means: 'the beam into the hall from the port active' }, 0],
  active: [{ values: [1, 2], means: 'which projector throws its beam into the hall' }, 1],
  motor1: [{ range: [0, 1], smooth: true, means: 'the first projector\'s reels turn' }, 1],
  motor2: [{ range: [0, 1], smooth: true, means: 'the second projector\'s reels turn' }, 0],
  p1_on: [{ range: [0, 1], smooth: true, means: 'internal: the first one\'s lamp house is lit (the scene — from beam_on, active)' }, 0],
  p2_on: [{ range: [0, 1], smooth: true, means: 'internal: the second one\'s lamp house is lit' }, 0],
  crank: [{ range: [0, 1], means: 'Alfredo turns the first one\'s motor crank (the beat motor)' }, 0],
  jitter: [{ values: [0, 1], means: 'internal: the frame in the beam trembles (the beat motor with stutter)' }, 0],
  stutter: [{ values: [0, 1], means: 'in motor the frame trembles till Alfredo knocks on the casing (the loop not held in «Threading»; the game sets it)' }, 0],
  turned: [{ range: [0, 1], smooth: true, means: 'the first projector is turned to the port on the square' }, 0],
  p1_f: [{ type: 'number', smooth: true, means: 'internal: the first projector\'s turn, degrees (the scene — from turned)' }, 180],
  fire: [{ range: [0, 1], smooth: true, means: 'fire in the first projector\'s gate' }, 0],
  smoke: [{ range: [0, 1], smooth: true, means: 'smoke in the booth' }, 0],
  clock: [{ range: [6, 10], smooth: true, means: 'the clock over the look port: 6…10 in the evening' }, 6],
  month: [{ values: ['none', 8, 9, 12], means: 'the calendar\'s leaf in view; none — no calendar (chapters I–III); set by the beats only' }, 'none'],
  written: [{ range: [0, 1], smooth: true, means: 'internal: Elena writes on August (the beat note)' }, 0],
  tin_open: [{ range: [0, 1], smooth: true, means: 'the tin on the bench is open' }, 0],
  tin_at: [{ values: ['bench', 'pocket'], means: 'the tin on the bench or in Alfredo\'s pocket' }, 'bench'],
  clips: [{ values: [0, 1], means: 'the clippings of the kisses lie on the bench' }, 0],
  tail: [{ values: [0, 1], means: 'the film\'s tail flaps: the reel has run out, the hall\'s screen white' }, 0],
  cue: [{ values: [0, 1], means: 'the changeover dot in the frame\'s corner; the whole look port blinks with it' }, 0],
  white: [{ values: [0, 1], means: 'the screen is white (the changeover was missed)' }, 0],
  rain_window: [{ values: [0, 1], means: 'rain beyond the port on the square' }, 0],
  drag: [{ range: [0, 1], means: '«Pull Him Out»: where the boy drags Alfredo (0 — floor#path0, 1 — floor#path1; the game moves it)' }, 0],
  drag_at: [{ range: [0, 1], means: 'where Alfredo is on the way now (the scene sets it, at once, ten times a second)' }, 0],
  cough: [{ values: [0, 1], means: 'pulse: the boy coughs' }, 0],
  box_a: [{ type: 'number', means: 'internal: where the box of film is (across)' }, 1.7],
  box_d: [{ type: 'number', means: 'internal: where the box of film is (in depth)' }, 2.95],
  crate_a: [{ type: 'number', means: 'internal: where the boy\'s crate is (across); in the fire it is thrown to the window' }, -0.75],
  crate_d: [{ type: 'number', means: 'internal: where the crate is (in depth; its front side)' }, 2.03],
  pigeons: [{ type: 'number', means: 'pulse: the pigeons fly up (down)' }, 0],
  hanging: [{ values: [0, 1], means: 'the strip hangs from Salvatore\'s hands (strip_end)' }, 0],
  alfredo_here: [{ values: [0, 1, true, false], means: 'party key: blind Alfredo sits on the stool in reels, six, changeover; in alfredo_comes he turns rather than comes in. It is also the engine\'s key «Alfredo is in the scene»: the beats where he is always there set it themselves' }, 0],
  jumps: [{ range: [0, 3], means: 'party key: how many of kiss_cut1…3 are spliced crooked — in the insert strip they jump at the splice' }, 0],
  slate_letters: [{ type: 'string', means: 'party key: the crooked letters of the slate on the nail in 1988 (a string of 7 characters 0/1)' }, '0000000'],
  // the inserts and their keys (modules/closeups.md)
  splice: [{ range: [0, 1], smooth: true, means: 'the insert «Splicing»' }, 0],
  cut1: [{ range: [0, 1], smooth: true, means: 'the cut of the first frame' }, 0], cut2: [{ range: [0, 1], smooth: true, means: 'the cut of the second' }, 0], cut3: [{ range: [0, 1], smooth: true, means: 'the cut of the third' }, 0],
  bent1: [{ values: [0, 1], means: 'the first cut is slanted' }, 0], bent2: [{ values: [0, 1], means: 'the second slanted' }, 0], bent3: [{ values: [0, 1], means: 'the third slanted' }, 0],
  glue1: [{ range: [0, 1], smooth: true, means: 'the press pressed on the first splice' }, 0], glue2: [{ range: [0, 1], smooth: true, means: 'on the second' }, 0], glue3: [{ range: [0, 1], smooth: true, means: 'on the third' }, 0],
  boy_reach: [{ range: [0, 1], smooth: true, means: 'the boy\'s hand nearer the clippings' }, 0],
  slate: [{ range: [0, 1], smooth: true, means: 'the insert «Letters»' }, 0],
  chalk_x: [{ range: [0, 1], smooth: true, means: 'the chalk along the line' }, 0],
  letters: [{ range: [0, 7], means: 'how many letters are written' }, 0],
  crooked: [{ type: 'string', means: 'the crooked letters: a string of 7 characters 0/1' }, '0000000'],
  wobble: [{ range: [0, 1], smooth: true, means: 'the hand twitched' }, 0],
  thread: [{ range: [0, 1], smooth: true, means: 'the insert «Threading»' }, 0],
  threaded: [{ range: [0, 5], means: 'how many stretches are threaded' }, 0],
  pull: [{ range: [0, 1], smooth: true, means: 'the film\'s end along the stretch now' }, 0],
  loop: [{ values: [0, 1], means: 'the loop before the gate' }, 0],
  calendar: [{ range: [0, 1], smooth: true, means: 'the insert «Calendar» (close)' }, 0],
  pages: [{ range: [0, 4], means: 'sheets let down over December: November, October, September, August' }, 0],
  fold: [{ range: [0, 1], smooth: true, means: 'the sheet being pulled down' }, 0],
  dust: [{ range: [0, 1], smooth: true, means: 'the dust on the calendar' }, 1],
  strip: [{ range: [0, 1], smooth: true, means: 'the insert «The Strip»' }, 0],
  strip_x: [{ range: [0, 1], smooth: true, means: 'the strip from right to left' }, 0],
};
for (const [k, [d, v]] of Object.entries(S)) { spec.states[k] = d; spec.state[k] = v; }
// people's place keys and the start: Alfredo at the bench (the first pose of `cutting`)
for (const id of ['alfredo', 'toto', 'elena']) {
  spec.states[`${id}_a`] = { type: 'number', smooth: true, means: `where ${id} is, across, m` };
  spec.states[`${id}_d`] = { type: 'number', smooth: true, means: `where ${id} is, in depth, m` };
}
Object.assign(spec.state, { alfredo_a: 1.2, alfredo_d: 1.9, alfredo_turn: 90, alfredo_do: { motion: 'bench_work', loop: true }, alfredo_look: 'press#press',
  toto_a: 2.6, toto_d: 0.5, toto_here: false, elena_a: 2.6, elena_d: 0.5, elena_here: false,
  camera_x: -1.8, camera_z: 0.3, camera_h: -0.2, camera_yaw: 62, beam_on: 1, motor1: 1, p1_on: 1 });
delete spec.state.alfredo_here; spec.state.alfredo_here = true;
fs.writeFileSync(path.join(DIR, 'scene.json'), JSON.stringify(spec, null, 1) + '\n');
for (const [name, text] of Object.entries(files)) fs.writeFileSync(path.join(DIR, 'elements', name), text);
require('child_process').execSync('node tools/kino-beam.js budka beam', { cwd: path.join(__dirname, '..', '..') });
console.log(objects.length, 'elements,', Object.keys(files).length, 'files');
require('./contract.js');
