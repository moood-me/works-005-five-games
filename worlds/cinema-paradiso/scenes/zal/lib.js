// Зал — what the paintings and the script share: the hall in metres, the films on its screen, the rows and the
// painted audience. Metres: across x (right of the start's line of sight), distance z (north, toward the screen).
// The start stands at the back of the hall, in the middle, looking at the screen.

const G = {
  WALL_X: 6.5, BACK_Z: -1.5, FRONT_Z: 19, CEIL: 7.4,
  ROWS: [12.5, 11.5, 10.5, 9.5, 8.5, 7.5, 6.5, 5.5],     // the seat backs of rows 1…8 (row 1 nearest the screen)
  SEAT_W: 0.55, SEATS: 18, SEAT_X0: -4.675,               // seat i at SEAT_X0 + i·SEAT_W
  HIP: 0.32,                                              // a sitter's hips in front of their seat back
  AISLE_X: -5.7,                                          // the left aisle (the right one at +5.7)
  DOOR: [5.9, 7.9],                                       // the curtained side door in the left wall (z), 2.6 m high
  BACK_DOOR: [-5.2, -1.5],                                // the way out at the back, left
  LION: [2.4, -1.42, 4.6],                                // the lion's mouth on the back wall, right of the middle: the booth's port
  SCREEN: [0, 18.9, 4.2], SCREEN_W: 7, SCREEN_H: 4,
  STAGE_Z: 17.2, STAGE_H: 0.8,
};
G.seat = (row, i) => [G.SEAT_X0 + i * G.SEAT_W, G.ROWS[row - 1] + G.HIP];
G.PRIEST_I = 1;
G.PRIEST = G.seat(5, G.PRIEST_I);                         // the priest's seat: row 5, by the left aisle — ≈ 3 m from the side door

const hash = (n, s) => anim.hash(n, s);

