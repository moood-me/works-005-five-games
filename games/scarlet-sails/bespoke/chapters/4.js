// IV. The Eve — the night before: the scarlet silk found in Liss («Scarlet») and the violinist; Longren sails
// (if he went); ~ the girl and the yacht; the silk sewn on deck; Assol waits for lights that pass («Waiting»); the
// rail before the dawn. design.md, game.md §6.
// Reads: facts.longren (choices.way, longren). Leaves: choices.girl; marks.girl; scales.tale ±1 (the girl).
import { SCENES, facts } from '../story.js';
import scarlet from '../minigames/scarlet.js';
import wait from '../minigames/wait.js';

export default {
  number: 'IV',
  title: tr('The Eve'),
  titles: ['Scarlet', 'The farewell', 'The girl', 'Silk', 'Waiting', 'At the rail'],
  choices: [
    { id: 'girl', weight: '~', title: tr('The girl and the yacht'), options: [{ id: 'give', label: tr('Give it') }, { id: 'keep', label: tr('Keep it') }] },
  ],
  steps: [
    // the scarlet: the shop's rolls one by one, the right one found, the glow, the violinist outside
    async g => {
      g.hero('grey');
      g.beds({});
      await g.scene(SCENES.shop, { beat: 'silk_in' });
      await g.beat('silk_in');
      const memory = g.beat('memory');
      g.sound.motif();
      await memory;
      await g.beat('silk');
      await g.play(scarlet, {
        no: () => g.say('grey', 'Not that one'),
        yes: () => g.say('grey', 'This one. All of it'),
        last: () => g.say('merchant', 'This one, perhaps'),
      });
      g.set('memory', 0);
      g.set('roll', 'scarlet');
      g.set('roll_out', 1, 1);
      const glow = g.told('found:glow');
      const found = g.beat('found');
      await glow;
      g.sound.motif();
      await g.say('merchant', 'There are two thousand metres of it here');
      await found;
      const heard = g.told('violin:heard');
      const letika = g.told('violin:letika');
      const violin = g.beat('violin');
      await heard;
      let v = g.sound.violin();
      const stop = () => { v?.stop(2); v = null; };
      g.signal.addEventListener('abort', stop, { once: true });
      await letika;
      await g.say('grey', 'Find that violinist. And everyone he knows');
      await violin;
      stop();
    },
    // the farewell: Longren sails, if he went
    async g => {
      if (facts(g.state).longren !== 'sea') return;
      g.hero('assol');
      g.beds({ sea: 0.5 });
      const wave = g.told('longren_goes:wave');
      await g.scene(SCENES.shore, { beat: 'longren_goes' });
      const goes = g.beat('longren_goes');
      await wave;
      await g.say('longren', 'Don\'t pine, Assol. I\'ll be back soon');
      await goes;
    },
    // the girl: she sees the yacht — ~ give it, or keep it
    async g => {
      g.hero('assol');
      g.beds({ sea: 0.5 });
      const came = g.told('girl:came');
      await g.scene(SCENES.shore, { beat: 'girl' });
      const girl = g.beat('girl');
      await came;
      await g.say('girl', 'Is it yours? With red sails…');
      await girl;
      const gave = await g.choose('girl', {
        girl: [{ id: 'give', label: tr('Give it') }],
        'assol#yacht': [{ id: 'keep', label: tr('Keep it') }],
      });
      if (gave === 'give') {
        await g.say('assol', 'Take it. It can sail');
        await g.beat('give');
        g.scale('tale', -1);
        g.mark('girl', true, tr('The girl will remember this.'));
      } else {
        await g.say('assol', 'I still need it');
        await g.beat('keep');
        g.scale('tale', 1);
      }
    },
    // the silk: sewn on deck by night, the musicians tuning; Panten asks, Gray answers
    async g => {
      g.hero('grey');
      g.beds({ sea: 0.3 });
      const panten = g.told('sew:panten');
      await g.scene(SCENES.deck, { beat: 'sew' });
      const sew = g.beat('sew');
      g.sound.silk();
      g.sound.tuning();
      await panten;
      await g.say('panten', 'Captain… this is contraband, isn\'t it?');
      await g.say('grey', 'I have learned one simple truth. It is to make so-called miracles with one\'s own hands');
      await sew;
    },
    // waiting: the lights that come and go; the windows go dark one by one
    async g => {
      g.hero('assol');
      g.beds({ sea: 0.6 });
      await g.scene(SCENES.shore, { beat: 'wait' });
      await g.beat('wait');
      await g.play(wait);
      // a light that came near goes on behind the cape; one never looked into — or left on its way in — is gone at once,
      // from afar (its way to 2 lies through 1 — near: moved, it would come up to the shore first)
      for (const key of ['light1', 'light2', 'light3']) {
        if (g.get(key) >= 1) g.set(key, 2, 3);
        else g.set(key, 2);
      }
      g.set('windows', 0.1, 3);
      const light = g.told('grey_dawn:light');
      const dawn = g.beat('grey_dawn');
      await light;
      await g.say('narrator', 'The lights went away behind the cape');
      await dawn;
    },
    // the rail: Gray at the deck's rail, before the dawn — without words
    async g => {
      g.hero('grey');
      g.beds({ sea: 0.5 });
      await g.scene(SCENES.deck, { beat: 'rail' });
      const rail = g.beat('rail');
      g.sound.rigging();
      await rail;
    },
  ],
};
