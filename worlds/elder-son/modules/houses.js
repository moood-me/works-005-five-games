// houses — the suburb's wooden things, painted in daylight colours (the scene's light makes the night): log walls with
// carved white window frames, gable ends, snowy roofs, window panes that light up, picket fences, sheds, a barrel, a
// bench, a lamp on a pole, birches, crosses. Metres, y down, the anchor at the foot (on the snow) unless said.
//   wall(g, e, o) — a house's long wall facing the street: o.w wide (x −w/2…w/2), o.h high over a plinth o.plinth,
//     o.windows: [{x, w, h, sill}] — openings cut through (what stands behind shows: a pane, a room), each with its
//     carved frame; o.door: {x, w, h, step} — a dark doorway cut through, its frame; o.color, o.seed
//   gable(g, e, o) — a house's end: o.d deep (x −d/2…d/2), o.h the wall's height over the plinth, o.rise the roof's
//   roof(g, e, o) — a roof slope seen from above (a plane): o.w × o.d, snow on it, its eave at the near edge
//   pane(g, e, o) — a window's glass behind its opening: dark; layer `lit` (warm, curtains), layer `figure` (a head
//     and shoulders against the light), layer `bars`; its glow `pane` (e.light) — the scene's animate shows them by
//     its keys; o.dark — a window that never lights: the dark glass and its bars only
//   fence(g, e, len, h, o) — pickets from x 0 to len; o.gaps: [[x0, x1]] — gates left open
//   shed(g, e, o) — a board shed front, o.w wide, o.h high, a small window (dark); o.burnt 1 — scorched (soot, no snow
//     on its roof), 2 — burnt down to black stumps of boards; o.fire — its fire's layers `fire`, `tongues` and glow `fire`
//   barrel(g, e), bench(g, e), woodpile(g, e, w)
//   lamp(g, e, h) — a wooden pole with a lamp under a tin shade at h; its light `lamp` (e.light)
//   birch(g, e, h, o) — a bare birch, h tall; o.lean (its top that far aside), o.thick (its trunk that many times)
//   cross(g, e, h) — a wooden grave cross with a slanted foot bar; rail(g, e, w) — a low iron grave rail

const SNOW = '#e6ecf4';
const SNOW_SHADE = '#c9d3e2';

function rnd(e) { return e.rnd(); }

