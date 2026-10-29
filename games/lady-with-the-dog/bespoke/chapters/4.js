// Chapter IV “The town of S.” — December in S. The fence: Gurov by her house, a piano behind the window (a waltz or a
// study — by her scale); the gate, the old maid with the spitz — call the dog or step round the corner (the spitz
// remembers whether he patted it). The Geisha: the theatre, finding her in the crowd, the husband, the “flunkey”; on
// the stairs — through Anna's eyes: “I will come to Moscow” or “Go away today”. The gate: through Anna's eyes, a month
// later or in spring — lie to her husband (“to the professor”) or tell the truth. game.md §6, chapter IV.
// Reads: facts.life (the piano), facts.dog (the spitz to the call), facts.talk (the interval; “I knew”), facts.spring
// (the gate). Leaves: choices.fence, choices.stairs, choices.husband, marks.maid, marks.husband.
import { SCENES, facts } from '../story.js';
import byTheFence from '../minigames/by-the-fence.js';
import findHer from '../minigames/find-her.js';

export default {
  number: 'IV',
  title: tr('The town of S.'),
  season: s => (facts(s).spring ? 'thaw' : 'winter'),
  titles: [tr('The fence'), tr('The Geisha'), tr('The gate')],
  choices: [
    { id: 'fence', weight: '⚑', title: tr('At the gate'), options: [{ id: 'call', label: tr('Call the dog') }, { id: 'hide', label: tr('Step round the corner') }] },
    { id: 'stairs', weight: '~', title: tr('On the stairs'), options: [{ id: 'promise', label: tr('“I will come to Moscow”') }, { id: 'away', label: tr('“Go away today”') }] },
    { id: 'husband', weight: '⚑', title: tr('Her husband at the gate'), options: [{ id: 'lie', label: tr('“To the professor”') }, { id: 'truth', label: tr('“I am going to him”') }] },
  ],
  steps: [
    // The fence: the inkstand at the hotel; the grey fence; the piano; the gate — call the dog or step round the corner;
    // the poster
    async g => {
      const f = facts(g.state);
      g.hero('gurov');
      g.beds({ snow: 0.3 });
      await g.scene(SCENES.town, { beat: 'inkwell' });
      const inkwell = g.beat('inkwell');
      g.next('fence');
      await g.say('narrator', 'In S. he took the best room at the hotel. On the table was an inkstand: a figure on horseback, with its hat in its hand and its head broken off', 'narrator');
      await inkwell;
      const stops = g.told('fence:stops');
      const fence = g.beat('fence');
      g.next('fence_wait');
      await g.say('narrator', 'The porter said that von Diderits lived in Old Gontcharny Street, in a house of his own');
      await stops;
      await g.say('gurov_inner', 'One would run away from a fence like that', 'gurov');
      await fence;
      const wait = g.beat('fence_wait');
      g.next('gate_open');
      await wait;
      let heard = false;
      const r = await g.play(byTheFence, { tune: f.life === 'life' ? 'waltz' : 'etude', onPiano: () => (heard = true, g.say('narrator', 'He heard a piano; the sounds were faint and indistinct. Probably it was Anna Sergeyevna playing')) });
      if (!heard) await g.say('narrator', 'He heard a piano; the sounds were faint and indistinct. Probably it was Anna Sergeyevna playing');
      g.set('under', r.stood ? 1 : 0);
      g.sound.gate();
      await g.beat('gate_open');
      const how = await g.choose('fence', { spitz: [{ id: 'call', label: tr('Call the dog') }], 'fence#corner': [{ id: 'hide', label: tr('Step round the corner') }] });
      if (how === 'call') {
        g.mark('maid', true, tr('The maid will remember this.'));
        const run = f.dog === 'pat' ? 'call_run' : 'call_bark';
        g.next(run);
        await g.say('narrator', 'He wanted to call to the dog — and could not remember its name');
        const call = g.beat(run);
        g.next('fence_dusk');
        if (run === 'call_run') g.sound.yap();
        else g.sound.bark();
        await call;
      } else {
        g.next('corner_hide');
        const corner = g.beat('corner_hide');
        g.next('fence_dusk');
        await corner;
      }
      const poster = g.told('fence_dusk:poster');
      const dusk = g.beat('fence_dusk');
      await poster;
      await g.say('narrator', 'On the fence hung a poster: that evening “The Geisha” was to be given at the theatre for the first time');
      await g.say('gurov_inner', 'So much for the lady with the dog… So much for the adventure… You’re in a nice fix…', 'gurov');
      await dusk;
    },
    // The Geisha: the theatre, finding her; the husband; the interval; the stairs — her answer
    async g => {
      const f = facts(g.state);
      g.hero('gurov');
      g.beds({ hall: 0.5 });
      await g.scene(SCENES.theatre, { beat: 'hall' });
      const hall = g.beat('hall');
      g.next('hall_find');
      g.sound.tuning();
      await hall;
      const find = g.beat('hall_find');
      g.next('husband_in');
      await find;
      const r = await g.play(findHer);
      g.set('enter', 6);
      g.set('glint', 0);
      g.set('noticed', r.wrong ? 1 : 0);
      const sat = g.told('husband_in:sat');
      const husband = g.beat('husband_in');
      g.next(f.talk ? 'interval_stay' : 'interval_out');
      await sat;
      await g.say('narrator', 'She was lost in the provincial crowd, this little woman with a vulgar lorgnette in her hand');
      await g.say('narrator', 'A young man with small side-whiskers, very tall and stooping, came in with her. He bowed at every step');
      await g.say('narrator', 'This was the husband whom at Yalta she had called a flunkey');
      await husband;
      if (!f.talk) {
        const out = g.beat('interval_out');
        g.next('approach');
        await out;
        const at = g.told('approach:at');
        const approach = g.beat('approach');
        g.next('stairs');
        await at;
        await g.say('gurov', 'Good evening');
        await approach;
      } else {
        const stay = g.beat('interval_stay');
        g.next('corridor');
        await stay;
        const meet = g.told('corridor:meet');
        const corridor = g.beat('corridor');
        g.next('stairs');
        await meet;
        await g.say('gurov', 'Good evening');
        await corridor;
      }
      g.hero('anna');
      g.beds({ hall: 0.2 });
      const landing = g.told('stairs:landing');
      const stairs = g.beat('stairs');
      await landing;
      await g.say('anna', 'How you have frightened me! Why have you come? Why?', 'anna');
      await g.say('gurov', 'But do understand, Anna, do understand…');
      await stairs;
      const how = await g.choose('stairs', { anna: [{ id: 'promise', label: tr('“I will come to Moscow”') }], 'stairs#down': [{ id: 'away', label: tr('“Go away today”') }] });
      if (how === 'promise') {
        g.scale('anna', 2);
        g.next('promise_go');
        await g.say('anna', 'I will come and see you in Moscow. I swear I’ll come. But now let us part!');
        const back = g.told('promise_go:back');
        const go = g.beat('promise_go');
        g.next('bell');
        await back;
        await g.say('anna', 'My precious, good one, let us part!');
        await go;
      } else {
        g.scale('anna', -2);
        g.next('away_go');
        await g.say('anna', 'Go away today. I have never been happy, and I never shall be. Don’t make me suffer still more!');
        const go = g.beat('away_go');
        g.next('bell');
        await go;
      }
      const bell = g.beat('bell');
      g.sound.bell();
      await bell;
    },
    // The gate: through Anna's eyes — she leaves “for the professor”; lie to her husband or tell the truth
    async g => {
      const f = facts(g.state);
      g.hero('anna');
      g.beds(f.spring ? { thaw: 0.4 } : { snow: 0.3 });
      const asks = g.told('gate_leave:asks');
      await g.scene(SCENES.town, { beat: 'gate_leave' });
      const gate = g.beat('gate_leave');
      if (f.spring) await g.say('narrator', 'She held out till the spring');
      else await g.say('narrator', 'A month later she made ready to go to Moscow');
      await asks;
      await g.say('diderits', 'When will you be back?');
      await gate;
      const how = await g.choose('husband', { diderits: [{ id: 'lie', label: tr('“To the professor”') }, { id: 'truth', label: tr('“I am going to him”') }] });
      if (how === 'lie') {
        g.next('leave_lie');
        await g.say('anna', 'In a week. The professor told me to come again');
        const envelope = g.told('leave_lie:envelope');
        const goes = g.told('leave_lie:goes');
        const leave = g.beat('leave_lie');
        await envelope;
        await g.say('diderits', 'That’s for the professor. And buy yourself something in Moscow');
        g.sound.paper();
        await goes;
        await g.say('narrator', 'Her husband believed her, and did not believe her');
        await leave;
      } else {
        g.mark('husband', 'knows', tr('Von Diderits will remember this.'));
        g.next('leave_truth');
        const close = g.told('leave_truth:close');
        // (the scene tells this moment only when the maid saw Gurov: waited for only then)
        const still = f.talk ? g.told('leave_truth:still') : null;
        const answer = g.told('leave_truth:answer');
        const pulls = g.told('leave_truth:pulls');
        const leave = g.beat('leave_truth');
        await close;
        await g.say('anna', 'I am going to him', 'anna');
        if (still) {
          await still;
          await g.say('diderits_low', 'I knew', 'diderits');
        }
        await answer;
        await g.say('diderits_low', 'Go. Only the town must not know. The Pomeranian stays with me', 'diderits');
        if (await pulls) g.sound.yap();
        await leave;
      }
    },
  ],
};
