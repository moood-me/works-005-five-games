// I. The Bell — Toto, eight: the priest's bell and the cut kisses (he peeks from behind the curtain), the scissors in
// Alfredo's hands (the boy and the clippings: ~ a frame taken or not — the scale Cinema ↔ People appears), ⚑ the milk
// money (Alfredo's lie, or the truth), the deal (the boy teaches Alfredo to write his name), the paper from Russia.
// game.md §6 "Chapter I". Wall: false — it runs on from the prologue without the strip.
// Reads: hands.peek (facts.seen: L07 / L128). Leaves: choices.frame, choices.milk; scales.toto (I.2 ±1, I.3
// ±1); marks.frame (take), marks.alfredo (lie), marks.mother (truth); hands.peek, splice, letters.
import { SCENES, facts } from '../story.js';
import peek from '../minigames/peek.js';
import splice from '../minigames/splice.js';
import letters from '../minigames/letters.js';

export default {
  number: 'I',
  title: tr('The Bell'),
  wall: false,
  titles: ['The Bell', 'Scissors', 'Milk', 'The Deal', 'The Paper'],
  choices: [
    { id: 'frame', weight: '~', title: tr('The clippings'), options: [{ id: 'leave', label: tr('Let him keep them') }, { id: 'take', label: tr('Take one frame') }] },
    { id: 'milk', weight: '⚑', title: tr('The milk money'), options: [{ id: 'lie', label: tr('Keep quiet') }, { id: 'truth', label: tr('Tell the truth') }] },
  ],
  steps: [
    // the empty hall, the priest alone in the fifth row; the boy peeks from behind the curtain
    async g => {
      g.hero('toto');
      g.beds({ hall: 0.5, whirr: 0.3 });
      const sat = g.told('priest:sat');
      await g.scene(SCENES.hall, { beat: 'priest' }, { cut: true });
      const priest = g.beat('priest');
      await sat;
      await g.say('narrator', 'Father Adelfio saw every film first. Alone');
      await priest;
      await g.beat('peek');
      // (each line once, not waited for: the film goes on)
      let rang = false, caught = false;
      await g.play(peek, {
        onFirstBell: () => { if (!rang) { rang = true; g.say('adelfio', 'That\'s to be cut'); } },
        onCaught: () => { if (!caught) { caught = true; g.say('adelfio', 'Totò! Home, now!'); } },
      });
      g.set('peek', 0);
      g.set('turn', 0);
      g.set('bell', 0);
      g.set('screen_film', 'romance');
      await g.beat('bell_end');
    },
    // the booth: Alfredo cuts the kisses (Splicing); the boy and the clippings (~ frame)
    async g => {
      g.hero('both');
      g.beds({ whirr: 0.5, hall: 0.2 });
      const door = g.told('cutting:door'), bench = g.told('cutting:bench');
      await g.scene(SCENES.booth, { beat: 'cutting' });
      const cutting = g.beat('cutting');
      await door;
      await g.say('alfredo', 'Shoo! You\'re not allowed in here');
      await bench;
      if (facts(g.state).seen >= 2) await g.say('toto_boy', 'He rang three times. I counted', 'toto');
      else await g.say('toto_boy', 'He rang. And I hid', 'toto');
      await cutting;
      await g.beat('splice_in');
      let told = false;
      const r = await g.play(splice, {
        onCrooked: () => { if (!told) { told = true; g.say('alfredo', 'Cut right on the frame. So it doesn\'t jump', 'narrator'); } },
      });
      for (const n of [1, 2, 3]) {
        g.set(`cut${n}`, 1);
        g.set(`glue${n}`, 1);
        if (!r.jumps) g.set(`bent${n}`, 0); // (skipped or clean: no slanted cut; else as the game left them)
      }
      g.set('boy_reach', 1);
      const tin = g.told('frames:tin');
      const frames = g.beat('frames');
      await tin;
      await g.say('toto_boy', 'And where do these go? Can I have them?', 'toto');
      await g.say('alfredo', 'They\'re yours. But I keep them');
      await frames;
      const frame = await g.choose('frame', {
        tin: [{ id: 'leave', label: tr('Let him keep them') }],
        toto: [{ id: 'take', label: tr('Take one frame') }],
      });
      g.gauge('toto');
      if (frame === 'leave') {
        g.scale('toto', -1);
        await g.beat('tin_shut');
      } else {
        g.scale('toto', 1);
        g.mark('frame', true, tr('Totò will keep the frame.'));
        const hidden = g.told('pocket:hidden');
        const pocket = g.beat('pocket');
        await hidden;
        await g.say('narrator', 'I took one away. He didn\'t notice. Or pretended not to');
        await pocket;
      }
    },
    // after the show: the mother and the milk money; Alfredo's coins out of his own pocket (⚑ milk)
    async g => {
      g.hero('toto');
      g.beds({ square: 0.5, cicadas: 0.3, crowd: 0.3 });
      const caught = g.told('after_show:caught');
      await g.scene(SCENES.square, { beat: 'after_show' });
      const after = g.beat('after_show');
      await caught;
      await g.say('maria', 'Where\'s the milk money? Where is it?', 'maria');
      await after;
      const coins = g.told('alfredo_down:coins');
      const down = g.beat('alfredo_down');
      await coins;
      g.sound.coins();
      await g.say('alfredo', 'Signora, he dropped it in the hall. I picked it up');
      await down;
      const milk = await g.choose('milk', {
        'alfredo#hand_r': [{ id: 'lie', label: tr('Keep quiet') }],
        toto: [{ id: 'truth', label: tr('Tell the truth') }],
      });
      if (milk === 'lie') {
        g.scale('toto', 1);
        g.mark('alfredo', true, tr('Alfredo will remember this.'));
        const take = g.told('coins_taken:take');
        const taken = g.beat('coins_taken');
        await take;
        await g.say('maria', 'Thank you, Don Alfredo', 'maria');
        await taken;
        g.beds({});
        await g.scene(SCENES.home, { beat: 'supper' });
        await g.beat('supper');
        await g.say('narrator', 'There was milk that evening');
      } else {
        g.scale('toto', -1);
        g.mark('mother', true, tr('Mother will remember this.'));
        await g.say('toto_boy', 'I spent it. On the movies', 'toto');
        const cut = g.told('slap:cut');
        const slap = g.beat('slap');
        await cut;
        g.sound.slap();
        await slap;
        g.beds({});
        const hand = g.told('photo:hand');
        await g.scene(SCENES.home, { beat: 'photo' });
        const photo = g.beat('photo');
        await hand;
        await g.say('maria', 'Your father\'s in Russia. Maybe he\'s still alive. And you go to the movies', 'maria');
        await photo;
      }
    },
    // the deal: Alfredo's exam; the boy's hand on his, the chalk (Letters); the slate up to the lamp
    async g => {
      g.hero('both');
      g.beds({ whirr: 0.3 });
      const primer = g.told('deal:primer');
      await g.scene(SCENES.booth, { beat: 'deal' });
      const deal = g.beat('deal');
      await primer;
      await g.say('alfredo', 'I\'ve got to sit the exam. Elementary school. Without the certificate they won\'t keep me on as projectionist');
      await g.say('toto_boy', 'I\'ll teach you. And you teach me to run the projector', 'toto');
      await g.say('alfredo', 'It\'s a deal. Just not a word to your mother');
      await deal;
      await g.beat('slate_in');
      const r = await g.play(letters);
      g.set('letters', 7);
      g.set('chalk_x', 1);
      g.set('wobble', 0);
      g.set('crooked', r.crooked ?? '0000000');
      const up = g.told('slate_out:up');
      const out = g.beat('slate_out');
      await up;
      await g.say('alfredo', 'Al-fre-do. Well, look at that. That\'s me');
      await out;
    },
    // the paper from Russia: the mother in black crosses the square, the poster, the boy takes her hand
    async g => {
      g.hero('toto');
      g.beds({ square: 0.3, cicadas: 0.2 });
      const hand = g.told('paper:hand');
      await g.scene(SCENES.square, { beat: 'paper', poster: 1 });
      const paper = g.beat('paper');
      await hand;
      await g.say('narrator', 'My father never came back from Russia. They sent us a paper');
      await paper;
    },
  ],
};
