// “Taking counsel” (V.3, the Slaviansky Bazaar, after the beat `counsel`): they look for a way out. Press with a petal on
// three things — the window (`window#window`, “Live in one town”), the door (`door#door`, “Go away together”), the
// glasses (`table#glasses`, “See each other every day”) — or keep silent (the finger shows “hands off” too). A petal
// chosen — the marks hidden (the scene's turn), `think` = the thing, `await opts[thing]()` — their talk, `think` =
// 'none', the others' marks again. The end: all three touched — or 15 s of silence from the start or from the end of
// the last words. The bar — the time of silence.
//   Who does what: they look for a way to live. What they want: to think of a way out. What they feel: everything
//   comes up against a wall. The player: to touch the ways out — or to keep silent.
//   opts: { window(), door(), table() — the talk at each thing (the chapter says the lines) }
//   → { touched: ['window' | 'door' | 'table', … in order] }
import { until, keys } from '../hands.js';

const THINGS = [['window', 'window#window', tr('Live in one town')], ['door', 'door#door', tr('Go away together')], ['table', 'table#glasses', tr('See each other every day')]];
const SILENCE = 15; // s

export default {
  title: 'Taking counsel',
  about: 18,
  skipped: { touched: [] },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: tr('Then they spent a long while taking counsel together') });
    const send = keys(g);
    const touched = [], marks = [];
    let talking = false, quiet = 0;
    for (const [id, at, label] of THINGS) {
      const mark = mg.mark({ at });
      const press = mg.press({ on: mark, petals: [{ id, label }] });
      marks.push({ id, mark, press });
      press.on('choose', async () => {
        if (talking) return;
        talking = true;
        touched.push(id);
        mark.remove();
        mg.sceneTurn(true);
        send('think', id);
        await opts[id]?.();
        if (signal.aborted) return;
        send('think', 'none');
        mg.sceneTurn(false);
        quiet = 0;
        talking = false;
      });
    }
    mg.show({ gestures: [marks[0].press] }).finished.then(() => { if (!signal.aborted) mg.show({ handsOff: true }); });
    const done = await until(mg, ({ dt }) => {
      if (!talking) quiet += dt;
      mg.plate.set({ fill: Math.min(1, quiet / SILENCE), glow: null });
      return !talking && (touched.length === THINGS.length || quiet >= SILENCE);
    });
    if (!done) return this.skipped;
    await mg.end({ as: 'neutral' });
    return { touched };
  },
};
