// II. Gray — the castle where all was ordained for ever: the boy paints over the nails (the mother comes), the ship
// in the picture and the cask in the cellar; the night he goes (⚑ farewell or quietly — the compass appears); the
// shrouds under Gop; the letter of his father's death (⚑ home for long, or only for a share — the compass moves).
// Reads: nothing of the play but its own choices. Leaves: choices.leave, choices.letter; scales.sea (II.3 ±1,
// II.4 +1, II.5 ±2); marks.mother (quiet); the sea's gauge shown.
import brush from '../minigames/brush.js';
import letGo from '../minigames/let-go.js';
import shrouds from '../minigames/shrouds.js';
import { SCENES } from '../story.js';

export default {
  number: 'II',
  title: tr('Gray'),
  titles: ['Brush', 'The ship in the picture', 'Going', 'Shrouds', 'The letter'],
  choices: [
    { id: 'leave', weight: '⚑', title: tr('The night he left'), options: [{ id: 'farewell', label: tr('Say goodbye') }, { id: 'quiet', label: tr('Slip away') }] },
    { id: 'letter', weight: '⚑', title: tr('The letter'), options: [{ id: 'home', label: tr('Home for a long while') }, { id: 'share', label: tr('Only to take his share') }] },
  ],
  steps: [
    // the boy and the brush; the mother
    async g => {
      g.hero('grey');
      g.beds({ hearth: 0.3 });
      await g.scene(SCENES.castle, { beat: 'boy' });
      const boy = g.beat('boy');
      await g.say('narrator', 'Gray was born in a castle where everything was ordained for ever');
      await boy;
      await g.beat('brush');
      await g.play(brush);
      for (const key of ['nail1', 'nail2', 'nail3']) g.set(key, 1);
      await g.say('grey_boy', 'I won\'t have nails sticking out of hands and blood flowing while I\'m here', 'narrator');
      const stops = g.told('mother_in:stops');
      const mother = g.beat('mother_in');
      await stops;
      await g.say('lilian', 'Arthur…');
      await mother;
      await g.beat('mother_close');
    },
    // the ship in the picture comes alive; the cask in the cellar
    async g => {
      g.hero('grey');
      g.beds({ hearth: 0.3 });
      const alive = g.told('ship_painting:alive');
      await g.scene(SCENES.castle, { beat: 'ship_painting' });
      const painting = g.beat('ship_painting');
      await alive;
      g.beds({ hearth: 0.2, sea: 0.4 }, 4);
      await g.say('narrator', 'Gray made up his mind to be a captain');
      await painting;
      g.beds({});
      await g.say('narrator', 'In the cellar he found a cask with words on it');
      await g.beat('cellar');
    },
    // the night he goes: ⚑ farewell at his mother's door, or quietly with the note
    async g => {
      g.hero('grey');
      g.beds({ hearth: 0.15 });
      await g.scene(SCENES.castle, { beat: 'night' });
      await g.beat('night');
      const leave = await g.choose('leave', {
        'mother_door#mother_door': [{ id: 'farewell', label: tr('Say goodbye') }],
        'table#bundle': [{ id: 'quiet', label: tr('Slip away') }],
      });
      g.gauge('sea');
      if (leave === 'farewell') {
        const door = g.told('farewell:at-door'), open = g.told('farewell:open'), ring = g.told('farewell:ring');
        const farewell = g.beat('farewell');
        await door;
        g.sound.knock();
        await open;
        await g.say('lilian', 'Will you come back?');
        await g.say('grey', 'As a captain');
        await ring;
        await g.say('lilian', 'Take it. Let it be with you');
        await farewell;
        const r = await g.play(letGo);
        for (const key of ['grip1', 'grip2', 'grip3', 'grip4']) g.set(key, 0);
        g.set('pried', r.opened > 0 ? 1 : 0);
        await g.beat('let_go');
        g.scale('sea', -1);
      } else {
        await g.beat('note');
        await g.letter({ text: tr('Mother, I have gone to sea.'), sign: tr('Arthur') });
        await g.beat('note_goes');
        g.scale('sea', 1);
        g.mark('mother', 'note', tr('His mother will remember this.'));
      }
    },
    // the shrouds under Gop's eye
    async g => {
      g.hero('grey');
      g.beds({ wind: 0.4, sea: 0.6 });
      const looks = g.told('anselm:looks-up');
      await g.scene(SCENES.deck, { beat: 'anselm' });
      g.sound.rigging();
      const anselm = g.beat('anselm');
      await looks;
      await g.say('gop', 'Want to be a captain? Up to the crosstrees first. And don\'t look down');
      await anselm;
      await g.beat('shrouds');
      const r = await g.play(shrouds);
      g.set('climb', 1);
      g.set('hand_l', 1);
      g.set('hand_r', 1);
      g.set('roll', 0, 1);
      g.sound.wind(0.4, 1);
      const up = g.told('top:up');
      const top = g.beat('top');
      await up;
      await g.say('gop', 'He\'ll do');
      await top;
      if (r.slips === 0) g.scale('sea', 1);
    },
    // the letter: ⚑ home for long, or only for a share; then the secret
    async g => {
      g.hero('grey');
      g.beds({ sea: 0.3 });
      const reading = g.told('letter:reading');
      await g.scene(SCENES.deck, { beat: 'letter' });
      g.sound.gulls();
      const letter = g.beat('letter');
      await reading;
      await g.say('narrator', 'He was twenty when the letter came: his father was dead');
      await letter;
      await g.letter({ text: tr('Arthur, your father is dead.'), sign: tr('Mother') });
      const way = await g.choose('letter', {
        'grey#letter': [{ id: 'home', label: tr('Home for a long while') }, { id: 'share', label: tr('Only to take his share') }],
      });
      // (the scale at once: the warmth of the hall already shows it)
      g.scale('sea', way === 'home' ? -2 : 2);
      if (way === 'home') {
        g.beds({ hearth: 0.4 });
        await g.scene(SCENES.castle, { beat: 'return' });
        await g.beat('return');
        const hand = g.told('stays:hand');
        const stays = g.beat('stays');
        await hand;
        await g.say('lilian', 'Stay till spring');
        await g.say('grey', 'I\'ll stay');
        await stays;
        const turns = g.told('spring:turns');
        const spring = g.beat('spring');
        await turns;
        await g.say('lilian', 'Take that cask from the cellar. It has waited for you');
        await spring;
      } else {
        g.beds({ hearth: 0.2 });
        await g.scene(SCENES.castle, { beat: 'return' });
        await g.beat('return');
        const looking = g.told('one_evening:window');
        const evening = g.beat('one_evening');
        await looking;
        await g.say('lilian', 'You\'re leaving already');
        await evening;
        g.beds({ sea: 0.3 });
        const turns = g.told('gop_bye:turns');
        await g.scene(SCENES.deck, { beat: 'gop_bye' });
        const bye = g.beat('gop_bye');
        await turns;
        await g.say('gop', 'When you buy a ship, don\'t forget who taught you');
        await bye;
      }
      g.beds({ sea: 0.3 });
      const touched = g.told('secret:hand-on-wheel');
      await g.scene(SCENES.deck, { beat: 'secret' });
      const secret = g.beat('secret');
      await touched;
      await g.say('narrator', 'He bought the three-masted galliot Secret');
      await secret;
    },
  ],
};
