// Станция: the numbers the paintings and the script share.
// The platform runs across the frame (across −21…31, distance 0.6…7.6); beyond its edge the track lies 0.6 m lower;
// the train stands on it, its side at distance 7.95; behind it the steppe, the poles and the wires.
const clamp01 = v => Math.max(0, Math.min(1, Number(v) || 0));
const TRAIN_D = 7.95;              // the carriages' sides: the train's anchor
const TRACK = -0.6;                // the track bed, under the platform's level
const CAR = 13.6;                  // a carriage's length, buffer to buffer
const FLOOR = 1.2;                 // a carriage's floor over the rail
const WIN = { y0: -3.05, y1: -2.05, w: 0.9 };      // its windows: top, bottom (over the rail, y down), width
const HER_WIN = 3.6;               // Anna's window: across in her carriage's frame
// the train's place: `train` 0 standing … 1 gone past the edge (300 m on); `far` carries it on over the horizon
const trainAt = (train, far) => 300 * clamp01(train) + 1700 * clamp01(far);

// one carriage's side, painted in its own metres (origin: the middle of its foot, at the rail): `lit` — only the
// window panes, as they glow from inside (another element, so they shine at dusk)
function carriage(g, { lit = false, hole = null, tail = false } = {}) {
  const L = CAR / 2 - 0.25;
  const xs = [];
  for (let i = 0; i < 8; i++) xs.push(-L + 1.05 + i * ((2 * L - 2.1) / 7));
  if (lit) {
    for (const x of xs) {
      if (hole !== null && Math.abs(x - hole) < 0.5) continue;
      const gr = g.createLinearGradient(0, WIN.y0, 0, WIN.y1);
      gr.addColorStop(0, '#ffe0aa'); gr.addColorStop(1, '#e8b06c');
      g.fillStyle = gr;
      g.fillRect(x - WIN.w / 2, WIN.y0, WIN.w, WIN.y1 - WIN.y0);
      g.fillStyle = '#f3b971';
      g.fillRect(x - WIN.w / 2, WIN.y0, WIN.w, 0.14);          // a blind half let down
    }
    return xs;
  }
  // the wheels, the frame under it, the steps at each end
  g.fillStyle = '#2b2a2c';
  for (const x of [-L + 1.4, -L + 2.9, L - 2.9, L - 1.4]) { g.beginPath(); g.arc(x, -0.48, 0.47, 0, Math.PI * 2); g.fill(); }
  g.fillStyle = '#4a4646';
  for (const x of [-L + 1.4, -L + 2.9, L - 2.9, L - 1.4]) { g.beginPath(); g.arc(x, -0.48, 0.16, 0, Math.PI * 2); g.fill(); }
  g.fillStyle = '#353335';
  g.fillRect(-L, -1.12, 2 * L, 0.32);
  g.fillRect(-L - 0.25, -1.0, 0.25, 0.14); g.fillRect(L, -1.0, 0.25, 0.14);   // the buffers
  g.fillStyle = '#3a3836';
  for (const x of [-L + 0.25, L - 0.65]) { g.fillRect(x, -1.0, 0.4, 0.06); g.fillRect(x, -0.62, 0.4, 0.06); }
  // the body: faded green-grey boards, a darker band under the windows; the hole of a window if asked
  g.fillStyle = '#6f7d72';
  g.beginPath();
  g.rect(-L, -3.95, 2 * L, 2.83);
  if (hole !== null) g.rect(hole + WIN.w / 2, WIN.y0, -WIN.w, WIN.y1 - WIN.y0);   // counter-clockwise: a hole
  g.fill('evenodd');
  g.fillStyle = '#5b675e';
  g.fillRect(-L, -1.6, 2 * L, 0.48);
  g.strokeStyle = 'rgba(40,48,42,0.35)'; g.lineWidth = 0.025;
  for (let x = -L + 0.2; x < L; x += 0.2) { g.beginPath(); g.moveTo(x, -1.6); g.lineTo(x, -1.12); g.stroke(); }
  // the doors at the ends, the windows' frames
  g.fillStyle = '#5f6c62';
  g.fillRect(-L + 0.1, -3.7, 0.7, 2.55); g.fillRect(L - 0.8, -3.7, 0.7, 2.55);
  g.strokeStyle = '#46504a'; g.lineWidth = 0.05;
  for (const x of xs) g.strokeRect(x - WIN.w / 2 - 0.04, WIN.y0 - 0.04, WIN.w + 0.08, WIN.y1 - WIN.y0 + 0.08);
  g.fillStyle = '#d8d2bf';                                   // the cream line along the top
  g.fillRect(-L, -3.62, 2 * L, 0.08);
  // the roof: a low curve, darker
  g.fillStyle = '#3f4440';
  g.beginPath(); g.moveTo(-L - 0.1, -3.92); g.quadraticCurveTo(0, -4.38, L + 0.1, -3.92); g.lineTo(L + 0.1, -3.85); g.lineTo(-L - 0.1, -3.85); g.closePath(); g.fill();
  g.fillStyle = '#353a37';
  for (const x of [-L + 2, -0.4, L - 2.6]) g.fillRect(x, -4.42, 0.5, 0.18);   // the vents
  // the windows' glass where they are not lit from inside (painted under the lit element)
  g.fillStyle = '#3c4048';
  for (const x of xs) if (hole === null || Math.abs(x - hole) > 0.5) g.fillRect(x - WIN.w / 2, WIN.y0, WIN.w, WIN.y1 - WIN.y0);
  return xs;
}

return {
  clamp01, TRAIN_D, TRACK, CAR, FLOOR, WIN, HER_WIN, trainAt, carriage,
  // where people stand
  GUROV_PLATFORM: [2.4, 6.3],
  ANNA_PLATFORM: [3.9, 6.55],
  CONDUCTOR: [11.2, 7.05],
  GUROV_BELOW: [2.55, 6.85],                     // on the platform below her window, looking up
  ANNA_IN: [HER_WIN + 0.22, 0.45, FLOOR],        // in her carriage at the window (its frame: across, distance, elevation)
  GUROV_FAR_FROM: [16.8, 6.25],                  // alone_far: he comes along the platform…
  GUROV_FAR_STOP: [27.35, 6.3],                  // … to the last lamp
  GUROV_LAMP: [-5.6, 6.2],                       // alone_turn: under the lamp nearest the house
  HOUSE_DOOR: [-12.75, 4.75],                    // before the station's door
  LAMPS: [-18, -6, 6, 18, 28],                   // the platform's lamps, along its edge (distance 6.9)
  // the shots
  PLATFORM_CAM: { camera_x: -1, camera_z: 2.5, camera_yaw: 40, camera_pitch: 0 },
  WINDOW_CAM: { camera_x: 3.75, camera_z: 4.3, camera_yaw: 0, camera_pitch: 4 },
  END_CAM: { camera_x: 23, camera_z: 1.5, camera_yaw: 65, camera_pitch: 0 },
  HOUSE_CAM: { camera_x: -2, camera_z: 1, camera_yaw: -55, camera_pitch: 0 },
};
