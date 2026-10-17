// Chapter I “The sea-front” — Yalta, summer. The gardens: Gurov coaxes the spitz at the next table and chooses how to
// treat it (shake a finger at it or pat it) — so his scale begins (the watch); a talk across the way; the sea-front at
// night. The pier: through Anna's eyes — the lorgnette, the arrivals, the fear of being known; the lorgnette lost, “Let
// us go to your hotel”. Without “Lights” before it: the prologue runs into it (wall: false). game.md §6, chapter I.
// Reads: —. Leaves: choices.dog, marks.dog, shown.heart.
import { SCENES } from '../story.js';
import podmanit from '../minigames/podmanit.js';
import lornetka from '../minigames/lornetka.js';

export default {
  number: 'I',
  title: tr('The sea-front'),
  wall: false,
  season: () => 'summer',
  titles: ['The gardens', 'The pier'],
  choices: [
    { id: 'dog', weight: '~', title: tr('The dog at his knee'), options: [{ id: 'finger', label: tr('Shake a finger') }, { id: 'pat', label: tr('Pat him') }] },
  ],
  steps: [
    // The gardens: evening, the gardens' lamps, a band far off; the spitz, his hand, her “He doesn’t bite”; the talk;
    // night, the moon's path
    async g => {
      g.hero('gurov');
      g.beds({ sea: 0.3, cicadas: 0.2 });
      const band = g.sound.band();
      g.signal.addEventListener('abort', () => band.stop(1));
      const sat = g.told('garden:sat');
      await g.scene(SCENES.quay, { beat: 'garden' });
      const garden = g.beat('garden');
      g.next('coax');
      await sat;
      await SAY(4);
      await garden;
      const coax = g.beat('coax');
      g.next('coax_hold');
      await coax;
      const r = await g.play(podmanit);
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
        await SAY(5);
        await SAY(6);
        await finger;
      } else {
        g.scale('heart', 1);
        g.mark('dog', 'pat', tr('The dog will remember this.'));
        g.next('pat');
        const sits = g.told('pat:sits');
        const pat = g.beat('pat');
        g.next('talk');
        await sits;
        await SAY(5);
        await SAY(6);
        await pat;
      }
      const turned = g.told('talk:turned');
      const talk = g.beat('talk');
      g.next('walk_out');
      await turned;
      await SAY(7);
      await SAY(8);
      await SAY(9);
      await SAY(10);
      await SAY(11);
      await talk;
      const moon = g.told('walk_out:moon');
      const walk = g.beat('walk_out');
      await moon;
      await SAY(12);
      await SAY(13);
      await walk;
      band.stop(3);
    },
    // The pier: a holiday, the wind, the steamer came in late; Anna looks through her lorgnette for acquaintances among
    // the arrivals
    async g => {
      g.hero('anna');
      g.beds({ sea: 0.5, wind: 0.5, crowd: 0.6 });
      const lorgnette = g.told('pier:lorgnette');
      await g.scene(SCENES.quay, { beat: 'pier' });
      const pier = g.beat('pier');
      g.next('gangway');
      g.sound.horn();
      await SAY(14);
      await lorgnette;
      await SAY(15);
      await pier;
      const gangway = g.beat('gangway');
      g.next('lost');
      await gangway;
      const r = await g.play(lornetka);
      g.set('pass', 7);
      g.set('look_at', '');
      g.set('stranger_turn', 1);
      g.set('surge', 1);
      g.set('fright', r.stranger ? 1 : 0);
      g.sound.clink();
      g.beds({ sea: 0.5, wind: 0.4 });
      const empty = g.told('lost:empty');
      const lost = g.beat('lost');
      g.next('kiss');
      await empty;
      await SAY(16);
      await lost;
      const look = g.told('kiss:look');
      const kiss = g.beat('kiss');
      g.next('go');
      await look;
      await SAY(17);
      await kiss;
      await g.beat('go');
    },
  ],
};
