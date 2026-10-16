// III. A Hundred Nights — Toto, seventeen: the 8 mm camera on the church steps and a stranger crossing the square (The Camera;
// ⚑ go on filming, or go down to her), the soldier and the princess (in the booth if Alfredo stayed by him, at his
// door if not), the hundred nights under her balcony (A Hundred Nights), ⚑ the ninety-ninth night — wait on, or go to the
// booth where the New Year's film must run. game.md §6 "Chapter III".
// Reads: facts.alfredoHere (where the story is told; L52). Leaves: choices.camera, choices.nights; scales.toto (III.1
// ±1, III.4 ±1); marks.reel8 (film); hands.camera, hundred-nights.
import { SCENES, facts } from '../story.js';
import camera from '../minigames/camera.js';
import hundredNights from '../minigames/hundred-nights.js';

// a handle of sound (theme, camera8) stopped when the step is left
const held = (g, h) => {
  g.signal.addEventListener('abort', () => h.stop(0.5));
  return h;
};

export default {
  number: 'III',
  title: tr('A Hundred Nights'),
  titles: ['The Camera', 'The Soldier and the Princess', 'A Hundred Nights', 'New Year\'s Eve'],
  choices: [
    { id: 'camera', weight: '⚑', title: tr('The girl nobody knew'), options: [{ id: 'film', label: tr('Keep filming') }, { id: 'speak', label: tr('Go up to her') }] },
    { id: 'nights', weight: '⚑', title: tr('The ninety-ninth night'), options: [{ id: 'wait', label: tr('Wait on') }, { id: 'booth', label: tr('Go to the booth') }] },
  ],
  steps: [
    // dusk on the church steps; the camera follows a girl across the square (⚑ camera)
    async g => {
      g.hero('toto');
      g.beds({ square: 0.5, cicadas: 0.4 });
      const aim = g.told('dusk:aim');
      await g.scene(SCENES.square, { beat: 'dusk' });
      const dusk = g.beat('dusk');
      await aim;
      await g.say('narrator', 'I was seventeen. I filmed everything with a little camera');
      await dusk;
      const cam = held(g, g.sound.camera8());
      await g.play(camera, { onFrame: inFrame => cam.loud(inFrame ? 0.6 : 0.15, 0.3) });
      g.set('viewfinder', 0);
      g.set('pan', 0);
      g.set('elena_x', 0);
      g.set('madman_x', 1);
      g.set('rec', 0);
      cam.stop(0.5);
      await g.beat('seen');
      const shot = await g.choose('camera', {
        toto: [{ id: 'film', label: tr('Keep filming') }],
        elena: [{ id: 'speak', label: tr('Go up to her') }],
      });
      if (shot === 'film') {
        g.scale('toto', 1);
        g.mark('reel8', true, tr('Totò will keep the film.'));
        const still = held(g, g.sound.camera8());
        const door = g.told('film_on:door');
        const on = g.beat('film_on');
        await door;
        still.stop(0.5);
        await g.say('narrator', 'Three minutes of film. I watched them a hundred times afterwards');
        await on;
      } else {
        g.scale('toto', -1);
        const met = g.told('hello:met');
        const hello = g.beat('hello');
        await met;
        await g.say('elena', 'Are you the one who runs the films in the booth?', 'elena');
        await g.say('toto', 'That\'s me. Totò', 'toto');
        await g.say('elena', 'Elena. We\'ve only just come here', 'elena');
        g.sound.giggle();
        await hello;
      }
    },
    // the soldier and the princess: in the booth beside him (Alfredo kept) or at his door (let go)
    async g => {
      g.hero('both');
      const here = facts(g.state).alfredoHere, beat = here ? 'story_booth' : 'story_door';
      if (here) g.beds({ whirr: 0.4, hall: 0.2 });
      else g.beds({ square: 0.4, cicadas: 0.4 });
      const start = g.told(`${beat}:start`), ninety = g.told(`${beat}:99`), why = g.told(`${beat}:why`);
      await g.scene(here ? SCENES.booth : SCENES.square, { beat });
      const story = g.beat(beat);
      await start;
      await g.say('alfredo', 'Once a king gave a feast. A soldier saw the princess, and he was lost');
      await g.say('alfredo', 'She told him: wait a hundred nights under my balcony, and I\'ll be yours');
      await ninety;
      await g.say('alfredo', 'He waited. And on the ninety-ninth night he stood up, took his chair and went away');
      await why;
      await g.say('toto', 'Why?', 'toto');
      await g.say('alfredo', 'I don\'t know. When you figure it out, tell me');
      await story;
    },
    // the chair under her balcony; the hundred nights, a chalk stroke a week
    async g => {
      g.hero('toto');
      g.beds({ square: 0.3, cicadas: 0.3 });
      const sat = g.told('chair:sat');
      await g.scene(SCENES.square, { beat: 'chair' });
      const chair = g.beat('chair');
      await sat;
      await g.say('narrator', 'I decided to stand there a hundred nights. To sit, to be honest');
      await chair;
      await g.beat('nights');
      await g.play(hundredNights);
      g.set('chalk', 98);
      g.set('night_kind', 'cold');
      g.set('elena_window', 0);
      g.beds({ square: 0.3 }, 2);
    },
    // the ninety-ninth night, New Year's Eve: the booth's window lit across the square (⚑ nights)
    async g => {
      g.hero('toto');
      g.beds({ square: 0.5, hall: 0.2 });
      const ready = g.told('eve:ready');
      await g.scene(SCENES.square, { beat: 'eve', chalk: 99 });
      const eve = g.beat('eve');
      await ready;
      await g.say('narrator', 'The ninety-ninth night. The New Year\'s film at the Paradiso. And I was the one who had to run it');
      await eve;
      const nights = await g.choose('nights', {
        balcony: [{ id: 'wait', label: tr('Wait on') }],
        'paradiso#booth_window': [{ id: 'booth', label: tr('Go to the booth') }],
      });
      if (nights === 'wait') {
        g.scale('toto', -1);
        const open = g.told('midnight:open'), hug = g.told('midnight:hug');
        const midnight = g.beat('midnight');
        await open;
        g.sound.whistle();
        g.sound.fireworks();
        g.sound.motif();
        await hug;
        await g.say('elena', 'Ninety-nine. I was counting too', 'elena');
        await midnight;
        await g.beat('midnight_close'); // (close)
        await g.say('narrator', 'The hall went without its film that night. Ciccio docked my pay');
      } else {
        g.scale('toto', 1);
        g.beds({ whirr: 0.6, hall: 0.3 });
        const door = g.told('reels:door'), hug = g.told('reels:hug'), tail = g.told('reels:tail');
        await g.scene(SCENES.booth, { beat: 'reels' });
        const reels = g.beat('reels');
        await door;
        await g.say('elena', 'You left the square. I thought that was the end', 'elena');
        await hug;
        g.sound.motif();
        await tail;
        g.sound.reelEnd();
        if (facts(g.state).alfredoHere) await g.say('alfredo', 'Totò! The reel\'s run out!');
        await reels;
        g.beds({ hall: 0.4 });
        await g.scene(SCENES.hall, { beat: 'whistle' }, { cut: true });
        const whistle = g.beat('whistle');
        g.sound.whistle();
        await whistle;
      }
      await g.say('narrator', 'So we had one summer');
    },
  ],
};
