// Epilogue — the night on the Secret, the violin over it: the cask of the Grays opened (Home: the letter brought him
// home) or the crew's song (Sea); at dawn the mail steamer overtaken, if Longren went to sea; his mother at her
// window. Put together from what the play decided; no choices, no scales; after it — the sails of the whole play
// (game.js). It begins without the Far Sea: the finale's music is not cut off. design.md, game.md §6.
// Reads: facts.wine, longren (and, through the scenes' own keys: wine; letter, home). Leaves: nothing.
import { SCENES, facts } from '../story.js';

export default {
  number: '',
  title: tr('Epilogue'),
  wall: false,
  titles: ['The night on the Secret', 'The steamer', 'The window'],
  choices: [],
  steps: [
    // the night on the Secret: the violin; the old wine — or the crew sings (the orchestra goes)
    async g => {
      const f = facts(g.state);
      g.hero('both');
      const look = g.told('night_end:look');
      await g.scene(SCENES.deck, { beat: 'night_end' }, { beds: { sea: 0.5 } });
      const night = g.beat('night_end');
      let v = g.sound.violin(), song = null;
      const stop = () => {
        v?.stop(3);
        song?.stop(3);
        v = song = null;
      };
      g.signal.addEventListener('abort', stop, { once: true });
      await look;
      if (f.wine) await g.say('narrator', 'That night they drank the old wine of the Grays. It had been kept for paradise');
      else song = g.sound.song();
      await night;
      stop();
    },
    // the steamer: Longren at its rail, the scarlet sails behind him — if he went to sea
    async g => {
      if (facts(g.state).longren !== 'sea') return;
      g.hero('both');
      const longren = g.told('steamer:longren');
      await g.scene(SCENES.deck, { beat: 'steamer' }, { beds: { sea: 0.6 } });
      const steamer = g.beat('steamer');
      await longren;
      g.sound.horn();
      g.sound.motif();
      await steamer;
    },
    // the window: his mother, with the letter or alone with her candle — without words
    async g => {
      g.hero('both');
      await g.scene(SCENES.castle, { beat: 'window_end' }, { beds: { hearth: 0.2 } });
      await g.beat('window_end');
    },
  ],
};
