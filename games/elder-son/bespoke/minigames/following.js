// “Following” (III.1, the Hillside, after the beat `hide`; game.md §7): Sarafanov walks to the club by himself (`sar_go` 1; where he is — `sar_at`,
// the scene sets it; three looks back). Held anywhere — Nina and Busygin follow: `follow` = min(`follow_at` + 0.08,
// `sar_at` − 0.1), `hold` 1; let go — they stand (`follow` = `follow_at`, `hold` 0). The arc of danger — on Sarafanov: it grows
// when he is within 0.04 of a place where he looks back (0.25, 0.5, 0.75). At `sar_go:look` (his head begins to turn) — judged
// 0.6 s later: they were walking (`hold` 1, or `follow_at` changed in the last 0.3 s) — he all but saw them: a mistake (into danger), they crouch
// (`duck` 1), counted in `seen`; at `sar_go:on` — they stand up. The end: `sar_go:club` (clean / flawed).
//   Feeling: following his father so that he won't see; wants to keep his lie safe; funny and shameful; the player — freezing in time.
//   → { seen }
import { until, keys } from '../hands.js';

const AHEAD = 0.08, BEHIND = 0.1;
const LOOKS = [0.25, 0.5, 0.75];
const NEAR = 0.04; // to the place he looks back at — the arc grows
const JUDGE = 0.6; // s after his head begins to turn
const MOVED = 0.3; // s — “were walking” lately
const WAIT_MS = 600000;

export default {
  title: 'Following', // (as the author's map lists it)
  about: 40,
  skipped: { seen: 0 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: tr('Sarafanov walks to the club. Now and then he looks back') });
    const send = keys(g);
    const num = k => +g.get(k) || 0;
    let seen = 0, ducked = false, looked = null, club = false, movedAt = -Infinity, was = num('follow_at');
    // (the scene tells the looks back one by one: waited for anew after each)
    const look = () => g.told('sar_go:look', WAIT_MS).then(ok => { if (ok && !signal.aborted) { looked = mg.t; look(); } });
    const on = () => g.told('sar_go:on', WAIT_MS).then(ok => { if (ok && !signal.aborted) { if (ducked) { ducked = false; send('duck', 0); } on(); } });
    g.told('sar_go:club', WAIT_MS).then(ok => { if (ok) club = true; });
    look();
    on();
    send('duck', 0);
    send('hold', 0);
    g.set('sar_go', 1);
    // (his mark — a quiet ring, no touch of its own: its danger arc seen — a light is not)
    const him = mg.mark({ at: 'sarafanov#chest', kind: 'ring', quiet: true, danger: 0 });
    const walk = mg.hold({ on: null, seconds: 1, drain: 0 });
    // (its own first meeting: holding is walking here, letting go — freezing; “Arm in Arm” taught only the first)
    b.minigame.tricks.teach(mg, [walk], { id: 'hold:follow' });
    const done = await until(mg, ({ t }) => {
      const sar = num('sar_at'), now = num('follow_at');
      if (Math.abs(now - was) > 1e-4) { movedAt = t; was = now; }
      const going = walk.state.held && !ducked;
      send('hold', going ? 1 : 0);
      send('follow', going ? Math.max(now, Math.min(now + AHEAD, sar - BEHIND)) : now);
      // the arc of danger: he is about to look back
      const next = LOOKS.find(p => sar <= p + 0.01);
      const danger = next != null && sar >= next - NEAR ? Math.min(1, 1 - (next - sar) / NEAR) : 0;
      him.set({ danger: ducked ? 1 : danger });
      if (looked !== null && t - looked >= JUDGE) {
        if ((going || t - movedAt <= MOVED) && !ducked) {
          seen++;
          ducked = true;
          send('duck', 1);
          send('hold', 0);
          mg.error('danger', { at: him });
        }
        looked = null;
      }
      // (the bar — how far they have come after him: theirs, never going back)
      mg.plate.set({ fill: now, glow: going ? 'good' : 'idle' });
      return club;
    });
    if (!done) return this.skipped;
    send('duck', 0);
    send('hold', 0);
    await mg.end({ as: seen ? 'flawed' : 'clean' });
    return { seen };
  },
};
