// III. Рассвет — Longren packs for the sea: ⚑ let him go or ask him to stay; the night fire off Kaperna; the
// sleeping girl and the ring («Кольцо»); she wakes: ~ wear it or hide it on a cord; the tavern and the past of
// Mary, Menners and Longren, the coal-man's word; ⚑ the secret or straight to Longren. design.md, game.md §6.
// Reads: facts.ringKind (choices.leave), choices.longren. Leaves: choices.longren, ring, way; marks.longren;
// scales.tale ±1 (the ring).
import { SCENES, facts } from '../story.js';
import koltso from '../minigames/koltso.js';

export default {
  number: 'III',
  title: 'Рассвет',
  titles: ['Лонгрен', 'Костёр', 'Спящая', 'Кольцо', 'Трактир', 'Тайна или прямо'],
  choices: [
    { id: 'longren', weight: '⚑', title: 'Лонгрен собрался в море', options: [{ id: 'go', label: '«Иди. Я справлюсь»' }, { id: 'stay', label: '«Не уходи»' }] },
    { id: 'ring', weight: '~', title: 'Кольцо', options: [{ id: 'wear', label: 'Носить' }, { id: 'hide', label: 'Спрятать на шнурок' }] },
    { id: 'way', weight: '⚑', title: 'Тайна или прямо', options: [{ id: 'secret', label: 'Тайна' }, { id: 'straight', label: 'Прямо' }] },
  ],
  steps: [
    // Longren: the shop turns the toys away again; at home he means to go back to the sea
    async g => {
      g.hero('assol');
      g.beds({});
      const looks = g.told('toys_again:looks');
      await g.scene(SCENES.shop, { beat: 'toys_again' });
      const toys = g.beat('toys_again');
      await g.say('narrator', 'Прошло девять лет');
      await looks;
      await g.say('merchant', 'Не берём. Я говорил твоему отцу');
      await toys;
      g.beds({ sea: 0.2 });
      await g.scene(SCENES.home, { beat: 'years' });
      await g.beat('years');
      const turned = g.told('decide:turned');
      const decide = g.beat('decide');
      await turned;
      await g.say('longren', 'Игрушки никому не нужны, Ассоль. Пойду опять в море — на почтовый пароход');
      await decide;
      const go = await g.choose('longren', {
        chest: [{ id: 'go', label: '«Иди. Я справлюсь»' }],
        longren: [{ id: 'stay', label: '«Не уходи»' }],
      });
      if (go === 'go') {
        await g.say('assol', 'Иди. Я справлюсь');
        await g.beat('chest_out');
        g.mark('longren', 'go', 'Лонгрен это запомнит.');
      } else {
        await g.say('assol', 'Не уходи');
        await g.beat('stay');
        g.mark('longren', 'stay', 'Лонгрен это запомнит.');
      }
    },
    // the fire: Grey and Letika, a night's fishing off Kaperna
    async g => {
      g.hero('grey');
      g.beds({ campfire: 0.6, sea: 0.4 });
      const letika = g.told('fire:letika');
      await g.scene(SCENES.forest, { beat: 'fire' });
      const fire = g.beat('fire');
      await g.say('narrator', '"Секрет" стоял в Лиссе. Грей с Летикой ушли ночью ловить рыбу под Каперной');
      await letika;
      await g.say('letika', 'Рыба спит, капитан. Как люди');
      await fire;
    },
    // the sleeping girl: the ring is put on her hand while she sleeps — still, or she wakes
    async g => {
      g.hero('grey');
      g.beds({ sea: 0.4 });
      const found = g.told('dawn_walk:found');
      await g.scene(SCENES.forest, { beat: 'dawn_walk' });
      const walk = g.beat('dawn_walk');
      await found;
      await g.say('narrator', 'В траве спала девушка');
      await walk;
      const sleeping = g.beat('sleeping');
      g.sound.breath(0.2, 2);
      await sleeping;
      await g.beat('ring');
      const r = await g.play(koltso);
      g.set('stir', 0, 1);
      g.sound.breath(0, 1);
      if (!r.on) await g.beat('ring_on');
      g.sound.chime();
      if (facts(g.state).ringKind === 'mother') await g.say('narrator', 'Он надел ей на палец кольцо матери');
      else await g.say('narrator', 'Он надел ей на палец своё старинное кольцо');
      await g.beat('leave');
    },
    // the ring: she wakes with it on her hand — ~ wear it, or hide it on a cord under the dress
    async g => {
      g.hero('assol');
      g.beds({ sea: 0.4 });
      await g.scene(SCENES.forest, { beat: 'wake' });
      const wake = g.beat('wake');
      g.sound.gulls();
      await wake;
      await g.beat('wake_hold');
      const ring = await g.choose('ring', {
        'assol#ring': [{ id: 'wear', label: 'Носить' }, { id: 'hide', label: 'Спрятать на шнурок под платье' }],
      });
      if (ring === 'wear') {
        await g.beat('wear');
        await g.say('narrator', 'Она надела кольцо и не сняла его');
        g.scale('tale', 1);
      } else {
        await g.beat('hide');
        await g.say('narrator', 'Она спрятала кольцо на шнурок');
        g.scale('tale', -1);
      }
    },
    // the tavern: Hin's tale, the past it tells, the touch on Filipp, her passing
    async g => {
      g.hero('grey');
      g.beds({ sea: 0.4 });
      const hin = g.told('tavern:hin');
      await g.scene(SCENES.shore, { beat: 'tavern' });
      const tavern = g.beat('tavern');
      await hin;
      await g.say('hin', 'Корабельная Ассоль. Помешанная. Ждёт заморского принца — под красными парусами');
      await g.say('hin', 'А её отец моего в шторм не спас. Стоял на берегу и курил');
      await tavern;
      const door = g.told('past_mary:door');
      const goes = g.told('past_mary:goes');
      const mary = g.beat('past_mary');
      g.beds({ storm: 0.5 }, 1);
      await door;
      await g.say('narrator', 'Мать Ассоль просила у Меннерса в долг. Он хотел за деньги другого');
      await goes;
      await g.say('narrator', 'Она пошла в город заложить кольцо — и простудилась насмерть');
      await mary;
      const cry = g.told('past_storm:cry');
      const gone = g.told('past_storm:gone');
      const storm = g.beat('past_storm');
      g.beds({ storm: 1 }, 1);
      await cry;
      await g.say('longren', 'Она так же просила тебя!');
      await gone;
      await g.say('narrator', 'Меннерса подобрал пароход. Он успел рассказать Каперне, как Лонгрен смотрел');
      await storm;
      const back = g.beat('tavern_back');
      g.beds({ sea: 0.4 }, 1);
      await back;
      await g.choose(null, { filipp: [{ id: 'ask', label: 'Спросить угольщика' }] });
      await g.say('filipp', 'Врёт он. Не помешанная она. Сидела со мной на возу — корзина моя будто зацвела');
      const assol = g.told('passing:assol');
      const passing = g.beat('passing');
      await assol;
      await g.say('hin', 'Вот она идёт');
      await passing;
      await g.beat('grey_close');
    },
    // the secret or straight: back to the skiff, or to Longren
    async g => {
      g.hero('grey');
      g.beds({ sea: 0.5 });
      const alone = g.told('grey_shore:alone');
      await g.scene(SCENES.shore, { beat: 'grey_shore' });
      const shore = g.beat('grey_shore');
      await alone;
      await g.say('grey', 'Я не знаю, ждёт ли она ещё');
      await shore;
      const way = await g.choose('way', {
        skiff: [{ id: 'secret', label: 'Тайна: вернуться к шлюпке' }],
        longren: [{ id: 'straight', label: 'Прямо: подойти к Лонгрену' }],
      });
      if (way === 'secret') {
        await g.beat('to_skiff');
        return;
      }
      const met = g.told('longren_boat:met');
      const boat = g.beat('longren_boat');
      await met;
      await g.say('grey', 'Я капитан "Секрета". Ваша дочь ещё ждёт свой корабль?');
      await g.say('longren', 'Девять лет ждёт');
      await g.say('grey', 'Он придёт. Ей не говорите');
      await boat;
      if (g.state.choices.longren === 'go') {
        await g.say('longren', 'Тогда и я подожду');
        g.beds({ sea: 0.2 });
        await g.scene(SCENES.home, { beat: 'unpack' });
        await g.beat('unpack');
      }
    },
  ],
};
