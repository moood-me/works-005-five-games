// «Котлы» (IV.4, Палуба, кусок `burn`; палуба «Генриетты» с юта, видно всё, что горит): Фогг купил корабль, угля нет.
// Кольцо с пунктиром на каждой части корабля (`<часть>#part`), какие по карману: тянуть (тяжело) к открытому люку
// кочегарки `hatch#fire`; часть едет по ключу `drag_<часть>` (0 на месте … 1 у люка), отпустил не у люка — видимо
// возвращается. Донёс — часть в топку: `<часть>` 0 (сцена — вспышка в люке), `fire` и `speed` растут, Спиди хватается за
// голову (`speedy_grief`). Каждая — PRICE £ из Саквояжа (`g.state.money`); на следующую не хватает — остальные заперты
// (`locked_<часть>` 1, меток нет). Каюта Спиди — последней, когда всё остальное сгорело: выбор — тянуть и её (кольцо
// на каюте) или оставить (тихое кольцо на `speedy#head`, лепесток «Оставить каюту»); отклик ровный.
//   Что делает: Паспарту (или Фогг, впервые сняв сюртук) таскает в топку куски купленного корабля.
//   Чего хочет: дойти до Ливерпуля на последнем дереве — угля нет, а до Англии четыре дня.
//   Каково ему: азарт и жертва чужим — корабль раздевается на глазах, капитан стонет.
//   Что чувствует игрок: азарт разрушения и цену каждой доски.
//   opts: { who: 'pp' | 'fogg' — чьими руками (фраза плашки) }
//   → { burned: [части, сожжённые по порядку], cabin: сожжена ли каюта Спиди }
import { until, keys } from '../hands.js';

const PARTS = ['deckhouse', 'boats', 'bunks', 'yards', 'mast_fore', 'mast_main', 'bulwarks'];
const CABIN = 'speedy_cabin';
const PRICE = 1500; // £ за часть
const FLASH = 0.8; // с: огонь разгорается после части
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export default {
  file: 'kotly',
  title: 'Котлы', // как её зовёт ☰ автора
  about: 50,
  // (пропуск: всё дерево, кроме каюты; сколько из этого по карману — глава сверяет с Саквояжем: skipped не знает денег)
  skipped: { burned: [...PARTS], cabin: false },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: opts.who === 'fogg'
      ? 'Мистер Фогг снял сюртук. Угля нет; горит всё, что из дерева'
      : 'Угля нет. Паспарту кормит топку всем, что горит' });
    const send = keys(g), acts = new Set();
    const move = (key, value, over) => { const a = b.act('state', 'move', key, value, { over }); acts.add(a); return a; };
    signal.addEventListener('abort', () => { for (const a of acts) a.cancel?.(); });
    const ALL = PARTS.length + 1;
    let money = +g.state.money || 0;
    const burned = [];
    const heat = () => {
      const u = burned.length / ALL;
      move('fire', 0.3 + 0.7 * u, FLASH);
      send('speed', 0.2 + 0.8 * u);
      send('speedy_grief', burned.includes(CABIN) ? 1 : clamp(0.8 * burned.length / PARTS.length));
    };
    send('fire', 0.3); send('speed', 0.2); send('speedy_grief', 0);
    for (const part of [...PARTS, CABIN]) { send(part, 1); send(`drag_${part}`, 0); send(`locked_${part}`, 0); }
    const lock = parts => parts.forEach(p => send(`locked_${p}`, 1));
    // одна часть: кольцо, тянуть к люку; отпустили у люка — в топку
    const items = new Map(); // часть → {mark, pull}
    const burn = part => {
      const { mark } = items.get(part);
      burned.push(part);
      money -= PRICE;
      send(part, 0);
      send(`drag_${part}`, 0);
      mg.snap({ at: mark });
      mark.remove();
      items.delete(part);
      heat();
    };
    const offer = (part, ok = () => true) => {
      const mark = mg.mark({ at: `${part}#part`, kind: 'dash' });
      const pull = mg.pull({ on: mark, to: 'hatch#fire', heavy: true, release: 'spring' });
      pull.on('release', ({ inTarget }) => { if (inTarget && items.has(part) && ok()) burn(part); });
      items.set(part, { mark, pull });
      return pull;
    };
    const left = () => PARTS.filter(p => !burned.includes(p));
    // ── всё, кроме каюты, в любом порядке ──
    if (money < PRICE) lock([...PARTS, CABIN]);
    else {
      const pulls = left().map(part => offer(part));
      b.minigame.tricks.teach(mg, pulls.slice(0, 1), { id: 'pull:heavy' });
      const done = await until(mg, () => {
        // на следующую не хватает — остальные заперты
        if (money < PRICE && items.size) { for (const it of items.values()) it.mark.remove(); items.clear(); lock([...left(), CABIN]); }
        for (const [part, { pull }] of items) send(`drag_${part}`, pull.state.u);
        mg.plate.set({ fill: burned.length / ALL, glow: [...items.values()].some(it => it.pull.state.held) ? 'good' : 'idle' });
        return items.size === 0;
      });
      if (!done) return this.skipped;
    }
    // ── каюта Спиди: сжечь или оставить ──
    let cabin = false;
    if (money >= PRICE && left().length === 0) {
      mg.plate.set({ phrase: 'Осталась каюта капитана Спиди. Спиди держится за голову', glow: null });
      send('speedy_grief', 1);
      let kept = false;
      const pull = offer(CABIN, () => !kept);
      const spare = mg.mark({ at: 'speedy#head', kind: 'ring', quiet: true });
      const keep = mg.press({ on: spare, petals: [{ id: 'spare', label: 'Оставить каюту' }] });
      keep.on('choose', () => { kept = true; });
      mg.show({ gestures: [pull, keep] });
      const decided = await until(mg, () => {
        if (items.has(CABIN)) send(`drag_${CABIN}`, pull.state.u);
        return kept || !items.has(CABIN);
      });
      if (!decided) return this.skipped;
      cabin = burned.includes(CABIN);
      if (kept) { send(`drag_${CABIN}`, 0); items.get(CABIN)?.mark.remove(); items.delete(CABIN); }
      spare.remove();
      await mg.end({ as: 'neutral' });
    } else await mg.end({ as: burned.length ? 'clean' : 'neutral' });
    return { burned, cabin };
  },
};
