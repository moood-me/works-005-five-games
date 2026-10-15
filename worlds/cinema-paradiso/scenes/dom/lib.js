// Дом Ди Вита — the room's numbers, its shots and its film in beats (beats module: FILM). Metres: x across (right +),
// z ahead from the south wall where the start stands, looking north. Shared by the paintings and the script.
const G = {
  ROOM: { x0: -2.8, x1: 2.8, z0: 0, z1: 4.8, h: 2.8 },
  TABLE: { x: -0.5, z: 3.4, w: 1.3, d: 0.8, top: 0.76 },
  LAMP: { x: -0.5, z: 3.4, y: 1.86 },
  PHOTO: { x: -0.5, y: 1.72 },
  WINDOW: { x: -2.05, w: 0.8, sill: 1.0, top: 2.1 },
  DOOR: { z0: 1.3, z1: 2.25, top: 2.05 },
  // the seats: hips over them; turned the way the sitter faces
  CHAIR_N: [-0.5, 4.07], CHAIR_E: [0.34, 3.4], CHAIR_W: [-1.34, 3.4], SEAT: 0.46,
  // Toto's corner: behind the curtain on the right (east), its partition on the south
  CORNER: { x0: 1.2, x1: 2.8, z0: 0.6, z1: 4.8, gap0: 2.55, gap1: 3.45 },
  BED: { x0: 2.06, x1: 2.76, z0: 2.6, z1: 4.6, top: 0.48 },
  SHELF: { z0: 2.9, z1: 4.2, y: 1.38 },
  PROJ: [2.62, 3.115, 1.475], // the home projector's lens on the shelf (its element stands at z 3.3)
  SCREEN: [2.0, 0.63, 1.5], // the little square on the partition
  SCREEN_W: 0.52, SCREEN_H: 0.39,
};
// the bearing (degrees right of north) from a to b, and how far
const bearing = (a, b) => (Math.atan2(b[0] - a[0], b[1] - a[1]) * 180) / Math.PI;
const dist = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);
// the home projector's beam: from its lens to the square, in its vertical plane (kino.beam's +x along it)
G.BEAM = {
  len: Math.hypot(dist(G.PROJ, G.SCREEN), G.SCREEN[2] - G.PROJ[2]),
  facing: bearing(G.PROJ, G.SCREEN) + 90,
  tilt: Math.atan2(G.PROJ[2] - G.SCREEN[2], dist(G.PROJ, G.SCREEN)), // down (+) from level
};

// ---- the camera's shots (metres from the start; yaw — degrees right of north; h — the eye from 1.7) ----
const cam = (x, z, yaw, h = 0, pitch = 0) => ({ camera_target: null, camera_shot: null, camera_x: x, camera_z: z, camera_yaw: yaw, camera_h: h, camera_pitch: pitch, camera_roll: 0, camera_look: 0 });
const CAM = {
  table: cam(0.85, 1.05, -24, -0.3, 1),     // the table under the lamp, the photo over it, the window at the left
  photo: cam(-0.45, 2.05, -2, -0.15, -7),      // close on the mother at the table, the photo over her: medium
  call: cam(-1.75, 4.5, 145, -0.25, -3),     // from behind the table, past the lamp: the two of them face to face in its light
  answer: cam(-1.6, 4.55, 148, -0.3, -2),    // from behind the table, past the lamp: Toto reading in its light, his face to us
  corner: cam(2.45, 0.72, -10, -0.38, -3),     // inside the corner by its partition: the bed, the gap in the curtain
  movie: cam(2.3, 4.45, 186, -0.25, -4),     // over the bed's head: his back, the beam, the square on the partition
};

