// «Сцепка» (III.3, Прерия, кусок `under`; камера низко под вагонами — колёса, цепи, бегущий снег): Паспарту под
// несущимся поездом перехватывает цепи от вагона к вагону к паровозу. Вагоны качаются — фазу качки ведёт сцена
// (`swing_at` 0…1; CLOSE — вагоны сошлись, цепь у руки); игра читает её и ставит доли ритма на эти мгновения (кольцо
// сходится на цепи). Кольцо на следующей цепи `chain#c{n}`: нажать в долю — рука перехватила, Паспарту на полвагона
// дальше (`pp_car` +0.5, плавно); мимо доли — сорвалась рука, он висит (ошибка, только время). Две доли на цепь, три
// цепи — у паровоза (`pp_car` 3). Там кольцо с пунктиром на пальце сцепки `coupling#pin`: тянуть (оторвать) — палец
// выходит (`uncouple` по тяге, 1 — вырван), вагоны отстают. Итог — часы по времени: чем дольше, тем дальше за фортом
// встанут вагоны.
//   Что делает: Паспарту лезет под вагонами несущегося поезда к паровозу, чтобы отцепить вагоны у форта.
//   Чего хочет: остановить поезд у форта Керни, пока сиу не перебили пассажиров.
//   Каково ему: храбрость акробата: гул колёс, снег в лицо, шпалы в полуметре.
//   Что чувствует игрок: хватать цепь в тот миг, когда вагоны сходятся, — и рвануть палец.
//   → { hours: 0…−2 }
import { until, once, keys } from '../hands.js';

const CLOSE = 0.5; // swing_at: вагоны сошлись — цепь у руки
const GUESS = 1.4; // с: период качки, пока его не видно по сцене
const HALF = 0.5, STEP = 0.4; // pp_car за долю; с — он перебирается
const CHAINS = 3; // цепей до паровоза (c1…c3)
const TEAR = 0.2; // доля высоты окна — вырвать палец
const QUICK = 14, LATE = 22; // с: до них — без потерь; до них — час; дольше — два
const WINDOW = 0.2; // с: допуск доли
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export default {
  file: 'stsepka',
  title: 'Сцепка', // как её зовёт ☰ автора
  about: 16,
  skipped: { hours: 0 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: 'Под вагонами — шпалы и снег. Цепи сходятся, когда вагоны качнутся навстречу' });
    const send = keys(g), acts = new Set();
    const move = (key, value, over) => { const a = b.act('state', 'move', key, value, { over }); acts.add(a); return a; };
    signal.addEventListener('abort', () => { for (const a of acts) a.cancel?.(); });
    const STEPS = 2 * CHAINS + 1;
    mg.plate.set({ notches: Array.from({ length: STEPS - 1 }, (_, i) => (i + 1) / STEPS) });
    send('pp_car', 0); send('uncouple', 0);
    let car = 0, misses = 0, period = GUESS, lastPh = null;
    const t0 = mg.t;
    // ── цепи: доли — когда вагоны сходятся ──
    for (let n = 1; n <= CHAINS; n++) {
      const chain = mg.mark({ at: `chain#c${n}`, kind: 'ring' });
      const grab = mg.rhythm({ on: chain, times: [], window: WINDOW });
      if (n === 1) b.minigame.tricks.teach(mg, [grab], { id: 'rhythm' });
      // доли, отданные ритму: прошлая и следующая (его часы); какие из них уже взяты рукой
      let times = [], hits = 0;
      const taken = new Set();
      const give = (prev, next) => { times = [prev, next]; grab.set({ times }); };
      grab.on('tap', ({ k, hit }) => {
        if (!hit) { misses++; mg.error('timing', { at: chain }); return; }
        const beat = times[k];
        if (taken.has(beat)) return; // (одна доля — одна рука)
        taken.add(beat);
        hits++;
        car += HALF;
        move('pp_car', car, STEP);
      });
      const ok = await until(mg, ({ dt }) => {
        // фаза сцены → когда вагоны сойдутся в следующий раз (по часам ритма)
        const ph = +g.get('swing_at'), now = grab.state.t;
        if (Number.isFinite(ph)) {
          if (lastPh != null && dt > 0) {
            const d = (ph - lastPh + 1) % 1;
            if (d > 0 && d < 0.5) period += (dt / d - period) * 0.1;
          }
          lastPh = ph;
          const next = now + ((CLOSE - ph + 1) % 1) * period;
          const coming = times[1];
          if (coming == null) give(next - period, next);
          else if (now > coming + WINDOW) give(coming, next); // доля прошла — следующая
          else if (now < coming - WINDOW && Math.abs(next - coming) > 0.08) give(times[0], next); // качка ушла — поправить
        }
        mg.plate.set({ fill: (2 * (n - 1) + hits) / STEPS, glow: 'idle' });
        return hits >= 2;
      });
      if (!ok) return this.skipped;
      mg.snap({ at: chain });
      chain.remove();
    }
    // ── палец сцепки ──
    mg.plate.set({ phrase: 'Паспарту у паровоза. Палец сцепки держит вагоны' });
    const pin = mg.mark({ at: 'coupling#pin', kind: 'dash' });
    const pull = mg.pull({ on: pin, tear: TEAR });
    b.minigame.tricks.teach(mg, [pull], { id: 'pull:tear' });
    const off = mg.on('frame', () => {
      send('uncouple', clamp(pull.state.u * 0.9));
      mg.plate.set({ fill: (2 * CHAINS + pull.state.u) / STEPS, glow: pull.state.held ? 'good' : 'idle' });
    });
    const torn = await once(mg, pull, 'tear');
    off();
    if (!torn) return this.skipped;
    send('uncouple', 1);
    mg.snap({ at: pin });
    const seconds = mg.t - t0;
    await mg.end({ as: misses ? 'flawed' : 'clean' });
    return { hours: seconds <= QUICK ? 0 : seconds <= LATE ? -1 : -2 };
  },
};
