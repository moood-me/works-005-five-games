// Пролог «Новое лицо» — Ялта в полдень: пустая набережная в бликах, по парапету бежит белый шпиц и садится; игрок
// окликает его (касание без выбора), шпиц лает, дама подбирает поводок и уходит; титр; Гуров в тени павильона смотрит
// ей вслед. Дальше без «Огней» — глава I (у неё wall: false). game.md §6 «Пролог».
// Читает: —. Оставляет: — (выборов нет).
import { SCENES } from '../story.js';

export default {
  number: '',
  title: 'Новое лицо',
  season: () => 'summer',
  titles: ['Новое лицо'],
  choices: [],
  steps: [
    // the quay at noon: the spitz on the parapet, the player calls it; the lady takes the leash; the title; Gurov looks
    async g => {
      g.hero('gurov');
      g.beds({ sea: 0.6, cicadas: 0.4 }, 3);
      await g.scene(SCENES.quay, { beat: 'noon' });
      const noon = g.beat('noon');
      g.next('noon_turn');
      await noon;
      await g.choose(null, { spitz: [{ id: 'call', label: 'Окликнуть' }] });
      g.sound.bark();
      const leash = g.told('noon_turn:leash');
      const turn = g.beat('noon_turn');
      g.next('pavilion');
      await leash;
      await g.say('narrator', 'Говорили, что на набережной появилось новое лицо: дама с собачкой');
      await turn;
      g.title('Дама с собачкой'); // (not waited for: the pavilion goes on under it)
      const looks = g.told('pavilion:looks');
      const pavilion = g.beat('pavilion');
      await looks;
      await g.say('narrator', 'Дмитрий Дмитрич Гуров, проживший в Ялте уже две недели, тоже стал интересоваться новыми лицами');
      await g.say('narrator', 'О женщинах он отзывался почти всегда дурно и называл их низшей расой');
      await pavilion;
    },
  ],
};
