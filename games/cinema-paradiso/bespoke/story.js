// What a chapter's steps play with: context(b, view, hub, state, j, {forward}) → g. Its state is a working copy — kept
// only once the step is done (game.js). A step left behind (the player went to the map: ☰) does nothing more and never
// ends: whatever it still calls returns a promise that never settles.
//   g.state — what the play carries: {scales, shown, marks, choices, hands} (game.js); what follows from it: facts(g.state)
//   g.signal — aborts when the step is left: stop what it started (a sound, a timer) on it
//   g.sound — the game's sounds (sound.js)
//   g.hero(who) — whose scene it is: 'toto' | 'alfredo' | 'both' — the hero's scale in full, the other one at a third
//   g.beds(levels, seconds) — the beds of sound: those named go to their level, every other one to nothing
//   g.scene(title, state, {cut}) — that scene of the world, full-screen, its state on top of where it starts — and
//     under it what the play has decided, as this scene's keys (carry). It plays no beat until one is named: the
//     step's first beat goes in `state` ({beat: name}) — the scene opens playing it, its first frame the beat's own —
//     and g.beat(name) then takes it up (waits for its end). cut: the scene before stays on the screen till this one
//     is drawn, then gives way to it in one frame; else the page fades (time has passed)
//   g.set(key, value, seconds) / g.get(key) — the shown scene's state; g.move(key, value, seconds, ease) — the key
//     moved by the scene's director: → once it is there
//   g.wait(ms) — time of the game's own (a pause, a toast); never to wait for something the scene does — that is
//     an event of the scene's:
//   g.told(text, ms) — until the scene tells `text` (→ true), or ms pass (→ false)
//   g.when(key, test, ms) — until the scene sets the key (a value set, or moved: where it goes, as the move begins) to
//     one that test(value) holds for (a value: that one) (→ true), or ms pass (→ false)
//   g.arrived(who, ms) — until someone's walk in the scene ends there (→ true), or ms pass (→ false)
//   g.watch(key, fn) — fn(value, old) each time the scene sets the key, till the step is left
//   g.spot(ref) — where a point of the scene ('id' | 'id#point') is on the screen: {x, y} in frame heights from the
//     frame's middle (x to the right, y down); asked each frame till the scene answers, for a second — else null
//   g.say(who, text, at) — someone of PEOPLE says it, over `at` ('id' | 'id#point' of the scene; 'narrator' — low in
//     the middle), in their voice; → a breath after it has been heard (unvoiced: once it could be read)
//   g.choose(choice, {ref: options, …}) — the player presses one of the points ('id#point' | 'id': where the element
//     is pressed), then one of its options ([{id, label}]: petals, one too — seen in words, pressed); → the option's
//     id, kept in state.choices[choice] (choice null: not a choice of the chapter's map). One who doesn't press is
//     shown how (hub.offer). g.withdraw() — what is offered is taken back
//   g.beat(name, {wait}) — a beat of the shown scene's film (the world's module `beats`); → once it
//     has ended (the scene tells 'beat:<name>'), or at once with wait: false. To wait for a moment inside a beat,
//     make the g.told / g.when / g.arrived before g.beat
//   g.play(minigame, opts) — a small game of the hands: a module of minigames/ — export default {title, about,
//     skipped, run: async (g, b, opts, signal) → its result}, made of the language of mini-games (bespoke.minigame:
//     moood/docs/agents/minigames.md). The signal aborts when it is skipped (the page's ⏭ →
//     b.minigame.skip(): in a step the player has seen, or once SKIPPABLE s have gone by in it — not to be stuck in it)
//     or the step is left: it stops; → `skipped` then. Not a way through: each minigame is passable. `skipped` reads
//     as played — a plain good outcome a play gives, so a skipped minigame leaves in the story the same trace as one
//     played.
//     **Its result is kept in g.state.hands[<the minigame's file name>]** (game.md §3.6: 'skleyka', 'sto-nochey'…) —
//     the name is the module's `file` field if it has one, else its `title` looked up in HANDS below (the titles of
//     game.md §7, letter for letter): a minigame needs nothing more than its §7 title
//   g.minigame({phrase, sample}) — inside a minigame's run: the language's mini-game begun (bespoke.minigame.start),
//     left when the signal aborts; the ⏭ skips the minigame
//   g.hint(text, afterMs) → off() — one line low in the middle (not in a minigame: the language prompts there)
//   g.scale(name, delta) — a scale moves; the player sees which way (the gauge, the words)
//   g.gauge(name, {rule}) — the scale is shown from now on; its one line of what it means said once (rule: false —
//     not yet)
//   g.mark(key, value, text) — remembered (state.marks[key]); text — what the player is told, if any
//   g.letter({text, sign, kind, voice}) — a sheet the player unfolds, reads and folds again (ui.js); kind: 'note' (a
//     calendar's leaf, pencil), 'letter' (a ruled sheet, ink), 'envelope' (an envelope, its stamp the text); voice — a
//     function said while it lies open (() => g.say(…)); → once it is folded and gone: the chapter waits for it
//   g.title(text) — words over the scene, as a film's title; → once they have gone
//   g.done() → once the step's code is through: the page's ⏭ taken back; g.leave() — the step left behind (game.js)
// The page's ⏭ (bespoke.forward) is the step's while it is played ({forward}: whether the player has seen the step —
// game.js; none — a context of no step, the map's or a dry run's): where the step is seen, pressed, the step goes on at
// once to its next interaction — the next line said, choice, minigame, scene, beat it begins, letter or title —, what
// is between done at once: its waits over, the line heard and those still to be said dropped, the scene in its instant
// mode (bespoke.instant: all it does ends at once, as it would — its beats run to their ends and tell what they tell on
// the way), shown in one cut as the interaction is reached. In a minigame the ⏭ skips it; while a choice is offered
// there is none.
// A step may be played up to a minigame unseen, without time (the author's map: a jump — jump.js j), or all through
// (a dry run): then nothing of it is said, shown or heard, and a minigame gives what j.result says, else its `skipped`.
import * as sounds from './sound.js';

