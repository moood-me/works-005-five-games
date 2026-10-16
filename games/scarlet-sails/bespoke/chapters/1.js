// I. The Little Ship — Longren's workshop: Assol (8) takes the scarlet scrap and rigs the toy ship with her father; the
// shop that no longer takes toys; the ship let go on the stream; Egle, who tells her the tale (~ what she asks);
// the tale told at home; the children at the boats (⚑ she stands by it or says she made it up).
// Reads: nothing of the play. Leaves: choices.egl_ask, choices.kids; scales.tale (I.6), the tale's gauge shown.
import rigging from '../minigames/rigging.js';
import chase from '../minigames/chase.js';
import { SCENES } from '../story.js';

export default {
  number: 'I',
  title: tr('The Little Ship'),
  wall: false,
  titles: ['Rigging', 'The shop', 'After the little ship', 'Egle', 'At home', 'The children'],
  choices: [
    { id: 'egl_ask', weight: '~', title: tr('What to ask Egle'), options: [{ id: 'when', label: tr('“When?”') }, { id: 'how', label: tr('“How will I know him?”') }] },
    { id: 'kids', weight: '⚑', title: tr('The children by the boats'), options: [{ id: 'true', label: tr('“I\'m not lying”') }, { id: 'made_up', label: tr('“I made it up”') }] },
  ],
  steps: [
    // the workshop: the scrap, the rigging with her father, the glow of the sail
    async g => {
      g.hero('assol');
      g.beds({ sea: 0.2 });
      await g.scene(SCENES.home, { beat: 'evening' }, { cut: true });
      g.sound.knife();
      await g.beat('evening');
      await g.say('longren', 'A scrap is left. Scarlet silk. They line the cabins of rich steamers with it');
      await g.beat('scrap');
      await g.choose(null, { 'scrap#scrap': [{ id: 'take', label: tr('Take the scrap') }] });
      g.sound.silk();
      await g.move('scrap_taken', 1, 0.6);
      await g.wait(500); // held, seen
      await g.beat('rig');
      await g.play(rigging, { onGuide: () => g.say('longren', 'Hold the mast. Tighter', 'narrator') });
      for (const key of ['rig1', 'rig2', 'rig3', 'rig4']) g.set(key, 1);
      g.set('guide', 0);
      const up = g.told('glow:up');
      const glow = g.beat('glow');
      await up;
      g.sound.motif();
      await glow;
      await g.beat('glow_close');
      g.gauge('tale', { rule: false });
    },
    // the shop in Liss no longer takes toys
    async g => {
      g.hero('assol');
      g.beds({});
      const no = g.told('toys_in:no');
      await g.scene(SCENES.shop, { beat: 'toys_in' });
      const toys = g.beat('toys_in');
      await no;
      await g.say('merchant', 'We don\'t take them any more. Foreign toys are the fashion now');
      await toys;
    },
    // the stream: the toy ship afloat, and the run after it
    async g => {
      g.hero('assol');
      g.beds({ stream: 0.6 }, 3);
      const afloat = g.told('launch:afloat');
      await g.scene(SCENES.forest, { beat: 'launch' });
      const launch = g.beat('launch');
      await afloat;
      await g.say('narrator', 'By the stream she wanted to see how the yacht would sail');
      await launch;
      await g.beat('chase');
      await g.play(chase);
      g.set('run', 1);
      g.set('toy', 1, 1);
      g.set('reeds', 0);
    },
    // Egle at the stream's mouth: the tale, and what she asks
    async g => {
      g.hero('assol');
      g.beds({ stream: 0.3, sea: 0.5 });
      await g.scene(SCENES.forest, { beat: 'mouth' });
      await g.beat('mouth');
      const tale = g.told('egl:tale'), sail = g.told('egl:sail'), boat = g.told('egl:boat');
      const egl = g.beat('egl');
      await tale;
      await g.say('egl', 'I don\'t know how many years will pass, but in Kaperna a fairy tale will blossom');
      await sail;
      await g.say('egl', 'One morning, far out at sea, a scarlet sail will flash in the sun. A white ship will come straight towards you');
      await boat;
      await g.say('egl', 'A boat will put off from the ship, and in it will be the one who saw you in a dream. He will take you away for ever');
      await egl;
      await g.beat('assol_close');
      await g.beat('egl_hold');
      await g.say('assol_child', 'Is all that for me?', 'assol');
      const ask = await g.choose('egl_ask', {
        egl: [{ id: 'when', label: tr('Ask: “When?”') }, { id: 'how', label: tr('Ask: “How will I know him?”') }],
      });
      if (ask === 'when') {
        await g.say('assol_child', 'When?', 'assol');
        const sea = g.told('egl_when:sea');
        const when = g.beat('egl_when');
        await sea;
        await g.say('egl', 'I don\'t know. You will be grown up');
        await when;
      } else {
        await g.say('assol_child', 'And how will I know him?', 'assol');
        const down = g.told('egl_how:down');
        const how = g.beat('egl_how');
        await down;
        await g.say('egl', 'You will know him. And he will know you');
        await how;
      }
      await g.beat('egl_goes');
    },
    // home: she tells it; the whole of Kaperna knows by morning
    async g => {
      g.hero('assol');
      g.beds({ sea: 0.2 });
      const down = g.told('tell:down'), collier = g.told('tell:collier');
      await g.scene(SCENES.home, { beat: 'tell' });
      const tell = g.beat('tell');
      await down;
      await g.say('assol_child', 'He will sail here for me. Under scarlet sails!', 'assol');
      await collier;
      await g.say('longren', 'So it will be, Assol');
      await tell;
      await g.say('narrator', 'By morning all Kaperna knew it');
    },
    // the children at the boats: ⚑ «I'm not lying» or «I made it up»
    async g => {
      g.hero('assol');
      g.beds({ sea: 0.5 });
      const laugh = g.told('kids:laugh'), beckon = g.told('kids:beckon');
      await g.scene(SCENES.shore, { beat: 'kids' });
      g.sound.gulls();
      const kids = g.beat('kids');
      await laugh;
      await g.say('kids', 'Ship girl! Hey, Ship girl! Red sails are coming!', 'kid_boy');
      await beckon;
      await g.say('kids_call', 'Come and play. Only no more lies about the ship', 'kid_girl');
      await kids;
      await g.beat('kids_hold');
      const answer = await g.choose('kids', {
        'assol#yacht': [{ id: 'true', label: tr('“I\'m not lying”') }],
        kid_girl: [{ id: 'made_up', label: tr('“I made it up”') }],
      });
      if (answer === 'true') {
        await g.say('assol_child', 'I\'m not lying', 'assol');
        await g.beat('alone');
        g.scale('tale', 1);
        g.beds({ sea: 0.2 });
        const knees = g.told('why:knees');
        await g.scene(SCENES.home, { beat: 'why' });
        const why = g.beat('why');
        await knees;
        await g.say('assol_child', 'Why won\'t they play with us?', 'assol');
        await g.say('longren', 'Eh, Assol, do they know how to love? One must know how to love, and that is just what they cannot do');
        await why;
      } else {
        await g.say('assol_child', 'I made it up', 'assol');
        await g.beat('play');
        g.scale('tale', -1);
        g.beds({ sea: 0.2 });
        await g.scene(SCENES.home, { beat: 'shelf' });
        await g.beat('shelf');
      }
      g.gauge('tale');
    },
  ],
};
