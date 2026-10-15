// Вокруг света за 80 дней — по роману Жюля Верна. A bespoke game (moood/engines/bespoke) on the world «Вокруг света v3»
// (engine 3): Phileas Fogg and Passepartout played in turn — the wager, the elephant, the suttee, the typhoon, the
// sledge under sail, the «Henrietta» burnt to the waterline, and the day won from the sun. A prologue, four chapters,
// an epilogue — each a row of steps on the world's scenes (rpg docs/vokrug-sveta/game.md §3). The choices, the
// notebook (Запас, hours against the timetable) and the bag (Саквояж, £), who remembers what (marks) and what the hands
// did (hands) carry from chapter to chapter; how it ends follows from them (story.js facts) — the play always goes
// through to the epilogue. Between the chapters, the scene «Маршрут»: an old map of the world, the way in red ink —
// the chapter's title, and after the chapter the rows of what was chosen in it; after the epilogue, the whole play.
// The player presses Fogg's watch on the map to go on. The frame is «Новый кинотеатр „Парадизо“»'s.
//
// What is kept of the play (bespoke.keep), after every step: { chapter, step, hours, money, shown, marks, choices,
// hands, lines, start: the same as the chapter began } — a step cut short (the page closed) is played again from its
// beginning. The author may go to any step of any chapter (☰) — or straight to a minigame of one (jump.js) —, and skip
// a step (⏭; a minigame's ⏭ is every player's). What is gone to begins as one of PLAYS has it by then.
import { ENDINGS, START, SCENES, context, facts, listen } from './story.js';
import { ui } from './ui.js';
import { beds, wake, unheard } from './sound.js';
import { jump as unseen } from './jump.js';
import prologue from './chapters/prologue.js';
import one from './chapters/1.js';
import two from './chapters/2.js';
import three from './chapters/3.js';
import four from './chapters/4.js';
import epilogue from './chapters/epilogue.js';

const CHAPTERS = [prologue, one, two, three, four, epilogue];
const EPILOGUE = CHAPTERS.length - 1;
const TITLE = 'Вокруг света за восемьдесят дней';
// every step of the play in order, and where each chapter's first one is among them
const STEPS = CHAPTERS.flatMap(ch => ch.steps);
const FIRST = CHAPTERS.map((_, c) => CHAPTERS.slice(0, c).reduce((n, ch) => n + ch.steps.length, 0));
// «партия как…» — whole plays the author goes from: Verne's own way, the reckoning one, the kind one, the lonely one
const PLAYS = [
  { label: 'как у Верна', choices: { sati: 'night', kiouni: 'gift', answer: 'plaid', aouda: 'europe', boat: 'take', punch: 'punch', bridge: 'run', fort: 'go', henrietta: 'burn', liverpool: 'hand' } },
  { label: 'расчётливо', choices: { sati: 'road', kiouni: 'sell', answer: 'spare', aouda: 'holland', boat: 'leave', punch: 'shake', bridge: 'run', fort: 'pay', henrietta: 'burn', liverpool: 'hit' } },
  { label: 'по-доброму', choices: { sati: 'night', kiouni: 'gift', answer: 'notlost', aouda: 'europe', boat: 'take', punch: 'shake', bridge: 'walk', fort: 'go', henrietta: 'sails', liverpool: 'hand' } },
  { label: 'в одиночку', choices: { sati: 'road', kiouni: 'sell', answer: 'spare', aouda: 'holland', boat: 'leave', punch: 'punch', bridge: 'run', fort: 'pay', henrietta: 'sails', liverpool: 'hit' } },
];
const fresh = () => ({
  chapter: 0, step: 0, hours: START.hours, money: START.money, shown: {}, marks: {}, choices: {}, hands: {}, lines: [],
});

