// “Tea” (V.3, the Slaviansky Bazaar, after the beat `tea`; the insert `tea`): Gurov pours tea while she weeps at the
// window. Two moves. 1) Pull: a ring with dashes on the glass (`tea#glass`), the target — under the tap (`tea#under`);
// where the glass is — `glass_at`; there — a snap. 2) Hold with danger: a ring with a groove on the tap (`tea#tap`):
// held — the tap open (`tap` 1), the tea (`fill`) rises 0.12 a second, at each opening — a gurgle; the arc of danger —
// from 0.8 to 1. Let go at 0.82…0.95 — a snap, the end 0.8 s later. Overfilled (more than 1) — the error `danger`,
// a puddle on the saucer (`spill` to 1 over 0.5 s), drops, the tap shut, `fill` 0.9, the end 1 s later. The
// bed of weeping is the chapter's.
//   Who does what: Gurov pours tea while she weeps. What he wants: to wait out her tears, to do something. What he
//   feels: care in a small thing. The player: two moves, the second with danger.
//   → { spills: whether it overflowed (0 | 1) }
import { until, keys } from '../hands.js';

const RATE = 0.12; // tea a second
const FROM = 0.82, TO = 0.95; // where to let go
const DANGER = 0.8; // from what level the arc
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export default {
  title: tr('Tea'),
  about: 14,
  skipped: { spills: 0 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: tr('The samovar was hot, and she was still crying at the window') });
    const send = keys(g);
    const acts = [];
    signal.addEventListener('abort', () => acts.forEach(a => a.cancel()));
    // 1) the glass under the tap
    const glass = mg.mark({ at: 'tea#glass', kind: 'dash' });
    const carry = mg.pull({ on: glass, to: 'tea#under' });
    b.minigame.tricks.teach(mg, [carry], { id: 'pull' });
    let placed = false;
    carry.on('release', ({ inTarget }) => { if (inTarget) placed = true; });
    const moved = await until(mg, () => {
      send('glass_at', carry.state.u);
      mg.plate.set({ fill: carry.state.u * 0.3, glow: carry.state.held ? 'good' : 'idle' });
      return placed;
    });
    if (!moved) return this.skipped;
    send('glass_at', 1);
    mg.snap({ at: glass });
    glass.remove();
    // 2) the tap
    const tap = mg.mark({ at: 'tea#tap', kind: 'groove', danger: 0 });
    const hold = mg.hold({ on: tap, seconds: 1e6, drain: 0 });
    b.minigame.tricks.teach(mg, [hold], { id: 'hold' });
    let fill = clamp(+g.get('fill') || 0), open = false, spills = 0, end = -1, as = 'clean';
    const done = await until(mg, ({ t, dt }) => {
      if (end >= 0) return t >= end;
      const h = hold.state.held;
      if (h && !open) { open = true; send('tap', 1); g.sound.pour(); }
      if (!h && open) {
        open = false;
        send('tap', 0);
        if (fill >= FROM && fill <= TO) { mg.snap({ at: tap }); end = t + 0.8; }
      }
      if (open) fill += RATE * dt;
      if (fill > 1) {
        spills = 1;
        as = 'flawed';
        mg.error('danger', { at: tap });
        acts.push(b.act('state', 'move', 'spill', 1, { over: 0.5 }));
        g.sound.spill();
        open = false;
        send('tap', 0);
        fill = 0.9;
        end = t + 1;
      }
      send('fill', fill);
      hold.set({ fill });
      tap.set({ danger: clamp((fill - DANGER) / (1 - DANGER)) });
      mg.plate.set({ fill: 0.3 + 0.7 * clamp(fill), glow: open && fill > DANGER ? 'bad' : open ? 'good' : 'idle' });
      return false;
    });
    if (!done) return this.skipped;
    await mg.end({ as });
    return { spills };
  },
};
