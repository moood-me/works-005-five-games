// Outside the game: the beats one after another, as the game would set them (chapter I through «pocket», chapter
// II's lesson and motor, chapter IV's night through «note»).
const play = name => ({ name, run: async s => { s.set('beat', name); await s.until(() => s.get('beat_last') === name); } });
return ['cutting', 'frames', 'pocket', 'lesson', 'motor', 'knock', 'note'].map(play);
