// Глава III «Зима» — Москва и С. Первый снег; она идёт за ним всюду, как тень (две фигуры или четыре — по его
// манере); окно, где жена смеётся над «ролью фата». Поводок: глазами Анны, поздняя осень в С. — держать шпица или
// отпустить к дороге на станцию. Клуб: «осетрина-то с душком» — засмеяться и сесть в сани или уйти пешком. Отъезд в
// С. под предлогом Петербурга. game.md §6 «Глава III».
// Читает: facts.heart («Тень»: сколько фигур), facts.life («Поводок»: как сильно тянет шпиц). Оставляет: choices.club.
import { SCENES, facts } from '../story.js';
import ten from '../minigames/ten.js';
import povodok from '../minigames/povodok.js';

export default {
  number: 'III',
  title: 'Зима',
  season: () => 'winter',
  titles: ['Первый снег', 'Поводок', 'Клуб', 'Отъезд'],
  choices: [
    { id: 'club', weight: '~', title: 'После осетрины', options: [{ id: 'laugh', label: 'Засмеяться и сесть в сани' }, { id: 'walk', label: 'Уйти пешком' }] },
  ],
  steps: [
    // Первый снег: утро, сани; вечерняя улица и тени; окно наверху, её голос
    async g => {
      g.hero('gurov');
      g.beds({ snow: 0.4 });
      const out = g.told('first_snow:out');
      await g.scene(SCENES.moscow, { beat: 'first_snow' });
      const snow = g.beat('first_snow');
      g.next('evening_walk');
      g.sound.sleigh();
      await g.say('narrator', 'В Москве уже всё было по-зимнему. Выпал первый снег, и поехали сани');
      await out;
      await g.say('gurov_inner', 'Пройдёт какой-нибудь месяц — и всё это покроется в памяти туманом', 'gurov');
      await snow;
      const walk = g.beat('evening_walk');
      g.next('table_window');
      await walk;
      let first = false;
      const count = facts(g.state).heart === 'frank' ? 4 : 2;
      const r = await g.play(ten, { count, onFirst: () => (first = true, g.say('narrator', 'Прошло больше месяца. Она не снилась ему, а шла за ним всюду, как тень')) });
      g.set('walk_on', count);
      g.set('gurov_look', null);
      for (const shade of ['shade1', 'shade2', 'shade3', 'shade4']) g.set(shade, 0);
      g.set('look_back', r.touched.length === count ? 1 : 0);
      if (!first) await g.say('narrator', 'Прошло больше месяца. Она не снилась ему, а шла за ним всюду, как тень');
      const lit = g.told('table_window:lit');
      const window = g.beat('table_window');
      await lit;
      await g.say('narrator', 'Иногда за обедом он вдруг начинал говорить о любви, о женщинах');
      await g.say('wife', 'Тебе, Димитрий, совсем не идёт роль фата', 'window_up');
      await window;
    },
    // Поводок: глазами Анны — поздняя осень в С., забор, шпиц тянет к дороге на станцию; муж с пальто
    async g => {
      g.hero('anna');
      g.beds({ wind: 0.5 });
      await g.scene(SCENES.town, { beat: 'autumn_walk' });
      const walk = g.beat('autumn_walk');
      await g.say('narrator', 'А в С. стояла поздняя осень. Каждый вечер Анна Сергеевна гуляла со шпицем вдоль забора');
      await walk;
      const r = await g.play(povodok, { pull: facts(g.state).life === 'life' ? 0.09 : 0.06 });
      // (the beat after the game is the result's: named as soon as it is known)
      const road = r.end === 'road';
      g.next(road ? 'road_end' : 'gate_home');
      g.set('anna_to', road ? 1 : 0);
      if (road) {
        const train = g.told('road_end:train');
        const end = g.beat('road_end');
        g.next('gate_home');
        if (await train) g.sound.whistle(0.3);
        await end;
      }
      const coat = g.told('gate_home:coat');
      const home = g.beat('gate_home');
      await coat;
      await g.say('diderits', 'Анна, простудишься. Пойдём в дом');
      await home;
    },
    // Клуб: ночь, «осетрина-то с душком»; засмеяться и сесть в сани — или уйти пешком
    async g => {
      g.hero('gurov');
      g.beds({ snow: 0.3 });
      const out = g.told('club:out');
      await g.scene(SCENES.moscow, { beat: 'club' });
      const club = g.beat('club');
      g.next('say');
      await g.say('narrator', 'Однажды ночью он выходил из докторского клуба со своим партнёром, чиновником');
      await out;
      await g.say('gurov', 'Если б вы знали, с какой очаровательной женщиной я познакомился в Ялте!');
      await club;
      const turns = g.told('say:turns');
      const sturgeon = g.beat('say');
      await turns;
      await g.say('official', 'Дмитрий Дмитрич!');
      await g.say('gurov', 'Что?');
      await g.say('official', 'А давеча вы были правы: осетрина-то с душком!');
      await sturgeon;
      const how = await g.choose('club', { sledge: [{ id: 'laugh', label: 'Засмеяться и сесть в сани' }], lamp2: [{ id: 'walk', label: 'Уйти пешком' }] });
      if (how === 'laugh') {
        g.scale('heart', -2);
        g.next('laugh_sit');
        await g.beat('laugh_sit');
      } else {
        g.scale('heart', 2);
        g.next('say_walk');
        const off = g.told('say_walk:off');
        const walk = g.beat('say_walk');
        await off;
        await g.say('gurov_inner', 'Какие дикие нравы, какие лица! Что за бестолковые ночи…', 'gurov');
        await walk;
      }
      await g.say('narrator', 'Он не спал всю ночь');
      g.sound.sleigh();
    },
    // Отъезд: декабрь, до рассвета; жена в дверях
    async g => {
      g.hero('gurov');
      g.beds({ snow: 0.3 });
      const turns = g.told('porch_go:turns');
      await g.scene(SCENES.moscow, { beat: 'porch_go' });
      const porch = g.beat('porch_go');
      await g.say('narrator', 'В декабре, на праздниках, он собрался в дорогу');
      await turns;
      await g.say('gurov', 'Еду в Петербург хлопотать за одного молодого человека');
      await g.say('wife', 'Поезжай, Димитрий. К Новому году вернись', 'wife');
      await porch;
    },
  ],
};
