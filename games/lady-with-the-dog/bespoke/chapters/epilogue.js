// The epilogue “Three windows” — without words: the gate in S., the porch in Moscow, the empty seat at Oreanda. What is
// seen at the gate and at the porch follows from who of the spouses knows (through carry: husband_knows, wife_knows,
// spring). Without “Lights” before it (wall: false): chapter V runs into it; the scales hidden (game.js). game.md §6,
// the epilogue.
// Reads: facts.spring (the bed of sound); through carry — husband_knows, wife_knows, spring. Leaves: —.
import { SCENES, facts } from '../story.js';

export default {
  number: '',
  title: tr('Three windows'),
  wall: false,
  season: s => (facts(s).spring ? 'thaw' : 'winter'),
  titles: [tr('S.'), tr('Moscow'), tr('Oreanda')],
  choices: [],
  steps: [
    // S.: the husband with the old spitz by the fence or at the gate
    async g => {
      g.hero('both');
      await g.scene(SCENES.town, { beat: 'fence_end' }, { beds: facts(g.state).spring ? { thaw: 0.3 } : { snow: 0.3 } });
      await g.beat('fence_end');
    },
    // Moscow: the window upstairs — the wife at the window, or the house dark
    async g => {
      g.hero('both');
      await g.scene(SCENES.moscow, { beat: 'porch_end' }, { beds: facts(g.state).spring ? { thaw: 0.3 } : { snow: 0.3 } });
      await g.beat('porch_end');
    },
    // Oreanda: dawn, the empty seat, the sea
    async g => {
      g.hero('both');
      await g.scene(SCENES.oreanda, { beat: 'bench_end' }, { beds: { sea: 0.6 } });
      await g.beat('bench_end');
    },
  ],
};