export const SCENES = { square: 'Площадь', booth: 'Будка', hall: 'Зал', home: 'Дом Ди Вита', quay: 'Пристань',
  station: 'Вокзал', rome: 'Просмотровый зал', strip: 'Плёнка' };

// the minigames by their titles (game.md §7) → the file name their result is kept under (g.state.hands)
export const HANDS = { 'Подглядывать': 'podglyadyvat', 'Склейка': 'skleyka', 'Буквы': 'bukvy', 'Заправка': 'zapravka',
  'Луч': 'luch', 'Вытащить': 'vytaschit', 'Камера': 'kamera', 'Сто ночей': 'sto-nochey', 'Смена': 'smena',
  'Записка': 'zapiska', 'Лента': 'lenta' };
const handsOf = m => m?.file ?? HANDS[m?.title];

// who speaks: the sound service's voice, how it says it, who it is (game.md §8)
export const PEOPLE = {
  narrator: { voice: 'Iapetus', how: 'негромко, тепло, чуть с усмешкой, как вспоминают давнее — без нажима', name: 'Сальваторе вспоминает' },
  salvatore: { voice: 'Iapetus', how: 'взрослый мужчина: сдержанно, устало, коротко', name: 'Сальваторе, сорок семь лет' },
  toto_boy: { voice: 'Puck', how: 'мальчик восьми–десяти лет: бойко, звонко, хитро', name: 'Тото, мальчик' },
  toto: { voice: 'Achird', how: 'юноша: горячо, просто, немного смущённо', name: 'Тото, семнадцать–восемнадцать лет' },
  alfredo: { voice: 'Algenib', how: 'низко, хрипловато, ворчливо и нежно; сицилийский выговор', name: 'Альфредо, киномеханик' },
  maria: { voice: 'Achernar', how: 'молодая вдова: резко, устало, с надрывом', name: 'Мария, мать Тото' },
  maria_old: { voice: 'Sulafat', how: 'старая женщина: тихо, ровно, без жалобы', name: 'Мария, мать, через тридцать лет' },
  elena: { voice: 'Leda', how: 'девушка: живо, светло, немного дерзко; письма — тихо, как читают про себя', name: 'Елена, семнадцать лет' },
  elena_grown: { voice: 'Vindemiatrix', how: 'женщина: спокойно, низко, с улыбкой и грустью', name: 'Елена, сорок семь лет' },
  adelfio: { voice: 'Charon', how: 'старый священник: строго, в нос, с досадой', name: 'отец Адельфио' },
  madman: { voice: 'Fenrir', how: 'сумасшедший: громко, нараспев, радостно', name: 'сумасшедший с площади' },
  madman_old: { voice: 'Fenrir', how: 'тот же, старый: хрипло, нараспев', name: 'сумасшедший с площади, старый' },
  anna: { voice: 'Gacrux', how: 'старая вдова: тихо, просто, по-деревенски', name: 'Анна, вдова Альфредо' },
  banker: { voice: 'Orus', how: 'сухо, властно, громко', name: 'отец Елены' },
  crowd: { voice: 'Sadachbia', how: 'толпа кричит: несколько голосов, громко, весело или испуганно', name: 'люди на площади' },
};

