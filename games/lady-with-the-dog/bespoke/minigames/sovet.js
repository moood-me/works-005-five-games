// «Советоваться» (V.3, Славянский базар, после куска `sovet`): они ищут выход. Нажать с лепестком на трёх вещах — окно
// (`window#window`, «Жить в одном городе»), дверь (`door#door`, «Уехать вдвоём»), стаканы (`table#glasses`, «Видеться
// каждый день») — или молчать (палец показывает и «руки прочь»). Выбран лепесток — метки скрыты (ход сцены), `think` =
// вещь, `await opts[вещь]()` — их разговор, `think` = 'none', метки остальных снова. Конец: все три тронуты — или 15 с
// молчания от начала или от конца последних слов. Полоса — время молчания.
//   Кто что делает: они ищут, как жить. Чего хотят: придумать выход. Что чувствуют: всё упирается.
//   Игрок: трогать выходы — или молчать.
//   opts: { window(), door(), table() — разговор у каждой вещи (реплики говорит глава) }
//   → { touched: ['window' | 'door' | 'table', … по порядку] }
import { until, keys } from '../hands.js';

const THINGS = [['window', 'window#window', 'Жить в одном городе'], ['door', 'door#door', 'Уехать вдвоём'], ['table', 'table#glasses', 'Видеться каждый день']];
const SILENCE = 15; // с

export default {
  title: 'Советоваться',
  about: 18,
  skipped: { touched: [] },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: 'Потом они долго советовались' });
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
