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
      await SAY(42);
      await out;
      await SAY(43, 'gurov');
      await snow;
      const walk = g.beat('evening_walk');
      g.next('table_window');
      await walk;
      let first = false;
      const count = facts(g.state).heart === 'frank' ? 4 : 2;
      const r = await g.play(ten, { count, onFirst: () => (first = true, SAY(44)) });
      g.set('walk_on', count);
      g.set('gurov_look', null);
      for (const shade of ['shade1', 'shade2', 'shade3', 'shade4']) g.set(shade, 0);
      g.set('look_back', r.touched.length === count ? 1 : 0);
      if (!first) await SAY(44);
      const lit = g.told('table_window:lit');
      const window = g.beat('table_window');
      await lit;
      await SAY(45);
      await SAY(46, 'window_up');
      await window;
    },
    // Поводок: глазами Анны — поздняя осень в С., забор, шпиц тянет к дороге на станцию; муж с пальто
    async g => {
      g.hero('anna');
      g.beds({ wind: 0.5 });
      await g.scene(SCENES.town, { beat: 'autumn_walk' });
      const walk = g.beat('autumn_walk');
      await SAY(47);
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
      await SAY(48);
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
      await SAY(49);
      await out;
      await SAY(50);
      await club;
      const turns = g.told('say:turns');
      const sturgeon = g.beat('say');
      await turns;
      await SAY(51);
      await SAY(52);
      await SAY(53);
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
        await SAY(54, 'gurov');
        await walk;
      }
      await SAY(55);
      g.sound.sleigh();
    },
    // Отъезд: декабрь, до рассвета; жена в дверях
    async g => {
      g.hero('gurov');
      g.beds({ snow: 0.3 });
      const turns = g.told('porch_go:turns');
      await g.scene(SCENES.moscow, { beat: 'porch_go' });
      const porch = g.beat('porch_go');
      await SAY(56);
      await turns;
      await SAY(57);
      await SAY(58, 'wife');
      await porch;
    },
  ],
};
