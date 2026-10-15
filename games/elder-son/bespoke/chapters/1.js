// I. Чужие окна (game.md §6). Two knock at the lit windows of the settlement (Окна); one window is left at the end of
// the street; at Sarafanov's door ⚑ ask for the night — or say «I am his son»; hands at the stove (Руки); Sarafanov
// comes home and takes the stranger for his son.
// Reads: nothing. Leaves: choices.entry, scales.lie, shown.lie, shown.home, marks.knocked (the windows knocked at).
import { SCENES } from '../story.js';
import okna from '../minigames/okna.js';
import ruki from '../minigames/ruki.js';

// a sound of the game's on a moment of the scene's (not waited for)
const on = (g, moment, fn) => { g.told(moment).then(ok => { if (ok) fn(); }); };

export default {
  number: 'I', title: 'Чужие окна', wall: false,
  titles: ['Окна', 'У двери', 'Руки', 'Сарафанов'],
  choices: [
    { id: 'entry', weight: '⚑', title: 'У двери', options: [{ id: 'asked', label: 'Попроситься на ночь' }, { id: 'said', label: '«Я его сын»' }] },
  ],
  steps: [
    // the street at night: knock where the light is still on
    async g => {
      g.beds({ wind: 0.5 });
      await g.scene(SCENES.street, { beat: 'walk' }, { cut: true });
      await g.beat('walk');
      await g.say('silva', 'Стучим, где горит свет. Кто-нибудь да пустит');
      await g.beat('knock_ready');
      g.set('beat_next', 'last_window');
      const r = await g.play(okna, { refuse: [
        ref => g.say('neighbor_m', 'Иди, иди отсюда!', ref),
        ref => g.say('neighbor_w', 'Ночь на дворе! Милицию позову!', ref),
        ref => g.say('neighbor_old', 'Нету никого. Спят все', ref),
      ] });
      for (let i = 1; i <= 5; i++) g.set(`win${i}`, 0);
      g.set('knock', 0);
      g.set('snow', 0.7, 2);
      g.mark('knocked', r.knocked.join(''), null);
      const corner = g.told('last_window:corner');
      const last = g.beat('last_window');
      await corner;
      await g.say('narrator', 'Свет остался в одном окне — в конце улицы');
      await last;
    },
    // at the corner Sarafanov at Makarskaya's window; at his own door — ⚑ how to get in
    async g => {
      g.beds({ wind: 0.5 });
      on(g, 'neighbor:knock', () => g.sound.knock());
      on(g, 'neighbor:vasya', () => g.sound.door());
      const answer = g.told('neighbor:answer');
      await g.scene(SCENES.street, { beat: 'neighbor' }, { cut: true });
      const neighbor = g.beat('neighbor');
      await answer;
      await g.say('sarafanov', 'Наталья… Васеньки у вас нет? Простите, ради бога');
      await g.say('makarskaya', 'Нет вашего Васеньки. Идите спать, Андрей Григорьевич', 'mak_window');
      await neighbor;
      on(g, 'porch:knock', () => g.sound.knock());
      const open = g.told('porch:open');
      const porch = g.beat('porch');
      await g.say('silva', 'Сарафанов. Андрей Григорьевич. Сын — Васенька');
      await g.say('silva', 'Слушай, студент. А ведь ты ему — сын. Старший');
      await open;
      g.sound.door();
      await g.say('vasenka', 'Вам кого?', 'vasenka');
      await porch;
      const entry = await g.choose('entry', {
        vasenka: [{ id: 'asked', label: 'Попроситься на ночь' }],
        kitchen: [{ id: 'said', label: 'Сказать: «Я его сын»' }],
      });
      g.gauge('lie');
      g.apply('entry');
      if (entry === 'asked') {
        await g.say('busygin', 'Пусти переночевать. Мы на электричку опоздали');
        const closed = g.told('shut:closed'), again = g.told('shut:again');
        on(g, 'shut:knock', () => g.sound.knock());
        const shut = g.beat('shut');
        await g.say('vasenka', 'Тут не гостиница', 'vasenka');
        await closed;
        g.sound.door();
        await g.say('silva', 'Учись, студент');
        await again;
        g.sound.door();
        await g.say('silva', 'Мы к Андрею Григорьевичу. Вот — сын его. Старший');
        await shut;
      } else {
        await g.say('busygin', 'Я к отцу. Я — сын Андрея Григорьевича');
      }
      const inside = g.beat('in');
      await g.say('vasenka', 'Сын?.. Ну, входите. Отец скоро придёт');
      await inside;
    },
    // hands at the open stove door
    async g => {
      g.beds({ room: 0.4, clock: 0.3 });
      await g.scene(SCENES.home, { beat: 'kitchen' }, { cut: true });
      g.sound.door();
      await g.beat('kitchen');
      await g.play(ruki);
      g.set('thaw', 1);
      g.set('rub', 0);
      const turn = g.told('warm_up:turn');
      const warm = g.beat('warm_up');
      await turn;
      await g.say('vasenka', 'Он вам обрадуется. Он всем радуется');
      await g.say('vasenka', 'А я завтра уезжаю. В тайгу');
      await warm;
    },
    // Sarafanov comes home: «Сын?..»
    async g => {
      g.beds({ wind: 0.4 });
      on(g, 'return:door', () => g.sound.door());
      await g.scene(SCENES.street, { beat: 'return' });
      await g.beat('return');
      g.beds({ room: 0.4, clock: 0.5 }, 1);
      const inside = g.told('enter:in'), near = g.told('enter:near');
      await g.scene(SCENES.home, { beat: 'enter' }, { cut: true });
      const enter = g.beat('enter');
      await inside;
      await g.say('silva', 'Андрей Григорьевич! Не узнаёте? Это же ваш сын');
      await g.say('sarafanov', 'Сын?..');
      await g.wait(2000); // (the clock)
      await g.say('sarafanov', 'Сорок пятый год… Чернигов…');
      await near;
      await g.say('sarafanov', 'Похож. Честное слово, похож');
      await enter;
      const held = g.told('embrace:held');
      const embrace = g.beat('embrace');
      await held;
      g.gauge('home');
      await embrace;
    },
  ],
};
