// «Ждать» (the shore, the night; scene «Берег Каперны», beat `wait`): Assol on the stone, three lights on the
// horizon (the scene's keys light1…light3, each offered at its point `lightN#light`). A touched light comes near
// and turns out to be what it is — a fishing boat (1), a steamer (2), the lighthouse (3) — stays a while and
// goes behind the cape. Kaperna's windows go out one by one, never below 0.1. To do nothing is a way to play:
// the game ends 40 s after its start or after the last touch.
//   → { touched: [light ids in the order touched], waited: no light touched }
const LIGHTS = [1, 2, 3];
const COME = 5; // s: a light comes near
const STAY = 3000; // ms: it stands, seen
const GO = 6; // s: it goes behind the cape
const DARKEN = 3; // s: the windows go down by a quarter of what they were
const LOWEST = 0.1; // the windows never go below
const EVERY = 12000; // ms after the last touch or going-out: one more quarter of the windows
const END = 40000; // ms after the start or the last touch: the game ends

export default {
  title: 'Ждать', // (as the author's ☰ lists it)
  about: 40,
  skipped: { touched: [], waited: true },
  async run(g, b, opts, signal) {
    const w0 = g.get('windows');
    let windows = w0, over = false, dimTimer = null, endTimer = null, finish;
    const ended = new Promise(ok => { finish = ok; });
    signal.addEventListener('abort', finish, { once: true });
    const acts = new Set();
    const touched = [];
    let off = () => {};

    // the scene's key moves; the action is kept to be cancelled
    const move = (key, value, seconds) => {
      const action = b.act('state', 'move', key, value, { over: seconds });
      acts.add(action);
      return action;
    };
    const dim = () => {
      if (windows > LOWEST) move('windows', (windows = Math.max(LOWEST, windows - w0 / 4)), DARKEN);
    };
    // one more quarter after EVERY ms of calm
    const calm = () => {
      clearTimeout(dimTimer);
      dimTimer = setTimeout(() => { dim(); calm(); }, EVERY);
    };
    const tired = () => {
      clearTimeout(endTimer);
      endTimer = setTimeout(finish, END);
    };
    const stand = ms => new Promise(ok => setTimeout(ok, ms));

    const journey = async n => {
      const key = `light${n}`;
      await move(key, 1, COME);
      if (over) return;
      if (n === 1) g.sound.oars();
      if (n === 2) g.sound.horn();
      await stand(STAY);
      if (over) return;
      const going = move(key, 2, GO);
      dim();
      calm();
      await going;
    };

    tired();
    calm();
    const journeys = [];
    const left = new Set(LIGHTS);
    while (left.size && !over) {
      const offers = Object.fromEntries([...left].map(n => [`light${n}#light`, [{ id: `light${n}`, label: 'Всмотреться' }]]));
      const choice = g.choose(null, offers);
      if (!touched.length) off = g.hint('Коснись огня на горизонте — или просто жди'); // after g.choose: it takes the nudge's place
      const id = await Promise.race([choice, ended.then(() => null)]);
      if (!id) break;
      const n = Number(id.slice(5));
      off();
      left.delete(n);
      touched.push(id);
      tired();
      calm();
      journeys.push(journey(n));
    }
    if (!left.size) {
      clearTimeout(endTimer);
      await Promise.race([Promise.all(journeys), ended]);
    } else await ended;

    over = true;
    clearTimeout(dimTimer);
    clearTimeout(endTimer);
    for (const action of acts) action.cancel();
    off();
    g.withdraw();
    return signal.aborted ? this.skipped : { touched, waited: touched.length === 0 };
  },
};
