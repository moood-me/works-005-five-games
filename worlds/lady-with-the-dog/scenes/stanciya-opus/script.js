// Станция: the scene's mechanics. The train goes where `train` and `far` say (one function: L.trainAt); the beats
// are a film in pieces, started by the game setting `beat` (each ends saying `beat:<name>` and setting `beat_end`).
const L = scene.lib;

function place() {
  const a = L.trainAt(scene.get('train'), scene.get('far'));
  scene.set('train_a', a);
  scene.set('tail_a', a - 6.95);
  scene.set('tail_on', scene.anim.span(a, 40, 120));     // the far halo only once the train is well away
}
for (const k of ['train', 'far']) { scene.on('change', k, place); scene.on('move', k, place); }
place();

// Anna on the platform, in her carriage's frame (she is carried by it: across along it, distance from its side)
const ANNA_ON_PLATFORM = { anna_a: L.ANNA_PLATFORM[0], anna_d: L.ANNA_PLATFORM[1] - L.TRAIN_D, anna_e: -L.TRACK };
const ANNA_AT_WINDOW = { anna_a: L.ANNA_IN[0], anna_d: L.ANNA_IN[1], anna_e: L.ANNA_IN[2] };

// where every beat may begin from: the train standing, the two on the platform by her carriage, the conductor far
function base(extra) {
  const v = {
    fade: 0, train: 0, far: 0, curtain: 0,
    ...L.PLATFORM_CAM,
    anna_here: true, ...ANNA_ON_PLATFORM, anna_turn: 270, anna_do: 'hold_dog', anna_with: ['spitz_held'], anna_look: 'gurov', anna_reach: null,
    gurov_here: true, gurov_a: L.GUROV_PLATFORM[0], gurov_d: L.GUROV_PLATFORM[1], gurov_turn: 90, gurov_do: 'stand', gurov_look: 'anna', gurov_reach: null,
    conductor_here: true, conductor_a: L.CONDUCTOR[0], conductor_d: L.CONDUCTOR[1], conductor_turn: 260, conductor_do: 'stand', conductor_with: ['lantern'], conductor_look: null,
    ...extra,
  };
  v.train_a = L.trainAt(v.train, v.far);
  v.tail_a = v.train_a - 6.95;
  v.tail_on = scene.anim.span(v.train_a, 40, 120);
  return v;
}
// she is in the carriage at her window, her hand on the frame; he stands below on the platform, looking up
const WINDOW = () => base({
  ...L.WINDOW_CAM,
  ...ANNA_AT_WINDOW, anna_turn: 180, anna_do: 'stand', anna_with: null, anna_look: 'gurov', anna_reach: { r: 'carriage#sill' },
  gurov_a: L.GUROV_BELOW[0], gurov_d: L.GUROV_BELOW[1], gurov_turn: 4, gurov_look: 'anna',
});
// the platform empty: the train gone
const EMPTY = extra => base({ train: 1, anna_here: false, conductor_here: false, gurov_look: null, ...extra });

// the train moves off; when her window has slid out of the near shot, the cut to the platform's end (said ahead):
// her carriage passes and goes away down the line
async function departs(s) {
  const end = s.shot({ ...L.END_CAM });
  const go = s.move('train', 1, { over: 14, ease: 'in' });
  await s.until(() => Number(s.state.train_a) > 3);
  await s.until(() => end.ready);
  end.cut();
  await go;
}

const BEATS = {
  // evening; the train stands; she holds the dog, he stands with her; the conductor far off; at the end the bell
  platform: {
    after: [], from: () => base({}),
    run: async s => {
      await s.wait(3);
      s.person('conductor').look('carriage');
      await s.wait(4.5);
      s.person('gurov').look('anna#hands');
      await s.wait(2);
      s.person('gurov').look('anna');
      await s.wait(2.5);
      s.person('conductor').look(null);
      s.tell('platform:bell');
      await s.wait(2);
    },
  },
  // the cut: she is in the carriage at the window, her hand on the frame; he below — the choice is offered here
  board: {
    after: ['platform'], from: WINDOW,
    run: async (s, cut) => {
      if (cut) {
        const next = s.shot(WINDOW());
        await s.until(() => next.ready);
        next.cut();
      }
      await s.wait(6);
    },
  },
  // she looks while it can be seen: her hand on the glass; the train goes; her window gets small down the line
  look_back: {
    after: ['board'], from: WINDOW,
    run: async s => {
      s.person('anna').reach({ r: 'carriage#glass' });
      await s.wait(1.4);
      await departs(s);
    },
  },
  // she draws the curtain; the train goes; a pale shut square goes away down the line
  curtain: {
    after: ['board'], from: WINDOW,
    run: async s => {
      const anna = s.person('anna');
      anna.reach({ r: 'carriage#curtain' });
      await s.wait(0.7);
      await s.move('curtain', 1, { over: 1.8, ease: 'inOut' });
      anna.reach(null);
      anna.look(null);
      await s.wait(0.6);
      await departs(s);
    },
  },
  // the platform empty: he walks along it to the last lamp and stands; far down the line the red light melts away
  alone_far: {
    after: [], from: () => EMPTY({ ...L.END_CAM, gurov_a: L.GUROV_FAR_FROM[0], gurov_d: L.GUROV_FAR_FROM[1], gurov_turn: 90 }),
    run: async s => {
      const gurov = s.person('gurov');
      await gurov.walk([L.GUROV_FAR_STOP]);
      await gurov.turn(72);
      gurov.look('carriage_end#tail_r');
      s.tell('alone_far:stands');
      await s.move('far', 1, { over: 11, ease: 'in' });
      await s.wait(1);
    },
  },
  // he stands under the lamp by the house, turns away from the line and goes to the station's door
  alone_turn: {
    after: [], from: () => EMPTY({ far: 1, ...L.HOUSE_CAM, gurov_a: L.GUROV_LAMP[0], gurov_d: L.GUROV_LAMP[1], gurov_turn: 80 }),
    run: async s => {
      const gurov = s.person('gurov');
      await s.wait(2.5);
      await gurov.walk([L.HOUSE_DOOR]);
      await gurov.turn(320);
      s.tell('alone_turn:door');
      await s.wait(1.5);
    },
  },
};

scene.on('change', 'beat', (name, old) => {
  const b = BEATS[name];
  if (!b) return;
  scene.sequence(async s => {
    const cut = !b.after.includes(old);
    if (cut) {
      const next = s.shot(b.from());
      await s.until(() => next.ready);
      next.cut();
    }
    await b.run(s, !cut);
    s.set('beat_end', name);
    s.tell('beat:' + name);
  }, { name: 'beat' });
});
