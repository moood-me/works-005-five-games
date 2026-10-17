// III. Сто ночей — Toto, seventeen: the 8 mm camera on the church steps and a stranger crossing the square (Камера;
// ⚑ go on filming, or go down to her), the soldier and the princess (in the booth if Alfredo stayed by him, at his
// door if not), the hundred nights under her balcony (Сто ночей), ⚑ the ninety-ninth night — wait on, or go to the
// booth where the New Year's film must run. game.md §6 «Глава III».
// Reads: facts.alfredoHere (where the story is told; Р52). Leaves: choices.camera, choices.nights; scales.toto (III.1
// ±1, III.4 ±1); marks.reel8 (film); hands.kamera, sto-nochey.
import { SCENES, facts } from '../story.js';
import kamera from '../minigames/kamera.js';
import stoNochey from '../minigames/sto-nochey.js';

// a handle of sound (theme, camera8) stopped when the step is left
const held = (g, h) => {
  g.signal.addEventListener('abort', () => h.stop(0.5));
  return h;
};

export default {
  number: 'III',
  title: 'Сто ночей',
  titles: ['Камера', 'Солдат и принцесса', 'Сто ночей', 'Новый год'],
  choices: [
    { id: 'camera', weight: '⚑', title: 'Незнакомая девушка', options: [{ id: 'film', label: 'Снимать дальше' }, { id: 'speak', label: 'Подойти к ней' }] },
    { id: 'nights', weight: '⚑', title: 'Девяносто девятая ночь', options: [{ id: 'wait', label: 'Ждать дальше' }, { id: 'booth', label: 'Уйти в будку' }] },
  ],
  steps: [
    // dusk on the church steps; the camera follows a girl across the square (⚑ camera)
    async g => {
      g.hero('toto');
      g.beds({ square: 0.5, cicadas: 0.4 });
      const aim = g.told('dusk:aim');
      await g.scene(SCENES.square, { beat: 'dusk' });
      const dusk = g.beat('dusk');
      await aim;
      await g.say('narrator', 'Мне было семнадцать. Я снимал всё подряд на маленькую камеру');
      await dusk;
      const cam = held(g, g.sound.camera8());
      await g.play(kamera, { onFrame: inFrame => cam.loud(inFrame ? 0.6 : 0.15, 0.3) });
      g.set('viewfinder', 0);
      g.set('pan', 0);
      g.set('elena_x', 0);
      g.set('madman_x', 1);
      g.set('rec', 0);
      cam.stop(0.5);
      await g.beat('seen');
      const camera = await g.choose('camera', {
        toto: [{ id: 'film', label: 'Снимать дальше' }],
        elena: [{ id: 'speak', label: 'Подойти к ней' }],
      });
      if (camera === 'film') {
        g.scale('toto', 1);
        g.mark('reel8', true, 'Плёнка останется у Тото.');
        const still = held(g, g.sound.camera8());
        const door = g.told('film_on:door');
        const on = g.beat('film_on');
        await door;
        still.stop(0.5);
        await g.say('narrator', 'Три минуты плёнки. Я их потом смотрел сто раз');
        await on;
      } else {
        g.scale('toto', -1);
        const met = g.told('hello:met');
        const hello = g.beat('hello');
        await met;
        await g.say('elena', 'Это ты в будке кино крутишь?', 'elena');
        await g.say('toto', 'Я. Тото', 'toto');
        await g.say('elena', 'Елена. Мы только приехали', 'elena');
        g.sound.giggle();
        await hello;
      }
    },
    // the soldier and the princess: in the booth beside him (Alfredo kept) or at his door (let go)
    async g => {
      g.hero('both');
      const here = facts(g.state).alfredoHere, beat = here ? 'story_booth' : 'story_door';
      if (here) g.beds({ whirr: 0.4, hall: 0.2 });
      else g.beds({ square: 0.4, cicadas: 0.4 });
      const start = g.told(`${beat}:start`), ninety = g.told(`${beat}:99`), why = g.told(`${beat}:why`);
      await g.scene(here ? SCENES.booth : SCENES.square, { beat });
      const story = g.beat(beat);
      await start;
      await g.say('alfredo', 'Король устроил праздник. Солдат увидел принцессу — и пропал');
      await g.say('alfredo', 'Она сказала: простоишь сто ночей под моим балконом — буду твоей');
      await ninety;
      await g.say('alfredo', 'Он стоял. А на девяносто девятую ночь встал, взял стул и ушёл');
      await why;
      await g.say('toto', 'Почему?', 'toto');
      await g.say('alfredo', 'Не знаю. Поймёшь — скажешь мне');
      await story;
    },
    // the chair under her balcony; the hundred nights, a chalk stroke a week
    async g => {
      g.hero('toto');
      g.beds({ square: 0.3, cicadas: 0.3 });
      const sat = g.told('chair:sat');
      await g.scene(SCENES.square, { beat: 'chair' });
      const chair = g.beat('chair');
      await sat;
      await g.say('narrator', 'Я решил стоять сто ночей. Сидеть, если честно');
      await chair;
      await g.beat('nights');
      await g.play(stoNochey);
      g.set('chalk', 98);
      g.set('night_kind', 'cold');
      g.set('elena_window', 0);
      g.beds({ square: 0.3 }, 2);
    },
    // the ninety-ninth night, New Year's Eve: the booth's window lit across the square (⚑ nights)
    async g => {
      g.hero('toto');
      g.beds({ square: 0.5, hall: 0.2 });
      const ready = g.told('eve:ready');
      await g.scene(SCENES.square, { beat: 'eve', chalk: 99 });
      const eve = g.beat('eve');
      await ready;
      await g.say('narrator', 'Девяносто девятая ночь. В «Парадизо» новогодний фильм. Крутить его должен был я');
      await eve;
      const nights = await g.choose('nights', {
        balcony: [{ id: 'wait', label: 'Ждать дальше' }],
        'paradiso#booth_window': [{ id: 'booth', label: 'Уйти в будку' }],
      });
      if (nights === 'wait') {
        g.scale('toto', -1);
        const open = g.told('midnight:open'), hug = g.told('midnight:hug');
        const midnight = g.beat('midnight');
        await open;
        g.sound.whistle();
        g.sound.fireworks();
        g.sound.motif();
        await hug;
        await g.say('elena', 'Девяносто девять. Я тоже считала', 'elena');
        await midnight;
        await g.beat('midnight_close'); // (крупно)
        await g.say('narrator', 'Зал в ту ночь остался без фильма. Чиччо вычел из жалованья');
      } else {
        g.scale('toto', 1);
        g.beds({ whirr: 0.6, hall: 0.3 });
        const door = g.told('reels:door'), hug = g.told('reels:hug'), tail = g.told('reels:tail');
        await g.scene(SCENES.booth, { beat: 'reels' });
        const reels = g.beat('reels');
        await door;
        await g.say('elena', 'Ты ушёл с площади. Я думала — всё', 'elena');
        await hug;
        g.sound.motif();
        await tail;
        g.sound.reelEnd();
        if (facts(g.state).alfredoHere) await g.say('alfredo', 'Тото! Плёнка кончилась!');
        await reels;
        g.beds({ hall: 0.4 });
        await g.scene(SCENES.hall, { beat: 'whistle' }, { cut: true });
        const whistle = g.beat('whistle');
        g.sound.whistle();
        await whistle;
      }
      await g.say('narrator', 'Так у нас было одно лето');
    },
  ],
};
