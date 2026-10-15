// Глава I «Набережная» — Ялта, лето. Сад: Гуров подманивает шпица за соседним столом и выбирает, как обойтись с ним
// (погрозить пальцем или погладить) — так начинается его шкала (часы); разговор через проход; ночная набережная.
// Пристань: глазами Анны — лорнетка, приезжие, страх узнать; потерянная лорнетка, «Пойдёмте к вам». Без «Огней» перед
// собой: пролог переходит в неё (wall: false). game.md §6 «Глава I».
// Читает: —. Оставляет: choices.dog, marks.dog, shown.heart.
import { SCENES } from '../story.js';
import podmanit from '../minigames/podmanit.js';
import lornetka from '../minigames/lornetka.js';

export default {
  number: 'I',
  title: 'Набережная',
  wall: false,
  season: () => 'summer',
  titles: ['Сад', 'Пристань'],
  choices: [
    { id: 'dog', weight: '~', title: 'Шпиц у колена', options: [{ id: 'finger', label: 'Погрозить пальцем' }, { id: 'pat', label: 'Погладить' }] },
  ],
  steps: [
    // Сад: вечер, фонари сада, далёкий оркестр; шпиц, его рука, её «Он не кусается»; разговор; ночь, лунная дорожка
    async g => {
      g.hero('gurov');
      g.beds({ sea: 0.3, cicadas: 0.2 });
      const band = g.sound.band();
      g.signal.addEventListener('abort', () => band.stop(1));
      const sat = g.told('garden:sat');
      await g.scene(SCENES.quay, { beat: 'garden' });
      const garden = g.beat('garden');
      g.next('coax');
      await sat;
      await g.say('narrator', 'Однажды под вечер он обедал в саду, а она подошла и села за соседний стол');
      await garden;
      const coax = g.beat('coax');
      g.next('coax_hold');
      await coax;
      const r = await g.play(podmanit);
      g.set('spitz_near', 1);
      g.set('hand', 0);
      g.set('trust', r.startles ? 0 : 1);
      await g.beat('coax_hold');
      const dog = await g.choose('dog', { spitz: [{ id: 'finger', label: 'Погрозить пальцем' }, { id: 'pat', label: 'Погладить' }] });
      g.gauge('heart');
      if (dog === 'finger') {
        g.scale('heart', -1);
        g.mark('dog', 'finger', 'Шпиц это запомнит.');
        g.next('finger');
        const growl = g.told('finger:growl');
        const finger = g.beat('finger');
        g.next('talk');
        await growl;
        g.sound.growl();
        await g.say('anna', 'Он не кусается');
        await g.say('gurov', 'Можно дать ему кость?');
        await finger;
      } else {
        g.scale('heart', 1);
        g.mark('dog', 'pat', 'Шпиц это запомнит.');
        g.next('pat');
        const sits = g.told('pat:sits');
        const pat = g.beat('pat');
        g.next('talk');
        await sits;
        await g.say('anna', 'Он не кусается');
        await g.say('gurov', 'Можно дать ему кость?');
        await pat;
      }
      const turned = g.told('talk:turned');
      const talk = g.beat('talk');
      g.next('walk_out');
      await turned;
      await g.say('gurov', 'Вы давно изволили приехать в Ялту?');
      await g.say('anna', 'Дней пять');
      await g.say('gurov', 'А я уж дотягиваю здесь вторую неделю');
      await g.say('gurov', 'Это только принято говорить, что здесь скучно. Обыватель живёт где-нибудь в Белёве — и ему не скучно');
      await g.say('gurov', 'А приедет сюда: «Ах, скучно! Ах, пыль!» Подумаешь, что он из Гренады приехал');
      await talk;
      const moon = g.told('walk_out:moon');
      const walk = g.beat('walk_out');
      await moon;
      await g.say('narrator', 'Вода была сиреневого цвета, такого мягкого и тёплого, и по ней от луны шла золотая полоса');
      await g.say('narrator', 'Он узнал, что её зовут Анна Сергеевна, что она замужем и что муж её служит в С.');
      await walk;
      band.stop(3);
    },
    // Пристань: праздничный день, ветер, пароход пришёл поздно; Анна в лорнетку ищет знакомых среди приезжих
    async g => {
      g.hero('anna');
      g.beds({ sea: 0.5, wind: 0.5, crowd: 0.6 });
      const lorgnette = g.told('pier:lorgnette');
      await g.scene(SCENES.quay, { beat: 'pier' });
      const pier = g.beat('pier');
      g.next('gangway');
      g.sound.horn();
      await g.say('narrator', 'Прошла неделя. Был праздничный день, дул сухой ветер, и пароход пришёл поздно');
      await lorgnette;
      await g.say('narrator', 'Она смотрела в лорнетку на пассажиров, как бы отыскивая знакомых');
      await pier;
      const gangway = g.beat('gangway');
      g.next('lost');
      await gangway;
      const r = await g.play(lornetka);
      g.set('pass', 7);
      g.set('look_at', '');
      g.set('stranger_turn', 1);
      g.set('surge', 1);
      g.set('fright', r.stranger ? 1 : 0);
      g.sound.clink();
      g.beds({ sea: 0.5, wind: 0.4 });
      const empty = g.told('lost:empty');
      const lost = g.beat('lost');
      g.next('kiss');
      await empty;
      await g.say('narrator', 'Анна Сергеевна потеряла в толпе лорнетку');
      await lost;
      const look = g.told('kiss:look');
      const kiss = g.beat('kiss');
      g.next('go');
      await look;
      await g.say('gurov', 'Пойдёмте к вам');
      await kiss;
      await g.beat('go');
    },
  ],
};
