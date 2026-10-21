// IV. The Atlantic «in which the Henrietta burns to the water's edge» — game.md §3. New York: the «China» gone forty-five
// minutes; the «Henrietta» and Captain Speedy; the mutiny; no coal — ⚑ henrietta: buy her and burn her («The boilers») or go
// under sail; Liverpool: the arrest, the cell, the release (~ liverpool: strike or the hand); the special train.
// Reads: facts aouda, pp; marks fix; hands boilers. Leaves: choices henrietta, liverpool; hours, money; marks fix,
// speedy.
import { SCENES, facts, PART_PRICE, PART_HOURS } from '../story.js';
import boilers from '../minigames/boilers.js';

export default {
  number: 'IV',
  title: tr('The Atlantic'),
  heading: tr('in which the Henrietta burns to the water\'s edge'),
  route: [0.78, 0.97],
  titles: ['Forty-five minutes', 'The mutiny', 'No coal', 'The boilers', 'Liverpool', 'The special train'],
  choices: [
    { id: 'henrietta', weight: '⚑', title: tr('The Henrietta'), options: [{ id: 'burn', label: tr('Buy her and burn her') }, { id: 'sails', label: tr('Go under sail') }] },
    { id: 'liverpool', weight: '~', title: tr('Fix at Liverpool'), options: [{ id: 'hit', label: tr('Strike him') }, { id: 'hand', label: tr('Hold out a hand') }] },
  ],
  steps: [
    // New York: the «China» is gone; the «Henrietta» takes no passengers — for two thousand dollars a head she does
    async g => {
      g.hero('fogg');
      g.beds({ town: 0.3, sea: 0.4, clock: 0.3 }, 2);
      const f = facts(g.state);
      const smoke = g.told('new_york:smoke'), speedy = g.told('new_york:speedy');
      await g.scene(SCENES.deck, { beat: 'new_york', ship: 'henrietta', port: 'new_york' });
      const ny = g.beat('new_york');
      await smoke;
      await (f.pp === 'with' ? g.say('pp', 'The China sailed forty-five minutes ago!') : g.say('fix', 'The China sailed forty-five minutes ago!'));
      await speedy;
      await g.say('speedy', 'Bound for Bordeaux. No passengers');
      await g.say('fogg', 'And for two thousand dollars a head?');
      await ny;
      const heads = 2 + (f.aouda === 'with' ? 1 : 0) + (f.pp === 'with' ? 1 : 0);
      g.money(-400 * heads);
      g.sound.notes();
      await g.say('speedy', 'Very well. But the course is for Bordeaux');
    },
    // the mutiny: Speedy locked in his cabin, roaring
    async g => {
      g.hero('fogg');
      g.beds({ sea: 0.5, furnace: 0.3 }, 2);
      const porthole = g.told('mutiny:porthole');
      await g.scene(SCENES.deck, { beat: 'mutiny', ship: 'henrietta', port: 'none' });
      const mutiny = g.beat('mutiny');
      await porthole;
      await g.say('speedy', 'Pirates! I\'ll hang the lot of you!');
      await mutiny;
      await g.say('fogg', 'Course for Liverpool');
    },
    // no coal — ⚑ buy her and burn her, or under sail
    async g => {
      g.hero('fogg');
      g.beds({ sea: 0.5, furnace: 0.15 }, 2);
      const stoker = g.told('coal:stoker'), speedy = g.told('coal:speedy');
      await g.scene(SCENES.deck, { beat: 'coal', ship: 'henrietta', port: 'none' }, { cut: true });
      const coal = g.beat('coal');
      await stoker;
      await g.say('stoker', 'Coal for one day, sir. Four days to Liverpool');
      await speedy;
      await g.say('fogg', 'Captain Speedy, sell me your vessel');
      await g.say('speedy', 'Sixty thousand dollars!');
      await coal;
      const choice = await g.choose('henrietta', {
        'fogg#head': [{ id: 'burn', label: tr('Buy her and burn her') }],
        'speedy#head': [{ id: 'sails', label: tr('Go under sail') }],
      });
      if (choice === 'burn') {
        await g.say('fogg', 'I want only what will burn');
      } else {
        g.hours(-16, tr('Under sail'));
        g.mark('speedy', true);
        const laugh = g.told('sails_only:laugh');
        g.set('sails', 1, 4);
        const sails = g.beat('sails_only');
        await laugh;
        await g.say('speedy', 'Now there\'s a gentleman! Ha-ha-ha!');
        await sails;
      }
    },
    // the boilers: the ship burnt part by part — Passepartout's hands, or Fogg's if Passepartout stayed behind
    async g => {
      if (g.state.choices.henrietta === 'sails') return;
      const f = facts(g.state);
      g.hero(f.pp === 'with' ? 'pp' : 'fogg');
      g.beds({ sea: 0.4, furnace: 0.7 }, 2);
      await g.scene(SCENES.deck, { beat: 'burn', ship: 'henrietta', port: 'none' });
      g.hours(-12, tr('No coal'));
      if (f.pp !== 'with') await g.say('fogg', 'I have no use for a frock-coat now');
      const afford = Math.max(0, Math.floor(g.state.money / PART_PRICE));
      const r = await g.play(boilers, { who: f.pp === 'with' ? 'pp' : 'fogg', money: g.state.money });
      // (skipped, it burns all seven but the cabin: no more than the bag can pay)
      const burned = (r?.burned ?? []).slice(0, afford);
      g.money(-PART_PRICE * burned.length);
      g.hours(PART_HOURS * burned.length, tr('Burnt: {length}', { length: burned.length }));
      g.beds({ sea: 0.4, furnace: 0.2 }, 3);
      await g.beat('queenstown');
    },
    // Liverpool: the arrest; the cell; the release — ~ strike or the hand
    async g => {
      g.hero('fogg');
      g.beds({ town: 0.4, sea: 0.3 }, 2);
      const hand = g.told('liverpool:hand');
      await g.scene(SCENES.deck, { beat: 'liverpool', ship: 'henrietta', port: 'liverpool' });
      const lp = g.beat('liverpool');
      await hand;
      await g.say('fix', 'Phileas Fogg, I arrest you in the Queen\'s name');
      await lp;
      g.beds({ clock: 0.9 }, 2);
      const quick = (g.state.marks.fix ?? 0) >= 2;
      await g.beat('cell', { wait: false });
      await g.move('cell_time', 1, quick ? 8 : 14);
      g.hours(quick ? -1 : -3, tr('The custom-house, the cell'));
      g.beds({ clock: 0.4, town: 0.3 }, 2);
      const choice = await g.choose('liverpool', {
        'fix#head': [{ id: 'hit', label: tr('Strike him') }, { id: 'hand', label: tr('Hold out a hand') }],
      });
      g.set('release', choice === 'hit' ? 'down' : 'hand');
      const inside = g.told('release:in');
      const release = g.beat('release');
      await inside;
      await g.say('fix', 'Sir… the robber was arrested three days ago. Forgive me');
      if (choice === 'hit') {
        g.sound.slap();
        g.mark('hit', true, tr('Fix will remember this'));
      } else {
        g.relate('fix', 1);
      }
      await release;
    },
    // the special train to London, watch in hand
    async g => {
      g.hero('fogg');
      g.beds({ wheels: 0.8, clock: 0.6 }, 2);
      const watch = g.told('special:watch');
      await g.scene(SCENES.train, { beat: 'special', land: 'england' });
      const special = g.beat('special');
      await watch;
      await special;
      const h = g.state.hours;
      if (h >= 0) await g.say('fogg', 'London. On time');
      else {
        // (by how much — the notebook says)
        await g.say('fogg', 'Behind time');
        g.set('book_shut', 1, 1.5);
        await g.told('special:shut', 4000);
        await g.say('fogg', 'Twenty thousand — all that I had');
      }
    },
  ],
};
