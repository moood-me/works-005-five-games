// The prologue “A new face” — Yalta at noon: the empty sea-front glittering, a white spitz runs along the parapet and
// sits; the player calls to it (a touch, no choice), the spitz barks, the lady takes up the leash and goes; the title;
// Gurov in the pavilion's shade looks after her. On without “Lights” — chapter I (it has wall: false). game.md §6, the
// prologue.
// Reads: —. Leaves: — (no choices).
import { SCENES } from '../story.js';

export default {
  number: '',
  title: tr('A new face'),
  season: () => 'summer',
  titles: ['A new face'],
  choices: [],
  steps: [
    // the quay at noon: the spitz on the parapet, the player calls it; the lady takes the leash; the title; Gurov looks
    async g => {
      g.hero('gurov');
      g.beds({ sea: 0.6, cicadas: 0.4 }, 3);
      await g.scene(SCENES.quay, { beat: 'noon' });
      const noon = g.beat('noon');
      g.next('noon_turn');
      await noon;
      await g.choose(null, { spitz: [{ id: 'call', label: tr('Call to him') }] });
      g.sound.bark();
      const leash = g.told('noon_turn:leash');
      const turn = g.beat('noon_turn');
      g.next('pavilion');
      await leash;
      await g.say('narrator', 'It was said that a new person had appeared on the sea-front: a lady with a little dog');
      await turn;
      g.title(tr('The Lady with the Dog')); // (not waited for: the pavilion goes on under it)
      const looks = g.told('pavilion:looks');
      const pavilion = g.beat('pavilion');
      await looks;
      await g.say('narrator', 'Dmitri Dmitritch Gurov, who had by then been a fortnight at Yalta, had begun, too, to take an interest in new arrivals');
      await g.say('narrator', 'He almost always spoke ill of women, and called them “the lower race”');
      await pavilion;
    },
  ],
};
