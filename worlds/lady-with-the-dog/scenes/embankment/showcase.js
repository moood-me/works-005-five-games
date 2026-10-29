// Outside the game: noon out of the glare — the dog on the parapet, the lady takes up its leash, Gurov in the pavilion
// looks after her; the evening gardens — the dog coaxed to his knee, patted, the talk across the gap; the night walk
// under the moon; the pier on the holiday — the steamer, the lorgnette, the arrivals coming down, the crowd gone, the
// embrace at the pier's end, back to the shore; noon in the avenue and the kiss between the walkers; the letter. (What
// the game moves — the dog to his hand, the arrivals let down — is moved here by hand.)
const F = scene.lib.film(scene);
const beats = scene.kit.beats.showcase(scene, F, ['noon', 'noon_turn', 'pavilion', 'garden', 'coax', 'coax_hold', 'pat', 'talk',
  'walk_out', 'pier', 'gangway', 'lost', 'kiss', 'go', 'noon_garden', 'days']);
const after = {
  coax: async s => {
    s.move('hand', 0.8, { over: 2.5, ease: 'inOut' });
    await s.move('spitz_near', 1, { over: 5, ease: 'inOut' });
    s.set('trust', 1);
  },
  gangway: async s => {
    for (let n = 1; n <= 7; n++) {
      s.set('pass', n);
      if (n === 5) {
        await s.wait(7);
        s.set('look_at', 'stranger');
        await s.wait(1.5);
        s.set('look_at', '');
        s.set('stranger_turn', 1);
      }
      await s.wait(3.5);
    }
    s.set('surge', 1);
    await s.wait(1.5);
  },
  lost: async s => { s.set('fright', 1); },
  noon_garden: async s => {
    await s.wait(14);
    s.set('kiss_now', 1);
    await s.wait(4.5);
  },
};
return beats.map(b => after[b.name] ? { name: b.name, run: async s => { await b.run(s); await after[b.name](s); } } : b);
