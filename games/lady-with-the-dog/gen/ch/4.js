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
      await SAY(59, 'narrator');
      await inkwell;
      const stops = g.told('fence:stops');
      const fence = g.beat('fence');
      g.next('fence_wait');
      await SAY(60);
      await stops;
      await SAY(61, 'gurov');
      await fence;
      const wait = g.beat('fence_wait');
      g.next('gate_open');
      await wait;
      let heard = false;
      const r = await g.play(byTheFence, { tune: f.life === 'life' ? 'waltz' : 'etude', onPiano: () => (heard = true, SAY(62)) });
      if (!heard) await SAY(62);
      g.set('under', r.stood ? 1 : 0);
      g.sound.gate();
      await g.beat('gate_open');
      const how = await g.choose('fence', { spitz: [{ id: 'call', label: tr('Call the dog') }], 'fence#corner': [{ id: 'hide', label: tr('Step round the corner') }] });
      if (how === 'call') {
        g.mark('maid', true, tr('The maid will remember this.'));
        const run = f.dog === 'pat' ? 'call_run' : 'call_bark';
        g.next(run);
        await SAY(63);
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
      await SAY(65);
      await SAY(64, 'gurov');
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
      await SAY(66);
      await SAY(67);
      await SAY(68);
      await husband;
      if (!f.talk) {
        const out = g.beat('interval_out');
        g.next('approach');
        await out;
        const at = g.told('approach:at');
        const approach = g.beat('approach');
        g.next('stairs');
        await at;
        await SAY(69);
        await approach;
      } else {
        const stay = g.beat('interval_stay');
        g.next('corridor');
        await stay;
        const meet = g.told('corridor:meet');
        const corridor = g.beat('corridor');
        g.next('stairs');
        await meet;
        await SAY(69);
        await corridor;
      }
      g.hero('anna');
      g.beds({ hall: 0.2 });
      const landing = g.told('stairs:landing');
      const stairs = g.beat('stairs');
      await landing;
      await SAY(70, 'anna');
      await SAY(71);
      await stairs;
      const how = await g.choose('stairs', { anna: [{ id: 'promise', label: tr('“I will come to Moscow”') }], 'stairs#down': [{ id: 'away', label: tr('“Go away today”') }] });
      if (how === 'promise') {
        g.scale('anna', 2);
        g.next('promise_go');
        await SAY(72);
        const back = g.told('promise_go:back');
        const go = g.beat('promise_go');
        g.next('bell');
        await back;
        await SAY(73);
        await go;
      } else {
        g.scale('anna', -2);
        g.next('away_go');
        await SAY(74);
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
      if (f.spring) await SAY(76);
      else await SAY(75);
      await asks;
      await SAY(77);
      await gate;
      const how = await g.choose('husband', { diderits: [{ id: 'lie', label: tr('“To the professor”') }, { id: 'truth', label: tr('“I am going to him”') }] });
      if (how === 'lie') {
        g.next('leave_lie');
        await SAY(78);
        const envelope = g.told('leave_lie:envelope');
        const goes = g.told('leave_lie:goes');
        const leave = g.beat('leave_lie');
        await envelope;
        await SAY(114);
        g.sound.paper();
        await goes;
        await SAY(79);
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
        await SAY(80, 'anna');
        if (still) {
          await still;
          await SAY(81, 'diderits');
        }
        await answer;
        await SAY(82, 'diderits');
        if (await pulls) g.sound.yap();
        await leave;
      }
    },
  ],
};
