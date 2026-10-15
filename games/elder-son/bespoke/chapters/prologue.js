// Пролог (game.md §6). The last train leaves; two are left on the platform. Before it game.js shows the first «Состав»
// (no title): the first press on the semaphore wakes the sound.
// Reads: nothing. Leaves: nothing (no choices).
import { SCENES } from '../story.js';

export default {
  number: '', title: 'Пролог',
  titles: ['Платформа'],
  choices: [],
  steps: [
    async g => {
      g.beds({ wind: 0.4, train: 0.5 });
      await g.scene(SCENES.platform, { beat: 'gone' });
      await g.beat('gone');
      // the first touch of a thing in the scene: the tail lights; till then the train crawls on (scenes.md `gone`)
      await g.choose(null, { 'train#tail': [{ id: 'call', label: 'Окликнуть' }] });
      const dark = g.told('wave:dark');
      const wave = g.beat('wave');
      g.sound.horn(0.7); // (the train answers)
      g.beds({ wind: 0.4 }, 6);
      await dark;
      g.title('Старший сын'); // (not waited for)
      await wave;
      const cold = g.told('stand:cold');
      const stand = g.beat('stand');
      await cold;
      await g.say('narrator', 'Последняя электричка ушла в двадцать три сорок. Следующая — в шесть ноль пять');
      await g.say('silva', 'Всё, студент. Приехали');
      await g.say('busygin', 'До шести тут замёрзнем');
      await stand;
    },
  ],
};
