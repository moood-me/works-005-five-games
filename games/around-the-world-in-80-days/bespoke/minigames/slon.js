// «Слон» (I.4, Джунгли, кусок `ride`; кадр стоит на слоне сбоку, тропа бежит мимо): Киуни идёт своим шагом. Ритм где
// угодно — доля шага Киуни (кольцо сходится на `kiouni#head`): в долю — шаг ровнее, `pace` растёт до STEADY; мимо доли
// или пропущенная доля — шаг вязнет (не ниже SLOW). Крюк — держать желоб на `guide#hands` (проводник поднимает крюк,
// `goad` 1): `pace` 1, доля чаще, но слон злится — дуга опасности на крюке; полная — Киуни встаёт (`balk` → 1, `pace`
// 0, крюк выпадает из рук). Тогда кольцо на хоботе `kiouni#trunk`: нажать — Паспарту даёт сахар (`sugar` подъём до 1),
// слон успокаивается и идёт. Путь `ride` 0 → 1 со скоростью по `pace`; итог — часы против расписания по времени пути.
//   Что делает: Киуни несёт путников лесом к Аллахабаду; Фогг, Паспарту и Кромарти качаются в гауде.
//   Чего хочет: дойти до ночи — каждый час леса стоит часа в книжке.
//   Каково ему: жара, качка; слон живой и своенравный, его не заведёшь, как паровоз.
//   Что чувствует игрок: терпение к живому — идти с ним в шаг; погонишь — встанет.
//   → { hours: сколько часов выиграно (+) или потеряно (−) против расписания, −2…+2 }
import { until, keys } from '../hands.js';

const BPM = 48, BPM_GOAD = 64; // шаг Киуни; под крюком
const SLOW = 0.3, STEADY = 0.6, START = 0.4; // pace: самый вязкий шаг; ровный, в долю; в начале
const HIT = 0.1, MISS = 0.08, LAPSE = 0.05; // pace: за долю в такт; за касание мимо доли; за пропущенную долю
const PATH = 36; // с: путь ровным шагом (STEADY) — по расписанию
const HOUR = 6; // с пути — час в книжке
const ANGER = 0.35, CALM = 0.2; // в секунду: злость под крюком; остывает без него
const BALK_IN = 0.6, SUGAR_OUT = 1.2; // с: встаёт; успокаивается
const EASE = 1.5; // в секунду: pace идёт к цели
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export default {
  file: 'slon',
  title: 'Слон', // как её зовёт ☰ автора
  about: 38,
  skipped: { hours: 0 }, // в шаг, без крюка — по расписанию
  async run(g, b, opts, signal) {
    const PHRASE = 'Киуни идёт своим шагом. Гауда качается, до Аллахабада — лес';
    const mg = g.minigame({ phrase: PHRASE });
    const send = keys(g), acts = new Set();
    const move = (key, value, over) => { const a = b.act('state', 'move', key, value, { over }); acts.add(a); return a; };
    signal.addEventListener('abort', () => { for (const a of acts) a.cancel?.(); });
    send('ride', 0); send('pace', START); send('goad', 0); send('balk', 0); send('sugar', 0);
    // шаг: доля на голове слона, касание где угодно
    const head = mg.mark({ at: 'kiouni#head', kind: 'ring' });
    const step = mg.rhythm({ on: null, show: [head], bpm: BPM });
    // крюк
    const hook = mg.mark({ at: 'guide#hands', kind: 'groove', quiet: true, danger: 0 });
    const goad = mg.hold({ on: hook, seconds: 0.3, drain: 0.3 });
    b.minigame.tricks.teach(mg, [step], { id: 'rhythm:anywhere', still: null });
    let steady = START, pace = START, ride = 0, anger = 0, balked = false, balks = 0, tapped = true, bpm = BPM;
    let sugar = null, sugarPress = null, sugarOff = -1, t0 = mg.t;
    step.on('tap', ({ hit }) => {
      tapped = true;
      if (balked || goad.state.held) return; // под крюком и стоя — не до шага
      if (hit) steady = Math.min(STEADY, steady + HIT);
      else { steady = Math.max(SLOW, steady - MISS); mg.error('timing', { at: head }); }
    });
    step.on('beat', () => {
      if (!tapped && !balked && !goad.state.held) steady = Math.max(SLOW, steady - LAPSE);
      tapped = false;
    });
    const balk = () => {
      balked = true;
      balks++;
      goad.set({ fill: 0 });
      send('goad', 0);
      move('balk', 1, BALK_IN);
      mg.error('danger', { at: hook });
      mg.plate.set({ phrase: 'Киуни встал посреди тропы, растопырив уши. Крюк тут ничего не решит' });
      sugar = mg.mark({ at: 'kiouni#trunk', kind: 'ring' });
      sugarPress = mg.press({ on: sugar });
      if (balks === 1) b.minigame.tricks.teach(mg, [sugarPress], { id: 'press' });
      sugarPress.on('press', () => {
        send('sugar', 1);
        mg.snap({ at: sugar });
        sugar.remove();
        sugar = null;
        move('balk', 0, SUGAR_OUT);
        anger = 0;
        steady = START;
        sugarOff = mg.t + 0.6;
        balked = false;
        mg.plate.set({ phrase: PHRASE });
      });
    };
    const done = await until(mg, ({ t, dt }) => {
      if (sugarOff >= 0 && t >= sugarOff) { sugarOff = -1; send('sugar', 0); }
      const goading = !balked && goad.state.held && goad.state.fill >= 1;
      send('goad', goading ? 1 : 0);
      if (balked) goad.set({ fill: 0 });
      anger = clamp(anger + (goading ? ANGER : -CALM) * dt);
      hook.set({ danger: anger });
      if (goading && anger >= 1) balk();
      const want = balked ? 0 : goading ? 1 : steady;
      pace += clamp(want - pace, -EASE * dt, EASE * dt);
      send('pace', pace);
      const nb = goading ? BPM_GOAD : BPM;
      if (nb !== bpm) { bpm = nb; step.set({ bpm }); }
      ride = clamp(ride + (dt * pace) / (STEADY * PATH));
      send('ride', ride);
      mg.plate.set({ fill: ride, glow: balked ? 'bad' : goading ? 'good' : pace >= STEADY - 0.05 ? 'good' : 'idle' });
      return ride >= 1;
    });
    if (!done) return this.skipped;
    const seconds = mg.t - t0;
    mg.snap({ at: head });
    await mg.end({ as: balks ? 'flawed' : 'clean' });
    return { hours: clamp(Math.round((PATH - seconds) / HOUR), -2, 2) || 0 };
  },
};
