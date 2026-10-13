// «Даль» outside the game: the title of chapter I on its great sail; after chapter III, the fleet of its choices; after
// the epilogue, the fleet of the whole play. Each sea cut to whole (made ready while the one before plays), the mist
// going off as long as the game gives it (game.md: 3.5 s a title, 2.5 s + 1.2 s a row a map), then the yacht and the
// sea alone a while, as the player would find them.
const opt = (label, state) => ({ label, state });
const SEAS = [
  { name: 'Титул главы I', state: { chapter_number: 'I', chapter_title: 'Кораблик', map: null } },
  { name: 'Карта главы III', state: { chapter_number: 'III', chapter_title: 'Рассвет', map: [
    { title: 'Лонгрен собрался в море', weight: '⚑', options: [opt('«Иди. Я справлюсь»', 'chosen'), opt('«Не уходи»', 'open')] },
    { title: 'Кольцо', weight: '~', options: [opt('Носить', 'open'), opt('Спрятать на шнурок', 'chosen')] },
    { title: 'Тайна или прямо', weight: '⚑', options: [opt('Тайна', 'chosen'), opt('Прямо', 'open')] },
  ] } },
  { name: 'Вся партия', state: { chapter_number: '', chapter_title: 'Алые паруса', map: [
    { title: 'I. Дети у лодок', weight: '⚑', options: [opt('«Я не вру»', 'chosen'), opt('«Я придумала»', 'open')] },
    { title: 'II. Ночь ухода', weight: '⚑', options: [opt('Проститься', 'open'), opt('Уйти тихо', 'chosen')] },
    { title: 'II. Письмо', weight: '⚑', options: [opt('Домой — надолго', 'chosen'), opt('Только за долей', 'open')] },
    { title: 'III. Лонгрен собрался в море', weight: '⚑', options: [opt('«Иди. Я справлюсь»', 'chosen'), opt('«Не уходи»', 'open')] },
    { title: 'III. Тайна или прямо', weight: '⚑', options: [opt('Тайна', 'open'), opt('Прямо', 'chosen')] },
    { title: 'Финал', weight: '⚑', options: [opt('Как у Грина', 'open'), opt('Красные паруса плывут!', 'chosen'), opt('Она ждала', 'open'), opt('Вся Каперна', 'open')] },
  ] } },
];
const start = w => ({ ...w.state, reveal: 0, korablik: 1 });
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
