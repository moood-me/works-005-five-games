// V. The Elder Son (game.md §6). On the porch at night with Nina: «I don't know my father» — his coat on her shoulders
// (The Coat); Sarafanov packs a suitcase to go with him «to your mother» — ⚑ tell him yourself, or keep silent and let
// Silva tell; the run to the last train (Running); at its open door — ⚑ get in, or stay; home, if he stayed.
// Reads: facts (ninaIs, secret, entry, boxWhere, came, ninaCame, silvaDoor, boxHand, told, hurt, train, tune, ending).
// Leaves: choices.truth, .train; scales lie. No map after it (game.md §3.5): the epilogue comes at once.
import { SCENES, facts } from '../story.js';
import coat from '../minigames/coat.js';
import running from '../minigames/running.js';
import glass from '../minigames/glass.js';

// a sound of the game's on a moment of the scene's (not waited for)
const on = (g, moment, fn) => { g.told(moment).then(ok => { if (ok) fn(); }); };

export default {
  number: 'V', title: tr('The Elder Son'),
  titles: ['The Porch', 'Truth', 'The Last Train', 'Home'],
  choices: [
    { id: 'truth', weight: '⚑', title: tr('Truth'), options: [{ id: 'self', label: tr('Tell him yourself') }, { id: 'silent', label: tr('Keep quiet') }] },
    { id: 'train', weight: '⚑', title: tr('The Last Train'), options: [{ id: 'stay', label: tr('Stay') }, { id: 'go', label: tr('Get on the train') }] },
  ],
  steps: [
    // the porch at night: Nina, and his own father
    async g => {
      const f = facts(g.state);
      g.beds({ wind: 0.3 });
      const sat = g.told('porch_night:sat');
      await g.scene(SCENES.street, { beat: 'porch_night' });
      const porch = g.beat('porch_night');
      await sat;
      if (f.secret) {
        await g.say('nina', 'Did he tell you? About the orchestra');
        await g.say('busygin', 'Not a word');
      }
      // (L89 is left unanswered — so it is meant: his answer is the choice of V.2)
      if (f.ninaIs === 'knows') await g.say('nina', 'Will you tell him? About yourself');
      else await g.say('nina', 'I\'m glad you came to us');
      await g.say('busygin', 'I don\'t know my own father. I saw him once — at a station. He didn\'t recognise me');
      await porch;
      await g.beat('shawl');
      await g.play(coat);
      g.set('lay', 1);
      await g.beat('porch_after');
    },
    // the suitcase «to your mother»: ⚑ the truth — his own, or Silva's
    async g => {
      g.beds({ room: 0.3, clock: 0.5 });
      const suitcase = g.told('pack:case'), silva = g.told('pack:silva');
      await g.scene(SCENES.home, { beat: 'pack' });
      const pack = g.beat('pack');
      await g.say('silva', 'That\'s it, sonny. The show\'s over. We can still make the last one');
      await suitcase;
      await g.say('sarafanov', 'I\'m coming with you. Nobody needs me here');
      await g.say('sarafanov', 'I\'ll go to your mother. I\'ll ask her to forgive me');
      await silva;
      await g.say('silva', 'Andrei Grigorievich, what sort of…');
      await pack;
      const truth = await g.choose('truth', {
        sarafanov: [{ id: 'self', label: tr('Tell him yourself') }],
        silva: [{ id: 'silent', label: tr('Keep quiet') }],
      });
      g.apply('truth');
      if (truth === 'self') {
        g.set('hurt', facts(g.state).hurt ? 1 : 0);
        const said = g.told('confess:said'), sarafanov = g.told('confess:sarafanov');
        const confess = g.beat('confess');
        await said;
        await g.say('busygin', 'I\'m not your son. We missed the train. We had to spend the night somewhere');
        await sarafanov;
        await g.say('sarafanov', 'So what. I still think of you as my son');
        await confess;
      } else {
        const said = g.told('exposed:said'), window = g.told('exposed:window');
        const exposed = g.beat('exposed');
        await said;
        if (facts(g.state).entry === 'asked') await g.say('silva', '…son is he to you! He first set eyes on you yesterday. I was the one who called him your son — for a laugh');
        else await g.say('silva', '…son is he to you! He first set eyes on you yesterday. He came up with it himself — what an actor');
        await window;
        await g.say('sarafanov', 'So what. I still think of you as my son', 'sarafanov');
        await exposed;
      }
      on(g, 'go_out:gone', () => g.sound.door());
      await g.beat('go_out');
    },
    // the run to the last train; at its open door — ⚑ get in, or stay
    async g => {
      const f = facts(g.state);
      g.beds({ wind: 0.5 });
      await g.scene(SCENES.street, { beat: 'run_out' }, { cut: true });
      await g.beat('run_out');
      const r = await g.play(running);
      g.set('run', 1);
      g.set('look_back', 0);
      g.beds({ wind: 0.5, train: 0.6 }, 1);
      const open = g.told('last:open'), came = g.told('last:came');
      await g.scene(SCENES.platform, { beat: 'last', late_run: r.looks >= 2 ? 1 : 0 }, { cut: true });
      const last = g.beat('last');
      await open;
      g.sound.doors();
      if (f.silvaDoor) await g.say('silva', 'Well? Coming, sonny?');
      await came;
      if (f.came !== 'none') await g.say('sarafanov', 'Volodya!');
      else if (f.ninaCame) await g.say('nina', 'Volodya');
      await last;
      const train = await g.choose('train', {
        'train#door': [{ id: 'go', label: tr('Get on the train') }],
        [f.came !== 'none' ? 'sarafanov' : f.ninaCame ? 'nina' : 'far_window']: [{ id: 'stay', label: tr('Stay') }],
      });
      g.apply('train');
      if (train === 'stay') {
        on(g, 'stays:gone', () => g.beds({ wind: 0.4 }, 4));
        await g.beat('stays');
      } else {
        const box = g.told('boards:box');
        on(g, 'boards:in', () => g.sound.doors());
        const boards = g.beat('boards');
        await box;
        if (f.boxHand) await g.say('sarafanov', 'Take it. It goes to the eldest');
        await boards;
        await g.beat('glass');
        const w = await g.play(glass);
        g.set('wipe', Math.max(w.wipe, 0.3)); // (as much seen as he wiped)
        const wave = g.told('away:wave');
        const away = g.beat('away');
        g.beds({ train: 0.8 }, 2);
        await wave;
        if (f.told === 'self' && f.came !== 'none') await g.say('sarafanov', 'Come on Saturday! Do you hear — on Saturday!');
        await away;
      }
    },
    // home, if he stayed: late for the train — or “Tea?”
    async g => {
      const f = facts(g.state);
      if (f.train !== 'stay') return;
      g.beds({ room: 0.4, clock: 0.5 });
      if (f.told === 'self') {
        const sat = g.told('home_late:sat'), box = g.told('home_late:box'), room = g.told('home_late:room');
        await g.scene(SCENES.home, { beat: 'home_late' });
        const home = g.beat('home_late');
        await sat;
        await g.say('busygin', 'I\'ve missed the train');
        await g.say('sarafanov', 'That\'s good. That\'s how it should be');
        await box;
        if (f.boxWhere === 'cupboard') await g.say('sarafanov', 'Will you take it now?');
        await room;
        // now — the phrase for the first time goes on and resolves (≈ 14 s; it ends by itself, in the epilogue
        // already); else it breaks off, as always: `later` — much untruth, it does not heal at once (it resolves in the
        // epilogue); `cut` — no one came for him: the truth said, and the house never one
        if (f.tune === 'now') g.sound.clarinet({ times: 1, resolve: true });
        else g.sound.clarinet({ times: 1 });
        await home;
      } else {
        const turn = g.told('home_anyway:turn');
        await g.scene(SCENES.home, { beat: 'home_anyway' });
        const home = g.beat('home_anyway');
        await turn;
        await g.say('sarafanov', 'Tea?');
        await home;
      }
    },
  ],
};
