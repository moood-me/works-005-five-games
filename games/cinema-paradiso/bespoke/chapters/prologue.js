// Пролог «Звонок» — the square in 1988, a cool dusk: the boarded «Парадизо», the booth's window dead; one warm window —
// the mother's, a small figure at the telephone (Р01). The player touches the booth's window: it flares, the beam comes
// out of it and the square goes back into the past under our eyes; the title. On into chapter I by a cut, no «Плёнка».
// game.md §6 «Пролог». Reads: nothing. Leaves: nothing (no choices).
import { SCENES } from '../story.js';

export default {
  number: '',
  title: 'Пролог',
  titles: ['Звонок'],
  choices: [],
  steps: [
    async g => {
      g.hero('both');
      g.beds({ wind_cold: 0.3, sea: 0.2 }, 3);
      const window = g.told('now_open:window');
      await g.scene(SCENES.square, { beat: 'now_open' });
      const open = g.beat('now_open');
      await window;
      await g.say('maria_old', 'Сальваторе… Умер Альфредо. Похороны в среду', 'mother_window');
      await g.say('narrator', 'Я не был в Джанкальдо тридцать лет');
      await open;
      await g.choose(null, { 'paradiso#booth_window': [{ id: 'look', label: 'Посмотреть' }] });
      const beam = g.told('rewind:beam');
      const rewind = g.beat('rewind');
      await beam;
      g.sound.motif();
      g.beds({ cicadas: 0.4, square: 0.3 }, 6);
      g.title('Новый кинотеатр «Парадизо»'); // (not waited for: the past comes up under it)
      await rewind;
    },
  ],
};
