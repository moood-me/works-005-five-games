// V. Scarlet Sails — the morning the ship comes, cut through the frame: «Course» in three legs on the deck, between
// them the house and the shore — how she comes to see the sails, as the play has ended it (facts.ending): the beetle
// and «Look» (grin), the cry twice (cry), her father waking her (waited, kaperna) —; then the way to the water,
// the hands («Hand»), the meeting, the boat leaving. No choices: every earlier one is read here. Every step opens
// its scene by a cut. design.md, game.md §6.
// Reads: facts.ending, sea, longren, girlToy; scales.sea; marks.kurs1…kurs3. Leaves: marks.kurs1, kurs2, kurs3 (how
// steady each leg was), marks.morning (the hour the ship comes: clumsiness and Home cost time only).
import { SCENES, facts } from '../story.js';
import kurs from '../minigames/kurs.js';
import smotri from '../minigames/smotri.js';
import ruka from '../minigames/ruka.js';

// The hour of each cut of the chapter, in the order they are shown — the deck's `sun`, the house's `sun`, the
// shore's `morning`: time only goes forward, whatever the ending. All of it follows from the play (g.state), so a
// step played after a reload or a jump has the hour it has in a play gone through.
// the hour the chapter begins at: the morning of Home is later
const base = f => 0.26 + (f.sea === 'home' ? 0.045 : 0);
// steps 1…5 (the deck, the house, the deck, the house or the shore, the deck)
const hour = (f, step) => base(f) + [0, 0.002, 0.005, 0.007, 0.01][step - 1];
// the hour the ship comes (the deck's `arrive`, then the shore — marks.morning): not before the last leg's, later by
// up to 0.045 as the three legs were clumsy (a leg not played leaves no mark: neither steady nor clumsy; a leg
// skipped by its ⏭ — as played steady, kurs.skipped)
const comes = (f, { kurs1 = 0.5, kurs2 = 0.5, kurs3 = 0.5 }) => hour(f, 5) + 0.045 * (1 - (kurs1 + kurs2 + kurs3) / 3);

// a leg of «Course» — the orchestra grows as the course is held; then the wheel let go, the sails full, the orchestra
// where a leg leaves it (played or skipped; the last one keeps its level), and how steady it was kept (marks[key])
async function course(g, leg, key) {
  const r = await g.play(kurs, { leg, sea: g.state.scales.sea, onSteady: u => g.sound.orchestra(0.25 + 0.6 * u, 0.5) });
  g.set('helm', 0, 0.5);
  g.set('luff', 0, 0.5);
  if (leg < 2) g.sound.orchestra(0.4, 1); // the last leg leaves the bed where it is (0.85 at most): V.6 raises it
  g.mark(key, r.steady);
}

