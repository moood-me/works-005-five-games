// IV. Уезжай — the summer cinema on the pier and the rain, Elena's father's car («in the booth, at six»); six o'clock,
// three changeovers and steps on the stair that pass (Смена); ⚑ Elena at the booth's door and blind Alfredo alone — the
// truth, or «if you love him — leave him» (the note on the calendar, the leaf turned by his hand; «No» in the morning);
// the call-up and her letters (or his, returned); ⚑ the pier at dusk: go, or stay one more year; ⚑ the station at
// dawn: «don't come back» or «come back when you want», ~ the look from the train. game.md §6 «Глава IV».
// Reads: hands.smena (facts.missed: Р129), facts.elena (IV.4, IV.5), marks.alfredo (Р71). Leaves: choices.elena,
// stay, station, look; scales.alfredo (IV.3 ±1, IV.6 ±1), scales.toto (IV.5 ±1); hands.smena.
import { SCENES, facts } from '../story.js';
import smena from '../minigames/smena.js';

export default {
  number: 'IV',
  title: 'Уезжай',
  titles: ['Ливень', 'В шесть', 'Елена', 'Письма', 'Пристань', 'Вокзал'],
  choices: [
    { id: 'elena', weight: '⚑', title: 'Елена в будке', options: [{ id: 'truth', label: '«Он на пристани. Беги»' }, { id: 'future', label: '«Если любишь — оставь его»' }] },
    { id: 'stay', weight: '⚑', title: 'Уехать или остаться', options: [{ id: 'go', label: '«Уеду»' }, { id: 'stay', label: '«Останусь»' }] },
    { id: 'station', weight: '⚑', title: 'Что сказать на перроне', options: [{ id: 'never', label: '«Не возвращайся»' }, { id: 'come', label: '«Возвращайся, когда захочешь»' }] },
    { id: 'look', weight: '~', title: 'Из окна вагона', options: [{ id: 'no', label: 'Не оборачиваться' }, { id: 'back', label: 'Обернуться' }] },
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
      await g.say('narrator', 'Летом кино крутили на пристани. Смотрели даже из лодок');
      await rain;
      g.beds({ sea: 0.3, rain: 0.8, whirr: 0.3 }, 3);
      await summer;
      await g.choose(null, { projector: [{ id: 'cover', label: 'Укрыть проектор' }] });
      const done = g.told('covered:done');
      const covered = g.beat('covered');
      await done;
      g.beds({ sea: 0.3, rain: 0.8 });
      await covered;
      const father = g.told('headlights:father'), turn = g.told('headlights:turn');
      const lights = g.beat('headlights');
      await father;
      g.sound.car();
      await g.say('banker', 'Елена! В машину. Сейчас же', 'banker');
      await turn;
      await g.say('elena', 'В воскресенье мы уезжаем. Я приду попрощаться. В будку, в шесть', 'elena');
      await lights;
    },
    // six o'clock: three changeovers, the steps pass by (Смена); at ten Alfredo sends him to the pier
    async g => {
      g.hero('toto');
      g.beds({ whirr: 0.5, hall: 0.3 });
      const clock = g.told('six:clock');
      await g.scene(SCENES.booth, { beat: 'six' });
      const six = g.beat('six');
      await clock;
      await g.say('narrator', 'В шесть она не пришла');
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
      if (facts(g.state).missed >= 1) await g.say('alfredo', 'Зал свистел. Я слышал', 'alfredo');
      await g.say('alfredo', 'Иди домой, Тото. Я посижу. Придёт — скажу, где ты', 'alfredo');
      await g.say('toto', 'Я буду на пристани', 'toto');
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
      await g.say('elena', 'Где Тото? Отец меня не пускал… Я сбежала', 'elena');
      await knock;
      const elena = await g.choose('elena', {
        elena: [{ id: 'truth', label: '«Он на пристани. Беги»' }],
        alfredo: [{ id: 'future', label: '«Если любишь — оставь его»' }],
      });
      if (elena === 'truth') {
        g.scale('alfredo', 1);
        await g.say('alfredo', 'Он на пристани. Весь вечер тебя ждал. Беги');
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
        await g.say('elena', 'Я пришла. Видишь — пришла', 'elena');
        await g.say('toto', 'Пиши мне. Каждый день', 'toto');
        await found;
      } else {
        g.scale('alfredo', -1);
        await g.say('alfredo', 'Если любишь его — оставь. Ему надо уехать. Здесь он пропадёт, как я');
        // (she writes on August; once she is gone he finds the leaf by touch and turns it to September)
        await g.beat('note');
        await g.beat('note_close'); // (крупно)
        g.hero('toto');
        g.beds({ sea: 0.5 });
        await g.scene(SCENES.quay, { beat: 'alone' });
        await g.beat('alone');
        g.beds({});
        const inn = g.told('morning:in');
        await g.scene(SCENES.booth, { beat: 'morning' });
        const morning = g.beat('morning');
        await inn;
        await g.say('toto', 'Она приходила?', 'toto');
        await g.say('alfredo', 'Нет', 'alfredo');
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
      await g.say('maria', 'Повестка, Тото. В армию', 'maria');
      await call;
      if (facts(g.state).elena === 'truth') {
        const reading = g.told('answered:reading');
        const answered = g.beat('answered');
        await reading;
        await g.say('narrator', 'Она писала мне. Сначала каждый день. Потом по воскресеньям');
        await answered;
        await g.letter({
          text: 'Тото, в Палермо жарко и нет кино. Пиши мне.', sign: 'Е.', kind: 'letter',
          voice: () => g.say('elena', 'Тото, в Палермо жарко и нет кино. Пиши мне', 'narrator'),
        });
      } else {
        const pile = g.told('returned:pile');
        const returned = g.beat('returned');
        await pile;
        await g.say('narrator', 'Я писал ей в Палермо. Письма возвращались');
        await returned;
        await g.letter({ text: 'Адресат выбыл', sign: '', kind: 'envelope' });
      }
    },
    // the pier at dusk, a year later: «Уезжай» (⚑ stay)
    async g => {
      g.hero('both');
      g.beds({ sea: 0.5 });
      const sat = g.told('back:sat');
      await g.scene(SCENES.quay, { beat: 'back' });
      const back = g.beat('back');
      await sat;
      await g.say('narrator', 'Из армии я вернулся через год');
      if (facts(g.state).elena === 'truth') await g.say('toto', 'Она пишет мне. Я могу остаться — и ждать', 'toto');
      if (g.state.marks.alfredo) await g.say('alfredo', 'Я раз соврал ради тебя — про молоко. Сейчас не вру', 'alfredo');
      await g.say('alfredo', 'Уезжай. Эта земля проклятая. Пока ты здесь, ты думаешь, что это центр мира', 'alfredo');
      await g.say('alfredo', 'Жизнь не такая, как в кино. Жизнь гораздо труднее', 'alfredo');
      await back;
      g.hero('toto');
      const stay = await g.choose('stay', {
        toto: [{ id: 'go', label: '«Уеду»' }, { id: 'stay', label: '«Останусь»' }],
      });
      if (stay === 'go') {
        g.scale('toto', 1);
        await g.say('toto', 'Уеду', 'toto');
        await g.beat('rise_go');
      } else {
        g.scale('toto', -1);
        await g.say('toto', 'Останусь. Ещё на год', 'toto');
        g.beds({ whirr: 0.4, rain: 0.4 });
        const door = g.told('autumn:door');
        await g.scene(SCENES.booth, { beat: 'autumn' });
        const autumn = g.beat('autumn');
        await door;
        await g.say('alfredo', 'Ты сидишь, как я сидел. Уезжай, пока не прирос', 'alfredo');
        await autumn;
        await g.say('narrator', 'Через год они посадили меня в поезд');
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
      await g.say('maria', 'Пиши. Хоть иногда', 'maria');
      await platform;
      g.hero('alfredo');
      const station = await g.choose('station', {
        alfredo: [{ id: 'never', label: '«Не возвращайся»' }, { id: 'come', label: '«Возвращайся, когда захочешь»' }],
      });
      if (station === 'never') {
        g.scale('alfredo', -1);
        await g.say('alfredo', 'Не возвращайся. Не думай о нас. Не оборачивайся. Не пиши');
        g.set('alfredo_stays', 0);
      } else {
        g.scale('alfredo', 1);
        await g.say('alfredo', 'Возвращайся, когда захочешь. Я буду здесь. На площади');
        g.set('alfredo_stays', 1);
      }
      await g.say('alfredo', 'Что бы ты ни делал — люби это. Как любил будку, когда был маленьким');
      g.hero('toto');
      const window = g.told('boarding:window');
      const boarding = g.beat('boarding');
      await window;
      g.sound.trainWhistle();
      await boarding;
      const look = await g.choose('look', {
        toto: [{ id: 'no', label: 'Не оборачиваться' }, { id: 'back', label: 'Обернуться' }],
      });
      await g.beat(look === 'no' ? 'away' : 'back_look');
      await g.say('narrator', 'Тридцать лет я не возвращался');
    },
  ],
};
