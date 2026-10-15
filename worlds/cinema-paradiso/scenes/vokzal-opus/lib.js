
// Вокзал — what the paintings and the script share: the station in metres, the train's frame, a few painted things.
// Metres: across x (east +), distance z (north +). The start stands on the platform; the platform runs east–west,
// its edge at z 4.5, the track beyond it 0.9 m lower; the station's front at z −4 faces north across the platform.

const G = {
  EDGE: 4.5, BED: -0.9, TRACK_Z: 5.6, BUILDING_Z: -4,
  // the train, in its own frame (the anchor `train` on the track's middle; it faces west, so that in its frame —
  // laid out as if it faced the start — `distance` runs east, the way it goes, and `across` south, toward the platform). Its anchor stands at x = TRAIN_X0 + RUN·train.
  TRAIN_X0: 0, RUN: 150,
  LOCO: [2.6, 13.4], CAR1: [-12.4, 1.8], CAR2: [-27.2, -13.0],   // each piece's west and east ends (along)
  SIDE: 1.35, FLOOR: 0.35,                                       // the cars' south side across the anchor; their floor over the platform
  DOOR1: 0.85, WIN1: -1.375,                                     // car 1's door and the middle of Toto's window (along)
  LAMP: [4.2, 2.6], CLOCK: [0, -4, 5.0],
};
G.trainX = t => G.TRAIN_X0 + G.RUN * t;

const hash = (n, s) => anim.hash(n, s);

// a carriage's south side, painted from its west end (x 0) east (len m), the rail at y 0.9 below the platform's level,
// floor at y −FLOOR: green-brown body, a cream band, windows (holes — the inside shows), the door near the east end
function carSide(g, len, seed, now) {
  const top = -3.2, bot = 0.75, win = [], door = len - 1.4;
  g.save(); g.beginPath(); g.rect(0, top - 0.3, len, bot - top + 0.3);
  for (let x = 1.2; x < len - 2.2; x += 1.55) { if (Math.abs(x - door) < 1.3) continue; win.push(x); g.rect(x, -2.25, 1.05, 0.8); }
  g.clip('evenodd');
  g.fillStyle = now ? '#4c5852' : '#64744e'; g.fillRect(0, top, len, bot - top);
  g.fillStyle = now ? '#a7a08e' : '#c9b98e'; g.fillRect(0, -1.42, len, 0.12);
  g.fillStyle = now ? '#414b45' : '#55643f'; for (let x = 0.4; x < len; x += 1.55) g.fillRect(x, top + 0.1, 0.03, bot - top - 0.2);
  g.fillStyle = '#2a2a2c'; g.beginPath(); g.moveTo(0, top); g.quadraticCurveTo(len / 2, top - 0.42, len, top); g.lineTo(len, top + 0.06); g.lineTo(0, top + 0.06); g.fill();
  g.restore();
  g.fillStyle = '#23262a'; g.fillRect(door, -2.35, 0.9, 2.45);                      // the door
  g.fillStyle = '#5a6458'; g.fillRect(door + 0.2, -2.15, 0.5, 0.55);
  g.fillStyle = '#1c1c1e'; g.fillRect(door + 0.1, 0.1, 0.7, 0.08); g.fillRect(door + 0.15, 0.35, 0.6, 0.08);   // the steps
  for (const x of win) { g.strokeStyle = '#2e2e2a'; g.lineWidth = 0.05; g.strokeRect(x, -2.25, 1.05, 0.8); g.fillStyle = '#2e2e2a'; g.fillRect(x, -1.88, 1.05, 0.03); }
  g.fillStyle = '#18181a'; g.fillRect(0, 0.5, len, 0.25);                              // the frame under
  for (const x of [1.6, 3.4, len - 3.4, len - 1.6]) { g.fillStyle = '#121214'; g.beginPath(); g.arc(x, 0.48, 0.42, 0, Math.PI * 2); g.fill(); g.fillStyle = '#3a3a3c'; g.beginPath(); g.arc(x, 0.48, 0.12, 0, Math.PI * 2); g.fill(); }
  g.save(); g.scale(0.01, 0.01); g.fillStyle = now ? '#c8c2b0' : '#d8c890'; g.font = '700 22px serif'; g.textAlign = 'center';
  g.fillText('FS  ' + (seed % 2 ? '2' : '3'), len * 50, -50); g.restore();
  return win;
}
// the inside of a carriage seen through its windows: the far wall's dark wood, the seats' backs, a small lamp
function carInside(g, len, now) {
  g.fillStyle = '#2c241e'; g.fillRect(0, -3.0, len, 3.0);
  g.fillStyle = '#4a3a2c'; for (let x = 1.0; x < len - 1; x += 1.55) g.fillRect(x, -1.35, 1.2, 0.5);
  g.fillStyle = now ? '#606a70' : '#3a3e48'; for (let x = 1.2; x < len - 2.2; x += 1.55) g.fillRect(x + 0.1, -2.15, 0.85, 0.6);   // the far windows: the sky
}
// the locomotive's south side from its back (x 0, the cab) to its front (len): the tender joined, the boiler, the
// chimney, the dome, the driving wheels with their rods (a layer the animate turns), the buffer beam
function locoSide(g, len) {
  g.fillStyle = '#1d1d20';
  g.fillRect(0, -3.4, 2.6, 3.4);                                                        // the cab
  g.fillStyle = '#2a2a2e'; g.fillRect(-0.1, -3.55, 2.8, 0.18);
  g.fillStyle = '#3a3e48'; g.fillRect(0.5, -2.9, 0.8, 0.7);                             // the cab's window
  g.fillStyle = '#1a1a1d'; g.beginPath(); g.moveTo(2.6, -2.8); g.lineTo(len - 0.6, -2.8); g.quadraticCurveTo(len - 0.3, -2.75, len - 0.3, -2.3); g.lineTo(len - 0.3, -1.1); g.lineTo(2.6, -1.1); g.fill();
  g.fillStyle = '#2c2c30'; for (let x = 3.4; x < len - 1; x += 1.4) g.fillRect(x, -2.8, 0.05, 1.7);           // the boiler's bands
  g.fillStyle = '#1a1a1d'; g.fillRect(len - 1.5, -3.6, 0.55, 0.85);                     // the chimney
  g.fillRect(len - 1.62, -3.68, 0.79, 0.12);
  g.beginPath(); g.ellipse(len - 4.6, -2.85, 0.5, 0.3, 0, Math.PI, 0); g.fill();       // the dome
  g.fillStyle = '#8a1c18'; g.fillRect(len - 0.35, -0.95, 0.3, 0.45);                    // the buffer beam
  g.fillStyle = '#121214'; g.fillRect(2.4, -1.1, len - 2.6, 0.75);                      // the running board's shade
  g.fillStyle = '#c8b070'; g.fillRect(2.6, -1.12, len - 3, 0.03);
  g.fillStyle = '#121214'; for (const x of [len - 1.6, len - 0.9]) { g.beginPath(); g.arc(x, 0.55, 0.38, 0, Math.PI * 2); g.fill(); }   // the bogie's wheels
  g.fillStyle = '#2a2a2e'; g.fillRect(len - 2.6, -0.3, 0.9, 0.5);                       // the cylinder
}
const WHEELS = [3.6, 5.5, 7.4];                                                         // the driving wheels' hubs (x), r 0.7
function wheels(r, now, only) {
  for (const x of WHEELS) {
    if (only !== undefined && x !== only) continue;
    r.fillStyle = '#141416'; r.beginPath(); r.arc(x, 0.2, 0.72, 0, Math.PI * 2); r.fill();
    r.fillStyle = now ? '#6a2a24' : '#7a2420'; r.beginPath(); r.arc(x, 0.2, 0.62, 0, Math.PI * 2); r.fill();
    r.fillStyle = '#141416'; r.beginPath(); r.arc(x, 0.2, 0.5, 0, Math.PI * 2); r.fill();
    r.strokeStyle = now ? '#6a2a24' : '#7a2420'; r.lineWidth = 0.05;
    for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2; r.beginPath(); r.moveTo(x, 0.2); r.lineTo(x + Math.cos(a) * 0.5, 0.2 + Math.sin(a) * 0.5); r.stroke(); }
  }
}

