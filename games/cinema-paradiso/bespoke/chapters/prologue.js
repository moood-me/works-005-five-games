// The prologue "The Call" — the square in 1988, a cool dusk: the boarded Paradiso, the booth's window dead; one warm window —
// the mother's, a small figure at the telephone (L01). The player touches the booth's window: it flares, the beam comes
// out of it and the square goes back into the past under our eyes; the title. On into chapter I by a cut, no strip.
// game.md §6 "Prologue". Reads: nothing. Leaves: nothing (no choices).
import { SCENES } from '../story.js';

export default {
  number: '',
  title: tr('Prologue'),
  titles: ['The Call'],
  choices: [],
  steps: [
    async g => {
      g.hero('both');
      const window = g.told('now_open:window');
      await g.scene(SCENES.square, { beat: 'now_open' }, { beds: { wind_cold: 0.3, sea: 0.2 } });
      const open = g.beat('now_open');
      await window;
      await g.say('maria_old', 'Salvatore… Alfredo has died. The funeral is on Wednesday', 'mother_window');
      await g.say('narrator', 'I hadn\'t been back to Giancaldo in thirty years');
      await open;
      await g.choose(null, { 'paradiso#booth_window': [{ id: 'look', label: tr('Look') }] });
      const beam = g.told('rewind:beam');
      const rewind = g.beat('rewind');
      await beam;
      g.sound.motif();
      g.beds({ cicadas: 0.4, square: 0.3 });
      g.title(tr('Cinema Paradiso')); // (not waited for: the past comes up under it)
      await rewind;
    },
  ],
};
