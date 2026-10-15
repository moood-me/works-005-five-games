// I. Индия «в которой слон стоит две тысячи фунтов» — game.md §3. Suez (Fix names Fogg to the consul), Bombay two
// days early; the rails end in the forest; the elephant bought («Торг») and ridden («Слон»); the procession and the
// suttee — ⚑ sati: tonight, quietly (the pyre, «Как мёртвый») or now, on the road («Рывок»); Allahabad, Aouda wakes;
// ~ kiouni: given to the guide or sold; the Ganges.
// Reads: hands torg, slon, kak-mertvyy, ryvok. Leaves: choices.sati, choices.kiouni; hours, money; marks aouda, pp,
// guide.
import { SCENES } from '../story.js';
import torg from '../minigames/torg.js';
import slon from '../minigames/slon.js';
import kakMertvyy from '../minigames/kak-mertvyy.js';
import ryvok from '../minigames/ryvok.js';

export default {
  number: 'I',
  title: 'Индия',
  heading: 'в которой слон стоит две тысячи фунтов',
  route: [0, 0.22],
  titles: ['Суэц', 'Конец рельсов', 'Торг', 'Слон', 'Процессия', 'Аллахабад', 'Ганг'],
  choices: [
    { id: 'sati', weight: '⚑', title: 'Сати', options: [{ id: 'night', label: 'Ночью, тихо' }, { id: 'road', label: 'Сейчас, на дороге' }] },
    { id: 'kiouni', weight: '~', title: 'Киуни', options: [{ id: 'gift', label: 'Отдать проводнику' }, { id: 'sell', label: 'Продать' }] },
  ],
  steps: [
    // Suez: Passepartout and an amiable stranger; the stranger to the consul. Bombay at dawn, two days early
    async g => {
      g.hero('pp');
      g.beds({ sea: 0.4, town: 0.3, clock: 0.15 }, 2);
      const chat = g.told('suez:chat'), whisper = g.told('suez:whisper');
      await g.scene(SCENES.deck, { beat: 'suez', ship: 'mongolia', port: 'suez' });
      const suez = g.beat('suez');
      await chat;
      await g.say('pp', 'Мсье Фикс — какой любезный человек!');
      await whisper;
      await g.say('fix', 'Это он. Вор из Английского банка. Мне нужен ордер');
      await suez;
      g.hero('fogg');
      const book = g.told('bombay:book');
      await g.scene(SCENES.deck, { beat: 'bombay', ship: 'mongolia', port: 'bombay' });
      const bombay = g.beat('bombay');
      await book;
      g.hours(48, '«Монголия»: на два дня раньше');
      await g.say('fogg', 'Бомбей. Два дня в запасе');
      await bombay;
    },
    // the train stops in the forest: the rails end here
    async g => {
      g.hero('both');
      g.beds({ wheels: 0.4 }, 2);
      const stopped = g.told('brake:stopped');
      await g.scene(SCENES.train, { beat: 'brake', land: 'india' });
      const brake = g.beat('brake');
      await stopped;
      g.beds({ jungle: 0.3 }, 3);
      await g.say('conductor', 'Рельсы кончаются здесь, господа. До Аллахабада пятьдесят миль');
      await brake;
      g.hours(-34, 'Пятьдесят миль без рельсов');
    },
    // the end of the rails; Passepartout finds the elephant; the bargain («Торг»); all up into the howdah
    async g => {
      g.hero('fogg');
      g.beds({ jungle: 0.5 }, 2);
      const shed = g.told('rails_end:shed');
      await g.scene(SCENES.jungle, { beat: 'rails_end', day: 1, station: 'kholby' });
      const end = g.beat('rails_end');
      await shed;
      await g.say('pp', 'Мсье! Слон! Настоящий слон!');
      await end;
      await g.beat('haggle', { wait: false });
      await g.say('fogg', 'Тысяча фунтов');
      await g.say('owner', 'Нет');
      const r = await g.play(torg, { say: (who, text) => g.say(who, text) });
      g.money(-(r?.price ?? 2000));
      if (r?.minutes) g.hours(-r.minutes / 60, 'Торг');
      g.sound.notes();
      await g.say('owner', 'Он ваш, сахиб. Его зовут Киуни');
      const up = g.told('mount:up');
      const mount = g.beat('mount');
      await up;
      g.sound.trumpet();
      await mount;
    },
    // the ride: Kiouni's own pace, the goad, the sugar; toward dusk
    async g => {
      g.hero('pp');
      g.beds({ jungle: 0.4, elephant: 0.6 }, 2);
      await g.scene(SCENES.jungle, { beat: 'ride', day: 1 }, { cut: true });
      await g.beat('ride', { wait: false });
      const r = await g.play(slon);
      g.hours(r?.hours ?? 0, r?.hours > 0 ? 'Киуни прибавил шагу' : 'Киуни упрямится');
      g.beds({ jungle: 0.2, elephant: 0.3 }, 3);
    },
    // drums at dusk; the procession; the suttee — ⚑ tonight or now
    async g => {
      g.hero('fogg');
      g.beds({ drums: 0.3, jungle: 0.1 }, 3);
      const heard = g.told('drums:heard');
      await g.scene(SCENES.jungle, { beat: 'drums' });
      const drums = g.beat('drums');
      await heard;
      await g.say('guide', 'Барабаны, сахиб. Надо спрятаться');
      await drums;
      g.beds({ drums: 0.7, fire: 0.15 }, 4);
      const widow = g.told('procession:widow'), stopped = g.told('procession:stopped');
      const procession = g.beat('procession');
      await widow;
      await g.say('guide', 'Это сати, сахиб. Вдову сожгут на рассвете — вместе с ним');
      await stopped;
      await g.say('cromarty', 'Её одурманили. Она ничего не понимает');
      await procession;
      await g.say('fogg', 'У меня двенадцать часов запаса. Я могу их потратить');
      const sati = await g.choose('sati', {
        'fogg#head': [{ id: 'night', label: 'Ночью, тихо' }],
        'kiouni#head': [{ id: 'road', label: 'Сейчас, на дороге' }],
      });
      if (sati === 'night') {
        g.hours(-12, 'Ночь у пагоды');
        const gone = g.told('night_wall:gone');
        const wall = g.beat('night_wall');
        await gone;
        await g.say('cromarty', 'Где ваш слуга, мистер Фогг?');
        await wall;
        g.beds({ fire: 0.5, drums: 0.4, crowd: 0.3 }, 3);
        const kindled = g.told('pyre:kindled');
        await g.scene(SCENES.jungle, { beat: 'pyre' });
        const pyre = g.beat('pyre');
        await kindled;
        await g.say('cromarty', 'Поздно, мистер Фогг. Их сотни');
        await pyre;
        const risen = g.told('rise:risen');
        const rise = g.beat('rise');
        await risen;
        g.beds({ fire: 0.5, crowd: 0 }, 1);
        await rise;
        g.hero('pp');
        await g.beat('walk', { wait: false });
        const r = await g.play(kakMertvyy);
        if (r?.hours) g.hours(r.hours, 'Погоня');
        const pp = g.told('flee:pp');
        const flee = g.beat('flee');
        await pp;
        await g.say('pp', 'Бежим, мсье!');
        await flee;
        g.relate('aouda', 1);
      } else {
        g.hours(-2, 'Рывок на дороге');
        g.hero('pp');
        g.beds({ drums: 0.9, elephant: 0.8, crowd: 0.5 }, 1);
        g.sound.trumpet();
        await g.beat('charge', { wait: false });
        const r = await g.play(ryvok);
        if (r?.hours) g.hours(r.hours, 'Погоня');
        g.beds({ elephant: 0.6, drums: 0.3 }, 3);
        await g.say('guide', 'Меня узнали. Мне теперь нельзя домой');
        g.mark('guide', true, 'Проводник это запомнит');
        await g.beat('aouda_fear');
      }
    },
    // Allahabad: Aouda wakes; ~ Kiouni given or sold
    async g => {
      g.hero('fogg');
      g.beds({ jungle: 0.4 }, 3);
      const night = g.state.choices.sati !== 'road';
      const kneel = g.told('allahabad:kneel');
      await g.scene(SCENES.jungle, { beat: 'allahabad', day: 1, station: 'allahabad' });
      const allahabad = g.beat('allahabad');
      await kneel;
      await allahabad;
      const eyes = g.told('wake:eyes');
      g.set('aouda_calm', night ? 1 : 0);
      const wake = g.beat('wake');
      await eyes;
      await g.say('aouda', 'Где я?');
      if (night) await g.say('fogg', 'В безопасности, сударыня. Это Аллахабад');
      else await g.say('cromarty', 'Тише, сударыня. Вы среди друзей');
      await wake;
      const kiouni = await g.choose('kiouni', {
        'guide#head': [{ id: 'gift', label: 'Отдать Киуни проводнику' }],
        'kiouni#head': [{ id: 'sell', label: 'Продать' }],
      });
      if (kiouni === 'gift') {
        const lift = g.told('gift:lift');
        const gift = g.beat('gift');
        await g.say('fogg', 'Киуни ваш');
        await lift;
        g.sound.trumpet();
        await g.say('pp', 'Ха-ха! Прощай, Киуни!');
        await gift;
        g.relate('pp', 1);
      } else {
        g.set('guide_walks', night ? 0 : 1);
        g.money(1000);
        g.sound.notes();
        const away = g.told('sold:away');
        const sold = g.beat('sold');
        await away;
        await g.say('pp', 'Прощай, Киуни…');
        await sold;
      }
    },
    // the Ganges at dawn: Aouda at the window
    async g => {
      g.hero('both');
      g.beds({ wheels: 0.4, clock: 0.15 }, 2);
      const profile = g.told('ganges:profile');
      await g.scene(SCENES.train, { beat: 'ganges', land: 'india', with_aouda: 1 });
      const ganges = g.beat('ganges');
      await profile;
      await g.wait(1500);
      await ganges;
    },
  ],
};
