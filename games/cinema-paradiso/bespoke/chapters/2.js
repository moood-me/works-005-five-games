// II. The Beam — Alfredo's chapter; Toto nine to ten: the boy threads the projector (Threading) and learns the lever; the
// square without seats — Alfredo turns the projector and leads the beam across the square onto the white wall (The Beam;
// the theme whole for the first time); the fire, the boy drags him out of the smoke (Pull Him Out), Alfredo alive and
// blind; the new Paradiso, the first uncut kiss; ⚑ blind Alfredo at his door: go with the boy to the booth, or send
// him alone (the reel appears). game.md §6 "Chapter II".
// Reads: hands.thread (facts.slips: the frame trembles in `motor`). Leaves: choices.booth; scales.alfredo (II.5 ±1);
// the reel's gauge shown; hands.thread, beam, pull-out.
import { SCENES, facts } from '../story.js';
import thread from '../minigames/thread.js';
import beam from '../minigames/beam.js';
import pullOut from '../minigames/pull-out.js';

// a handle of sound (theme, camera8) stopped when the step is left
const held = (g, h) => {
  g.signal.addEventListener('abort', () => h.stop(0.5));
  return h;
};

export default {
  number: 'II',
  title: tr('The Beam'),
  titles: ['Threading', 'The Crowd', 'Fire', 'The Kisses', 'The Booth'],
  choices: [
    { id: 'booth', weight: '⚑', title: tr('A projectionist at ten'), options: [{ id: 'hold', label: tr('“Come. I\'ll be near”') }, { id: 'release', label: tr('“Go alone”') }] },
  ],
  steps: [
    // the boy threads the projector; the motor, the beam leaps into the port; the lever; the full hall
    async g => {
      g.hero('both');
      const crate = g.told('lesson:crate');
      await g.scene(SCENES.booth, { beat: 'lesson' }, { beds: {} });
      const lesson = g.beat('lesson');
      await crate;
      await g.say('alfredo', 'Through here first. Leave a loop, or it\'ll tear');
      await lesson;
      await g.play(thread);
      g.set('threaded', 5);
      g.set('pull', 0);
      g.set('stutter', facts(g.state).slips >= 1 ? 1 : 0);
      const beamIn = g.told('motor:beam'), lever = g.told('motor:lever');
      const motor = g.beat('motor');
      await beamIn;
      g.beds({ whirr: 0.6 });
      g.sound.motif();
      await lever;
      await g.say('alfredo', 'And this is the lever. When the first dot blinks, the motor. At the second, the lever', 'alfredo');
      await motor;
      const laugh = g.told('full_hall:laugh');
      await g.scene(SCENES.hall, { beat: 'full_hall' }, { cut: true, beds: { whirr: 0.3, hall: 0.6 } });
      const hall = g.beat('full_hall');
      await laugh;
      g.sound.laugh();
      await g.say('alfredo', 'It\'s a lonely job, Totò. You roast in summer, you freeze in winter. And the same film a hundred times', 'lion');
      await g.say('toto_boy', 'You got that from a movie!', 'lion');
      await g.say('alfredo', 'From a movie. But it\'s true', 'lion');
      await hall;
    },
    // no seats left: the square whistles; Alfredo leads the beam across the square onto the wall
    async g => {
      g.hero('alfredo');
      const madman = g.told('crowd:madman'), shout = g.told('crowd:shout');
      await g.scene(SCENES.square, { beat: 'crowd', full_sign: 1 }, { beds: { square: 0.7, cicadas: 0.2 } });
      const crowd = g.beat('crowd');
      await madman;
      await g.say('madman', 'The square is mine! It\'s my square!');
      await shout;
      g.sound.whistle();
      await g.say('crowd', 'Let us in! We want the movie too!', 'c1');
      await crowd;
      const hands = g.told('window:hands');
      await g.scene(SCENES.booth, { beat: 'window' }, { cut: true, beds: { whirr: 0.5, square: 0.4 } });
      const window = g.beat('window');
      await hands;
      await g.say('alfredo', 'You want a movie? I\'ll give you a movie');
      await window;
      await g.scene(SCENES.square, { beat: 'beam_out' }, { cut: true });
      await g.beat('beam_out');
      await g.play(beam, { onFocus: u => g.sound.whirr(0.3 + 0.3 * u, 0.3) });
      g.set('beam_aim', 1);
      g.set('beam_focus', 1);
      g.set('wall_film', 'comedy');
      g.sound.motif();
      g.sound.applause();
      // the theme whole for the first time, quietly, under the square's gift
      const theme = held(g, g.sound.theme());
      theme.loud(0.35, 3);
      const sit = g.told('wall_film:sit');
      const wall = g.beat('wall_film');
      await sit;
      g.sound.laugh();
      await g.say('narrator', 'That night the square watched the movie on the wall of a house');
      await wall;
      theme.stop(3);
    },
    // the fire: the film flares in the gate; the wall blisters; the boy drags Alfredo out; the fountain
    async g => {
      g.hero('both');
      const flame = g.told('jam:flame');
      await g.scene(SCENES.booth, { beat: 'jam' }, { beds: { whirr: 0.5, square: 0.3 } });
      const jam = g.beat('jam');
      await g.say('alfredo', 'Run downstairs, see how it looks out there', 'alfredo');
      await flame;
      g.sound.flame();
      g.beds({ fire: 0.8 });
      await jam;
      const fire = g.told('smoke:fire');
      await g.scene(SCENES.square, { beat: 'smoke', beam_on: 1, beam_aim: 1, beam_focus: 1, wall_film: 'comedy' }, { cut: true });
      const smoke = g.beat('smoke');
      await fire;
      await g.say('crowd', 'Fire! Fire in the booth!', 'c1');
      await smoke;
      await g.scene(SCENES.booth, { beat: 'smoke_in' }, { cut: true, beds: { fire: 1 } });
      await g.beat('smoke_in');
      await g.play(pullOut);
      g.set('drag', 1);
      g.set('cough', 0);
      const sat = g.told('outside:sat');
      await g.scene(SCENES.square, { beat: 'outside' }, { beds: { square: 0.4, fire: 0.2 } });
      const outside = g.beat('outside');
      await sat;
      await g.say('narrator', 'Alfredo lived. But he never saw again');
      await outside;
    },
    // the new Paradiso; the first uncut kiss, the hall roars, the priest walks out
    async g => {
      g.hero('toto');
      const lit = g.told('new_sign:lit');
      await g.scene(SCENES.square, { beat: 'new_sign' }, { beds: { square: 0.3 } });
      const sign = g.beat('new_sign');
      await lit;
      await g.say('narrator', 'Ciccio, a Neapolitan, won the lottery and rebuilt the Paradiso. They took me on as projectionist. Nobody else knew how');
      await sign;
      const kiss = g.told('first_kiss:kiss'), priest = g.told('first_kiss:priest');
      await g.scene(SCENES.hall, { beat: 'first_kiss' }, { beds: { hall: 0.6, whirr: 0.3 } });
      const first = g.beat('first_kiss');
      await kiss;
      g.sound.roar();
      await priest;
      await g.say('narrator', 'Ciccio said: in the new Paradiso, nobody cuts the kisses');
      await first;
    },
    // blind Alfredo at his door; the boy asks him to come (⚑ booth)
    async g => {
      g.hero('alfredo');
      const asked = g.told('door:asked');
      await g.scene(SCENES.square, { beat: 'door' }, { beds: { square: 0.4, cicadas: 0.3 } });
      const door = g.beat('door');
      await asked;
      await g.say('toto_boy', 'Alfredo, come with me to the booth. I\'m scared on my own', 'toto');
      await door;
      const booth = await g.choose('booth', {
        toto: [{ id: 'hold', label: tr('“Come. I\'ll be near”') }],
        alfredo: [{ id: 'release', label: tr('“Go alone”') }],
      });
      g.gauge('alfredo');
      if (booth === 'hold') {
        g.scale('alfredo', 1);
        await g.say('alfredo', 'Let\'s go. I\'ll be right beside you. I know that machine by ear');
        await g.beat('go_together');
      } else {
        g.scale('alfredo', -1);
        await g.say('alfredo', 'Go on your own. You\'ll manage. And go to school. This job isn\'t for you');
        await g.beat('go_alone');
      }
    },
  ],
};
