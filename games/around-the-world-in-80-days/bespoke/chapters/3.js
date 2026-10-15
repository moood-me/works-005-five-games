// III. Америка «в которой поезд останавливают руками» — game.md §3. The buffalo; the bridge at Medicine Bow (~ bridge:
// full speed or Passepartout's way); the Sioux, the coupling («Сцепка»), the cars stop at Fort Kearney without
// Passepartout; ⚑ fort: Fogg goes himself or pays the soldiers; the sledge under sail («Парус») — everyone, or
// Passepartout alone after the train; the snow.
// Reads: choices aouda, boat; hands stsepka, parus. Leaves: choices bridge, fort; hours, money; marks aouda, pp.
import { SCENES } from '../story.js';
import stsepka from '../minigames/stsepka.js';
import parus from '../minigames/parus.js';

export default {
  number: 'III',
  title: 'Америка',
  heading: 'в которой поезд останавливают руками',
  route: [0.55, 0.78],
  titles: ['Бизоны', 'Мост', 'Сиу', 'Форт Керни', 'Парус', 'Снег'],
  choices: [
    { id: 'bridge', weight: '~', title: 'Мост Медисин-Боу', options: [{ id: 'run', label: 'На полном ходу' }, { id: 'walk', label: 'Как предлагает Паспарту' }] },
    { id: 'fort', weight: '⚑', title: 'Форт Керни', options: [{ id: 'go', label: 'Пойти самому' }, { id: 'pay', label: 'Заплатить солдатам' }] },
  ],
  steps: [
    // the buffalo cross the line: three hours
    async g => {
      g.hero('pp');
      g.beds({ wheels: 0.2, wind_cold: 0.3, clock: 0.3 }, 2);
      const glass = g.told('buffalo:at-glass');
      await g.scene(SCENES.train, { beat: 'buffalo', land: 'prairie' });
      const buffalo = g.beat('buffalo');
      await glass;
      await g.say('pp', 'Да подвиньтесь же вы!');
      await buffalo;
      await g.say('fogg', 'Три часа');
      g.hours(-3, 'Бизоны');
    },
    // the bridge at Medicine Bow: ~ full speed or on foot
    async g => {
      g.hero('pp');
      g.beds({ wind_cold: 0.5 }, 2);
      const argue = g.told('bridge_stop:argue');
      await g.scene(SCENES.prairie, { beat: 'bridge_stop' });
      const stop = g.beat('bridge_stop');
      await argue;
      await g.say('driver', 'Проскочим на полном ходу! Мост и не заметит');
      await g.say('pp', 'А не разумнее ли сначала пройти пешком, а поезд — потом?');
      await stop;
      const bridge = await g.choose('bridge', {
        'driver#head': [{ id: 'run', label: 'На полном ходу' }],
        'passepartout#head': [{ id: 'walk', label: 'Как предлагает Паспарту' }],
      });
      if (bridge === 'run') {
        const down = g.told('bridge_run:down');
        const run = g.beat('bridge_run');
        await down;
        g.sound.crack();
        g.sound.splash();
        await run;
      } else {
        g.hours(-2, 'Пешком через мост');
        g.relate('pp', 1);
        const over = g.told('bridge_walk:over');
        const walk = g.beat('bridge_walk');
        await over;
        g.sound.creak();
        await walk;
      }
    },
    // the Sioux; the coupling under the cars; the cars stop by the fort — without Passepartout
    async g => {
      g.hero('pp');
      g.beds({ wind_cold: 0.4, wheels: 0.6 }, 1);
      const driver = g.told('attack:driver');
      await g.scene(SCENES.prairie, { beat: 'attack' });
      const attack = g.beat('attack');
      g.sound.shots();
      await driver;
      g.sound.shots();
      await g.say('pp', 'Машинист ранен! Форт! Надо остановить у форта!');
      await attack;
      await g.beat('under', { wait: false });
      const r = await g.play(stsepka);
      if (r?.hours) g.hours(r.hours, 'Вагоны встали за фортом');
      g.set('stop_at', Math.min(1, -(r?.hours ?? 0) / 2));
      g.beds({ wind_cold: 0.4 }, 3);
      const still = g.told('stop:still');
      const stop = g.beat('stop');
      await still;
      await stop;
    },
    // Fort Kearney: Passepartout and two passengers taken — ⚑ go himself or pay
    async g => {
      g.hero('fogg');
      g.beds({ wind_cold: 0.5, clock: 0.3 }, 2);
      const captain = g.told('fort:captain');
      await g.scene(SCENES.prairie, { beat: 'fort' }, { cut: true });
      const fort = g.beat('fort');
      await captain;
      await g.say('captain', 'Я не могу рисковать фортом ради троих');
      await fort;
      const choice = await g.choose('fort', {
        'fogg#head': [{ id: 'go', label: 'Тогда я пойду один' }],
        'captain#head': [{ id: 'pay', label: 'Пять тысяч фунтов вашим людям' }],
      });
      if (choice === 'go') {
        await g.say('fogg', 'Тогда я пойду один');
        g.hours(-20, 'Ночь в снегу');
        await g.say('captain', 'Тридцать добровольцев! Вы пойдёте не один, сэр');
        const gone = g.told('column:gone');
        const column = g.beat('column');
        await gone;
        await column;
        g.beds({ wind_cold: 0.7, clock: 0.4 }, 3);
        const snow = g.told('night_wait:snow');
        await g.scene(SCENES.prairie, { beat: 'night_wait' });
        const wait = g.beat('night_wait');
        await snow;
        await g.wait(2500);
        await wait;
        g.set('fogg_went', 1);
        const pp = g.told('return:pp');
        const ret = g.beat('return');
        await pp;
        await g.say('pp', 'Хозяин! Вы пришли за мной!');
        await ret;
        g.relate('pp', 2);
        if (g.state.choices.aouda !== 'holland') g.relate('aouda', 1);
        g.set('fogg_on_train', 0);
        const leaves = g.beat('train_leaves');
        await g.say('fix', 'Поезд ушёл');
        await leaves;
      } else {
        await g.say('fogg', 'Пять тысяч фунтов вашим людям — если вернут его живым');
        g.money(-5000);
        g.sound.notes();
        g.hours(-1, 'Солдаты ушли без него');
        g.mark('paid', true, 'Паспарту это запомнит');
        g.set('fogg_on_train', 1);
        const gone = g.told('train_leaves:gone');
        const leaves = g.beat('train_leaves');
        await gone;
        await leaves;
      }
    },
    // the sledge under sail: everyone after the train — or Passepartout alone
    async g => {
      const alone = g.state.choices.fort === 'pay';
      g.hero(alone ? 'pp' : 'fogg');
      g.beds({ wind_cold: 0.6 }, 2);
      const sail = g.told('sledge:sail');
      const st = alone
        ? { beat: 'sledge', sl_fogg: 0, sl_aouda: 0, sl_pp: 1, sl_fix: 0 }
        : { beat: 'sledge', sl_fogg: 1, sl_aouda: g.state.choices.aouda === 'holland' ? 0 : 1, sl_pp: 1, sl_fix: 1 };
      await g.scene(SCENES.prairie, st);
      const sledge = g.beat('sledge');
      if (alone) await g.say('pp', 'Мсье Мадж, до Омахи! Мой хозяин в том поезде!');
      else {
        await g.say('fix', 'Есть сани. Под парусом. До Омахи — к утру');
        g.money(-200);
      }
      await sail;
      await g.say('mudge', 'Держитесь, ветер попутный!');
      await sledge;
      g.beds({ runners: 0.7, wind_cold: 0.7 }, 2);
      await g.beat('sail', { wait: false });
      const r = await g.play(parus, { alone });
      g.beds({ runners: 0, wind_cold: 0.4 }, 3);
      if (!alone) g.hours(r?.hours ?? 16, 'Сани под парусом');
      const caught = alone ? r?.caught !== false : true;
      g.set('omaha_train', caught ? 1 : 0);
      const hand = g.told('omaha:hand');
      const omaha = g.beat('omaha');
      if (alone && caught) {
        await hand;
        await g.say('pp', 'Хозяин! По Лондону — минута в минуту!');
      }
      await omaha;
      if (alone && !caught) await g.say('pp', 'Я догоню вас, мсье. Где-нибудь');
    },
    // the snow from the window: on to New York
    async g => {
      g.hero('both');
      g.beds({ wheels: 0.5, clock: 0.15 }, 2);
      await g.scene(SCENES.train, { beat: 'snow', land: 'snow' });
      await g.beat('snow');
    },
  ],
};
