// II. The Snuffbox (game.md §6). Nina and her cadet at the gate; supper — “All men are brothers!”; tea and Galya Busygina
// (Tea) — ~ “she did” or “never told me”; the grandfather's snuffbox, always the elder son's — ⚑ take it
// (The Snuffbox) or not; the clarinet behind the wall; at dawn — ⚑ slip away (On Tiptoe) or stay (Frost).
// Reads: nothing. Leaves: choices.galya, .box, .dawn; marks.sarafanov; scales home, lie.
import { SCENES } from '../story.js';
import tea from '../minigames/tea.js';
import snuffbox from '../minigames/snuffbox.js';
import tiptoe from '../minigames/tiptoe.js';
import frost from '../minigames/frost.js';

// a sound of the game's on a moment of the scene's (not waited for)
const on = (g, moment, fn) => { g.told(moment).then(ok => { if (ok) fn(); }); };

export default {
  number: 'II', title: tr('Snuffbox'),
  titles: ['Nina', 'Supper', 'Galya', 'The Snuffbox', 'The Clarinet', 'Dawn'],
  choices: [
    { id: 'galya', weight: '~', title: tr('Galya'), options: [{ id: 'remembered', label: tr('“She did”') }, { id: 'never', label: tr('“Never told me”') }] },
    { id: 'box', weight: '⚑', title: tr('Snuffbox'), options: [{ id: 'take', label: tr('Take') }, { id: 'refuse', label: tr('Refuse') }] },
    { id: 'dawn', weight: '⚑', title: tr('Dawn'), options: [{ id: 'leave', label: tr('Slip away') }, { id: 'stay', label: tr('Stay') }] },
  ],
  steps: [
    // Nina and the cadet at the gate; inside — «your brother»
    async g => {
      g.beds({ wind: 0.3 });
      const watch = g.told('gate:watch');
      await g.scene(SCENES.street, { beat: 'gate' });
      const gate = g.beat('gate');
      await watch;
      await g.say('kudimov', 'Zero fifty. I have to be in barracks by one');
      await g.say('nina', 'Go on, Misha. You\'ll be late');
      await gate;
      g.beds({ room: 0.4, clock: 0.4 }, 1);
      const door = g.told('nina_in:door');
      await g.scene(SCENES.home, { beat: 'nina_in' }, { cut: true });
      const nina = g.beat('nina_in');
      await door;
      await g.say('sarafanov', 'Nina! This is Volodya. Your brother');
      await g.say('nina', 'A brother. Well, of course');
      await nina;
    },
    // supper: a toast, the glasses
    async g => {
      g.beds({ room: 0.4, clock: 0.3 });
      const toast = g.told('supper:toast');
      await g.scene(SCENES.home, { beat: 'supper' });
      const supper = g.beat('supper');
      await toast;
      await g.say('sarafanov', 'All men are brothers!');
      await supper;
      await g.choose(null, { 'table#glass': [{ id: 'clink', label: tr('Clink glasses') }] });
      g.sound.glass();
      const after = g.beat('supper_after');
      await g.say('narrator', 'Sarafanov was writing an oratorio, “All Men Are Brothers”');
      await after;
    },
    // tea, and the question that spills over: ~ what to say of Galya
    async g => {
      g.beds({ room: 0.3, clock: 0.5 });
      await g.scene(SCENES.home, { beat: 'talk' });
      const talk = g.beat('talk');
      await g.say('sarafanov', 'Galya Busygina… I wrote to her. She never answered');
      await talk;
      let asked = false;
      await g.play(tea, { ask: () => { asked = true; return g.say('sarafanov', 'Did she… remember me?', 'narrator'); } });
      if (!asked) await g.say('sarafanov', 'Did she… remember me?', 'narrator');
      g.set('glass1', 1);
      g.set('glass2', 1);
      g.set('pour', 0);
      g.set('shake', 0);
      g.set('which', 1);
      g.set('spill', 1); // (the question spills over always; skipped — the same trace)
      g.sound.pour(0, 0.3);
      await g.beat('talk_back');
      const galya = await g.choose('galya', { sarafanov: [{ id: 'remembered', label: tr('“She did”') }, { id: 'never', label: tr('“Never told me”') }] });
      g.apply('galya');
      if (galya === 'remembered') {
        await g.say('busygin', 'She did. Often');
        await g.beat('galya_yes');
      } else {
        await g.say('busygin', 'Mum never told me about you');
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
      await g.say('sarafanov', 'My grandfather\'s snuffbox. It always went to the elder son');
      await g.say('sarafanov', 'Take it');
      await out;
      const box = await g.choose('box', { 'table#box': [{ id: 'take', label: tr('Take') }, { id: 'refuse', label: tr('Refuse') }] });
      g.apply('box');
      if (box === 'take') {
        await g.beat('box_take');
        await g.play(snuffbox, { mode: 'take' });
        for (let i = 1; i <= 4; i++) g.set(`finger${i}`, 1);
        g.set('old', 0);
        const back = g.told('box_kept:back');
        const kept = g.beat('box_kept');
        await back;
        await g.say('sarafanov', 'There. Now my mind\'s at rest');
        await kept;
      } else {
        await g.say('busygin', 'No, don\'t. Let Vasya have it');
        await g.beat('box_give');
        await g.play(snuffbox, { mode: 'give' });
        g.set('push', 1);
        g.set('old_close', 1);
        const shelf = g.told('box_back:shelf');
        const back = g.beat('box_back');
        await shelf;
        await g.say('sarafanov', 'Well… Let it stay where it is. It can wait');
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
      await g.say('silva', 'I\'ve got a dad too. In Chita. Writes once a year — asking for money', 'silva');
      await turn;
      await g.say('narrator', 'Behind the wall he played the same passage over and over. It never went any further');
      await wall;
    },
    // dawn: ⚑ slip away with Silva, or stay
    async g => {
      g.beds({ clock: 0.4, rails: 0.3 });
      const up = g.told('wake:up');
      await g.scene(SCENES.home, { beat: 'wake' });
      const wake = g.beat('wake');
      await up;
      await g.say('silva', 'Rise and shine. The first one\'s at six-oh-five. We slip out quietly');
      await wake;
      const dawn = await g.choose('dawn', {
        'cot_chair#coat': [{ id: 'leave', label: tr('Slip away') }],
        cot: [{ id: 'stay', label: tr('Stay') }],
      });
      g.apply('dawn');
      if (dawn === 'leave') {
        await g.beat('sneak');
        g.beds({ rails: 0.3 }, 1); // (the clock ticks in the minigame itself)
        g.set('beat_next', 'caught');
        const r = await g.play(tiptoe);
        g.set('sneak', 1);
        g.set('stir', 0);
        g.set('heard', r.creaks > 0 ? 1 : 0);
        g.set('beat_next', 'caught'); // (made ready again, by the keys of how it went)
        g.beds({ clock: 0.4, rails: 0.3 }, 1);
        const face = g.told('caught:face'), hook = g.told('caught:hook');
        on(g, 'caught:out', () => g.sound.door());
        const caught = g.beat('caught');
        await face;
        await g.say('sarafanov', 'Leaving…? Nina\'s leaving too. And Vasya. Everyone\'s leaving');
        await g.say('silva', 'We\'re just… going for cigarettes');
        await g.say('sarafanov', 'Stay till evening, Volodya. Nina\'s bringing her fiancé');
        await hook;
        await g.say('sarafanov', 'I\'ll be off. There\'s a rehearsal at the Philharmonic');
        await caught;
      } else {
        const watch = g.beat('window_watch');
        await g.say('silva', 'Sit there, then, sonny');
        await watch;
        const r = await g.play(frost);
        g.set('far_train', 1);
        g.set('hole', Math.max(r.hole, 0.4));
        g.beds({ clock: 0.4, rails: 0.3 }, 1);
        const inside = g.told('morning:in');
        on(g, 'morning:out', () => g.sound.door());
        const morning = g.beat('morning');
        await inside;
        await g.say('sarafanov', 'Can\'t sleep? Nor can I');
        await g.say('sarafanov', 'I\'ll be off. There\'s a rehearsal at the Philharmonic');
        await morning;
      }
      await g.say('narrator', 'He said he was going to the Philharmonic');
    },
  ],
};
