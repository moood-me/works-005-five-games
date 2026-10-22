// Around the World in 80 Days — after Jules Verne's novel. A bespoke game (moood/engines/bespoke) on the world «Around
// the World in 80 Days» (engine 3): Phileas Fogg and Passepartout played in turn — the wager, the elephant, the suttee,
// the typhoon, the sledge under sail, the «Henrietta» burnt to the waterline, and the day won from the sun. A prologue,
// four chapters, an epilogue — each a row of steps on the world's scenes (rpg docs/vokrug-sveta/game.md §3). The choices,
// the notebook (time in hand, hours against the timetable) and the carpet-bag (£), who remembers what (marks) and what
// the hands did (hands) carry from chapter to chapter; how it ends follows from them (story.js facts) — the play always
// goes through to the epilogue. Choices are the language of mini-games' (story.js hub): a mark on the thing, its words
// as petals.
//   The map of the play (moood/docs/agents/games.md): the scene «The route» — an old map of the world, the way in red
// ink as far as the play has come (`route`), the day won at the 180th meridian once it is through (`dateline`), a point
// for each chapter where it is played — and over it each chapter's tree drawn by the game (map.js): a page of the old
// edition pinned there, its number, title and heading, its rows of choices (the forks) — what was chosen in red ink,
// what could have been in pencil, what was never reached blank —, the chapters to come blank pages, numbered only. The
// view comes to a chapter (`shown`), the player drags it anywhere. What can be done on it is its own drawing — pressed,
// the language's mark opens there, born open (story.js hub.ask): the main run's pointer — «Start», «Continue» (from the
// beginning of the step it stopped in); a chapter played — «Replay the chapter»; each fork the main run reached in it —
// «Replay from here» (from that step, with all the main run chose before it). The play begins on the map, comes to it
// after each chapter — but before one that says wall: false (the one before runs into it, once the page has been
// touched: it may be heard): chapter I after the prologue, the epilogue after chapter IV (its page ends with the
// finale) —, by ☰ (the page's: the step going on is left — played again from its beginning), and whenever it is opened
// again. Its author has one more sign: his map of the chapters and their steps (ui.js author) — straight to any step,
// or a minigame of one, as one of PLAYS has it by then (as the main run stood at that step, where it has played it): a
// replay from there.
//
// The play is one — its main run, as far as the player has come. A replay (begun on the map) goes on its own and is
// never kept: closed, it is gone. On the map: the plate «Replay» on its page (pressed, or its knot: «Continue the
// replay», «Drop the replay»), its threads beside the main run's, its pointer «Continue the replay» or «Back to the
// main run» (the main run played on at once); whatever would leave it asks first (its mark opens again) — «Drop the
// replay». Played to its chapter's end, the player keeps it — «Keep»: it becomes the main run from the next chapter on,
// the chapters after it to be played anew (said beside) — or not, «Undo».
//
// What is kept of the play (bespoke.keep), after every step: the main run — { chapter, step, hours, money, shown,
// marks, choices, hands, lines } —, steps: {chapter: [the main run as each of its steps began, and as it ended]} (what
// «Replay from here» starts from), seen: {chapter: how many of its steps the player has ever played through} — never
// lessened. The page's ⏭ (bespoke.forward, story.js) is the player's only where they have been: in a step not past what
// they have seen of its chapter — on to the next interaction —, and in a minigame there, or one they have been in a
// while (story.js SKIPPABLE). Where the play is and how it ended — bespoke.at, bespoke.ended (the account of what
// players do).
import { ENDINGS, START, SCENES, context, facts, listen } from './story.js';
import { ui } from './ui.js';
import { trees } from './map.js';
import { beds, wake, unheard, pause } from './sound.js';
import { jump as unseen } from './jump.js';
import prologue from './chapters/prologue.js';
import one from './chapters/1.js';
import two from './chapters/2.js';
import three from './chapters/3.js';
import four from './chapters/4.js';
import epilogue from './chapters/epilogue.js';