export default {
  number: 'V',
  title: tr('Scarlet Sails'),
  titles: ['Course', 'Home', 'Course', 'Look', 'Course', 'To the water', 'Hand'],
  choices: [],
  steps: [
    // the course, its first leg: the scarlet sails go up; Gray at the wheel
    async g => {
      const f = facts(g.state);
      g.hero('both');
      g.beds({ sea: 0.6, wind: 0.4 });
      const up = g.told('raise:going-up');
      await g.scene(SCENES.deck, { beat: 'raise', sun: hour(f, 1) }, { cut: true });
      const raise = g.beat('raise');
      const order = g.say('grey', 'Make sail');
      await up;
      g.sound.motif();
      g.sound.orchestra(0.25, 4);
      await order;
      await raise;
      await g.beat('helm');
      await course(g, 0, 'kurs1');
    },
    // the house: she reads — the beetle on the page (grin); the cry outside, not believed (cry); or her father
    // wakes her and she runs out (waited, kaperna)
    async g => {
      const f = facts(g.state), { ending } = f, sun = hour(f, 2);
      g.hero('assol');
      g.beds({ sea: 0.3, orchestra: 0.15 });
      if (ending === 'grin') {
        await g.scene(SCENES.home, { beat: 'read', sun }, { cut: true });
        await g.beat('read');
        await g.beat('beetle');
      } else if (ending === 'cry') {
        await g.scene(SCENES.home, { beat: 'read', sun }, { cut: true });
        await g.beat('read');
        const glance = g.told('cry:glance');
        const cry = g.beat('cry');
        await glance;
        await g.say('kids', 'Red sails are coming!', 'door');
        await cry;
      } else {
        const touched = g.told('wake:touched');
        await g.scene(SCENES.home, { beat: 'wake', sun }, { cut: true });
        const wake = g.beat('wake');
        await touched;
        await g.say('longren', 'Assol. Go down to the sea');
        await wake;
        await g.beat('out');
      }
    },
    // the course, its second leg
    async g => {
      const f = facts(g.state);
      g.hero('both');
      g.beds({ sea: 0.6, wind: 0.4, orchestra: 0.4 });
      await g.scene(SCENES.deck, { beat: 'helm', leg: 0.5, sun: hour(f, 3) }, { cut: true });
      await g.beat('helm');
      await course(g, 1, 'kurs2');
    },
    // she sees the sails: at the shore's edge with her father, before the dawn (waited); from among all Kaperna
    // (kaperna); or at home — her eyes raised from the book («Look»: after the cry, now in earnest, they are
    // heavy), the sails in the window, and out of the door
    async g => {
      const f = facts(g.state);
      g.hero('assol');
      g.beds({ sea: 0.3, orchestra: 0.3 });
      if (f.ending === 'waited') {
        const spark = g.told('dawn_two:spark');
        const turns = g.told('dawn_two:turns');
        await g.scene(SCENES.shore, { beat: 'dawn_two', morning: hour(f, 4) }, { cut: true });
        const dawn = g.beat('dawn_two');
        await spark;
        g.sound.motif();
        await turns;
        await g.say('assol', 'You knew?');
        await g.say('longren', 'I knew. I waited with you');
        await dawn;
        return;
      }
      if (f.ending === 'kaperna') {
        const seen = g.told('sails_far:seen');
        await g.scene(SCENES.shore, { beat: 'sails_far', morning: hour(f, 4) }, { cut: true });
        const far = g.beat('sails_far');
        await seen;
        g.sound.motif();
        await g.say('narrator', 'Longren told Philip. Philip told everyone');
        await far;
        return;
      }
      const cry = f.ending === 'cry';
      const ready = cry ? g.told('look:ready') : null;
      await g.scene(SCENES.home, { beat: 'look', sun: hour(f, 4) }, { cut: true });
      const look = g.beat('look');
      if (cry) {
        await ready;
        await g.say('kids_true', 'Assol! They really are coming!', 'door');
      }
      await look;
      if (cry && f.girlToy) await g.beat('girl_in');
      await g.play(smotri, { heavy: cry });
      g.set('gaze', 1);
      const seen = g.told('sails_window:seen');
      const sails = g.beat('sails_window');
      await seen;
      g.sound.motif();
      await sails;
      await g.beat('sails_close');
      await g.beat('out');
    },
    // the course, its last leg; the hour the ship comes; Kaperna near, the boat let down
    async g => {
      const f = facts(g.state);
      g.hero('both');
      g.beds({ sea: 0.6, wind: 0.4, orchestra: 0.5 });
      await g.scene(SCENES.deck, { beat: 'helm', leg: 0.85, sun: hour(f, 5) }, { cut: true });
      await g.beat('helm');
      await course(g, 2, 'kurs3');
      const morning = comes(f, g.state.marks);
      g.mark('morning', morning);
      const boat = g.told('arrive:boat');
      await g.scene(SCENES.deck, { beat: 'arrive', sun: morning }, { cut: true });
      const arrive = g.beat('arrive');
      await boat;
      g.sound.chain();
      await arrive;
    },
    // to the water: the sails round the cape and her way down (grin, cry); her way between the people (kaperna);
    // she is there already (waited) — the ship anchors, the boat comes, she walks into the water. The hour is the one
    // the ship came at (marks.morning, carried to the shore). The orchestra above any leg's level: it never dips
    async g => {
      const { ending } = facts(g.state);
      g.hero('assol');
      g.beds({ sea: 0.6, orchestra: 0.9 });
      let anchor;
      if (ending === 'waited') {
        anchor = g.told('shore:anchor');
        await g.scene(SCENES.shore, { beat: 'shore' }, { cut: true });
      } else {
        if (ending === 'kaperna') await g.scene(SCENES.shore, { beat: 'run' }, { cut: true });
        else {
          await g.scene(SCENES.shore, { beat: 'sails_far' }, { cut: true });
          await g.beat('sails_far');
        }
        await g.beat('run');
        anchor = g.told('shore:anchor');
      }
      const shore = g.beat('shore');
      await anchor;
      g.sound.chain();
      await shore;
    },
    // the hand: hers to his («Hand»); in the boat — his words, hers, her father; the boat goes off to the ship
    async g => {
      const f = facts(g.state);
      g.hero('both');
      g.beds({ sea: 0.6, orchestra: 0.5 });
      await g.scene(SCENES.shore, { beat: 'hands' }, { cut: true });
      await g.beat('hands');
      await g.play(ruka, { onReach: u => g.sound.orchestra(0.5 + 0.5 * u, 0.3) });
      g.set('reach', 1);
      g.sound.motif();
      g.sound.orchestra(1, 2);
      const boat = g.told('meet:boat');
      const meet = g.beat('meet');
      await boat;
      await g.say('grey', 'Well, here I am. Do you know me?');
      await g.say('assol', 'Just so I imagined you');
      await g.say('assol', 'And will you take my Longren too?');
      if (f.longren === 'sea') await g.say('grey', 'Yes. We\'ll find him');
      else await g.say('grey', 'Yes');
      await meet;
      await g.beat('away');
    },
  ],
};
