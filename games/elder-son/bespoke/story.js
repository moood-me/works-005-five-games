// What a chapter's steps play with: context(b, view, hub, state, j, {forward}) → g. Its state is a working copy — kept
// only once the step is done (game.js). A step left behind (the player went to the map: ☰) does nothing more and never
// ends: whatever it still calls returns a promise that never settles.
//   g.state — what the play carries: {scales, shown, marks, choices} (game.js); what follows from it: facts(g.state)
//   g.signal — aborts when the step is left: stop what it started (a sound's handle, a timer) on it
//   g.sound — the game's sounds (sound.js)
//   g.beds(levels) — the background from now on (bespoke.background): the beds of sound named at their levels, every
//     other one silent — the page changes it at once, over the music's crossfade. A scene's own goes with it (g.scene's
//     beds): changed at its cut, with its music. Unseen (a jump): kept for the scene the jump shows (j.background)
//   g.scene(folder, state, {cut, beds}) — that scene of the world, full-screen, its state on top of where it starts — and
//     under it what the play has decided, as this scene's keys (carry). It plays no beat until one is named: the
//     step's first beat goes in `state` ({beat: name}) — the scene opens playing it, its first frame the beat's own —
//     and g.beat(name) then takes it up (waits for its end). Always opened anew, even if it is the one on the screen.
//     cut: the scene before stays on the screen till this one is drawn, then gives way to it in one frame; else the
//     page fades (time has passed)
//   g.set(key, value, seconds) / g.get(key) — the shown scene's state
//   g.wait(ms) — time of the game's own (a pause); never to wait for something the scene does — that is an event:
//   g.told(text, ms) — until the scene tells `text` (→ true), or ms pass (→ false)
//   g.say(who, text, at) — someone of the game's people (people.json: bespoke.say) says it, over `at` ('id' | 'id#point'
//     of the scene; 'narrator' — low in the middle), in their voice; → a breath after it has been heard (unvoiced: once
//     it could be read)
//   g.choose(choice, {ref: options, …}) — the player presses one of the points ('id#point' | 'id'), then one of its
//     options ([{id, label}]: petals, one too — the language of mini-games, hub.offer); → the option's id, kept in
//     state.choices[choice] (choice null: not a choice of the chapter's map)
//   g.beat(name, {wait}) — a beat of the shown scene's film (the world's module `beats`); → once it has ended (the
//     scene tells 'beat:<name>'), or at once with wait: false. To wait for a moment inside a beat, make the g.told
//     before g.beat
//   g.play(minigame, opts) — a small game of the hands: a module of minigames/ — export default {title, about,
//     skipped, run: async (g, b, opts, signal) → its result}, made of the language of mini-games. The signal aborts
//     when it is skipped (the page's ⏭ → b.minigame.skip(): in a step the player has seen, or once SKIPPABLE s have
//     gone by in it — not to be stuck in it) or the step is left; → `skipped` then — a plain outcome, the same trace in
//     the story as one played. Not a way through: each minigame is passable. The chapter itself puts what it did into
//     the scene (game.md §4, “after the game”)
//   g.minigame({phrase, sample}) — inside a minigame's run: the language's mini-game begun (bespoke.minigame.start),
//     left when the signal aborts; the ⏭ skips the minigame
//   g.apply(choice) — what the option chosen does, by EFFECTS: the scale home, then lie, then each mark (game.md §3.1)
//   g.scale(name, delta) — a scale moves; the player sees which way (the gauge, the words)
//   g.gauge(name, {rule}) — the scale is shown from now on; its one line of what it means said once (rule: false — not
//     yet)
//   g.mark(key, value, text) — remembered (state.marks[key]); text — what the player is told; null — told nothing
//   g.title(text) — words over the scene, as a film's title; → once they have gone
//   g.done() → once the step's code is through: the page's ⏭ taken back; g.leave() — the step left behind (game.js)
// The page's ⏭ (bespoke.forward) is the step's while it is played ({forward}: whether the player has seen the step —
// game.js; none — a context of no step, a dry run's): where the step is seen, pressed, the step goes on at once to its
// next interaction — the next line said, choice, minigame, scene, beat it begins or title —, what is between done at
// once: its waits over, the line heard and those still to be said dropped, the scene in its instant mode
// (bespoke.instant: all it does ends at once, as it would — its beats run to their ends and tell what they tell on the
// way), shown in one cut as the interaction is reached. In a minigame the ⏭ skips it; while a choice is offered there
// is none.
// A step may be played up to a minigame unseen, without time (the author's map: a jump — jump.js j), or all through
// (a dry run): then nothing of it is said, shown or heard, and a minigame gives what j.result says, else its `skipped`.
import * as sounds from './sound.js';