const CHAPTERS = [prologue, one, two, three, four, epilogue];
const EPILOGUE = CHAPTERS.length - 1;
const END = CHAPTERS.length; // the play played through: no chapter of the main run
const DATELINE = 3; // the chapter whose page the view is at as it passes the 180th meridian (America: the Pacific crossed)
const TOUR = 2.2; // s at each chapter's page as the view goes the whole way round, the play played through
const REVEAL = 4; // s: a chapter's rows written in, one by one, as it has been played through (and the red line drawn on)
// a replay's end asks on its knot once the knot has stood still REST looks REST_STEP ms apart (REST_MAX s at most)
const REST = 3, REST_STEP = 100, REST_MAX = 12;
// every step of the play in order, and where each chapter's first one is among them
const STEPS = CHAPTERS.flatMap(ch => ch.steps);
const FIRST = CHAPTERS.map((_, c) => CHAPTERS.slice(0, c).reduce((n, ch) => n + ch.steps.length, 0));
// «play as…» — whole plays the author goes from: Verne's own way, the reckoning one, the kind one, the lonely one
const PLAYS = [
  { label: tr('as in Verne'), choices: { sati: 'night', kiouni: 'gift', answer: 'plaid', aouda: 'europe', boat: 'take', punch: 'punch', bridge: 'run', fort: 'go', henrietta: 'burn', liverpool: 'hand' } },
  { label: tr('calculating'), choices: { sati: 'road', kiouni: 'sell', answer: 'spare', aouda: 'holland', boat: 'leave', punch: 'shake', bridge: 'run', fort: 'pay', henrietta: 'burn', liverpool: 'hit' } },
  { label: tr('kindly'), choices: { sati: 'night', kiouni: 'gift', answer: 'notlost', aouda: 'europe', boat: 'take', punch: 'shake', bridge: 'walk', fort: 'go', henrietta: 'sails', liverpool: 'hand' } },
  { label: tr('alone'), choices: { sati: 'road', kiouni: 'sell', answer: 'spare', aouda: 'holland', boat: 'leave', punch: 'punch', bridge: 'run', fort: 'pay', henrietta: 'sails', liverpool: 'hit' } },
];
const fresh = () => ({
  chapter: 0, step: 0, hours: START.hours, money: START.money, shown: {}, marks: {}, choices: {}, hands: {}, lines: [], log: [],
});

