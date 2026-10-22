// Prologue «in which Phileas Fogg makes a wager» — game.md §3. The countdown of the last evening first (20:44:47 →
// Stuart counts the last seconds, the handle turns, dark), then back to 2 October: the whist, the wager — the player
// lays Fogg's cards down himself —,
// ten minutes at Saville Row («Ten minutes»: the bag appears), the train out of Charing Cross (the gas, the London
// watch; the notebook appears). Reads: hands['ten-minutes'] (the gas). Leaves: marks.gas; shown.money, shown.hours.
import { SCENES } from '../story.js';
import tenMinutes from '../minigames/ten-minutes.js';

export default {
  number: '',
  title: tr('Prologue'),
  heading: tr('in which Phileas Fogg makes a wager'),
  route: [0, 0.04],
  titles: [tr('A quarter to nine'), tr('The wager'), tr('Ten minutes'), tr('Charing Cross')],
  choices: [],
  steps: [
    // 21 December, 20:44: five gentlemen before the clock, Stuart counting; the door's handle turns — dark
    async g => {
      g.hero('both');
      g.beds({ clock: 0.8, fire: 0.15 }, 3);
      const count = g.told('countdown:fifty-five'), handle = g.told('countdown:handle');
      await g.scene(SCENES.club, { beat: 'countdown' });
      const countdown = g.beat('countdown');
      await count;
      await g.say('stuart', 'Fifty-five… fifty-six…');
      await handle;
      g.sound.tock();
      await countdown;
      g.sound.motif();
      await g.title(tr('Around the World in Eighty Days'));
    },
    // 2 October: the whist; the wager — the player lays the cards down; Fogg rises and goes
    async g => {
      g.hero('fogg');
      g.beds({ clock: 0.5, fire: 0.3 }, 2);
      const talks = g.told('whist:stuart-talks');
      await g.scene(SCENES.club, { beat: 'whist' });
      const whist = g.beat('whist');
      await talks;
      await g.say('stuart', 'The world has grown smaller. A hundred years ago it took years to go round it');
      await g.say('fogg', 'In eighty days, now');
      await g.say('stuart', 'With trains, with steamers — and with the unforeseen?');
      await whist;
      await g.say('fogg', 'The unforeseen does not exist');
      await g.beat('wager');
      // (the play's first press: the ghost shows it at once, a hint says whose it is)
      const off = g.hint(tr('The wager is yours to make: touch Fogg\'s hands'));
      await g.choose(null, { 'fogg#hands': [{ id: 'bet', label: tr('I bet twenty thousand') }] }, { show: 1 });
      off();
      const down = g.told('wager_down:cards-down');
      const wager = g.beat('wager_down');
      await down;
      await g.say('fogg', 'I will bet twenty thousand pounds that I will make the tour of the world in eighty days. Or less');
      await wager;
      await g.say('fogg', 'I shall be back on Saturday, the twenty-first of December, at a quarter before nine in the evening');
      await g.beat('leave');
    },
    // Saville Row: «Passepartout, we are going round the world. In ten minutes»; the ten minutes; the bag
    async g => {
      g.hero('fogg');
      g.beds({ fog: 0.5, clock: 0.25 }, 2);
      const handle = g.told('home:door'), door = g.told('news:at-door');
      await g.scene(SCENES.row, { beat: 'home' });
      const home = g.beat('home');
      await handle;
      await g.say('narrator', 'At ten minutes to eight Phileas Fogg opened the door of his house in Saville Row');
      await home;
      const news = g.beat('news');
      await door;
      await g.say('fogg', 'Passepartout, we are going round the world. In ten minutes');
      await g.say('passepartout', 'Round… the world?');
      await news;
      g.hero('pp');
      await g.say('fogg', 'Two shirts, three pairs of stockings, a mackintosh and a Bradshaw. We\'ll buy the rest on the way');
      await g.beat('pack', { wait: false });
      g.beds({ fog: 0.3, clock: 0.6 }, 1);
      const r = await g.play(tenMinutes);
      g.mark('gas', !!r?.gas);
      g.hero('fogg');
      // (the carpet-bag given on the step, as the beat comes to it)
      const bag = g.told('out:bag'), away = g.told('out:away');
      const out = g.beat('out');
      await bag;
      await g.say('fogg', 'The carpet-bag. There are twenty thousand in it. Take good care of it');
      g.sound.notes();
      g.gauge('money');
      if (r?.missing) g.money(-50 * r.missing);
      await away;
      await out;
    },
    // the train out of Charing Cross: the gas; Passepartout's London watch; the notebook
    async g => {
      g.hero('both');
      g.beds({ wheels: 0.5, clock: 0.2 }, 2);
      const book = g.told('depart:book');
      await g.scene(SCENES.train, { beat: 'depart', land: 'europe' });
      g.sound.trainWhistle();
      await g.beat('depart');
      await book;
      const up = g.told('gas:up');
      const gas = g.beat('gas');
      await up;
      if (g.state.marks.gas) {
        await g.say('passepartout', 'The gas! I forgot to turn off the gas in my room!');
        await g.say('fogg', 'It will burn — at your expense');
      } else {
        await g.say('passepartout', 'The gas is off, monsieur! I made sure');
        await g.say('fogg', 'Good');
      }
      await gas;
      const out = g.told('watch:out');
      const watch = g.beat('watch');
      await out;
      await g.say('passepartout', 'London time. I shan\'t change it, monsieur');
      await watch;
      g.gauge('hours');
      await g.say('fogg', 'London to Suez: seven days. Exactly on time');
    },
  ],
};
