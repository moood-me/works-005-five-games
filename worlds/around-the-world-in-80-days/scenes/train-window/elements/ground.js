// The land outside, every land along the line, from the embankment to four kilometres off, seen from above — lying on
// the relief (the embankment falling from the line, the Ganges' bed). x here is metres along the line from the
// plane's middle (MID), y toward the line. Each land: its colours by distance, its fields in bands away from the line
// (some ploughed in furrows running away from it), country roads across; the prairie's dry grass through the snow, the
// snow's drifts; the Ganges' muddy banks. Every land the same each period along the line (lib.js along, pnoise).
const L = e.lib, P = L.plan, h = e.anim.hash;
const near = 3, far = 4000, zc = (near + far) / 2, MID = 60000;
const at = d => zc - d;
// the bands away from the line, and how long a field is along it in each (each a whole number of fields a period)
const bands = [22, 45, 80, 140, 240, 420, 700, 1200, 2000, far];
const LONG = [25, 40, 50, 80, 125, 200, 400, 500, 1000];
const mod = (i, n) => ((i % n) + n) % n;
for (const land of P.lands) {
  const C = L.colours(land), c = L.centre(land) - MID, snowy = land === 'snow' || land === 'prairie';
  const fielded = land === 'europe' || land === 'england' || land === 'india';
  // the land's colour by distance: the embankment, near, far
  const bank = snowy ? L.mixc(C.groundNear, C.groundFar, 0.4) : L.mixc(C.groundNear, C.near, 0.7);
  const gr = g.createLinearGradient(0, at(far), 0, at(near));
  const stop = (d, col) => gr.addColorStop((far - d) / (far - near), L.rgba(col));
  stop(far, C.groundFar);
  stop(600, L.mixc(C.groundNear, C.groundFar, 0.7));
  stop(150, L.mixc(C.groundNear, C.groundFar, 0.25));
  stop(22, C.groundNear);
  stop(12, L.mixc(C.groundNear, bank, 0.8));
  stop(near, bank);
  g.fillStyle = gr;
  g.fillRect(c - P.apart / 2, at(far), P.apart, far - near);

  // fields: bands away from the line, each cut along it into fields of their own tone — as far aside as they are seen
  for (let b = 0; b + 1 < bands.length; b++) {
    const d0 = bands[b], d1 = bands[b + 1], y0 = at(d1), y1 = at(d0), long = LONG[b], n = Math.round(P.period / long);
    const R = L.reachOf(d1, long);
    for (let i = Math.floor(-R / long); i * long < R; i++) {
      const x = c + i * long, j = mod(i, n), v = h(j, 11 + b);
      if (fielded) {
        // a field of its own: grass, stubble, ploughed earth — some ploughed in furrows running away from the line
        const crop = C.crops[Math.floor(h(j, 21 + b) * C.crops.length)];
        g.fillStyle = L.rgba(crop, 0.35 + 0.3 * v);
        g.fillRect(x, y0, long, y1 - y0);
        if (b < 3 && h(j, 31 + b) < 0.35) {
          g.fillStyle = 'rgba(0,0,0,0.14)';
          g.beginPath();
          for (let fx = x + 0.8; fx < x + long; fx += 1.6) g.rect(fx, y0, 0.4, y1 - y0);
          g.fill();
        }
      } else if (land === 'prairie' && b < 6 && v < 0.45) {
        // dry grass showing through the snow, in long patches
        g.fillStyle = L.rgba(C.mid, 0.18 + 0.2 * h(j, 41 + b));
        g.beginPath();
        g.ellipse(x + long * 0.5, (y0 + y1) / 2, long * (0.25 + 0.2 * v), (y1 - y0) * 0.3, 0, 0, Math.PI * 2);
        g.fill();
      } else if (land === 'snow' && v < 0.5) {
        // drifts: a faint blue shade on the lee of each
        g.fillStyle = 'rgba(120,140,170,0.07)';
        g.beginPath();
        g.ellipse(x + long * 0.5, (y0 + y1) / 2, long * 0.4, (y1 - y0) * 0.25, 0, 0, Math.PI * 2);
        g.fill();
      }
    }
  }

  // a country road now and then, running away from the line
  if (fielded) {
    const every = 800, n = P.period / every, R = L.reachOf(1500, every);
    g.fillStyle = L.rgba(L.mixc(C.groundNear, '#d8cdb0', 0.45));
    for (let i = Math.floor(-R / every); i * every < R; i++) {
      const j = mod(i, n);
      if (h(j, 51) < 0.5) continue;
      g.fillRect(c + i * every + every * h(j, 52) - 2, at(1500), 4, 1500 - 22);
    }
  }

  // India: the Ganges' banks — wet mud shelving to the water (the river lies over its bed)
  if (land === 'india') {
    const [a, b] = P.river, R = L.reachOf(b, 50);
    g.fillStyle = L.rgba(L.mixc(C.groundNear, '#4a3a2a', 0.45));
    g.fillRect(c - R, at(b + 10), 2 * R, b + 10 - (a - 6));
  }
}
