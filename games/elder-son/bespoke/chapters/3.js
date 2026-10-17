// III. The March (game.md §6). Nina takes him out past the settlement: their father plays the dead march in a funeral band —
// dismissed from the orchestra, and the children pretend not to know; ~ go up to him (Arm in Arm) or slip away after him
// (Following); at the level crossing, under the goods train — ⚑ the truth, the truth no one hears, or «brother».
// Reads: nothing. Leaves: choices.father, .crossing; marks.nina; scales home, lie.
import { SCENES } from '../story.js';
import armInArm from '../minigames/arm-in-arm.js';
import following from '../minigames/following.js';

// a sound of the game's on a moment of the scene's (not waited for)
const on = (g, moment, fn) => { g.told(moment).then(ok => { if (ok) fn(); }); };

export default {
  number: 'III', title: tr('The March'),
  titles: ['Father', 'The Crossing'],
  choices: [
    { id: 'father', weight: '~', title: tr('Father on the hillside'), options: [{ id: 'approach', label: tr('Go up to him') }, { id: 'hide', label: tr('Leave unseen') }] },
    { id: 'crossing', weight: '⚑', title: tr('The Crossing'), options: [{ id: 'truth', label: tr('Tell the truth') }, { id: 'roar', label: tr('Say it under the roar') }, { id: 'brother', label: tr('“Brother”') }] },
  ],
  steps: [
    // the funeral band on the hillside, and their father in it
    async g => {
      g.beds({ wind: 0.3 });
      let m = null; // the march's handle: stopped at its end, at the step's end, on the step left
      g.signal.addEventListener('abort', () => m?.stop(0));
      await g.scene(SCENES.hill, { beat: 'road' });
      const road = g.beat('road');
      await g.say('narrator', 'In the evening Nina took him out past the settlement');
      await g.say('nina', 'Come on. I\'ll show you what Philharmonic our father plays in');
      await road;
      on(g, 'march:end', () => m?.stop(3));
      const march = g.beat('march');
      m = g.sound.march();
      await g.wait(3000);
      await g.say('nina', 'They fired him from the orchestra. Two years ago. He thinks we don\'t know');
      await g.say('busygin', 'But you do');
      await g.say('nina', 'We pretend. It\'s easier for him that way');
      await march;
      await g.beat('alone');
      const father = await g.choose('father', {
        sarafanov: [{ id: 'approach', label: tr('Go up to him') }],
        nina: [{ id: 'hide', label: tr('Leave unseen') }],
      });
      g.apply('father');
      if (father === 'approach') {
        const talk = g.told('meet:talk');
        const meet = g.beat('meet');
        await talk;
        await g.say('sarafanov', 'Well, there. Now you know too');
        await g.say('sarafanov', 'Just not a word to Nina and Vasya');
        await g.say('busygin', 'Not a word');
        await meet;
        g.set('beat_next', 'bottom');
        const r = await g.play(armInArm);
        g.set('down', 1);
        g.set('catch', 0);
        g.set('fall', 0);
        g.set('snowy', r.falls > 0 ? 1 : 0);
        g.set('beat_next', 'bottom'); // (made ready again, by the keys of how it went)
        const bottom = g.beat('bottom');
        await g.say('sarafanov', 'Off you go, then. I\'ve still got the club — playing for the dance');
        await bottom;
      } else {
        await g.beat('hide');
        g.set('beat_next', 'club');
        const r = await g.play(following);
        g.set('seen', r.seen > 0 ? 1 : 0); // (the rest the beat `club` sets by its `from`)
        g.set('beat_next', 'club'); // (made ready again, by the keys of how it went)
        const inside = g.told('club:in');
        const club = g.beat('club');
        await inside;
        g.sound.dance(3);
        await g.say('nina', 'Now you\'re pretending too');
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
      await g.say('nina', 'I\'m marrying Misha. He\'s a good man. He never lies');
      await g.say('nina', 'You\'re not really my brother, are you?');
      await wait;
      const said = await g.choose('crossing', {
        nina: [{ id: 'truth', label: tr('Tell the truth') }],
        'freight#light': [{ id: 'roar', label: tr('Say it under the roar') }],
        barrier: [{ id: 'brother', label: tr('Answer: “Brother”') }],
      });
      g.apply('crossing');
      const roar = () => g.beds({ crossing: 0.6, freight: 1 }, 4);
      const quiet = () => g.beds({ wind: 0.3 }, 3);
      if (said === 'truth') {
        const spoken = g.told('truth:said'), passed = g.told('truth:passed');
        const truth = g.beat('truth');
        await spoken;
        await g.say('busygin', 'No, I\'m not. We missed the train last night. That\'s all');
        roar();
        await passed;
        quiet();
        await g.say('nina', 'Don\'t tell Father. Not yet');
        await truth;
      } else if (said === 'roar') {
        const loud = g.told('roar:loud');
        on(g, 'roar:passed', quiet);
        const beat = g.beat('roar');
        roar();
        await loud;
        await g.say('busygin', 'I\'m not your brother, Nina…'); // (all but unheard under the train: so it is meant)
        await g.say('nina', 'What?');
        await g.say('busygin', 'Your brother, I said');
        await beat;
      } else {
        const passed = g.told('brother:passed');
        on(g, 'brother:arm', roar);
        const brother = g.beat('brother');
        await g.say('busygin', 'Brother');
        await passed;
        quiet();
        await g.say('nina', 'Well then — brother');
        await brother;
      }
    },
  ],
};
