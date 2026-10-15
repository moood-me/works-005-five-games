// «Дом Сарафановых»: the kitchen and the room beyond its doorway — where everything stands (metres: across = the plan's
// x − 2, distance = its z: the kitchen across −2…2, the room 2…6, the near wall with the door at distance 0, the
// window's wall at 4), the people's marks and seats, the film's beats. Shared by the paintings, the script and the
// showcase; the generator (tools/dom-opus/gen.mjs) writes scene.json from it.

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

const H = 2.6;                       // the rooms' height
const WINDOW = { a: -0.2, w: 1.2, h: 1.1, sill: 0.85 };   // in the back wall, over the table
const DOOR = { a: 1.2, w: 0.9, h: 2.0 };                  // the door to the hall, in the near wall
const DOORWAY = { d0: 2.5, d1: 3.5, h: 2.05 };            // in the kitchen's right wall, into the room
const STOVE = { front: -1.25, d0: 1.0, d1: 2.2, h: 2.0 }; // the stove against the left wall: its front at across −1.25
const STOVE_DOOR = [STOVE.front, 1.6, 0.68];              // the fire door (a point)
const TABLE = { a: -0.2, d: 3.2, w: 1.6, depth: 0.8, h: 0.76 };
const LAMP = [-0.2, 3.2, 2.1];
const HOOK = [1.85, 0.03, 1.7];
const STOOL = [-0.35, 0.32];                              // left of the door against the near wall: where the hat is put
const CUPBOARD = { a: 3.15, d: 3.82, w: 1.1, h: 1.95, shelf: 1.32 };

// the seats at the table's ends (the chairs' places) and how one sits there
const SEAT = { l: [-1.28, 3.2, 90], r: [0.88, 3.2, 270] };
// the marks
const SPOT = {
  hall: [1.2, -1.1],                 // in the hall, beyond the door (out of sight)
  inDoor: [1.0, 0.75],               // a step in from the door, already turning left into the kitchen
  stove: [-0.62, 1.62],              // before the stove, its door at his left hand
  near: [0.22, 1.95],                // a step from him (Сарафанов, `enter`)
  close: [-0.2, 1.79],               // close to him: in his arms (`embrace`)
  cupboard: [3.15, 3.15],            // before the cupboard in the room
  doorway: [2.0, 3.0],
};

const CAM = {
  // the kitchen from its near right corner: the stove, the table under the lamp, the window
  wide: { camera_x: 1.75, camera_z: 0.25, camera_yaw: -42, camera_h: -0.1 },
  // close, from the near wall: the two at the stove side by side in profile, the lamp beyond them
  two: { camera_x: 0.45, camera_z: 0.18, camera_yaw: -22, camera_h: -0.1 },
  // from the near side, left of the middle, across the table aslant (the table scenes)
  table: { camera_x: -0.8, camera_z: 0.3, camera_yaw: 20, camera_h: -0.2 },
};
const CAMKEYS = ['camera_x', 'camera_z', 'camera_yaw', 'camera_h'];

const P = (id, p, turn, more = {}) => ({ [`${id}_a`]: p[0], [`${id}_d`]: p[1], ...(turn == null ? {} : { [`${id}_turn`]: turn }),
  [`${id}_look`]: null, [`${id}_reach`]: null, [`${id}_do`]: 'stand', [`${id}_with`]: null, [`${id}_here`]: true, ...more });
const OUT = id => ({ [`${id}_here`]: false, [`${id}_a`]: SPOT.hall[0], [`${id}_d`]: SPOT.hall[1] });
const SEATED = (id, seat) => ({ ...P(id, SEAT[seat], SEAT[seat][2]), [`${id}_do`]: 'seated' });

