// Эпилог «Три окна» — без слов: калитка в С., крыльцо в Москве, пустая скамья в Ореанде. Что видно у калитки и у
// крыльца — по тому, кто из супругов знает (через carry: husband_knows, wife_knows, spring). Без «Огней» перед собой
// (wall: false): глава V переходит в него; шкалы скрыты (game.js). game.md §6 «Эпилог».
// Читает: facts.spring (подложка); через carry — husband_knows, wife_knows, spring. Оставляет: —.
import { SCENES, facts } from '../story.js';

export default {
  number: '',
  title: 'Три окна',
  wall: false,
  season: s => (facts(s).spring ? 'thaw' : 'winter'),
  titles: ['С.', 'Москва', 'Ореанда'],
  choices: [],
  steps: [
    // С.: муж со старым шпицем у забора или у калитки
    async g => {
      g.hero('both');
      g.beds(facts(g.state).spring ? { thaw: 0.3 } : { snow: 0.3 });
      await g.scene(SCENES.town, { beat: 'fence_end' });
      await g.beat('fence_end');
    },
    // Москва: окно наверху — жена у окна или дом тёмный
    async g => {
      g.hero('both');
      g.beds(facts(g.state).spring ? { thaw: 0.3 } : { snow: 0.3 });
      await g.scene(SCENES.moscow, { beat: 'porch_end' });
      await g.beat('porch_end');
    },
    // Ореанда: рассвет, пустая скамья, море
    async g => {
      g.hero('both');
      g.beds({ sea: 0.6 }, 4);
      await g.scene(SCENES.oreanda, { beat: 'bench_end' });
      await g.beat('bench_end');
    },
  ],
};
