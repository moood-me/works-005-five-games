// Просмотровый зал (Rome) — what the paintings and the script share: the small screening room in metres, its rows,
// the reel of kisses and the film in beats. Metres: across x (right), distance z (north, toward the screen). The
// start is in the projection booth behind the back wall, at its port: the room seen through the port.
const hash = (n, s) => anim.hash(n, s);
const G = {
  WALL_X: 3.6, BACK_Z: 0, FRONT_Z: 11, CEIL: 3.6,
  PORT: [0, 2.3], PORT_W: 1.0, PORT_H: 0.62,              // the port in the back wall: its middle's height, its opening
  ROWS: [7.6, 6.7, 5.8, 4.9, 4.0, 3.1],                   // the seat backs of rows 1…6 (row 1 nearest the screen)
  SEATS: 9, SEAT_W: 0.55, SEAT_X0: -2.2, HIP: 0.32,
  SCREEN: [0, 10.9], SCREEN_W: 5.2, SCREEN_H: 2.9, SCREEN_Y: 0.9,  // its middle, size, its foot's height
  BOOTH_FLOOR: 0.3,
};
G.seat = (row, i) => [G.SEAT_X0 + i * G.SEAT_W, G.ROWS[row - 1] + G.HIP];
G.SAL = G.seat(4, 4);                                   // the middle of the fourth row
// the reel: the three cut in chapter I (their splices seen), then eight more, faster and faster; the last held
const REEL = ['kiss_cut1', 'kiss_cut2', 'kiss_cut3', 'kiss1', 'kiss2', 'kiss3', 'kiss4', 'kiss5', 'kiss6', 'kiss7', 'kiss8'];
const HOLD = [2.6, 2.6, 2.6, 2.2, 1.9, 1.7, 1.5, 1.4, 1.3, 1.2];  // seconds each is on the screen before the next
G.REEL = REEL;

// a row of seats: dark red velvet backs, a wooden rail, iron standards (seen from behind and, in the last shot, from
// the front: a card shows both sides)
function seatRow(g) {
  const n = G.SEATS, w = G.SEAT_W, x0 = G.SEAT_X0;
  for (let i = 0; i <= n; i++) {
    const x = x0 - w / 2 + i * w;
    g.fillStyle = '#26201c'; g.fillRect(x - 0.025, -0.66, 0.05, 0.66);
    g.fillStyle = '#4a3626'; g.fillRect(x - 0.035, -0.68, 0.07, 0.04);
  }
  for (let i = 0; i < n; i++) {
    const x = x0 + i * w;
    g.fillStyle = '#5a2226';
    g.beginPath(); g.moveTo(x - 0.24, -0.44); g.lineTo(x - 0.24, -0.92); g.quadraticCurveTo(x, -1.0, x + 0.24, -0.92); g.lineTo(x + 0.24, -0.44); g.closePath(); g.fill();
    g.fillStyle = '#3e2a1c'; g.fillRect(x - 0.245, -0.47, 0.49, 0.04);
    g.fillStyle = 'rgba(255,220,200,0.06)'; g.fillRect(x - 0.2, -0.9, 0.4, 0.05);
  }
}
// dark fabric walls with vertical panels of wood
function panels(g, x0, x1, h, seed) {
  g.fillStyle = '#2a2326'; g.fillRect(x0, -h - 0.05, x1 - x0, h + 0.05);
  for (let x = x0 + 0.4; x < x1 - 0.2; x += 1.2) {
    g.fillStyle = '#332a2c'; g.fillRect(x, -h + 0.35, 1.0, h - 1.3);
    g.fillStyle = 'rgba(0,0,0,0.25)'; g.fillRect(x, -h + 0.35, 0.03, h - 1.3);
  }
  g.fillStyle = '#3a2a1e'; g.fillRect(x0, -0.9, x1 - x0, 0.9);
  g.fillStyle = '#4a3624'; g.fillRect(x0, -0.95, x1 - x0, 0.06);
  for (let i = 0; i < (x1 - x0) * 3; i++) { g.fillStyle = 'rgba(255,240,220,0.02)'; g.fillRect(x0 + hash(i, seed) * (x1 - x0), -h + hash(i, seed + 1) * h, 0.3, 0.3); }
}

