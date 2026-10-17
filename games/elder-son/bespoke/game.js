// The Elder Son — after the play by Alexander Vampilov. A bespoke game (moood/engines/bespoke) on the world “The Elder Son”
// (engine 3): a student who missed the last train calls himself a stranger's elder son, and the lie holds a family
// together for two days. A prologue, five chapters, an epilogue — each a row of steps on the world's scenes. The
// choices, the two scales (Lie ↔ Truth, Together ↔ Apart) and what is remembered carry from chapter to chapter; how it
// ends follows from them (story.js facts) — the play always goes through to the epilogue. Between the chapters, the
// scene “The Yard”: a night station seen from a footbridge — the chapter's title on the board, and after a chapter its
// choices as railway cars on their tracks (each option a window: lit — chosen; frosted — could have been; boarded up —
// never reached); after the epilogue, those of the whole play. The player presses the semaphore's red light to go on:
// it turns green and the cars leave. A chapter with wall: false begins without its title (the one before runs into it);
// after chapter V there is no map (its rows are the ending itself: the epilogue comes at once).
//
// What is kept of the play (bespoke.keep), after every step: { chapter, step, scales, shown, marks, choices, start: the
// same as the chapter began } — a step cut short (the page closed) is played again from its beginning. The author may
// go to any step of any chapter (☰) — or straight to a minigame of one (the step played up to it unseen: jump.js) —,
// and skip a step (⏭; while a minigame goes, its ⏭ is every player's: story.js g.play). What is gone to begins as one
// of PLAYS has it by then: that play's choices, every step before played through unseen (its scales, marks and gauges
// come out of the steps themselves; its minigames skipped, as played). A step skipped leaves nothing chosen.
import { ENDINGS, SCALES, SCENES, context, facts, listen } from './story.js';
import { ui } from './ui.js';
import { beds, wake, unheard, pause } from './sound.js';
import { jump as unseen } from './jump.js';
import prologue from './chapters/prologue.js';
import one from './chapters/1.js';
import two from './chapters/2.js';
import three from './chapters/3.js';
import four from './chapters/4.js';
import five from './chapters/5.js';
import epilogue from './chapters/epilogue.js';

const CHAPTERS = [prologue, one, two, three, four, five, epilogue];
const EPILOGUE = CHAPTERS.length - 1;
const LAST = EPILOGUE - 1; // chapter V: no map after it (game.md §3.5)
const TITLE = tr('The Elder Son');
// every step of the play in order, and where each chapter's first one is among them
const STEPS = CHAPTERS.flatMap(ch => ch.steps);
const FIRST = CHAPTERS.map((_, c) => CHAPTERS.slice(0, c).reduce((n, ch) => n + ch.steps.length, 0));
// “play as…” — whole plays the author goes from (game.md §5): every ending, and who comes to the platform
const PLAYS = [
  { label: 'Missed the train — the whole family', choices: { entry: 'asked', galya: 'remembered', box: 'take', dawn: 'stay', father: 'approach', crossing: 'truth', kudimov: 'for_me', fire: 'blame', truth: 'self', train: 'stay' } },
  { label: 'Missed the train — honest, no one', choices: { entry: 'asked', galya: 'never', box: 'refuse', dawn: 'leave', father: 'hide', crossing: 'truth', kudimov: 'for_me', fire: 'own_up', truth: 'self', train: 'stay' } },
  { label: 'On Saturday — no one', choices: { entry: 'said', galya: 'never', box: 'refuse', dawn: 'leave', father: 'hide', crossing: 'truth', kudimov: 'let', fire: 'own_up', truth: 'self', train: 'go' } },
  { label: 'On Saturday — father, the snuffbox at the door', choices: { entry: 'said', galya: 'remembered', box: 'refuse', dawn: 'leave', father: 'hide', crossing: 'roar', kudimov: 'ask', fire: 'own_up', truth: 'self', train: 'go' } },
  { label: 'All the same — father', choices: { entry: 'asked', galya: 'never', box: 'take', dawn: 'leave', father: 'approach', crossing: 'roar', kudimov: 'let', fire: 'blame', truth: 'silent', train: 'stay' } },
  { label: 'The suitcase — father', choices: { entry: 'asked', galya: 'never', box: 'take', dawn: 'leave', father: 'approach', crossing: 'roar', kudimov: 'let', fire: 'blame', truth: 'silent', train: 'go' } },
  { label: 'The suitcase — no one', choices: { entry: 'said', galya: 'never', box: 'refuse', dawn: 'leave', father: 'hide', crossing: 'brother', kudimov: 'let', fire: 'own_up', truth: 'silent', train: 'go' } },
];
const fresh = () => ({
  chapter: 0, step: 0, scales: Object.fromEntries(Object.entries(SCALES).map(([k, s]) => [k, s.start])),
  shown: {}, marks: {}, choices: {},
});

