// Глава V «Две жизни» — Москва, зима (или оттепель, если она продержалась до весны). Ночью: «Где ты был, Димитрий?» —
// солгать жене или сказать правду. В гимназию: он ведёт дочь, «три градуса тепла»; две жизни; записка. «Славянский
// базар»: седина в зеркале, чай, «как две перелётные птицы», слова концовки — кто из супругов знает; советоваться;
// последняя фраза Чехова. game.md §6 «Глава V».
// Читает: facts.spring (подложка погоды), facts.heart (сначала к ней или сначала чай), facts.wife (часы),
// facts.ending (слова концовки); через carry — wife_knows, husband_knows. Оставляет: choices.wife, marks.wife.
import { SCENES, facts } from '../story.js';
import zaRuku from '../minigames/za-ruku.js';
import chaj from '../minigames/chaj.js';
import sovet from '../minigames/sovet.js';

const weather = state => (facts(state).spring ? { thaw: 0.4 } : { snow: 0.4 });

export default {
  number: 'V',
  title: 'Две жизни',
  season: s => (facts(s).spring ? 'thaw' : 'winter'),
  titles: ['Ночью', 'В гимназию', 'Славянский базар'],
  choices: [
    { id: 'wife', weight: '⚑', title: 'Жена в дверях', options: [{ id: 'lie', label: '«В клубе»' }, { id: 'truth', label: '«Я был у неё»' }] },
  ],
  steps: [
    // Ночью: он возвращается от неё поздно; жена в дверях
    async g => {
      g.hero('gurov');
      g.beds(weather(g.state));
      const door = g.told('home_late:door');
      await g.scene(SCENES.moscow, { beat: 'home_late' });
      const late = g.beat('home_late');
      await SAY(83);
      await door;
      g.sound.door();
      await SAY(84, 'wife');
      await late;
      const how = await g.choose('wife', { wife: [{ id: 'lie', label: '«В клубе»' }, { id: 'truth', label: '«Я был у неё»' }] });
      if (how === 'lie') {
        g.next('wife_lie');
        await SAY(85);
        const inn = g.told('wife_lie:in');
        const lie = g.beat('wife_lie');
        await inn;
        g.sound.door();
        await lie;
      } else {
        g.mark('wife', 'knows', 'Жена это запомнит.');
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
    // В гимназию: утро другого её приезда; он ведёт дочь; две жизни; записка от неё
    async g => {
      g.hero('gurov');
      g.beds(weather(g.state));
      await g.scene(SCENES.moscow, { beat: 'school' });
      const school = g.beat('school');
      g.next('walk_hand');
      await SAY(88);
      await school;
      const walk = g.beat('walk_hand');
      g.next('gate_school');
      await walk;
      let said = 0;
      const r = await g.play(zaRuku, { lines: [
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
      await Promise.all([g.letter({ text: 'Я приехала. «Славянский базар».', sign: 'А.' }), SAY(96, 'narrator')]);
      g.sound.paper();
      await cap;
    },
    // «Славянский базар»: её серое платье; седина; чай; клетки; советоваться; «самое сложное и трудное только ещё начинается»
    async g => {
      const f = facts(g.state);
      g.hero('both');
      g.beds({ room: 0.3 });
      const piano = g.sound.piano('waltz', { wall: true });
      g.signal.addEventListener('abort', () => piano.stop(1));
      const met = g.told('bazar_in:met');
      await g.scene(SCENES.bazar, { beat: 'bazar_in' });
      const tea = async next => {
        const pour = g.beat('tea');
        g.next('weep');
        await pour;
        const r = await g.play(chaj);
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
      const into = g.beat('bazar_in');
      if (f.heart === 'frank') {
        g.next('shoulders');
        await met;
        await SAY(97);
        await into;
        await shoulders('tea');
        g.beds({ room: 0.3, weep: 0.3 });
        await tea('cages');
      } else {
        // (as Chekhov has it: he sat, ordered tea, then went to her)
        g.next('tea');
        await met;
        await SAY(97);
        await into;
        g.beds({ room: 0.3, weep: 0.3 });
        await tea('shoulders');
        await shoulders('cages');
      }
      g.beds({ room: 0.3 });
      const turned = g.told('cages:turned');
      const cages = g.beat('cages');
      g.next('sovet');
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
      const sovetBeat = g.beat('sovet');
      g.next('bazar_end');
      await sovetBeat;
      const t = await g.play(sovet, {
        window: async () => { await SAY(106); await SAY(107); },
        door: async () => { await SAY(108); await SAY(109); },
        table: async () => { await SAY(110); await SAY(111); },
      });
      g.set('think', t.touched.at(-1) ?? 'none');
      await SAY(112);
      // (the scene tells the watch only when the wife does not know: waited for only then)
      const watch = f.wife === 'lie' ? g.told('bazar_end:watch') : null;
      const end = g.beat('bazar_end');
      const last = SAY(113);
      if (watch && (await watch)) g.sound.watch();
      await last;
      await end;
      piano.stop(4);
    },
  ],
};
