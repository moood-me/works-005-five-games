// Outside the game: the three come in from the cold, he warms his hands at the stove and turns to the table; the
// father comes home, a step from his «son», and takes him in his arms. Later the same night: the snuffbox brought
// out of the cupboard and set between them — he takes it; then again — he will not, and it goes back to its shelf.
const L = scene.lib;
return [
  { name: 'kitchen', run: async s => { await L.film.kitchen(s, null); } },
  { name: 'warm_up', run: async s => { await L.film.warm_up(s); } },
  { name: 'enter', run: async s => { await L.film.enter(s, null); } },
  { name: 'embrace', run: async s => { await L.film.embrace(s); } },
  { name: 'box_out', run: async s => { await L.film.box_out(s, null); } },
  { name: 'box_take', run: async s => { await L.film.box_take(s); await L.film.box_kept(s); } },
  { name: 'box_give', run: async s => { s.cut({ ...L.END.box_out }); await L.film.box_give(s); await L.film.box_back(s); } },
];
