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
      await g.say('narrator', 'Она приезжала в Москву раз в два-три месяца. Он возвращался от неё поздно');
      await door;
      g.sound.door();
      await g.say('wife', 'Где ты был, Димитрий?', 'wife');
      await late;
      const how = await g.choose('wife', { wife: [{ id: 'lie', label: '«В клубе»' }, { id: 'truth', label: '«Я был у неё»' }] });
      if (how === 'lie') {
        g.next('wife_lie');
        await g.say('gurov', 'В клубе. Играли до двух');
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
        await g.say('gurov', 'Я был у неё');
        await g.say('wife_low', 'Тише. Дети спят', 'wife');
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
      await g.say('narrator', 'В другой её приезд, утром, он вёл дочь в гимназию');
      await school;
      const walk = g.beat('walk_hand');
      g.next('gate_school');
      await walk;
      let said = 0;
      const r = await g.play(zaRuku, { lines: [
        () => (said = 1, g.say('gurov', 'Теперь три градуса тепла, а между тем идёт снег')),
        () => (said = 2, g.say('gurov', 'Это тепло только на поверхности земли, а в верхних слоях атмосферы совсем другая температура')),
        () => (said = 3, g.say('daughter', 'Папа, а отчего зимой не бывает грома?')),
        () => (said = 4, g.say('narrator', 'Он объяснил и это')),
      ] });
      g.set('go', 0);
      g.set('wave', r.stops ? 1 : 0);
      // (what the game did not get to say: in order, the same lines)
      if (said < 1) await g.say('gurov', 'Теперь три градуса тепла, а между тем идёт снег');
      if (said < 2) await g.say('gurov', 'Это тепло только на поверхности земли, а в верхних слоях атмосферы совсем другая температура');
      if (said < 3) await g.say('daughter', 'Папа, а отчего зимой не бывает грома?');
      if (said < 4) await g.say('narrator', 'Он объяснил и это');
      const gate = g.beat('gate_school');
      g.next('red_cap');
      await g.say('narrator', 'У него были две жизни: одна явная, полная условной правды и условного обмана, и другая — тайная');
      await g.say('narrator', 'Каждое личное существование держится на тайне');
      await gate;
      const note = g.told('red_cap:note');
      const cap = g.beat('red_cap');
      await note;
      await g.say('narrator', 'Человек в красной шапке подал ему записку');
      await Promise.all([g.letter({ text: 'Я приехала. «Славянский базар».', sign: 'А.' }), g.say('anna', 'Я приехала. «Славянский базар»', 'narrator')]);
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
        await g.say('gurov', 'Перестань, моя хорошая…');
        await weep;
      };
      const shoulders = async next => {
        const mirror = g.told('shoulders:mirror');
        const hands = g.beat('shoulders');
        g.next(next);
        await mirror;
        await g.say('narrator', 'Голова его уже начинала седеть');
        await hands;
      };
      const into = g.beat('bazar_in');
      if (f.heart === 'frank') {
        g.next('shoulders');
        await met;
        await g.say('narrator', 'Она была в его любимом сером платье');
        await into;
        await shoulders('tea');
        g.beds({ room: 0.3, weep: 0.3 });
        await tea('cages');
      } else {
        // (as Chekhov has it: he sat, ordered tea, then went to her)
        g.next('tea');
        await met;
        await g.say('narrator', 'Она была в его любимом сером платье');
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
      await g.say('narrator', 'Они были как две перелётные птицы, самец и самка, которых поймали и заставили жить в отдельных клетках');
      if (f.ending === 'cages') await g.say('gurov', 'Как освободиться от этих невыносимых пут?');
      if (f.ending === 'wife' || f.ending === 'open') await g.say('gurov', 'Жена знает');
      if (f.ending === 'wife') await g.say('anna', 'И что же теперь?');
      if (f.ending === 'husband' || f.ending === 'open') {
        await g.say('anna', 'Муж знает. Отпустил — а шпица оставил себе');
        await g.say('gurov', 'И что же теперь?');
      }
      await cages;
      const sovetBeat = g.beat('sovet');
      g.next('bazar_end');
      await sovetBeat;
      const t = await g.play(sovet, {
        window: async () => { await g.say('gurov', 'Переезжай в Москву'); await g.say('anna', 'А он? Он ни в чём не виноват'); },
        door: async () => { await g.say('anna', 'Уехать бы вдвоём…'); await g.say('gurov', 'А дети?'); },
        table: async () => { await g.say('gurov', 'Видеться бы каждый день…'); await g.say('anna', 'И каждый день прощаться?'); },
      });
      g.set('think', t.touched.at(-1) ?? 'none');
      await g.say('gurov', 'Как? Как?');
      // (the scene tells the watch only when the wife does not know: waited for only then)
      const watch = f.wife === 'lie' ? g.told('bazar_end:watch') : null;
      const end = g.beat('bazar_end');
      const last = g.say('narrator', 'И казалось, что ещё немного — и решение будет найдено, и тогда начнётся новая, прекрасная жизнь; и обоим было ясно, что до конца ещё далеко-далеко и что самое сложное и трудное только ещё начинается');
      if (watch && (await watch)) g.sound.watch();
      await last;
      await end;
      piano.stop(4);
    },
  ],
};
