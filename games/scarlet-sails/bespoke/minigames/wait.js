// «Waiting» (the shore, the night; scene «The Kaperna Shore», beat `wait`): Assol on the stone, three lights on the horizon
// (the scene's keys light1…light3). A ring on each light (`lightN#light`): pressed, it comes near and turns out to be
// what it is — a fishing boat (1), a steamer (2), the lighthouse (3) —, stays a while and goes behind the cape. Kaperna's
// windows go out one by one, never below 0.1. To do nothing is a way: the ghost shows both — a light touched, hands
// off. The bar is the night's waiting: it goes on as nothing is done and goes back, seen, at a touch; full — 40 s after
// the start or the last touch — it ends.
//   → { touched: [light ids in the order touched], waited: no light touched }
import { until } from '../hands.js';

const LIGHTS = [1, 2, 3];
const COME = 5; // s: a light comes near
const STAY = 3000; // ms: it stands, seen
const GO = 6; // s: it goes behind the cape
const DARKEN = 3; // s: the windows go down by a quarter of what they were
const LOWEST = 0.1; // the windows never go below
const EVERY = 12; // s after the last touch or going-out: one more quarter of the windows
const END = 40; // s after the start or the last touch: it ends

export default {
  title: 'Waiting', // (as the author's map lists it)
  about: 40,
  skipped: { touched: [], waited: true },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: tr('The night dragged on, and the lights on the horizon flared and died') });
    mg.plate.set({ glow: null });
    const w0 = g.get('windows'), acts = new Set(), touched = [], journeys = [];
    let windows = w0, calm = 0, since = 0;
    signal.addEventListener('abort', () => { for (const action of acts) action.cancel(); });
    // the scene's key moves; the action is kept to be cancelled
    const move = (key, value, seconds) => {
      const action = b.act('state', 'move', key, value, { over: seconds });
      acts.add(action);
      return action;
    };
    const dim = () => { calm = 0; if (windows > LOWEST) move('windows', (windows = Math.max(LOWEST, windows - w0 / 4)), DARKEN); };
    const journey = async n => {
      const key = `light${n}`;
      await move(key, 1, COME);
      if (signal.aborted) return;
      if (n === 1) g.sound.oars();
      if (n === 2) g.sound.horn();
      await new Promise(ok => setTimeout(ok, STAY));
      if (signal.aborted) return;
      const going = move(key, 2, GO);
      dim();
      await going;
    };
    const presses = LIGHTS.map(n => {
      const mark = mg.mark({ at: `light${n}#light` }), press = mg.press({ on: mark });
      press.on('press', () => {
        mark.remove();
        touched.push(`light${n}`);
        since = 0; calm = 0;
        journeys.push(journey(n));
      });
      return press;
    });
    // (both ways: a light looked into — and hands off)
    mg.show({ gestures: [presses[0]] }).finished.then(done => done && mg.show({ handsOff: true }));
    const done = await until(mg, ({ dt }) => {
      since += dt; calm += dt;
      if (calm >= EVERY) dim();
      mg.plate.set({ fill: Math.min(1, since / END) });
      return since >= END || touched.length === LIGHTS.length;
    });
    if (!done) return this.skipped;
    // (all three looked into: the last one's way to its end)
    if (touched.length === LIGHTS.length) await Promise.race([Promise.all(journeys), new Promise(ok => signal.addEventListener('abort', ok))]);
    if (signal.aborted) return this.skipped;
    for (const action of acts) action.cancel();
    await mg.end({ as: 'neutral' });
    return { touched, waited: touched.length === 0 };
  },
};
