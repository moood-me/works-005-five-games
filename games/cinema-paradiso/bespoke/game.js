// Новый кинотеатр «Парадизо» — по фильму Джузеппе Торнаторе. A bespoke game (moood/engines/bespoke) on the world «Новый
// кинотеатр „Парадизо“» (engine 3): the boy Toto and the projectionist Alfredo played in turn — the booth, the beam
// over the square, the hundred nights, the station — and Salvatore thirty years on. A prologue, five chapters, an
// epilogue — each a row of steps on the world's scenes. The choices, the two scales (Кино ↔ Люди, Держать ↔ Отпустить),
// what is remembered and what the hands did (state.hands) carry from chapter to chapter; how it ends follows from
// them (story.js facts) — the play always goes through to the epilogue. Between the chapters, the scene «Плёнка»: a
// strip of film in the dark lit from behind by a projector's lamp — the chapter's title in one big frame, and after
// the chapter the frames of what was chosen in it (chosen ones warm in the light); after the epilogue, those of the
// whole play. The player touches the lamp to go on. A chapter with wall: false begins without it (the one before
// runs into it).
//
// What is kept of the play (bespoke.keep), after every step: { chapter, step, scales, shown, marks, choices, hands,
// start: the same as the chapter began } — a step cut short (the page closed) is played again from its beginning. The
// author may go to any step of any chapter (☰) — or straight to a minigame of one (the step played up to it unseen:
// jump.js) —, and skip a step (⏭; a minigame's ⏭ is every player's: story.js g.play). What is gone to begins as one
// of PLAYS has it by then: that play's choices, every step before played through unseen (its scales, marks, hands
// and gauges come out of the steps themselves; its minigames skipped, as played). A step skipped leaves nothing chosen.
import { ENDINGS, SCALES, SCENES, context, facts, listen } from './story.js';
import { ui } from './ui.js';
import { beds, wake, unheard } from './sound.js';
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
const TITLE = 'Новый кинотеатр «Парадизо»';
// every step of the play in order, and where each chapter's first one is among them
const STEPS = CHAPTERS.flatMap(ch => ch.steps);
const FIRST = CHAPTERS.map((_, c) => CHAPTERS.slice(0, c).reduce((n, ch) => n + ch.steps.length, 0));
// «партия как…» — whole plays the author goes from (game.md §3.4): the three endings, Alfredo holding or letting go
// (a choice a play doesn't make — `ask` on «Пусть останется» — is left out)
const PLAYS = [
  { label: '«Пусть останется», держит', choices: { frame: 'leave', milk: 'truth', booth: 'hold', camera: 'speak', nights: 'wait', elena: 'truth', stay: 'stay', station: 'come', look: 'back', girl: 'let', funeral: 'walk' } },
  { label: '«Пусть останется», отпускает', choices: { frame: 'take', milk: 'lie', booth: 'release', camera: 'film', nights: 'booth', elena: 'future', stay: 'go', station: 'never', look: 'no', girl: 'let', funeral: 'apart' } },
  { label: '«Записка», держит', choices: { frame: 'leave', milk: 'lie', booth: 'hold', camera: 'film', nights: 'wait', elena: 'future', stay: 'stay', station: 'come', look: 'back', girl: 'follow', ask: 'ask', funeral: 'walk' } },
  { label: '«Записка», отпускает', choices: { frame: 'take', milk: 'truth', booth: 'release', camera: 'speak', nights: 'booth', elena: 'future', stay: 'go', station: 'never', look: 'no', girl: 'follow', ask: 'bye', funeral: 'apart' } },
  { label: '«Письма», держит', choices: { frame: 'take', milk: 'truth', booth: 'hold', camera: 'speak', nights: 'wait', elena: 'truth', stay: 'stay', station: 'come', look: 'back', girl: 'follow', ask: 'bye', funeral: 'walk' } },
  { label: '«Письма», отпускает', choices: { frame: 'leave', milk: 'lie', booth: 'release', camera: 'film', nights: 'booth', elena: 'truth', stay: 'go', station: 'never', look: 'no', girl: 'follow', ask: 'ask', funeral: 'apart' } },
];
const fresh = () => ({
  chapter: 0, step: 0, scales: Object.fromEntries(Object.entries(SCALES).map(([k, s]) => [k, s.start])),
  shown: {}, marks: {}, choices: {}, hands: {},
});

