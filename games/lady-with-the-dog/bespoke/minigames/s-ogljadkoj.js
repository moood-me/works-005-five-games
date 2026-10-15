// «С оглядкой» (II.3, Набережная, после куска `noon_garden`; ALLEY_CAM): поцелуй среди белого дня. Нажать: кольцо на
// Анне (`anna#head`), дуга опасности на нём — гуляющие в аллее: 1, пока в видимой части аллеи кто-то есть (`watched`,
// сцена ставит разом; аллея пуста около 4 с раз в 10–12 с), 0 — пусто. Нажал при гуляющих — ошибка «в опасность»:
// `seen` 1 (импульс; сцена сама вернёт 0) — прохожая с зонтом оборачивается, Анна отступает; метка снова через 2 с.
// Нажал, когда пусто, — `kiss_now` 1, объятие; дождаться `noon_garden:kiss` (до 6 с) — защёлка, конец.
//   Кто что делает: Гуров целует её среди белого дня. Чего хочет: поцеловать — и чтобы не увидели.
//   Что чувствует: азарт тайны. Игрок: выждать миг.
//   → { seen: сколько раз их видели }
import { until, keys } from '../hands.js';

const AGAIN = 2; // с: метка снова после того, как их видели
const KISS = 6000; // мс: объятие кончается (сцена говорит)

export default {
  title: 'С оглядкой',
  about: 15,
  skipped: { seen: 0 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: 'По аллее ходили, и всякий мог оглянуться' });
    const send = keys(g);
    let watched = g.get('watched') === 0 ? 0 : 1;
    g.watch('watched', v => { watched = v ? 1 : 0; });
    const mark = mg.mark({ at: 'anna#head', danger: watched });
    const press = mg.press({ on: mark });
    b.minigame.tricks.teach(mg, [press], { id: 'press' });
    let seen = 0, backAt = -1, kissed = null;
    press.on('press', () => {
      if (kissed || backAt >= 0) return;
      if (watched) {
        seen++;
        mg.error('danger', { at: mark });
        send('seen', 1);
        mark.set({ hidden: true });
        backAt = mg.t + AGAIN;
        return;
      }
      // (ожидание — до того, как объятие началось)
      kissed = g.told('noon_garden:kiss', KISS);
      send('kiss_now', 1);
      mark.set({ hidden: true });
      mg.plate.set({ fill: 1, glow: 'good' });
    });
    const done = await until(mg, ({ t }) => {
      if (backAt >= 0 && t >= backAt) { backAt = -1; mark.set({ hidden: false }); }
      mark.set({ danger: watched });
      if (!kissed) mg.plate.set({ fill: 0, glow: watched ? 'bad' : 'idle' });
      return !!kissed;
    });
    if (!done) return this.skipped;
    await kissed;
    if (signal.aborted) return this.skipped;
    mg.snap({ at: b.where('anna#head') || undefined });
    await mg.end({ as: seen ? 'flawed' : 'clean' });
    return { seen };
  },
};
