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
  titles: ['At night', 'To school', 'The Slaviansky Bazaar'],
  choices: [
    { id: 'wife', weight: '⚑', title: tr('His wife in the doorway'), options: [{ id: 'lie', label: tr('“At the club”') }, { id: 'truth', label: tr('“I was with her”') }] },
  ],
  steps: [
    // At night: he comes home late from her; his wife in the doorway
    async g => {
      g.hero('gurov');
      g.beds(weather(g.state));
      const door = g.told('home_late:door');
      await g.scene(SCENES.moscow, { beat: 'home_late' });
      const late = g.beat('home_late');
      await g.say('narrator', 'She came to Moscow once in two or three months. He came home late from her');
      await door;
      g.sound.door();
      await g.say('wife', 'Where have you been, Dimitri?', 'wife');
      await late;
      const how = await g.choose('wife', { wife: [{ id: 'lie', label: tr('“At the club”') }, { id: 'truth', label: tr('“I was with her”') }] });
      if (how === 'lie') {
        g.next('wife_lie');
        await g.say('gurov', 'At the club. We played till two');
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
        await g.say('gurov', 'I was with her');
        await g.say('wife_low', 'Hush. The children are asleep', 'wife');
        await shut;
        g.sound.door();
        await truth;
      }
    },
    // To school: the morning of another of her visits; he takes his daughter; two lives; a note from her
    async g => {
      g.hero('gurov');
      g.beds(weather(g.state));
      await g.scene(SCENES.moscow, { beat: 'school' });
      const school = g.beat('school');
      g.next('walk_hand');
      await g.say('narrator', 'On another of her visits, in the morning, he was taking his daughter to school');
      await school;
      const walk = g.beat('walk_hand');
      g.next('gate_school');
      await walk;
      let said = 0;
      const r = await g.play(byTheHand, { lines: [
        () => (said = 1, g.say('gurov', 'It’s three degrees above freezing, and yet it is snowing')),
        () => (said = 2, g.say('gurov', 'The thaw is only on the surface of the earth; there is quite a different temperature at a greater height in the atmosphere')),
        () => (said = 3, g.say('daughter', 'And why are there no thunderstorms in the winter, father?')),
        () => (said = 4, g.say('narrator', 'He explained that, too')),
      ] });
      g.set('go', 0);
      g.set('wave', r.stops ? 1 : 0);
      // (what the game did not get to say: in order, the same lines)
      if (said < 1) await g.say('gurov', 'It’s three degrees above freezing, and yet it is snowing');
      if (said < 2) await g.say('gurov', 'The thaw is only on the surface of the earth; there is quite a different temperature at a greater height in the atmosphere');
      if (said < 3) await g.say('daughter', 'And why are there no thunderstorms in the winter, father?');
      if (said < 4) await g.say('narrator', 'He explained that, too');
      const gate = g.beat('gate_school');
      g.next('red_cap');
      await g.say('narrator', 'He had two lives: one open, full of relative truth and of relative falsehood, and another life running its course in secret');
      await g.say('narrator', 'All personal life rests on secrecy');
      await gate;
      const note = g.told('red_cap:note');
      const cap = g.beat('red_cap');
      await note;
      await g.say('narrator', 'A man in a red cap brought him a note');
      await g.letter({ text: tr('I have come. The Slaviansky Bazaar.'), sign: tr('A.'), voice: () => g.say('anna', 'I have come. The Slaviansky Bazaar', 'narrator') });
      g.sound.paper();
      await cap;
    },
    // The Slaviansky Bazaar: her grey dress; grey hair; tea; the cages; taking counsel; “the most complicated and
    // difficult part of it was only just beginning”
    async g => {
      const f = facts(g.state);
      g.hero('both');
      g.beds({ room: 0.3 });
      const piano = g.sound.piano('waltz', { wall: true });
      g.signal.addEventListener('abort', () => piano.stop(1));
      const met = g.told('bazaar_in:met');
      await g.scene(SCENES.bazaar, { beat: 'bazaar_in' });
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
        await g.say('gurov', 'Don’t cry, my darling…');
        await weep;
      };
      const shoulders = async next => {
        const mirror = g.told('shoulders:mirror');
        const hands = g.beat('shoulders');
        g.next(next);
        await mirror;
        await g.say('narrator', 'His hair was already beginning to turn grey');
        await hands;
      };
      const into = g.beat('bazaar_in');
      if (f.heart === 'frank') {
        g.next('shoulders');
        await met;
        await g.say('narrator', 'She was wearing his favourite grey dress');
        await into;
        await shoulders('tea');
        g.beds({ room: 0.3, weep: 0.3 });
        await atTea('cages');
      } else {
        // (as Chekhov has it: he sat, ordered tea, then went to her)
        g.next('tea');
        await met;
        await g.say('narrator', 'She was wearing his favourite grey dress');
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
      await g.say('narrator', 'They were like a pair of birds of passage, male and female, caught and forced to live in different cages');
      if (f.ending === 'cages') await g.say('gurov', 'How can we be free from this intolerable bondage?');
      if (f.ending === 'wife' || f.ending === 'open') await g.say('gurov', 'My wife knows');
      if (f.ending === 'wife') await g.say('anna', 'And what now?');
      if (f.ending === 'husband' || f.ending === 'open') {
        await g.say('anna', 'My husband knows. He let me go — and kept the Pomeranian');
        await g.say('gurov', 'And what now?');
      }
      await cages;
      const taking = g.beat('counsel');
      g.next('bazaar_end');
      await taking;
      const t = await g.play(counsel, {
        window: async () => { await g.say('gurov', 'Move to Moscow'); await g.say('anna', 'And he? He is not to blame for anything'); },
        door: async () => { await g.say('anna', 'If only we could go away together…'); await g.say('gurov', 'And the children?'); },
        table: async () => { await g.say('gurov', 'If only we could see each other every day…'); await g.say('anna', 'And say goodbye every day?'); },
      });
      g.set('think', t.touched.at(-1) ?? 'none');
      await g.say('gurov', 'How? How?');
      // (the scene tells the watch only when the wife does not know: waited for only then)
      const watch = f.wife === 'lie' ? g.told('bazaar_end:watch') : null;
      const end = g.beat('bazaar_end');
      const last = g.say('narrator', 'And it seemed as though in a little while the solution would be found, and then a new and splendid life would begin; and it was clear to both of them that they had still a long, long road before them, and that the most complicated and difficult part of it was only just beginning');
      if (watch && (await watch)) g.sound.watch();
      await last;
      await end;
      piano.stop(4);
    },
  ],
};
