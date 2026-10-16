// «The Far Sea» outside the game: the title of chapter I on its great sail; after chapter III, the fleet of its choices; after
// the epilogue, the fleet of the whole play. Each sea cut to whole (made ready while the one before plays), the mist
// going off as long as the game gives it (game.md: 3.5 s a title, 2.5 s + 1.2 s a row a map), then the yacht and the
// sea alone a while, as the player would find them.
const opt = (label, state) => ({ label, state });
const SEAS = [
  { name: tr('Chapter I\'s title'), state: { chapter_number: 'I', chapter_title: tr('The Little Ship'), map: null } },
  { name: tr('Chapter III\'s map'), state: { chapter_number: 'III', chapter_title: tr('Dawn'), map: [
    { title: tr('Longren goes to sea'), weight: '⚑', options: [opt(tr('“Go. I\'ll manage”'), 'chosen'), opt(tr('“Don\'t go”'), 'open')] },
    { title: tr('The ring'), weight: '~', options: [opt(tr('Wear it'), 'open'), opt(tr('Hide it on a cord'), 'chosen')] },
    { title: tr('The secret or straight'), weight: '⚑', options: [opt(tr('The secret'), 'chosen'), opt(tr('Straight'), 'open')] },
  ] } },
  { name: tr('The whole play'), state: { chapter_number: '', chapter_title: tr('Scarlet Sails'), map: [
    { title: tr('I. The children by the boats'), weight: '⚑', options: [opt(tr('“I\'m not lying”'), 'chosen'), opt(tr('“I made it up”'), 'open')] },
    { title: tr('II. The night he left'), weight: '⚑', options: [opt(tr('Say goodbye'), 'open'), opt(tr('Slip away'), 'chosen')] },
    { title: tr('II. The letter'), weight: '⚑', options: [opt(tr('Home for a long while'), 'chosen'), opt(tr('Only to take his share'), 'open')] },
    { title: tr('III. Longren goes to sea'), weight: '⚑', options: [opt(tr('“Go. I\'ll manage”'), 'chosen'), opt(tr('“Don\'t go”'), 'open')] },
    { title: tr('III. The secret or straight'), weight: '⚑', options: [opt(tr('The secret'), 'open'), opt(tr('Straight'), 'chosen')] },
    { title: tr('Finale'), weight: '⚑', options: [opt(tr('As Grin wrote it'), 'open'), opt(tr('Red sails are coming!'), 'chosen'), opt(tr('She waited'), 'open'), opt(tr('All Kaperna'), 'open')] },
  ] } },
];
const start = w => ({ ...w.state, reveal: 0, yacht: 1 });
const seconds = w => (w.state.map ? 2.5 + w.state.map.length * 1.2 : 3.5);
// (the next sea made ready as each begins — for that one only: a jump lands on any of them)
let next = null;
return SEAS.map((w, i) => ({
  name: w.name,
  run: async s => {
    if (next?.for === w.name) next.shot.cut();
    else s.cut(start(w));
    next = SEAS[i + 1] ? { for: SEAS[i + 1].name, shot: scene.shot(start(SEAS[i + 1])) } : null;
    await s.move('reveal', 1, { over: seconds(w), ease: 'linear' });
    await s.wait(4);
  },
}));