// the world's scenes the game plays, by their folders (yard — “The Yard”: the background of the play's map, game.js)
export const SCENES = { platform: 'platform', street: 'street', home: 'home', hill: 'hillside',
  crossing: 'crossing', yard: 'yard' };

// The scales, each with two sides: where they start, their bounds, the side the player reads when they move (up:
// delta > 0, down: delta < 0), and the one line that says what they mean.
export const SCALES = {
  lie: { start: 0, min: -6, max: 9, up: tr('Lie'), down: tr('Truth'),
    rule: tr('Frost on the glass — how much untruth there is in the house.') },
  home: { start: 0, min: -4, max: 7, up: tr('Together'), down: tr('Apart'),
    rule: tr('Light in the window — whether the Sarafanovs hold together.') },
};
// What each option of each choice does: the scales, then the marks ([key, value, text | null]) — game.md §5
export const EFFECTS = {
  entry: { asked: { lie: 1 }, said: { lie: 2 } },
  galya: { remembered: { home: 1, lie: 1 }, never: { home: -1 } },
  box: { take: { home: 1, lie: 1 },
    refuse: { home: -1, lie: -1, marks: [['sarafanov', 'box', tr('Sarafanov will remember this.')]] } },
  dawn: { leave: { home: -1 }, stay: { home: 1, lie: 1 } },
  father: { approach: { home: 1, lie: 1 }, hide: {} },
  crossing: { truth: { lie: -2, marks: [['nina', 'knows', tr('Nina will remember this.')]] }, roar: { lie: -1 },
    brother: { home: 1, lie: 1, marks: [['nina', 'sister', tr('Nina will remember this.')]] } },
  kudimov: { let: { home: -1 },
    ask: { home: 1, lie: 1, marks: [['nina_stay', 'father', tr('Nina will remember this.')]] },
    for_me: { home: 1, marks: [['nina_stay', 'me', tr('Nina will remember this.')]] } },
  fire: { blame: { home: 1, lie: 1, marks: [['silva', 'grudge', null],
      ['vasenka', 'saved', tr('Silva and Vasenka will remember this.')]] },
    own_up: { lie: -1, marks: [['vasenka', 'confessed', tr('Vasenka will remember this.')]] } },
  truth: { self: { lie: -3 }, silent: { lie: -1 } },
  train: { stay: {}, go: {} },
};
export const ENDINGS = [
  { id: 'late', label: tr('Missed the Train') }, { id: 'saturday', label: tr('Saturday') },
  { id: 'anyway', label: tr('Anyway') }, { id: 'suitcase', label: tr('Suitcase') },
];