// horizontal logs between y0 (top) and y1, x0…x1: rounded ends of tone, dark seams between
function logs(g, e, x0, x1, y0, y1, color) {
  const n = Math.max(3, Math.round((y1 - y0) / 0.24));
  const lh = (y1 - y0) / n;
  for (let i = 0; i < n; i++) {
    const y = y0 + i * lh;
    const k = 0.92 + rnd(e) * 0.16;
    g.fillStyle = shade(color, k);
    g.fillRect(x0, y, x1 - x0, lh);
    g.fillStyle = 'rgba(30,22,16,0.55)';
    g.fillRect(x0, y + lh - 0.025, x1 - x0, 0.025);
    g.fillStyle = 'rgba(255,240,220,0.12)';
    g.fillRect(x0, y + 0.02, x1 - x0, 0.03);
  }
}
function shade(hex, k) {
  const c = [1, 3, 5].map(i => Math.min(255, Math.round(parseInt(hex.slice(i, i + 2), 16) * k)));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

// a carved window frame round an opening x0…x1, top…sill: white boards, a fretted crown, a ledge
function frame(g, x0, x1, top, sill) {
  const w = x1 - x0;
  g.fillStyle = '#dcd8cc';
  g.fillRect(x0 - 0.12, top - 0.1, 0.12, sill - top + 0.18);
  g.fillRect(x1, top - 0.1, 0.12, sill - top + 0.18);
  g.fillRect(x0 - 0.18, sill, w + 0.36, 0.1);
  // the crown: a board with a little gable over it
  g.beginPath();
  g.moveTo(x0 - 0.22, top - 0.08);
  g.lineTo(x0 + w / 2, top - 0.42);
  g.lineTo(x1 + 0.22, top - 0.08);
  g.closePath();
  g.fill();
  g.fillStyle = '#b9b3a4';
  g.beginPath();
  g.arc(x0 + w / 2, top - 0.2, 0.06, 0, Math.PI * 2);
  g.fill();
  for (let i = 0; i < 5; i++) {
    const x = x0 + (w * (i + 0.5)) / 5;
    g.beginPath();
    g.arc(x, top - 0.08, 0.045, 0, Math.PI);
    g.fill();
  }
  // snow on the ledge and on the crown
  g.fillStyle = SNOW;
  g.fillRect(x0 - 0.18, sill - 0.035, w + 0.36, 0.045);
}

function wall(g, e, o) {
  const w = o.w, h = o.h, pl = o.plinth ?? 0.45, top = -(pl + h);
  const color = o.color || '#6e5641';
  // the logs, the openings cut through them
  logs(g, e, -w / 2, w / 2, top, -pl + 0.02, color);
  // the corner posts (log ends), dark against the wall
  g.fillStyle = shade(color, 0.72);
  g.fillRect(-w / 2 - 0.12, top, 0.18, h + 0.02);
  g.fillRect(w / 2 - 0.06, top, 0.18, h + 0.02);
  // the eave's board under the roof
  g.fillStyle = shade(color, 0.6);
  g.fillRect(-w / 2 - 0.35, top - 0.12, w + 0.7, 0.16);
  // the plinth, snow banked against it
  g.fillStyle = '#4c4642';
  g.fillRect(-w / 2 - 0.1, -pl, w + 0.2, pl + 0.05);
  drift(g, e, -w / 2 - 0.4, w / 2 + 0.4, 0.42);
  // the openings cut through: what stands behind (a pane, a room, a lit hall) shows in them
  g.globalCompositeOperation = 'destination-out';
  g.fillStyle = '#000';
  for (const win of o.windows || []) g.fillRect(win.x - win.w / 2, -(win.sill) - win.h, win.w, win.h);
  if (o.door) g.fillRect(o.door.x - o.door.w / 2, -(pl + o.door.h), o.door.w, o.door.h);
  g.globalCompositeOperation = 'source-over';
  for (const win of o.windows || []) frame(g, win.x - win.w / 2, win.x + win.w / 2, -(win.sill) - win.h, -(win.sill));
  if (o.door) {
    const d = o.door, x0 = d.x - d.w / 2, x1 = d.x + d.w / 2, t = -(pl + d.h);
    g.fillStyle = '#d2cdc0';
    g.fillRect(x0 - 0.1, t - 0.12, d.w + 0.2, 0.12);
    g.fillRect(x0 - 0.1, t, 0.1, d.h + pl);
    g.fillRect(x1, t, 0.1, d.h + pl);
  }
}

// a ragged bank of snow along the foot, x0…x1, up to `high`
function drift(g, e, x0, x1, high) {
  g.fillStyle = SNOW;
  g.beginPath();
  g.moveTo(x0, 0.06);
  const n = Math.max(4, Math.round((x1 - x0) / 0.8));
  for (let i = 0; i <= n; i++) {
    const x = x0 + ((x1 - x0) * i) / n;
    g.lineTo(x, -high * (0.45 + 0.55 * rnd(e)));
  }
  g.lineTo(x1, 0.06);
  g.closePath();
  g.fill();
}

function gable(g, e, o) {
  const d = o.d, h = o.h, pl = o.plinth ?? 0.45, rise = o.rise, top = -(pl + h);
  const color = o.color || '#6e5641';
  logs(g, e, -d / 2, d / 2, top, -pl + 0.02, shade(color, 0.9));
  // the gable's boards up to the ridge
  g.fillStyle = shade(color, 0.78);
  g.beginPath();
  g.moveTo(-d / 2 - 0.3, top + 0.02);
  g.lineTo(0, top - rise);
  g.lineTo(d / 2 + 0.3, top + 0.02);
  g.closePath();
  g.fill();
  g.strokeStyle = 'rgba(30,22,16,0.4)';
  g.lineWidth = 0.025;
  for (let x = -d / 2; x < d / 2; x += 0.22) {
    const y = top - rise * (1 - Math.abs(x) / (d / 2 + 0.3));
    g.beginPath();
    g.moveTo(x, top);
    g.lineTo(x, y);
    g.stroke();
  }
  // a small attic window, dark
  g.fillStyle = '#1d1b1c';
  g.fillRect(-0.22, top - rise * 0.55, 0.44, 0.38);
  g.fillStyle = '#d6d1c4';
  g.fillRect(-0.28, top - rise * 0.55 + 0.38, 0.56, 0.06);
  // the roof's edge with its snow, seen end on
  g.fillStyle = shade(color, 0.5);
  g.beginPath();
  g.moveTo(-d / 2 - 0.45, top + 0.05);
  g.lineTo(0, top - rise - 0.12);
  g.lineTo(d / 2 + 0.45, top + 0.05);
  g.lineTo(d / 2 + 0.3, top + 0.12);
  g.lineTo(0, top - rise + 0.02);
  g.lineTo(-d / 2 - 0.3, top + 0.12);
  g.closePath();
  g.fill();
  g.fillStyle = SNOW;
  g.beginPath();
  g.moveTo(-d / 2 - 0.5, top + 0.02);
  g.lineTo(0, top - rise - 0.3);
  g.lineTo(d / 2 + 0.5, top + 0.02);
  g.lineTo(d / 2 + 0.42, top + 0.06);
  g.lineTo(0, top - rise - 0.13);
  g.lineTo(-d / 2 - 0.42, top + 0.06);
  g.closePath();
  g.fill();
  g.fillStyle = '#4c4642';
  g.fillRect(-d / 2, -pl, d, pl + 0.05);
  drift(g, e, -d / 2 - 0.3, d / 2 + 0.3, 0.38);
}

// a roof slope from above (a plane: y toward the viewer, its eave at +d/2): thick snow, the eave's dark edge
function roof(g, e, o) {
  const w = o.w, d = o.d;
  g.fillStyle = SNOW;
  g.fillRect(-w / 2, -d / 2, w, d);
  g.fillStyle = 'rgba(190,202,220,0.45)';
  for (let i = 0; i < 14; i++) {
    const x = -w / 2 + rnd(e) * w, y = -d / 2 + rnd(e) * d;
    g.beginPath();
    g.ellipse(x, y, 0.4 + rnd(e) * 0.9, 0.12 + rnd(e) * 0.2, 0, 0, Math.PI * 2);
    g.fill();
  }
  g.fillStyle = '#4a3f37';
  g.fillRect(-w / 2, d / 2 - 0.1, w, 0.1);
  // icicles are the wall's eave; a chimney if asked
  if (o.chimney != null) {
    g.fillStyle = '#7a5245';
    g.fillRect(o.chimney - 0.3, -d / 2 + 0.3, 0.6, 0.6);
  }
}

// a window's glass, seen through its opening: o.w × o.h, the anchor at the sill's middle (y up from it)
function pane(g, e, o) {
  const w = o.w, h = o.h;
  g.fillStyle = '#1a1d26';
  g.fillRect(-w / 2 - 0.05, -h - 0.05, w + 0.1, h + 0.1);
  // the dark glass's faint cold sheen
  g.fillStyle = 'rgba(120,140,180,0.18)';
  g.fillRect(-w / 2, -h, w * 0.4, h);
  if (o.dark) {
    // a window that stays dark: only its bars
    g.fillStyle = '#d8d3c6';
    g.fillRect(-0.03, -h, 0.06, h);
    g.fillRect(-w / 2, -h * 0.62, w, 0.05);
    e.at(0, -h * 0.5);
    return;
  }
  e.layer('lit', {}, l => {
    const gr = l.createRadialGradient(0, -h * 0.55, 0.05, 0, -h * 0.55, Math.max(w, h) * 0.8);
    gr.addColorStop(0, '#ffd8a0');
    gr.addColorStop(0.6, '#f0a85a');
    gr.addColorStop(1, '#c97a35');
    l.fillStyle = gr;
    l.fillRect(-w / 2, -h, w, h);
    // curtains gathered to the sides, a short one across the bottom
    l.fillStyle = '#d98b4a';
    l.beginPath();
    l.moveTo(-w / 2, -h);
    l.lineTo(-w / 2 + w * 0.28, -h);
    l.quadraticCurveTo(-w / 2 + w * 0.12, -h * 0.4, -w / 2 + w * 0.2, 0);
    l.lineTo(-w / 2, 0);
    l.closePath();
    l.fill();
    l.beginPath();
    l.moveTo(w / 2, -h);
    l.lineTo(w / 2 - w * 0.28, -h);
    l.quadraticCurveTo(w / 2 - w * 0.12, -h * 0.4, w / 2 - w * 0.2, 0);
    l.lineTo(w / 2, 0);
    l.closePath();
    l.fill();
    l.fillStyle = 'rgba(200,120,60,0.85)';
    l.fillRect(-w / 2, -h * 0.32, w, h * 0.32);
  });
  e.layer('figure', {}, f => {
    // someone at the window: a head and shoulders against the light
    f.fillStyle = '#3a2418';
    f.beginPath();
    f.ellipse(w * 0.05, -h * 0.62, h * 0.11, h * 0.14, 0, 0, Math.PI * 2);
    f.fill();
    f.beginPath();
    f.moveTo(-w * 0.28, 0);
    f.quadraticCurveTo(-w * 0.26, -h * 0.4, w * 0.05, -h * 0.44);
    f.quadraticCurveTo(w * 0.36, -h * 0.4, w * 0.38, 0);
    f.closePath();
    f.fill();
  });
  // the glazing bars over it all
  e.layer('bars', {}, b => {
    b.fillStyle = '#e2ddd2';
    b.fillRect(-0.03, -h, 0.06, h);
    b.fillRect(-w / 2, -h * 0.62, w, 0.05);
  });
  e.light(0, -h * 0.5, Math.max(w, h) * 0.9, '#e8963a', 1.4, 'pane');
  e.at(0, -h * 0.5, 'pane');
  e.at(0, -h * 0.5);
}

function fence(g, e, len, h, o = {}) {
  const gaps = o.gaps || [];
  const open = x => gaps.some(([a, b]) => x > a && x < b);
  // two rails
  g.fillStyle = '#5c5045';
  for (const y of [-h * 0.3, -h * 0.75]) {
    let x = 0;
    while (x < len) {
      let x1 = x;
      while (x1 < len && !open(x1 + 0.01)) x1 += 0.05;
      if (x1 > x) g.fillRect(x, y - 0.035, x1 - x, 0.07);
      x = x1;
      while (x < len && open(x + 0.01)) x += 0.05;
    }
  }
  // pickets, uneven and grey-brown, a cap of snow on each
  for (let x = 0.05; x < len; x += 0.16) {
    if (open(x)) continue;
    const ph = h * (0.9 + rnd(e) * 0.18);
    g.fillStyle = shade('#6d6052', 0.85 + rnd(e) * 0.3);
    g.beginPath();
    g.moveTo(x - 0.045, 0);
    g.lineTo(x - 0.045, -ph + 0.05);
    g.lineTo(x, -ph);
    g.lineTo(x + 0.045, -ph + 0.05);
    g.lineTo(x + 0.045, 0);
    g.closePath();
    g.fill();
    g.fillStyle = SNOW;
    g.fillRect(x - 0.05, -ph + 0.02, 0.1, 0.035);
  }
  // snow drifted against the foot
  g.fillStyle = SNOW;
  g.beginPath();
  g.moveTo(0, 0.05);
  for (let x = 0; x <= len; x += 0.6) g.lineTo(x, open(x) ? -0.03 : -0.12 - rnd(e) * 0.2);
  g.lineTo(len, 0.05);
  g.closePath();
  g.fill();
  g.fillStyle = SNOW;
  g.fillRect(0, -h * 0.75 - 0.06, len, 0.03);
}

function shed(g, e, o) {
  const w = o.w, h = o.h, burnt = o.burnt || 0;
  // burnt 2: what is left — black stumps of boards, no roof, the door gone; the snow round it trodden grey
  if (burnt === 2) {
    g.fillStyle = '#1b1613';
    g.beginPath();
    g.moveTo(-w / 2, 0);
    for (let x = -w / 2; x <= w / 2 + 1e-6; x += 0.15) g.lineTo(x, -h * (0.35 + rnd(e) * 0.45));
    g.lineTo(w / 2, 0);
    g.closePath();
    g.fill();
    g.strokeStyle = 'rgba(70,52,40,0.6)';
    g.lineWidth = 0.02;
    for (let x = -w / 2 + 0.15; x < w / 2; x += 0.3) {
      g.beginPath();
      g.moveTo(x, -h * 0.3);
      g.lineTo(x, 0);
      g.stroke();
    }
    g.fillStyle = '#7f8188';
    g.beginPath();
    g.ellipse(0, 0, w / 2 + 0.4, 0.12, 0, Math.PI, 0);
    g.fill();
    e.at(0, -h * 0.25);
    e.at(0, -h * 0.25, 'window');
    if (o.fire) e.light(0, -h * 0.2, 0.6, '#c2502a', 0.4, 'fire');
    return;
  }
  g.fillStyle = burnt ? '#3f362f' : '#5d5248';
  g.fillRect(-w / 2, -h, w, h + 0.03);
  g.strokeStyle = 'rgba(25,20,16,0.6)';
  g.lineWidth = 0.025;
  for (let x = -w / 2 + 0.15; x < w / 2; x += 0.15 + rnd(e) * 0.04) {
    g.beginPath();
    g.moveTo(x, -h);
    g.lineTo(x, 0);
    g.stroke();
  }
  // the door of planks, a bar across it
  g.fillStyle = '#4b4139';
  g.fillRect(-w / 2 + 0.3, -h + 0.45, 0.8, h - 0.45);
  g.fillStyle = '#372f29';
  g.fillRect(-w / 2 + 0.3, -h * 0.5, 0.8, 0.08);
  // a small window, dark
  const wx = w / 2 - 0.85, wy = -h + 0.6;
  g.fillStyle = '#1b1a1c';
  g.fillRect(wx, wy, 0.45, 0.35);
  g.fillStyle = '#7f7468';
  g.fillRect(w / 2 - 0.9, -h + 0.95, 0.55, 0.05);
  // the roof's edge and its snow (scorched: soot up the boards from the window, the snow on it melted)
  g.fillStyle = '#3e3630';
  g.fillRect(-w / 2 - 0.2, -h - 0.16, w + 0.4, 0.18);
  if (burnt) {
    const s = g.createLinearGradient(0, -h - 0.2, 0, -h * 0.3);
    s.addColorStop(0, 'rgba(10,8,8,0.85)');
    s.addColorStop(1, 'rgba(10,8,8,0)');
    g.fillStyle = s;
    g.fillRect(-w / 2 - 0.2, -h - 0.2, w + 0.4, h * 0.75);
  } else {
    g.fillStyle = SNOW;
    g.beginPath();
    g.moveTo(-w / 2 - 0.25, -h - 0.14);
    g.quadraticCurveTo(0, -h - 0.45, w / 2 + 0.25, -h - 0.14);
    g.closePath();
    g.fill();
  }
  // o.fire: its fire, for a scene to show by its own key (its animate): layer `fire` — the window ablaze, `tongues` —
  // flames under the eaves; the glow `fire` lights the yard
  if (o.fire) e.layer('fire', { blend: 'add', flicker: 0.6 }, l => {
    const gr = l.createRadialGradient(wx + 0.22, wy + 0.18, 0.02, wx + 0.22, wy + 0.18, 0.45);
    gr.addColorStop(0, '#ffe2a0');
    gr.addColorStop(0.4, '#ff9a3c');
    gr.addColorStop(1, 'rgba(200,60,20,0)');
    l.fillStyle = gr;
    l.fillRect(wx - 0.3, wy - 0.3, 1.05, 0.95);
  });
  if (o.fire) e.layer('tongues', { blend: 'add', pivot: [0, -h - 0.1], box: [-w / 2 - 0.4, -h - 1.3, w / 2 + 0.4, -h + 0.3] }, l => {
    for (let i = 0; i < 7; i++) {
      const x = -w / 2 + 0.2 + i * (w - 0.4) / 6 + (rnd(e) - 0.5) * 0.15, tall = 0.5 + rnd(e) * 0.7;
      const gr = l.createLinearGradient(0, -h + 0.1, 0, -h - tall);
      gr.addColorStop(0, 'rgba(255,200,110,0.95)');
      gr.addColorStop(0.5, 'rgba(255,120,40,0.75)');
      gr.addColorStop(1, 'rgba(180,40,10,0)');
      l.fillStyle = gr;
      l.beginPath();
      l.moveTo(x - 0.16, -h + 0.1);
      l.quadraticCurveTo(x - 0.12, -h - tall * 0.5, x + (rnd(e) - 0.5) * 0.1, -h - tall);
      l.quadraticCurveTo(x + 0.12, -h - tall * 0.5, x + 0.16, -h + 0.1);
      l.closePath();
      l.fill();
    }
  });
  if (o.fire) e.light(wx + 0.22, wy + 0.18, 0.6, '#ff8a3a', 1.6, 'fire');
  if (!burnt) drift(g, e, -w / 2 - 0.3, w / 2 + 0.3, 0.35);
  e.at(wx + 0.22, wy + 0.18, 'window');
  e.at(0, -h * 0.5);
}

function barrel(g, e) {
  g.fillStyle = '#5a4130';
  g.beginPath();
  g.moveTo(-0.33, 0);
  g.quadraticCurveTo(-0.4, -0.45, -0.33, -0.9);
  g.lineTo(0.33, -0.9);
  g.quadraticCurveTo(0.4, -0.45, 0.33, 0);
  g.closePath();
  g.fill();
  g.fillStyle = '#2e2a28';
  for (const y of [-0.15, -0.45, -0.78]) g.fillRect(-0.37, y - 0.03, 0.74, 0.05);
  g.fillStyle = SNOW;
  g.beginPath();
  g.ellipse(0, -0.92, 0.34, 0.07, 0, 0, Math.PI * 2);
  g.fill();
  drift(g, e, -0.45, 0.45, 0.16);
}

function bench(g, e) {
  g.fillStyle = '#5b4d40';
  g.fillRect(-0.8, -0.47, 1.6, 0.07);
  g.fillRect(-0.7, -0.42, 0.07, 0.42);
  g.fillRect(0.63, -0.42, 0.07, 0.42);
  g.fillStyle = SNOW;
  g.fillRect(-0.8, -0.5, 1.6, 0.035);
}

function woodpile(g, e, w) {
  for (let y = -0.12; y > -1.1; y -= 0.15) {
    for (let x = -w / 2 + 0.08; x < w / 2; x += 0.15) {
      g.fillStyle = shade('#8a6a4c', 0.75 + rnd(e) * 0.4);
      g.beginPath();
      g.arc(x + (rnd(e) - 0.5) * 0.03, y, 0.07, 0, Math.PI * 2);
      g.fill();
    }
  }
  g.fillStyle = SNOW;
  g.beginPath();
  g.moveTo(-w / 2 - 0.05, -1.1);
  g.quadraticCurveTo(0, -1.32, w / 2 + 0.05, -1.1);
  g.closePath();
  g.fill();
}

function lamp(g, e, h) {
  g.fillStyle = '#4a4038';
  g.fillRect(-0.08, -h - 0.3, 0.16, h + 0.3);
  g.fillRect(-0.06, -h - 0.25, 0.6, 0.06);
  // the tin shade, the bulb under it
  g.fillStyle = '#2d2c2e';
  g.beginPath();
  g.moveTo(0.3, -h - 0.2);
  g.lineTo(0.62, -h - 0.2);
  g.lineTo(0.72, -h - 0.06);
  g.lineTo(0.2, -h - 0.06);
  g.closePath();
  g.fill();
  g.fillStyle = '#fff3d6';
  g.beginPath();
  g.arc(0.46, -h - 0.03, 0.06, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = SNOW;
  g.fillRect(0.28, -h - 0.24, 0.36, 0.04);
  e.light(0.46, -h, 0.35, '#f6dcae', 1.6, 'lamp');
}

function birch(g, e, h, o = {}) {
  const lean = o.lean || 0, k = o.thick || 1;
  // the trunk: white with black marks, tapering
  g.fillStyle = '#ddd8cc';
  g.beginPath();
  g.moveTo(-0.17 * k, 0);
  g.quadraticCurveTo(-0.1 * k + lean * 0.3, -h * 0.5, lean - 0.03 * k, -h);
  g.lineTo(lean + 0.03 * k, -h);
  g.quadraticCurveTo(0.1 * k + lean * 0.3, -h * 0.5, 0.17 * k, 0);
  g.closePath();
  g.fill();
  g.fillStyle = '#2b2725';
  for (let i = 0; i < 22; i++) {
    const t = rnd(e) * 0.85;
    const x = lean * t * t - 0.13 * k * (1 - t) + rnd(e) * 0.2 * k * (1 - t);
    g.fillRect(x, -h * t, 0.06 + rnd(e) * 0.08 * k * (1 - t), 0.03);
  }
  // the bare crown: branches hanging, the twigs a dark mass
  g.strokeStyle = '#3a3330';
  g.lineCap = 'round';
  const branch = (x, y, a, len, wdt, depth) => {
    const x1 = x + Math.cos(a) * len, y1 = y + Math.sin(a) * len;
    g.lineWidth = wdt;
    g.beginPath();
    g.moveTo(x, y);
    g.quadraticCurveTo((x + x1) / 2, (y + y1) / 2 - len * 0.1, x1, y1);
    g.stroke();
    if (depth > 0) {
      branch(x1, y1, a - 0.4 - rnd(e) * 0.3, len * 0.68, wdt * 0.62, depth - 1);
      branch(x1, y1, a + 0.35 + rnd(e) * 0.3, len * 0.66, wdt * 0.62, depth - 1);
      if (depth < 3) branch(x1, y1, Math.PI / 2 + (rnd(e) - 0.5) * 0.4, len * 0.9, wdt * 0.4, 0);
    }
  };
  for (let i = 0; i < 5; i++) {
    const t = 0.45 + i * 0.11;
    const side = i % 2 ? 1 : -1;
    branch(lean * t * t, -h * t, -Math.PI / 2 + side * (0.5 + rnd(e) * 0.4), h * (0.2 - i * 0.02), 0.07 - i * 0.008, 3);
  }
  branch(lean, -h, -Math.PI / 2 + (rnd(e) - 0.5) * 0.3, h * 0.12, 0.04, 2);
  drift(g, e, -0.5, 0.5, 0.2);
}

function cross(g, e, h) {
  g.fillStyle = '#4c3e33';
  g.fillRect(-0.05, -h, 0.1, h + 0.05);
  g.fillRect(-0.32, -h * 0.78, 0.64, 0.08);
  g.fillRect(-0.18, -h * 0.92, 0.36, 0.06);
  g.save();
  g.translate(0, -h * 0.3);
  g.rotate(-0.35);
  g.fillRect(-0.24, -0.03, 0.48, 0.06);
  g.restore();
  g.fillStyle = SNOW;
  g.fillRect(-0.34, -h * 0.78 - 0.03, 0.68, 0.035);
  g.fillRect(-0.06, -h - 0.03, 0.12, 0.04);
  drift(g, e, -0.4, 0.4, 0.22);
}

function rail(g, e, w) {
  g.strokeStyle = '#2b2a2d';
  g.lineWidth = 0.035;
  g.beginPath();
  g.moveTo(-w / 2, -0.62);
  g.lineTo(w / 2, -0.62);
  g.moveTo(-w / 2, -0.25);
  g.lineTo(w / 2, -0.25);
  g.stroke();
  for (let x = -w / 2; x <= w / 2 + 1e-6; x += 0.12) {
    g.beginPath();
    g.moveTo(x, 0);
    g.lineTo(x, -0.7);
    g.stroke();
    g.beginPath();
    g.arc(x, -0.74, 0.03, 0, Math.PI * 2);
    g.fillStyle = '#2b2a2d';
    g.fill();
  }
  g.fillStyle = SNOW;
  g.fillRect(-w / 2, -0.645, w, 0.025);
  drift(g, e, -w / 2, w / 2, 0.18);
}

return { wall, gable, roof, pane, fence, shed, barrel, bench, woodpile, lamp, birch, cross, rail, drift, logs, shade, SNOW, SNOW_SHADE };
