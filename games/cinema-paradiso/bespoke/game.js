// Новый кинотеатр «Парадизо» — по фильму Джузеппе Торнаторе. A bespoke game (moood/engines/bespoke) on the world «Новый
// кинотеатр „Парадизо“» (engine 3): the boy Toto and the projectionist Alfredo played in turn — the booth, the beam
// over the square, the hundred nights, the station — and Salvatore thirty years on. A prologue, five chapters, an
// epilogue — each a row of steps on the world's scenes. The choices, the two scales (Кино ↔ Люди, Держать ↔ Отпустить),
// what is remembered and what the hands did (state.hands) carry from chapter to chapter; how it ends follows from them
// (story.js facts) — the play always goes through to the epilogue. Choices are the language of mini-games' (story.js
// hub): a mark on the thing, its words as petals.
//   The map of the play (moood/docs/agents/games.md): the scene «Плёнка» — the dark of the booth, a point for each
// chapter — and over it each chapter's tree drawn by the game (map.js): its rows of choices (the forks), what was
// chosen warm in the beam's light, the chapters to come numbered only. The view comes to a chapter (`shown`), the
// player drags it anywhere. Marks on it, all at once: the main run's chapter — «Начать», «Продолжить» (from the
// beginning of the step it stopped in); a chapter played — «Переиграть главу»; each fork the main run reached in it —
// «Переиграть отсюда» (from that step, with all the main run chose before it). The play begins on the map, comes to it
// after each chapter — but before one that says wall: false (the one before runs into it, once the page has been
// touched: it may be heard) —, by ☰ (the page's: the step going on is left — played again from its beginning), and
// whenever it is opened again. Its author has one more mark (left of the prologue): his map of the chapters and their
// steps (ui.js author) — straight to any step, or a minigame of one, as one of PLAYS has it by then: a replay from
// there.
//
// The play is one — its main run, as far as the player has come. A replay (begun on the map) goes on its own and is
// never kept: closed, it is gone. Meanwhile the plate «Переигровка» in the corner; on the map its threads beside the
// main run's, its chapter's knot «Продолжить переигровку» or «Вернуться к основной» (the main run played on at once);
// whatever would leave it asks first — «Бросить переигровку». Played to its chapter's end, the player keeps it —
// «Оставить»: it becomes the main run from the next chapter on, the chapters after it to be played anew (said beside) —
// or not, «Отменить».
//
// What is kept of the play (bespoke.keep), after every step: the main run — { chapter, step, scales, shown, marks,
// choices, hands } —, steps: {chapter: [the main run as each of its steps began, and as it ended]} (what «Переиграть
// отсюда» starts from), seen: {chapter: how many of its steps the player has ever played through} — never lessened. The
// page's ⏭ (bespoke.forward, story.js) is the player's only where they have been: in a step not past what they have
// seen of its chapter — on to the next interaction —, and in a minigame there, or one they have been in a while
// (story.js SKIPPABLE).
import { SCALES, SCENES, context, listen } from './story.js';
import { ui } from './ui.js';
import { trees } from './map.js';
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
const END = CHAPTERS.length; // the play played through: no chapter of the main run
const REVEAL = 6; // s: a chapter's threads growing in the dark, row by row, as it has been played through
const GROWN = Symbol('grown');
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
  b.onPause(pause);
  // (the page is heard only after a touch: a chapter that begins without the map does so only once there was one —
  // not on a page reloaded where the chapter before had just ended)
  let touched = false;
  for (const touch of ['pointerdown', 'keydown']) addEventListener(touch, () => { touched = true; }, { once: true, capture: true });
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
  let kept = load(b.saved);
  // the replay going on, never kept: {run, steps: its chapter's states as its steps began, done: played to its end}
  let replay = null;
  const keep = next => { kept = next; return b.keep(kept); };
  // the author's map (his mark on «Плёнка» opens it): where it goes to is what the map waiting now is told — a minigame:
  // with what the step itself chooses before it, chosen as the play does
  let jumped = () => {};
  const author = b.game.mine ? view.author({
    chapters: CHAPTERS, plays: PLAYS.map(p => p.label), at: () => replay?.run ?? kept,
    games: (as, chapter, step) => ran(as, FIRST[chapter] + step).then(r => r.games),
    go: async (as, chapter, step, game) => {
      const state = await coming(as, chapter, step);
      jumped({ jump: game == null ? state : { ...state, play: game, choices: (await ran(as, FIRST[chapter] + step)).state.choices } });
    },
  }) : null;
  // ☰ while the play goes on: to the map (on the map itself there is none)
  const away = () => new Promise(ok => b.menu(() => ok('away')));

  for (let after = {}, straight = false; ;) {
    const to = straight ? 'main' : await map(after);
    after = {};
    straight = false;
    wake(); // (a touch: the page may be heard from now on)
    if (to === 'drop') { replay = null; continue; }
    if (to === 'keep') { await keepReplay(); continue; }
    if (to === 'main' || to === 'back') replay = null; // («Вернуться к основной»: the main run goes on from where it stands)
    else if (to !== 'replay') replay = replayFrom(to);
    view.replaying(!!replay);
    if ((await play()) === 'away') continue;
    if (replay) {
      replay.done = true;
      after = { reveal: replay.run.chapter };
      continue;
    }
    const done = kept.chapter;
    await onward();
    after = { reveal: done };
    straight = touched && CHAPTERS[kept.chapter]?.wall === false;
  }

  // the run being played (the replay, else the main run), step by step to its chapter's end → 'done'; or till ☰ → 'away'
  async function play() {
    for (;;) {
      const r = replay ? replay.run : kept, ch = CHAPTERS[r.chapter];
      if (r.step >= ch.steps.length) return 'done';
      // (the epilogue: the play's scales are done — its steps show none)
      if (r.chapter === EPILOGUE) view.gauges(null);
      const mine = r.chapter === EPILOGUE ? { ...view, gauges() {} } : view;
      // (gone to a minigame of it by the author's map: the step played up to it unseen)
      const g = context(b, mine, hub, structuredClone(run(r)), r.play != null ? unseen(r.play, unheard()) : null,
        { forward: r.step < (kept.seen[r.chapter] ?? 0) });
      const how = await Promise.race([
        ch.steps[r.step](g).then(() => 'done', e => { b.trouble(`шаг сломался: ${e.message || e}`); return 'broke'; }),
        away(),
      ]);
      if (how === 'done') await g.done();
      else g.leave();
      if (how === 'away') return 'away';
      // (a step that broke: passed with nothing of it kept)
      const next = { ...run(how === 'broke' ? r : g.state), step: r.step + 1 };
      const seen = { ...kept.seen, [r.chapter]: Math.max(kept.seen[r.chapter] ?? 0, next.step) };
      if (replay) {
        replay.run = next;
        replay.steps[next.step] = next;
        keep({ ...kept, seen });
      } else keep({ ...kept, ...next, seen, steps: { ...kept.steps, [r.chapter]: Object.assign([...(kept.steps[r.chapter] ?? [])], { [next.step]: next }) } });
      // (not waited for: the page keeps them in order, and the next step's cut is not held)
    }
  }
  // the main run on to the next chapter, kept as it begins it
  function onward() {
    const on = { ...run(kept), chapter: kept.chapter + 1, step: 0 };
    return keep({ ...kept, ...on, steps: { ...kept.steps, [on.chapter]: [on] } });
  }
  // a replay begun on the map: a chapter from its beginning (`chapter:i`) or from a fork's step (`fork:i:s`) — as the
  // main run was then —, or where the author's map went ({jump}: as the play he picked has it by then)
  function replayFrom(to) {
    if (to.jump) return { run: structuredClone(to.jump), steps: Object.assign([], { [to.jump.step]: run(to.jump) }), done: false };
    const [, i, s = 0] = to.split(':').map(Number), at = kept.steps[i];
    return { run: structuredClone(at[s]), steps: structuredClone(at.slice(0, s + 1)), done: false };
  }
  // a replay played to its end, kept: the main run from the next chapter on — what came after it in the main run gone
  function keepReplay() {
    const i = replay.run.chapter, on = { ...run(replay.run), chapter: i + 1, step: 0 }, steps = replay.steps;
    replay = null;
    view.replaying(false);
    return keep({ ...on, steps: { ...pick(kept.steps, j => j < i), [i]: steps, [i + 1]: [on] }, seen: kept.seen });
  }

  // «Плёнка», the map: the play in the booth's dark, where it is now in the middle (the replay's chapter, else the main run's).
  // What brought the play here: a chapter played through (reveal: its threads grow — its forks offered once they have
  // —, then the view goes on to where the play is now). → what was picked: an option's id, or {jump} — the author's map
  async function map({ reveal = null }) {
    b.menu(null);
    beds({}, 2);
    view.gauges(null);
    view.replaying(!!replay);
    const here = replay ? replay.run.chapter : Math.min(kept.chapter, EPILOGUE);
    await b.show(SCENES.strip, { state: { shown: reveal ?? here } });
    const drawn = trees(b, sky(), { shown: reveal ?? here, grow: reveal, seconds: REVEAL, author: !!author });
    const notice = replay?.done && again() ? view.hint('Если оставить, главы после этой придётся пройти заново.') : () => {};
    let grown = reveal == null, asked = null; // (an option that would leave the replay: asked again)
    let at = reveal ?? here; // (the chapter the view is at)
    const go = i => { if (i !== at) { at = i; b.set('shown', i); drawn.shown(i); } };
    // (a mark touched — the view goes to its chapter)
    const touching = ref => { const i = /^(?:knot|fork):(\d+)/.exec(ref)?.[1]; if (i != null) go(Number(i)); };
    const growing = grown ? null : new Promise(ok => setTimeout(() => ok(GROWN), REVEAL * 1000));
    try {
      for (;;) {
        const { offers, lead, quiet } = marks(asked, grown ? null : reveal);
        const on = Object.fromEntries(Object.keys(offers).map(ref => [ref, drawn.at(ref)]));
        const picked = await Promise.race([hub.offer(offers, { lead, quiet, touched: touching, at: on }), new Promise(ok => { jumped = ok; }), ...(grown ? [] : [growing])]);
        if (picked === GROWN) { grown = true; go(here); continue; }
        if (picked.jump) return picked;
        if (picked.id === 'author') { author(); continue; }
        if (replay && !['replay', 'keep', 'drop'].includes(picked.id) && asked !== picked.id) { asked = picked.id; continue; }
        return picked.id;
      }
    } finally {
      jumped = () => {};
      hub.withdraw();
      notice();
      drawn.remove();
    }
  }
  // the map's marks: {offers: {ref: options}, lead: the refs the ghost shows, quiet: those drawn small} — `asked`: the
  // option that would leave the replay, now «Бросить переигровку»; `growing`: the chapter whose forks are not there yet
  function marks(asked, growing) {
    const offers = {}, quiet = [];
    const add = (ref, id, label) => { (offers[ref] ??= []).push({ id, label: id === asked ? 'Бросить переигровку' : label }); };
    if (replay) {
      const k = `knot:${replay.run.chapter}`;
      if (replay.done) { add(k, 'keep', 'Оставить'); add(k, 'drop', 'Отменить'); }
      else { add(k, 'replay', 'Продолжить переигровку'); add(k, 'back', 'Вернуться к основной'); }
    }
    if (kept.chapter < END) add(`knot:${kept.chapter}`, 'main', kept.step ? 'Продолжить' : 'Начать');
    for (let i = 0; i < Math.min(kept.chapter, END); i++) {
      if (kept.steps[i]?.[0]) add(`knot:${i}`, `chapter:${i}`, 'Переиграть главу');
      if (i === growing) continue;
      CHAPTERS[i].choices.forEach((c, k) => {
        const s = fork(i, c.id), ref = `fork:${i}:${k}`;
        if (s == null) return;
        add(ref, `fork:${i}:${s}`, 'Переиграть отсюда');
        quiet.push(ref);
      });
    }
    if (author) { add('author', 'author', 'Карта автора'); quiet.push('author'); }
    return { offers, lead: [`knot:${replay ? replay.run.chapter : kept.chapter}`].filter(ref => ref in offers), quiet };
  }
  // the step of chapter i in which the main run made the choice `id`: the first that began without it and ended with
  // it — known where both states are kept
  function fork(i, id) {
    const at = kept.steps[i] ?? [];
    for (let s = 0; s + 1 < at.length; s++) if (at[s] && at[s + 1] && !(id in at[s].choices) && id in at[s + 1].choices) return s;
    return null;
  }
  // whether keeping the replay played to its end makes chapters the main run has played since to be played anew
  const again = () => kept.chapter > replay.run.chapter + 1 || (kept.chapter === replay.run.chapter + 1 && kept.step > 0);
  // the chapters as the map draws them: each one's rows — the main run's, and the replay's where it is
  function sky() {
    const re = replay?.run;
    return CHAPTERS.map((c, i) => {
      const played = i < kept.chapter || (i === kept.chapter && kept.step > 0), tried = re?.chapter === i;
      const kind = i === (re ? re.chapter : kept.chapter) ? 'here' : i < kept.chapter ? 'played' : i === kept.chapter ? 'next' : 'future';
      return { number: c.number, title: c.title, kind, map: played || tried ? rows(c, played ? kept.choices : {}, tried ? re.choices : {}) : null };
    });
  }
}

