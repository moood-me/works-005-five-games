// What a chapter's steps play with: context(b, view, hub, state, j, {forward}) → g. Its state is a working copy — kept
// only once the step is done (game.js). A step left behind (the player went to the map: ☰) does nothing more and never
// ends: whatever it still calls returns a promise that never settles. What is this game's own: the notebook and the
// bag instead of scales, the stamps of who remembers, the medallion of whose step it is, the lines written in the
// notebook, the letter.
//   g.state — what the play carries: {hours, money, shown, marks, choices, hands, lines, log} (game.js); what follows from
//     it: facts(g.state)
//   g.signal — aborts when the step is left: stop what it started (a sound, a timer) on it
//   g.sound — the game's sounds (sound.js)
//   g.hero(who) — whose step it is: 'fogg' | 'pp' | 'both'; a change shows the medallion of his face for a moment
//   g.beds(levels, seconds) — the beds of sound: those named go to their level, every other one to nothing
//   g.scene(folder, state, {cut}) — that scene of the world, full-screen, its state on top of where it starts — and
//     under it what the play has decided, as this scene's keys (carry). It plays no beat until one is named: the
//     step's first beat goes in `state` ({beat: name}) — the scene opens playing it — and g.beat(name) then takes it
//     up (waits for its end). The one on the screen already is not opened anew: its keys are set and the beat cut to.
//     cut: the scene before stays till this one is drawn, then gives way in one frame; else the page fades (time has
//     passed)
//   g.set(key, value, seconds) / g.get(key) — the shown scene's state (seconds: it goes there smoothly)
//   g.wait(ms) — time of the game's own (a pause); never to wait for something the scene does — that is an event:
//   g.told(text, ms) — until the scene tells `text` (→ true), or ms pass (→ false)
//   g.say(who, text, at) — someone of the game's people (people.json: bespoke.say) says it, over `at` ('id' |
//     'id#point'; 'narrator' — low in the middle), in their voice; → a breath after it has been heard (unvoiced: once it
//     could be read)
//   g.choose(choice, {ref: options, …}, {show}) — the player presses one of the points, then one of its options ([{id,
//     label}]: petals, one too); → the option's id, kept in state.choices[choice] (null: not on the chapter's map);
//     show — s before the ghost shows how (the play's first press: at once)
//   g.beat(name, {wait}) — a beat of the shown scene's film (module `beats`); → once it has ended ('beat:<name>'),
//     or at once with wait: false; a beat the scene has not ('beat-unknown:<name>') — an error at once: the step
//     breaks (with wait: false — said). To wait for a moment inside a beat, make the g.told before g.beat. A cut to a beat
//     that is neither the next in the scene's table nor one that goes on from the one before: named ahead in the key
//     `beat_next` (g.set), so that its first frame is ready
//   g.play(minigame, opts) — a minigame of minigames/ ({file, title, about, skipped, run(g, b, opts, signal)}). The
//     signal aborts when it is skipped (the page's ⏭ → b.minigame.skip(): in a step the player has seen, or once
//     SKIPPABLE s have gone by in it — not to be stuck in it) or the step is left; → `skipped` then — the plain good
//     outcome, the same trace in the story as one played. Its result is kept in g.state.hands[minigame.file]
//   g.minigame({phrase, sample}) — inside a minigame's run: the language's mini-game begun, left when it ends
//   g.hint(text, afterMs) → off() — one line low in the middle (not in a minigame)
//   g.hours(delta, line) — the time in hand moves by delta hours: the old figure struck out in the notebook, the new
//     written, and an entry of it — the change and `line`, what it was for ('The Mongolia: two days early') — kept with
//     the play (state.log, the last LOG): a step played again writes its own, not one more
//   g.money(delta) — the carpet-bag moves by delta £: the notes fly
//   g.gauge('hours' | 'money') — the notebook / the bag shown from now on; its one line of what it means said once
//   g.relate(who, delta) — 'aouda' | 'fix' | 'pp' remembers (state.marks[who] += delta); the stamp «… will remember
//     this» (REMEMBERS)
//   g.mark(key, value, text) — remembered (state.marks[key]); text — a stamp, if any
//   g.book(line, hand, hours) — the line BOOK[line] is written in the notebook by `hand` ('aouda' | 'pp' | 'fogg'), and
//     with it the figure moves by `hours`, if any (the line is that change's entry — no other is written): Aouda's
//     or Passepartout's — once the player has given it (touched it: it glows, a hint says who asks for it); Fogg's — at
//     once; it stays there (state.lines: {line, hand} — its name, not its text)
//   g.letter({text, sign, kind, voice}) — a sheet the player unfolds, reads and folds again (ui.js)
//   g.title(text) — words over the scene, as a title of the old edition; → once they have gone
//   g.done() → once the step's code is through: the page's ⏭ taken back; g.leave() — the step left behind (game.js)
// The page's ⏭ (bespoke.forward) is the step's while it is played ({forward}: whether the player has seen the step —
// game.js; none — a context of no step, a dry run's): where the step is seen, pressed, the step goes on at once to its
// next interaction — the next line said, choice, minigame, scene, beat it begins, title, the notebook given or a letter
// —, what is between done at once: its waits over, the line heard and those still to be said dropped, the scene in its
// instant mode (bespoke.instant: all it does ends at once, as it would — its beats run to their ends and tell what they
// tell on the way), shown in one cut as the interaction is reached. In a minigame the ⏭ skips it; while a choice is
// offered there is none.
// A step may be played up to a minigame unseen, without time (the author's map: a jump — jump.js j), or all through
// (a dry run): then nothing of it is said, shown or heard, and a minigame gives what j.result says, else its `skipped`.
import * as sounds from './sound.js';

