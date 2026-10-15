// Глава II «Ореанда» — Ялта, лето, оба. Номер: свеча, её стыд, арбуз (режут всегда) — и выбор, как он с ней обошёлся
// (есть за столом или отнести ей ломоть); её исповедь. Ореанда: перед рассветом над морем. Полдень: поцелуй с
// оглядкой, письмо мужа. Станция: глазами Анны — окно вагона (смотреть или задёрнуть: начинается её шкала, поводок);
// Гуров один на платформе. game.md §6 «Глава II».
// Читает: facts.eat (станция: что она говорит), facts.heart (станция: уходит сразу или идёт за поездом).
// Оставляет: choices.room, choices.window, shown.anna.
import { SCENES, facts } from '../story.js';
import arbuz from '../minigames/arbuz.js';
import ryadom from '../minigames/ryadom.js';
import more from '../minigames/more.js';
import sOgljadkoj from '../minigames/s-ogljadkoj.js';

export default {
  number: 'II',
  title: 'Ореанда',
  season: () => 'summer',
  titles: ['Номер', 'Ореанда', 'Полдень', 'Станция'],
  choices: [
    { id: 'room', weight: '~', title: 'После арбуза', options: [{ id: 'eat', label: 'Есть за столом' }, { id: 'bring', label: 'Отнести ей ломоть' }] },
    { id: 'window', weight: '~', title: 'Окно вагона', options: [{ id: 'look', label: 'Смотреть, пока видно' }, { id: 'curtain', label: 'Задёрнуть занавеску' }] },
  ],
  steps: [
    // Номер: ночь, свеча; арбуз; есть за столом — или отнести ей ломоть и сесть рядом; её исповедь
    async g => {
      g.hero('gurov');
      g.beds({ sea: 0.25, room: 0.3 });
      await g.scene(SCENES.room, { beat: 'room' });
      const room = g.beat('room');
      g.next('room_hold');
      await g.say('narrator', 'У неё в номере было душно и пахло духами, которые она купила в японском магазине');
      await room;
      const hold = g.beat('room_hold');
      g.next('melon');
      await g.say('anna', 'Нехорошо. Вы же первый меня не уважаете теперь');
      await hold;
      const melon = g.beat('melon');
      g.next('melon_hold');
      await melon;
      const r = await g.play(arbuz);
      g.set('cut', 1);
      g.set('slice', 1);
      g.set('ragged', r.lifts ? 1 : 0);
      g.set('candle', 0.4, 2);
      g.beds({ sea: 0.25, room: 0.3, weep: 0.15 });
      const melonHold = g.beat('melon_hold');
      await g.say('narrator', 'Прошло, по крайней мере, полчаса в молчании');
      await melonHold;
      const how = await g.choose('room', { watermelon: [{ id: 'eat', label: 'Есть за столом' }], anna: [{ id: 'bring', label: 'Отнести ей ломоть' }] });
      if (how === 'eat') {
        g.scale('heart', -2);
        g.next('melon_eat');
        const eat = g.beat('melon_eat');
        g.next('confession_table');
        await eat;
        const speaks = g.told('confession_table:speaks');
        const confession = g.beat('confession_table');
        await speaks;
        await g.say('anna', 'Я не мужа обманула, а самоё себя');
        await g.say('anna', 'Мой муж, может быть, честный, хороший человек, но ведь он лакей!');
        await g.say('anna', 'Хотелось пожить! Пожить и пожить…');
        await g.say('gurov', 'Полно, полно…');
        await confession;
      } else {
        g.scale('heart', 2);
        g.next('beside');
        const beside = g.beat('beside');
        g.next('beside_hold');
        await beside;
        const q = await g.play(ryadom);
        g.set('hand_at', 1);
        g.set('pull', 0);
        g.set('palm', 1);
        g.set('apart', q.pulls ? 1 : 0);
        const besideHold = g.beat('beside_hold');
        g.next('confession_bed');
        await g.say('gurov', 'Отчего бы я мог перестать уважать тебя?');
        await besideHold;
        const speaks = g.told('confession_bed:speaks');
        const confession = g.beat('confession_bed');
        await speaks;
        await g.say('anna', 'Я не мужа обманула, а самоё себя');
        await g.say('anna', 'Мой муж, может быть, честный, хороший человек, но ведь он лакей!');
        await g.say('anna', 'Хотелось пожить! Пожить и пожить…');
        await g.say('gurov', 'Полно, полно…');
        await confession;
      }
      g.beds({ sea: 0.25, room: 0.3 });
    },
    // Ореанда: перед рассветом, скамья над морем; сторож; роса на траве
    async g => {
      g.hero('both');
      g.beds({ sea: 0.6, cicadas: 0.4 }, 3);
      const sat = g.told('bench:sat');
      await g.scene(SCENES.oreanda, { beat: 'bench' });
      const bench = g.beat('bench');
      g.next('still');
      await sat;
      await g.say('narrator', 'В Ореанде сидели на скамье недалеко от церкви, смотрели вниз на море и молчали');
      await bench;
      const still = g.beat('still');
      g.next('watchman');
      await still;
      let sea = false;
      const r = await g.play(more, { sea: () => (sea = true, g.say('narrator', 'Так шумело внизу, когда ещё тут не было ни Ялты, ни Ореанды. Теперь шумит и будет шуметь так же равнодушно и глухо, когда нас не будет')) });
      g.set('dawn', 1, 1);
      g.set('lights', 0, 2);
      g.set('cicada', 0);
      g.set('hand', r.touched.includes('hand') ? 1 : 0);
      g.beds({ sea: 0.6 });
      if (!sea) await g.say('narrator', 'Так шумело внизу, когда ещё тут не было ни Ялты, ни Ореанды. Теперь шумит и будет шуметь так же равнодушно и глухо, когда нас не будет');
      const looks = g.told('watchman:looks');
      const gone = g.told('watchman:gone');
      const watchman = g.beat('watchman');
      g.next('dew');
      await looks;
      await g.say('narrator', 'Подошёл какой-то человек — должно быть, сторож, — посмотрел на них и ушёл');
      await gone;
      await g.say('narrator', 'Видно было, как пришёл пароход из Феодосии, освещённый утренней зарёй, уже без огней');
      await watchman;
      const dew = g.beat('dew');
      await g.say('anna', 'Роса на траве', 'anna');
      await g.say('gurov', 'Да. Пора домой');
      await dew;
    },
    // Полдень: каждый полдень вместе; поцелуй с оглядкой; письмо мужа
    async g => {
      g.hero('both');
      g.beds({ sea: 0.4, cicadas: 0.5 });
      await g.scene(SCENES.quay, { beat: 'noon_garden' });
      const garden = g.beat('noon_garden');
      g.next('days');
      await g.say('narrator', 'Каждый полдень они встречались на набережной, вместе завтракали, обедали, гуляли');
      await g.say('narrator', 'Они целовались среди белого дня, с оглядкой — как бы кто не увидел');
      await garden;
      const r = await g.play(sOgljadkoj);
      g.set('kiss_now', 1);
      g.set('seen', 0);
      g.set('gossip', r.seen ? 1 : 0);
      const letter = g.told('days:letter');
      const days = g.beat('days');
      await letter;
      await g.say('narrator', 'Но вот пришло письмо от мужа');
      await Promise.all([g.letter({ text: 'Анна, у меня разболелись глаза. Возвращайся, если можно. Шпица не перекармливай.', sign: 'Твой муж' }), g.say('diderits', 'Анна, у меня разболелись глаза. Возвращайся, если можно. Шпица не перекармливай', 'narrator')]);
      g.sound.paper();
      await days;
    },
    // Станция: глазами Анны — прощание, окно вагона; потом Гуров один на платформе
    async g => {
      const f = facts(g.state);
      g.hero('anna');
      g.beds({ crickets: 0.5, wires: 0.3, steam: 0.4 });
      const bell = g.told('platform:bell');
      await g.scene(SCENES.station, { beat: 'platform' });
      const platform = g.beat('platform');
      g.next('board');
      bell.then(rang => { if (rang) g.sound.bell(); });
      if (f.eat) await g.say('anna', 'Хорошо, что я уезжаю. Это сама судьба');
      else await g.say('anna', 'Дайте я погляжу на вас ещё… Погляжу ещё раз. Вот так');
      await g.say('anna', 'Мы навсегда прощаемся, это так нужно, потому что не следовало бы вовсе встречаться');
      await bell;
      await platform;
      await g.beat('board');
      const way = await g.choose('window', { anna: [{ id: 'look', label: 'Смотреть, пока видно' }], 'carriage#curtain': [{ id: 'curtain', label: 'Задёрнуть занавеску' }] });
      g.gauge('anna');
      g.sound.whistle();
      const alone = f.heart === 'frank' ? 'alone_far' : 'alone_turn';
      if (way === 'look') {
        g.scale('anna', 1);
        g.next('look_back');
        const back = g.beat('look_back');
        g.next(alone);
        g.sound.wheels();
        await back;
      } else {
        g.scale('anna', -1);
        g.next('curtain');
        const curtain = g.beat('curtain');
        g.next(alone);
        g.sound.wheels();
        await curtain;
      }
      g.hero('gurov');
      g.beds({ crickets: 0.6, wires: 0.4 });
      const moment = g.told(alone === 'alone_far' ? 'alone_far:stands' : 'alone_turn:door');
      const last = g.beat(alone);
      await g.say('narrator', 'Он остался на платформе один. Кричали кузнечики, гудели телеграфные проволоки');
      await moment;
      await g.say('gurov_inner', 'Вот и ещё одно приключение… И оно тоже уже кончилось', 'gurov');
      await last;
      await g.say('narrator', 'На станции уже пахло осенью, вечер был прохладный');
    },
  ],
};
