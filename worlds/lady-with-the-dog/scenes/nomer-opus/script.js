// Номер в Ялте: the scene's mechanics. The plate stands where `plate` says (one function); the beats are a film in
// pieces, started by the game setting `beat` (each ends saying `beat:<name>` and setting `beat_end`).
const L = scene.lib;

const plateAt = p => p === 'bed' ? L.PLATE_BED : L.PLATE_TABLE;
function plate() {
  const [a, d, h] = plateAt(scene.get('plate'));
  scene.set('melon_a', a); scene.set('melon_d', d); scene.set('melon_e', h);
}
scene.on('change', 'plate', plate);
plate();

// where every beat may begin from: night, the candle new; she on the bed's edge, head bowed; he standing at the table
function base(extra) {
  const v = {
    fade: 0, ...L.ROOM_CAM, candle: 0, melon: 0, cut: 0, slice: 0, hands: 0, hand_at: 0, pull: 0, palm: 0, plate: 'table',
    anna_here: true, anna_a: L.ANNA_SEAT[0], anna_d: L.ANNA_SEAT[1], anna_on: L.ANNA_SEAT, anna_turn: 110, anna_do: 'seated_bowed', anna_look: null, anna_reach: null,
    gurov_here: true, gurov_a: L.GUROV_STAND[0], gurov_d: L.GUROV_STAND[1], gurov_on: null, gurov_turn: 15, gurov_do: 'stand', gurov_look: null, gurov_reach: null, gurov_with: null,
    ...extra,
  };
  const [a, d, h] = plateAt(v.plate);
  return { ...v, melon_a: a, melon_d: d, melon_e: h };
}
// he at the table on his chair, the slice cut; the candle lower (what the game leaves after «Арбуз»)
const AT_TABLE = { gurov_a: L.CHAIR_SEAT[0], gurov_d: L.CHAIR_SEAT[1], gurov_on: L.CHAIR_SEAT, gurov_turn: 90, gurov_do: 'seated', cut: 1, slice: 1, candle: 0.4 };
// he beside her on the bed, the plate with the slice by her
const ON_BED = { gurov_a: L.GUROV_BED_SEAT[0], gurov_d: L.GUROV_BED_SEAT[1], gurov_on: L.GUROV_BED_SEAT, gurov_turn: 110, gurov_do: 'seated', cut: 1, slice: 1, candle: 0.4, plate: 'bed' };

