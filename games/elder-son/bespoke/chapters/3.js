// III. Марш (game.md §6). Nina takes him out past the settlement: their father plays the dead march in a funeral band —
// dismissed from the orchestra, and the children pretend not to know; ~ go up to him (Под руку) or slip away after him
// (Следом); at the level crossing, under the goods train — ⚑ the truth, the truth no one hears, or «brother».
// Reads: nothing. Leaves: choices.father, .crossing; marks.nina; scales home, lie.
import { SCENES } from '../story.js';
import podRuku from '../minigames/pod-ruku.js';
import sledom from '../minigames/sledom.js';

// a sound of the game's on a moment of the scene's (not waited for)
const on = (g, moment, fn) => { g.told(moment).then(ok => { if (ok) fn(); }); };

export default {
  number: 'III', title: 'Марш',
  titles: ['Отец', 'Переезд'],
  choices: [
    { id: 'father', weight: '~', title: 'Отец на косогоре', options: [{ id: 'approach', label: 'Подойти к нему' }, { id: 'hide', label: 'Уйти незаметно' }] },
    { id: 'crossing', weight: '⚑', title: 'Переезд', options: [{ id: 'truth', label: 'Сказать правду' }, { id: 'roar', label: 'Сказать под грохот' }, { id: 'brother', label: '«Брат»' }] },
  ],
  steps: [
    // the funeral band on the hillside, and their father in it
    async g => {
      g.beds({ wind: 0.3 });
      let m = null; // the march's handle: stopped at its end, at the step's end, on the step left
      g.signal.addEventListener('abort', () => m?.stop(0));
      await g.scene(SCENES.hill, { beat: 'road' });
      const road = g.beat('road');
      await g.say('narrator', 'Вечером Нина повела его за посёлок');
      await g.say('nina', 'Пойдём. Покажу, в какой филармонии играет наш отец');
      await road;
      on(g, 'march:end', () => m?.stop(3));
      const march = g.beat('march');
      m = g.sound.march();
      await g.wait(3000);
      await g.say('nina', 'Его из оркестра уволили. Два года назад. Он думает, мы не знаем');
      await g.say('busygin', 'А вы знаете');
      await g.say('nina', 'Мы делаем вид. Ему так легче');
      await march;
      await g.beat('alone');
      const father = await g.choose('father', {
        sarafanov: [{ id: 'approach', label: 'Подойти к нему' }],
        nina: [{ id: 'hide', label: 'Уйти незаметно' }],
      });
      g.apply('father');
      if (father === 'approach') {
        const talk = g.told('meet:talk');
        const meet = g.beat('meet');
        await talk;
        await g.say('sarafanov', 'Ну вот. Теперь и ты знаешь');
        await g.say('sarafanov', 'Только Нине с Васей — ни слова');
        await g.say('busygin', 'Ни слова');
        await meet;
        g.set('beat_next', 'bottom');
        const r = await g.play(podRuku);
        g.set('down', 1);
        g.set('catch', 0);
        g.set('fall', 0);
        g.set('snowy', r.falls > 0 ? 1 : 0);
        g.set('beat_next', 'bottom'); // (made ready again, by the keys of how it went)
        const bottom = g.beat('bottom');
        await g.say('sarafanov', 'Ну, иди. Мне ещё в клуб — на танцах играть');
        await bottom;
      } else {
        await g.beat('hide');
        g.set('beat_next', 'club');
        const r = await g.play(sledom);
        g.set('seen', r.seen > 0 ? 1 : 0); // (the rest the beat `club` sets by its `from`)
        g.set('beat_next', 'club'); // (made ready again, by the keys of how it went)
        const inside = g.told('club:in');
        const club = g.beat('club');
        await inside;
        g.sound.dance(3);
        await g.say('nina', 'Теперь и ты делаешь вид');
        await club;
      }
      m?.stop(0);
    },
    // the level crossing: the bell, the red lights, the goods train coming — ⚑ what to tell Nina
    async g => {
      g.beds({ wind: 0.3, crossing: 0.6 });
      const light = g.told('wait:light');
      await g.scene(SCENES.crossing, { beat: 'wait' });
      const wait = g.beat('wait');
      await light;
      await g.say('nina', 'Я за Мишу выхожу. Он хороший. Он никогда не врёт');
      await g.say('nina', 'А ты ведь мне не брат. Правда?');
      await wait;
      const said = await g.choose('crossing', {
        nina: [{ id: 'truth', label: 'Сказать правду' }],
        'freight#light': [{ id: 'roar', label: 'Сказать под грохот' }],
        barrier: [{ id: 'brother', label: 'Ответить: «Брат»' }],
      });
      g.apply('crossing');
      const roar = () => g.beds({ crossing: 0.6, freight: 1 }, 4);
      const quiet = () => g.beds({ wind: 0.3 }, 3);
      if (said === 'truth') {
        const spoken = g.told('truth:said'), passed = g.told('truth:passed');
        const truth = g.beat('truth');
        await spoken;
        await g.say('busygin', 'Не брат. Мы вчера опоздали на электричку. Вот и всё');
        roar();
        await passed;
        quiet();
        await g.say('nina', 'Отцу не говори. Пока');
        await truth;
      } else if (said === 'roar') {
        const loud = g.told('roar:loud');
        on(g, 'roar:passed', quiet);
        const beat = g.beat('roar');
        roar();
        await loud;
        await g.say('busygin', 'Не брат я тебе, Нина…'); // (all but unheard under the train: so it is meant)
        await g.say('nina', 'Что?');
        await g.say('busygin', 'Брат, говорю');
        await beat;
      } else {
        const passed = g.told('brother:passed');
        on(g, 'brother:arm', roar);
        const brother = g.beat('brother');
        await g.say('busygin', 'Брат');
        await passed;
        quiet();
        await g.say('nina', 'Ну, тогда — брат');
        await brother;
      }
    },
  ],
};
