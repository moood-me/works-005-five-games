// Chapter III “Winter” — Moscow and S. The first snow; she follows him everywhere like a shadow (two figures or four —
// by his manner); the window where his wife laughs at “the part of a lady-killer”. The leash: through Anna's eyes, late
// autumn in S. — hold the spitz or let it go toward the station road. The club: “the sturgeon was a bit too strong” —
// laugh and get into the sledge or walk away. The departure for S. on the pretext of Petersburg. game.md §6, chapter
// III.
// Reads: facts.heart (“The shadow”: how many figures), facts.life (“The leash”: how hard the spitz pulls). Leaves:
// choices.club.
import { SCENES, facts } from '../story.js';
import ten from '../minigames/ten.js';
import povodok from '../minigames/povodok.js';

export default {
  number: 'III',
  title: tr('Winter'),
  season: () => 'winter',
  titles: ['First snow', 'The leash', 'The club', 'Departure'],
  choices: [
    { id: 'club', weight: '~', title: tr('After the sturgeon'), options: [{ id: 'laugh', label: tr('Laugh and get into the sledge') }, { id: 'walk', label: tr('Walk away') }] },
  ],
  steps: [
    // The first snow: morning, the sledges; the evening street and the shadows; the window upstairs, her voice
    async g => {
      g.hero('gurov');
      g.beds({ snow: 0.4 });
      const out = g.told('first_snow:out');
      await g.scene(SCENES.moscow, { beat: 'first_snow' });
      const snow = g.beat('first_snow');
      g.next('evening_walk');
      g.sound.sleigh();
      await g.say('narrator', 'In Moscow everything was in its winter routine already. The first snow had fallen, and the sledges were out');
      await out;
      await g.say('gurov_inner', 'In another month or so it will all be shrouded in a mist in my memory', 'gurov');
      await snow;
      const walk = g.beat('evening_walk');
      g.next('table_window');
      await walk;
      let first = false;
      const count = facts(g.state).heart === 'frank' ? 4 : 2;
      const r = await g.play(ten, { count, onFirst: () => (first = true, g.say('narrator', 'More than a month passed. She did not visit him in dreams, but followed him about everywhere like a shadow')) });
      g.set('walk_on', count);
      g.set('gurov_look', null);
      for (const shade of ['shade1', 'shade2', 'shade3', 'shade4']) g.set(shade, 0);
      g.set('look_back', r.touched.length === count ? 1 : 0);
      if (!first) await g.say('narrator', 'More than a month passed. She did not visit him in dreams, but followed him about everywhere like a shadow');
      const lit = g.told('table_window:lit');
      const window = g.beat('table_window');
      await lit;
      await g.say('narrator', 'Sometimes at dinner he would suddenly begin talking of love, of women');
      await g.say('wife', 'The part of a lady-killer does not suit you at all, Dimitri', 'window_up');
      await window;
    },
    // The leash: through Anna's eyes — late autumn in S., the fence, the spitz pulls toward the station road; the
    // husband with a coat
    async g => {
      g.hero('anna');
      g.beds({ wind: 0.5 });
      await g.scene(SCENES.town, { beat: 'autumn_walk' });
      const walk = g.beat('autumn_walk');
      await g.say('narrator', 'In S. it was late autumn. Every evening Anna Sergeyevna walked the Pomeranian along the fence');
      await walk;
      const r = await g.play(povodok, { pull: facts(g.state).life === 'life' ? 0.09 : 0.06 });
      // (the beat after the game is the result's: named as soon as it is known)
      const road = r.end === 'road';
      g.next(road ? 'road_end' : 'gate_home');
      g.set('anna_to', road ? 1 : 0);
      if (road) {
        const train = g.told('road_end:train');
        const end = g.beat('road_end');
        g.next('gate_home');
        if (await train) g.sound.whistle(0.3);
        await end;
      }
      const coat = g.told('gate_home:coat');
      const home = g.beat('gate_home');
      await coat;
      await g.say('diderits', 'Anna, you’ll catch cold. Come indoors');
      await home;
    },
    // The club: night, “the sturgeon was a bit too strong”; laugh and get into the sledge — or walk away
    async g => {
      g.hero('gurov');
      g.beds({ snow: 0.3 });
      const out = g.told('club:out');
      await g.scene(SCENES.moscow, { beat: 'club' });
      const club = g.beat('club');
      g.next('say');
      await g.say('narrator', 'One night he was coming out of the doctors’ club with his partner, an official');
      await out;
      await g.say('gurov', 'If only you knew what a fascinating woman I made the acquaintance of in Yalta!');
      await club;
      const turns = g.told('say:turns');
      const sturgeon = g.beat('say');
      await turns;
      await g.say('official', 'Dmitri Dmitritch!');
      await g.say('gurov', 'What?');
      await g.say('official', 'You were right this evening: the sturgeon was a bit too strong!');
      await sturgeon;
      const how = await g.choose('club', { sledge: [{ id: 'laugh', label: tr('Laugh and get into the sledge') }], lamp2: [{ id: 'walk', label: tr('Walk away') }] });
      if (how === 'laugh') {
        g.scale('heart', -2);
        g.next('laugh_sit');
        await g.beat('laugh_sit');
      } else {
        g.scale('heart', 2);
        g.next('say_walk');
        const off = g.told('say_walk:off');
        const walk = g.beat('say_walk');
        await off;
        await g.say('gurov_inner', 'What savage manners, what people! What senseless nights…', 'gurov');
        await walk;
      }
      await g.say('narrator', 'He did not sleep all night');
      g.sound.sleigh();
    },
    // The departure: December, before dawn; his wife in the doorway
    async g => {
      g.hero('gurov');
      g.beds({ snow: 0.3 });
      const turns = g.told('porch_go:turns');
      await g.scene(SCENES.moscow, { beat: 'porch_go' });
      const porch = g.beat('porch_go');
      await g.say('narrator', 'In December, in the Christmas holidays, he made ready for a journey');
      await turns;
      await g.say('gurov', 'I am going to Petersburg to do something in the interests of a young friend');
      await g.say('wife', 'Go, Dimitri. Be back by the New Year', 'wife');
      await porch;
    },
  ],
};
