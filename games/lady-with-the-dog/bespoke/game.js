// Дама с собачкой — по рассказу А. П. Чехова. A bespoke game (moood/engines/bespoke) on the world «Дама с собачкой»
// (engine 3): Gurov and Anna played in turn — Yalta in summer, Oreanda, the station, the Moscow winter, the fence in
// S., the theatre, «Славянский базар». A prologue, five chapters, an epilogue — each a row of steps on the world's
// scenes. The choices, the two scales (Лёгкость ↔ Открытость, Долг ↔ Жизнь) and what is remembered carry from chapter
// to chapter; how it ends follows from who of the two spouses knows (story.js facts) — the play always goes through to
// the epilogue. Between the chapters, the scene «Огни»: the night sea, the far arc of the quay's lamps, a white spitz
// on the parapet — the chapter's title on the moon's path, and after the chapter its choices as groups of lamps by
// the water (chosen ones lit); after the epilogue, those of the whole play. The season is the chapter's: its title in
// the season it begins in, its map in the one it ends in. The player touches the spitz to go on. A chapter with wall:
// false begins without «Огни» (the one before runs into it).
//
// What is kept of the play (bespoke.keep), after every step: { chapter, step, scales, shown, marks, choices, start:
// the same as the chapter began } — a step cut short (the page closed) is played again from its beginning. The author
// may go to any step of any chapter (☰) — or straight to a minigame of one (the step played up to it unseen:
// jump.js) —, and skip a step (⏭; a minigame's ⏭ is every player's: story.js g.play). What is gone to begins as one
// of PLAYS has it by then: that play's choices, every step before played through unseen (its scales, marks and gauges
// come out of the steps themselves; its minigames skipped, as played). A step skipped leaves nothing chosen.
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
// every step of the play in order, and where each chapter's first one is among them
const STEPS = CHAPTERS.flatMap(ch => ch.steps);
const FIRST = CHAPTERS.map((_, c) => CHAPTERS.slice(0, c).reduce((n, ch) => n + ch.steps.length, 0));
// «партия как…» — whole plays the author goes from (game.md §3.8): eight choices each; the scales come out of them
const OPEN = { dog: 'pat', room: 'bring', window: 'look', club: 'walk', fence: 'call', stairs: 'promise', husband: 'truth', wife: 'truth' };
const PLAYS = [
  { label: 'Две клетки', choices: { dog: 'finger', room: 'eat', window: 'curtain', club: 'laugh', fence: 'hide', stairs: 'away', husband: 'lie', wife: 'lie' } },
  { label: 'Без лжи', choices: OPEN },
  { label: 'Жена знает', choices: { ...OPEN, husband: 'lie' } },
  { label: 'Муж знает', choices: { ...OPEN, wife: 'lie' } },
  { label: 'До весны', choices: { ...OPEN, stairs: 'away' } },
];
const fresh = () => ({
  chapter: 0, step: 0, scales: Object.fromEntries(Object.entries(SCALES).map(([k, s]) => [k, s.start])),
  shown: {}, marks: {}, choices: {},
});

export default async function (b) {
  await Promise.all([b.css('fonts.css'), b.css('ui.css')]);
  // the language of mini-games in this game's hand: the plate and the petals in Bad Script, the marks and their fill
  // in graphite, «good» the postcard's white, danger a dull ochre (red is the leash's alone), the second path grey-blue
  b.minigame.style({
    key: 'A_FLAT_MAJOR_F_MINOR', font: '"Dama Hand", "Segoe Script", cursive',
    colors: { mark: '#3b3a38', fill: '#3b3a38', good: '#f1ebdf', danger: '#b07a3a', fork: '#8a9bab', ghost: 'rgba(59, 58, 56, 0.55)' },
  });
  const hub = listen(b);
  const view = ui(b.layer);
  view.pausing(b);
  // (the page is heard only after a touch: a chapter that begins without «Огни» does so only once there was one —
  // not on a page reloaded where the chapter before had just ended)
  let touched = false;
  for (const touch of ['pointerdown', 'keydown']) addEventListener(touch, () => { touched = true; }, { once: true, capture: true });
  // the spitz on the parapet of «Огни»: the player presses it, then where to go
  const spitz = async options => {
    const away = view.hint('Коснись шпица', 3000);
    const action = await hub.offer({ 'spitz#spitz': options });
    away();
    return action.id;
  };
  // «Огни»: the spitz alone (no title: the very beginning), the chapter's title, or the lamps of `map`, as the mist
  // goes off the sea; → once it has. The sea in summer and autumn, the snow's silence in winter and the thaw; no scales
  const lights = async (number, title, map, season) => {
    beds(season === 'winter' || season === 'thaw' ? { snow: 0.3 } : { sea: 0.3 }, 2);
    view.gauges(null);
    await b.show(SCENES.lights, { state: { chapter_number: number, chapter_title: title, map, reveal: 0, season, spitz: 1 } });
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
    // «Огни» before the chapter: the spitz alone at the very beginning (summer), else the chapter's title in the season
    // it begins in; the player touches the spitz to begin — unless the chapter is over (the page was left at its
    // map): its map again; or gone straight to a minigame; or the chapter before runs into this one. (A chapter
    // without its wall, come to on a page just opened: the spitz alone — that chapter has no title of its own.)
    if (kept.step < ch.steps.length && kept.play == null && !(touched && ch.wall === false)) {
      const bare = (!kept.chapter && !kept.step) || ch.wall === false;
      await lights(bare ? '' : ch.number, bare ? '' : ch.title, null, !kept.chapter && !kept.step ? 'summer' : ch.season(kept));
      await spitz([{ id: 'go', label: 'Дальше' }]);
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
      // the lamps of the whole play, in the epilogue's season; then all of it anew (the author goes to a chapter by ☰)
      await lights('', '', whole(kept), ch.season(kept));
      await spitz([{ id: 'anew', label: 'Сыграть заново' }]);
      return b.restart();
    } else if (ch.choices.length) {
      // the lamps of the chapter, in the season it ended in; then on — or the chapter again, from how it began
      await lights(ch.number, ch.title, rows(ch.choices, kept), ch.season(kept));
      const to = await spitz([{ id: 'on', label: 'Дальше' }, { id: 'again', label: 'Пройти главу заново' }]);
      if (to === 'again') next = kept.start;
    }
    kept = next || { ...kept, chapter: kept.chapter + 1, step: 0, start: undefined };
    b.keep(kept);
  }
}

// choices as rows of «Огни»: chosen, could have been, never reached
const rows = (choices, kept, title = c => c.title) => choices.map(c => ({
  title: title(c), weight: c.weight,
  options: c.options.map(o => ({ label: o.label, state: kept.choices[c.id] === o.id ? 'chosen' : c.id in kept.choices ? 'open' : 'unseen' })),
}));
// the whole play: the turns (⚑) of every chapter — at the fence, the husband at the gate, the wife in the door — each
// with its chapter's number, and how it ended
const whole = kept => [
  ...CHAPTERS.flatMap(ch => rows(ch.choices.filter(c => c.weight === '⚑'), kept, c => `${ch.number}. ${c.title}`)),
  { title: 'Финал', weight: '⚑', options: ENDINGS.map(e => ({ label: e.label, state: e.id === facts(kept).ending ? 'chosen' : 'open' })) },
];
