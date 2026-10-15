// «Торг» (I.3, Джунгли, кусок `haggle`; у навеса Фогг и хозяин слона в три четверти друг к другу, Киуни за ними):
// Фогг поднимает цену. Держать где угодно (налив — на пачке банкнот в руке Фогга, `fogg#hands`): пачка толстеет на
// 100 £ в секунду, от START до TOP (`offer` 0…1 — её толщина); отпустил — предложил (не меньше чем на 100 £ больше
// прошлого). Цена ниже порога хозяина (MIN…TOP, случайный, игрок его не знает) — хозяин отворачивается, скрестив руки
// (`owner_turn` → 1, стоит, → 0): двадцать минут в книжке, пока он стоит спиной, пачка не толстеет. Не ниже — продано.
// TOP всегда не ниже порога: кто готов заплатить, тот не теряет ни минуты.
//   Что делает: Филеас Фогг покупает слона у старика-парса посреди леса.
//   Чего хочет: слона сейчас — до Аллахабада пятьдесят миль, а поезд ушёл.
//   Каково ему: невозмутим; считает; деньги для него — только способ купить время.
//   Что чувствует игрок: время дороже денег — каждый отказ стоит двадцать минут, каждая прибавка — банкноты.
//   opts: { onRefuse(minutes) — после каждого отказа: сколько минут ушло всего (глава ведёт книжку), не ждётся }
//   → { price: за сколько куплен (£), minutes: сколько минут ушло на отказы }
import { until, keys } from '../hands.js';

const START = 1000, TOP = 2000, MIN = 1100; // £: пачка в начале; самая толстая; самый низкий порог
const STEP = 100; // £: шаг цены и наименьшая прибавка
const RATE = 100; // £ в секунду, пока держат
const REFUSAL = 20; // минут в книжке за отказ
const TURN = 0.8, BACK = 1.6; // с: отворачивается; стоит спиной
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export default {
  file: 'torg',
  title: 'Торг', // как её зовёт ☰ автора
  about: 20,
  skipped: { price: 2000, minutes: 0 }, // цена Верна, без потерянных минут
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: 'Старик-парс смотрит на пачку банкнот и молчит. Сколько стоит слон, знает он один' });
    const send = keys(g), acts = new Set();
    const move = (key, value, over) => { const a = b.act('state', 'move', key, value, { over }); acts.add(a); return a; };
    signal.addEventListener('abort', () => { for (const a of acts) a.cancel?.(); });
    const threshold = MIN + STEP * Math.floor(Math.random() * ((TOP - MIN) / STEP + 1));
    const pack = mg.mark({ at: 'fogg#hands', kind: 'groove' });
    // (налив и есть пачка: полный — TOP; отпустили — стоит)
    const hold = mg.hold({ on: null, show: pack, seconds: (TOP - START) / RATE, drain: 0 });
    b.minigame.tricks.teach(mg, [hold], { id: 'hold:anywhere' });
    send('offer', 0);
    send('owner_turn', 0);
    const priceOf = fill => START + STEP * Math.floor((fill * (TOP - START)) / STEP + 1e-6);
    let last = START, minutes = 0, refusals = 0, backAt = -1, frozen = 0, sold = false, t0 = mg.t;
    hold.on('up', () => {
      if (backAt >= 0) return;
      const price = priceOf(hold.state.fill);
      if (price - last < STEP) return; // не прибавил — не предложил
      last = price;
      if (price >= threshold) { sold = true; return; }
      // отказ: отворачивается, двадцать минут
      refusals++;
      minutes += REFUSAL;
      frozen = hold.state.fill;
      backAt = mg.t - t0 + TURN + BACK;
      move('owner_turn', 1, TURN);
      mg.error('wrong', { at: pack, chip: true });
      mg.plate.set({ phrase: refusals === 1 ? 'Старик отвернулся и скрестил руки. Двадцать минут' : `Старик отвернулся в ${refusals}-й раз. Ещё двадцать минут` });
      opts.onRefuse?.(minutes);
    });
    const done = await until(mg, ({ t }) => {
      const now = t - t0;
      // пока он стоит спиной, пачка не толстеет
      if (backAt >= 0) {
        hold.set({ fill: frozen });
        if (now >= backAt) { backAt = -1; move('owner_turn', 0, TURN); }
      }
      const fill = hold.state.fill;
      send('offer', fill);
      mg.plate.set({ fill, glow: backAt >= 0 ? 'bad' : hold.state.held ? 'good' : 'idle' });
      return sold;
    });
    if (!done) return this.skipped;
    mg.snap({ at: pack });
    mg.plate.set({ phrase: 'Слон продан' });
    await mg.end({ as: refusals ? 'flawed' : 'clean' });
    return { price: last, minutes };
  },
};
