// II. Гонконг «в которой Паспарту теряет хозяина» — game.md §3. The night on the «Rangoon» (~ answer; Aouda writes her
// line in the notebook); Hong Kong: the cousin gone — ⚑ aouda: Europe or Holland; the tavern, Fix, the pipe («Не
// уснуть»), the «Carnatic» sails with Passepartout alone; the morning, the «Tankadera» (~ boat: Fix taken or not);
// the typhoon («Тайфун»), the gun at Shanghai; Yokohama — the Long Noses («Пирамида»: drop or hold, by the hands); the
// «General Grant» (~ punch), two Wednesdays.
// Reads: choices.sati; hands ne-usnut, tayfun, piramida; marks fix. Leaves: choices answer, aouda, boat, punch;
// choices.pyramid (by the hands); hours, money; marks aouda, fix, pp, bruise, wings; lines.
import { SCENES } from '../story.js';
import neUsnut from '../minigames/ne-usnut.js';
import tayfun from '../minigames/tayfun.js';
import piramida from '../minigames/piramida.js';

export default {
  number: 'II',
  title: 'Гонконг',
  heading: 'в которой Паспарту теряет хозяина',
  route: [0.22, 0.55],
  titles: ['Палуба «Рангуна»', 'Кузен', 'Таверна', '«Танкадера»', 'Тайфун', 'Длинные носы', 'Две среды'],
  choices: [
    { id: 'answer', weight: '~', title: 'Ответ Фогга', options: [{ id: 'spare', label: 'Они были в запасе' }, { id: 'plaid', label: 'Отдать плед' }, { id: 'notlost', label: 'Я их не потерял' }] },
    { id: 'aouda', weight: '⚑', title: 'Ауда', options: [{ id: 'europe', label: 'Едемте с нами в Европу' }, { id: 'holland', label: 'Дорога в Голландию' }] },
    { id: 'boat', weight: '~', title: 'Фикс на боте', options: [{ id: 'take', label: 'Взять' }, { id: 'leave', label: 'Отходим' }] },
    { id: 'pyramid', weight: '~', title: 'Пирамида', options: [{ id: 'drop', label: 'Бросить' }, { id: 'hold', label: 'Достоять' }] },
    { id: 'punch', weight: '~', title: 'Фикс на «Генерале Гранте»', options: [{ id: 'punch', label: 'Ударить' }, { id: 'shake', label: 'Пожать руку' }] },
  ],
  steps: [
    // the «Rangoon» at night: Aouda at the rail; ~ the answer; she writes a line in the notebook
    async g => {
      g.hero('fogg');
      g.beds({ sea: 0.5, clock: 0.15 }, 3);
      const turns = g.told('rail_night:turns');
      await g.scene(SCENES.deck, { beat: 'rail_night', ship: 'rangoon', port: 'none', with_aouda: 1 });
      const night = g.beat('rail_night');
      await turns;
      await g.say('aouda', g.state.choices.sati === 'road' ? 'Вы рисковали из-за меня' : 'Вы потеряли из-за меня двенадцать часов');
      await night;
      const answer = await g.choose('answer', {
        'fogg#head': [{ id: 'spare', label: 'Они были в запасе' }, { id: 'plaid', label: 'Отдать плед' }, { id: 'notlost', label: 'Я их не потерял' }],
      });
      if (answer === 'spare') await g.say('fogg', 'Они были в запасе');
      else if (answer === 'notlost') {
        await g.say('fogg', 'Я их не потерял');
        g.relate('aouda', 1);
      } else {
        await g.beat('plaid');
        g.relate('aouda', 1);
      }
      await g.say('aouda', 'Можно мне вашу книжку, мистер Фогг?');
      await g.book('Гонконг. Кузен Джиджибхай', 'aouda');
      await g.beat('writes');
    },
    // Hong Kong: the cousin gone two years — ⚑ Europe or Holland
    async g => {
      g.hero('fogg');
      g.beds({ town: 0.4, sea: 0.3 }, 2);
      const met = g.told('quay:met');
      await g.scene(SCENES.harbour, { beat: 'quay', port: 'hongkong', with_aouda: 1, aouda_dress: 1, evening: 0, night: 0 });
      const quay = g.beat('quay');
      await met;
      await g.say('fogg', 'Ваш кузен уехал в Голландию два года назад');
      await quay;
      const back = g.told('cousin:looks-back');
      const cousin = g.beat('cousin');
      await back;
      await g.say('aouda', 'Что же мне делать, мистер Фогг?');
      await cousin;
      const aouda = await g.choose('aouda', {
        'fogg#head': [{ id: 'europe', label: 'Едемте с нами в Европу' }],
        'aouda#head': [{ id: 'holland', label: 'Я оплачу вам дорогу в Голландию' }],
      });
      if (aouda === 'europe') {
        await g.say('fogg', 'Едемте с нами в Европу');
        await g.say('aouda', 'С вами… Да');
      } else {
        await g.say('fogg', 'Я оплачу вам дорогу в Голландию. Почтовый пароход — безопасно и к родным');
        g.money(-500);
        g.mark('holland', true, 'Ауда это запомнит');
        await g.say('aouda', 'Благодарю вас, мистер Фогг');
      }
    },
    // the tavern: Fix reveals himself; the pipe; «Не уснуть»; the «Carnatic» sails with Passepartout
    async g => {
      g.hero('pp');
      g.beds({ town: 0.5, sea: 0.2 }, 2);
      const poured = g.told('tavern:poured');
      await g.scene(SCENES.harbour, { beat: 'tavern', port: 'hongkong' });
      const tavern = g.beat('tavern');
      await poured;
      await g.say('pp', '«Карнатик» уходит сегодня вечером, а не завтра! Надо сказать хозяину!');
      await tavern;
      const shown = g.told('badge:shown'), up = g.told('badge:up');
      const badge = g.beat('badge');
      await shown;
      await g.say('fix', 'Я сыщик. Ваш хозяин — вор из Английского банка. Задержите его здесь — и пятьсот фунтов ваши');
      await up;
      await g.say('pp', 'Мой хозяин — честнейший человек!');
      await badge;
      await g.say('fix', 'Выпейте со мной. Одну трубку — за дружбу');
      await g.beat('pipe');
      g.beds({ town: 0.25, sea: 0.4 }, 3);
      const r = await g.play(neUsnut, { say: text => g.say('pp', text) });
      g.mark('told', !!r?.told);
      g.beds({ sea: 0.5 }, 3);
      const aboard = g.told('carnatic:aboard');
      await g.scene(SCENES.harbour, { beat: 'carnatic', port: 'hongkong' });
      const carnatic = g.beat('carnatic');
      await aboard;
      await g.say('pp', 'Хозяин… «Карнатик»…');
      g.sound.trainWhistle();
      await carnatic;
    },
    // the morning: the pier empty; Bunsby and the «Tankadera»; ~ Fix taken on board or not
    async g => {
      g.hero('fogg');
      g.beds({ sea: 0.4, town: 0.2 }, 2);
      const told = g.state.marks.told;
      const watch = g.told('morning:watch');
      await g.scene(SCENES.harbour, { beat: 'morning', port: 'hongkong', evening: 0, night: 0 });
      const morning = g.beat('morning');
      await watch;
      await g.say('fogg', told ? 'Лодочник был прав. «Карнатик» ушёл ночью' : '«Карнатик» ушёл. И Паспарту с ним');
      await morning;
      g.hours(told ? -4 : -10, told ? 'Весть дошла ночью' : 'Весть пришла утром');
      const fix = g.told('bunsby:fix');
      const bunsby = g.beat('bunsby');
      await g.say('bunsby', 'Восемьсот миль в такую погоду, сэр?');
      await g.say('fogg', 'Сто фунтов в день. И двести, если успеем');
      g.money(-800);
      g.sound.notes();
      await fix;
      await g.say('fix', 'Я тоже опоздал на «Карнатик»');
      await bunsby;
      const boat = await g.choose('boat', {
        'fix#head': [{ id: 'take', label: 'Едемте с нами' }],
        'bunsby#head': [{ id: 'leave', label: 'Отходим' }],
      });
      if (boat === 'take') {
        await g.say('fogg', 'Едемте с нами');
        g.money(-100);
        g.relate('fix', 1);
        g.relate('pp', -1);
      }
      const sails = g.told('cast_off:sails-up');
      g.set('with_fix', boat === 'take' ? 1 : 0);
      const off = g.beat('cast_off');
      await sails;
      await off;
      if (g.state.choices.aouda === 'holland') {
        const wave = g.told('stay_behind:wave');
        const stay = g.beat('stay_behind');
        await wave;
        await g.wait(1500);
        await stay;
      }
    },
    // the typhoon; the gun at Shanghai
    async g => {
      g.hero('fogg');
      g.beds({ storm: 0.5 }, 3);
      const withAouda = g.state.choices.aouda !== 'holland';
      const reef = g.told('squall:reef');
      await g.scene(SCENES.sea, { beat: 'squall', with_aouda: withAouda ? 1 : 0, with_fix: g.state.choices.boat === 'take' ? 1 : 0 });
      const squall = g.beat('squall');
      await reef;
      await g.say('bunsby', 'Тайфун, сэр. Носом к волне — иначе перевернёт');
      await squall;
      g.beds({ storm: 0.9 }, 2);
      await g.beat('typhoon', { wait: false });
      const r = await g.play(tayfun);
      if (r?.hours) g.hours(r.hours, 'Тайфун');
      if (withAouda) await g.beat('aouda_storm');
      g.beds({ storm: 0.3, sea: 0.4 }, 4);
      const gun = g.told('shanghai:gun'), turns = g.told('shanghai:turns');
      const shanghai = g.beat('shanghai');
      await g.say('bunsby', 'Пароход на горизонте! Флаг приспустить! Пушку!');
      await gun;
      g.sound.cannon();
      await turns;
      await g.say('fogg', 'Он поворачивает. В Иокогаму');
      await shanghai;
    },
    // Yokohama: the Long Noses; Passepartout holds the pyramid; his master in the first row — drop or hold
    async g => {
      g.hero('pp');
      g.beds({ drums: 0.5, crowd: 0.5, town: 0.2 }, 2);
      const announce = g.told('show:announce');
      await g.scene(SCENES.harbour, { beat: 'show', port: 'yokohama', evening: 1, night: 1, pp_wings: 1 });
      const show = g.beat('show');
      await announce;
      await g.say('batulcar', 'Длинные носы! Живая пирамида!');
      await show;
      await g.beat('pyramid', { wait: false });
      const r = await g.play(piramida);
      const choice = r?.choice ?? 'drop';
      g.state.choices.pyramid = choice;
      g.mark('wings', true);
      g.beds({ crowd: 0.3, town: 0.2 }, 2);
      if (choice === 'drop') {
        await g.beat('see');
        const shout = g.told('collapse:batulcar');
        const collapse = g.beat('collapse');
        await shout;
        await g.say('batulcar', 'Кто заплатит за моих носов?!');
        await g.say('fogg', 'Я');
        g.money(-200);
        g.sound.notes();
        await collapse;
      } else {
        const bow = g.told('finish:bow');
        const finish = g.beat('finish');
        await bow;
        g.sound.applause();
        await finish;
        g.hours(-1, 'Номер до конца');
        const face = g.told('reunion:face');
        const reunion = g.beat('reunion');
        await face;
        await g.say('pp', 'Я держал их, хозяин. Они бы упали');
        await g.say('fogg', 'Пароход отходит в половине седьмого');
        await reunion;
        g.relate('pp', 1);
      }
    },
    // the «General Grant»: Fix comes over — ~ punch or shake; the calendar: Wednesday again
    async g => {
      g.hero('pp');
      g.beds({ sea: 0.5, clock: 0.15 }, 2);
      const fixCame = g.told('pacific:fix');
      await g.scene(SCENES.deck, { beat: 'pacific', ship: 'general_grant', port: 'none', pp_wings: 1 });
      const pacific = g.beat('pacific');
      await fixCame;
      await g.say('fix', 'Теперь я на вашей стороне. До Англии — я ваш лучший друг');
      await pacific;
      const punch = await g.choose('punch', {
        'passepartout#head': [{ id: 'punch', label: 'Ударить' }],
        'fix#head': [{ id: 'shake', label: 'Пожать руку' }],
      });
      if (punch === 'punch') {
        const down = g.told('punch:down');
        const beat = g.beat('punch');
        await down;
        g.sound.slap();
        await beat;
        g.relate('fix', -1);
        g.mark('bruise', true);
        await g.say('fix', 'Я этого ждал. Теперь — до Англии');
      } else {
        await g.beat('shake');
        g.relate('fix', 1);
      }
      g.hero('both');
      const leaf = g.told('calendar:leaf'), laugh = g.told('calendar:laugh');
      const calendar = g.beat('calendar');
      await leaf;
      await g.say('sailor', 'Опять среда, джентльмены');
      await laugh;
      await g.say('pp', 'Две среды подряд! Ну и календарь у этих американцев!');
      await g.say('fogg', 'В моей книжке — четверг');
      await calendar;
    },
  ],
};
