// Scarlet Sails — after the novella by Alexander Grin. A bespoke game (moood/engines/bespoke) on the world «Scarlet Sails v3» (engine 3):
// two lives played in turn — Assol's in Kaperna, Gray's in the castle and at sea — till his ship comes for her.
// A prologue, five chapters, an epilogue — each a row of steps on the world's scenes. The choices, the two scales
// (Tale ↔ People, Sea ↔ Home) and what is remembered carry from chapter to chapter; how it ends follows from them
// (story.js facts) — the play always goes through to the epilogue. Between the chapters, the scene «The Far Sea»: the sea
// at dawn, a toy yacht at its edge — the chapter's title on a sail, and after the chapter the sails of what was chosen
// in it; after the epilogue, those of the whole play. The player touches the yacht to go on. A chapter with
// wall: false begins without it (the one before runs into it).
//
// What is kept of the play (bespoke.keep), after every step: { chapter, step, scales, shown, marks, choices, start:
// the same as the chapter began } — a step cut short (the page closed) is played again from its beginning. The author
// may go to any step of any chapter (☰) — or straight to a minigame of one (the step played up to it unseen:
// jump.js) —, and skip a step (⏭; a minigame's ⏭ is every player's: story.js g.play). What is gone to begins as one
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
// every step of the play in order, and where each chapter's first one is among them
const STEPS = CHAPTERS.flatMap(ch => ch.steps);
const FIRST = CHAPTERS.map((_, c) => CHAPTERS.slice(0, c).reduce((n, ch) => n + ch.steps.length, 0));
// «play as…» — whole plays the author goes from: the four endings, and Longren gone to sea
const PLAYS = [
  { label: 'As Grin wrote it', choices: { egl_ask: 'when', kids: 'true', leave: 'farewell', letter: 'share', longren: 'stay', ring: 'wear', way: 'secret', girl: 'keep' } },
  { label: 'Red sails are coming!', choices: { egl_ask: 'how', kids: 'made_up', leave: 'quiet', letter: 'home', longren: 'stay', ring: 'hide', way: 'secret', girl: 'give' } },
  { label: 'She waited', choices: { egl_ask: 'how', kids: 'true', leave: 'quiet', letter: 'share', longren: 'go', ring: 'wear', way: 'straight', girl: 'keep' } },
  { label: 'All Kaperna', choices: { egl_ask: 'when', kids: 'made_up', leave: 'farewell', letter: 'home', longren: 'stay', ring: 'hide', way: 'straight', girl: 'give' } },
  { label: 'Longren at sea', choices: { egl_ask: 'when', kids: 'true', leave: 'farewell', letter: 'home', longren: 'go', ring: 'hide', way: 'secret', girl: 'keep' } },
];
const fresh = () => ({
  chapter: 0, step: 0, scales: Object.fromEntries(Object.entries(SCALES).map(([k, s]) => [k, s.start])),
  shown: {}, marks: {}, choices: {},
});

export default async function (b) {
  await Promise.all([b.css('fonts.css'), b.css('ui.css')]);
  // the language of mini-games in this game's hand: the plate's phrase written as the hints were
  b.minigame.style({ key: 'D_MAJOR_B_MINOR', font: '"Parusa Hand", "Segoe Script", cursive' }); // (D — the world's scenes' music is in it too)
  const hub = listen(b);
  const view = ui(b.layer);
  b.onPause(pause);
  // (the page is heard only after a touch: a chapter that begins without the Far Sea does so only once there was one —
  // not on a page reloaded where the chapter before had just ended)
  let touched = false;
  for (const touch of ['pointerdown', 'keydown']) addEventListener(touch, () => { touched = true; }, { once: true, capture: true });
  // the toy yacht of the Far Sea: the player presses it (at the point the scene marks as its sail), then where to go
  const yacht = async options => {
    const away = view.hint(tr('Touch the little ship'), 3000);
    const action = await hub.offer({ 'yacht#sail': options });
    away();
    return action.id;
  };
  // the Far Sea: the yacht alone (no title: the very beginning), the chapter's title, or the sails of `map`, as the mist
  // lifts off the sea; → once it has. Its own bed of sound; no scales
  const far = async (number, title, map) => {
    beds({ sea: 0.3 }, 2);
    view.gauges(null);
    await b.show(SCENES.far, { state: { chapter_number: number, chapter_title: title, map, reveal: 0, yacht: 1 } });
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
    // the Far Sea before the chapter: the yacht alone at the very beginning, else the chapter's title; the player touches
    // the yacht to begin — unless the chapter is over (the page was left at its sails): its sails again; or gone
    // straight to a minigame; or the chapter before runs into this one
    if (kept.step < ch.steps.length && kept.play == null && !(touched && ch.wall === false)) {
      const opening = !kept.chapter && !kept.step;
      await far(opening ? '' : ch.number, opening ? '' : ch.title, null);
      await yacht([{ id: 'go', label: kept.step ? tr('Continue') : tr('Begin') }]);
    }
    wake();
    // (the epilogue: the play's scales are done — its steps show none)
    if (kept.chapter === EPILOGUE) view.gauges(null);
    const mine = kept.chapter === EPILOGUE ? { ...view, gauges() {} } : view;
    while (kept.step < ch.steps.length) {
      // (gone to a minigame of it: the step played up to it unseen)
      const g = context(b, mine, hub, structuredClone(kept), kept.play != null ? unseen(kept.play, unheard()) : null);
      let skip;
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
      // the sails of the whole play; then all of it anew (the author goes to a chapter by ☰)
      await far('', tr('Scarlet Sails'), whole(kept));
      await yacht([{ id: 'anew', label: tr('Play again') }]);
      return b.restart();
    } else if (ch.choices.length) {
      // the sails of the chapter; then on — or the chapter again, from how it began
      await far(ch.number, ch.title, rows(ch.choices, kept));
      const to = await yacht([{ id: 'on', label: tr('Onward') }, { id: 'again', label: tr('The chapter again') }]);
      if (to === 'again') next = kept.start;
    }
    kept = next || { ...kept, chapter: kept.chapter + 1, step: 0, start: undefined };
    b.keep(kept);
  }
}

// choices as rows of the Far Sea: chosen, could have been, never reached
const rows = (choices, kept, title = c => c.title) => choices.map(c => ({
  title: title(c), weight: c.weight,
  options: c.options.map(o => ({ label: o.label, state: kept.choices[c.id] === o.id ? 'chosen' : c.id in kept.choices ? 'open' : 'unseen' })),
}));
// the whole play: the turns (⚑) of every chapter, and how it ended
const whole = kept => [
  ...CHAPTERS.flatMap(ch => rows(ch.choices.filter(c => c.weight === '⚑'), kept, c => `${ch.number}. ${c.title}`)),
  { title: tr('Finale'), weight: '⚑', options: ENDINGS.map(e => ({ label: e.label, state: e.id === facts(kept).ending ? 'chosen' : 'open' })) },
];
