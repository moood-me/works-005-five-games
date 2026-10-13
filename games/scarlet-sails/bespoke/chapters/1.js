// I. Кораблик — Longren's workshop: Assol (8) takes the scarlet scrap and rigs the toy ship with her father; the
// shop that no longer takes toys; the ship let go on the stream; Egl, who tells her the tale (~ what she asks);
// the tale told at home; the children at the boats (⚑ she stands by it or says she made it up).
// Reads: nothing of the play. Leaves: choices.egl_ask, choices.kids; scales.tale (I.6), the tale's gauge shown.
import osnastka from '../minigames/osnastka.js';
import zaKorablikom from '../minigames/za-korablikom.js';
import { SCENES } from '../story.js';

export default {
  number: 'I',
  title: 'Кораблик',
  wall: false,
  titles: ['Оснастка', 'Лавка', 'За корабликом', 'Эгль', 'Дома', 'Дети'],
  choices: [
    { id: 'egl_ask', weight: '~', title: 'Что спросить у Эгля', options: [{ id: 'when', label: '«Когда?»' }, { id: 'how', label: '«А как я его узнаю?»' }] },
    { id: 'kids', weight: '⚑', title: 'Дети у лодок', options: [{ id: 'true', label: '«Я не вру»' }, { id: 'made_up', label: '«Я придумала»' }] },
  ],
  steps: [
    // the workshop: the scrap, the rigging with her father, the glow of the sail
    async g => {
      g.hero('assol');
      g.beds({ sea: 0.2 });
      await g.scene(SCENES.home, { beat: 'evening' }, { cut: true });
      g.sound.knife();
      await g.beat('evening');
      await g.say('longren', 'Остался лоскут. Алый шёлк — им оклеивают каюты богатых пароходов');
      await g.beat('scrap');
      await g.choose(null, { 'scrap#scrap': [{ id: 'take', label: 'Взять лоскут' }] });
      g.sound.silk();
      await g.move('scrap_taken', 1, 0.6);
      await g.wait(500); // held, seen
      await g.beat('rig');
      await g.play(osnastka, { onGuide: () => g.say('longren', 'Держи мачту. Крепче', 'narrator') });
      for (const key of ['rig1', 'rig2', 'rig3', 'rig4']) g.set(key, 1);
      g.set('guide', 0);
      const up = g.told('glow:up');
      const glow = g.beat('glow');
      await up;
      g.sound.motif();
      await glow;
      await g.beat('glow_close');
      g.gauge('tale', { rule: false });
    },
    // the shop in Liss no longer takes toys
    async g => {
      g.hero('assol');
      g.beds({});
      const no = g.told('toys_in:no');
      await g.scene(SCENES.shop, { beat: 'toys_in' });
      const toys = g.beat('toys_in');
      await no;
      await g.say('merchant', 'Не берём больше. Теперь в моде заморские');
      await toys;
    },
    // the stream: the toy ship afloat, and the run after it
    async g => {
      g.hero('assol');
      g.beds({ stream: 0.6 }, 3);
      const afloat = g.told('launch:afloat');
      await g.scene(SCENES.forest, { beat: 'launch' });
      const launch = g.beat('launch');
      await afloat;
      await g.say('narrator', 'У ручья ей захотелось посмотреть, как яхта плывёт');
      await launch;
      await g.beat('chase');
      await g.play(zaKorablikom);
      g.set('run', 1);
      g.set('toy', 1, 1);
      g.set('reeds', 0);
    },
    // Egl at the stream's mouth: the tale, and what she asks
    async g => {
      g.hero('assol');
      g.beds({ stream: 0.3, sea: 0.5 });
      await g.scene(SCENES.forest, { beat: 'mouth' });
      await g.beat('mouth');
      const tale = g.told('egl:tale'), sail = g.told('egl:sail'), boat = g.told('egl:boat');
      const egl = g.beat('egl');
      await tale;
      await g.say('egl', 'Не знаю, сколько пройдёт лет, только в Каперне расцветёт одна сказка');
      await sail;
      await g.say('egl', 'Однажды утром в морской дали под солнцем сверкнёт алый парус. Белый корабль двинется прямо к тебе');
      await boat;
      await g.say('egl', 'С корабля придёт лодка, и в ней — тот, кто увидел тебя во сне. Он увезёт тебя навсегда');
      await egl;
      await g.beat('assol_close');
      await g.beat('egl_hold');
      await g.say('assol_child', 'Это всё мне?', 'assol');
      const ask = await g.choose('egl_ask', {
        egl: [{ id: 'when', label: 'Спросить: «Когда?»' }, { id: 'how', label: 'Спросить: «А как я его узнаю?»' }],
      });
      if (ask === 'when') {
        await g.say('assol_child', 'Когда?', 'assol');
        const sea = g.told('egl_when:sea');
        const when = g.beat('egl_when');
        await sea;
        await g.say('egl', 'Не знаю. Ты будешь большая');
        await when;
      } else {
        await g.say('assol_child', 'А как я его узнаю?', 'assol');
        const down = g.told('egl_how:down');
        const how = g.beat('egl_how');
        await down;
        await g.say('egl', 'Узнаешь. Он тебя — тоже');
        await how;
      }
      await g.beat('egl_goes');
    },
    // home: she tells it; the whole of Kaperna knows by morning
    async g => {
      g.hero('assol');
      g.beds({ sea: 0.2 });
      const down = g.told('tell:down'), collier = g.told('tell:collier');
      await g.scene(SCENES.home, { beat: 'tell' });
      const tell = g.beat('tell');
      await down;
      await g.say('assol_child', 'Он приплывёт за мной. Под алыми парусами!', 'assol');
      await collier;
      await g.say('longren', 'Так и будет, Ассоль');
      await tell;
      await g.say('narrator', 'Наутро это знала вся Каперна');
    },
    // the children at the boats: ⚑ «Я не вру» or «Я придумала»
    async g => {
      g.hero('assol');
      g.beds({ sea: 0.5 });
      const laugh = g.told('kids:laugh'), beckon = g.told('kids:beckon');
      await g.scene(SCENES.shore, { beat: 'kids' });
      g.sound.gulls();
      const kids = g.beat('kids');
      await laugh;
      await g.say('kids', 'Корабельная! Эй, Корабельная! Красные паруса плывут!', 'kid_boy');
      await beckon;
      await g.say('kids_call', 'Иди к нам. Только не ври больше про корабль', 'kid_girl');
      await kids;
      await g.beat('kids_hold');
      const answer = await g.choose('kids', {
        'assol#yacht': [{ id: 'true', label: '«Я не вру»' }],
        kid_girl: [{ id: 'made_up', label: '«Я придумала»' }],
      });
      if (answer === 'true') {
        await g.say('assol_child', 'Я не вру', 'assol');
        await g.beat('alone');
        g.scale('tale', 1);
        g.beds({ sea: 0.2 });
        const knees = g.told('why:knees');
        await g.scene(SCENES.home, { beat: 'why' });
        const why = g.beat('why');
        await knees;
        await g.say('assol_child', 'Почему с нами не играют?', 'assol');
        await g.say('longren', 'Э, Ассоль, разве они умеют любить? Надо уметь любить, а этого-то они не могут');
        await why;
      } else {
        await g.say('assol_child', 'Я придумала', 'assol');
        await g.beat('play');
        g.scale('tale', -1);
        g.beds({ sea: 0.2 });
        await g.scene(SCENES.home, { beat: 'shelf' });
        await g.beat('shelf');
      }
      g.gauge('tale');
    },
  ],
};
