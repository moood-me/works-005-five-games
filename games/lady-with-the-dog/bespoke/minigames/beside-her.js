// “Beside her” (II.1, A room in Yalta, after the beat `beside`; the insert `hands`): Gurov puts his hand on hers. Pull
// against resistance: a ring with dashes on his hand (`hands#his`), the target — her hand (`hands#her`); his hand goes
// while the finger leads ahead of it; where it is — `hand_at`. The finger ahead of the hand by more than 0.25 of the
// way for longer than 0.3 s — he hurries: she draws her hand away (the error `danger` at her hand, `pull` to 1
// over 0.5 s, his hand back by 0.2), 2 s later she puts it back (`pull` to 0 over 1 s). The hand at hers (≥ 0.95) and
// 2 s without a new move — her palm turns up (`palm` 1), a snap, the end 1.5 s later.
//   Who does what: Gurov puts his hand on hers. What he wants: to comfort her. What he feels: care, tenderness.
//   The player: not to hurry.
//   → { pulls: how many times she drew her hand away }
import { until, keys } from '../hands.js';

const AHEAD = 0.25, RUSH = 0.3; // the share of the way the finger is ahead of the hand; how many seconds make a hurry
const BACK = 0.2; // how far his hand goes back when she draws hers away
const AWAY = 2; // s her hand is drawn away
const THERE = 0.95, STILL = 2, AFTER = 1.5; // at her hand; s without a move; s from the snap to the end
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export default {
  title: 'Beside her',
  about: 12,
  skipped: { pulls: 0 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: tr('Her hand lay on the bedspread, palm down') });
    const send = keys(g);
    const his = mg.mark({ at: 'hands#his', kind: 'dash' });
    const pull = mg.pull({ on: his, to: 'hands#her', heavy: true });
    // (where the finger is: on the same mark — the touch as it is)
    const finger = mg.touch({ on: his });
    b.minigame.tricks.teach(mg, [pull], { id: 'pull:heavy' });
    const acts = [];
    const act = (key, v, over) => { const a = b.act('state', 'move', key, v, { over }); acts.push(a); return a; };
    signal.addEventListener('abort', () => acts.forEach(a => a.cancel()));
    let pulls = 0, rushing = 0, awayTill = -1, last = 0, stillFor = 0, end = -1, way = null;
    pull.on('down', () => { way = { a: b.where('hands#his'), z: b.where('hands#her') }; });
    // how far along the way from his hand (as it was taken) to hers the finger is
    const along = () => {
      const f = finger.state;
      if (!f.down || !way?.a || !way?.z) return null;
      const dx = way.z.x - way.a.x, dy = way.z.y - way.a.y, len2 = Math.max(1, dx * dx + dy * dy);
      return ((f.x - way.a.x) * dx + (f.y - way.a.y) * dy) / len2;
    };
    const done = await until(mg, ({ t, dt }) => {
      if (end >= 0) return t >= end;
      const u = pull.state.u;
      if (t < awayTill) pull.set({ u: Math.min(u, last) });
      else if (awayTill >= 0) { awayTill = -1; act('pull', 0, 1); }
      const ahead = along();
      rushing = ahead != null && ahead - u > AHEAD && awayTill < 0 ? rushing + dt : 0;
      if (rushing > RUSH) {
        rushing = 0;
        pulls++;
        mg.error('danger', { at: b.where('hands#her') || undefined });
        act('pull', 1, 0.5);
        pull.set({ u: clamp(u - BACK) });
        awayTill = t + AWAY;
      }
      const now = pull.state.u;
      stillFor = Math.abs(now - last) > 0.002 ? 0 : stillFor + dt;
      last = now;
      send('hand_at', now);
      mg.plate.set({ fill: now, glow: awayTill >= 0 ? 'bad' : pull.state.held ? 'good' : 'idle' });
      if (now >= THERE && awayTill < 0 && stillFor >= STILL) {
        send('palm', 1);
        mg.snap({ at: b.where('hands#her') || undefined });
        end = t + AFTER;
      }
      return false;
    });
    if (!done) return this.skipped;
    await mg.end({ as: pulls ? 'flawed' : 'clean' });
    return { pulls };
  },
};
