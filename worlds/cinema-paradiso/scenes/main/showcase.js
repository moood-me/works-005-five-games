// Outside the game: the square's film, the game's moves played by the showcase's own beats (the beam led to the wall,
// the viewfinder, a few of the hundred nights).
const L = scene.lib;
const F = {
  ...L.FILM,
  sweep: { after: ['beam_out'], run: async s => {
    await s.move('beam_aim', 1, { over: 6, ease: 'inOut' });
    s.set('wall_film', 'comedy');
    await s.move('beam_focus', 1, { over: 3 });
  } },
  vf: { after: ['dusk'], run: async s => {
    s.set('viewfinder', 1); s.set('rec', 1); s.set('pan', 0.6);
    s.move('elena_x', 0, { over: 7 });
    await s.move('pan', 0, { over: 7 });
    s.set('viewfinder', 0);
  } },
  week: { after: ['nights'], run: async s => {
    for (const [i, k] of ['clear', 'rain', 'feast', 'cold'].entries()) {
      s.set('night_kind', k);
      await s.wait(1.6);
      s.set('mark_chalk', 1); s.set('chalk', (i + 1) * 7);
      await s.wait(2);
    }
    s.move('elena_window', 0.3, { over: 0.4 }); await s.wait(1.5); s.move('elena_window', 0, { over: 0.4 });
    s.set('night_kind', 'clear');
  } },
};
return scene.kit.beats.showcase(scene, F, ['now_open', 'rewind', 'after_show', 'alfredo_down', 'coins_taken', 'paper', 'crowd',
  'beam_out', 'sweep', 'wall_film', 'smoke', 'outside', 'new_sign', 'door', 'go_together', 'dusk', 'vf', 'seen', 'hello',
  'story_door', 'chair', 'nights', 'week', 'eve', 'midnight', 'midnight_close', 'girl', 'let', 'funeral', 'walk_behind', 'widow',
  'demolition', 'dust']);
