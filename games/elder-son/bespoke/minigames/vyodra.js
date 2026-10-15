// «Вёдра» (IV.3, Улица, после куска `fire`; game.md §7): свой огонь `fire` 0.6, растёт на 0.01 в секунду (шлётся
// ключом), рёв пожара по нему. Одна метка за раз: с пустым ведром — кольцо на бочке (`barrel`); нажал — ход сцены:
// Бусыгин набирает (`vyodra` 'fill' → `vyodra:full`); с полным — кольцо на сарае (`shed`); нажал — плещет (`vyodra`
// 'throw' → `vyodra:splash`): огонь −0.18, всплеск, счёт `buckets`. Соседи своим ходом: каждые 6 с огонь −0.07, всплеск
// тише. Полоса — 1 − `fire` / 0.6. Огонь погас — 2 с пара — clean. Через 55 с соседи справились сами (`fire` → 0 за
// 4 с) — neutral.
//   Чувство: тушит чужой сарай с соседями; хочет погасить; паника и смех; игрок — бочка — сарай, быстрее.
//   → { buckets }
import { until, keys } from '../hands.js';

const START = 0.6, GROW = 0.01; // огонь; в секунду
const ROAR = 0.25; // с между правками рёва
const BUCKET = 0.18, NEIGHBOURS = 0.07, EVERY = 6; // огонь за ведро; за соседей, раз в 6 с
const STEAM = 2; // с пара в конце
const ENOUGH = 55; // с — соседи справились
const SCENE_MS = 30000;

export default {
  title: 'Вёдра', // как её зовёт ☰ автора
  about: 35,
  skipped: { buckets: 3 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: 'Сарай горит. Бочка у забора полная' });
    const send = keys(g), acts = new Set();
    const move = (key, value, over) => { const a = b.act('state', 'move', key, value, { over }); acts.add(a); return a; };
    signal.addEventListener('abort', () => { for (const a of acts) a.cancel?.(); g.sound.fire(0, 1); });
    let fire = START, buckets = 0, roared = -ROAR, helped = 0, full = false, busy = false, tapped = false, first = true;
    let mark = null, press = null;
    // одна метка за раз: бочка (пустой) или сарай (с ведром)
    const place = () => {
      mark = mg.mark({ at: full ? 'shed' : 'barrel', kind: 'ring' });
      press = mg.press({ on: mark });
      press.on('press', () => { if (!busy) tapped = true; });
      if (first) b.minigame.tricks.teach(mg, [press], { id: 'press' });
      first = false;
    };
    // ход сцены: набрать или плеснуть; → когда сцена сказала, что сделано
    const act = async () => {
      busy = true;
      tapped = false;
      mg.sceneTurn(true);
      const done = g.told(full ? 'vyodra:splash' : 'vyodra:full', SCENE_MS);
      g.set('vyodra', full ? 'throw' : 'fill');
      const ok = await done;
      if (signal.aborted) return;
      if (ok && full) {
        fire = Math.max(0, fire - BUCKET);
        g.sound.splash(1);
        mg.snap({ at: mark });
        buckets++;
      }
      full = !full;
      mark.remove();
      mg.sceneTurn(false);
      place();
      busy = false;
    };
    place();
    const out = await until(mg, ({ t, dt }) => {
      if (tapped && !busy) act();
      fire = Math.min(1, fire + GROW * dt);
      if (t - helped >= EVERY) { helped = t; fire = Math.max(0, fire - NEIGHBOURS); g.sound.splash(0.5); }
      send('fire', fire);
      if (t - roared >= ROAR) { roared = t; g.sound.fire(0.3 + 0.7 * fire, 0.3); }
      mg.plate.set({ fill: Math.max(0, 1 - fire / START), glow: busy ? 'good' : 'idle' });
      return fire <= 0 || t >= ENOUGH;
    });
    if (!out) return this.skipped;
    const clean = fire <= 0;
    if (clean) send('fire', 0);
    else move('fire', 0, 4); // (соседи справились)
    const t1 = mg.t;
    if (!(await until(mg, ({ t }) => t - t1 >= (clean ? STEAM : 4)))) return this.skipped;
    await mg.end({ as: clean ? 'clean' : 'neutral' });
    return { buckets };
  },
};
