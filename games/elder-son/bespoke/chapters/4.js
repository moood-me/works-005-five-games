// IV. Пожар (game.md §6). Vasenka on the platform bench with his rucksack — «don't hold me»: the strap (Рюкзак); the
// bridegroom at nine — ~ let Nina go to Sakhalin, ask her to stay for father, or (if she knows the truth) for him; the
// shed on fire (Вёдра) — ⚑ take the blame for Vasenka, or let him own up.
// Reads: facts.ninaIs. Leaves: choices.kudimov, .fire; marks.nina_stay, .vasenka, .silva; scales home, lie.
import { SCENES, facts } from '../story.js';
import ryukzak from '../minigames/ryukzak.js';
import vyodra from '../minigames/vyodra.js';

// a sound of the game's on a moment of the scene's (not waited for)
const on = (g, moment, fn) => { g.told(moment).then(ok => { if (ok) fn(); }); };

export default {
  number: 'IV', title: 'Пожар',
  titles: ['Рюкзак', 'Жених', 'Пожар'],
  choices: [
    { id: 'kudimov', weight: '~', title: 'Жених', options: [{ id: 'let', label: '«Пусть едет»' }, { id: 'ask', label: '«Нина, останься»' }, { id: 'for_me', label: '«Останься. Не ради отца»' }] },
    { id: 'fire', weight: '⚑', title: 'Пожар', options: [{ id: 'blame', label: 'Взять на себя' }, { id: 'own_up', label: 'Пусть скажет сам' }] },
  ],
  steps: [
    // Vasenka on the bench, the train's open door, the strap
    async g => {
      g.beds({ wind: 0.2, rails: 0.3 });
      const sit = g.told('bench:sit');
      await g.scene(SCENES.platform, { beat: 'bench' });
      const bench = g.beat('bench');
      await sit;
      await g.say('vasenka', 'Не держи. Всё равно уеду');
      await g.say('busygin', 'Я не держу');
      await bench;
      on(g, 'strap:open', () => g.sound.doors());
      const strap = g.beat('strap');
      g.beds({ wind: 0.2, train: 0.6 }, 2);
      await strap;
      const r = await g.play(ryukzak);
      g.set('pull', 0);
      g.set('grip', 1);
      g.set('door_bg', 1);
      g.set('torn', r.slips >= 2 ? 1 : 0);
      const sat = g.told('bench_back:sat');
      const back = g.beat('bench_back');
      g.beds({ wind: 0.2 }, 6);
      await sat;
      await g.say('vasenka', 'Ладно. Пошли жениха смотреть');
      await back;
    },
    // the bridegroom at nine: Sakhalin — ~ what the elder brother says
    async g => {
      g.beds({ room: 0.4, clock: 0.4 });
      on(g, 'table:nine', () => g.sound.strike(9));
      const inside = g.told('table:in'), sat = g.told('table:sat');
      await g.scene(SCENES.home, { beat: 'table' });
      const table = g.beat('table');
      await g.say('narrator', 'Жениха ждали к девяти');
      await inside;
      g.sound.door();
      await g.say('kudimov', 'Двадцать один ноль-ноль. Курсант Кудимов');
      await sat;
      await g.say('kudimov', 'Нина сказала — у неё брат нашёлся. Поздравляю');
      await table;
      const news = g.told('toast:news'), turn = g.told('toast:turn');
      const toast = g.beat('toast');
      await news;
      await g.say('kudimov', 'Я никогда не вру. Это у меня принцип');
      await g.say('kudimov', 'Мы с Ниной в субботу уезжаем. На Сахалин');
      await turn;
      await g.say('sarafanov', 'Скажи хоть ты, Володя. Ты старший');
      await toast;
      const f = facts(g.state);
      const said = await g.choose('kudimov', {
        kudimov: [{ id: 'let', label: '«Пусть едет»' }],
        sarafanov: [{ id: 'ask', label: '«Нина, останься»' }],
        ...(f.ninaIs === 'knows' ? { nina: [{ id: 'for_me', label: '«Останься. Не ради отца»' }] } : {}),
      });
      g.apply('kudimov');
      if (said === 'let') {
        await g.say('busygin', 'Пусть едет. Это её жизнь');
        const glass = g.told('let_go:glass');
        const beat = g.beat('let_go');
        await glass;
        await g.say('sarafanov', 'Да… Да, конечно');
        await beat;
      } else if (said === 'ask') {
        await g.say('busygin', 'Нина, не уезжай. Отцу одному нельзя');
        const stand = g.told('ask_stay:stand');
        const beat = g.beat('ask_stay');
        await stand;
        await g.say('kudimov', 'Это решать нам');
        await beat;
      } else {
        await g.say('busygin', 'Останься. Не ради отца');
        const stand = g.told('for_me:stand');
        const beat = g.beat('for_me');
        await stand;
        await g.say('kudimov', 'Я понял');
        await beat;
      }
    },
    // the shed on fire: the buckets; who did it — ⚑ take the blame, or let him own up
    async g => {
      g.beds({ wind: 0.3 });
      on(g, 'evening:in', () => g.sound.door());
      await g.scene(SCENES.street, { beat: 'evening' });
      await g.beat('evening');
      const cry = g.told('fire:cry');
      const fire = g.beat('fire');
      g.beds({ wind: 0.3, fire: 0.6, crowd: 0.5 }, 2);
      await cry;
      await g.say('makarskaya', 'Горим! Сарай горит!');
      await fire;
      g.set('beat_next', 'after_fire');
      const r = await g.play(vyodra);
      g.set('fire', 0, 3);
      g.set('vyodra', 'none'); // (the bucket put away)
      g.set('shed_left', r.buckets >= 3 ? 1 : 0);
      g.set('beat_next', 'after_fire'); // (made ready again, by the keys of how it went)
      g.beds({ wind: 0.3, crowd: 0.3 }, 3);
      const who = g.told('after_fire:who');
      const after = g.beat('after_fire');
      await who;
      await g.say('silva', 'Кто поджёг? Найду — убью!');
      await after;
      const blame = await g.choose('fire', {
        makarskaya: [{ id: 'blame', label: 'Взять на себя' }],
        vasenka: [{ id: 'own_up', label: 'Пусть скажет сам' }],
      });
      g.apply('fire');
      if (blame === 'blame') {
        const step = g.told('blame:step');
        const beat = g.beat('blame');
        await step;
        await g.say('busygin', 'Это я. Курил у сарая');
        await g.say('silva', 'Ты?!');
        await beat;
      } else {
        const said = g.told('own_up:said');
        const beat = g.beat('own_up');
        await said;
        await g.say('vasenka', 'Это я. Я поджёг');
        await g.wait(2000);
        await g.say('makarskaya', 'Дурак ты, Васенька');
        await beat;
      }
    },
  ],
};