export default async function (b) {
  await Promise.all([b.css('fonts.css'), b.css('ui.css')]);
  // the language of mini-games in this game's letters: the plate and the petals in the old edition's serif, the marks'
  // lines and the ghost finger in its paper white; the world's key, A♭ major
  b.minigame.style({ key: 'A_FLAT_MAJOR_F_MINOR', font: '"Vokrug Title", Georgia, serif', colors: { mark: '#f4ead2', ghost: '#f4ead2' } });
  const hub = listen(b);
  const view = ui(b.layer);
  view.pausing(b);
  // (the page is heard only after a touch: a chapter that begins without «Маршрут» does so only once there was one —
  // not on a page reloaded where the chapter before had just ended)
  let touched = false;
  for (const touch of ['pointerdown', 'keydown']) addEventListener(touch, () => { touched = true; }, { once: true, capture: true });
  // Fogg's watch on the map: the player presses it, then where to go
  const watch = async options => {
    const away = view.hint('Открой часы', 3000);
    const action = await hub.offer({ 'watch#watch': options });
    away();
    return action.id;
  };
  // «Маршрут»: the map alone (the very beginning), the chapter's title, or the rows of `map`, as they are inked in;
  // the red line as far as `route`; → once it is all there. No sound of its own; no notebook, no bag
  const strip = async (number, title, map, route = 0, dateline = 0, heading = '') => {
    beds({}, 2);
    view.gauges(null);
    await b.show(SCENES.map, { state: { chapter_number: number, chapter_title: title, chapter_heading: heading, map, reveal: 0, route, dateline } });
    // (the scene moves it: done once it is there)
    await b.act('state', 'move', 'reveal', 1, { over: map ? 2.5 + map.length * 1.2 : 3.5 });
  };
  // PLAYS[as] played unseen: its n-th step of all (STEPS) from where the steps before leave it → {state: the play
  // after it, games: the minigames it played}. The play's choices are found by the step that asks for one; the
  // state a step leaves has only those made by then.
  const dry = new Map();
  const ran = (as, n) => {
    const k = `${as}:${n}`;
    if (!dry.has(k)) dry.set(k, (async () => {
      const came = n ? (await ran(as, n - 1)).state : fresh();
      const j = unseen(Infinity, unheard());
      const g = context(b, view, hub, { ...structuredClone(came), choices: Object.assign(Object.create(PLAYS[as].choices), came.choices) }, j);
      await Promise.race([STEPS[n](g).catch(() => {}), j.idle]);
      return { state: { ...g.state, choices: { ...g.state.choices } }, games: j.plays.map(m => m.title) };
    })());
    return dry.get(k);
  };
  // PLAYS[as] on coming to a step of a chapter
  const coming = async (as, chapter, step) => {
    const n = FIRST[chapter] + step;
    return { ...(n ? (await ran(as, n - 1)).state : fresh()), chapter, step };
  };
  let kept = { ...fresh(), ...b.saved };
  if (b.game.mine) view.author({
    chapters: CHAPTERS, plays: PLAYS.map(p => p.label), at: () => kept,
    games: (as, chapter, step) => ran(as, FIRST[chapter] + step).then(r => r.games),
    // (to a minigame: what the step itself chooses before it, chosen as the play does)
    go: async (as, chapter, step, game) => {
      const [state, start] = await Promise.all([coming(as, chapter, step), coming(as, chapter, 0)]);
      await b.keep(game == null ? { ...state, start } : { ...state, start, play: game, choices: (await ran(as, FIRST[chapter] + step)).state.choices });
      location.reload();
    },
  });
  for (;;) {
    const ch = CHAPTERS[kept.chapter];
    if (!kept.start) {
      const { start, play, ...now } = kept;
      kept.start = structuredClone({ ...now, step: 0 });
    }
    // «Плёнка» before the chapter: the lamp alone at the very beginning, else the chapter's title; the player touches
    // the lamp to begin — unless the chapter is over (the page was left at its map): its map again; or gone
    // straight to a minigame; or the chapter before runs into this one
    if (kept.step < ch.steps.length && kept.play == null && !(touched && ch.wall === false)) {
      const opening = !kept.chapter && !kept.step;
      await strip(opening ? '' : ch.number, opening ? '' : ch.title, null, ch.route[0], 0, opening ? '' : ch.heading);
      await watch([{ id: 'go', label: kept.step ? 'Продолжить' : 'Начать' }]);
    }
    wake();
    const mine = view;
    while (kept.step < ch.steps.length) {
      // (gone to a minigame of it: the step played up to it unseen)
      const g = context(b, mine, hub, structuredClone(kept), kept.play != null ? unseen(kept.play, unheard()) : null);
      let skip;
      // (⏭ outside a minigame skips the step — the author's only; in a minigame it is everyone's: story.js g.play)
      const off = b.game.mine ? view.onSkip(() => skip()) : () => {};
      const done = await Promise.race([
        ch.steps[kept.step](g).then(() => true, e => { b.trouble(`шаг сломался: ${e.message || e}`); return false; }),
        new Promise(ok => { skip = () => ok(false); }),
      ]);
      off();
      if (!done) g.leave();
      kept = { ...(done ? g.state : kept), step: kept.step + 1, play: undefined };
      b.keep(kept); // (not waited for: the page keeps them in order, and the next step's cut is not held)
    }
    let next = null;
    if (kept.chapter === EPILOGUE) {
      // the frames of the whole play; then all of it anew (the author goes to a chapter by ☰)
      await strip('', TITLE, whole(kept), 1, 1);
      await watch([{ id: 'anew', label: 'Сыграть заново' }]);
      return b.restart();
    } else if (ch.choices.length) {
      // the frames of the chapter; then on — or the chapter again, from how it began
      await strip(ch.number, ch.title, rows(ch.choices, kept), ch.route[1], 0, ch.heading);
      const to = await watch([{ id: 'on', label: 'Дальше' }, { id: 'again', label: 'Пройти главу заново' }]);
      if (to === 'again') next = kept.start;
    }
    kept = next || { ...kept, chapter: kept.chapter + 1, step: 0, start: undefined };
    b.keep(kept);
  }
}

// choices as rows of «Маршрут»: chosen, could have been, never reached
const rows = (choices, kept, title = c => c.title) => choices.map(c => ({
  title: title(c), weight: c.weight,
  options: c.options.map(o => ({ label: o.label, state: kept.choices[c.id] === o.id ? 'chosen' : c.id in kept.choices ? 'open' : 'unseen' })),
}));
// the whole play: the turns (⚑) of every chapter and how it ended
const whole = kept => [
  ...CHAPTERS.flatMap(ch => rows(ch.choices.filter(c => c.weight === '⚑'), kept, c => `${ch.number}. ${c.title}`)),
  { title: 'Финал', weight: '⚑', options: ENDINGS.map(e => ({ label: e.label, state: e.id === facts(kept).ending ? 'chosen' : 'open' })) },
];
