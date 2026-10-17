// The strip outside the game: the very beginning (the lamp alone), the title of chapter I in its big frame, the map
// of chapter IV, the whole play on three strips. Each cut to whole (made ready while the one before plays), the strip
// coming in and its frames up as long as the game gives it (game.md: 3.5 s a title, 2.5 s + 1.2 s a row a map), then
// held a while as the player would find it.
const opt = (label, state) => ({ label, state });
const FILMS = [
  { name: tr('The very beginning'), state: { chapter_number: '', chapter_title: '', map: null } },
  { name: tr('Chapter I\'s title'), state: { chapter_number: 'I', chapter_title: tr('The Bell'), map: null } },
  { name: tr('Chapter IV\'s map'), state: { chapter_number: 'IV', chapter_title: tr('Leave'), map: [
    { title: tr('Elena at the booth'), weight: '⚑', options: [opt(tr('“He\'s on the pier. Run”'), 'open'), opt(tr('“If you love him, leave him”'), 'chosen')] },
    { title: tr('Go or stay'), weight: '⚑', options: [opt(tr('“I\'ll go”'), 'chosen'), opt(tr('“I\'ll stay”'), 'open')] },
    { title: tr('What to say on the platform'), weight: '⚑', options: [opt(tr('“Don\'t come back”'), 'chosen'), opt(tr('“Come back when you like”'), 'open')] },
    { title: tr('From the carriage window'), weight: '~', options: [opt(tr('Don\'t look back'), 'open'), opt(tr('Look back'), 'chosen')] },
  ] } },
  { name: tr('The whole play'), state: { chapter_number: '', chapter_title: tr('Cinema Paradiso'), map: [
    { title: tr('I. The milk money'), weight: '⚑', options: [opt(tr('Keep quiet'), 'chosen'), opt(tr('Tell the truth'), 'open')] },
    { title: tr('II. A projectionist at ten'), weight: '⚑', options: [opt(tr('“Come. I\'ll be near”'), 'open'), opt(tr('“Go alone”'), 'chosen')] },
    { title: tr('III. The girl nobody knew'), weight: '⚑', options: [opt(tr('Keep filming'), 'chosen'), opt(tr('Go up to her'), 'open')] },
    { title: tr('III. The ninety-ninth night'), weight: '⚑', options: [opt(tr('Keep waiting'), 'open'), opt(tr('Go to the booth'), 'chosen')] },
    { title: tr('IV. Elena at the booth'), weight: '⚑', options: [opt(tr('“He\'s on the pier. Run”'), 'open'), opt(tr('“If you love him, leave him”'), 'chosen')] },
    { title: tr('IV. Go or stay'), weight: '⚑', options: [opt(tr('“I\'ll go”'), 'chosen'), opt(tr('“I\'ll stay”'), 'open')] },
    { title: tr('IV. What to say on the platform'), weight: '⚑', options: [opt(tr('“Don\'t come back”'), 'chosen'), opt(tr('“Come back when you like”'), 'open')] },
    { title: tr('V. A girl like Elena'), weight: '⚑', options: [opt(tr('Follow her'), 'chosen'), opt(tr('Stay by the Paradiso'), 'open')] },
    { title: tr('V. The funeral'), weight: '⚑', options: [opt(tr('Walk behind the coffin'), 'open'), opt(tr('Stay by the doors'), 'chosen')] },
    { title: tr('Finale'), weight: '⚑', options: [opt(tr('Let it stay'), 'open'), opt(tr('The note'), 'chosen'), opt(tr('The letters'), 'open')] },
  ] } },
];
const start = f => ({ ...f.state, reveal: 0, lamp: 1 });
const seconds = f => (f.state.map ? 2.5 + f.state.map.length * 1.2 : 3.5);
let next = null;
return FILMS.map((f, i) => ({
  name: f.name,
  run: async s => {
    if (next?.for === f.name) next.shot.cut();
    else s.cut(start(f));
    next = FILMS[i + 1] ? { for: FILMS[i + 1].name, shot: scene.shot(start(FILMS[i + 1])) } : null;
    await s.move('reveal', 1, { over: seconds(f), ease: 'linear' });
    await s.wait(i ? 4 : 1.5);
  },
}));
