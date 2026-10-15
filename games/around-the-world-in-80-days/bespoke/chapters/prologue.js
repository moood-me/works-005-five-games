// Пролог «в которой Филеас Фогг держит пари» — game.md §3. The countdown of the last evening first (20:44:37 →
// the handle turns, dark), then back to 2 October: the whist, the wager — the player lays Fogg's cards down himself —,
// ten minutes at Savile Row («Десять минут»: the bag appears), the train out of Charing Cross (the gas, the London
// watch; the notebook appears). Reads: hands['desyat-minut'] (the gas). Leaves: marks.gas; shown.money, shown.hours.
import { SCENES } from '../story.js';
import desyatMinut from '../minigames/desyat-minut.js';

export default {
  number: '',
  title: 'Пролог',
  heading: 'в которой Филеас Фогг держит пари',
  route: [0, 0],
  titles: ['Без четверти девять', 'Пари', 'Десять минут', 'Чаринг-Кросс'],
  choices: [],
  steps: [
    // 21 December, 20:44: five gentlemen before the clock, Stuart counting; the door's handle turns — dark
    async g => {
      g.hero('both');
      g.beds({ clock: 0.8, fire: 0.15 }, 3);
      const handle = g.told('countdown:handle');
      await g.scene(SCENES.club, { beat: 'countdown' });
      const countdown = g.beat('countdown');
      await g.say('stuart', 'Пятьдесят пять… пятьдесят шесть…');
      await handle;
      g.sound.tock();
      await countdown;
      g.sound.motif();
      await g.title('Вокруг света за восемьдесят дней');
    },
    // 2 October: the whist; the wager — the player lays the cards down; Fogg rises and goes
    async g => {
      g.hero('fogg');
      g.beds({ clock: 0.5, fire: 0.3 }, 2);
      const talks = g.told('whist:stuart-talks');
      await g.scene(SCENES.club, { beat: 'whist' });
      const whist = g.beat('whist');
      await talks;
      await g.say('stuart', 'Земля уменьшилась. Сто лет назад её объезжали за годы');
      await g.say('fogg', 'Теперь — за восемьдесят дней');
      await g.say('stuart', 'С поездами, пароходами — и с непредвиденным?');
      await whist;
      await g.say('fogg', 'Непредвиденного не существует');
      await g.beat('wager');
      await g.choose(null, { 'fogg#hands': [{ id: 'bet', label: 'Держу двадцать тысяч' }] });
      const down = g.told('wager_down:cards-down');
      const wager = g.beat('wager_down');
      await down;
      await g.say('fogg', 'Держу двадцать тысяч фунтов, что объеду её за восемьдесят дней. Или меньше');
      await wager;
      await g.say('fogg', 'Я вернусь в субботу, двадцать первого декабря, в восемь сорок пять вечера');
      await g.beat('leave');
    },
    // Savile Row: «Passepartout, we are going round the world. In ten minutes»; the ten minutes; the bag
    async g => {
      g.hero('fogg');
      g.beds({ fog: 0.5, clock: 0.25 }, 2);
      const door = g.told('news:at-door');
      await g.scene(SCENES.row, { beat: 'home' });
      await g.beat('home');
      const news = g.beat('news');
      await door;
      await g.say('fogg', 'Паспарту, мы едем вокруг света. Через десять минут');
      await g.say('pp', 'Вокруг… света?');
      await news;
      g.hero('pp');
      await g.say('fogg', 'Две рубашки, три пары чулок, плащ и путеводитель Брэдшо. Остальное купим в дороге');
      await g.beat('pack', { wait: false });
      g.beds({ fog: 0.3, clock: 0.6 }, 1);
      const r = await g.play(desyatMinut);
      g.mark('gas', !!r?.gas);
      g.hero('fogg');
      await g.say('fogg', 'Саквояж. В нём двадцать тысяч. Не выпускайте его из рук');
      g.sound.notes();
      g.gauge('money');
      if (r?.missing) g.money(-50 * r.missing);
      const away = g.told('out:away');
      const out = g.beat('out');
      await away;
      await out;
    },
    // the train out of Charing Cross: the gas; Passepartout's London watch; the notebook
    async g => {
      g.hero('both');
      g.beds({ wheels: 0.5, clock: 0.2 }, 2);
      const book = g.told('depart:book');
      await g.scene(SCENES.train, { beat: 'depart', land: 'europe' });
      g.sound.trainWhistle();
      await g.beat('depart');
      await book;
      const up = g.told('gas:up');
      const gas = g.beat('gas');
      await up;
      if (g.state.marks.gas) {
        await g.say('pp', 'Газ! Я не выключил газ у себя в комнате!');
        await g.say('fogg', 'Он будет гореть за ваш счёт');
      } else {
        await g.say('pp', 'Газ выключен, мсье! Я проверил');
        await g.say('fogg', 'Хорошо');
      }
      await gas;
      const out = g.told('watch:out');
      const watch = g.beat('watch');
      await out;
      await g.say('pp', 'Лондонское время. Не переведу, мсье');
      await watch;
      g.gauge('hours');
      await g.say('fogg', 'Лондон — Суэц: семь дней. Ровно по расписанию');
    },
  ],
};