// the world's scenes the game plays, by their folders (map — «The route»: the background of the play's map, game.js)
export const SCENES = { club: 'main', row: 'saville-row', train: 'train-window', deck: 'deck', jungle: 'jungle',
  harbour: 'harbour', sea: 'sea', prairie: 'prairie', map: 'route' };


// The minigames by their files (game.md §7): a minigame's result is kept under its `file`
export const HANDS = ['ten-minutes', 'bargain', 'elephant', 'like-the-dead', 'dash', 'stay-awake', 'typhoon', 'pyramid', 'coupling',
  'sail', 'boilers', 'cab'];
const handsOf = m => (HANDS.includes(m?.file) ? m.file : null);

// The notebook and the bag: where they start, the one line of what each means (said once, when it appears)
export const START = { hours: 0, money: 20000 };
export const RULES = {
  money: tr('The carpet-bag: money for the road. It buys time.'),
  hours: tr('The notebook: time in hand against the timetable. Everything unforeseen is paid out of it.'),
};
// the stamp of who remembers (g.relate)
export const REMEMBERS = { aouda: tr('Aouda will remember this'), fix: tr('Fix will remember this'), pp: tr('Passepartout will remember this') };
// the lines written in the notebook (g.book), by their names; who asks for it to write one
export const BOOK = { cousin: tr('Hong Kong. Cousin Jeejeeh'), day: tr('+1 day: we travelled towards the sun!') };
const ASKS = { aouda: tr('Aouda asks for the notebook: touch it to give it to her'), pp: tr('Passepartout asks for the notebook: touch it to give it to him') };
export const ENDINGS = [
  { id: 'door', label: tr('Here I am, gentlemen') }, { id: 'friday', label: tr('On time') },
  { id: 'lost', label: tr('Lost — and won') }, { id: 'sunday', label: tr('Two Wednesdays') },
];
// the parts of the Henrietta as «The boilers» burns them (game.md §7.11): the cabin last
export const PARTS = ['deckhouse', 'boats', 'bunks', 'yards', 'mast_fore', 'mast_main', 'bulwarks', 'speedy_cabin'];
export const PART_PRICE = 1500, PART_HOURS = 1.5;