export default async function (b) {
  await Promise.all([b.css('fonts.css'), b.css('ui.css')]);
  // the language of mini-games in this game's letters (game.md §9): marks and their fill frost with an ink rim, the
  // petals in the hand, «good» plain white (the lamp's warm is the windows' alone), danger the crossing's cold red; on
  // the world's key
  b.minigame.style({
    key: 'A_FLAT_MAJOR_F_MINOR', font: '"Syn Hand", "Neucha", "Comic Sans MS", sans-serif',
    colors: { mark: '#e3e9f0', fill: '#e3e9f0', good: '#ffffff', danger: '#e0303c', fork: '#b8c3cf', ghost: '#e3e9f0' },
  });
  const hub = listen(b);
  const view = ui(b.layer);
  b.onPause(pause);
  // (the page is heard only after a touch: a chapter that begins without “The Yard” does so only once there was one —
  // not on a page reloaded where the chapter before had just ended)
  let touched = false;
  for (const touch of ['pointerdown', 'keydown']) addEventListener(touch, () => { touched = true; }, { once: true, capture: true });
  // “The Yard”: the station alone (no title: the very beginning), the chapter's title on the board, or the cars of `map`,
  // as the lamps along the tracks light up; → once they have. The wind and the far railway; no scales
  const yard = async (number, title, map) => {
    beds({ wind: 0.2, rails: 0.4 }, 2);
    view.gauge(null);
    await b.show(SCENES.yard, { state: { chapter_number: number, chapter_title: title, map, reveal: 0, go: 0, snow: 0.3 }, captions: false });
    // (the scene moves it: done once it is there)
    await b.act('state', 'move', 'reveal', 1, { over: map ? 2.5 + map.length * 1.2 : 3.5 });
  };
  // its semaphore: the player presses the red light, then where to go; the light turns green and the cars leave
  const signal = async options => {
    const action = await hub.offer({ 'signal#light': options });
    wake();
    await b.act('state', 'move', 'go', 1, { over: 2.5 });
    return action.id;
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
  if (b.game.mine) b.menu(view.author({
    chapters: CHAPTERS, plays: PLAYS.map(p => p.label), at: () => kept,
    games: (as, chapter, step) => ran(as, FIRST[chapter] + step).then(r => r.games),
    // (to a minigame: what the step itself chooses before it, chosen as the play does)
    go: async (as, chapter, step, game) => {
      const [state, start] = await Promise.all([coming(as, chapter, step), coming(as, chapter, 0)]);
      await b.keep(game == null ? { ...state, start } : { ...state, start, play: game, choices: (await ran(as, FIRST[chapter] + step)).state.choices });
      location.reload();
    },
  }));
  for (;;) {
    const ch = CHAPTERS[kept.chapter];
    if (!kept.start) {
      const { start, play, ...now } = kept;
      kept.start = structuredClone({ ...now, step: 0 });
    }
    // “The Yard” before the chapter: the station alone at the very beginning, else the chapter's title; the player presses
    // the semaphore to begin — unless the chapter is over (the page was left at its map): its map again; or gone
    // straight to a minigame; or the chapter before runs into this one (wall: false, once the page has been touched)
    if (kept.step < ch.steps.length && kept.play == null && !(touched && ch.wall === false)) {
      const opening = !kept.chapter && !kept.step;
      const plain = opening || ch.wall === false;
      await yard(plain ? '' : ch.number, plain ? '' : ch.title, null);
      await signal([{ id: 'go', label: kept.step ? tr('Continue') : tr('Begin') }]);
    }
    wake();
    // (the epilogue: the play's scales are done — its steps show none)
    if (kept.chapter === EPILOGUE) view.gauge(null);
    const mine = kept.chapter === EPILOGUE ? { ...view, gauge() {} } : view;
    while (kept.step < ch.steps.length) {
      // (gone to a minigame of it: the step played up to it unseen)
      const g = context(b, mine, hub, structuredClone(kept), kept.play != null ? unseen(kept.play, unheard()) : null);
      let skip;
      // (⏭ outside a minigame skips the step — the author's only; in a minigame it is everyone's: story.js g.play)
      const off = b.game.mine ? view.onSkip(() => skip()) : () => {};
      const done = await Promise.race([
        ch.steps[kept.step](g).then(() => true, e => { b.trouble(`the step broke: ${e.message || e}`); return false; }),
        new Promise(ok => { skip = () => ok(false); }),
      ]);
      off();
      if (!done) g.leave();
      kept = { ...(done ? g.state : kept), step: kept.step + 1, play: undefined };
      b.keep(kept); // (not waited for: the page keeps them in order, and the next step's cut is not held)
    }
    let next = null;
    if (kept.chapter === EPILOGUE) {
      // the cars of the whole play; then all of it anew (the author goes to a chapter by ☰)
      await yard('', TITLE, whole(kept));
      await signal([{ id: 'anew', label: tr('Play again') }]);
      return b.restart();
    } else if (ch.choices.length && kept.chapter !== LAST) {
      // the cars of the chapter; then on — or the chapter again, from how it began
      await yard(ch.number, ch.title, rows(ch.choices, kept));
      const to = await signal([{ id: 'on', label: tr('Go on') }, { id: 'again', label: tr('Replay the chapter') }]);
      if (to === 'again') next = kept.start;
    }
    kept = next || { ...kept, chapter: kept.chapter + 1, step: 0, start: undefined };
    b.keep(kept);
  }
}

// choices as rows of “The Yard” (a car on its track each): chosen, could have been, never reached
const rows = (choices, kept, title = c => c.title) => choices.map(c => ({
  title: title(c), weight: c.weight,
  options: c.options.map(o => ({ label: o.label, state: kept.choices[c.id] === o.id ? 'chosen' : c.id in kept.choices ? 'open' : 'unseen' })),
}));
// the whole play: the turns (⚑) of chapters I–IV — five — and how it ended (game.md §3.5)
const whole = kept => [
  ...CHAPTERS.slice(1, LAST).flatMap(ch => rows(ch.choices.filter(c => c.weight === '⚑'), kept, c => `${ch.number}. ${c.title}`)),
  { title: tr('Finale'), weight: '⚑', options: ENDINGS.map(e => ({ label: e.label, state: e.id === facts(kept).ending ? 'chosen' : 'open' })) },
];