// ---- the film in beats (modules/beats.js) ----
const cam = (x, z, yaw, h = 0, pitch = 0) => ({ camera_target: null, camera_x: x, camera_z: z, camera_yaw: yaw, camera_h: h, camera_pitch: pitch, camera_roll: 0, camera_look: 0 });
const CAM = {
  PORT: cam(0, -0.9, 0, 0.3, -4),               // in the booth behind the port: the room through it, he alone in row 4 from behind
  FACE: cam(-1.3, 7.05, 147, -0.3, -2),          // in front of him to the left, ≈ 2.2 m: his face 3/4 in the screen's light, the port behind him
};
G.CAM = CAM;
// the camera's way round the row over 14 s: forward through the port, down the left side, round to his face
const ROUND = [[0, -0.9, 0, 0.3], [0, 0.6, 0, 0.3], [-2.4, 2.8, 14, 0.05], [-3.0, 5.6, 70, -0.15], [-2.6, 7.3, 125, -0.25], [-1.3, 7.05, 147, -0.3]];
// the film is a function of the scene: a beat's `from` reads the party's keys (note_in_hand: the note in his hand)
function film(scene) {
const sal = more => ({
  toto_with: scene.get('note_in_hand') ? ['note'] : null, toto_here: true, toto_a: G.SAL[0], toto_d: G.SAL[1], toto_turn: 0, toto_do: { motion: 'seated', loop: true },
  toto_look: 'screen#screen', toto_reach: null, toto_mood: 'neutral', ...more,
});
const has = m => !!kit.cast?.motions?.[m];
const FILM = {
  rome: {
    from: () => ({ lights: 1, beam_on: 0, screen_film: 'none', reel: 0, ...sal({}), ...CAM.PORT }),
    run: async s => {
      await s.wait(1.5);
      await s.move('lights', 0.1, { over: 4, ease: 'inOut' });
      s.tell('rome:sat');
      await s.wait(2.5);
    },
  },
  kisses: {
    after: ['rome'],
    from: () => ({ lights: 0.1, beam_on: 0, screen_film: 'none', reel: 0, ...sal({}), ...CAM.PORT }),
    run: async s => {
      const he = s.person('toto');
      s.move('beam_on', 1, { over: 0.4, ease: 'out' });
      s.set('reel', 0); s.set('screen_film', 'kisses');
      await s.wait(1); s.tell('kisses:start');
      // the camera round the row, slowly, as the reel runs
      s.path(['camera_x', 'camera_z', 'camera_yaw', 'camera_h'], ROUND.slice(1), { over: 14, ease: 'inOut' });
      await s.wait(0.5);
      if (has('lean_seated')) he.do('lean_seated');
      he.look('screen#screen');
      he.mood('smile');
      for (let i = 0; i < HOLD.length; i++) {
        await s.wait(i ? HOLD[i] : HOLD[0] - 0.5);
        s.set('reel', i + 1);
      }
      await s.wait(0.4);
    },
  },
  kisses_end: {
    after: ['kisses'],
    from: () => ({ lights: 0.1, beam_on: 1, screen_film: 'kisses', reel: REEL.length - 1, ...sal({ toto_mood: 'smile' }), ...CAM.FACE }),
    run: async s => {
      const he = s.person('toto');
      await s.wait(5);
      s.set('screen_film', 'white');
      he.do({ motion: 'seated', loop: true }); // (lean_back_seated is hands behind the head: not this)
      await s.wait(1); s.tell('kisses_end:white');
      await s.wait(3); he.mood('sad');
      await s.wait(4); he.mood('smile');
      await s.wait(5);
    },
  },
};
return FILM;
}

return { G, REEL, HOLD, film, seatRow, panels };