// What follows from the play so far — all a step reads of it besides g.state. A choice not made (its step skipped by
// the author) gives the value written here (game.md §5).
// (to the hundredth: a light, a frost — the scene's default is written as a plain number)
const clamp = x => Math.round(Math.min(1, Math.max(0, x)) * 100) / 100;
export function facts(state) {
  const c = state.choices, s = state.scales;
  const told = c.truth === 'silent' ? 'silva' : 'self';
  const train = c.train === 'go' ? 'go' : 'stay';
  // who comes to the platform for him (V.3): by “Together” — the whole family, his father, no one; and, whatever the
  // scale, those he himself bound with the truth — they know who he is: his father, if he told him himself; Nina, if
  // she knows it from him (the crossing); Vasenka, if he owned up himself (the fire)
  const came = s.home >= 3 ? 'family' : s.home >= 0 ? 'father' : 'none';
  const ninaIs = c.crossing === 'truth' ? 'knows' : c.crossing === 'brother' ? 'sister' : 'none';
  const fatherCame = came !== 'none' || told === 'self';
  const ninaCame = came === 'family' || ninaIs === 'knows';         // (“Not for Father's sake” is offered only then)
  const vasyaCame = came === 'family' || c.fire === 'own_up';
  const boxWhere = c.box === 'take' ? 'busygin' : 'cupboard';
  const boxHand = boxWhere === 'cupboard' && fatherCame && came !== 'family'; // at the carriage door — not before the whole family
  const hurt = told === 'silva' || s.lie > 1;                       // read after V.2 (the scale moved already)
  return {
    warm: clamp((s.home + 4) / 11),                    // 0 Apart … 1 Together
    frost: clamp((s.lie + 2) / 8),                     // 0 clear glass … 1 all frosted (translucent)
    entry: c.entry === 'said' ? 'said' : 'asked',      // who lied at the door
    boxWhere,                                          // 'cupboard' | 'busygin'
    ninaIs,                                            // 'knows' | 'sister' | 'none'
    secret: c.father === 'approach',                   // Busygin promised his father to keep quiet about the orchestra
    told,                                              // 'self' | 'silva'
    train,                                             // 'stay' | 'go'
    came,                                              // by “Together”: 'none' | 'father' | 'family'
    fatherCame, ninaCame, vasyaCame,                   // who stands on the platform's stairs (V.3) and comes home with him
    hurt,
    // the clarinet's phrase: 'now' — in the house at once; 'later' — in the epilogue, from afar; 'cut' — it breaks off,
    // as always. It resolves only where he stayed and someone came for him: at once where the house held together and
    // there was little untruth; later — after much untruth, or where only the truth brought them (the house cold all
    // evening: warmth after the truth comes later); he left, or no one came — it breaks off.
    tune: train === 'go' || !(fatherCame || ninaCame || vasyaCame) ? 'cut' : hurt || came === 'none' ? 'later' : 'now',
    silvaDoor: c.fire !== 'blame',
    vasenkaBy: c.fire === 'blame',
    suitcase: told === 'silva' && came !== 'none',
    boxHand,
    boxGone: train === 'go' && ((boxWhere === 'busygin' && told === 'silva') || boxHand), // the snuffbox went with him
    ninaEnd: c.kudimov === 'ask' || c.kudimov === 'for_me' ? 'home' : 'gone',
    ninaFor: c.kudimov === 'for_me',
    knocked: state.marks.knocked ?? '',                // the windows he knocked at (the result of “Windows”)
    vasyaEnd: c.fire === 'own_up' ? 'home' : 'taiga',
    ending: told === 'self' ? (train === 'stay' ? 'late' : 'saturday') : (train === 'stay' ? 'anyway' : 'suitcase'),
  };
}

// The play's facts (f) as a scene's own keys: what g.scene opens it with, under the step's state (game.md §5).
export function carry(folder, f) {
  return {
    [SCENES.platform]: { father_came: f.fatherCame ? 1 : 0, nina_came: f.ninaCame ? 1 : 0, vasya_came: f.vasyaCame ? 1 : 0,
      silva_door: f.silvaDoor ? 1 : 0, nina_is: f.ninaIs, suitcase: f.suitcase ? 1 : 0, box_hand: f.boxHand ? 1 : 0,
      warm: f.warm, frost: f.frost, vasya_end: f.vasyaEnd },
    [SCENES.street]: { warm: f.warm, frost: f.frost, nina_is: f.ninaIs, secret: f.secret ? 1 : 0,
      silva_door: f.silvaDoor ? 1 : 0, ending: f.ending, nina_end: f.ninaEnd, nina_for: f.ninaFor ? 1 : 0, knocked: f.knocked },
    [SCENES.home]: { warm: f.warm, frost: f.frost, box_where: f.boxWhere, vasenka_by: f.vasenkaBy ? 1 : 0,
      silva_door: f.silvaDoor ? 1 : 0, father_came: f.fatherCame ? 1 : 0, nina_came: f.ninaCame ? 1 : 0,
      vasya_came: f.vasyaCame ? 1 : 0, nina_end: f.ninaEnd, nina_for: f.ninaFor ? 1 : 0, vasya_end: f.vasyaEnd },
    [SCENES.hill]: {},
    [SCENES.crossing]: {},
    [SCENES.yard]: {},
  }[folder];
}