const NIGHT = { hour: 0.9, door: 0, stove_door: 0, hat_on_stool: 0 };
const FROM = {
  kitchen: { ...CAM.wide, ...NIGHT, stove_door: 0, box_at: 'shelf', rucksack: 'none', coat_b: 'none',
    ...OUT('busygin'), ...OUT('silva'), ...OUT('vasenka'), ...OUT('sarafanov'),
    busygin_wear: null, silva_wear: null, vasenka_wear: null, sarafanov_wear: { who: 'sarafanov_hat' } },
  enter: { ...CAM.wide, ...NIGHT, stove_door: 1, box_at: 'shelf', rucksack: 'chair', coat_b: 'none',
    ...P('busygin', SPOT.stove, 20), ...SEATED('silva', 'l'), ...SEATED('vasenka', 'r'), ...OUT('sarafanov'),
    busygin_wear: null, silva_wear: null, vasenka_wear: null, sarafanov_wear: { who: 'sarafanov_hat' } },
  box_out: { ...CAM.table, ...NIGHT, stove_door: 0, box_at: 'shelf', rucksack: 'none', coat_b: 'hook',
    ...SEATED('busygin', 'l'), ...SEATED('sarafanov', 'r'), ...OUT('silva'), ...OUT('vasenka'),
    busygin_wear: { who: 'busygin_shirt' }, sarafanov_wear: { who: 'sarafanov_home' }, silva_wear: null, vasenka_wear: null },
};
const END = {
  kitchen: { ...FROM.enter, ...CAM.wide, busygin_turn: 270, busygin_do: 'warm_hands', busygin_look: STOVE_DOOR },
};
END.warm_up = { ...FROM.enter, ...CAM.wide };
END.enter = { ...FROM.enter, ...CAM.two, ...P('sarafanov', SPOT.near, 248, { sarafanov_look: 'busygin' }), busygin_look: 'sarafanov', busygin_turn: 68,
  silva_do: 'stand', silva_turn: 120, sarafanov_with: ['long_scarf'], hat_on_stool: 1 };
END.box_out = { ...FROM.box_out, box_at: 'table', sarafanov_look: 'busygin', busygin_look: 'table#box' };
END.box_take = { ...END.box_out, busygin_reach: { r: 'table#box' } };
END.box_give = { ...END.box_out, busygin_reach: { r: 'table#box' } };

const near = (s, id, p, tol = 0.35) => Math.hypot(s.get(`${id}_a`) - p[0], s.get(`${id}_d`) - p[1]) < tol;
async function goOnFrom(s, ends, test) {
  if (!test()) s.cut({ ...ends });
}
const open = (s, ready, values) => (ready ? ready.cut() : s.cut({ ...values }));
const camTo = (s, cam, over, ease = 'inOut') => { for (const k of CAMKEYS) if (k in cam) s.move(k, cam[k], { over, ease }); };
// sit down on a seat: walk to where sitting down begins, sit, go on sitting
async function sit(s, p, seat) {
  const [a, d, turn] = SEAT[seat];
  await p.go('sit_down', { to: [a, d], turn });
  p.do('seated', { loop: true });
}
async function rise(s, p, seat) {
  const [a, d] = SEAT[seat];
  await p.go('rise', { from: [a, d] });
}

