// «Табакерка» (II.4, Дом, после куска `box_take` или `box_give`; вставка `box` открыта, режим в кадре — `box_mode`;
// game.md §7). opts.mode:
// - take: ладонь раскрыта, старая рука ещё над табакеркой. Четыре кольца с пунктиром на `box#finger1…4`, сразу все;
//   каждое тянуть к табакерке (`box#box`): дошёл — палец сжимается (`fingerN` → 1 за 0.5 с), кольцо снято; не дошёл —
//   палец назад. Порядок любой; сами пальцы не сжимаются. Все четыре — щелчок крышки, старая рука уходит (`old` → 0 за
//   1.5 с), конец (clean).
// - give: табакерка на клеёнке между ними. Кольцо с пунктиром на `box#box`, путь к `box#old`; тянуть с сопротивлением
//   (тяжёлая: идёт, пока палец тянет впереди неё); `push` — место на пути, назад не идёт; отпустил — стоит. Дошла —
//   старые пальцы смыкаются не сразу (`old_close` → 1 за 2 с), щелчок, конец (clean). Сама не едет.
//   Чувство: берёт (или отдаёт) дедову табакерку «старшему сыну»; хочет не обидеть старика; стыдно; игрок — вещь,
//   которая тяжелее, чем весит.
//   opts: { mode: 'take' | 'give' }
//   → { closed: сколько пальцев сжато (take — 4; give — 0), seconds: от первого касания до конца }
import { until, keys } from '../hands.js';

const FINGERS = 4;
const THERE = 0.97; // push — дошла

export default {
  title: 'Табакерка', // как её зовёт ☰ автора
  about: 8,
  // (одна форма на оба режима: глава поля итога не читает; game.md §7 — take {closed: 4}, give {seconds: 6})
  skipped: { closed: 4, seconds: 6 },
  async run(g, b, opts, signal) {
    const take = opts.mode !== 'give';
    const mg = g.minigame({ phrase: take ? 'Табакерка лежит на ладони. Старая рука ещё над ней' : 'Табакерка стоит на клеёнке между ними' });
    const send = keys(g), acts = new Set();
    const move = (key, value, over) => { const a = b.act('state', 'move', key, value, { over }); acts.add(a); return a; };
    signal.addEventListener('abort', () => { for (const a of acts) a.cancel?.(); });
    let started = null;
    mg.on('down', () => { started ??= mg.t; });
    if (take) {
      let closed = 0;
      const pulls = [];
      for (let n = 1; n <= FINGERS; n++) {
        send(`finger${n}`, 0);
        const ring = mg.mark({ at: `box#finger${n}`, kind: 'dash' });
        const pull = mg.pull({ on: ring, to: 'box#box', release: 'spring' });
        pull.on('release', ({ inTarget }) => {
          if (!inTarget) return;
          move(`finger${n}`, 1, 0.5);
          mg.snap({ at: ring });
          ring.remove();
          closed++;
          mg.plate.set({ fill: closed / FINGERS });
        });
        pulls.push(pull);
      }
      b.minigame.tricks.teach(mg, pulls, { id: 'pull:to' });
      mg.plate.set({ fill: 0, glow: 'idle' });
      if (!(await until(mg, () => closed >= FINGERS))) return this.skipped;
      g.sound.box();
      move('old', 0, 1.5);
    } else {
      send('push', 0);
      send('old_close', 0);
      const ring = mg.mark({ at: 'box#box', kind: 'dash' });
      const pull = mg.pull({ on: ring, to: 'box#old', heavy: true, release: 'stay' });
      b.minigame.tricks.teach(mg, [pull], { id: 'pull:heavy' });
      let push = 0;
      const done = await until(mg, () => {
        const s = pull.state;
        if (s.u > push) push = s.u; // (назад не идёт)
        else if (s.u < push) pull.set({ u: push });
        send('push', push);
        mg.plate.set({ fill: push, glow: s.held ? 'good' : 'idle' });
        return push >= THERE;
      });
      if (!done) return this.skipped;
      send('push', 1);
      mg.snap({ at: ring });
      move('old_close', 1, 2);
      g.sound.box();
    }
    const seconds = Math.round(mg.t - (started ?? mg.t));
    await mg.end({ as: 'clean' });
    return { closed: take ? FINGERS : 0, seconds };
  },
};
