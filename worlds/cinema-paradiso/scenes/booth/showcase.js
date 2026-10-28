// Outside the game: the booth's beats in the order the game plays them (I: the cutting, the tin, the letters; II: the
// lesson, the motor, the window, the fire, the floor in smoke; III: the soldier's story, the reels; IV: six o'clock,
// the change, ten o'clock, Elena at the door and her note, the morning, the autumn; V: the ruin, the calendar, the strip)
const F = scene.lib.film(scene);
return scene.kit.beats.showcase(scene, F, ['cutting', 'splice_in', 'frames', 'pocket', 'deal', 'slate_in', 'slate_out', 'lesson',
  'motor', 'window', 'jam', 'smoke_in', 'story_booth', 'reels', 'six', 'changeover', 'alfredo_comes', 'knock', 'note',
  'note_close', 'morning', 'autumn', 'ruins', 'calendar', 'window_strip', 'strip_end']);
