// «Буквы» (I.4, Будка, после куска `slate_in`; вставка `slate`): маленькая рука на большой руке Альфредо с мелом —
// «АЛЬФРЕДО» по пунктиру на грифельной доске. Вести по линии от `slate#start` до `slate#end`: пройдено — `chalk_x`,
// буквы — `letters` = floor(8 · chalk_x). Поспешил (мел идёт быстрее 0.1 строки в секунду, сглажено за 0.3 с) — рука
// дёрнулась: `wobble` 1 на 0.4 с, текущая буква в `crooked` становится 1, скрип мела (не чаще раза на букву). Отпустил —
// стоит; дальше с того же места.
//   Чувство: взрослый Альфредо учится писать своё имя у мальчика; хочет сдать экзамен; стыдно и смешно; игрок —
//   нежность и терпение.
//   → { crooked: строка из 8 знаков '0'/'1' — кривые буквы (доска на гвозде в будке 1988 года) }
import { until, keys } from '../hands.js';

const LETTERS = 8;
const FAST = 0.1; // строки в секунду — быстрее рука дёргается
const SMOOTH = 0.3; // с: сглаживание скорости
const WOBBLE = 0.4; // с

export default {
  file: 'bukvy',
  title: 'Буквы', // как её зовёт карта автора
  about: 14,
  skipped: { crooked: '00000000' },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: 'Рука у Альфредо тяжёлая. Мел слушается её, только когда она идёт медленно' });
    const send = keys(g);
    const start = mg.mark({ at: 'slate#start', kind: 'dash' });
    const chalk = mg.trace({ on: start, line: ['slate#start', 'slate#end'] });
    b.minigame.tricks.teach(mg, [chalk], { id: 'trace' });
    mg.plate.set({ notches: Array.from({ length: LETTERS - 1 }, (_, i) => (i + 1) / LETTERS) });
    const crooked = Array(LETTERS).fill('0');
    let x = 0, rate = 0, wobbleTill = -1, letters = 0, faulted = -1;
    const done = await until(mg, ({ t, dt }) => {
      const s = chalk.state, was = x;
      x = Math.min(1, s.u);
      // скорость мела, сглаженная
      if (dt > 0) rate += ((x - was) / dt - rate) * Math.min(1, dt / SMOOTH);
      const now = Math.min(LETTERS - 1, Math.floor(LETTERS * x));
      if (rate > FAST && s.tracing && faulted !== now) {
        faulted = now;
        crooked[now] = '1';
        send('crooked', crooked.join(''));
        wobbleTill = t + WOBBLE;
        g.sound.chalkSqueak();
        mg.error('off', { at: chalk });
      }
      const lettersNow = Math.min(LETTERS, Math.floor(LETTERS * x));
      if (lettersNow > letters) { letters = lettersNow; send('letters', letters); g.sound.chalk(); }
      send('chalk_x', x);
      send('wobble', t < wobbleTill ? 1 : 0);
      mg.plate.set({ fill: x, glow: t < wobbleTill ? 'bad' : s.tracing ? 'good' : 'idle' });
      return x >= 0.99;
    });
    if (!done) return this.skipped;
    send('chalk_x', 1);
    send('letters', LETTERS);
    send('wobble', 0);
    mg.snap({ at: start });
    const line = crooked.join('');
    await mg.end({ as: line.includes('1') ? 'flawed' : 'clean' });
    return { crooked: line };
  },
};
