// IV. Go Away — the summer cinema on the pier and the rain, Elena's father's car («in the booth, at six»); six o'clock,
// three changeovers and steps on the stair that pass (Changeover); ⚑ Elena at the booth's door and blind Alfredo alone — the
// truth, or «if you love him — leave him» (the note on the calendar, the leaf turned by his hand; «No» in the morning);
// the call-up and her letters (or his, returned); ⚑ the pier at dusk: go, or stay one more year; ⚑ the station at
// dawn: «don't come back» or «come back when you want», ~ the look from the train. game.md §6 "Chapter IV".
// Reads: hands.smena (facts.missed: L129), facts.elena (IV.4, IV.5), marks.alfredo (L71). Leaves: choices.elena,
// stay, station, look; scales.alfredo (IV.3 ±1, IV.6 ±1), scales.toto (IV.5 ±1); hands.smena.
import { SCENES, facts } from '../story.js';
import smena from '../minigames/smena.js';

export default {
  number: 'IV',
  title: tr('Go Away'),
  titles: ['The Downpour', 'At Six', 'Elena', 'The Letters', 'The Pier', 'The Station'],
  choices: [
    { id: 'elena', weight: '⚑', title: tr('Elena at the booth'), options: [{ id: 'truth', label: tr('“He\'s on the pier. Run”') }, { id: 'future', label: tr('“If you love him, leave him”') }] },
    { id: 'stay', weight: '⚑', title: tr('Go or stay'), options: [{ id: 'go', label: tr('“I\'ll go”') }, { id: 'stay', label: tr('“I\'ll stay”') }] },
    { id: 'station', weight: '⚑', title: tr('What to say on the platform'), options: [{ id: 'never', label: tr('“Don\'t come back”') }, { id: 'come', label: tr('“Come back when you like”') }] },
    { id: 'look', weight: '~', title: tr('From the carriage window'), options: [{ id: 'no', label: tr('Don\'t look back') }, { id: 'back', label: tr('Look back') }] },
  ],
  steps: [
    // the summer cinema on the pier; the rain; the projector covered; the father's car
    async g => {
      g.hero('toto');
      g.beds({ sea: 0.4, whirr: 0.3 });
      const screen = g.told('summer:screen'), rain = g.told('summer:rain');
      await g.scene(SCENES.quay, { beat: 'summer' });
      const summer = g.beat('summer');
      await screen;
      await g.say('narrator', 'In summer they showed films on the pier. People even watched from the boats');
      await rain;
      g.beds({ sea: 0.3, rain: 0.8, whirr: 0.3 }, 3);
      await summer;
      await g.choose(null, { projector: [{ id: 'cover', label: tr('Cover the projector') }] });
      const done = g.told('covered:done');
      const covered = g.beat('covered');
      await done;
      g.beds({ sea: 0.3, rain: 0.8 });
      await covered;
      const father = g.told('headlights:father'), turn = g.told('headlights:turn');
      const lights = g.beat('headlights');
      await father;
      g.sound.car();
      await g.say('banker', 'Elena! Into the car. Right now', 'banker');
      await turn;
      await g.say('elena', 'We\'re leaving on Sunday. I\'ll come to say goodbye. To the booth, at six', 'elena');
      await lights;
    },
    // six o'clock: three changeovers, the steps pass by (Changeover); at ten Alfredo sends him to the pier
    async g => {
      g.hero('toto');
      g.beds({ whirr: 0.5, hall: 0.3 });
      const clock = g.told('six:clock');
      await g.scene(SCENES.booth, { beat: 'six' });
      const six = g.beat('six');
      await clock;
      await g.say('narrator', 'At six she didn\'t come');
      await six;
      await g.beat('changeover');
      await g.play(smena);
      g.set('cue', 0);
      g.set('white', 0);
      g.set('clock', 10);
      g.set('motor1', 0);
      g.set('motor2', 1);
      g.set('active', 2);
      const turned = g.told('alfredo_comes:turned');
      const comes = g.beat('alfredo_comes');
      await turned;
      if (facts(g.state).missed >= 1) await g.say('alfredo', 'The hall was whistling. I heard it', 'alfredo');
      await g.say('alfredo', 'Go home, Totò. I\'ll sit here. If she comes, I\'ll tell her where you are', 'alfredo');
      await g.say('toto', 'I\'ll be on the pier', 'toto');
      await comes;
    },
    // Elena at the door, blind Alfredo alone at the running projector (⚑ elena)
    async g => {
      g.hero('alfredo');
      g.beds({ whirr: 0.5, hall: 0.2 });
      const inside = g.told('knock:in');
      await g.scene(SCENES.booth, { beat: 'knock' });
      const knock = g.beat('knock');
      await inside;
      g.sound.steps();
      await g.say('elena', 'Where\'s Totò? My father wouldn\'t let me out… I ran away', 'elena');
      await knock;
      const elena = await g.choose('elena', {
        elena: [{ id: 'truth', label: tr('“He\'s on the pier. Run”') }],
        alfredo: [{ id: 'future', label: tr('“If you love him, leave him”') }],
      });
      if (elena === 'truth') {
        g.scale('alfredo', 1);
        await g.say('alfredo', 'He\'s on the pier. He waited for you all evening. Run');
        const gone = g.told('runs:gone');
        const runs = g.beat('runs');
        await gone;
        g.sound.door();
        await runs;
        g.hero('toto');
        g.beds({ sea: 0.5 });
        const hug = g.told('found:hug');
        await g.scene(SCENES.quay, { beat: 'found' });
        const found = g.beat('found');
        await hug;
        g.sound.motif();
        await g.say('elena', 'I came. You see? I came', 'elena');
        await g.say('toto', 'Write to me. Every day', 'toto');
        await found;
      } else {
        g.scale('alfredo', -1);
        await g.say('alfredo', 'If you love him, leave him. He has to go away. Here he\'ll go to waste, like me');
        // (she writes on August; once she is gone he finds the leaf by touch and turns it to September)
        await g.beat('note');
        await g.beat('note_close'); // (close)
        g.hero('toto');
        g.beds({ sea: 0.5 });
        await g.scene(SCENES.quay, { beat: 'alone' });
        await g.beat('alone');
        g.beds({});
        const inn = g.told('morning:in');
        await g.scene(SCENES.booth, { beat: 'morning' });
        const morning = g.beat('morning');
        await inn;
        await g.say('toto', 'Did she come?', 'toto');
        await g.say('alfredo', 'No', 'alfredo');
        await morning;
      }
    },
    // the call-up; her letters on the table, or his own come back
    async g => {
      g.hero('toto');
      g.beds({});
      const paper = g.told('call:paper');
      await g.scene(SCENES.home, { beat: 'call' });
      const call = g.beat('call');
      await paper;
      await g.say('maria', 'Your call-up papers, Totò. The army', 'maria');
      await call;
      if (facts(g.state).elena === 'truth') {
        const reading = g.told('answered:reading');
        const answered = g.beat('answered');
        await reading;
        await g.say('narrator', 'She wrote to me. Every day at first. Then on Sundays');
        await answered;
        await g.letter({
          text: tr('Totò, it\'s hot in Palermo and there\'s no cinema. Write to me.'), sign: tr('E.'), kind: 'letter',
          voice: () => g.say('elena', 'Totò, it\'s hot in Palermo and there\'s no cinema. Write to me', 'narrator'),
        });
      } else {
        const pile = g.told('returned:pile');
        const returned = g.beat('returned');
        await pile;
        await g.say('narrator', 'I wrote to her in Palermo. The letters came back');
        await returned;
        await g.letter({ text: tr('Addressee has moved'), sign: '', kind: 'envelope' });
      }
    },
    // the pier at dusk, a year later: «Go away» (⚑ stay)
    async g => {
      g.hero('both');
      g.beds({ sea: 0.5 });
      const sat = g.told('back:sat');
      await g.scene(SCENES.quay, { beat: 'back' });
      const back = g.beat('back');
      await sat;
      await g.say('narrator', 'I came back from the army a year later');
      if (facts(g.state).elena === 'truth') await g.say('toto', 'She writes to me. I could stay here and wait', 'toto');
      if (g.state.marks.alfredo) await g.say('alfredo', 'I lied for you once, about the milk. I\'m not lying now', 'alfredo');
      await g.say('alfredo', 'Go away. This land is cursed. As long as you\'re here, you think it\'s the center of the world', 'alfredo');
      await g.say('alfredo', 'Life isn\'t like in the movies. Life is much harder', 'alfredo');
      await back;
      g.hero('toto');
      const stay = await g.choose('stay', {
        toto: [{ id: 'go', label: tr('“I\'ll go”') }, { id: 'stay', label: tr('“I\'ll stay”') }],
      });
      if (stay === 'go') {
        g.scale('toto', 1);
        await g.say('toto', 'I\'ll go', 'toto');
        await g.beat('rise_go');
      } else {
        g.scale('toto', -1);
        await g.say('toto', 'I\'ll stay. One more year', 'toto');
        g.beds({ whirr: 0.4, rain: 0.4 });
        const door = g.told('autumn:door');
        await g.scene(SCENES.booth, { beat: 'autumn' });
        const autumn = g.beat('autumn');
        await door;
        await g.say('alfredo', 'You sit the way I used to sit. Go, before you put down roots', 'alfredo');
        await autumn;
        await g.say('narrator', 'A year later they put me on the train');
      }
    },
    // the station at dawn: the mother, Alfredo's hug (⚑ station), the train (~ look)
    async g => {
      g.hero('both');
      g.beds({ station: 0.5 });
      const hug = g.told('platform:hug');
      await g.scene(SCENES.station, { beat: 'platform' });
      const platform = g.beat('platform');
      g.sound.trainHiss();
      await hug;
      await g.say('maria', 'Write. At least now and then', 'maria');
      await platform;
      g.hero('alfredo');
      const station = await g.choose('station', {
        alfredo: [{ id: 'never', label: tr('“Don\'t come back”') }, { id: 'come', label: tr('“Come back when you like”') }],
      });
      if (station === 'never') {
        g.scale('alfredo', -1);
        await g.say('alfredo', 'Don\'t come back. Don\'t think about us. Don\'t look back. Don\'t write');
        g.set('alfredo_stays', 0);
      } else {
        g.scale('alfredo', 1);
        await g.say('alfredo', 'Come back whenever you like. I\'ll be here. In the square');
        g.set('alfredo_stays', 1);
      }
      await g.say('alfredo', 'Whatever you do, love it. The way you loved the booth when you were little');
      g.hero('toto');
      const window = g.told('boarding:window');
      const boarding = g.beat('boarding');
      await window;
      g.sound.trainWhistle();
      await boarding;
      const look = await g.choose('look', {
        toto: [{ id: 'no', label: tr('Don\'t look back') }, { id: 'back', label: tr('Look back') }],
      });
      await g.beat(look === 'no' ? 'away' : 'back_look');
      await g.say('narrator', 'For thirty years I didn\'t go back');
    },
  ],
};
