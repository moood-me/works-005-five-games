// “Lorgnette” (I.2, the sea-front, after the beat `gangway`; GANGWAY_CAM, the light's look `glass`): Anna looks at the
// arrivals through her lorgnette. Press: a ring on the head of each of the last two let go (the mark follows the
// point). Its own `pass` (how many have come down) rises by 1 every 4 s — the scene leads the next one down the
// gangway, in order p1…p4, stranger (with a lady), p5, p6. Pressed — `look_at` = him for 1.5 s (he slows, turns his
// head), the mark taken off. Before the fifth — a wait for `gangway:stranger`: when the tall stooping man has stopped
// below, his back to us, the stream stands, the mark on him alone; pressed — a heartbeat, she looks hard, he turns to
// his lady — a stranger's face (`stranger_turned` 1); 12 s not pressed — he turns by himself, without a sound. Then p5,
// p6; the crowd surges (`surge` 1), the end 1 s later.
//   Who does what: Anna looks through her lorgnette for acquaintances from S. What she wants: that there be none.
//   What she feels: fear and shame. The player: to look hard and to dread being known.
//   → { looked: how many she looked hard at, stranger: whether she looked at the stooping man }
import { until, keys } from '../hands.js';

const ORDER = ['p1', 'p2', 'p3', 'p4', 'stranger', 'p5', 'p6'];
const STEP = 4; // s between arrivals
const LOOK = 1.5; // s she looks hard
const WAIT = 12; // s the stooping man waits for a look
const TOLD = 20000; // ms: the stooping man has come to the gangway's foot (the scene tells; without it — on all the same)
const AFTER = 1; // s after `surge` — the end

export default {
  title: 'Lorgnette',
  about: 32,
  skipped: { looked: 0, stranger: false },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: tr('Passengers came down the gangway; there might be acquaintances among them') });
    const send = keys(g);
    let pass = 0, next = STEP, phase = 'flow', looked = 0, stranger = false, lookTill = -1, standFrom = -1, end = -1, taught = false;
    const marks = []; // [{id, mark}] — on those let go, the last two
    const unmark = m => { m.mark.remove(); marks.splice(marks.indexOf(m), 1); };
    const look = (id, t) => { send('look_at', id); lookTill = t + LOOK; };
    const markOn = (id, onPress) => {
      const mark = mg.mark({ at: `${id}#head` });
      const press = mg.press({ on: mark });
      if (!taught) { taught = true; b.minigame.tricks.teach(mg, [press], { id: 'press' }); }
      const m = { id, mark };
      press.on('press', () => onPress(m));
      return m;
    };
    const onPassenger = m => { looked++; look(m.id, mg.t - t0); mg.snap({ at: m.mark }); unmark(m); };
    let arrived = null; // the wait for the stooping man at the gangway's foot
    const t0 = mg.t;
    send('pass', 0);
    send('look_at', '');
    const done = await until(mg, ({ t: now }) => {
      const t = now - t0;
      if (lookTill >= 0 && t >= lookTill) { lookTill = -1; send('look_at', ''); }
      if (end >= 0) return t >= end;
      if (phase === 'flow' && t >= next) {
        if (pass === ORDER.length) {
          send('surge', 1);
          for (const m of [...marks]) unmark(m);
          end = t + AFTER;
          return false;
        }
        const id = ORDER[pass];
        if (id === 'stranger') {
          // (the wait is set before he is let go)
          arrived = g.told('gangway:stranger', TOLD);
          arrived.then(() => { if (phase === 'walk') phase = 'arrived'; });
          phase = 'walk';
          for (const m of [...marks]) unmark(m);
        }
        pass++;
        send('pass', pass);
        if (id !== 'stranger') {
          marks.push(markOn(id, onPassenger));
          while (marks.length > 2) unmark(marks[0]);
        }
        next = t + STEP;
      }
      if (phase === 'arrived') {
        // the stream stands: the mark on him alone
        phase = 'stranger';
        standFrom = t;
        marks.push(markOn('stranger', m => {
          looked++;
          stranger = true;
          g.sound.heart();
          look('stranger', mg.t - t0);
          mg.snap({ at: m.mark });
          unmark(m);
          phase = 'turning';
          standFrom = mg.t - t0;
        }));
      }
      if (phase === 'stranger' && t - standFrom >= WAIT) {
        for (const m of [...marks]) unmark(m);
        send('stranger_turned', 1);
        phase = 'flow';
        next = t + STEP;
      }
      if (phase === 'turning' && t - standFrom >= LOOK) {
        send('stranger_turned', 1);
        phase = 'flow';
        next = t + STEP;
      }
      mg.plate.set({ fill: pass / ORDER.length, glow: 'idle' });
      return false;
    });
    if (!done) return this.skipped;
    await mg.end({ as: 'neutral' });
    return { looked, stranger };
  },
};