// ---- the rows ----
// a row of seats as seen from behind: velvet backs on iron standards; ruin — the bare frames, a few backs hanging
function seatRow(g, ruin) {
  const n = G.SEATS, w = G.SEAT_W, x0 = G.SEAT_X0;
  for (let i = 0; i <= n; i++) {                                   // the iron standards between the seats
    const x = x0 - w / 2 + i * w;
    g.fillStyle = ruin ? '#3f3a35' : '#2b2622';
    g.fillRect(x - 0.025, -0.66, 0.05, 0.66);
    g.fillStyle = ruin ? '#5a4f42' : '#4a3626';                     // the armrest
    g.fillRect(x - 0.035, -0.68, 0.07, 0.04);
  }
  for (let i = 0; i < n; i++) {
    const x = x0 + i * w, r = hash(i, ruin ? 41 : 40);
    if (!ruin) {
      g.fillStyle = '#74292d';
      g.beginPath(); g.moveTo(x - 0.24, -0.44); g.lineTo(x - 0.24, -0.88); g.quadraticCurveTo(x, -0.97, x + 0.24, -0.88); g.lineTo(x + 0.24, -0.44); g.closePath(); g.fill();
      g.fillStyle = '#3e2a1c'; g.fillRect(x - 0.245, -0.47, 0.49, 0.04);          // the wooden rail at its foot
      g.fillStyle = 'rgba(255,220,200,0.07)'; g.fillRect(x - 0.2, -0.86, 0.4, 0.05);
    } else if (r < 0.55) {                                                         // the bare frame of the back
      g.strokeStyle = '#4b443c'; g.lineWidth = 0.025;
      g.beginPath(); g.moveTo(x - 0.22, -0.46); g.lineTo(x - 0.22, -0.86); g.lineTo(x + 0.22, -0.86); g.lineTo(x + 0.22, -0.46); g.stroke();
    } else if (r < 0.8) {                                                          // a back hanging askew, the velvet grey
      g.save(); g.translate(x - 0.22, -0.46); g.rotate(0.25 + r * 0.3);
      g.fillStyle = '#5a4c4a'; g.fillRect(0, -0.42, 0.44, 0.42); g.restore();
    }
  }
}
// the painted audience of one row, from behind: heads and shoulders above the seat backs (a few seats empty).
// standing — the same people, their arms up (a layer of their own)
function audience(g, row, seed) {
  const n = G.SEATS, w = G.SEAT_W, x0 = G.SEAT_X0;
  for (let i = 0; i < n; i++) {
    if (row === 5 && i === G.PRIEST_I) continue;                           // the priest's own seat
    if (hash(i, seed) < 0.1) continue;
    const x = x0 + i * w + (hash(i, seed + 1) - 0.5) * 0.08, kind = Math.floor(hash(i, seed + 2) * 5);
    const s = kind === 4 ? 0.78 : 0.94 + hash(i, seed + 3) * 0.1, coat = ['#2c2a2e', '#3b3230', '#2e3338', '#45392f', '#33302c'][Math.floor(hash(i, seed + 4) * 5)];
    g.save(); g.translate(x, 0); g.scale(s, s);
    g.fillStyle = coat;
    g.beginPath(); g.moveTo(-0.22, -0.55); g.quadraticCurveTo(-0.25, -0.98, -0.16, -1.07); g.quadraticCurveTo(0, -1.14, 0.16, -1.07);
    g.quadraticCurveTo(0.25, -0.98, 0.22, -0.55); g.closePath(); g.fill();
    g.fillStyle = '#211a16'; g.beginPath(); g.ellipse(0, -1.2, 0.09, 0.105, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = ['#3a3532', '#4b3f39', '#2c2b2d', '#5a4a40'][Math.floor(hash(i, seed + 5) * 4)];
    if (kind === 0) { g.beginPath(); g.ellipse(0, -1.27, 0.105, 0.05, 0, Math.PI, 0); g.fill(); g.fillRect(-0.12, -1.28, 0.24, 0.022); }          // a cap
    else if (kind === 1) { g.beginPath(); g.moveTo(-0.115, -1.12); g.quadraticCurveTo(-0.12, -1.34, 0, -1.33); g.quadraticCurveTo(0.12, -1.34, 0.115, -1.12); g.lineTo(0.06, -1.05); g.lineTo(-0.06, -1.05); g.fill(); } // a headscarf
    else if (kind === 2) { g.fillRect(-0.15, -1.29, 0.3, 0.02); g.fillRect(-0.085, -1.38, 0.17, 0.1); }   // a hat
    else if (kind === 3) { g.beginPath(); g.ellipse(0, -1.31, 0.06, 0.05, 0, 0, Math.PI * 2); g.fill(); } // hair in a bun
    g.restore();
  }
}
function arms(g, row, seed) {
  const n = G.SEATS, w = G.SEAT_W, x0 = G.SEAT_X0;
  g.lineCap = 'round';
  for (let i = 0; i < n; i++) {
    if ((row === 5 && i === G.PRIEST_I) || hash(i, seed) < 0.1 || hash(i, seed + 6) < 0.45) continue;
    const x = x0 + i * w, both = hash(i, seed + 7) < 0.5, a = (hash(i, seed + 8) - 0.5) * 0.4;
    const coat = ['#2c2a2e', '#3b3230', '#2e3338', '#45392f', '#33302c'][Math.floor(hash(i, seed + 4) * 5)];
    const arm = (x1, y1, x2, y2) => {
      g.strokeStyle = coat; g.lineWidth = 0.1; g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke();
      g.fillStyle = '#3a2c24'; g.beginPath(); g.ellipse(x2, y2 - 0.04, 0.05, 0.06, 0, 0, Math.PI * 2); g.fill();
    };
    arm(x + 0.16, -1.0, x + 0.24 + a * 0.3, -1.42);
    if (both) arm(x - 0.16, -1.0, x - 0.25 + a * 0.3, -1.4);
  }
}

// plaster with its own stains: a w×h rectangle at (x, y)
function plaster(g, x, y, w, h, base, seed, ruin) {
  g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
  g.fillStyle = base; g.fillRect(x, y, w, h);
  for (let i = 0; i < w * h * 0.5; i++) {
    const px = x + hash(i, seed) * w, py = y + hash(i, seed + 1) * h, r = 0.2 + hash(i, seed + 2) * (ruin ? 1.2 : 0.7);
    g.fillStyle = i % 3 ? 'rgba(60,48,40,0.06)' : 'rgba(255,240,220,0.05)';
    g.beginPath(); g.ellipse(px, py, r, r * 0.7, hash(i, seed + 3) * 3, 0, Math.PI * 2); g.fill();
  }
  if (ruin) for (let i = 0; i < w * h * 0.05; i++) {                 // flakes of fallen plaster: the brick shows
    const px = x + hash(i, seed + 9) * w, py = y + hash(i, seed + 10) * h, r = 0.1 + hash(i, seed + 11) * 0.35;
    g.fillStyle = 'rgba(104,88,78,0.7)';
    g.beginPath(); g.moveTo(px - r, py); g.lineTo(px - r * 0.3, py - r * 0.6); g.lineTo(px + r, py - r * 0.2); g.lineTo(px + r * 0.4, py + r * 0.5); g.closePath(); g.fill();
  }
  g.restore();
}

// ---- the film in beats (modules/beats.js): the game sets `beat`; each beat's `from` — all it starts from, cut to
// unless it follows one of its `after`. The shots: metres from the start (camera_x, camera_z), yaw — degrees right of
// north, h — up from the eye (1.7 m), pitch — up.
const cam = (x, z, yaw, h = 0, pitch = 0) => ({ camera_target: null, camera_x: x, camera_z: z, camera_yaw: yaw, camera_h: h, camera_pitch: pitch, camera_roll: 0, camera_look: 0 });
const CAM = {
  BACK: cam(-3.0, 4.6, -2, 0.7, -7),           // behind the last rows: the heads, the beam over them, the screen; the priest left of the middle
  CURTAIN: cam(-7.9, 5.6, 45, -0.25, -2),        // from the corridor behind the curtain: the curtain and the boy at its edge left, the priest right-front
  RUIN: cam(3.0, 16.4, 196, 0.6, 5),           // 1988, from the stage's foot back over the ruined rows to the lion
  LION: cam(-4.0, 15.0, 177, 0, 7),            // from the aisle at row 5 back: Salvatore right, the lion over the back wall
  FACE: cam(-5.72, 7.0, 6, -0.15, 0),            // his face 3/4 from his right-front (≈ 2.2 m), the hall and the screen behind him
};
G.CAM = CAM;
const SAL = [-5.6, 9.2];                      // where Salvatore stops in 1988, by the 5th row, facing the lion
const BOY = [-6.85, 7.35];                    // in the corridor at the door's north jamb, behind the curtain's edge
G.SAL = SAL; G.BOY = BOY;
const brg = (a, b) => { const d = Math.atan2(b[0] - a[0], b[1] - a[1]) * 180 / Math.PI; return d < 0 ? d + 360 : d; };
const IDS = ['adelfio', 'toto'];
const SIT = { motion: 'seated', loop: true };
const base = era => ({
  era, hour: era === 'ruin' ? 0.8 : 0.9, ruin_k: era === 'ruin' ? 1 : 0, past: era === 'ruin' ? 0 : 1, memory_light: 0,
  hall: 'empty', screen_film: 'romance', beam_on: era === 'ruin' ? 0 : 1, rise: 0, laugh: 0, peek: 0, bell: 0, turn: 0,
});
function people(who) {
  const o = {};
  for (const id of IDS) {
    const p = who[id];
    o[id + '_here'] = !!p;
    if (!p) continue;
    o[id + '_a'] = p.at[0]; o[id + '_d'] = p.at[1];
    o[id + '_turn'] = p.turn ?? 180; o[id + '_do'] = p.do || 'stand';
    o[id + '_look'] = p.look ?? null; o[id + '_reach'] = p.reach ?? null; o[id + '_mood'] = p.mood ?? 'neutral';
    if (id === 'toto') { o.toto_wear = p.wear ?? null; o.toto_gait = null; }
  }
  return o;
}
const priestSits = { at: G.PRIEST, turn: 0, do: SIT, look: 'screen#screen' };
const boyHides = { at: BOY, turn: brg(BOY, G.PRIEST), look: 'adelfio', mood: 'surprised' };
const SALT = brg(SAL, [G.LION[0], G.LION[1]]);
const salvatore = more => ({ at: SAL, turn: SALT, wear: kit.cast.characters.salvatore, look: 'lion', ...more });
const FILM = {
  priest: {
    from: () => ({ ...base('past'), ...people({ adelfio: priestSits }), ...CAM.BACK }),
    run: async s => {
      const curtain = s.shot({ ...CAM.CURTAIN, ...people({ adelfio: priestSits, toto: boyHides }) });
      await s.wait(3); s.tell('priest:sat');
      await s.wait(10.5);
      curtain.cut();
      await s.wait(0.5);
    },
  },
  peek: {
    after: ['priest'],
    from: () => ({ ...base('past'), ...people({ adelfio: priestSits, toto: boyHides }), ...CAM.CURTAIN }),
    run: async s => { await s.wait(3); },
  },
  bell_end: {
    after: ['peek'],
    from: () => FILM.peek.from(),
    run: async s => {
      const p = s.person('adelfio'), boy = s.person('toto');
      s.set('peek', 0, 0.4); s.set('bell', 0); s.set('turn', 0);
      p.look(null); p.reach(null);
      await p.go('rise_chair', { from: G.PRIEST, turn: 0 });
      boy.look('adelfio');
      await p.walk([[G.AISLE_X, G.PRIEST[1]], [G.AISLE_X, G.DOOR[1] + 0.3]]);
      s.tell('bell_end:out');
      await p.walk([[G.AISLE_X, 3.2], [-5.2, -0.8]]);
      p.here(false);
      boy.look(null);
      await s.wait(0.6);
    },
  },
  full_hall: {
    from: () => ({ ...base('past'), hall: 'full', screen_film: 'comedy', ...people({}), ...CAM.BACK }),
    run: async s => {
      await s.wait(0.6); s.move('laugh', 1, { over: 0.4 }); await s.wait(0.4); s.tell('full_hall:laugh');
      await s.wait(3.2); s.move('laugh', 0.25, { over: 1.2 });
      await s.wait(2.4); s.move('laugh', 1, { over: 0.3 });
      await s.wait(3.0); s.move('laugh', 0, { over: 2.0 });
      await s.wait(2.4);
    },
  },
  first_kiss: {
    from: () => ({ ...base('past'), hall: 'full', screen_film: 'romance', ...people({ adelfio: priestSits }), ...CAM.BACK }),
    run: async s => {
      const p = s.person('adelfio');
      await s.wait(1);
      s.set('screen_film', 'romance_kiss');           // the screen dissolves into the kiss over 3 s (the screen's animate)
      await s.wait(3); s.tell('first_kiss:kiss');
      s.move('rise', 1, { over: 0.9, ease: 'out' });
      await s.wait(3); s.move('rise', 0.35, { over: 2.5 });
      await s.wait(2); s.tell('first_kiss:priest');
      await p.go('rise_chair', { from: G.PRIEST, turn: 0 });
      await p.walk([[G.AISLE_X, G.PRIEST[1]], [G.AISLE_X, 2.0]]);
      p.here(false);
      s.move('rise', 0, { over: 2 });
      await s.wait(0.8);
    },
  },
  whistle: {
    from: () => ({ ...base('past'), hall: 'standing', screen_film: 'white', rise: 1, ...people({}), ...CAM.BACK }),
    run: async s => {
      s.move('laugh', 0.6, { over: 0.5 });
      await s.wait(1); s.tell('whistle:white');
      await s.wait(5);
    },
  },
  ruin_hall: {
    from: () => ({ ...base('ruin'), hall: 'full', screen_film: 'comedy',
      ...people({ toto: { at: [-7.9, 6.9], turn: 90, wear: kit.cast.characters.salvatore, mood: 'tired' } }), ...CAM.RUIN }),
    run: async s => {
      const sal = s.person('toto');
      const lion = s.shot({ ...CAM.LION });
      await s.wait(1.2);
      await sal.walk([[-6.2, 7.1], SAL]);
      await sal.turn(SALT);
      sal.look('lion'); sal.mood('sad');
      await s.wait(1.2);
      lion.cut();
      s.tell('ruin_hall:seat');
      await s.wait(2.2);
    },
  },
  memory: {
    after: ['ruin_hall'],
    from: () => ({ ...base('ruin'), hall: 'full', screen_film: 'comedy', ...people({ toto: salvatore({ mood: 'sad' }) }), ...CAM.LION }),
    run: async s => {
      const sal = s.person('toto');
      const face = s.shot({ ...CAM.FACE });
      s.move('beam_on', 1, { over: 0.25, ease: 'out' });
      s.move('past', 1, { over: 0.4, ease: 'out' });
      s.move('memory_light', 1, { over: 0.4, ease: 'out' });
      await s.wait(0.5); s.tell('memory:warm');
      s.move('laugh', 1, { over: 0.4 });
      await s.wait(0.7);
      face.cut();
      sal.mood('smile');
      await s.wait(2.7); s.move('laugh', 0.2, { over: 1.2 });
      await s.wait(1.1);
      s.move('past', 0, { over: 1.5, ease: 'inOut' }); s.move('beam_on', 0, { over: 1.5, ease: 'inOut' });
      s.move('laugh', 0, { over: 1.5 }); s.move('memory_light', 0, { over: 1.5, ease: 'inOut' });
      await s.wait(0.6); sal.mood('sad');
      await s.wait(0.9); s.tell('memory:gone');
      await s.wait(1.5);
    },
  },
};

return { G, FILM, seatRow, audience, arms, plaster };

