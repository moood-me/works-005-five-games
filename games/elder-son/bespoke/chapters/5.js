// V. Старший сын (game.md §6). On the porch at night with Nina: «I don't know my father» — his coat on her shoulders
// (Пальто); Sarafanov packs a suitcase to go with him «to your mother» — ⚑ tell him yourself, or keep silent and let
// Silva tell; the run to the last train (Бегом); at its open door — ⚑ get in, or stay; home, if he stayed.
// Reads: facts (ninaIs, secret, entry, boxWhere, came, ninaCame, silvaDoor, boxHand, told, hurt, train, tune, ending).
// Leaves: choices.truth, .train; scales lie. No map after it (game.md §3.5): the epilogue comes at once.
import { SCENES, facts } from '../story.js';
import palto from '../minigames/palto.js';
import begom from '../minigames/begom.js';
import steklo from '../minigames/steklo.js';

// a sound of the game's on a moment of the scene's (not waited for)
const on = (g, moment, fn) => { g.told(moment).then(ok => { if (ok) fn(); }); };

export default {
  number: 'V', title: 'Старший сын',
  titles: ['Крыльцо', 'Правда', 'Последняя', 'Дом'],
  choices: [
    { id: 'truth', weight: '⚑', title: 'Правда', options: [{ id: 'self', label: 'Сказать самому' }, { id: 'silent', label: 'Промолчать' }] },
    { id: 'train', weight: '⚑', title: 'Последняя', options: [{ id: 'stay', label: 'Остаться' }, { id: 'go', label: 'Войти в вагон' }] },
  ],
  steps: [
    // the porch at night: Nina, and his own father
    async g => {
      const f = facts(g.state);
      g.beds({ wind: 0.3 });
      const sat = g.told('porch_night:sat');
      await g.scene(SCENES.street, { beat: 'porch_night' });
      const porch = g.beat('porch_night');
      await sat;
      if (f.secret) {
        await g.say('nina', 'Он тебе сказал? Про оркестр');
        await g.say('busygin', 'Ни слова');
      }
      // (Р89 is left unanswered — so it is meant: his answer is the choice of V.2)
      if (f.ninaIs === 'knows') await g.say('nina', 'Скажешь ему? Про себя');
      else await g.say('nina', 'Хорошо, что ты к нам приехал');
      await g.say('busygin', 'Я своего отца не знаю. Видел раз — на вокзале. Он меня не узнал');
      await porch;
      await g.beat('shawl');
      await g.play(palto);
      g.set('lay', 1);
      await g.beat('porch_after');
    },
    // the suitcase «to your mother»: ⚑ the truth — his own, or Silva's
    async g => {
      g.beds({ room: 0.3, clock: 0.5 });
      const suitcase = g.told('pack:case'), silva = g.told('pack:silva');
      await g.scene(SCENES.home, { beat: 'pack' });
      const pack = g.beat('pack');
      await g.say('silva', 'Всё, сынок. Спектакль окончен. На последнюю ещё успеем');
      await suitcase;
      await g.say('sarafanov', 'Я с тобой. Тут я никому не нужен');
      await g.say('sarafanov', 'Поеду к твоей маме. Повинюсь');
      await silva;
      await g.say('silva', 'Андрей Григорьевич, да какой он вам…');
      await pack;
      const truth = await g.choose('truth', {
        sarafanov: [{ id: 'self', label: 'Сказать самому' }],
        silva: [{ id: 'silent', label: 'Промолчать' }],
      });
      g.apply('truth');
      if (truth === 'self') {
        g.set('hurt', facts(g.state).hurt ? 1 : 0);
        const said = g.told('confess:said'), sarafanov = g.told('confess:sarafanov');
        const confess = g.beat('confess');
        await said;
        await g.say('busygin', 'Я вам не сын. Мы опоздали на электричку. Надо было где-то ночевать');
        await sarafanov;
        await g.say('sarafanov', 'Ну и что. Я всё равно считаю тебя своим сыном');
        await confess;
      } else {
        const said = g.told('exposed:said'), window = g.told('exposed:window');
        const exposed = g.beat('exposed');
        await said;
        if (facts(g.state).entry === 'asked') await g.say('silva', '…сын! Он вас вчера первый раз увидел. Это я его сыном назвал — для смеху');
        else await g.say('silva', '…сын! Он вас вчера первый раз увидел. Сам назвался — артист');
        await window;
        await g.say('sarafanov', 'Ну и что. Я всё равно считаю тебя своим сыном', 'sarafanov');
        await exposed;
      }
      on(g, 'go_out:gone', () => g.sound.door());
      await g.beat('go_out');
    },
    // the run to the last train; at its open door — ⚑ get in, or stay
    async g => {
      const f = facts(g.state);
      g.beds({ wind: 0.5 });
      await g.scene(SCENES.street, { beat: 'run_out' }, { cut: true });
      await g.beat('run_out');
      const r = await g.play(begom);
      g.set('run', 1);
      g.set('look_back', 0);
      g.beds({ wind: 0.5, train: 0.6 }, 1);
      const open = g.told('last:open'), came = g.told('last:came');
      await g.scene(SCENES.platform, { beat: 'last', late_run: r.looks >= 2 ? 1 : 0 }, { cut: true });
      const last = g.beat('last');
      await open;
      g.sound.doors();
      if (f.silvaDoor) await g.say('silva', 'Ну? Едешь, сынок?');
      await came;
      if (f.came !== 'none') await g.say('sarafanov', 'Володя!');
      else if (f.ninaCame) await g.say('nina', 'Володя');
      await last;
      const train = await g.choose('train', {
        'train#door': [{ id: 'go', label: 'Войти в вагон' }],
        [f.came !== 'none' ? 'sarafanov' : f.ninaCame ? 'nina' : 'far_window']: [{ id: 'stay', label: 'Остаться' }],
      });
      g.apply('train');
      if (train === 'stay') {
        on(g, 'stays:gone', () => g.beds({ wind: 0.4 }, 4));
        await g.beat('stays');
      } else {
        const box = g.told('boards:box');
        on(g, 'boards:in', () => g.sound.doors());
        const boards = g.beat('boards');
        await box;
        if (f.boxHand) await g.say('sarafanov', 'Возьми. Она — старшему');
        await boards;
        await g.beat('glass');
        const w = await g.play(steklo);
        g.set('wipe', Math.max(w.wipe, 0.3)); // (as much seen as he wiped)
        const wave = g.told('away:wave');
        const away = g.beat('away');
        g.beds({ train: 0.8 }, 2);
        await wave;
        if (f.told === 'self' && f.came !== 'none') await g.say('sarafanov', 'В субботу приезжай! Слышишь — в субботу!');
        await away;
      }
    },
    // home, if he stayed: late for the train — or «Чаю?»
    async g => {
      const f = facts(g.state);
      if (f.train !== 'stay') return;
      g.beds({ room: 0.4, clock: 0.5 });
      if (f.told === 'self') {
        const sat = g.told('home_late:sat'), box = g.told('home_late:box'), room = g.told('home_late:room');
        await g.scene(SCENES.home, { beat: 'home_late' });
        const home = g.beat('home_late');
        await sat;
        await g.say('busygin', 'Я опоздал на электричку');
        await g.say('sarafanov', 'Вот и хорошо. Вот и правильно');
        await box;
        if (f.boxWhere === 'cupboard') await g.say('sarafanov', 'Теперь возьмёшь?');
        await room;
        // now — the phrase for the first time goes on and resolves (≈ 14 s; it ends by itself, in the epilogue
        // already); else it breaks off, as always: `later` — much untruth, it does not heal at once (it resolves in the
        // epilogue); `cut` — no one came for him: the truth said, and the house never one
        if (f.tune === 'now') g.sound.clarinet({ times: 1, resolve: true });
        else g.sound.clarinet({ times: 1 });
        await home;
      } else {
        const turn = g.told('home_anyway:turn');
        await g.scene(SCENES.home, { beat: 'home_anyway' });
        const home = g.beat('home_anyway');
        await turn;
        await g.say('sarafanov', 'Чаю?');
        await home;
      }
    },
  ],
};