// What follows from the play so far — all a step reads of it besides g.state. A choice not made (its step skipped by
// the author) reads as written here (Verne's own way where there is one).
export function facts(state) {
  const c = state.choices, m = state.marks ?? {}, h = state.hands ?? {};
  const aouda = c.aouda === 'holland' ? 'holland' : 'with';
  const pp = c.fort === 'pay' && h.sail && h.sail.caught === false ? 'omaha' : 'with';
  const forgiven = c.liverpool === 'hand';
  const opener = aouda === 'with' && (m.aouda ?? 0) >= 2 ? 'aouda' : forgiven && (m.fix ?? 0) >= 2 ? 'fix' : null;
  // the notebook's hours as they were before the day won from the sun was written in (marks.day: +24 in it)
  const hours = m.day ? state.hours - 24 : state.hours;
  const gained = hours < 0 && opener ? hours + 24 : hours; // the day won from the sun, once someone finds it
  const ending = hours >= 0 ? 'friday' : !opener ? 'sunday' : gained < 0 || h.cab?.late ? 'lost' : 'door';
  return {
    aouda, pp, opener, forgiven, ending,
    gas: !!m.gas,                                   // the attic's gas burns all the way («Ten minutes»)
    sati: c.sati ?? 'night',
    guideHome: c.sati !== 'road',                   // the guide may go home (not recognised on the road)
    kiouni: c.kiouni ?? 'gift',
    fixAboard: true,                                // Fix goes on with them always (Verne): taken on the boat or caught up
    bruise: !!m.bruise,
    wings: !!m.wings,
    fixLevel: m.fix ?? 0, aoudaLevel: m.aouda ?? 0, ppLevel: m.pp ?? 0,
    ppStays: (m.pp ?? 0) >= 2,
    henrietta: c.henrietta ?? 'burn',
    cabin: h.boilers ? !h.boilers.burned?.includes('speedy_cabin') : false,
    hours, gained,
  };
}

// The play's facts (f) as a scene's own keys: what g.scene opens it with, under the step's state — each scene the ones
// of who may be there or not (scenes.md «Common»): Aouda (with them from the suttee on, unless she went to Holland), her
// travelling dress (from Hong Kong on), Passepartout (unless he stayed behind at Omaha), Fix (with them from the
// Tankadere on), his bruise, Passepartout's wings (only where the step says: Yokohama, the General Grant); the gas in
// the attic. «The route», the map, is opened by game.js with its own.
export function carry(folder, f, state) {
  const after = k => k in (state?.choices ?? {});
  const aouda = f.aouda === 'with' && after('sati') ? 1 : 0, pp = f.pp === 'with' ? 1 : 0, fix = after('boat') ? 1 : 0;
  const dress = after('aouda') ? 1 : 0, bruise = f.bruise ? 1 : 0;
  const boat = state?.choices?.boat === 'take' ? 1 : 0; // (Fix on the Tankadere: only if taken; he catches up after)
  return {
    [SCENES.club]: { with_aouda: aouda, with_pp: pp, with_fix: fix },
    [SCENES.row]: { with_aouda: aouda, with_pp: pp, gas: f.gas ? 1 : 0 },
    [SCENES.train]: { with_aouda: aouda, with_pp: pp, with_fix: fix, aouda_dress: dress, fix_bruise: bruise },
    [SCENES.deck]: { with_aouda: aouda, with_pp: pp, with_fix: fix, aouda_dress: dress, fix_bruise: bruise, pp_wings: 0 },
    [SCENES.jungle]: {},
    [SCENES.harbour]: { with_aouda: aouda, with_fix: fix, aouda_dress: dress },
    [SCENES.sea]: { with_aouda: aouda, with_fix: boat, aouda_dress: dress, fix_bruise: bruise },
    [SCENES.prairie]: { with_aouda: aouda, with_fix: fix, aouda_dress: dress, fix_bruise: bruise },
    [SCENES.map]: {},
  }[folder];
}

