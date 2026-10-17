// “By the hand” (V.2, Moscow, after the beat `walk_hand`; STREET_CAM): Gurov takes his daughter to school — toward
// the camera, from the porch to the gates. Hold anywhere (the response at the daughter's hand, `daughter#hand_r`):
// held — they walk (`go` 1); let go — they stand (`go` 0; the daughter raises her face to him — the scene), the stops
// counted — not an error. Where they are — `walked` 0…1 (the scene sets it at once). The lines — `opts.lines[i]()` in
// turn, when `walked` passes 0.35, 0.6, 0.9, 1, one after another, not interrupting. The end — they are there and all
// four are said.
//   Who does what: Gurov takes his daughter to school. What he wants: to be a good father in the open life.
//   What he feels: warmth and emptiness. The player: to lead and to listen.
//   opts: { lines: [four functions — the lines in order] }
//   → { stops: how many times they stopped }
import { until, keys } from '../hands.js';

const AT = [0.35, 0.6, 0.9, 1]; // where each line is said

export default {
  title: 'By the hand',
  about: 20,
  skipped: { stops: 0 },
  async run(g, b, opts, signal) {
    const lines = opts.lines ?? [];
    const mg = g.minigame({ phrase: tr('Wet snow was falling; his daughter held his hand') });
    const send = keys(g);
    const hand = mg.mark({ at: 'daughter#hand_r', kind: 'groove' });
    const hold = mg.hold({ on: null, show: hand, seconds: 0.3, drain: 0.3 });
    b.minigame.tricks.teach(mg, [hold], { id: 'hold:anywhere' });
    let walked = +g.get('walked') || 0, stops = 0, going = false, said = 0, speaking = null;
    g.watch('walked', v => { walked = +v || 0; });
    send('go', 0);
    const done = await until(mg, () => {
      const h = hold.state.held;
      if (h !== going) {
        if (going && walked < 1) stops++;
        going = h;
        send('go', h ? 1 : 0);
      }
      if (!speaking && said < lines.length && walked >= AT[said] - 0.001) {
        const i = said++;
        speaking = Promise.resolve(lines[i]?.()).finally(() => { speaking = null; });
      }
      mg.plate.set({ fill: walked, glow: going ? 'good' : 'idle' });
      return walked >= 1 && said >= lines.length && !speaking;
    });
    if (!done) return this.skipped;
    send('go', 0);
    mg.snap({ at: hand });
    await mg.end({ as: 'neutral' });
    return { stops };
  },
};
