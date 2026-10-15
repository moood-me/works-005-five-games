// II. Табакерка (game.md §6). Nina and her cadet at the gate; supper — «Все люди — братья!»; tea and Galya Busygina
// (Чай) — ~ «she remembered» or «she never told»; the grandfather's snuffbox, always the elder son's — ⚑ take it
// (Табакерка) or not; the clarinet behind the wall; at dawn — ⚑ slip away (На цыпочках) or stay (Иней).
// Reads: nothing. Leaves: choices.galya, .box, .dawn; marks.sarafanov; scales home, lie.
import { SCENES } from '../story.js';
import chai from '../minigames/chai.js';
import tabakerka from '../minigames/tabakerka.js';
import tsypochki from '../minigames/tsypochki.js';
import inei from '../minigames/inei.js';

// a sound of the game's on a moment of the scene's (not waited for)
const on = (g, moment, fn) => { g.told(moment).then(ok => { if (ok) fn(); }); };

export default {
  number: 'II', title: 'Табакерка',
  titles: ['Нина', 'Ужин', 'Галя', 'Табакерка', 'Кларнет', 'Рассвет'],
  choices: [
    { id: 'galya', weight: '~', title: 'Галя', options: [{ id: 'remembered', label: '«Помнила»' }, { id: 'never', label: '«Не рассказывала»' }] },
    { id: 'box', weight: '⚑', title: 'Табакерка', options: [{ id: 'take', label: 'Взять' }, { id: 'refuse', label: 'Не брать' }] },
    { id: 'dawn', weight: '⚑', title: 'Рассвет', options: [{ id: 'leave', label: 'Уйти тайком' }, { id: 'stay', label: 'Остаться' }] },
  ],
  steps: [
    // Nina and the cadet at the gate; inside — «your brother»
    async g => {
      g.beds({ wind: 0.3 });
      const watch = g.told('gate:watch');
      await g.scene(SCENES.street, { beat: 'gate' });
      const gate = g.beat('gate');
      await watch;
      await g.say('kudimov', 'Ноль пятьдесят. В час я должен быть в казарме');
      await g.say('nina', 'Иди, Миша. Опоздаешь');
      await gate;
      g.beds({ room: 0.4, clock: 0.4 }, 1);
      const door = g.told('nina_in:door');
      await g.scene(SCENES.home, { beat: 'nina_in' }, { cut: true });
      const nina = g.beat('nina_in');
      await door;
      await g.say('sarafanov', 'Нина! Это Володя. Твой брат');
      await g.say('nina', 'Брат. Ну конечно');
      await nina;
    },
    // supper: a toast, the glasses
    async g => {
      g.beds({ room: 0.4, clock: 0.3 });
      const toast = g.told('supper:toast');
      await g.scene(SCENES.home, { beat: 'supper' });
      const supper = g.beat('supper');
      await toast;
      await g.say('sarafanov', 'Все люди — братья!');
      await supper;
      await g.choose(null, { 'table#glass': [{ id: 'clink', label: 'Чокнуться' }] });
      g.sound.glass();
      const after = g.beat('supper_after');
      await g.say('narrator', 'Сарафанов писал ораторию «Все люди — братья»');
      await after;
    },
    // tea, and the question that spills over: ~ what to say of Galya
    async g => {
      g.beds({ room: 0.3, clock: 0.5 });
      await g.scene(SCENES.home, { beat: 'talk' });
      const talk = g.beat('talk');
      await g.say('sarafanov', 'Галя Бусыгина… Я ей писал. Она не ответила');
      await talk;
      let asked = false;
      await g.play(chai, { ask: () => { asked = true; return g.say('sarafanov', 'Она меня… вспоминала?', 'narrator'); } });
      if (!asked) await g.say('sarafanov', 'Она меня… вспоминала?', 'narrator');
      g.set('glass1', 1);
      g.set('glass2', 1);
      g.set('pour', 0);
      g.set('shake', 0);
      g.set('which', 1);
      g.set('spill', 1); // (the question spills over always; skipped — the same trace)
      g.sound.pour(0, 0.3);
      await g.beat('talk_back');
      const galya = await g.choose('galya', { sarafanov: [{ id: 'remembered', label: '«Помнила»' }, { id: 'never', label: '«Не рассказывала»' }] });
      g.apply('galya');
      if (galya === 'remembered') {
        await g.say('busygin', 'Помнила. Часто');
        await g.beat('galya_yes');
      } else {
        await g.say('busygin', 'Мама про вас не рассказывала');
        await g.beat('galya_no');
      }
    },
    // the snuffbox, always the elder son's: ⚑ take it or not
    async g => {
      g.beds({ room: 0.3, clock: 0.5 });
      const down = g.told('box_out:down');
      await g.scene(SCENES.home, { beat: 'box_out' }, { cut: true });
      const out = g.beat('box_out');
      await down;
      await g.say('sarafanov', 'Табакерка моего деда. Её всегда отдавали старшему сыну');
      await g.say('sarafanov', 'Возьми');
      await out;
      const box = await g.choose('box', { 'table#box': [{ id: 'take', label: 'Взять' }, { id: 'refuse', label: 'Не брать' }] });
      g.apply('box');
      if (box === 'take') {
        await g.beat('box_take');
        await g.play(tabakerka, { mode: 'take' });
        for (let i = 1; i <= 4; i++) g.set(`finger${i}`, 1);
        g.set('old', 0);
        const back = g.told('box_kept:back');
        const kept = g.beat('box_kept');
        await back;
        await g.say('sarafanov', 'Ну вот. Теперь я спокоен');
        await kept;
      } else {
        await g.say('busygin', 'Не надо. Пусть Васе');
        await g.beat('box_give');
        await g.play(tabakerka, { mode: 'give' });
        g.set('push', 1);
        g.set('old_close', 1);
        const shelf = g.told('box_back:shelf');
        const back = g.beat('box_back');
        await shelf;
        await g.say('sarafanov', 'Ну… Пусть полежит. Она подождёт');
        await back;
      }
    },
    // the clarinet behind the wall: the same place, and no further
    async g => {
      g.beds({ clock: 0.25 });
      on(g, 'wall:dark', () => g.sound.clarinet({ times: 2 }));
      const turn = g.told('wall:turn');
      await g.scene(SCENES.home, { beat: 'wall' });
      const wall = g.beat('wall');
      await g.say('silva', 'У меня батя тоже есть. В Чите. Пишет раз в год — денег просит', 'silva');
      await turn;
      await g.say('narrator', 'За стеной он играл одно и то же место. Дальше оно не шло');
      await wall;
    },
    // dawn: ⚑ slip away with Silva, or stay
    async g => {
      g.beds({ clock: 0.4, rails: 0.3 });
      const up = g.told('wake:up');
      await g.scene(SCENES.home, { beat: 'wake' });
      const wake = g.beat('wake');
      await up;
      await g.say('silva', 'Подъём. Первая — в шесть ноль пять. Уходим по-тихому');
      await wake;
      const dawn = await g.choose('dawn', {
        'cot_chair#coat': [{ id: 'leave', label: 'Уйти тайком' }],
        cot: [{ id: 'stay', label: 'Остаться' }],
      });
      g.apply('dawn');
      if (dawn === 'leave') {
        await g.beat('sneak');
        g.beds({ rails: 0.3 }, 1); // (the clock ticks in the minigame itself)
        g.set('beat_next', 'caught');
        const r = await g.play(tsypochki);
        g.set('sneak', 1);
        g.set('stir', 0);
        g.set('heard', r.creaks > 0 ? 1 : 0);
        g.set('beat_next', 'caught'); // (made ready again, by the keys of how it went)
        g.beds({ clock: 0.4, rails: 0.3 }, 1);
        const face = g.told('caught:face'), hook = g.told('caught:hook');
        on(g, 'caught:out', () => g.sound.door());
        const caught = g.beat('caught');
        await face;
        await g.say('sarafanov', 'Уходите?.. Вот и Нина уходит. И Вася. Все уходят');
        await g.say('silva', 'Да мы… за папиросами');
        await g.say('sarafanov', 'Останься до вечера, Володя. Нина жениха приведёт');
        await hook;
        await g.say('sarafanov', 'Пойду. В филармонии репетиция');
        await caught;
      } else {
        const watch = g.beat('window_watch');
        await g.say('silva', 'Ну и сиди, сынок');
        await watch;
        const r = await g.play(inei);
        g.set('far_train', 1);
        g.set('hole', Math.max(r.hole, 0.4));
        g.beds({ clock: 0.4, rails: 0.3 }, 1);
        const inside = g.told('morning:in');
        on(g, 'morning:out', () => g.sound.door());
        const morning = g.beat('morning');
        await inside;
        await g.say('sarafanov', 'Не спится? И мне');
        await g.say('sarafanov', 'Пойду. В филармонии репетиция');
        await morning;
      }
      await g.say('narrator', 'Он сказал, что идёт в филармонию');
    },
  ],
};