// The scales, each with two sides: where they start, their bounds, the side the player reads when they move (up:
// delta > 0, down: delta < 0), and the one line that says what they mean.
export const SCALES = {
  toto: { start: 0, min: -5, max: 5, up: 'Кино', down: 'Люди',
    rule: 'Луч ярче — Тото живёт кино. Окна теплее — Тото живёт людьми.' },
  alfredo: { start: 0, min: -3, max: 3, up: 'Держать', down: 'Отпустить',
    rule: 'Катушка: держит Альфредо мальчика при себе — или отпускает в большую жизнь.' },
};
export const ENDINGS = [
  { id: 'turn', label: 'Пусть останется' }, { id: 'note', label: 'Записка' }, { id: 'letters', label: 'Письма' },
];

// What follows from the play so far — all a step reads of it besides g.state. A choice not made (its step skipped by
// the author) gives the value written here (game.md §5).
export function facts(state) {
  const c = state.choices, t = state.scales.toto, a = state.scales.alfredo, elena = c.elena ?? 'future';
  const girl = c.girl ?? 'let', h = state.hands ?? {};
  return {
    seen: h.podglyadyvat?.seen ?? 3,                     // I.2: Р07 (≥ 2) или Р128
    slips: h.zapravka?.slips ?? 0,                       // II.1: кадр дрожит в `motor` (`stutter`)
    jumps: h.skleyka?.jumps ?? 0,                        // кривые склейки: «Лента», Рим
    slate: h.bukvy?.crooked ?? '00000000',               // доска с его буквами в будке 1988 года
    share: h.kamera?.share ?? 1,                         // сколько её в его плёнке (V.2)
    missed: h.smena?.missed ?? 0,                        // IV.2: Р129
    letter: elena === 'truth',                           // её письмо в руке Тото на пристани (IV.5)
    kino: t > 0,                                         // ответ матери в V.2, мать на сносе
    warm: Math.min(1, Math.max(0, (5 - t) / 10)),        // 0 Кино … 1 Люди
    hold: a > 0,                                         // слова вдовы в V.4
    alfredoHere: c.booth === 'hold',
    frame: c.frame === 'take',
    reel8: c.camera === 'film',
    elena,                                               // 'truth' | 'future'
    ending: girl === 'let' ? 'turn' : elena === 'future' ? 'note' : 'letters',
    knows: girl === 'follow' && elena === 'future',
    place: c.funeral === 'apart' ? 'apart' : 'crowd',
  };
}

