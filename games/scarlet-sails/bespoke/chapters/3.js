// III. Dawn — Longren packs for the sea: ⚑ let him go or ask him to stay; the night fire off Kaperna; the
// sleeping girl and the ring («The ring»); she wakes: ~ wear it or hide it on a cord; the tavern and the past of
// Mary, Menners and Longren, the coal-man's word; ⚑ the secret or straight to Longren. design.md, game.md §6.
// Reads: facts.ringKind (choices.leave), choices.longren. Leaves: choices.longren, ring, way; marks.longren;
// scales.tale ±1 (the ring).
import { SCENES, facts } from '../story.js';
import ring from '../minigames/ring.js';

export default {
  number: 'III',
  title: tr('Dawn'),
  titles: ['Longren', 'The fire', 'Asleep', 'The ring', 'The tavern', 'The secret, or Longren'],
  choices: [
    { id: 'longren', weight: '⚑', title: tr('Longren goes to sea'), options: [{ id: 'go', label: tr('“Go. I\'ll manage”') }, { id: 'stay', label: tr('“Don\'t go”') }] },
    { id: 'ring', weight: '~', title: tr('The ring'), options: [{ id: 'wear', label: tr('Wear it') }, { id: 'hide', label: tr('Hide it on a cord') }] },
    { id: 'way', weight: '⚑', title: tr('The secret, or Longren'), options: [{ id: 'secret', label: tr('The secret') }, { id: 'straight', label: tr('To Longren') }] },
  ],
  steps: [
    // Longren: the shop turns the toys away again; at home he means to go back to the sea
    async g => {
      g.hero('assol');
      g.beds({});
      const looks = g.told('toys_again:looks');
      await g.scene(SCENES.shop, { beat: 'toys_again' });
      const toys = g.beat('toys_again');
      await g.say('narrator', 'Nine years went by');
      await looks;
      await g.say('merchant', 'We don\'t take them. I told your father');
      await toys;
      g.beds({ sea: 0.2 });
      await g.scene(SCENES.home, { beat: 'years' });
      await g.beat('years');
      const turned = g.told('decide:turned');
      const decide = g.beat('decide');
      await turned;
      await g.say('longren', 'Nobody wants toys, Assol. I\'ll go back to sea, on the mail steamer');
      await decide;
      const go = await g.choose('longren', {
        chest: [{ id: 'go', label: tr('“Go. I\'ll manage”') }],
        longren: [{ id: 'stay', label: tr('“Don\'t go”') }],
      });
      if (go === 'go') {
        await g.say('assol', 'Go. I\'ll manage');
        await g.beat('chest_out');
        g.mark('longren', 'go', tr('Longren will remember this.'));
      } else {
        await g.say('assol', 'Don\'t go');
        await g.beat('stay');
        g.mark('longren', 'stay', tr('Longren will remember this.'));
      }
    },
    // the fire: Gray and Letika, a night's fishing off Kaperna
    async g => {
      g.hero('grey');
      g.beds({ campfire: 0.6, sea: 0.4 });
      const letika = g.told('fire:letika');
      await g.scene(SCENES.forest, { beat: 'fire' });
      const fire = g.beat('fire');
      await g.say('narrator', 'The Secret lay at Liss. Gray and Letika went out by night to fish off Kaperna');
      await letika;
      await g.say('letika', 'The fish are asleep, captain. Like people');
      await fire;
    },
    // the sleeping girl: the ring is put on her hand while she sleeps — still, or she wakes
    async g => {
      g.hero('grey');
      g.beds({ sea: 0.4 });
      const found = g.told('dawn_walk:found');
      await g.scene(SCENES.forest, { beat: 'dawn_walk' });
      const walk = g.beat('dawn_walk');
      await found;
      await g.say('narrator', 'A girl lay asleep in the grass');
      await walk;
      const sleeping = g.beat('sleeping');
      g.sound.breath(0.2, 2);
      await sleeping;
      await g.beat('ring');
      const r = await g.play(ring);
      g.set('stir', 0, 1);
      g.sound.breath(0, 1);
      if (!r.on) await g.beat('ring_on');
      g.sound.chime();
      if (facts(g.state).ringKind === 'mother') await g.say('narrator', 'He put his mother\'s ring on her finger');
      else await g.say('narrator', 'He put his own old ring on her finger');
      await g.beat('leave');
    },
    // the ring: she wakes with it on her hand — ~ wear it, or hide it on a cord under the dress
    async g => {
      g.hero('assol');
      g.beds({ sea: 0.4 });
      await g.scene(SCENES.forest, { beat: 'wake' });
      const wake = g.beat('wake');
      g.sound.gulls();
      await wake;
      await g.beat('wake_hold');
      const kept = await g.choose('ring', {
        'assol#ring': [{ id: 'wear', label: tr('Wear it') }, { id: 'hide', label: tr('Hide it on a cord under the dress') }],
      });
      if (kept === 'wear') {
        await g.beat('wear');
        await g.say('narrator', 'She put the ring on and never took it off');
        g.scale('tale', 1);
      } else {
        await g.beat('hide');
        await g.say('narrator', 'She hid the ring on a cord');
        g.scale('tale', -1);
      }
    },
    // the tavern: Hin's tale, the past it tells, the touch on Philip, her passing
    async g => {
      g.hero('grey');
      g.beds({ sea: 0.4 });
      const hin = g.told('tavern:hin');
      await g.scene(SCENES.shore, { beat: 'tavern' });
      const tavern = g.beat('tavern');
      await hin;
      await g.say('hin', 'Ship Assol. Touched in the head. Waiting for a prince from over the sea, under red sails');
      await g.say('hin', 'And her father let mine drown in a storm. Stood on the shore and smoked');
      await tavern;
      const door = g.told('past_mary:door');
      const goes = g.told('past_mary:goes');
      const mary = g.beat('past_mary');
      g.beds({ storm: 0.5 }, 1);
      await door;
      await g.say('narrator', 'Assol\'s mother asked Menners for a loan. He wanted something else for the money');
      await goes;
      await g.say('narrator', 'She walked to town to pawn her ring, and caught her death of cold');
      await mary;
      const cry = g.told('past_storm:cry');
      const gone = g.told('past_storm:gone');
      const storm = g.beat('past_storm');
      g.beds({ storm: 1 }, 1);
      await cry;
      await g.say('longren', 'She begged you just the same way!');
      await gone;
      await g.say('narrator', 'A steamer picked Menners up. He lived long enough to tell Kaperna how Longren had watched');
      await storm;
      const back = g.beat('tavern_back');
      g.beds({ sea: 0.4 }, 1);
      await back;
      await g.choose(null, { filipp: [{ id: 'ask', label: tr('Ask the collier') }] });
      await g.say('filipp', 'He\'s lying. She\'s not touched. She sat with me on my cart, and my basket seemed to burst into bloom');
      const assol = g.told('passing:assol');
      const passing = g.beat('passing');
      await assol;
      await g.say('hin', 'There she goes');
      await passing;
      await g.beat('grey_close');
    },
    // the secret or straight: back to the skiff, or to Longren
    async g => {
      g.hero('grey');
      g.beds({ sea: 0.5 });
      const alone = g.told('grey_shore:alone');
      await g.scene(SCENES.shore, { beat: 'grey_shore' });
      const shore = g.beat('grey_shore');
      await alone;
      await g.say('grey', 'I don\'t know if she is still waiting');
      await shore;
      const way = await g.choose('way', {
        skiff: [{ id: 'secret', label: tr('The secret: back to the skiff') }],
        longren: [{ id: 'straight', label: tr('Straight: go up to Longren') }],
      });
      if (way === 'secret') {
        await g.beat('to_skiff');
        return;
      }
      const met = g.told('longren_boat:met');
      const boat = g.beat('longren_boat');
      await met;
      await g.say('grey', 'I am the captain of the Secret. Is your daughter still waiting for her ship?');
      await g.say('longren', 'Nine years she\'s waited');
      await g.say('grey', 'It will come. Don\'t tell her');
      await boat;
      if (g.state.choices.longren === 'go') {
        await g.say('longren', 'Then I\'ll wait too');
        g.beds({ sea: 0.2 });
        await g.scene(SCENES.home, { beat: 'unpack' });
        await g.beat('unpack');
      }
    },
  ],
};