const film = {
  // night: the door opens, the three come in from the cold; Васенька sits at the table, his rucksack by his chair;
  // Сильва sits and reaches for the bread; Бусыгин goes to the stove, opens its door and holds his hands to the fire
  async kitchen(s, ready) {
    open(s, ready, FROM.kitchen);
    const bus = s.person('busygin'), sil = s.person('silva'), vas = s.person('vasenka');
    await s.move('door', 1, { over: 1.0, ease: 'out' });
    vas.here(true);
    const v = (async () => { await vas.walk([SPOT.inDoor, [1.4, 2.4]]); s.set('rucksack', 'chair'); await sit(s, vas, 'r'); })();
    await s.wait(0.9);
    sil.here(true);
    const si = (async () => { await sil.walk([SPOT.inDoor, [0.2, 1.4], [-1.0, 2.4]]); await sit(s, sil, 'l'); sil.reach({ r: 'table#bread' }); await s.wait(1.6); sil.reach(null); })();
    await s.wait(0.9);
    bus.here(true);
    await bus.walk([SPOT.inDoor, SPOT.stove]);
    s.move('door', 0, { over: 1.2 });
    await bus.turn(270);
    bus.look(STOVE_DOOR);
    bus.reach({ l: 'stove#door' });
    await s.wait(0.5);
    await s.move('stove_door', 1, { over: 0.8, ease: 'out' });
    bus.reach(null);
    bus.do('warm_hands', { loop: true });
    await s.all(v, si);
    await s.wait(1.2);
    s.tell('kitchen:stove');
    s.tell('beat:kitchen');
  },
  // he turns from the stove to the table; Васенька, not looking up
  async warm_up(s) {
    await goOnFrom(s, END.kitchen, () => near(s, 'busygin', SPOT.stove) && s.get('busygin_here') === true);
    const bus = s.person('busygin'), vas = s.person('vasenka');
    bus.do('stand');
    bus.look('vasenka');
    await bus.turn(20);
    vas.look('table#glass');
    s.tell('warm_up:turn');
    await s.wait(5);
    s.tell('beat:warm_up');
  },
  // the door: Сарафанов in his coat, his hat in his hand; Сильва gets up; the hat put down on the stool by the door;
  // the clock; he comes slowly to Бусыгин at the stove and stops a step from him
  async enter(s, ready) {
    open(s, ready, FROM.enter);
    const sar = s.person('sarafanov'), sil = s.person('silva'), bus = s.person('busygin');
    await s.wait(1.0);
    await s.move('door', 1, { over: 1.0, ease: 'out' });
    sar.here(true);
    await sar.walk([SPOT.inDoor]);
    s.tell('enter:in');
    bus.look('sarafanov');
    await rise(s, sil, 'l');
    sil.turn(120);
    sil.look('sarafanov');
    await sar.walk([[-0.1, 0.62]]);
    await sar.turn(250);
    await sar.do('reach_put');
    sar.with(['long_scarf']);
    s.set('hat_on_stool', 1);
    s.move('door', 0, { over: 1.4 });
    await s.wait(2.2);
    sar.look('busygin');
    // the two close, side by side in profile against the lamp: made ready while he comes, cut to as he stops
    const two = s.shot({ ...CAM.two });
    await sar.walk([[0.75, 1.3], SPOT.near]);
    two.cut();
    await s.all(sar.turn(248), bus.turn(68));
    s.tell('enter:near');
    await s.wait(3);
    s.tell('beat:enter');
  },
  // he takes him in his arms; Бусыгин's hands come to his back; Сильва sits down again behind them
  async embrace(s) {
    await goOnFrom(s, END.enter, () => near(s, 'sarafanov', SPOT.near));
    const sar = s.person('sarafanov'), sil = s.person('silva'), bus = s.person('busygin');
    await sar.walk([SPOT.close]);
    await sar.turn(248);
    sar.do('hug');
    sar.reach({ r: 'busygin#back', l: 'busygin#back' });
    await s.wait(1.2);
    bus.reach({ r: 'sarafanov#back', l: 'sarafanov#back' });
    sar.look(null);
    s.tell('embrace:held');
    await sit(s, sil, 'l');
    await s.wait(2.5);
    s.tell('beat:embrace');
  },
  // the same night, the same table: he gets up, goes into the room to the cupboard, takes the snuffbox from its shelf,
  // comes back, sits and puts it on the oilcloth between them
  async box_out(s, ready) {
    open(s, ready, FROM.box_out);
    const sar = s.person('sarafanov'), bus = s.person('busygin');
    await s.wait(1.6);
    bus.look('sarafanov');
    await rise(s, sar, 'r');
    await sar.walk([SPOT.doorway, SPOT.cupboard]);
    await sar.turn(0);
    sar.look('cupboard#box');
    sar.reach({ r: 'cupboard#box' });
    await s.wait(1.4);
    s.set('box_at', 'none');
    sar.with(['box_held']);
    sar.reach(null);
    await s.wait(0.6);
    sar.look(null);
    await sar.walk([SPOT.doorway]);
    await sit(s, sar, 'r');
    sar.look('table#box');
    sar.reach({ r: 'table#box' });
    await s.wait(1.2);
    s.set('box_at', 'table');
    sar.with(null);
    sar.reach(null);
    sar.look('busygin');
    bus.look('table#box');
    s.tell('box_out:down');
    await s.wait(2);
    s.tell('beat:box_out');
  },
  // he reaches for it (the close-up would open here: the `box` insert of `closeups`, not in this world yet)
  async box_take(s) {
    await goOnFrom(s, END.box_out, () => s.get('box_at') === 'table' && near(s, 'busygin', SEAT.l));
    const bus = s.person('busygin');
    bus.reach({ r: 'table#box' });
    await s.wait(2.2);
    s.tell('box_take:close');
    s.tell('beat:box_take');
  },
  async box_give(s) {
    await goOnFrom(s, END.box_out, () => s.get('box_at') === 'table' && near(s, 'busygin', SEAT.l));
    const bus = s.person('busygin');
    bus.reach({ r: 'table#box' });
    await s.wait(2.2);
    s.tell('box_give:close');
    s.tell('beat:box_give');
  },
  // after the close-up: the box gone from the table; his hand to his breast pocket; the old man leans back
  async box_kept(s) {
    await goOnFrom(s, END.box_take, () => near(s, 'busygin', SEAT.l));
    const bus = s.person('busygin'), sar = s.person('sarafanov');
    s.set('box_at', 'none');
    bus.reach({ r: 'busygin#chest' });
    sar.reach({ r: 'table#glass', l: [TABLE.a + 0.45, TABLE.d + 0.1, TABLE.h] });
    sar.look('busygin');
    await s.wait(2.4);
    bus.reach(null);
    s.tell('box_kept:back');
    await s.wait(4);
    s.tell('beat:box_kept');
  },
  // after the close-up: the box in his hand; he gets up, takes it back to its shelf and stands there, his back to us
  async box_back(s) {
    await goOnFrom(s, END.box_give, () => near(s, 'busygin', SEAT.l));
    const bus = s.person('busygin'), sar = s.person('sarafanov');
    s.set('box_at', 'none');
    bus.reach(null);
    sar.with(['box_held']);
    await rise(s, sar, 'r');
    await sar.walk([SPOT.doorway, SPOT.cupboard]);
    await sar.turn(0);
    sar.reach({ r: 'cupboard#box' });
    await s.wait(1.2);
    s.set('box_at', 'shelf');
    sar.with(null);
    sar.reach(null);
    sar.look([CUPBOARD.a, CUPBOARD.d, 1.1]);
    s.tell('box_back:shelf');
    await s.wait(3.2);
    s.tell('beat:box_back');
  },
};
const AFTER = { warm_up: 'kitchen', embrace: 'enter', box_take: 'box_out', box_give: 'box_out', box_kept: 'box_take', box_back: 'box_give' };

