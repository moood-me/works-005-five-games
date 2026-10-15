// Outside the game: the beats one after another, as the game would set them (the path through «ask»).
const play = name => ({ name, run: async s => { s.set('beat', name); await s.until(() => s.get('beat_last') === name); } });
return ['summer', 'covered', 'headlights', 'found', 'alone', 'back', 'rise_go', 'car', 'meet', 'ask', 'parting'].map(play);