const BEAT = 180000; // a beat longer than this has not ended: the scene lacks it
const SKIPPABLE = 20000; // ms in a minigame of a step not seen yet before the ⏭ may skip it

export function context(b, view, hub, state, j = null, { forward = null } = {}) {
  const left = new AbortController(); // the step is left behind (game.js)
  const gone = () => left.signal.aborted;
  const never = new Promise(() => {});
  const alive = p => p.then(v => (gone() ? never : v));
  const unseen = () => j?.on;
  // the ⏭ pressed (fast: the step going on at once to its next interaction — land() there); the game's own waits going
  // ({timer, ok}): over at once as it is pressed
  let fast = false, choosing = false, showing = false;
  const waits = new Set();
  const sleep = ms => (gone() ? never : unseen() ? j.sleep(ms) : fast ? Promise.resolve() : new Promise(ok => {
    const w = { ok: () => gone() || ok() };
    w.timer = setTimeout(() => { waits.delete(w); w.ok(); }, ms);
    waits.add(w);
  }));
  const put = (key, value, seconds) => (unseen() ? j.did([key, value]) : b.set(key, value, seconds));
  let opening = null; // the beat the scene was opened with, till g.beat takes it up: {name, ended}
  let playing = null; // the minigame played now: {signal, end, skippable}
  // the page's ⏭ as the step stands now (a step's context only): none while a choice is offered or the step is still
  // unseen; in a minigame — its skip, where it may be skipped; else, where the step is seen, on to the next interaction
  const ahead = () => {
    if (forward == null || gone()) return;
    b.forward(choosing || unseen() ? null : playing ? (playing.skippable ? skip : null) : forward ? hurry : null);
  };
  const skip = () => { if (playing && !b.minigame.skip()) playing.end(); };
  function hurry() {
    if (gone() || fast || showing || playing || choosing || unseen()) return;
    fast = true;
    b.hush();
    b.instant(true);
    for (const w of waits) { clearTimeout(w.timer); w.ok(); }
    waits.clear();
  }
  // the next interaction reached: the scene as all it did meanwhile has left it, shown in one cut
  async function land() {
    if (!fast) return;
    fast = false;
    await b.instant(false);
  }
  // a jump at its minigame (or stuck before it: a choice the play didn't make): the scene where the step has got to
  // — and the step on from there, seen
  let seeing = null;
  const seen = () => (seeing ??= (async () => {
    const { shown, then } = j;
    for (const h of j.seen()) hub.told(h.text, h.ms).then(h.ok);
    view.gauge(state);
    if (shown) await alive(b.show(shown.folder, { state: shown.state, captions: false, then, background: j.background }));
    ahead();
  })());
  if (j && j.target < Infinity) j.idle.then(seen);
  // the time a line asks, once said: heard — a breath after; shown without a voice — as long as it takes to read it
  // (the page keeps it 1.5 s + 60 ms a letter from when it shows: speech.js)
  const after = ({ heard, text }) => sleep(heard ? 500 : 300 + text.length * 60);
  const g = {
    state,
    signal: left.signal,
    get sound() { return unseen() ? j.sounds : sounds; },
    beds(levels) {
      if (gone()) return;
      if (unseen()) j.background = levels; else b.background(levels);
    },
    async scene(folder, st = {}, { cut = false, beds } = {}) {
      if (gone()) return never;
      // (opened as it is to be: what the play has decided — those of its keys the scene has —, the beat it opens
      // with playing from its first frame)
      const spec = await alive(unseen() ? j.real(b.specOf(folder)) : b.specOf(folder));
      st = { ...Object.fromEntries(Object.entries(carry(folder, facts(state)) ?? {}).filter(([key]) => key in (spec.states ?? {}))), ...st };
      if (unseen()) {
        opening = typeof st.beat === 'string' ? { name: st.beat, ended: g.told(`beat:${st.beat}`, BEAT) } : null;
        if (beds) j.background = beds;
        j.scene(folder, st);
        return;
      }
      showing = true;
      try {
        if (fast) await alive(land());
        opening = typeof st.beat === 'string' ? { name: st.beat, ended: g.told(`beat:${st.beat}`, BEAT) } : null;
        hub.withdraw();
        await alive(b.show(folder, { state: st, captions: false, fade: !cut, background: beds }));
      } finally { showing = false; }
    },
    set: (key, value, seconds) => (gone() ? undefined : put(key, value, seconds)),
    get: key => (unseen() ? j.values[key] : b.get(key)),
    wait: sleep,
    async say(who, text, at = who) {
      if (gone()) return never;
      if (unseen()) return sleep(300 + text.length * 60);
      if (fast) await alive(land());
      return alive(b.say(who, text, { at })).then(after);
    },
    async choose(choice, offers) {
      if (gone()) return never;
      const offer = async () => {
        if (fast) await alive(land());
        choosing = true;
        ahead();
        try { return await alive(hub.offer(offers)); } finally { choosing = false; ahead(); }
      };
      // unseen: as the play chose it — else the first offered; one it chose that isn't here (the moment passed then):
      // offered once seen
      let action;
      if (unseen()) {
        const all = Object.values(offers).flat(), was = choice && state.choices[choice];
        action = !was ? all[0] : all.find(o => o.id === was) ?? (await new Promise(ok => j.later(() => offer().then(ok))));
      } else action = await offer();
      if (choice) state.choices[choice] = action.id;
      return action.id;
    },
    async beat(name, { wait = true } = {}) {
      if (gone()) return never;
      // (the beat the scene was opened with: playing already)
      const opened = opening?.name === name ? opening : null;
      opening = null;
      if (!opened && fast) await alive(land());
      const ended = opened ? opened.ended : wait ? g.told(`beat:${name}`, BEAT) : null;
      if (!opened) {
        put('beat', null); // (the same beat again is a change too)
        put('beat', name);
      }
      if (wait && !(await ended)) b.trouble(`the beat “${name}” did not end`);
    },
    told(text, ms = 60000) {
      return gone() ? never : unseen() ? j.heard(text, ms) : alive(hub.told(text, ms));
    },
    async play(minigame, opts = {}) {
      if (gone()) return never;
      if (unseen()) {
        j.plays.push(minigame);
        if (j.plays.length <= j.target) return j.result?.(minigame) ?? minigame.skipped;
        await seen();
      } else if (fast) await alive(land());
      // skipped — by the player (the page's ⏭ → b.minigame.skip(): g.minigame hears it; before the language's
      // mini-game is begun, the ⏭ ends it itself), by the step left — it ends with its `skipped`
      const stop = new AbortController();
      const end = () => stop.abort();
      left.signal.addEventListener('abort', end);
      const p = playing = { signal: stop.signal, end, skippable: !!forward };
      const may = forward ? 0 : setTimeout(() => { p.skippable = true; if (playing === p) ahead(); }, SKIPPABLE);
      ahead();
      const skipped = new Promise(ok => stop.signal.addEventListener('abort', () => ok(minigame.skipped)));
      try {
        return await alive(Promise.race([minigame.run(g, b, opts, stop.signal), skipped]));
      } finally {
        left.signal.removeEventListener('abort', end);
        clearTimeout(may);
        stop.abort();
        playing = null;
        ahead();
      }
    },
    minigame(o = {}) {
      if (!playing) throw new Error('g.minigame: only inside a minigame (g.play)');
      const mg = b.minigame.start({ ...o, signal: playing.signal });
      mg.on('skip', playing.end);
      return mg;
    },
    apply(choice) {
      if (gone()) return;
      const fx = EFFECTS[choice]?.[state.choices[choice]];
      if (!fx) return; // (the choice not made: its step was skipped)
      g.scale('home', fx.home ?? 0);
      g.scale('lie', fx.lie ?? 0);
      for (const [key, value, text] of fx.marks ?? []) g.mark(key, value, text);
    },
    scale(name, delta) {
      if (gone() || !delta) return;
      const S = SCALES[name];
      state.scales[name] = Math.min(S.max, Math.max(S.min, state.scales[name] + delta));
      state.shown[name] ||= 'bare'; // (a scale not seen yet: shown, its line still to come)
      if (unseen()) return;
      view.toast(delta > 0 ? S.up : S.down, 'scale', '↑'.repeat(Math.abs(delta)));
      view.gauge(state);
    },
    gauge(name, { rule = true } = {}) {
      if (gone()) return;
      if (rule && state.shown[name] !== true) {
        state.shown[name] = true;
        if (!unseen()) view.toast(SCALES[name].rule, 'rule');
      }
      state.shown[name] ||= 'bare';
      if (!unseen()) view.gauge(state);
    },
    mark(key, value, text) {
      if (gone()) return;
      state.marks[key] = value;
      if (text && !unseen()) view.toast(text, 'mark');
    },
    async title(text) {
      if (gone()) return never;
      if (fast) await alive(land());
      return unseen() ? sleep(9000) : alive(view.title(text, { signal: left.signal }));
    },
    async done() {
      await land();
      if (forward != null) b.forward(null);
    },
    // the step is left behind (game.js): nothing it offered or still had to say stays
    leave() {
      if (forward != null) b.forward(null);
      if (fast) { fast = false; b.instant(false); }
      left.abort();
      hub.withdraw();
      b.hush();
    },
  };
  ahead();
  return g;
}

