// III. America «in which a train is stopped by hand» — game.md §3. The buffalo; the bridge at Medicine Bow (~ bridge:
// full speed or Passepartout's way); the Sioux, the coupling («The coupling»), the cars stop at Fort Kearney without
// Passepartout; ⚑ fort: Fogg goes himself or pays the soldiers; the sledge under sail («The sail») — everyone, or
// Passepartout alone after the train; the snow.
// Reads: choices aouda, boat; hands coupling, sail. Leaves: choices bridge, fort; hours, money; marks aouda, pp.
import { SCENES } from '../story.js';
import coupling from '../minigames/coupling.js';
import sail from '../minigames/sail.js';

export default {
  number: 'III',
  title: tr('America'),
  heading: tr('in which a train is stopped by hand'),
  route: [0.55, 0.78],
  titles: ['The buffalo', 'The bridge', 'The Sioux', 'Fort Kearney', 'The sail', 'The snow'],
  choices: [
    { id: 'bridge', weight: '~', title: tr('The bridge at Medicine Bow'), options: [{ id: 'run', label: tr('At full speed') }, { id: 'walk', label: tr('As Passepartout proposes') }] },
    { id: 'fort', weight: '⚑', title: tr('Fort Kearney'), options: [{ id: 'go', label: tr('Go in person') }, { id: 'pay', label: tr('Pay the soldiers') }] },
  ],
  steps: [
    // the buffalo cross the line: three hours
    async g => {
      g.hero('pp');
      g.beds({ wheels: 0.2, wind_cold: 0.3, clock: 0.3 }, 2);
      const glass = g.told('buffalo:at-glass'), watch = g.told('buffalo:watch');
      await g.scene(SCENES.train, { beat: 'buffalo', land: 'prairie' });
      const buffalo = g.beat('buffalo');
      await glass;
      await g.say('passepartout', 'Out of the way, will you!');
      await watch;
      await g.say('fogg', 'Three hours');
      g.hours(-3, tr('The buffalo'));
      await buffalo;
    },
    // the bridge at Medicine Bow: ~ full speed or on foot
    async g => {
      g.hero('pp');
      g.beds({ wind_cold: 0.5 }, 2);
      const argue = g.told('bridge_stop:argue');
      await g.scene(SCENES.prairie, { beat: 'bridge_stop' });
      const stop = g.beat('bridge_stop');
      await argue;
      await g.say('driver', 'We\'ll cross at full speed! The bridge won\'t even notice');
      await g.say('passepartout', 'Would it not be more prudent to walk across first, and let the train come after?');
      await stop;
      const bridge = await g.choose('bridge', {
        'driver#head': [{ id: 'run', label: tr('At full speed') }],
        'passepartout#head': [{ id: 'walk', label: tr('As Passepartout proposes') }],
      });
      g.set('beat_next', bridge === 'run' ? 'bridge_run' : 'bridge_walk');
      if (bridge === 'run') {
        const down = g.told('bridge_run:down');
        const run = g.beat('bridge_run');
        await down;
        g.sound.crack();
        g.sound.splash();
        await run;
      } else {
        g.hours(-2, tr('On foot across the bridge'));
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
      await g.say('passepartout', 'The engineer is shot! The fort! We must stop at the fort!');
      await attack;
      await g.beat('under', { wait: false });
      const r = await g.play(coupling);
      if (r?.hours) g.hours(r.hours, tr('The cars stopped past the fort'));
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
      await g.say('captain', 'I cannot risk the fort for three men');
      await fort;
      const choice = await g.choose('fort', {
        'fogg#head': [{ id: 'go', label: tr('Go in person') }],
        'captain#head': [{ id: 'pay', label: tr('Pay the soldiers') }],
      });
      g.set('beat_next', choice === 'go' ? 'column' : 'train_leaves');
      if (choice === 'go') {
        await g.say('fogg', 'Then I will go alone');
        g.hours(-20, tr('A night in the snow'));
        await g.say('captain', 'Thirty volunteers! You shall not go alone, sir');
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
        await g.say('passepartout', 'Master! You came for me!');
        await ret;
        g.relate('pp', 2);
        if (g.state.choices.aouda !== 'holland') g.relate('aouda', 1);
        g.set('fogg_on_train', 0);
        const leaves = g.beat('train_leaves');
        await g.say('fix', 'The train has gone');
        await leaves;
      } else {
        await g.say('fogg', 'Five thousand pounds to your men — if they bring him back alive');
        g.money(-5000);
        g.sound.notes();
        g.hours(-1, tr('The soldiers went without him'));
        g.mark('paid', true, tr('Passepartout will remember this'));
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
      const hoisted = g.told('sledge:sail');
      const st = alone
        ? { beat: 'sledge', sl_fogg: 0, sl_aouda: 0, sl_pp: 1, sl_fix: 0 }
        : { beat: 'sledge', sl_fogg: 1, sl_aouda: g.state.choices.aouda === 'holland' ? 0 : 1, sl_pp: 1, sl_fix: 1 };
      await g.scene(SCENES.prairie, st);
      const sledge = g.beat('sledge');
      if (alone) await g.say('passepartout', 'Monsieur Mudge, to Omaha! My master is on that train!');
      else {
        await g.say('fix', 'There is a sledge. Under sail. Omaha by morning');
        g.money(-200);
      }
      await hoisted;
      await g.say('mudge', 'Hold on, the wind\'s behind us!');
      await sledge;
      g.beds({ runners: 0.7, wind_cold: 0.7 }, 2);
      await g.beat('sail', { wait: false });
      const r = await g.play(sail, { alone });
      g.beds({ runners: 0, wind_cold: 0.4 }, 3);
      if (!alone) g.hours(r?.hours ?? 16, tr('The sledge under sail'));
      const caught = alone ? r?.caught !== false : true;
      g.set('omaha_train', caught ? 1 : 0);
      const hand = g.told('omaha:hand');
      const omaha = g.beat('omaha');
      if (alone && caught) {
        await hand;
        await g.say('passepartout', 'Master! By London time — to the minute!');
      }
      await omaha;
      if (alone && !caught) await g.say('passepartout', 'I\'ll catch you up, monsieur. Somewhere');
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
