// «Плёнка» outside the game: the very beginning (the lamp alone), the title of chapter I in its big frame, the map
// of chapter IV, the whole play on three strips. Each cut to whole (made ready while the one before plays), the strip
// coming in and its frames up as long as the game gives it (game.md: 3.5 s a title, 2.5 s + 1.2 s a row a map), then
// held a while as the player would find it.
const opt = (label, state) => ({ label, state });
const FILMS = [
  { name: 'Самое начало', state: { chapter_number: '', chapter_title: '', map: null } },
  { name: 'Титул главы I', state: { chapter_number: 'I', chapter_title: 'Колокольчик', map: null } },
  { name: 'Карта главы IV', state: { chapter_number: 'IV', chapter_title: 'Уезжай', map: [
    { title: 'Елена в будке', weight: '⚑', options: [opt('«Он на пристани. Беги»', 'open'), opt('«Если любишь — оставь его»', 'chosen')] },
    { title: 'Уехать или остаться', weight: '⚑', options: [opt('«Уеду»', 'chosen'), opt('«Останусь»', 'open')] },
    { title: 'Что сказать на перроне', weight: '⚑', options: [opt('«Не возвращайся»', 'chosen'), opt('«Возвращайся, когда захочешь»', 'open')] },
    { title: 'Из окна вагона', weight: '~', options: [opt('Не оборачиваться', 'open'), opt('Обернуться', 'chosen')] },
  ] } },
  { name: 'Вся партия', state: { chapter_number: '', chapter_title: 'Новый кинотеатр «Парадизо»', map: [
    { title: 'I. Деньги на молоко', weight: '⚑', options: [opt('Промолчать', 'chosen'), opt('Сказать правду', 'open')] },
    { title: 'II. Механик в десять лет', weight: '⚑', options: [opt('«Пойдём. Буду рядом»', 'open'), opt('«Иди один»', 'chosen')] },
    { title: 'III. Незнакомая девушка', weight: '⚑', options: [opt('Снимать дальше', 'chosen'), opt('Подойти к ней', 'open')] },
    { title: 'III. Девяносто девятая ночь', weight: '⚑', options: [opt('Ждать дальше', 'open'), opt('Уйти в будку', 'chosen')] },
    { title: 'IV. Елена в будке', weight: '⚑', options: [opt('«Он на пристани. Беги»', 'open'), opt('«Если любишь — оставь его»', 'chosen')] },
    { title: 'IV. Уехать или остаться', weight: '⚑', options: [opt('«Уеду»', 'chosen'), opt('«Останусь»', 'open')] },
    { title: 'IV. Что сказать на перроне', weight: '⚑', options: [opt('«Не возвращайся»', 'chosen'), opt('«Возвращайся, когда захочешь»', 'open')] },
    { title: 'V. Девушка, похожая на Елену', weight: '⚑', options: [opt('Пойти за ней', 'chosen'), opt('Остаться у «Парадизо»', 'open')] },
    { title: 'V. Похороны', weight: '⚑', options: [opt('Идти за гробом', 'open'), opt('Остаться у дверей', 'chosen')] },
    { title: 'Финал', weight: '⚑', options: [opt('Пусть останется', 'open'), opt('Записка', 'chosen'), opt('Письма', 'open')] },
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