// how the notebook writes hours: '+2 d 6 h', '−20 h', 'on time' (the numbers as the play's language writes them)
export function hoursText(h) {
  const r = Math.round(h * 2) / 2;
  if (!r) return tr('on time');
  const a = Math.abs(r), d = Math.floor(a / 24), rest = a - d * 24;
  const t = [d ? tr('{d} d', { d }) : '', rest ? tr('{h} h', { h: rest.toLocaleString(tr.lang) }) : ''].filter(Boolean).join(' ');
  return `${r > 0 ? '+' : '−'}${t}`;
}
// the bag's sum, its thousands apart as the play's language writes them (a space — a narrow one)
export const moneyText = m => tr('£{sum}', { sum: Math.round(m).toLocaleString(tr.lang).replace(/\s/g, ' ') });

const LOG = 3; // the notebook's entries kept
const BEAT = 180000; // a beat longer than this has not ended
const UNKNOWN = 'unknown'; // a beat the scene has not
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
  state.hands ??= {};
  let hero = 'both'; // whose scene it is
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
    view.gauges(state);
    if (shown) await alive(b.show(shown.folder, { state: shown.state, captions: false, then }));
    ahead();
  })());
  if (j && j.target < Infinity) j.idle.then(seen);
  // the time a line asks, once said: heard — a breath after; shown without a voice — as long as it takes to read it
  // (the page keeps it 1.5 s + 60 ms a letter from when it shows: speech.js)
  const after = ({ heard, text }) => sleep(heard ? 500 : 300 + text.length * 60);
  // a beat's end: 'beat:<name>' told → true; the scene has no such beat (the module beats tells 'beat-unknown:<name>' at
  // once) → UNKNOWN; neither within BEAT ms → false. Unseen, a dry run's: its end is heard
  const ending = name => (gone() ? never : unseen() ? j.heard(`beat:${name}`, BEAT)
    : alive(hub.told([`beat:${name}`, `beat-unknown:${name}`], BEAT)).then(t => (t === `beat-unknown:${name}` ? UNKNOWN : !!t)));
  // a minigame's result kept where the story reads it (game.md §2)
  const keepHands = (minigame, result) => {
    const name = handsOf(minigame);
    if (!name) { b.trouble(`minigame “${minigame?.title}”: its file is not in HANDS (story.js)`); return result; }
    state.hands[name] = result && typeof result === 'object' ? structuredClone(result) : result;
    return result;
  };
  const g = {
    state,
    signal: left.signal,
    get sound() { return unseen() ? j.sounds : sounds; },
    hero(who) {
      if (gone()) return;
      const was = hero;
      hero = who;
      if (unseen()) return;
      view.gauges(state);
      if (who !== was && who !== 'both') view.hero(who);
    },
    beds(levels, seconds = 2) {
      if (!gone()) g.sound.beds(levels, seconds);
    },
    async scene(folder, st = {}, { cut = false } = {}) {
      if (gone()) return never;
      // (opened as it is to be: what the play has decided — those of its keys the scene has —, the beat it opens
      // with playing from its first frame)
      const spec = await alive(unseen() ? j.real(b.specOf(folder)) : b.specOf(folder));
      st = { ...Object.fromEntries(Object.entries(carry(folder, facts(state), state) ?? {}).filter(([key]) => key in (spec.states ?? {}))), ...st };
      if (unseen()) {
        opening = typeof st.beat === 'string' ? { name: st.beat, ended: ending(st.beat) } : null;
        j.scene(folder, st);
        return;
      }
      showing = true;
      try {
        if (fast) await alive(land());
        opening = typeof st.beat === 'string' ? { name: st.beat, ended: ending(st.beat) } : null;
        hub.withdraw();
        // (the scene on the screen already: not opened again — its making ready would be a wait with nothing to see —,
        // its keys set and the beat cut to)
        if (b.spec === spec) {
          for (const [key, value] of Object.entries(st)) if (key !== 'beat') b.set(key, value);
          if (opening) { b.set('beat', null); b.set('beat', opening.name); }
        } else await alive(b.show(folder, { state: st, captions: false, fade: !cut }));
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
    async choose(choice, offers, { show } = {}) {
      if (gone()) return never;
      const offer = async () => {
        if (fast) await alive(land());
        choosing = true;
        ahead();
        try { return await alive(hub.offer(offers, { show })); } finally { choosing = false; ahead(); }
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
      const ended = opened ? opened.ended : ending(name);
      if (!opened) {
        put('beat', null); // (the same beat again is a change too)
        put('beat', name);
      }
      if (!wait) { ended.then(how => { if (how === UNKNOWN) b.trouble(`the scene has no beat “${name}”`); }); return; }
      const how = await ended;
      // (a beat the scene has not: the step breaks at once — game.js says it and passes it)
      if (how === UNKNOWN) throw new Error(`the scene has no beat “${name}”`);
      if (!how) b.trouble(`the beat “${name}” did not end`);
    },
    told(text, ms = 60000) {
      return gone() ? never : unseen() ? j.heard(text, ms) : alive(hub.told(text, ms));
    },
    async play(minigame, opts = {}) {
      if (gone()) return never;
      if (unseen()) {
        j.plays.push(minigame);
        if (j.plays.length <= j.target) return keepHands(minigame, j.result?.(minigame) ?? minigame.skipped);
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
        return keepHands(minigame, await alive(Promise.race([minigame.run(g, b, opts, stop.signal), skipped])));
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
    hint(text, afterMs = 0) {
      if (gone() || unseen() || playing) return () => {};
      const off = view.hint(text, afterMs);
      left.signal.addEventListener('abort', off);
      return off;
    },
    hours(delta, line) {
      if (gone() || !delta) return;
      const was = state.hours;
      state.hours = Math.round((state.hours + delta) * 2) / 2;
      state.log = [...(state.log ?? []), { d: state.hours - was, line: line ?? '' }].slice(-LOG);
      if (!unseen()) view.hours(state, was);
    },
    money(delta) {
      if (gone() || !delta) return;
      const was = state.money;
      state.money = Math.max(0, Math.round(state.money + delta));
      if (!unseen()) view.money(state, was);
    },
    gauge(name) {
      if (gone() || state.shown[name]) return;
      state.shown[name] = true;
      if (unseen()) return;
      view.gauges(state);
      view.toast(RULES[name], 'rule');
    },
    relate(who, delta) {
      if (gone() || !delta) return;
      state.marks[who] = (state.marks[who] ?? 0) + delta;
      if (!unseen()) view.toast(REMEMBERS[who], delta > 0 ? 'stamp' : 'stamp cold');
    },
    mark(key, value, text) {
      if (gone()) return;
      state.marks[key] = value;
      if (text && !unseen()) view.toast(text, 'stamp');
    },
    // the player gives the notebook (touches it): the line is written in the hand given; it stays
    async book(line, hand, hours = 0) {
      if (gone()) return never;
      state.lines = [...(state.lines ?? []), { line, hand }];
      const was = state.hours;
      state.hours = Math.round((state.hours + hours) * 2) / 2;
      if (unseen()) return;
      if (fast) await alive(land());
      if (hand !== 'fogg') {
        const off = g.hint(ASKS[hand]);
        await alive(view.giveBook({ signal: left.signal }));
        off();
      }
      view.gauges(state);
      if (hours) view.hours(state, was);
      await sleep(2500);
    },
    // (its voice is said while it lies open — not waited for: the player folds it when they will)
    async letter(letter) {
      if (gone()) return never;
      if (unseen()) return;
      if (fast) await alive(land());
      const { voice, ...sheet } = letter;
      return alive(view.letter(sheet, { signal: left.signal, onOpen: () => { if (voice && !gone()) voice(); } }));
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

// The player's choices and what the scenes tell, listened to once for the whole play (bespoke.on keeps a listener for
// good) — game.js owns it: whatever is being chosen now gets the action; whoever waits for a tell hears it.
//   hub.offer({ref: options}, {show}) → the action once the player has chosen it (what was offered before is
//     dropped): a plain choice of the language of mini-games — a mark on each point; a touch opens its options as
//     petals, one too (what is chosen is seen in words first), a petal pressed is chosen; one who touches no mark for
//     `show` s (SHOW) is shown how: the ghost finger on each in turn. Under each mark, from the start, the words of
//     its options (the game's own label over the scene, following its point): what each choice means is read before
//     a touch. None of its points to be seen anywhere for
//     NOWHERE s (the scene lacks them, or draws nothing there) — an error: the step breaks (game.js passes it, said),
//     not a play standing still with nothing to press
//   hub.ask(at, options) → the action chosen, or null: a mark of the plain choice born open where the game's own
//     drawing was pressed (at: fn → {x, y} page px — map.js), its options out as petals at once; a touch off them folds
//     it — null, the mark gone (nothing waits idle)
//   hub.withdraw() — nothing offered; hub.told(text | [texts], ms) → true once the scene tells it (of several: the one
//     told first), false if ms pass
const SHOW = 8; // s: nothing pressed so long — the ghost shows how
const LABEL = 34, EDGE = 8; // px: a mark's words this far under its point (below the ring); never nearer the window's side
const NOWHERE = 6; // s: a choice none of whose points has been seen so long is broken

export function listen(b) {
  let offered = null; // the plain choice going on: the language's mini-game
  // what the scene is waited to tell: {text, ok, timer} — heard, or ms gone by (the timer taken down either way)
  const waiting = new Set();
  const told = (text, ms) => new Promise(ok => {
    const w = { texts: [text].flat(), ok: t => ok(Array.isArray(text) ? t : true) };
    w.timer = setTimeout(() => { if (waiting.delete(w)) ok(false); }, ms);
    waiting.add(w);
  });
  b.on('tell', text => {
    for (const w of waiting) if (w.texts.includes(text)) { waiting.delete(w); clearTimeout(w.timer); w.ok(text); }
  });
  return {
    offer(offers, { show = SHOW } = {}) {
      offered?.leave();
      const mg = offered = b.minigame.start({ plate: false }), refs = Object.keys(offers), presses = [];
      // (the thing itself glows when it alone is offered: one breath in one place)
      if (refs.length === 1) mg.glow(refs[0].split('#')[0]);
      // (the play's clock: it stands with the pause)
      const ghost = setTimeout(() => mg.show({ gestures: presses }), show * 1000);
      const marks = [];
      // (each mark's words under it, as long as the choice is offered)
      const labels = refs.map(ref => {
        const el = document.createElement('p');
        el.className = 'card choice-label';
        el.textContent = offers[ref].map(o => o.label).join(' · ');
        el.hidden = true;
        b.layer.append(el);
        return { el, ref };
      });
      const placing = b.onFrame(() => {
        for (const { el, ref } of labels) {
          const p = b.where(ref);
          el.hidden = !p?.seen;
          if (!p?.seen) continue;
          // (under the mark, but all of it within the window: EDGE px from its sides)
          const w = el.offsetWidth, x = Math.min(Math.max(p.x, w / 2 + EDGE), b.layer.clientWidth - w / 2 - EDGE);
          el.style.transform = `translate(${Math.round(x)}px, ${Math.round(p.y + LABEL)}px) translate(-50%, 0)`;
        }
      });
      mg.on('end', () => { placing(); for (const { el } of labels) el.remove(); });
      let looked = 0;
      mg.on('end', () => { clearTimeout(ghost); clearInterval(looking); });
      // (looked at twice a second: a point seen even once — the choice stands)
      const looking = setInterval(() => {
        if (marks.some(m => m.pos)) clearInterval(looking);
        else if (++looked >= NOWHERE * 2) {
          clearInterval(looking);
          mg.leave();
          if (offered === mg) offered = null;
          nowhere(new Error(`the choice's points are nowhere to be seen: ${refs.join(', ')}`));
        }
      }, 500);
      let nowhere;
      return new Promise((ok, no) => {
        nowhere = no;
        const chosen = (mark, action) => { mg.snap({ at: mark }); mg.leave(); offered = null; ok(action); };
        for (const ref of refs) {
          const options = offers[ref], mark = mg.mark({ at: ref.includes('#') ? ref : `${ref}@` });
          marks.push(mark);
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