// the station's front from the platform (x across as seen looking south: east at the left — the card faces north and
// its x runs to the world's west), two storeys of lime-washed stone, shutters, the doors, the name, the clock's place
function station(g, now) {
  const W = 9, H = 7.2;
  g.fillStyle = now ? '#a59d8c' : '#cdb894'; g.fillRect(-W, -H, 2 * W, H);
  g.fillStyle = now ? '#8a8476' : '#b49e7a'; g.fillRect(-W, -H, 2 * W, 0.4); g.fillRect(-W, -3.6, 2 * W, 0.18); g.fillRect(-W, -0.6, 2 * W, 0.6);
  for (const x of [-W, W - 0.5]) g.fillRect(x, -H, 0.5, H);
  for (let k = 0; k < 5; k++) {
    const x = -7 + k * 3.5;
    g.fillStyle = now ? '#3a3e40' : '#3c3a36'; g.fillRect(x - 0.55, -6.3, 1.1, 1.8);
    g.fillStyle = now ? '#506058' : '#5e7a5a'; g.fillRect(x - 1.0, -6.3, 0.42, 1.8); g.fillRect(x + 0.58, -6.3, 0.42, 1.8);
    const door = k % 2 === 1;
    g.fillStyle = now ? '#3a3a3c' : '#4a3a2c'; g.fillRect(x - 0.65, door ? -2.9 : -2.6, 1.3, door ? 2.9 : 1.6);
    if (!door) { g.fillStyle = now ? '#506058' : '#5e7a5a'; g.fillRect(x - 1.1, -2.6, 0.42, 1.6); g.fillRect(x + 0.68, -2.6, 0.42, 1.6); }
  }
  g.save(); g.scale(0.01, 0.01); g.fillStyle = now ? '#4a4a4c' : '#3a2e24'; g.font = '700 46px serif'; g.textAlign = 'center';
  g.fillText('GIANCALDO', 0, -400); g.restore();
}

return { G, carSide, carInside, locoSide, wheels, WHEELS, station };
