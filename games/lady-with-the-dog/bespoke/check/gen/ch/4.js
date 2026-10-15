// Глава IV «Город С.» — декабрь в С. Забор: Гуров у её дома, рояль за окном (вальс или этюд — по её шкале); калитка,
// старая горничная со шпицем — позвать шпица или отойти за угол (шпиц помнит, гладил ли он его). Гейша: театр, найти её
// в толпе, муж-«лакей»; на лестнице — глазами Анны: «Я приеду к вам в Москву» или «Уезжайте сегодня же». Калитка:
// глазами Анны, через месяц или весной — солгать мужу («к профессору») или сказать правду. game.md §6 «Глава IV».
// Читает: facts.life (рояль), facts.dog (шпиц на зов), facts.talk (антракт; «Я знал»), facts.spring (калитка).
// Оставляет: choices.fence, choices.stairs, choices.husband, marks.maid, marks.husband.
import { SCENES, facts } from '../story.js';
import uZabora from '../minigames/u-zabora.js';
import najti from '../minigames/najti.js';

export default {
  number: 'IV',
  title: 'Город С.',
  season: s => (facts(s).spring ? 'thaw' : 'winter'),
  titles: ['Забор', 'Гейша', 'Калитка'],
  choices: [
    { id: 'fence', weight: '⚑', title: 'У калитки', options: [{ id: 'call', label: 'Позвать шпица' }, { id: 'hide', label: 'Отойти за угол' }] },
    { id: 'stairs', weight: '~', title: 'На лестнице', options: [{ id: 'promise', label: '«Я приеду к вам в Москву»' }, { id: 'away', label: '«Уезжайте сегодня же»' }] },
    { id: 'husband', weight: '⚑', title: 'Муж у калитки', options: [{ id: 'lie', label: '«К профессору»' }, { id: 'truth', label: '«Я еду к нему»' }] },
  ],
  steps: [
    // Забор: чернильница в гостинице; серый забор; рояль; калитка — позвать шпица или отойти за угол; афиша
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
      const r = await g.play(uZabora, { tune: f.life === 'life' ? 'waltz' : 'etude', onPiano: () => (heard = true, SAY(62)) });
      if (!heard) await SAY(62);
      g.set('under', r.stood ? 1 : 0);
      g.sound.gate();
      await g.beat('gate_open');
      const how = await g.choose('fence', { spitz: [{ id: 'call', label: 'Позвать шпица' }], 'fence#corner': [{ id: 'hide', label: 'Отойти за угол' }] });
      if (how === 'call') {
        g.mark('maid', true, 'Горничная это запомнит.');
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
    // Гейша: театр, найти её; муж; антракт; лестница — её ответ
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
      const r = await g.play(najti);
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
      const how = await g.choose('stairs', { anna: [{ id: 'promise', label: '«Я приеду к вам в Москву»' }], 'stairs#down': [{ id: 'away', label: '«Уезжайте сегодня же»' }] });
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
    // Калитка: глазами Анны — она уезжает «к профессору»; солгать мужу или сказать правду
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
      const how = await g.choose('husband', { diderits: [{ id: 'lie', label: '«К профессору»' }, { id: 'truth', label: '«Я еду к нему»' }] });
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
        g.mark('husband', 'knows', 'Фон Дидериц это запомнит.');
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