export default async function (b) {
  await Promise.all([b.css('fonts.css'), b.css('ui.css')]);
  // the language of mini-games in this game's letters: the plate and the petals in the intertitles' serif, the marks'
  // lines and the ghost finger in the old film's white (warm is the beam's alone: none of it here)
  b.minigame.style({ key: 'E_MAJOR_D_FLAT_MINOR', font: '"Paradizo Title", Georgia, serif', colors: { mark: '#efe8da', ghost: '#efe8da' } });
  const hub = listen(b);
  const view = ui(b.layer);
  view.pausing(b);
  // (the page is heard only after a touch: a chapter that begins without «Плёнка» does so only once there was one —
  // not on a page reloaded where the chapter before had just ended)
  let touched = false;
  for (const touch of ['pointerdown', 'keydown']) addEventListener(touch, () => { touched = true; }, { once: true, capture: true });
  // the lamp of «Плёнка»: the player presses it (the point the scene marks as the lamp), then where to go
  const lamp = async options => {
    const away = view.hint('Коснись лампы', 3000);
    const action = await hub.offer({ 'lamp#lamp': options });
    away();
    return action.id;
  };
  // «Плёнка»: the lamp alone (no title: the very beginning), the chapter's title, or the frames of `map`, as the strip
  // comes into the light and they develop; → once it has. No sound of its own; no scales
  const strip = async (number, title, map) => {
    beds({}, 2);
    view.gauges(null);
    await b.show(SCENES.strip, { state: { chapter_number: number, chapter_title: title, map, reveal: 0, lamp: 1 } });
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
      await strip(opening ? '' : ch.number, opening ? '' : ch.title, null);
      await lamp([{ id: 'go', label: kept.step ? 'Продолжить' : 'Начать' }]);
    }
    wake();
    // (the epilogue: the play's scales are done — its steps show none)
    if (kept.chapter === EPILOGUE) view.gauges(null);
    const mine = kept.chapter === EPILOGUE ? { ...view, gauges() {} } : view;
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
      await strip('', TITLE, whole(kept));
      await lamp([{ id: 'anew', label: 'Сыграть заново' }]);
      return b.restart();
    } else if (ch.choices.length) {
      // the frames of the chapter; then on — or the chapter again, from how it began
      await strip(ch.number, ch.title, rows(ch.choices, kept));
      const to = await lamp([{ id: 'on', label: 'Дальше' }, { id: 'again', label: 'Пройти главу заново' }]);
      if (to === 'again') next = kept.start;
    }
    kept = next || { ...kept, chapter: kept.chapter + 1, step: 0, start: undefined };
    b.keep(kept);
  }
}

// choices as rows of «Плёнка»: chosen, could have been, never reached
const rows = (choices, kept, title = c => c.title) => choices.map(c => ({
  title: title(c), weight: c.weight,
  options: c.options.map(o => ({ label: o.label, state: kept.choices[c.id] === o.id ? 'chosen' : c.id in kept.choices ? 'open' : 'unseen' })),
}));
// the whole play: the turns (⚑) of every chapter — nine — and how it ended (the scene lays them as three strips)
const whole = kept => [
  ...CHAPTERS.flatMap(ch => rows(ch.choices.filter(c => c.weight === '⚑'), kept, c => `${ch.number}. ${c.title}`)),
  { title: 'Финал', weight: '⚑', options: ENDINGS.map(e => ({ label: e.label, state: e.id === facts(kept).ending ? 'chosen' : 'open' })) },
];