const BEATS = {
  // night; the candle; she sits on the bed's edge, head bowed; he stands at the table, his back to us
  room: {
    after: [], from: () => base({ fade: 1 }),
    run: async s => {
      s.move('fade', 0, { over: 1.5, ease: 'out' });
      await s.wait(3.5);
      s.person('gurov').look('candle');
      await s.wait(4.5);
      s.person('gurov').look('watermelon');
      await s.wait(4);
    },
  },
  // she bows her head lower; he turns to her from the table
  room_hold: {
    after: ['room'], from: () => base({}),
    run: async s => {
      s.person('anna').look(L.FLOOR_BEFORE_HER);
      await s.wait(0.8);
      const gurov = s.person('gurov');
      gurov.look('anna');
      await gurov.turn(290);
      await s.wait(1.2);
    },
  },
  // he sits down to the table; the cut into the close-up of the watermelon (its key: an insert opens at once)
  melon: {
    after: ['room_hold'], from: () => base({ gurov_turn: 290, gurov_look: 'anna', anna_look: L.FLOOR_BEFORE_HER }),
    run: async s => {
      const gurov = s.person('gurov');
      gurov.look('watermelon');
      await gurov.go('sit_down', { to: [L.CHAIR_SEAT[0], L.CHAIR_SEAT[1]], turn: 90 });
      gurov.on(L.CHAIR_SEAT);
      gurov.do('seated');
      await s.wait(0.5);
      s.set('melon', 1);
    },
  },
  // back from the close-up: he at the table, the red slice before him; she on the bed — the choice is offered here
  melon_hold: {
    after: ['melon'], from: () => base({ ...AT_TABLE, gurov_look: 'watermelon' }),
    run: async s => {
      if (Number(s.state.melon) > 0) s.set('melon', 0);
      s.person('gurov').look('watermelon');
      await s.wait(3);
    },
  },
  // he eats at the table, not looking at her
  melon_eat: {
    after: ['melon_hold'], from: () => base({ ...AT_TABLE }),
    run: async s => {
      const gurov = s.person('gurov');
      gurov.look('watermelon');
      gurov.do('eat_slow', { loop: true });
      await s.wait(12);
    },
  },
  // he gets up with the plate, takes it to the bed, sets it by her and sits beside her; the close-up of the hands
  beside: {
    after: ['melon_hold'], from: () => base({ ...AT_TABLE }),
    run: async s => {
      const gurov = s.person('gurov');
      gurov.look('anna');
      gurov.on(null);
      await gurov.do('rise');
      s.set('plate', 'held');
      gurov.with(['plate']);
      await gurov.walk([L.GUROV_BED_STAND]);
      const at = [L.PLATE_BED[0], L.PLATE_BED[1], L.PLATE_BED[2] + 0.05];
      gurov.reach({ r: at, l: at });
      await s.wait(0.9);
      s.set('plate', 'bed');
      gurov.with(null);
      gurov.reach(null);
      await gurov.go('sit_down', { to: [L.GUROV_BED_SEAT[0], L.GUROV_BED_SEAT[1]], turn: 110 });
      gurov.on(L.GUROV_BED_SEAT);
      gurov.do('seated');
      await s.wait(0.6);
      s.set('hands', 1);
    },
  },
  // back from the close-up: side by side, his hand behind her back; she leans her head toward his shoulder
  beside_hold: {
    after: ['beside'], from: () => base({ ...ON_BED, ...L.BED_CAM, hand_at: 1, palm: 1 }),
    run: async s => {
      // back from the close-up to the two of them, nearer (the cut said ahead)
      const next = s.shot({ ...L.BED_CAM, hands: 0 });
      await s.until(() => next.ready);
      next.cut();
      s.person('gurov').reach({ l: 'anna#back' });
      s.person('gurov').look('anna');
      const anna = s.person('anna');
      anna.do('seated');
      anna.look('gurov#shoulder_l');
      await s.wait(6);
    },
  },
  // he turns on his chair toward her; she lifts her head, puts her hands to her face, lets them down — she speaks
  confession_table: {
    after: ['melon_eat'], from: () => base({ ...AT_TABLE, ...L.TABLE_CAM }),
    run: async s => {
      const gurov = s.person('gurov'), anna = s.person('anna');
      // nearer: the table and the bed, the room between them (the cut said ahead)
      const next = s.shot({ ...L.TABLE_CAM });
      await s.until(() => next.ready);
      next.cut();
      gurov.do('seated');
      gurov.turn(55);
      gurov.look('anna');
      await s.wait(1.2);
      anna.do('seated');
      anna.look('gurov');
      await s.wait(1.5);
      s.tell('confession_table:speaks');
      anna.reach({ r: 'anna#head', l: 'anna#head' });
      await s.wait(3.2);
      anna.reach(null);
      anna.look(L.FLOOR_BEFORE_HER);
      await s.wait(12);
    },
  },
  // she straightens, turns away toward the balcony, her hands to her face; his hand on her back
  confession_bed: {
    after: ['beside_hold'], from: () => base({ ...ON_BED, ...L.BED_CAM, gurov_reach: { l: 'anna#back' }, gurov_look: 'anna', anna_do: 'seated' }),
    run: async s => {
      const anna = s.person('anna');
      anna.do('seated');
      anna.look(null);
      await anna.turn(66);
      s.tell('confession_bed:speaks');
      anna.reach({ r: 'anna#head', l: 'anna#head' });
      await s.wait(4);
      anna.reach(null);
      anna.look('door_l');
      await s.wait(12);
    },
  },
};

scene.on('change', 'beat', (name, old) => {
  const b = BEATS[name];
  if (!b) return;
  scene.sequence(async s => {
    if (!b.after.includes(old)) {
      const next = s.shot(b.from());
      await s.until(() => next.ready);
      next.cut();
    }
    await b.run(s);
    s.set('beat_end', name);
    s.tell('beat:' + name);
  }, { name: 'beat' });
});
