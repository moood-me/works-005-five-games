// IV. The Fire (game.md §6). Vasenka on the platform bench with his rucksack — «don't hold me»: the strap (The Rucksack); the
// bridegroom at nine — ~ let Nina go to Sakhalin, ask her to stay for father, or (if she knows the truth) for him; the
// shed on fire (Buckets) — ⚑ take the blame for Vasenka, or let him own up.
// Reads: facts.ninaIs. Leaves: choices.kudimov, .fire; marks.nina_stay, .vasenka, .silva; scales home, lie.
import { SCENES, facts } from '../story.js';
import rucksack from '../minigames/rucksack.js';
import buckets from '../minigames/buckets.js';

// a sound of the game's on a moment of the scene's (not waited for)
const on = (g, moment, fn) => { g.told(moment).then(ok => { if (ok) fn(); }); };

export default {
  number: 'IV', title: tr('The Fire'),
  titles: ['The Rucksack', 'The Fiancé', 'The Fire'],
  choices: [
    { id: 'kudimov', weight: '~', title: tr('The Fiancé'), options: [{ id: 'let', label: tr('“Let her go”') }, { id: 'ask', label: tr('“Nina, stay”') }, { id: 'for_me', label: tr('“Stay. Not for Father\'s sake”') }] },
    { id: 'fire', weight: '⚑', title: tr('The Fire'), options: [{ id: 'blame', label: tr('Take the blame') }, { id: 'own_up', label: tr('Let him own up') }] },
  ],
  steps: [
    // Vasenka on the bench, the train's open door, the strap
    async g => {
      g.beds({ wind: 0.2, rails: 0.3 });
      const sit = g.told('bench:sit');
      await g.scene(SCENES.platform, { beat: 'bench' });
      const bench = g.beat('bench');
      await sit;
      await g.say('vasenka', 'Don\'t hold me back. I\'m going anyway');
      await g.say('busygin', 'I\'m not holding you');
      await bench;
      on(g, 'strap:open', () => g.sound.doors());
      const strap = g.beat('strap');
      g.beds({ wind: 0.2, train: 0.6 }, 2);
      await strap;
      const r = await g.play(rucksack);
      g.set('pull', 0);
      g.set('grip', 1);
      g.set('door_bg', 1);
      g.set('torn', r.slips >= 2 ? 1 : 0);
      const sat = g.told('bench_back:sat');
      const back = g.beat('bench_back');
      g.beds({ wind: 0.2 }, 6);
      await sat;
      await g.say('vasenka', 'All right. Let\'s go and see the fiancé');
      await back;
    },
    // the bridegroom at nine: Sakhalin — ~ what the elder brother says
    async g => {
      g.beds({ room: 0.4, clock: 0.4 });
      on(g, 'table:nine', () => g.sound.strike(9));
      const inside = g.told('table:in'), sat = g.told('table:sat');
      await g.scene(SCENES.home, { beat: 'table' });
      const table = g.beat('table');
      await g.say('narrator', 'The fiancé was expected at nine');
      await inside;
      g.sound.door();
      await g.say('kudimov', 'Twenty-one hundred. Cadet Kudimov');
      await sat;
      await g.say('kudimov', 'Nina says her brother has turned up. Congratulations');
      await table;
      const news = g.told('toast:news'), turn = g.told('toast:turn');
      const toast = g.beat('toast');
      await news;
      await g.say('kudimov', 'I never lie. It\'s a principle with me');
      await g.say('kudimov', 'Nina and I leave on Saturday. For Sakhalin');
      await turn;
      await g.say('sarafanov', 'You say something, Volodya. You\'re the eldest');
      await toast;
      const f = facts(g.state);
      const said = await g.choose('kudimov', {
        kudimov: [{ id: 'let', label: tr('“Let her go”') }],
        sarafanov: [{ id: 'ask', label: tr('“Nina, stay”') }],
        ...(f.ninaIs === 'knows' ? { nina: [{ id: 'for_me', label: tr('“Stay. Not for Father\'s sake”') }] } : {}),
      });
      g.apply('kudimov');
      if (said === 'let') {
        await g.say('busygin', 'Let her go. It\'s her life');
        const glass = g.told('let_go:glass');
        const beat = g.beat('let_go');
        await glass;
        await g.say('sarafanov', 'Yes… Yes, of course');
        await beat;
      } else if (said === 'ask') {
        await g.say('busygin', 'Nina, don\'t go. Father can\'t be left on his own');
        const stand = g.told('ask_stay:stand');
        const beat = g.beat('ask_stay');
        await stand;
        await g.say('kudimov', 'That\'s for us to decide');
        await beat;
      } else {
        await g.say('busygin', 'Stay. Not for Father\'s sake');
        const stand = g.told('for_me:stand');
        const beat = g.beat('for_me');
        await stand;
        await g.say('kudimov', 'I see');
        await beat;
      }
    },
    // the shed on fire: the buckets; who did it — ⚑ take the blame, or let him own up
    async g => {
      g.beds({ wind: 0.3 });
      on(g, 'evening:in', () => g.sound.door());
      await g.scene(SCENES.street, { beat: 'evening' });
      await g.beat('evening');
      const cry = g.told('fire:cry');
      const fire = g.beat('fire');
      g.beds({ wind: 0.3, fire: 0.6, crowd: 0.5 }, 2);
      await cry;
      await g.say('makarskaya', 'Fire! The shed\'s on fire!');
      await fire;
      g.set('beat_next', 'after_fire');
      const r = await g.play(buckets);
      g.set('fire', 0, 3);
      g.set('buckets', 'none'); // (the bucket put away)
      g.set('shed_left', r.buckets >= 3 ? 1 : 0);
      g.set('beat_next', 'after_fire'); // (made ready again, by the keys of how it went)
      g.beds({ wind: 0.3, crowd: 0.3 }, 3);
      const who = g.told('after_fire:who');
      const after = g.beat('after_fire');
      await who;
      await g.say('silva', 'Who set it? I\'ll find him and kill him!');
      await after;
      const blame = await g.choose('fire', {
        makarskaya: [{ id: 'blame', label: tr('Take the blame') }],
        vasenka: [{ id: 'own_up', label: tr('Let him own up') }],
      });
      g.apply('fire');
      if (blame === 'blame') {
        const step = g.told('blame:step');
        const beat = g.beat('blame');
        await step;
        await g.say('busygin', 'It was me. I was smoking by the shed');
        await g.say('silva', 'You?!');
        await beat;
      } else {
        const said = g.told('own_up:said');
        const beat = g.beat('own_up');
        await said;
        await g.say('vasenka', 'It was me. I set it on fire');
        await g.wait(2000);
        await g.say('makarskaya', 'You\'re a fool, Vasenka');
        await beat;
      }
    },
  ],
};
