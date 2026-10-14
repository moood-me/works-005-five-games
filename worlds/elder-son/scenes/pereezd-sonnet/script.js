// «Переезд»: the mechanics. Keys of the game: `beat` (wait | truth | roar | brother), `beat_next`. Moments told:
// wait:light, truth:said, truth:passed, roar:loud, roar:passed, brother:arm, brother:passed.
const L = scene.lib, A = scene.anim;

// the freight's place (metres) from its meaning key
const where = () => { const f = scene.get('freight'); if (typeof f !== 'number') return; const p = L.loco(f); scene.set('freight_a', p.a); scene.set('freight_d', p.d); };
scene.on('change', 'freight', where); scene.on('move', 'freight', where); scene.on('load', where);
// the electric train far off: its meaning key to its place
const far = () => { const v = scene.get('electric'); if (typeof v === 'number') scene.set('el_a', 170 - 320 * v); };
scene.on('change', 'electric', far); scene.on('move', 'electric', far); scene.on('load', far);
// the hour's weight of the night look
const hour = () => { const h = scene.get('hour'); if (typeof h === 'number') scene.set('night', A.ease.smooth(A.span(h, 0.74, 0.9))); };
scene.on('change', 'hour', hour); scene.on('move', 'hour', hour); scene.on('load', hour);

const NINA = [-1.7, 5.25], BUS = [-2.85, 5.0];
// the people standing at the barrier, the barrier down, the light far off: the end of `wait`
const standing = (over = {}) => ({
  hour: 0.82, barrier: 1, bell: 1, freight: 0.04, busygin_a: BUS[0], busygin_d: BUS[1], nina_a: NINA[0], nina_d: NINA[1],
  busygin_turn: 0, nina_turn: 0, busygin_look: null, nina_look: null, busygin_reach: null, nina_reach: null, ...over,
});
const ensure = () => { if (scene.get('barrier') < 0.99 || scene.get('freight') > 0.05) scene.cut(standing()); };

const beats = {
  wait() {
    scene.sequence(async s => {
      const b = s.person('busygin'), n = s.person('nina');
      scene.cut({ ...standing(), hour: 0.78, barrier: 0, bell: 0, freight: 0, busygin_a: -4.4, busygin_d: 2.7, nina_a: -3.4, nina_d: 2.5 });
      s.move('hour', 0.82, { over: 20 });
      b.walk([BUS]);
      await s.wait(0.6);
      const wn = n.walk([NINA]);
      await s.wait(1.4);
      scene.set('bell', 1);
      await s.wait(0.8);
      s.move('barrier', 1, { over: 3.5 });
      await wn;
      await s.wait(3);
      await s.move('freight', 0.04, { over: 4 });
      scene.tell('wait:light');
      await s.wait(4);
    }, { name: 'beat' });
  },
  truth() {
    scene.sequence(async s => {
      ensure();
      const b = s.person('busygin'), n = s.person('nina');
      await s.wait(0.5);
      b.turn(90);
      s.move('freight', 0.1, { over: 4, ease: 'inOut' });
      await s.wait(2.2);
      scene.tell('truth:said');
      await s.wait(2);
      n.turn(25);                     // she turns away to the cars
      await s.until(() => scene.get('freight') >= 0.1);
      await s.move('freight', 0.9, { over: 14, ease: 'linear' });
      await s.move('freight', 1, { over: 4, ease: 'linear' });
      s.move('barrier', 0, { over: 3 });
      scene.set('bell', 0);
      scene.tell('truth:passed');
      n.turn(270);
      await s.wait(1.5);
      const w1 = n.walk([[-2.3, 10], [-1.6, 15], [0.5, 21]]);
      await s.wait(1.0);
      b.walk([[-2.9, 10], [-2.2, 15], [0, 21]]);
      await w1;
    }, { name: 'beat' });
  },
  roar() {
    scene.sequence(async s => {
      ensure();
      const b = s.person('busygin'), n = s.person('nina');
      s.move('freight', 0.1, { over: 4, ease: 'inOut' });
      n.turn(15);
      await s.until(() => scene.get('freight') >= 0.1);
      s.move('freight', 0.9, { over: 14, ease: 'linear' });
      await s.until(() => scene.get('freight') >= 0.4);
      scene.tell('roar:loud');
      b.turn(90);
      await s.wait(2);
      await n.walk([[-2.15, 5.15]]);  // she leans to him
      n.turn(270);
      await s.wait(3);
      scene.set('nina_look', [-1.7, 5.3, 0.4]);
      await s.wait(1.4);
      scene.set('nina_look', null);
      await s.until(() => scene.get('freight') >= 0.9);
      await s.move('freight', 1, { over: 4, ease: 'linear' });
      s.move('barrier', 0, { over: 3 });
      scene.set('bell', 0);
      scene.tell('roar:passed');
      await s.wait(2);
      n.walk([[-2.2, 10], [-1.6, 15], [0.5, 21]]);
      await b.walk([[-2.9, 10], [-2.3, 15], [-0.1, 21]]);
    }, { name: 'beat' });
  },
  brother() {
    scene.sequence(async s => {
      ensure();
      const b = s.person('busygin'), n = s.person('nina');
      s.move('freight', 0.1, { over: 4, ease: 'inOut' });
      await s.wait(1.5);
      n.turn(270);
      b.turn(90);
      await s.wait(1.5);
      scene.set('nina_reach', { l: 'busygin#hand_r' });
      scene.set('busygin_reach', { r: 'nina#hand_l' });
      await s.wait(1.2);
      scene.tell('brother:arm');
      await s.until(() => scene.get('freight') >= 0.1);
      await s.move('freight', 0.9, { over: 14, ease: 'linear' });
      await s.move('freight', 1, { over: 4, ease: 'linear' });
      s.move('barrier', 0, { over: 3 });
      scene.set('bell', 0);
      scene.tell('brother:passed');
      await s.wait(1.5);
      n.turn(0); b.turn(0);
      n.walk([[-2.0, 10], [-1.4, 15], [0.6, 21]]);
      await b.walk([[-3.0, 10], [-2.4, 15], [-0.5, 21]]);
    }, { name: 'beat' });
  },
};
scene.on('change', 'beat', name => { if (name && beats[name]) beats[name](); });
