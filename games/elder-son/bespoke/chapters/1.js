// I. Strangers' Windows (game.md §6). Two knock at the lit windows of the settlement (Windows); one window is left at the end of
// the street; at Sarafanov's door ⚑ ask for the night — or say «I am his son»; hands at the stove (Hands); Sarafanov
// comes home and takes the stranger for his son.
// Reads: nothing. Leaves: choices.entry, scales.lie, shown.lie, shown.home, marks.knocked (the windows knocked at).
import { SCENES } from '../story.js';
import windows from '../minigames/windows.js';
import hands from '../minigames/hands.js';

// a sound of the game's on a moment of the scene's (not waited for)
const on = (g, moment, fn) => { g.told(moment).then(ok => { if (ok) fn(); }); };

export default {
  number: 'I', title: tr('Strangers\' Windows'), wall: false,
  titles: ['Windows', 'At the Door', 'Hands', 'Sarafanov'],
  choices: [
    { id: 'entry', weight: '⚑', title: tr('At the Door'), options: [{ id: 'asked', label: tr('Ask for the night') }, { id: 'said', label: tr('“I\'m his son”') }] },
  ],
  steps: [
    // the street at night: knock where the light is still on
    async g => {
      g.beds({ wind: 0.5 });
      const stop = g.told('walk:stop');
      await g.scene(SCENES.street, { beat: 'walk' }, { cut: true });
      const walk = g.beat('walk');
      await stop; // (they stop, the lit windows before them)
      await g.say('silva', 'We knock wherever there\'s a light. Someone\'s bound to let us in');
      await walk;
      await g.beat('knock_ready');
      g.set('beat_next', 'last_window');
      const r = await g.play(windows, { refuse: [
        ref => g.say('neighbor_m', 'Go on, clear off!', ref),
        ref => g.say('neighbor_w', 'It\'s the middle of the night! I\'ll call the police!', ref),
        ref => g.say('neighbor_old', 'Nobody here. They\'re all asleep', ref),
      ] });
      for (let i = 1; i <= 5; i++) g.set(`win${i}`, 0);
      g.set('knock', 0);
      g.set('snow', 0.7, 2);
      g.mark('knocked', r.knocked.join(''), null);
      const corner = g.told('last_window:corner');
      const last = g.beat('last_window');
      await corner;
      await g.say('narrator', 'One window was still lit — at the end of the street');
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
      await g.say('sarafanov', 'Natalya… Is Vasenka with you? Forgive me, for heaven\'s sake');
      await g.say('makarskaya', 'Your Vasenka isn\'t here. Go to bed, Andrei Grigorievich', 'mak_window');
      await neighbor;
      on(g, 'porch:knock', () => g.sound.knock());
      const open = g.told('porch:open');
      const porch = g.beat('porch');
      await g.say('silva', 'Sarafanov. Andrei Grigorievich. The son\'s called Vasenka');
      await g.say('silva', 'Listen, student. You\'re his son, you know. His elder son');
      await open;
      g.sound.door();
      await g.say('vasenka', 'Who do you want?', 'vasenka');
      await porch;
      const entry = await g.choose('entry', {
        vasenka: [{ id: 'asked', label: tr('Ask for the night') }],
        kitchen: [{ id: 'said', label: tr('Say: “I\'m his son”') }],
      });
      g.gauge('lie');
      g.apply('entry');
      if (entry === 'asked') {
        await g.say('busygin', 'Let us stay the night. We missed the train');
        const closed = g.told('shut:closed'), again = g.told('shut:again');
        on(g, 'shut:knock', () => g.sound.knock());
        const shut = g.beat('shut');
        await g.say('vasenka', 'This isn\'t a hotel', 'vasenka');
        await closed;
        g.sound.door();
        await g.say('silva', 'Watch and learn, student');
        await again;
        g.sound.door();
        await g.say('silva', 'We\'re here to see Andrei Grigorievich. Here\'s his son. The elder one');
        await shut;
      } else {
        await g.say('busygin', 'I\'ve come to see my father. I\'m Andrei Grigorievich\'s son');
      }
      const inside = g.beat('in');
      await g.say('vasenka', 'His son…? Well, come in. Father will be back soon');
      await inside;
    },
    // hands at the open stove door
    async g => {
      g.beds({ room: 0.4, clock: 0.3 });
      await g.scene(SCENES.home, { beat: 'kitchen' }, { cut: true });
      g.sound.door();
      await g.beat('kitchen');
      await g.play(hands);
      g.set('thaw', 1);
      g.set('rub', 0);
      const turn = g.told('warm_up:turn');
      const warm = g.beat('warm_up');
      await turn;
      await g.say('vasenka', 'He\'ll be glad to see you. He\'s glad to see everybody');
      await g.say('vasenka', 'And I\'m leaving tomorrow. For the taiga');
      await warm;
    },
    // Sarafanov comes home: “My son…?”
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
      await g.say('silva', 'Andrei Grigorievich! Don\'t you recognise him? It\'s your son');
      await g.say('sarafanov', 'My son…?');
      await g.wait(2000); // (the clock)
      await g.say('sarafanov', 'Nineteen forty-five… Chernigov…');
      await near;
      await g.say('sarafanov', 'He looks like me. My word, he does');
      await enter;
      const held = g.told('embrace:held');
      const embrace = g.beat('embrace');
      await held;
      g.gauge('home');
      await embrace;
    },
  ],
};
