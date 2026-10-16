// "The Note" (V.5, the booth in ruins, after the beat `calendar`; the insert `calendar`): Salvatore leafs back through the calendar
// of 1958 behind the booth's door — open at December, the months before turned over the top. Four times, one mark at a time:
// pull the edge of a turned sheet (`calendar#fold`) down by 0.15 of the window's height, against a spring; `fold` — where the sheet is on the way.
// Pulled to the end — the sheet lies over (`pages` + 1: November, October, September, August), a rustle; at the first one the dust flies off
// (`dust` → 0 in 1 s). Let go too soon — the sheet visibly goes back over the top. On August — pencilled lines; 1.5 s — the end.
//   The feeling: Salvatore leafs back through the calendar that hung behind the door for thirty years; he wants to find it and fears to; the player —
//   to open what Alfredo hid.
//   → {} (her note — L126; the sheet in his hand in Rome)
import { until, keys } from '../hands.js';

const PAGES = 4;
const DOWN = 0.15; // a share of the window's height — the sheet's way down
const BACK = 3; // fold a second back, let go
const DUST = 1; // s
const READ = 1.5; // s on August

export default {
  file: 'note',
  title: 'The Note', // as the author's ☰ lists it
  about: 10,
  skipped: {},
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: tr('The 1958 calendar is open at December. The months before are turned over the top') });
    const send = keys(g), acts = new Set();
    const move = (key, value, over) => { const a = b.act('state', 'move', key, value, { over }); acts.add(a); return a; };
    signal.addEventListener('abort', () => { for (const a of acts) a.cancel(); });
    mg.plate.set({ notches: [0.25, 0.5, 0.75] });
    send('pages', 0);
    send('fold', 0);
    for (let p = 1; p <= PAGES; p++) {
      // (pull down to the threshold: a way down with no target — the language tells when it is pulled to the end)
      const edge = mg.mark({ at: 'calendar#fold', kind: 'dash' });
      const sheet = mg.pull({ on: edge, tear: DOWN });
      if (p === 1) b.minigame.tricks.teach(mg, [sheet], { id: 'pull:tear' });
      let torn = false, fold = 0;
      sheet.on('tear', () => { torn = true; });
      const down = await until(mg, ({ dt }) => {
        const s = sheet.state;
        fold = s.held ? s.u : Math.max(0, fold - BACK * dt); // let go — back over the top, visibly
        send('fold', fold);
        mg.plate.set({ fill: (p - 1 + fold) / PAGES, glow: s.held ? 'good' : 'idle' });
        return torn;
      });
      if (!down) return this.skipped;
      send('pages', p);
      send('fold', 0);
      g.sound.paper();
      mg.snap({ at: edge });
      edge.remove();
      if (p === 1) { move('dust', 0, DUST); g.sound.puff(); }
    }
    const t1 = mg.t;
    if (!(await until(mg, ({ t }) => t - t1 >= READ))) return this.skipped;
    await mg.end({ as: 'clean' });
    return {};
  },
};