// the play as it was kept — or as this game kept it before (the chapter's start; a minigame gone to — gone): the main
// run as it is (a chapter it played through — the next one begun), the states known at its steps' beginnings, how far
// each chapter has been seen
function load(saved) {
  let main = run({ ...fresh(), ...saved });
  const steps = saved.steps ?? (saved.start ? { [main.chapter]: [run(saved.start)] } : {});
  const seen = saved.seen ?? Object.fromEntries(CHAPTERS.map((c, i) => [i, i < main.chapter ? c.steps.length : i === main.chapter ? main.step : 0]));
  if (main.chapter < END && main.step >= CHAPTERS[main.chapter].steps.length) {
    main = { ...main, chapter: main.chapter + 1, step: 0 };
    steps[main.chapter] = [run(main)];
  }
  (steps[main.chapter] ??= [])[main.step] ??= run(main);
  return { ...main, steps, seen };
}
// a run's own fields (the play's position and what it carries), apart from what the play keeps of its chapters (a
// minigame gone to by the author's map: `play`)
const run = p => structuredClone({ chapter: p.chapter, step: p.step, scales: p.scales, shown: p.shown, marks: p.marks, choices: p.choices, hands: p.hands });
const pick = (o, keep) => Object.fromEntries(Object.entries(o).filter(([j]) => keep(Number(j))));
// a chapter's choices as rows of threads: the main run's chosen, a replay's tried (both — the same), could have been,
// never reached
function rows(ch, mainChoices, triedChoices) {
  return ch.choices.map(c => {
    const m = mainChoices[c.id], t = triedChoices[c.id];
    return { title: c.title, weight: c.weight, options: c.options.map(o => ({ label: o.label,
      state: m === o.id && t === o.id ? 'both' : m === o.id ? 'chosen' : t === o.id ? 'tried' : m || t ? 'open' : 'unseen' })) };
  });
}
