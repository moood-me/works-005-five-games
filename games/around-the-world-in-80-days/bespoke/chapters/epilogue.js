// Эпилог «в которой выясняется, что день можно выиграть» — game.md §3, §5. By the notebook Fogg is on time (Friday:
// he waits a day in his armchair) or late; late, someone may find him the day won from the sun — Aouda (her proposal,
// the pastor: «tomorrow is Sunday») or Fix (the evening paper) —, then the cab («Кэб») and the fifty-seventh second;
// no one — Sunday, «Two Wednesdays». Then the codas by the people: Aouda's letter from Holland, Passepartout back from
// Omaha, the gas, Kiouni's postcard, Speedy.
// Reads: facts (opener, ending, aouda, pp, gas, kiouni, henrietta, cabin), marks, hands keb. Leaves: marks.day; lines.
import { SCENES, facts } from '../story.js';
import keb from '../minigames/keb.js';

export default {
  number: '',
  title: 'Эпилог',
  heading: 'в которой выясняется, что день можно выиграть',
  route: [0.97, 1],
  titles: ['Суббота', 'Пятьдесят седьмая секунда', 'Кода'],
  choices: [],
  steps: [
    // Saturday — by the notebook Friday (on time) or Sunday (late); who finds the day
    async g => {
      const f = facts(g.state);
      if (f.ending === 'friday') {
        g.hero('fogg');
        g.beds({ clock: 0.7, fire: 0.3 }, 2);
        const porter = g.told('friday:porter');
        await g.scene(SCENES.club, { beat: 'friday', fogg_seated: 1, gentlemen: 0 });
        const friday = g.beat('friday');
        await porter;
        await g.say('porter', 'Сегодня пятница, сэр');
        await g.say('fogg', 'Я знаю');
        await friday;
        const round = g.told('friday_in:round-him');
        const fin = g.beat('friday_in');
        await round;
        await g.say('fogg', 'Вот и я, господа');
        await fin;
        return;
      }
      g.beds({ fog: 0.6, clock: 0.4 }, 2);
      if (f.opener === 'aouda') {
        g.hero('fogg');
        const asks = g.told('proposal:asks'), answers = g.told('proposal:answers');
        await g.scene(SCENES.row, { beat: 'proposal', night: 0.9 });
        const proposal = g.beat('proposal');
        await asks;
        await g.say('aouda', 'Мистер Фогг… хотите ли вы, чтобы я стала вашей женой?');
        await answers;
        await g.say('fogg', 'Я люблю вас');
        await proposal;
        const runner = f.pp === 'with' ? 'pp' : 'fogg';
        await g.say('fogg', runner === 'pp' ? 'Паспарту, к преподобному Уилсону. Венчание — завтра, в понедельник' : 'Я сам схожу к преподобному Уилсону');
        g.set('runner', runner);
        const out = g.told('run_out:away');
        const run = g.beat('run_out');
        await out;
        await run;
        await g.say('pastor', 'Венчание в понедельник? Завтра воскресенье. Сегодня суббота');
        const inside = g.told('run_back:in');
        const back = g.beat('run_back');
        if (runner === 'pp') await g.say('pp', 'Хозяин! Сегодня суббота! Десять минут!');
        else await g.say('fogg', 'Суббота. Сегодня — суббота');
        await inside;
        await back;
      } else if (f.opener === 'fix') {
        g.hero('fogg');
        const rings = g.told('fix_paper:rings');
        await g.scene(SCENES.row, { beat: 'fix_paper', night: 0.9, fix_present: 1 });
        const paper = g.beat('fix_paper');
        await rings;
        g.sound.bell();
        await paper;
        await g.say('fix', 'Вечерняя газета, мистер Фогг. Посмотрите на число');
        await g.say('fogg', 'Суббота');
      } else {
        g.hero('fogg');
        g.beds({ fog: 0.3, clock: 0.3 }, 2);
        g.sound.church();
        const date = g.told('sunday:date'), laugh = g.told('sunday:laugh');
        await g.scene(SCENES.row, { beat: 'sunday', sunday: 1, night: 0 });
        const sunday = g.beat('sunday');
        await date;
        await g.say('fogg', 'Две среды');
        await laugh;
        g.sound.laugh();
        await sunday;
        await g.title('Две среды');
        return;
      }
      // the day is found: written in the notebook in Passepartout's scrawl (or Fogg's own hand)
      g.mark('day', true);
      g.hours(24, 'Ехали навстречу солнцу');
      await g.book('+1 день: ехали навстречу солнцу!', f.pp === 'with' ? 'pp' : 'fogg');
    },
    // the race: the cab through the fog; the fifty-seventh second — or the door shut
    async g => {
      const f = facts(g.state);
      if (f.ending === 'friday' || f.ending === 'sunday') return;
      g.hero('fogg');
      if (f.gained >= 0) {
        g.beds({ fog: 0.5, clock: 0.8 }, 1);
        await g.scene(SCENES.row, { beat: 'cab', night: 1 });
        await g.say('fogg', 'Двадцать минут девятого. В Реформ-клуб!');
        const r = await g.play(keb);
        await g.told('cab:arrived', 20000);
        if (!r?.late) {
          g.beds({ clock: 0.9, crowd: 0.3 }, 1);
          const handle = g.told('countdown:handle');
          await g.scene(SCENES.club, { beat: 'countdown', crowd_outside: 1 });
          const count = g.beat('countdown');
          await g.say('stuart', 'Пятьдесят пять… пятьдесят шесть… пятьдесят семь…');
          await handle;
          await count;
          const inside = g.told('door:fogg-in');
          const door = g.beat('door');
          await inside;
          await g.say('fogg', 'Вот и я, господа');
          g.sound.applause();
          await door;
          return;
        }
      }
      g.beds({ clock: 0.9 }, 1);
      const shut = g.told('no_door:watch-shut');
      await g.scene(SCENES.club, { beat: 'no_door', crowd_outside: 1 });
      const no = g.beat('no_door');
      await shut;
      await g.say('stuart', 'Господа, мистер Фогг проиграл');
      await no;
      g.beds({ fog: 0.5, clock: 0.2 }, 2);
      const lamp = g.told('lost:lamp');
      await g.scene(SCENES.row, { beat: 'lost', night: 1 });
      const lost = g.beat('lost');
      await lamp;
      await lost;
      if (f.aouda === 'with') await g.say('narrator', 'Что он выиграл? Ничего — кроме очаровательной жены');
      if (f.forgiven) await g.say('fix', 'Моя доля награды, мистер Фогг. Возьмите — прошу вас');
    },
    // the codas, by the people
    async g => {
      const f = facts(g.state);
      g.hero('both');
      g.beds({ fog: 0.3, clock: 0.4 }, 2);
      if (f.aouda === 'holland') {
        await g.letter({ kind: 'letter', text: 'Мистер Фогг,\nв Гааге идёт дождь, и я думаю о вашей книжке.\nМожно мне приехать?', sign: 'Ауда' });
        await g.say('fogg', 'Приезжайте');
      }
      if (f.pp === 'omaha') {
        const watch = g.told('pp_returns:watch');
        await g.scene(SCENES.row, { beat: 'pp_returns', night: 0, sunday: 0 });
        const ret = g.beat('pp_returns');
        await watch;
        await g.say('pp', 'По Лондону — минута в минуту');
        await ret;
      }
      if (f.gas && (f.pp === 'with' || f.pp === 'omaha')) {
        await g.scene(SCENES.row, { beat: 'gas_off', night: 1, gas: 1 });
        await g.beat('gas_off');
        await g.say('pp', 'Восемьдесят дней газа — за мой счёт');
      }
      if (f.kiouni === 'gift') await g.title('Из Аллахабада пришла открытка. На ней нарисован слон');
      if (g.state.marks.speedy || f.cabin) await g.title('Капитан Спиди салютует из Квинстауна');
      if (!f.ppStays && f.pp === 'with') await g.title('Паспарту ушёл искать самый спокойный дом в Англии');
      else if (f.ending === 'lost') await g.title('Паспарту остался. Без жалованья');
    },
  ],
};
