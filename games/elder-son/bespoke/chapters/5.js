// V. The Elder Son (game.md §6). On the porch at night with Nina: «I don't know my father» — his coat on her shoulders
// (The Coat); Sarafanov packs a suitcase to go with him «to your mother» — ⚑ tell him yourself, or keep silent and let
// Silva tell; the run to the last train (Running); at its open door — ⚑ get in, or stay; home, if he stayed.
// On the platform's stairs: those “Together” brings, and those he bound with the truth himself (story.js facts: his
// father, if he told him; Nina, if she knows it from him; Vasenka, if he owned up) — who came so knows who he is.
// Reads: facts (ninaIs, secret, entry, boxWhere, fatherCame, ninaCame, vasyaCame, silvaDoor, boxHand, told, hurt, train,
// tune, ending). Leaves: choices.truth, .train; scales lie. No map after it (game.md §3.5): the epilogue runs on.
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
    { id: 'truth', weight: '⚑', title: tr('Truth'), options: [{ id: 'self', label: tr('Confess') }, { id: 'silent', label: tr('Keep quiet') }] },
    { id: 'train', weight: '⚑', title: tr('Last Train'), options: [{ id: 'stay', label: tr('Stay') }, { id: 'go', label: tr('Get on') }] },
  ],
  steps: [
    // the porch at night: Nina, and his own father
    async g => {
      const f = facts(g.state);
      const sat = g.told('porch_night:sat');
      await g.scene(SCENES.street, { beat: 'porch_night' }, { beds: { wind: 0.3 } });
      const porch = g.beat('porch_night');
      await sat;
      if (f.secret) {
        await g.say('nina', 'Did he tell you? About the orchestra');
        await g.say('busygin', 'Not a word');
      }
      // (L89 is left unanswered — so it is meant: his answer is the choice of V.2)
      if (f.ninaIs === 'knows') await g.say('nina', 'Will you tell him? About yourself');
      else await g.say('nina', 'I\'m glad you came');
      await g.say('busygin', 'I don\'t know my own father. I saw him once — at a station. He didn\'t recognise me');
      await porch;
      await g.beat('shawl');
      await g.play(coat);
      g.set('lay', 1);
      await g.beat('porch_after');
    },
    // the suitcase «to your mother»: ⚑ the truth — his own, or Silva's
    async g => {
      const suitcase = g.told('pack:case'), silva = g.told('pack:silva');
      await g.scene(SCENES.home, { beat: 'pack' }, { beds: { room: 0.3, clock: 0.5 } });
      const pack = g.beat('pack');
      await g.say('silva', 'That\'s it, sonny. The show\'s over. We can still make the last one');
      await suitcase;
      await g.say('sarafanov', 'I\'m coming with you. Nobody needs me here');
      await g.say('sarafanov', 'I\'ll go to your mother. I\'ll ask her to forgive me');
      await silva;
      await g.say('silva', 'Andrei Grigorievich, he\'s no…');
      await pack;
      const truth = await g.choose('truth', {
        'sarafanov#chest': [{ id: 'self', label: tr('Confess') }],
        'silva#chest': [{ id: 'silent', label: tr('Keep quiet') }],
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
        if (facts(g.state).entry === 'asked') await g.say('silva', '…son of yours! He first set eyes on you yesterday. I was the one who called him your son — for a laugh');
        else await g.say('silva', '…son of yours! He first set eyes on you yesterday. He came up with it himself — what an actor');
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
      await g.scene(SCENES.street, { beat: 'run_out' }, { cut: true, beds: { wind: 0.5 } });
      await g.beat('run_out');
      const r = await g.play(running);
      g.set('run', 1);
      g.set('look_back', 0);
      const open = g.told('last:open'), came = g.told('last:came');
      await g.scene(SCENES.platform, { beat: 'last', late_run: r.looks >= 2 ? 1 : 0 }, { cut: true, beds: { wind: 0.5, train: 0.6 } });
      const last = g.beat('last');
      await open;
      g.sound.doors();
      if (f.silvaDoor) await g.say('silva', 'Well? Coming, sonny?');
      await came;
      if (f.fatherCame) await g.say('sarafanov', 'Volodya!');
      else if (f.ninaCame) await g.say('nina', 'Volodya');
      await last;
      // (“Stay” on the one who came for him and stands first: his father, else Nina, else Vasenka; no one — the far
      // window down beyond the gardens)
      const train = await g.choose('train', {
        'train#door': [{ id: 'go', label: tr('Get on') }],
        [f.fatherCame ? 'sarafanov#chest' : f.ninaCame ? 'nina#chest' : f.vasyaCame ? 'vasenka#chest' : 'far_window']: [{ id: 'stay', label: tr('Stay') }],
      });
      g.apply('train');
      if (train === 'stay') {
        on(g, 'stays:gone', () => g.beds({ wind: 0.4 }));
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
        g.beds({ train: 0.8 });
        await wave;
        if (f.told === 'self' && f.fatherCame) await g.say('sarafanov', 'Come on Saturday! Do you hear? On Saturday!');
        await away;
      }
    },
    // home, if he stayed: late for the train — or “Tea?”
    async g => {
      const f = facts(g.state);
      if (f.train !== 'stay') return;
      if (f.told === 'self') {
        const sat = g.told('home_late:sat'), box = g.told('home_late:box'), room = g.told('home_late:room');
        await g.scene(SCENES.home, { beat: 'home_late' }, { beds: { room: 0.4, clock: 0.5 } });
        const home = g.beat('home_late');
        await sat;
        await g.say('busygin', 'I\'ve missed the train');
        await g.say('sarafanov', 'That\'s good. That\'s how it should be');
        await box;
        if (f.boxWhere === 'cupboard') await g.say('sarafanov', 'Will you take it now?');
        await room;
        // now — the phrase for the first time goes on and resolves (≈ 14 s; it ends by itself, in the epilogue
        // already); else it breaks off, as always: `later` — much untruth, or only the truth brought them to the
        // platform (the house cold all evening): it does not heal at once — it resolves in the epilogue, from afar
        // (stopped if the step is left; played through, it is over by itself)
        const c = g.sound.clarinet(f.tune === 'now' ? { times: 1, resolve: true } : { times: 1 });
        g.signal.addEventListener('abort', () => c.stop(0.3));
        await home;
      } else {
        const turn = g.told('home_anyway:turn');
        await g.scene(SCENES.home, { beat: 'home_anyway' }, { beds: { room: 0.4, clock: 0.5 } });
        const home = g.beat('home_anyway');
        await turn;
        await g.say('sarafanov', 'Tea?');
        await home;
      }
    },
  ],
};
