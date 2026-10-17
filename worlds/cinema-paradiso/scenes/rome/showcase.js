// Outside the game: the three beats in order (the note in his hand, two crooked splices — as one play may have them)
return [{ name: tr('the play'), run: async s => { s.set('note_in_hand', 1); s.set('jumps', 2); } },
  ...scene.kit.beats.showcase(scene, scene.lib.film(scene), ['rome', 'kisses', 'kisses_end'])];
