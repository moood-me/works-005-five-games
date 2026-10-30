// Chapter V “Two lives” — Moscow, winter (or the thaw, if she held out till the spring). At night: “Where have you been,
// Dimitri?” — lie to his wife or tell the truth. To school: he takes his daughter, “three degrees above freezing”; two
// lives; a note. The Slaviansky Bazaar: grey hair in the mirror, tea, “like a pair of birds of passage”, the ending's
// words — who of the spouses knows; taking counsel; Chekhov's last sentence. game.md §6, chapter V.
// Reads: facts.spring (the weather's bed of sound), facts.heart (to her first or the tea first), facts.wife (the
// watch), facts.ending (the ending's words); through carry — wife_knows, husband_knows. Leaves: choices.wife,
// marks.wife.
import { SCENES, facts } from '../story.js';
import byTheHand from '../minigames/by-the-hand.js';
import tea from '../minigames/tea.js';
import counsel from '../minigames/counsel.js';

const weather = state => (facts(state).spring ? { thaw: 0.4 } : { snow: 0.4 });

export default {
  number: 'V',
  title: tr('Two lives'),
  season: s => (facts(s).spring ? 'thaw' : 'winter'),
  titles: [tr('At night'), tr('To school'), tr('The Slaviansky Bazaar')],
  choices: [
    { id: 'wife', weight: '⚑', title: tr('His wife in the doorway'), options: [{ id: 'lie', label: tr('“At the club”') }, { id: 'truth', label: tr('“I was with her”') }] },
  ],
  steps: [
    // At night: he comes home late from her; his wife in the doorway
    async g => {
      const door = g.told('home_late:door');
      await g.scene(SCENES.moscow, { beat: 'home_late' }, { beds: weather(g.state) });
      const late = g.beat('home_late');
      await SAY(83);
      await door;
      g.sound.door();
      await SAY(84, 'wife');
      await late;
      const how = await g.choose('wife', { gurov: [{ id: 'lie', label: tr('“At the club”') }, { id: 'truth', label: tr('“I was with her”') }] });
      if (how === 'lie') {
        g.next('wife_lie');
        await SAY(85);
        const inn = g.told('wife_lie:in');
        const lie = g.beat('wife_lie');
        await inn;
        g.sound.door();
        await lie;
      } else {
        g.mark('wife', 'knows', tr('His wife will remember this.'));
        g.next('wife_truth');
        // (the beat first: her close-up holds while he says it and she answers)
        const shut = g.told('wife_truth:door');
        const truth = g.beat('wife_truth');
        await SAY(86);
        await SAY(87, 'wife');
        await shut;
        g.sound.door();
        await truth;
      }
    },
    // To school: the morning of another of her visits; he takes his daughter; two lives; a note from her
    async g => {
      await g.scene(SCENES.moscow, { beat: 'school' }, { beds: weather(g.state) });
      const school = g.beat('school');
      g.next('walk_hand');
      await SAY(88);
      await school;
      const walk = g.beat('walk_hand');
      g.next('gate_school');
      await walk;
      let said = 0;
      const r = await g.play(byTheHand, { lines: [
        () => (said = 1, SAY(89)),
        () => (said = 2, SAY(90)),
        () => (said = 3, SAY(91)),
        () => (said = 4, SAY(92)),
      ] });
      g.set('go', 0);
      g.set('wave', r.stops ? 1 : 0);
      // (what the game did not get to say: in order, the same lines)
      if (said < 1) await SAY(89);
      if (said < 2) await SAY(90);
      if (said < 3) await SAY(91);
      if (said < 4) await SAY(92);
      const gate = g.beat('gate_school');
      g.next('red_cap');
      await SAY(93);
      await SAY(94);
      await gate;
      const note = g.told('red_cap:note');
      const cap = g.beat('red_cap');
      await note;
      await SAY(95);
      await g.letter({ text: tr('I have come. The Slaviansky Bazaar.'), sign: tr('A.'), voice: () => SAY(96, 'narrator') });
      g.sound.paper();
      await cap;
    },
    // The Slaviansky Bazaar: her grey dress; grey hair; tea; the cages; taking counsel; “the most complicated and
    // difficult part of it was only just beginning”
    async g => {
      const f = facts(g.state);
      const piano = g.sound.piano('waltz', { wall: true });
      g.signal.addEventListener('abort', () => piano.stop(1));
      const met = g.told('bazaar_in:met');
      await g.scene(SCENES.bazaar, { beat: 'bazaar_in' }, { beds: { room: 0.3 } });
      const atTea = async next => {
        const pour = g.beat('tea');
        g.next('weep');
        await pour;
        const r = await g.play(tea);
        g.set('glass_at', 1);
        g.set('tap', 0);
        g.set('fill', 0.9);
        g.set('spill', 0);
        g.set('stain', r.spills ? 1 : 0);
        const weep = g.beat('weep');
        g.next(next);
        await SAY(98);
        await weep;
      };
      const shoulders = async next => {
        const mirror = g.told('shoulders:mirror');
        const hands = g.beat('shoulders');
        g.next(next);
        await mirror;
        await SAY(99);
        await hands;
      };
      const into = g.beat('bazaar_in');
      if (f.heart === 'frank') {
        g.next('shoulders');
        await met;
        await SAY(97);
        await into;
        await shoulders('tea');
        g.beds({ room: 0.3, weep: 0.3 });
        await atTea('cages');
      } else {
        // (as Chekhov has it: he sat, ordered tea, then went to her)
        g.next('tea');
        await met;
        await SAY(97);
        await into;
        g.beds({ room: 0.3, weep: 0.3 });
        await atTea('shoulders');
        await shoulders('cages');
      }
      g.beds({ room: 0.3 });
      const turned = g.told('cages:turned');
      const cages = g.beat('cages');
      g.next('counsel');
      await turned;
      await SAY(100);
      if (f.ending === 'cages') await SAY(101);
      if (f.ending === 'wife' || f.ending === 'open') await SAY(102);
      if (f.ending === 'wife') await SAY(103);
      if (f.ending === 'husband' || f.ending === 'open') {
        await SAY(104);
        await SAY(105);
      }
      await cages;
      const taking = g.beat('counsel');
      g.next('bazaar_end');
      await taking;
      const t = await g.play(counsel, {
        window: async () => { await SAY(106); await SAY(107); },
        door: async () => { await SAY(108); await SAY(109); },
        table: async () => { await SAY(110); await SAY(111); },
      });
      g.set('think', t.touched.at(-1) ?? 'none');
      await SAY(112);
      // (the scene tells the watch only when the wife does not know: waited for only then)
      const watch = f.wife === 'lie' ? g.told('bazaar_end:watch') : null;
      const end = g.beat('bazaar_end');
      const last = SAY(113);
      if (watch && (await watch)) g.sound.watch();
      await last;
      await end;
      piano.stop(4);
    },
  ],
};
