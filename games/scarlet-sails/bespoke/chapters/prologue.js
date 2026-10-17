// Пролог — dawn over the empty shore: a scarlet spark at the cape; the player looks at it (the first touch),
// the spark grows into a ship under scarlet sails, the title; then, joined by a cut, the same sail on a toy
// ship in Longren's workshop. Reads: nothing. Leaves: nothing (no choices); it goes on into I.1 without «Даль».
import { SCENES } from '../story.js';

export default {
  number: '',
  title: 'Пролог',
  titles: ['Берег'],
  choices: [],
  steps: [
    async g => {
      g.hero('both');
      g.beds({ sea: 0.5 }, 4);
      await g.scene(SCENES.shore, { beat: 'spark' });
      await g.beat('spark');
      await g.wait(2000);
      await g.choose(null, { 'ship_rig#ship': [{ id: 'look', label: 'Всмотреться' }] });
      // (the title comes as the spark begins to grow; not waited for)
      const sparked = g.told('prologue:spark');
      const prologue = g.beat('prologue');
      sparked.then(() => {
        g.sound.motif();
        g.title('Алые паруса');
      });
      await prologue;
      // where the ship is on the screen: the toy ship of the next scene begins there, as small
      const ship = await g.spot('ship_rig#ship'), top = await g.spot('ship_rig#masthead');
      const match = ship && top ? { match_x: ship.x, match_y: ship.y, match_s: 2 * (ship.y - top.y) } : {};
      const near = g.told('match:near');
      await g.scene(SCENES.home, { beat: 'match', ...match }, { cut: true });
      const matched = g.beat('match');
      await near;
      await g.say('narrator', 'Лонгрен делал игрушки. Ассоль было восемь лет');
      await matched;
    },
  ],
};
