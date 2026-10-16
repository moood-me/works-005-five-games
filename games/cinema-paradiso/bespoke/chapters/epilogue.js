// The epilogue "The Kisses" — the demolition of the Paradiso (where Salvatore stands — the square's party keys `place`,
// `with_mother`: by the funeral and Toto's scale), the old madman out of the dust; Rome: the small screening room, the
// strip of kisses on the screen under the theme, his face in the screen's white light (the note in his hand if he found
// it — the party key `note_in_hand`). No choices; the scales are hidden (the framework). game.md §6 "Epilogue".
// Reads: nothing directly (the scenes' party keys carry facts.place, kino, ending, jumps). Leaves: nothing.
import { SCENES } from '../story.js';

// a handle of sound (theme, camera8) stopped when the step is left
const held = (g, h) => {
  g.signal.addEventListener('abort', () => h.stop(0.5));
  return h;
};

export default {
  number: '',
  title: tr('Epilogue'),
  wall: false,
  titles: ['The Demolition', 'Rome'],
  choices: [],
  steps: [
    // the demolition: the full square goes silent, the whistle, the facade comes down; the madman out of the dust
    async g => {
      g.hero('both');
      g.beds({ crowd: 0.4, wind_cold: 0.2 });
      const whistle = g.told('demolition:whistle'), blast = g.told('demolition:blast');
      await g.scene(SCENES.square, { beat: 'demolition' });
      const demolition = g.beat('demolition');
      await whistle;
      g.sound.whistleBlow();
      g.beds({ wind_cold: 0.2 }, 1); // (the crowd falls silent)
      await blast;
      g.sound.blast();
      await demolition;
      const madman = g.told('dust:madman');
      const dust = g.beat('dust');
      await madman;
      await g.say('madman_old', 'My square…', 'madman');
      await dust;
    },
    // Rome: alone in the rows; the kisses on the screen; the white light on his face
    async g => {
      g.hero('both');
      g.beds({});
      await g.scene(SCENES.rome, { beat: 'rome' });
      await g.beat('rome');
      await g.choose(null, { 'port#window': [{ id: 'play', label: tr('Roll the film') }] });
      await g.say('salvatore', 'Roll it', 'toto');
      g.beds({ whirr: 0.5 });
      const theme = held(g, g.sound.theme());
      await g.beat('kisses');
      const white = g.told('kisses_end:white');
      const end = g.beat('kisses_end');
      await white;
      theme.loud(1, 2);
      g.beds({}, 4);
      await end;
      theme.stop(6);
    },
  ],
};