// The player's choices and what the scenes tell and do, listened to once for the whole play (bespoke.on
// keeps a listener for good) — game.js owns it: whatever is being chosen now gets the action;
// whoever waits for a tell, a key set, a walk's end hears it.
//   hub.offer({ref: options}) → the action once the player has chosen it (what was offered before is dropped): a
//     plain choice of the language of mini-games — a mark on each point; a touch opens its options as petals, one
//     too (what is chosen is seen in words first), a petal pressed is chosen; one who touches no mark for SHOW s is
//     shown how: the ghost finger on each in turn
//   hub.ask(at, options) → the action chosen, or null: a mark of the plain choice born open where the game's own
//     drawing was pressed (at: fn → {x, y} page px — map.js), its options out as petals at once; a touch off them folds
//     it — null, the mark gone (nothing waits idle)
//   hub.withdraw() — nothing offered; hub.told(text, ms) → true once the scene tells it, false if ms pass
const SHOW = 8; // s: nothing pressed so long — the ghost shows how

export function listen(b) {
  let offered = null; // the plain choice going on: the language's mini-game
  // what the scene is waited to tell: {text, ok, timer} — heard, or ms gone by (the timer taken down either way)
  const waiting = new Set();
  const told = (text, ms) => new Promise(ok => {
    const w = { text, ok };
    w.timer = setTimeout(() => { if (waiting.delete(w)) ok(false); }, ms);
    waiting.add(w);
  });
  b.on('tell', text => {
    for (const w of waiting) if (w.text === text) { waiting.delete(w); clearTimeout(w.timer); w.ok(true); }
  });
  return {
    offer(offers) {
      offered?.leave();
      const mg = offered = b.minigame.start({ plate: false }), refs = Object.keys(offers), presses = [];
      // (the thing itself glows when it alone is offered: one breath in one place)
      if (refs.length === 1) mg.glow(refs[0].split('#')[0]);
      // (the play's clock: it stands with the pause)
      const ghost = setTimeout(() => mg.show({ gestures: presses }), SHOW * 1000);
      mg.on('end', () => clearTimeout(ghost));
      return new Promise(ok => {
        const chosen = (mark, action) => { mg.snap({ at: mark }); mg.leave(); offered = null; ok(action); };
        for (const ref of refs) {
          const options = offers[ref], mark = mg.mark({ at: ref.includes('#') ? ref : `${ref}@` });
          const press = mg.press({ on: mark, petals: options });
          press.on('down', () => clearTimeout(ghost));
          press.on('choose', ({ id }) => chosen(mark, options.find(o => o.id === id)));
          presses.push(press);
        }
      });
    },
    ask(at, options) {
      offered?.leave();
      const mg = offered = b.minigame.start({ plate: false });
      return new Promise(ok => {
        const over = action => { ok(action); mg.leave(); if (offered === mg) offered = null; };
        const mark = mg.mark({ at });
        // (where it was pressed is out of the frame: nothing to open)
        if (!mark.pos) { over(null); return; }
        const press = mg.press({ on: mark, petals: options, open: true });
        press.on('choose', ({ id }) => { mg.snap({ at: mark }); over(options.find(o => o.id === id)); });
        press.on('fold', () => over(null));
      });
    },
    withdraw() { offered?.leave(); offered = null; },
    told,
  };
}
