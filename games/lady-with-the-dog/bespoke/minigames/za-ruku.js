// «За руку» (V.2, Москва, после куска `walk_hand`; STREET_CAM): Гуров ведёт дочь в гимназию — к камере, от подъезда к
// воротам. Держать где угодно (отклик у руки дочери, `daughter#hand_r`): держит — идут (`go` 1); отпустил — стоят (`go`
// 0; дочь поднимает к нему лицо — сцена), счёт остановок — не ошибка. Где они — `walked` 0…1 (сцена ставит разом).
// Реплики — `opts.lines[i]()` по очереди, когда `walked` переходит 0.35, 0.6, 0.9, 1, одна за другой, не перебивая.
// Конец — дошли и все четыре сказаны.
//   Кто что делает: Гуров ведёт дочь в гимназию. Чего хочет: быть хорошим отцом в явной жизни.
//   Что чувствует: тепло и пустоту. Игрок: вести и слушать.
//   opts: { lines: [четыре функции — реплики по порядку] }
//   → { stops: сколько раз останавливались }
import { until, keys } from '../hands.js';

const AT = [0.35, 0.6, 0.9, 1]; // где говорится каждая реплика

export default {
  title: 'За руку',
  about: 20,
  skipped: { stops: 0 },
  async run(g, b, opts, signal) {
    const lines = opts.lines ?? [];
    const mg = g.minigame({ phrase: 'Шёл мокрый снег; дочь держала его за руку' });
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