export default async function (b) {
  await Promise.all([b.css('fonts.css'), b.css('ui.css')]);
  // the language of mini-games in this game's letters: the plate and the petals in the old edition's serif, the marks'
  // lines and the ghost finger in its paper white; the world's key, A♭ major
  b.minigame.style({ key: 'A_FLAT_MAJOR_F_MINOR', font: '"Around Title", Georgia, serif', colors: { mark: '#f4ead2', ghost: '#f4ead2' } });
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
  // the author's map (his sign on «The route» opens it): where it goes to is what the map waiting now is told — a
  // minigame: with what the step itself chooses before it, chosen as the play does
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
  // the play played through: how it ended (bespoke.ended)
  const ended = () => b.ended({ ending: facts(kept).ending ?? null });

  for (let after = {}, straight = false; ;) {
    const to = straight ? 'main' : await map(after);
    after = {};
    straight = false;
    wake(); // (a touch: the page may be heard from now on)
    if (to === 'drop') { replay = null; continue; }
    // (a replay kept that ends the play: the map goes the whole way round too)
    if (to === 'keep') { await keepReplay(); if (kept.chapter === END) { ended(); after = { round: true }; } continue; }
    if (to === 'main' || to === 'back') replay = null; // (“Back to the main run”: the main run goes on from where it stands)
    else if (to !== 'replay') replay = replayFrom(to);
    if ((await play()) === 'away') continue;
    if (replay) {
      replay.done = true;
      after = { reveal: replay.run.chapter };
      continue;
    }
    const done = kept.chapter;
    await onward();
    if (kept.chapter === END) ended();
    after = { reveal: done };
    straight = touched && CHAPTERS[kept.chapter]?.wall === false;
  }

  // the run being played (the replay, else the main run), step by step to its chapter's end → 'done'; or till ☰ →
  // 'away'
  async function play() {
    for (;;) {
      const r = replay ? replay.run : kept, ch = CHAPTERS[r.chapter];
      if (r.step >= ch.steps.length) return 'done';
      // (the notebook and the bag as the run stands — the map hid them)
      view.gauges(r);
      // (gone to a minigame of it by the author's map: the step played up to it unseen)
      const g = context(b, view, hub, structuredClone(run(r)), r.play != null ? unseen(r.play, unheard()) : null,
        { forward: r.step < (kept.seen[r.chapter] ?? 0) });
      // (where the play is, for the account of what players do)
      b.at({ chapter: r.chapter, step: r.step, replay: !!replay });
      const how = await Promise.race([
        ch.steps[r.step](g).then(() => 'done', e => { b.trouble(`the step broke: ${e.message || e}`); return 'broke'; }),
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
  // main run was then —, or where the author's map went ({jump}: as the main run stood there where it has played that
  // step, else as the play he picked has it by then)
  function replayFrom(to) {
    if (to.jump) {
      // (a step of a chapter the main run has played: as it stood there, its steps before as they were — as “Replay
      // from here”)
      const { chapter, step, play } = to.jump, at = kept.steps[chapter];
      if (at?.[step]) {
        return { run: { ...structuredClone(at[step]), ...(play != null ? { play } : {}) }, steps: structuredClone(at.slice(0, step + 1)), done: false };
      }
      // (else as the play he picked has it by then)
      return { run: structuredClone(to.jump), steps: Object.assign([], { [step]: run(to.jump) }), done: false };
    }
    const [, i, s = 0] = to.split(':').map(Number), at = kept.steps[i];
    return { run: structuredClone(at[s]), steps: structuredClone(at.slice(0, s + 1)), done: false };
  }
  // a replay played to its end, kept: the main run from the next chapter on — what came after it in the main run gone
  function keepReplay() {
    const i = replay.run.chapter, on = { ...run(replay.run), chapter: i + 1, step: 0 }, steps = replay.steps;
    replay = null;
    return keep({ ...on, steps: { ...pick(kept.steps, j => j < i), [i]: steps, [i + 1]: [on] }, seen: kept.seen });
  }

  // «The route», the map: the play's pages pinned to the old map, where it is now in the middle (the replay's chapter,
  // else the main run's); the red line as far as the main run has come; no sound of its own, no notebook, no bag.
  // What brought the play here: a chapter played through (reveal: its rows written in — its forks offered once they
  // have —, the red line drawn on through it, then the view goes on to where the play is now). → what was picked: an
  // option's id, or {jump} — the author's map
  async function map({ reveal = null, round: ended = false }) {
    b.menu(null);
    // (nothing of the chapter said or shown stays over the map)
    b.hush();
    view.quiet();
    beds({}, 2);
    view.gauges(null);
    const here = replay ? replay.run.chapter : Math.min(kept.chapter, EPILOGUE);
    // (the main run's chapter just played: its stretch of the way drawn on as its rows are written)
    const drawing = reveal != null && !replay;
    // (the play just played through: once its finale is written, the view goes the whole way round from London, the day
    // won notched at the 180th meridian as it passes — design.md «Ход игры», the epilogue)
    const round = ended || (drawing && reveal === EPILOGUE);
    await b.show(SCENES.map, { state: { shown: reveal ?? here, route: drawing ? CHAPTERS[reveal].route[0] : routeOf(kept), dateline: kept.chapter >= END && !round ? 1 : 0 }, captions: false, fade: true });
    if (drawing) b.set('route', CHAPTERS[reveal].route[1], REVEAL);
    const drawn = trees(b, sky(), { grow: reveal, seconds: REVEAL, author: author ? here : null });
    const notice = replay?.done && anew() ? view.hint(tr('If you keep it, the chapters after this one will have to be played again.')) : () => {};
    let grown = reveal == null, asked = null; // (an option that would leave the replay: asked again)
    let at = reveal ?? here; // (the chapter the view is at)
    const go = i => { if (i !== at) { at = i; b.set('shown', i); } };
    // (something of a chapter pressed — the view goes to it)
    const toward = ref => { const i = /^(?:knot|fork|go|goreplay|badge):(\d+)/.exec(ref)?.[1]; if (i != null) bring(Number(i)); };
    // (pressed on the chapter already shown, wherever the player dragged the view: back to it)
    let come = 0;
    const bring = i => { if (i === at) b.set('come', ++come); else go(i); };
    // what the map's drawing offers now; pressed — told here (while a choice is open nothing else is pressed: a touch
    // off its petals folds it)
    let pressed = () => {};
    const offer = () => drawn.offer(Object.keys(marks(asked, grown ? null : reveal)), ref => pressed(ref));
    // (the chapter just played written in: its forks offered too, the view on to where the play is)
    let left = false; // (the map left: the view's way round goes no further)
    const tour = async () => {
      for (let i = 0; i <= EPILOGUE && !left; i++) {
        go(i);
        if (i === DATELINE) b.set('dateline', 1, TOUR);
        await new Promise(ok => setTimeout(ok, TOUR * 1000));
      }
    };
    const growing = grown && !round ? null : setTimeout(async () => { grown = true; offer(); if (round) await tour(); if (!left) go(here); }, (grown ? 1 : REVEAL) * 1000);
    try {
      // (a replay played to its end: its knot's mark opens by itself — keep it or not, the question the map asks; the
      // one mark that opens untouched)
      const asking = replay?.done ? await standing(drawn, `knot:${replay.run.chapter}`) : null;
      for (let again = asking; ;) {
        offer();
        // (a choice that would leave the replay: its mark opens again at once, asking)
        const ref = again ?? await new Promise(ok => { pressed = ok; jumped = ok; });
        pressed = () => {};
        jumped = () => {};
        again = null;
        if (ref.jump) return ref;
        toward(ref);
        const options = marks(asked, grown ? null : reveal)[ref];
        const picked = options ? await hub.ask(drawn.at(ref), options) : null;
        if (!picked) { asked = null; continue; }
        if (picked.id === 'author') { author(); continue; }
        if (replay && !['replay', 'keep', 'drop', 'main'].includes(picked.id) && asked !== picked.id) { asked = picked.id; again = ref; continue; }
        return picked.id;
      }
    } finally {
      left = true;
      clearTimeout(growing);
      jumped = () => {};
      hub.withdraw();
      notice();
      drawn.remove();
    }
  }
  // a ref of the map's drawing once it has come to rest in the frame — the scene there, the view arrived (a mark
  // opened on it while the view still moves could go out of sight: folded); none within REST_MAX s — null
  function standing(drawn, ref) {
    return new Promise(ok => {
      let last = null, still = 0, waited = 0;
      // (looked at every REST_STEP ms, not each frame: a scene at rest may send none)
      const look = setInterval(() => {
        const at = drawn.at(ref)();
        still = at && last && Math.hypot(at.x - last.x, at.y - last.y) < 0.5 ? still + 1 : 0;
        last = at;
        waited += REST_STEP;
        if (still >= REST || waited >= REST_MAX * 1000) { clearInterval(look); ok(still >= REST ? ref : null); }
      }, REST_STEP);
    });
  }
  // what can be done on the map: {ref (map.js: what of its drawing is pressed): options} — `asked`: the option that
  // would leave the replay, now “Drop the replay”; `growing`: the chapter whose forks are not there yet
  function marks(asked, growing) {
    const offers = {};
    const add = (ref, id, label) => { (offers[ref] ??= []).push({ id, label: id === asked ? tr('Drop the replay') : label }); };
    if (replay) {
      const c = replay.run.chapter;
      if (replay.done) for (const at of [`knot:${c}`, `badge:${c}`]) { add(at, 'keep', tr('Keep')); add(at, 'drop', tr('Undo')); }
      else {
        add(`goreplay:${c}`, 'replay', tr('Continue the replay')); add(`goreplay:${c}`, 'back', tr('Back to the main run'));
        // (its plate on the page, its knot: the replay itself — on, or dropped)
        add(`badge:${c}`, 'replay', tr('Continue the replay')); add(`badge:${c}`, 'drop', tr('Drop the replay'));
        add(`knot:${c}`, 'drop', tr('Drop the replay'));
      }
    }
    if (kept.chapter < END) {
      const main = replay ? tr('Drop the replay') : kept.step ? tr('Continue') : tr('Start');
      add(`go:${kept.chapter}`, 'main', main);
      // (its pin too, where no replay goes on in that chapter)
      if (replay?.run.chapter !== kept.chapter) add(`knot:${kept.chapter}`, 'main', main);
    }
    for (let i = 0; i < Math.min(kept.chapter, END); i++) {
      if (kept.steps[i]?.[0]) add(`knot:${i}`, `chapter:${i}`, tr('Replay the chapter'));
      if (i === growing) continue;
      CHAPTERS[i].choices.forEach((c, k) => {
        const s = fork(i, c.id);
        if (s != null) add(`fork:${i}:${k}`, `fork:${i}:${s}`, tr('Replay from here'));
      });
    }
    if (author) add('author', 'author', tr('The author’s map'));
    return offers;
  }
  // the step of chapter i in which the main run made the choice `id`: the first that began without it and ended with
  // it — known where both states are kept
  function fork(i, id) {
    const at = kept.steps[i] ?? [];
    for (let s = 0; s + 1 < at.length; s++) if (at[s] && at[s + 1] && !(id in at[s].choices) && id in at[s + 1].choices) return s;
    return null;
  }
  // whether keeping the replay played to its end makes chapters the main run has played since to be played anew
  function anew() {
    return kept.chapter > replay.run.chapter + 1 || (kept.chapter === replay.run.chapter + 1 && kept.step > 0);
  }
  // the chapters as the map draws them (map.js): each one's rows — the main run's, and the replay's where it is —, the
  // play's pointer, the replay's; the epilogue's page, once the play is through, ends with the finale
  function sky() {
    const re = replay?.run;
    return CHAPTERS.map((c, i) => {
      const reached = i <= kept.chapter;
      const tried = re?.chapter === i;
      const kind = i === (re ? re.chapter : kept.chapter) ? 'here' : i < kept.chapter ? 'played' : i === kept.chapter ? 'next' : 'future';
      // (a chapter played: all its rows; one going on — those reached so far)
      const all = rows(c, reached ? kept.choices : {}, tried ? re.choices : {});
      const shown = i < kept.chapter && !tried ? all : all.filter(r => r.options.some(o => o.state !== 'unseen'));
      return { number: c.number, title: c.title, heading: c.heading, kind, rows: i === EPILOGUE && kept.chapter >= END ? [...shown, finale()] : shown,
        go: i === kept.chapter ? (kept.step ? tr('continue\nthe game') : tr('start\nthe game')) : null, replay: tried && !replay.done, badge: tried };
    });
  }
  // how the play ended: its endings, the one it came to chosen (the others beside it)
  function finale() {
    return { title: tr('Finale'), weight: '⚑', options: ENDINGS.map(e => ({ label: e.label, state: e.id === facts(kept).ending ? 'chosen' : 'open' })) };
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
  // (the first chapter begins as the play does: its start is known even where an older save did not keep it)
  (steps[0] ??= [])[0] ??= run(fresh());
  return { ...main, steps, seen };
}
// a run's own fields (the play's position and what it carries), apart from what the play keeps of its chapters (a
// minigame gone to by the author's map: `play`)
const run = p => structuredClone({ chapter: p.chapter, step: p.step, hours: p.hours, money: p.money, shown: p.shown, marks: p.marks,
  choices: p.choices, hands: p.hands, lines: p.lines, log: p.log ?? [] });
// how far the red line goes on the map for a main run: to where its chapter begins; the play through — all the way
const routeOf = p => (p.chapter >= END ? 1 : CHAPTERS[p.chapter].route[0]);
const pick = (o, keep) => Object.fromEntries(Object.entries(o).filter(([j]) => keep(Number(j))));
// a chapter's choices as rows of its page: the main run's chosen, a replay's tried (both — the same), could have been,
// never reached
function rows(ch, mainChoices, triedChoices) {
  return ch.choices.map(c => {
    const m = mainChoices[c.id], t = triedChoices[c.id];
    return { title: c.title, weight: c.weight, options: c.options.map(o => ({ label: o.label,
      state: m === o.id && t === o.id ? 'both' : m === o.id ? 'chosen' : t === o.id ? 'tried' : m || t ? 'open' : 'unseen' })) };
  });
}