// ---- places ----
const P = {
  MILK_BY: [-0.62, 3.98],     // the mother pouring, behind the table
  BOY_E: G.CHAIR_E,            // the boy at the table's east end
  BOY_W: [-1.42, 3.05],        // the boy by the table's west end
  BOY_SH: [-1.05, 3.98],       // beside her chair, at her right shoulder
  M_CALL: [-1.05, 2.8], T_CALL: [0.0, 2.85], T_LAMP: [-0.42, 2.8],
  GAP: [1.12, 3.05],           // the old mother in the gap of the curtain
  M_IN: [1.45, 2.52],          // …and a step into the corner, by him
  S_IN: [0.4, 2.95], S_MID: [2.05, 2.62], S_BED: [2.0, 2.92], S_SHELF: [2.38, 3.25],
};

// ---- the light a beat begins in ----
const light = (hour, era) => ({ hour, era, night_k: hour >= 0.85 || hour < 0.2 ? 1 : 0, now_k: era === 'now' ? 1 : 0 });
const base = (hour, era = 'past') => ({
  ...light(hour, era), lamp: era === 'now' ? 0 : 1, hand_lamp: era === 'now' ? 1 : 0, letters: 'none', pile: 0,
  projector_on: 0, milk: 0, jug_held: 0,
});
// the people a beat begins with: {id: {at, turn, do, look, reach, with, wear, on, mood}} — the others not here
const CHARS = () => kit.cast.characters;
function people(who) {
  const o = {};
  for (const id of ['maria', 'toto']) {
    const p = who[id];
    o[id + '_here'] = !!p;
    if (!p) continue;
    o[id + '_a'] = p.at[0]; o[id + '_d'] = p.at[1];
    o[id + '_turn'] = p.turn ?? 180; o[id + '_do'] = p.do ?? 'stand';
    o[id + '_look'] = p.look ?? null; o[id + '_reach'] = p.reach ?? null; o[id + '_with'] = p.with ?? null;
    o[id + '_wear'] = p.wear ?? null; o[id + '_on'] = p.on ?? null; o[id + '_mood'] = p.mood ?? 'neutral';
    o[id + '_gait'] = null; o[id + '_steps'] = true;
  }
  return o;
}
const seat = (xz, h = G.SEAT) => [xz[0], xz[1], h];
const SIT = { motion: 'seated', loop: true };
// the old mother's lamp held up before her, at her chest, toward the corner
const LAMP_UP = [1.45, 3.12, 1.15];
const LAMP_IN = [1.72, 2.68, 1.12]; // …held toward him in the corner

