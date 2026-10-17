// II. Луч — Alfredo's chapter; Toto nine to ten: the boy threads the projector (Заправка) and learns the lever; the
// square without seats — Alfredo turns the projector and leads the beam across the square onto the white wall (Луч;
// the theme whole for the first time); the fire, the boy drags him out of the smoke (Вытащить), Alfredo alive and
// blind; the new «Парадизо», the first uncut kiss; ⚑ blind Alfredo at his door: go with the boy to the booth, or send
// him alone (the reel appears). game.md §6 «Глава II».
// Reads: hands.zapravka (facts.slips: the frame trembles in `motor`). Leaves: choices.booth; scales.alfredo (II.5 ±1);
// the reel's gauge shown; hands.zapravka, luch, vytaschit.
import { SCENES, facts } from '../story.js';
import zapravka from '../minigames/zapravka.js';
import luch from '../minigames/luch.js';
import vytaschit from '../minigames/vytaschit.js';

// a handle of sound (theme, camera8) stopped when the step is left
const held = (g, h) => {
  g.signal.addEventListener('abort', () => h.stop(0.5));
  return h;
};

export default {
  number: 'II',
  title: 'Луч',
  titles: ['Заправка', 'Толпа', 'Огонь', 'Поцелуи', 'Будка'],
  choices: [
    { id: 'booth', weight: '⚑', title: 'Механик в десять лет', options: [{ id: 'hold', label: '«Пойдём. Буду рядом»' }, { id: 'release', label: '«Иди один»' }] },
  ],
  steps: [
    // the boy threads the projector; the motor, the beam leaps into the port; the lever; the full hall
    async g => {
      g.hero('both');
      g.beds({});
      const crate = g.told('lesson:crate');
      await g.scene(SCENES.booth, { beat: 'lesson' });
      const lesson = g.beat('lesson');
      await crate;
      await g.say('alfredo', 'Сначала сюда. Петлю оставь — иначе порвёт');
      await lesson;
      await g.play(zapravka);
      g.set('threaded', 5);
      g.set('pull', 0);
      g.set('stutter', facts(g.state).slips >= 1 ? 1 : 0);
      const beam = g.told('motor:beam'), lever = g.told('motor:lever');
      const motor = g.beat('motor');
      await beam;
      g.beds({ whirr: 0.6 });
      g.sound.motif();
      await lever;
      await g.say('alfredo', 'А это рычаг. Мигнёт точка — мотор. Вторая — рычаг', 'alfredo');
      await motor;
      const laugh = g.told('full_hall:laugh');
      await g.scene(SCENES.hall, { beat: 'full_hall' }, { cut: true });
      g.beds({ whirr: 0.3, hall: 0.6 });
      const hall = g.beat('full_hall');
      await laugh;
      g.sound.laugh();
      await g.say('alfredo', 'Работа одинокая, Тото. Летом жарко, зимой холодно. И один фильм — сто раз', 'lion');
      await g.say('toto_boy', 'Это ты из кино взял!', 'lion');
      await g.say('alfredo', 'Из кино. Зато правда', 'lion');
      await hall;
    },
    // no seats left: the square whistles; Alfredo leads the beam across the square onto the wall
    async g => {
      g.hero('alfredo');
      g.beds({ square: 0.7, cicadas: 0.2 });
      const madman = g.told('crowd:madman'), shout = g.told('crowd:shout');
      await g.scene(SCENES.square, { beat: 'crowd', full_sign: 1 });
      const crowd = g.beat('crowd');
      await madman;
      await g.say('madman', 'Площадь моя! Моя площадь!');
      await shout;
      g.sound.whistle();
      await g.say('crowd', 'Пусти! Мы тоже хотим кино!', 'c1');
      await crowd;
      g.beds({ whirr: 0.5, square: 0.4 });
      const hands = g.told('window:hands');
      await g.scene(SCENES.booth, { beat: 'window' }, { cut: true });
      const window = g.beat('window');
      await hands;
      await g.say('alfredo', 'Хотите кино? Будет вам кино');
      await window;
      await g.scene(SCENES.square, { beat: 'beam_out' }, { cut: true });
      await g.beat('beam_out');
      await g.play(luch, { onFocus: u => g.sound.whirr(0.3 + 0.3 * u, 0.3) });
      g.set('beam_aim', 1);
      g.set('beam_focus', 1);
      g.set('wall_film', 'comedy');
      g.sound.motif();
      g.sound.applause();
      // the theme whole for the first time, quietly, under the square's gift
      const theme = held(g, g.sound.theme());
      theme.loud(0.35, 3);
      const sit = g.told('wall_film:sit');
      const wall = g.beat('wall_film');
      await sit;
      g.sound.laugh();
      await g.say('narrator', 'В тот вечер площадь смотрела кино на стене дома');
      await wall;
      theme.stop(3);
    },
    // the fire: the film flares in the gate; the wall blisters; the boy drags Alfredo out; the fountain
    async g => {
      g.hero('both');
      g.beds({ whirr: 0.5, square: 0.3 });
      const flame = g.told('jam:flame');
      await g.scene(SCENES.booth, { beat: 'jam' });
      const jam = g.beat('jam');
      await g.say('alfredo', 'Беги вниз, глянь, как там видно', 'alfredo');
      await flame;
      g.sound.flame();
      g.beds({ fire: 0.8 });
      await jam;
      const fire = g.told('smoke:fire');
      await g.scene(SCENES.square, { beat: 'smoke', beam_on: 1, beam_aim: 1, beam_focus: 1, wall_film: 'comedy' }, { cut: true });
      const smoke = g.beat('smoke');
      await fire;
      await g.say('crowd', 'Пожар! В будке пожар!', 'c1');
      await smoke;
      g.beds({ fire: 1 });
      await g.scene(SCENES.booth, { beat: 'smoke_in' }, { cut: true });
      await g.beat('smoke_in');
      await g.play(vytaschit);
      g.set('drag', 1);
      g.set('cough', 0);
      g.beds({ square: 0.4, fire: 0.2 }, 2);
      const sat = g.told('outside:sat');
      await g.scene(SCENES.square, { beat: 'outside' });
      const outside = g.beat('outside');
      await sat;
      await g.say('narrator', 'Альфредо выжил. Но больше не видел');
      await outside;
    },
    // the new «Парадизо»; the first uncut kiss, the hall roars, the priest walks out
    async g => {
      g.hero('toto');
      g.beds({ square: 0.3 });
      const lit = g.told('new_sign:lit');
      await g.scene(SCENES.square, { beat: 'new_sign' });
      const sign = g.beat('new_sign');
      await lit;
      await g.say('narrator', 'Неаполитанец Чиччо выиграл в лотерею и отстроил «Парадизо». Механиком взяли меня. Больше никто не умел');
      await sign;
      g.beds({ hall: 0.6, whirr: 0.3 });
      const kiss = g.told('first_kiss:kiss'), priest = g.told('first_kiss:priest');
      await g.scene(SCENES.hall, { beat: 'first_kiss' });
      const first = g.beat('first_kiss');
      await kiss;
      g.sound.roar();
      await priest;
      await g.say('narrator', 'Чиччо сказал: в новом «Парадизо» поцелуи не режут');
      await first;
    },
    // blind Alfredo at his door; the boy asks him to come (⚑ booth)
    async g => {
      g.hero('alfredo');
      g.beds({ square: 0.4, cicadas: 0.3 });
      const asked = g.told('door:asked');
      await g.scene(SCENES.square, { beat: 'door' });
      const door = g.beat('door');
      await asked;
      await g.say('toto_boy', 'Альфредо, пойдём со мной в будку. Мне одному страшно', 'toto');
      await door;
      const booth = await g.choose('booth', {
        toto: [{ id: 'hold', label: '«Пойдём. Буду рядом»' }],
        alfredo: [{ id: 'release', label: '«Иди один»' }],
      });
      g.gauge('alfredo');
      if (booth === 'hold') {
        g.scale('alfredo', 1);
        await g.say('alfredo', 'Пойдём. Я буду рядом. Её я и на слух знаю');
        await g.beat('go_together');
      } else {
        g.scale('alfredo', -1);
        await g.say('alfredo', 'Иди один. Справишься. И в школу ходи. Не для тебя эта работа');
        await g.beat('go_alone');
      }
    },
  ],
};
