// Outside the game: down from the platform to the five lit windows; the camera back to the fence; a knock at the
// middle window — a figure, and it goes dark; the others go out by themselves; on to the dark corner; Сарафанов at
// Макарская's window and Васенька slipping home; the porch, the door, inside; later — Сарафанов under his own window.
const L = scene.lib;
return [
  { name: 'walk', run: async s => { await L.film.walk(s, null); } },
  { name: 'knock_ready', run: async s => { await L.film.knock_ready(s); } },
  { name: 'windows', run: async s => {
    await L.knock(s, 3);
    s.set('win3', 2);
    await s.wait(2.2);
    s.set('win3', 0);
    await s.wait(1.2);
    await L.knock(s, 0);
    for (const w of ['win1', 'win5', 'win2', 'win4']) {
      await s.wait(1.1);
      s.set(w, 0);
    }
    await s.move('snow', 0.7, { over: 2 });
  } },
  { name: 'last_window', run: async s => { await L.film.last_window(s, null); } },
  { name: 'neighbor', run: async s => { await L.film.neighbor(s, null); } },
  { name: 'porch', run: async s => { await L.film.porch(s); } },
  { name: 'in', run: async s => { await L.film.in(s); } },
  { name: 'return', run: async s => { await L.film.return(s, null); } },
];
