// Epilogue (game.md §6). The window at the end of the street that night — the clarinet behind it, as the play has made it
// (facts.tune); the platform at dawn — Vasenka leaves by the first train, or it is empty. What became of Nina and
// Vasenka the narrator does not say: it is seen. Then the map (game.js), its finale.
// Reads: facts (tune, ending, boxGone; the scenes carry vasya_end, nina_end…). Leaves: nothing. The scales hidden.
import { SCENES, facts } from '../story.js';

// a sound of the game's on a moment of the scene's (not waited for)
const on = (g, moment, fn) => { g.told(moment).then(ok => { if (ok) fn(); }); };

export default {
  number: '', title: tr('Epilogue'), wall: false,
  titles: ['The Window', 'Dawn'],
  choices: [],
  steps: [
    // the window at the end of the street
    async g => {
      const f = facts(g.state);
      g.beds({ wind: 0.4, rails: 0.2 });
      const held = g.told('night_window:held');
      await g.scene(SCENES.street, { beat: 'night_window' });
      const window = g.beat('night_window');
      await held;
      // later — he stayed and someone came for him, where the house was not yet warm (much untruth, or only the truth
      // brought them): the phrase resolves, later and from afar; cut — it breaks off, as always (he left — or stayed,
      // and no one came for him); now — nothing (it has sounded in the house already)
      if (f.tune === 'later') g.sound.clarinet({ times: 1, resolve: true, far: true });
      else if (f.tune === 'cut') g.sound.clarinet({ times: 1, far: true });
      if (f.ending === 'saturday') await g.say('narrator', 'The window at the end of the street stayed lit till morning');
      else if (f.ending === 'suitcase') await g.say('narrator', 'He never did unpack the suitcase');
      if (f.boxGone) await g.say('narrator', 'The snuffbox went with him');
      await window;
    },
    // the platform at dawn: the first train
    async g => {
      g.beds({ wind: 0.2, train: 0.6 }, 2);
      on(g, 'dawn:pass', () => g.sound.horn(0.8));
      on(g, 'dawn:open', () => g.sound.doors());
      on(g, 'dawn:shut', () => g.sound.doors());
      await g.scene(SCENES.platform, { beat: 'dawn' });
      await g.beat('dawn');
      g.beds({ wind: 0.2 }, 6);
    },
  ],
};
