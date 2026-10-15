// «Рядом» (II.1, Номер в Ялте, после куска `beside`; вставка `hands`): Гуров кладёт руку на её руку. Тянуть с
// сопротивлением: кольцо с пунктиром на его руке (`hands#his`), цель — её рука (`hands#her`); его рука идёт, пока палец
// ведёт впереди неё; где она — `hand_at`. Палец обгоняет руку больше чем на 0.25 пути дольше 0.3 с — спешит: она
// отнимает руку (ошибка «в опасность» у её руки, `pull` к 1 за 0.5 с, его рука назад на 0.2), через 2 с кладёт её
// обратно (`pull` к 0 за 1 с). Рука у её руки (≥ 0.95) и 2 с без нового движения — её ладонь поворачивается вверх
// (`palm` 1), защёлка, через 1.5 с конец.
//   Кто что делает: Гуров кладёт руку на её руку. Чего хочет: утешить. Что чувствует: осторожность, нежность.
//   Игрок: не спешить.
//   → { pulls: сколько раз она отнимала руку }
import { until, keys } from '../hands.js';

const AHEAD = 0.25, RUSH = 0.3; // доля пути, на которую палец обгоняет руку; сколько секунд — уже спешка
const BACK = 0.2; // на сколько его рука отходит, когда она отнимает свою
const AWAY = 2; // с её рука отнята
const THERE = 0.95, STILL = 2, AFTER = 1.5; // у её руки; с без движения; с от защёлки до конца
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export default {
  title: 'Рядом',
  about: 12,
  skipped: { pulls: 0 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: 'Её рука лежала на покрывале, ладонью вниз' });
    const send = keys(g);
    const his = mg.mark({ at: 'hands#his', kind: 'dash' });
    const pull = mg.pull({ on: his, to: 'hands#her', heavy: true });
    // (где палец: на той же метке — касание как есть)
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
