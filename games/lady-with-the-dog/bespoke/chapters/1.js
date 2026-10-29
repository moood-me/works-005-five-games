// Chapter I “The sea-front” — Yalta, summer. The gardens: Gurov coaxes the spitz at the next table and chooses how to
// treat it (shake a finger at it or pat it) — so his scale begins (the watch); a talk across the way; the sea-front at
// night. The pier: through Anna's eyes — the lorgnette, the arrivals, the fear of being known; the lorgnette lost, “Let
// us go to your hotel”. Without “Lights” before it: the prologue runs into it (wall: false). game.md §6, chapter I.
// Reads: —. Leaves: choices.dog, marks.dog, shown.heart.
import { SCENES } from '../story.js';
import coax from '../minigames/coax.js';
import lorgnette from '../minigames/lorgnette.js';

export default {
  number: 'I',
  title: tr('The sea-front'),
  wall: false,
  season: () => 'summer',
  titles: [tr('The gardens'), tr('The pier')],
  choices: [
    { id: 'dog', weight: '~', title: tr('The dog at his knee'), options: [{ id: 'finger', label: tr('Shake a finger') }, { id: 'pat', label: tr('Pat him') }] },
  ],
  steps: [
    // The gardens: evening, the gardens' lamps, a band far off; the spitz, his hand, her “He doesn’t bite”; the talk;
    // night, the moon's path
    async g => {
      g.hero('gurov');
      const band = g.sound.band();
      g.signal.addEventListener('abort', () => band.stop(1));
      const sat = g.told('garden:sat');
      await g.scene(SCENES.quay, { beat: 'garden' }, { beds: { sea: 0.3, cicadas: 0.2 } });
      const garden = g.beat('garden');
      g.next('coax');
      await sat;
      await g.say('narrator', 'One evening he was dining in the gardens, and she came up and took the next table');
      await garden;
      const beckon = g.beat('coax');
      g.next('coax_hold');
      await beckon;
      const r = await g.play(coax);
      g.set('spitz_near', 1);
      g.set('hand', 0);
      g.set('trust', r.startles ? 0 : 1);
      await g.beat('coax_hold');
      const dog = await g.choose('dog', { spitz: [{ id: 'finger', label: tr('Shake a finger') }, { id: 'pat', label: tr('Pat him') }] });
      g.gauge('heart');
      if (dog === 'finger') {
        g.scale('heart', -1);
        g.mark('dog', 'finger', tr('The dog will remember this.'));
        g.next('finger');
        const growl = g.told('finger:growl');
        const finger = g.beat('finger');
        g.next('talk');
        await growl;
        g.sound.growl();
        await g.say('anna', 'He doesn’t bite');
        await g.say('gurov', 'May I give him a bone?');
        await finger;
      } else {
        g.scale('heart', 1);
        g.mark('dog', 'pat', tr('The dog will remember this.'));
        g.next('pat');
        const sits = g.told('pat:sits');
        const pat = g.beat('pat');
        g.next('talk');
        await sits;
        await g.say('anna', 'He doesn’t bite');
        await g.say('gurov', 'May I give him a bone?');
        await pat;
      }
      const turned = g.told('talk:turned');
      const talk = g.beat('talk');
      g.next('walk_out');
      await turned;
      await g.say('gurov', 'Have you been long in Yalta?');
      await g.say('anna', 'Five days');
      await g.say('gurov', 'And I have already dragged out a fortnight here');
      await g.say('gurov', 'That’s only the fashion to say it’s dull here. A provincial will live in Belyov and not be dull');
      await g.say('gurov', 'And when he comes here it’s “Oh, the dulness! Oh, the dust!” One would think he came from Grenada');
      await talk;
      const moon = g.told('walk_out:moon');
      const walk = g.beat('walk_out');
      await moon;
      await g.say('narrator', 'The sea was of a soft warm lilac hue, and there was a golden streak from the moon upon it');
      await g.say('narrator', 'He learnt that she was called Anna Sergeyevna, that she was married, and that her husband had a post in S.');
      await walk;
      band.stop(3);
    },
    // The pier: a holiday, the wind, the steamer came in late; Anna looks through her lorgnette for acquaintances among
    // the arrivals
    async g => {
      g.hero('anna');
      const looking = g.told('pier:lorgnette');
      await g.scene(SCENES.quay, { beat: 'pier' }, { beds: { sea: 0.5, wind: 0.5, crowd: 0.6 } });
      const pier = g.beat('pier');
      g.next('gangway');
      g.sound.horn();
      await g.say('narrator', 'A week had passed. It was a holiday, a dry wind was blowing, and the steamer came in late');
      await looking;
      await g.say('narrator', 'She looked through her lorgnette at the passengers, as though looking for acquaintances');
      await pier;
      const gangway = g.beat('gangway');
      g.next('lost');
      await gangway;
      const r = await g.play(lorgnette);
      g.set('pass', 7);
      g.set('look_at', '');
      g.set('stranger_turned', 1);
      g.set('surge', 1);
      g.set('fright', r.stranger ? 1 : 0);
      g.sound.clink();
      g.beds({ sea: 0.5, wind: 0.4 });
      const empty = g.told('lost:empty');
      const lost = g.beat('lost');
      g.next('kiss');
      await empty;
      await g.say('narrator', 'Anna Sergeyevna had lost her lorgnette in the crush');
      await lost;
      const look = g.told('kiss:look');
      const kiss = g.beat('kiss');
      g.next('go');
      await look;
      await g.say('gurov', 'Let us go to your hotel');
      await kiss;
      await g.beat('go');
    },
  ],
};