// the walls' paint (shared by the wall cards): the kitchen — green oil paint to 1.2 m under a dark line, whitewash
// above; the room — faded wallpaper with a small pattern over a skirting. w wide, from its foot up h (the room's
// height unless said: a piece over a door is whitewash or paper only)
function kitchenWall(g, e, w, h) {
  const top = -(h || H);
  g.fillStyle = '#d3c8b2';
  g.fillRect(-w / 2, top, w, -top + 0.02);
  if (!h) {
    g.fillStyle = '#5f6e5e';
    g.fillRect(-w / 2, -1.2, w, 1.22);
    g.fillStyle = '#3a4238';
    g.fillRect(-w / 2, -1.24, w, 0.04);
    g.fillStyle = '#4a3a2c';
    g.fillRect(-w / 2, -0.1, w, 0.12);
  }
  g.fillStyle = 'rgba(120,110,95,0.12)';
  for (let i = 0; i < (w > 1.4 ? 6 : 0); i++) {
    g.beginPath();
    g.ellipse(-w / 2 + 0.7 + e.rnd() * (w - 1.4), top + 0.4 + e.rnd() * (-top - 1.8), 0.3 + e.rnd() * 0.3, 0.12 + e.rnd() * 0.2, 0, 0, Math.PI * 2);
    g.fill();
  }
}
function roomWall(g, e, w, h) {
  const top = -(h || H);
  g.fillStyle = '#9d8f78';
  g.fillRect(-w / 2, top, w, -top + 0.02);
  g.fillStyle = 'rgba(70,58,44,0.35)';
  for (let x = -w / 2 + 0.1; x < w / 2; x += 0.22) for (let y = top + 0.12; y < -0.2; y += 0.26) {
    g.beginPath();
    g.arc(x + ((y * 10) % 2 ? 0.11 : 0), y, 0.025, 0, Math.PI * 2);
    g.fill();
  }
  if (!h) {
    g.fillStyle = '#4a3a2c';
    g.fillRect(-w / 2, -0.12, w, 0.14);
  }
}

return { kitchenWall, roomWall, H, WINDOW, DOOR, DOORWAY, STOVE, STOVE_DOOR, TABLE, LAMP, HOOK, STOOL, CUPBOARD, SEAT, SPOT, CAM, FROM, END, AFTER, film, clamp };
