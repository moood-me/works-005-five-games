// “Buckets” (IV.3, the Street, after the beat `fire`; game.md §7): its own fire `fire` 0.6, growing 0.01 a second (sent
// as the key), the fire's roar by it. One mark at a time: with an empty bucket — a ring on the barrel (`barrel`); pressed — the scene's turn:
// Busygin fills it (`buckets` 'fill' → `buckets:full`); with a full one — a ring on the shed (`shed`); pressed — he throws (`buckets`
// 'throw' → `buckets:splash`): the fire −0.18, a splash, counted in `buckets`. The neighbours go their own way: every 6 s the fire −0.07, a
// quieter splash. The bar — 1 − `fire` / 0.6. The fire out — 2 s of steam — clean. After 55 s the neighbours have managed by themselves (`fire` → 0 over
// 4 s) — neutral.
//   Feeling: putting out a stranger's shed with the neighbours; wants to put it out; panic and laughter; the player — barrel, shed, faster.
//   → { buckets }
import { until, keys } from '../hands.js';

const START = 0.6, GROW = 0.01; // the fire; a second
const ROAR = 0.25; // s between changes of the roar
const BUCKET = 0.18, NEIGHBOURS = 0.07, EVERY = 6; // the fire a bucket; the neighbours', once in 6 s
const STEAM = 2; // s of steam at the end
const ENOUGH = 55; // s — the neighbours have managed
const SCENE_MS = 30000;

export default {
  title: 'Buckets', // (as the author's ☰ lists it)
  about: 35,
  skipped: { buckets: 3 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: tr('The shed is on fire. The barrel by the fence is full') });
    const send = keys(g), acts = new Set();
    const move = (key, value, over) => { const a = b.act('state', 'move', key, value, { over }); acts.add(a); return a; };
    signal.addEventListener('abort', () => { for (const a of acts) a.cancel?.(); g.sound.fire(0, 1); });
    let fire = START, buckets = 0, roared = -ROAR, helped = 0, full = false, busy = false, tapped = false, first = true;
    let mark = null, press = null;
    // one mark at a time: the barrel (empty) or the shed (with a bucket)
    const place = () => {
      mark = mg.mark({ at: full ? 'shed' : 'barrel', kind: 'ring' });
      press = mg.press({ on: mark });
      press.on('press', () => { if (!busy) tapped = true; });
      if (first) b.minigame.tricks.teach(mg, [press], { id: 'press' });
      first = false;
    };
    // the scene's turn: fill or throw; → once the scene has said it is done
    const act = async () => {
      busy = true;
      tapped = false;
      mg.sceneTurn(true);
      const done = g.told(full ? 'buckets:splash' : 'buckets:full', SCENE_MS);
      g.set('buckets', full ? 'throw' : 'fill');
      const ok = await done;
      if (signal.aborted) return;
      if (ok && full) {
        fire = Math.max(0, fire - BUCKET);
        g.sound.splash(1);
        mg.snap({ at: mark });
        buckets++;
      }
      full = !full;
      mark.remove();
      mg.sceneTurn(false);
      place();
      busy = false;
    };
    place();
    const out = await until(mg, ({ t, dt }) => {
      if (tapped && !busy) act();
      fire = Math.min(1, fire + GROW * dt);
      if (t - helped >= EVERY) { helped = t; fire = Math.max(0, fire - NEIGHBOURS); g.sound.splash(0.5); }
      send('fire', fire);
      if (t - roared >= ROAR) { roared = t; g.sound.fire(0.3 + 0.7 * fire, 0.3); }
      mg.plate.set({ fill: Math.max(0, 1 - fire / START), glow: busy ? 'good' : 'idle' });
      return fire <= 0 || t >= ENOUGH;
    });
    if (!out) return this.skipped;
    const clean = fire <= 0;
    if (clean) send('fire', 0);
    else move('fire', 0, 4); // (the neighbours have managed)
    const t1 = mg.t;
    if (!(await until(mg, ({ t }) => t - t1 >= (clean ? STEAM : 4)))) return this.skipped;
    await mg.end({ as: clean ? 'clean' : 'neutral' });
    return { buckets };
  },
};