// ---- the film ----
const FILM = {
  // 1949, night, the lamp: the mother pours the milk; the boy at the table; the photo on the wall
  supper: {
    from: () => ({ ...base(0.92), ...people({
      maria: { at: P.MILK_BY, turn: 170, look: 'milk', mood: 'tired' },
      toto: { at: G.CHAIR_E, on: seat(G.CHAIR_E), turn: 270, do: SIT, look: 'milk', mood: 'neutral' } }), ...CAM.table }),
    run: async s => {
      const m = s.person('maria'), boy = s.person('toto');
      await s.wait(0.8);
      s.set('jug_held', 1);
      m.do('pour');
      await s.wait(0.6);
      await s.move('milk', 1, { over: 2.2, ease: 'inOut' });
      s.tell('supper:milk');
      await s.wait(0.5);
      s.set('jug_held', 0);
      m.do('stand');
      m.look('toto'); boy.look('maria');
      await s.wait(1.2);
      boy.mood('smile');
      boy.reach({ r: 'milk' });
      await s.wait(2.4);
      m.mood('neutral');
      await s.wait(1.6);
    },
  },
  // 1949, night, the lamp: the mother at the table, her head down on her arms; the boy's hand on her shoulder; she
  // lifts her face to the photo
  photo: {
    from: () => ({ ...base(0.93), ...people({
      maria: { at: G.CHAIR_N, on: seat(G.CHAIR_N), turn: 180, do: { motion: 'seated_bowed', from: 5.9 }, look: [-0.5, 3.4, 0.76], reach: { r: [-0.36, 3.62, 0.8], l: [-0.64, 3.62, 0.8] }, mood: 'sad' },
      toto: { at: P.BOY_W, turn: 40, look: 'maria', mood: 'sad' } }), ...CAM.photo }),
    run: async s => {
      const m = s.person('maria'), boy = s.person('toto');
      await s.wait(1.6);
      await boy.walk([P.BOY_SH]);
      await boy.turn(95);
      await s.wait(0.6);
      boy.reach({ r: 'maria#shoulder_r' });
      await s.wait(1.4);
      s.tell('photo:hand');
      await s.wait(1.2);
      m.reach(null);
      m.do('seated', { loop: true });
      m.look('photo#photo');
      await s.wait(4.5);
      m.look('toto');
      await s.wait(3.2);
    },
  },
  // 1958, evening, the lamp: the mother holds out a paper to Toto; he takes it
  call: {
    from: () => ({ ...base(0.8), ...people({
      maria: { at: P.M_CALL, turn: 75, look: 'toto', with: ['paper_sheet'], mood: 'sad' },
      toto: { at: P.T_CALL, turn: 245, look: 'maria', wear: CHARS().toto_teen, mood: 'neutral' } }), ...CAM.call }),
    run: async s => {
      const m = s.person('maria'), t = s.person('toto');
      await s.wait(1.2);
      m.do('give');
      await s.wait(1.2);
      t.look('maria#hand_r');
      t.reach({ r: 'maria#hand_r' });
      await s.wait(0.8);
      m.with(null); t.with(['paper_sheet']);
      t.reach({ r: [-0.1, 2.62, 1.12] });
      s.tell('call:paper');
      await s.wait(1.2);
      m.do('stand');
      await s.wait(2.0);
      t.look('toto#hand_r'); t.mood('thinking');
      await s.wait(3);
    },
  },
  // (after call) on the table a pile of envelopes stamped back; she lays one more on it
  returned: {
    after: ['call'],
    from: () => ({ ...base(0.8), letters: 'returned', ...people({
      maria: { at: P.M_CALL, turn: 75, look: 'toto', mood: 'sad' },
      toto: { at: P.T_CALL, turn: 245, look: 'toto#hand_r', with: ['paper_sheet'], wear: CHARS().toto_teen, mood: 'thinking' } }), ...CAM.call }),
    run: async s => {
      const m = s.person('maria'), t = s.person('toto');
      s.set('letters', 'returned');
      await m.walk([[-0.62, 2.95]]);
      await m.turn(10);
      m.look('letters#pile');
      t.look('letters#pile');
      m.reach({ r: 'letters#pile' });
      await s.wait(1.2);
      s.set('pile', 1);
      await s.wait(0.6);
      m.reach(null);
      s.tell('returned:pile');
      await s.wait(1.2);
      m.look('toto'); t.mood('sad');
      await s.wait(4.5);
    },
  },
  // (after call) on the table a pile of her letters; Toto by the lamp reads one, smiling
  answered: {
    after: ['call'],
    from: () => ({ ...base(0.8), letters: 'answered', ...people({
      maria: { at: P.M_CALL, turn: 75, look: 'toto', mood: 'neutral' },
      toto: { at: P.T_CALL, turn: 245, look: 'toto#hand_r', with: ['paper_sheet'], wear: CHARS().toto_teen, mood: 'thinking' } }), ...CAM.call }),
    run: async s => {
      const t = s.person('toto'), m = s.person('maria');
      s.set('letters', 'answered');
      t.with(null);
      const shot = s.shot({ ...CAM.answer });
      await t.walk([P.T_LAMP]);
      await t.turn(330);
      t.with(['letter_sheet']);
      t.do('read', { loop: true });
      t.look('toto#letter');
      m.look('toto');
      await s.wait(1.2);
      await s.until(() => shot.ready);
      shot.cut();
      await s.wait(1.2);
      t.mood('smile');
      s.tell('answered:reading');
      m.look('toto');
      await s.wait(5.5);
    },
  },
  // 1988, night: the corner as it was; the old mother in the gap of the curtain with a lamp; Salvatore comes in and
  // stands in the middle of it (the home projector and the tin «Е.» on the shelf, if he kept the reel)
  room: {
    from: () => ({ ...base(0.92, 'now'), ...people({
      maria: { at: P.GAP, turn: 112, look: 'toto', with: ['lamp_hand'], reach: { r: LAMP_UP }, wear: CHARS().maria_old, mood: 'sad' },
      toto: { at: P.S_IN, turn: 90, look: [2.4, 3.6, 1.0], wear: CHARS().salvatore, mood: 'tired' } }), ...CAM.corner }),
    run: async s => {
      const m = s.person('maria'), t = s.person('toto');
      await s.wait(0.8);
      await t.walk([[1.2, 2.5], P.S_MID]);
      await t.turn(20);
      t.look('shelf#middle');
      m.look('toto');
      s.tell('room:door');
      await s.wait(2.2);
      t.look('bed#pillow');
      await s.wait(1.8);
      await t.turn(250);
      t.look('maria');
      await s.wait(1.5);
    },
  },
  // (after room) he switches the home projector on: the little square on the partition, the girl crossing the square;
  // he sits on the bed and watches, his back to us
  home_movie: {
    after: ['room'],
    from: () => ({ ...base(0.92, 'now'), ...people({
      maria: { at: P.GAP, turn: 112, look: 'toto', with: ['lamp_hand'], reach: { r: LAMP_UP }, wear: CHARS().maria_old, mood: 'sad' },
      toto: { at: P.S_MID, turn: 250, look: 'maria', wear: CHARS().salvatore, mood: 'tired' } }), ...CAM.corner }),
    run: async s => {
      const m = s.person('maria'), t = s.person('toto');
      t.look('home_projector');
      await t.walk([P.S_SHELF]);
      await t.turn(70);
      t.reach({ r: 'home_projector#switch' });
      await s.wait(0.8);
      s.set('projector_on', 1);
      await s.wait(0.5);
      t.reach(null);
      const shot = s.shot({ ...CAM.movie });
      await t.turn(200);
      t.look('home_screen');
      await s.until(() => shot.ready);
      shot.cut();
      await t.go("sit_down", { to: P.S_BED, turn: 210 });
      t.do('seated', { loop: true });
      t.look('home_screen');
      m.look('home_screen');
      s.tell('home_movie:light');
      await s.wait(6.5);
    },
  },
  // (after room, home_movie) he sits on the bed, the mother with her lamp in the gap: both faces in its light
  question: {
    after: ['room', 'home_movie'],
    from: () => ({ ...base(0.92, 'now'), ...people({
      maria: { at: P.M_IN, turn: 78, look: 'toto', with: ['lamp_hand'], reach: { r: LAMP_IN }, wear: CHARS().maria_old, mood: 'sad' },
      toto: { at: P.S_BED, on: seat(P.S_BED, G.BED.top), turn: 210, do: SIT, look: 'maria', wear: CHARS().salvatore, mood: 'tired' } }), ...CAM.corner }),
    run: async s => {
      const m = s.person('maria'), t = s.person('toto');
      if (s.get('camera_z') > 3) s.cut({ ...CAM.corner });
      if (!s.get('projector_on')) {
        // (after `room`: he stands in the middle — he goes to the bed and sits; after `home_movie` he sits already)
        await t.go('sit_down', { to: P.S_BED, turn: 210 });
        t.do('seated', { loop: true });
      }
      // (the reel has run out: the little square goes dark) — she comes a step into the corner with her lamp
      s.move('projector_on', 0, { over: 1.5 });
      t.look('maria');
      m.reach(null);
      const step = m.walk([P.M_IN]);
      await s.wait(1);
      s.tell('question:asked');
      await step;
      await m.turn(78);
      m.reach({ r: LAMP_IN });
      m.look('toto');
      await s.wait(3);
      t.look([1.6, 0.6, 1.0]);
      await s.wait(3);
      t.look('maria');
      await s.wait(2.5);
    },
  },
};

return { G, CAM, P, FILM, light, bearing };
