// «Не уснуть» (II.3, Гавань, кусок `pipe`; вечер, набережная Гонконга): Паспарту в опиуме бредёт от таверны к
// ступеням, где ждёт лодочник с фонарём (`boatman` 1). Вести где угодно — и держать: пока палец на экране, глаза
// Паспарту открыты (`daze` медленно спадает); отпустил — дурман растёт быстро. Стрелка — куда его ведёт
// (`pp_sway` −1…1: он кренится набок), зона — прямо; дурман сам валит его то вправо, то влево, тем сильнее, чем он гуще
// (`push`). Держат и прямо — он идёт: игра шлёт его вперёд по пути (`pp_walk` чуть впереди `pp_walk_at`, сцена
// ведёт его своим шагом); вне зоны — стоит; накренился до края — спотыкается (`pp_stumble` подъём до 1, секунда).
// Дошёл до лодочника (`pp_walk_at` ≥ BOATMAN) — `message` подъём до 1: лодочник отваливает с вестью. Дурман дошёл до
// 1 — Паспарту сползает на камни: весть не дошла (конец «проигрыш»).
//   Что делает: Паспарту, опоенный Фиксом, тащится по набережной к огням пристани.
//   Чего хочет: передать хозяину, что «Карнатик» уходит сегодня, а не завтра.
//   Каково ему: мир плывёт и двоится, ноги не слушаются — долг сквозь туман.
//   Что чувствует игрок: удерживать его в сознании и вести, через силу.
//   → { told: дошла ли весть до Фогга (лодочник отвалил) }
import { until, keys } from '../hands.js';

const BOATMAN = 0.97; // pp_walk_at: он у лодочника (у ступеней)
const AHEAD = 0.04; // pp_walk: насколько вперёд его шлют, пока ведут
const OPIUM = 0.015, WAKE = 0.05, SINK = 0.15; // daze в секунду: растёт всегда; спадает, пока держат; растёт, пока нет
const ZONE = 0.6, EDGE = 0.92; // ширина зоны «прямо»; крен, на котором он спотыкается
const STUMBLE = 1; // с: стоит после спотыкания
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const reel = (t, daze) => daze * (0.5 * Math.sin(0.7 * t) + 0.3 * Math.sin(1.9 * t + 2));

export default {
  file: 'ne-usnut',
  title: 'Не уснуть', // как её зовёт ☰ автора
  about: 40,
  skipped: { told: true },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: 'Огни пристани двоятся. «Карнатик» уходит этой ночью, а хозяин не знает' });
    const send = keys(g);
    send('boatman', 1);
    send('message', 0);
    send('pp_stumble', 0);
    send('pp_sway', 0);
    let daze = clamp(+g.get('daze') || 0.3), start = clamp(+g.get('pp_walk_at') || 0), stumbles = 0, stillTill = -1, stumbleOff = -1, tilted = false;
    const lead = mg.lead({ zone: { at: 0, width: ZONE }, steer: 'rate', release: 'stay', push: 0 });
    b.minigame.tricks.teach(mg, [lead], { id: 'lead' });
    const t0 = mg.t;
    const end = await until(mg, ({ t, dt }) => {
      const now = t - t0, s = lead.state;
      lead.set({ push: reel(now, daze) });
      daze = clamp(daze + (OPIUM + (s.held ? -WAKE : SINK)) * dt);
      send('daze', daze);
      send('pp_sway', s.arrow);
      const at = clamp(+g.get('pp_walk_at') || 0);
      // накренился до края — спотыкается
      if (Math.abs(s.arrow) >= EDGE && !tilted) {
        tilted = true;
        stumbles++;
        stillTill = now + STUMBLE;
        send('pp_stumble', 1);
        stumbleOff = now + 0.5;
        mg.error('off', { at: lead });
      }
      if (Math.abs(s.arrow) < ZONE / 2) tilted = false;
      if (stumbleOff >= 0 && now >= stumbleOff) { stumbleOff = -1; send('pp_stumble', 0); }
      // ведут прямо и глаза открыты — идёт; иначе стоит
      const going = s.held && s.in && now >= stillTill;
      send('pp_walk', going ? Math.min(1, at + AHEAD) : at);
      mg.plate.set({ fill: clamp((at - start) / (BOATMAN - start)), glow: daze > 0.75 ? 'bad' : going ? 'good' : 'idle' });
      return at >= BOATMAN || daze >= 1;
    });
    if (!end) return this.skipped;
    if (daze >= 1) {
      send('pp_walk', clamp(+g.get('pp_walk_at') || 0));
      mg.plate.set({ phrase: 'Опиум взял своё. Лодочник ждёт напрасно' });
      await mg.end({ as: 'loss' });
      return { told: false };
    }
    send('message', 1);
    mg.snap({});
    mg.plate.set({ phrase: 'Фонарь лодочника уходит по воде к городу' });
    await mg.end({ as: stumbles ? 'flawed' : 'clean' });
    return { told: true };
  },
};