// The play's facts (f) as a scene's own keys: what g.scene opens it with, under the step's state (game.md §5).
export function carry(title, f) {
  return {
    [SCENES.square]: { warm: f.warm, place: f.place, with_mother: f.kino ? 0 : 1 },
    [SCENES.booth]: { alfredo_here: f.alfredoHere ? 1 : 0, jumps: f.jumps, slate_letters: f.slate },
    [SCENES.hall]: {},
    [SCENES.home]: { reel8: f.reel8 ? 1 : 0, share: f.share },
    [SCENES.quay]: { letter_in_hand: f.letter ? 1 : 0 },
    [SCENES.station]: {},
    [SCENES.rome]: { note_in_hand: f.ending === 'note' ? 1 : 0, jumps: f.jumps },
    [SCENES.strip]: {},
  }[title];
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
    view.gauges(state, hero);
    if (shown) await alive(b.show(shown.title, { state: shown.state, captions: false, then }));
    ahead();
  })());
  if (j && j.target < Infinity) j.idle.then(seen);
  // a line, and the time it asks: heard — a breath after; shown without a voice — as long as it
  // takes to read it (the page keeps it 1.5 s + 60 ms a letter from when it shows: speech.js)
  async function speak(at, text, opts) {
    if (unseen()) return sleep(300 + text.length * 60);
    let heard = false;
    const hear = e => { if (e.detail.on && e.detail.text === text.trim()) heard = true; };
    addEventListener('moood:speech', hear);
    try { await b.say(at, text, opts); } finally { removeEventListener('moood:speech', hear); }
    await sleep(heard ? 500 : 300 + text.length * 60);
  }
  // a minigame's result kept where the story reads it (game.md §3.6)
  const keepHands = (minigame, result) => {
    const name = handsOf(minigame);
    if (!name) { b.trouble?.(`мини-игра «${minigame?.title}»: её файла нет в HANDS (story.js)`); return result; }
    state.hands[name] = result && typeof result === 'object' ? { ...result } : result;
    return result;
  };
  const g = {
    state,
    signal: left.signal,
    get sound() { return unseen() ? j.sounds : sounds; },
    hero(who) {
      if (gone()) return;
      hero = who;
      if (!unseen()) view.gauges(state, hero);
    },
    beds(levels, seconds = 2) {
      if (!gone()) g.sound.beds(levels, seconds);
    },
    async scene(title, st = {}, { cut = false } = {}) {
      if (gone()) return never;
      // (opened as it is to be: what the play has decided — those of its keys the scene has —, the beat it opens
      // with playing from its first frame)
      const spec = await alive(unseen() ? j.real(b.specOf(title)) : b.specOf(title));
      st = { ...Object.fromEntries(Object.entries(carry(title, facts(state)) ?? {}).filter(([key]) => key in (spec.states ?? {}))), ...st };
      if (unseen()) {
        opening = typeof st.beat === 'string' ? { name: st.beat, ended: g.told(`beat:${st.beat}`, BEAT) } : null;
        j.scene(title, st);
        return;
      }
      showing = true;
      try {
        if (fast) await alive(land());
        opening = typeof st.beat === 'string' ? { name: st.beat, ended: g.told(`beat:${st.beat}`, BEAT) } : null;
        g.withdraw();
        await alive(b.show(title, { state: st, captions: false, fade: !cut }));
      } finally { showing = false; }
    },
    set: (key, value, seconds) => (gone() ? undefined : put(key, value, seconds)),
    get: key => (unseen() ? j.values[key] : b.get(key)),
    async move(key, value, seconds, ease) {
      if (gone()) return never;
      if (unseen()) { put(key, value); return sleep(seconds * 1000); }
      await alive(Promise.resolve(b.act('state', 'move', key, value, { over: seconds, ease })));
    },
    wait: sleep,
    // (unseen: it came to pass — the scene, shown once the jump is there, has done it: bespoke.show's then)
    when(key, test, ms = 60000) {
      const ok = typeof test === 'function' ? test : v => v === test;
      return gone() ? never : unseen() ? Promise.resolve(true) : alive(hub.when(key, ok, ms));
    },
    arrived(who, ms = 60000) {
      return gone() ? never : unseen() ? Promise.resolve(true) : alive(hub.arrived(who, ms));
    },
    watch(key, fn) {
      if (gone() || unseen()) return;
      const off = hub.watch(key, (v, old) => { if (!gone()) fn(v, old); });
      left.signal.addEventListener('abort', off);
    },
    async spot(ref) {
      if (gone()) return never;
      if (unseen()) return null;
      let late = false;
      setTimeout(() => { late = true; }, 1000);
      for (;;) {
        const p = b.where(ref), f = b.frame();
        if (p) return { x: (p.x - f.x - f.w / 2) / f.h, y: (p.y - f.y - f.h / 2) / f.h };
        if (late) return null;
        await alive(new Promise(ok => requestAnimationFrame(ok)));
      }
    },
    async say(who, text, at = who) {
      if (gone()) return never;
      if (fast) await alive(land());
      return speak(at, text, PEOPLE[who]);
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
    withdraw() {
      if (unseen()) return;
      hub.withdraw();
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
      if (wait && !(await ended)) b.trouble(`кусок «${name}» не кончился`);
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
      if (!playing) throw new Error('g.minigame — только внутри мини-игры (g.play)');
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
    scale(name, delta) {
      if (gone() || !delta) return;
      const S = SCALES[name];
      state.scales[name] = Math.min(S.max, Math.max(S.min, state.scales[name] + delta));
      state.shown[name] ||= 'bare'; // (a scale not seen yet: shown, its line still to come)
      if (unseen()) return;
      view.toast(`${delta > 0 ? S.up : S.down} ${'↑'.repeat(Math.abs(delta))}`, 'scale');
      view.gauges(state, hero);
    },
    gauge(name, { rule = true } = {}) {
      if (gone()) return;
      if (rule && state.shown[name] !== true) {
        state.shown[name] = true;
        if (!unseen()) view.toast(SCALES[name].rule, 'rule');
      }
      state.shown[name] ||= 'bare';
      if (!unseen()) view.gauges(state, hero);
    },
    mark(key, value, text) {
      if (gone()) return;
      state.marks[key] = value;
      if (text && !unseen()) view.toast(text, 'mark');
    },
    // (its voice is said while it lies open — not waited for: the player folds it when they will)
    letter(letter) {
      if (gone()) return never;
      if (unseen()) return Promise.resolve();
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
//   hub.when(key, test, ms) → true once the scene sets the key to a value test holds for, false if ms pass;
//   hub.arrived(who, ms) — a walk of theirs ended; hub.watch(key, fn) → off — fn(value, old) on each
const SHOW = 8; // s: nothing pressed so long — the ghost shows how

export function listen(b) {
  let offered = null; // the plain choice going on: the language's mini-game
  const waiting = new Set(), watching = new Set();
  const wait = (w, ms) => new Promise(ok => {
    w.ok = ok;
    waiting.add(w);
    setTimeout(() => { if (waiting.delete(w)) ok(false); }, ms);
  });
  const heard = (kind, hit) => { for (const w of waiting) if (w.kind === kind && hit(w)) { waiting.delete(w); w.ok(true); } };
  b.on('tell', text => heard('tell', w => w.text === text));
  b.on('change', (value, old, key) => {
    heard('change', w => w.key === key && w.test(value));
    for (const w of watching) if (w.key === key) w.fn(value, old);
  });
  b.on('arrived', d => heard('arrived', w => w.who === d?.who));
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
    told: (text, ms) => wait({ kind: 'tell', text }, ms),
    when: (key, test, ms) => wait({ kind: 'change', key, test }, ms),
    arrived: (who, ms) => wait({ kind: 'arrived', who }, ms),
    watch(key, fn) {
      const w = { key, fn };
      watching.add(w);
      return () => watching.delete(w);
    },
  };
}
