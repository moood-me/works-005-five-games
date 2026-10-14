// Пристань: куски играются по ключу beat; каждый начинается со склейки в известное состояние (from)
const DOOR = [[-2.6, 6.2], [-2.6, 7.0], [-2.5, 7.8], [-2.7, 7.5]];   // где укрываются зрители у двери склада
const RUN = ['c1', 'c2', 'c3', 'c4'];

const BASE = {
  era: 'past', rain: 0, screen_up: 1, screen_el: 0.8, beam_on: 1, cover: 0,
  car: 'none', car_a: 30, car_f: 180, car_go: 0, headlights: 0, camera_z: 0,
  toto_a: -1.0, toto_d: 5.2, toto_turn: 60, toto_here: true, toto_reach: null, toto_look: null,
  elena_a: 0.95, elena_d: 5.5, elena_turn: 15, elena_here: true, elena_reach: null, elena_look: null,
  c1_a: -0.8, c1_d: 8.2, c1_turn: 0, c1_here: true,
  c2_a: 1.4, c2_d: 8.7, c2_turn: 0, c2_here: true,
  c3_a: 2.7, c3_d: 8.1, c3_turn: 0, c3_here: true,
  c4_a: 0.3, c4_d: 9.2, c4_turn: 0, c4_here: true,
};
const rainEnd = {
  rain: 1,
  c1_a: DOOR[0][0], c1_d: DOOR[0][1], c1_turn: 270,
  c2_a: DOOR[1][0], c2_d: DOOR[1][1], c2_turn: 270,
  c3_a: DOOR[2][0], c3_d: DOOR[2][1], c3_turn: 270,
  c4_a: DOOR[3][0], c4_d: DOOR[3][1], c4_turn: 270,
};
const night = {   // the mole at the end of the night, without the screen
  rain: 0, beam_on: 0, cover: 1, screen_up: 0, screen_el: -30, car: 'none', car_a: 30, headlights: 0, camera_z: 25,
  toto_a: 1.0, toto_d: 30.3, toto_turn: 0, toto_here: true, toto_reach: null,
  elena_here: false, elena_reach: null,
  c1_here: false, c2_here: false, c3_here: false, c4_here: false,
};

// the screen's stand is a key the game need not know: screen_up 1 → 0.8 m, 0 → away
scene.on('change', 'screen_up', v => scene.set('screen_el', v > 0.5 ? 0.8 : -30));

function play(name) {
  scene.sequence(async s => {
    const toto = s.person('toto'), elena = s.person('elena');
    if (name === 'summer') {
      s.cut({ ...BASE });
      await s.wait(3);
      scene.tell('summer:screen');
      await s.wait(6);
      scene.tell('summer:rain');
      s.move('rain', 1, { over: 3 });
      const runs = RUN.map((id, i) => s.sequence(async r => {
        await r.wait(scene.random() * 0.6);
        r.person(id).turn(270);
        await r.person(id).walk([DOOR[i]]);
        r.person(id).turn(250 + i * 12);
      }));
      toto.turn(20);
      await s.all(...runs);
      scene.tell('beat:summer');
    } else if (name === 'covered') {
      if (scene.get('rain') < 0.9 || scene.get('beam_on') < 0.9) s.cut({ ...BASE, ...rainEnd });
      toto.look('table#projector');
      toto.reach({ r: 'table#projector', l: 'table#projector' });
      await s.wait(0.8);
      s.move('cover', 1, { over: 1.6 });
      s.move('beam_on', 0, { over: 1.2 });
      await s.wait(1.8);
      elena.turn(350);
      toto.reach(null);
      scene.tell('covered:done');
      await s.wait(1.5);
      scene.tell('beat:covered');
    } else if (name === 'headlights') {
      if (scene.get('cover') < 0.9) s.cut({ ...BASE, ...rainEnd, beam_on: 0, cover: 1 });
      s.set('car', 'old'); s.set('car_f', 180); s.set('car_a', 22);
      s.move('headlights', 1, { over: 0.8 });
      await s.move('car_a', 5.0, { over: 2.6, ease: 'out' });
      scene.tell('headlights:father');
      await s.wait(1.2);
      elena.turn(75);
      await elena.walk([[1.4, 5.5], [2.3, 5.6]]);
      elena.turn(270);
      scene.tell('headlights:turn');
      await s.wait(1.8);
      elena.here(false);
      await s.wait(0.5);
      s.turn('car_f', 360, 2.2);
      await s.move('car_a', 7.2, { over: 2.2, ease: 'inOut' });
      s.move('car_go', 1, { over: 4 });
      await s.move('car_a', 30, { over: 3.2, ease: 'in' });
      s.set('car', 'none');
      s.set('headlights', 0);
      scene.tell('beat:headlights');
    } else if (name === 'found') {
      s.cut({ ...BASE, ...night, elena_here: true, elena_a: -1.9, elena_d: 27.3, elena_turn: 0, toto_a: 1.15, toto_d: 30.3 });
      await s.wait(1.8);
      scene.tell('found:run');
      await elena.walk([[-0.2, 28.7], [0.7, 29.4]]);
      toto.turn(185);
      await s.wait(0.9);
      toto.reach({ r: 'elena#back', l: 'elena#back' });
      elena.reach({ r: 'toto#nape', l: 'toto#nape' });
      scene.tell('found:hug');
      await s.wait(5);
      scene.tell('beat:found');
    } else if (name === 'alone') {
      s.cut({ ...BASE, ...night });
      toto.turn(0);
      await s.wait(5);
      scene.tell('alone:sea');
      await s.wait(3);
      scene.tell('beat:alone');
    }
  }, { name: 'beat' });
}

scene.on('change', 'beat', v => play(v));
play(scene.get('beat'));
