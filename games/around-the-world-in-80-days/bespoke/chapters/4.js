// IV. Атлантика «в которой „Генриетта“ сгорает до ватерлинии» — game.md §3. New York: the «China» gone forty-five
// minutes; the «Henrietta» and Captain Speedy; the mutiny; no coal — ⚑ henrietta: buy her and burn her («Котлы») or go
// under sail; Liverpool: the arrest, the cell, the release (~ liverpool: strike or the hand); the special train.
// Reads: facts aouda, pp; marks fix; hands kotly. Leaves: choices henrietta, liverpool; hours, money; marks fix,
// speedy.
import { SCENES, facts, PART_PRICE, PART_HOURS } from '../story.js';
import kotly from '../minigames/kotly.js';

export default {
  number: 'IV',
  title: 'Атлантика',
  heading: 'в которой «Генриетта» сгорает до ватерлинии',
  route: [0.78, 0.97],
  titles: ['Сорок пять минут', 'Бунт', 'Угля нет', 'Котлы', 'Ливерпуль', 'Экстренный поезд'],
  choices: [
    { id: 'henrietta', weight: '⚑', title: '«Генриетта»', options: [{ id: 'burn', label: 'Купить и жечь' }, { id: 'sails', label: 'Идти под парусами' }] },
    { id: 'liverpool', weight: '~', title: 'Фикс в Ливерпуле', options: [{ id: 'hit', label: 'Ударить' }, { id: 'hand', label: 'Протянуть руку' }] },
  ],
  steps: [
    // New York: the «China» is gone; the «Henrietta» takes no passengers — for two thousand dollars a head she does
    async g => {
      g.hero('fogg');
      g.beds({ town: 0.3, sea: 0.4, clock: 0.3 }, 2);
      const f = facts(g.state);
      const smoke = g.told('new_york:smoke'), speedy = g.told('new_york:speedy');
      await g.scene(SCENES.deck, { beat: 'new_york', ship: 'henrietta', port: 'new_york' });
      const ny = g.beat('new_york');
      await smoke;
      await g.say(f.pp === 'with' ? 'pp' : 'fix', '«Китай» ушёл сорок пять минут назад!');
      await speedy;
      await g.say('speedy', 'Иду в Бордо. Пассажиров не беру');
      await g.say('fogg', 'А за две тысячи долларов с человека?');
      await ny;
      const heads = 2 + (f.aouda === 'with' ? 1 : 0) + (f.pp === 'with' ? 1 : 0);
      g.money(-400 * heads);
      g.sound.notes();
      await g.say('speedy', 'Ладно. Но курс — на Бордо');
    },
    // the mutiny: Speedy locked in his cabin, roaring
    async g => {
      g.hero('fogg');
      g.beds({ sea: 0.5, furnace: 0.3 }, 2);
      const porthole = g.told('mutiny:porthole');
      await g.scene(SCENES.deck, { beat: 'mutiny', ship: 'henrietta', port: 'none' });
      const mutiny = g.beat('mutiny');
      await porthole;
      await g.say('speedy', 'Пираты! Я вас всех повешу!');
      await mutiny;
      await g.say('fogg', 'Курс на Ливерпуль');
    },
    // no coal — ⚑ buy her and burn her, or under sail
    async g => {
      g.hero('fogg');
      g.beds({ sea: 0.5, furnace: 0.15 }, 2);
      const stoker = g.told('coal:stoker'), speedy = g.told('coal:speedy');
      await g.scene(SCENES.deck, { beat: 'coal', ship: 'henrietta', port: 'none' }, { cut: true });
      const coal = g.beat('coal');
      await stoker;
      await g.say('stoker', 'Угля — на день, сэр. До Ливерпуля — четыре');
      await speedy;
      await g.say('fogg', 'Капитан Спиди, продайте мне ваш корабль');
      await g.say('speedy', 'Шестьдесят тысяч долларов!');
      await coal;
      const choice = await g.choose('henrietta', {
        'fogg#head': [{ id: 'burn', label: 'Купить и жечь' }],
        'speedy#head': [{ id: 'sails', label: 'Идти под парусами' }],
      });
      if (choice === 'burn') {
        await g.say('fogg', 'Мне нужно только то, что горит');
      } else {
        g.hours(-16, 'Под парусами');
        g.mark('speedy', true);
        const laugh = g.told('sails_only:laugh');
        g.set('sails', 1, 4);
        const sails = g.beat('sails_only');
        await laugh;
        await g.say('speedy', 'Вот это джентльмен! Ха-ха-ха!');
        await sails;
      }
    },
    // the boilers: the ship burnt part by part — Passepartout's hands, or Fogg's if Passepartout stayed behind
    async g => {
      if (g.state.choices.henrietta === 'sails') return;
      const f = facts(g.state);
      g.hero(f.pp === 'with' ? 'pp' : 'fogg');
      g.beds({ sea: 0.4, furnace: 0.7 }, 2);
      await g.scene(SCENES.deck, { beat: 'burn', ship: 'henrietta', port: 'none' });
      g.hours(-12, 'Угля нет');
      if (f.pp !== 'with') await g.say('fogg', 'Сюртук мне сейчас ни к чему');
      const afford = Math.max(0, Math.floor(g.state.money / PART_PRICE));
      const r = await g.play(kotly, { who: f.pp === 'with' ? 'pp' : 'fogg' });
      // (skipped, it burns all seven but the cabin: no more than the bag can pay)
      const burned = (r?.burned ?? []).slice(0, afford);
      g.money(-PART_PRICE * burned.length);
      g.hours(PART_HOURS * burned.length, 'Сожжено: ' + burned.length);
      g.beds({ sea: 0.4, furnace: 0.2 }, 3);
      await g.beat('queenstown');
    },
    // Liverpool: the arrest; the cell; the release — ~ strike or the hand
    async g => {
      g.hero('fogg');
      g.beds({ town: 0.4, sea: 0.3 }, 2);
      const hand = g.told('liverpool:hand');
      await g.scene(SCENES.deck, { beat: 'liverpool', ship: 'henrietta', port: 'liverpool' });
      const lp = g.beat('liverpool');
      await hand;
      await g.say('fix', 'Филеас Фогг, именем королевы — вы арестованы');
      await lp;
      g.beds({ clock: 0.9 }, 2);
      const quick = (g.state.marks.fix ?? 0) >= 2;
      await g.beat('cell', { wait: false });
      await g.move('cell_time', 1, quick ? 8 : 14);
      g.hours(quick ? -1 : -3, 'Таможня, камера');
      g.beds({ clock: 0.4, town: 0.3 }, 2);
      const choice = await g.choose('liverpool', {
        'fix#head': [{ id: 'hit', label: 'Ударить' }, { id: 'hand', label: 'Протянуть руку' }],
      });
      g.set('release', choice === 'hit' ? 'down' : 'hand');
      const inside = g.told('release:in');
      const release = g.beat('release');
      await inside;
      await g.say('fix', 'Сэр… вор пойман три дня назад. Простите');
      if (choice === 'hit') {
        g.sound.slap();
        g.mark('hit', true, 'Фикс это запомнит');
      } else {
        g.relate('fix', 1);
      }
      await release;
    },
    // the special train to London, watch in hand
    async g => {
      g.hero('fogg');
      g.beds({ wheels: 0.8, clock: 0.6 }, 2);
      const watch = g.told('special:watch');
      await g.scene(SCENES.train, { beat: 'special', land: 'england' });
      const special = g.beat('special');
      await watch;
      await special;
      const h = g.state.hours;
      if (h >= 0) await g.say('fogg', 'Лондон. Вовремя');
      else {
        const late = Math.ceil(-h);
        await g.say('fogg', `Опоздал на ${late} ${late % 10 === 1 && late % 100 !== 11 ? 'час' : late % 10 >= 2 && late % 10 <= 4 && (late % 100 < 10 || late % 100 >= 20) ? 'часа' : 'часов'}`);
        g.set('book_shut', 1, 1.5);
        await g.told('special:shut', 4000);
        await g.say('fogg', 'Двадцать тысяч — всё, что у меня было');
      }
    },
  ],
};
