// What a chapter's steps play with: context(b, view, hub, state) → g. Its state is a working copy —
// kept only once the step is done (game.js). A step left behind (its author skipped it: ⏭) does
// nothing more and never ends: whatever it still calls returns a promise that never settles.
//   g.state — what the play carries: {scales, shown, marks, choices} (game.js); what follows from it: facts(g.state)
//   g.signal — aborts when the step is left: stop what it started (a sound, a timer) on it
//   g.sound — the game's sounds (sound.js)
//   g.hero(who) — whose scene it is: 'assol' | 'grey' | 'both' — the hero's scale in full, the other one faint
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
//   g.choose(choice, {ref: options, …}) — the player presses one of the points, then one of its options
//     ([{id, label}]); → the option's id, kept in state.choices[choice] (choice null: not a choice of the chapter's
//     map). One who doesn't press is told how, after 8 s. g.withdraw() — what is offered is taken back
//   g.beat(name, {wait}) — a beat of the shown scene's film (the world's module `beats`); → once it
//     has ended (the scene tells 'beat:<name>'), or at once with wait: false. To wait for a moment inside a beat,
//     make the g.told / g.when / g.arrived before g.beat
//   g.play(minigame, opts) — a small game of the hands: a module of minigames/ — export default {title, about,
//     skipped, run: async (g, b, opts, signal) → its result}, made of the language of mini-games (bespoke.minigame:
//     moood/docs/agents/minigames.md). The signal aborts when the author skips it (⏭ — the game's or the language's)
//     or the step is left: it stops; → `skipped` then. The player has no way out of it: each is passable
//   g.minigame({phrase, sample}) — inside a minigame's run: the language's mini-game begun (bespoke.minigame.start),
//     left when the signal aborts; the language's ⏭ skips the minigame
//   g.hint(text, afterMs) — one line low on the screen, what to do; → a function that takes it away
//   g.scale(name, delta) — a scale moves; the player sees which way (the gauge, the words)
//   g.gauge(name, {rule}) — the scale is shown from now on; its one line of what it means said once (rule: false —
//     not yet)
//   g.mark(key, value, text) — remembered (state.marks[key]); text — what the player is told, if any
//   g.letter({text, sign}) — a sheet the player unfolds, reads and folds again (ui.js)
//   g.title(text) — words over the scene, as a film's title; → once they have gone
// A step may be played up to a minigame unseen, without time (the author's ☰: a jump — jump.js j), or all through
// (a dry run): then nothing of it is said, shown or heard, and a minigame gives what j.result says, else its `skipped`.
import * as sounds from './sound.js';

export const SCENES = { shore: 'Берег Каперны', home: 'Дом Лонгрена', forest: 'Лес у моря', castle: 'Замок Греев',
  deck: 'Палуба', shop: 'Лавка в Лиссе', far: 'Даль' };

// who speaks: the sound service's voice, how it says it, who it is
export const PEOPLE = {
  narrator: { voice: 'Schedar', how: 'спокойно, светло, чуть торжественно — как рассказывают сказку, в которую верят', name: 'рассказчик' },
  assol_child: { voice: 'Leda', how: 'девочка восьми лет: звонко, доверчиво, на одном дыхании', name: 'Ассоль, восемь лет' },
  assol: { voice: 'Vindemiatrix', how: 'тихо, ясно, чуть удивлённо, без жалобы', name: 'Ассоль, семнадцать лет' },
  longren: { voice: 'Algenib', how: 'низко, медленно, хрипловато, бережно', name: 'Лонгрен, старый моряк, отец Ассоль' },
  egl: { voice: 'Charon', how: 'старик-сказочник: медленно, нараспев, с улыбкой в голосе', name: 'Эгль, собиратель сказок' },
  grey_boy: { voice: 'Autonoe', how: 'мальчик восьми лет: серьёзно, упрямо, негромко', name: 'Артур Грей, восемь лет' },
  grey: { voice: 'Iapetus', how: 'молодой капитан: ровно, негромко, уверенно', name: 'Артур Грей, капитан' },
  lilian: { voice: 'Achernar', how: 'мягко, негромко, сдерживая волнение', name: 'Лилиан Грей, мать Артура' },
  gop: { voice: 'Orus', how: 'капитан старой школы: резко, громко, с насмешкой', name: 'капитан Гоп' },
  letika: { voice: 'Puck', how: 'матрос-балагур: весело, быстро, вполголоса', name: 'матрос Летика' },
  panten: { voice: 'Umbriel', how: 'немолодой помощник: тревожно, осторожно', name: 'помощник Пантен' },
  hin: { voice: 'Algieba', how: 'трактирщик: вкрадчиво, с ухмылкой, сплетничая', name: 'Хин Меннерс, трактирщик' },
  filipp: { voice: 'Achird', how: 'угольщик: просто, добродушно, сердито заступаясь', name: 'угольщик Филипп' },
  merchant: { voice: 'Sadaltager', how: 'лавочник: сухо, равнодушно, по-деловому', name: 'торговец в Лиссе' },
  kids: { voice: 'Laomedeia', how: 'дети дразнят: звонко, нараспев, со смехом', name: 'дети Каперны' },
  kids_call: { voice: 'Laomedeia', how: 'девочка постарше зовёт: по-доброму, чуть свысока, без смеха', name: 'девочка Каперны' },
  kids_true: { voice: 'Laomedeia', how: 'те же дети кричат всерьёз: запыхавшись, взволнованно, без смеха', name: 'дети Каперны' },
  girl: { voice: 'Zephyr', how: 'маленькая девочка: робко, с восхищением', name: 'девочка лет семи' },
};

// The scales, each with two sides: where they start, their bounds, the side the player reads when they move (up:
// delta > 0, down: delta < 0), and the one line that says what they mean.
export const SCALES = {
  tale: { start: 0, min: -3, max: 3, up: 'Сказка', down: 'Люди',
    rule: 'Паруса алеют, когда Ассоль верит. Белеют, когда она живёт как все.' },
  sea: { start: 0, min: -4, max: 4, up: 'Море', down: 'Дом', rule: 'Стрелка — куда тянет Грея: домой или в море.' },
};
export const ENDINGS = [
  { id: 'grin', label: 'Как у Грина' }, { id: 'cry', label: 'Красные паруса плывут!' },
  { id: 'waited', label: 'Она ждала' }, { id: 'kaperna', label: 'Вся Каперна' },
];

// What follows from the play so far — all a step reads of it besides g.state. A choice not made (its step skipped by
// the author) gives the value written here.
export function facts(state) {
  const c = state.choices, tale = state.scales.tale >= 0 ? 'tale' : 'people', way = c.way ?? 'secret';
  const home = c.letter ? c.letter === 'home' : state.scales.sea < 0; // Grey's side: the letter decides it
  return {
    tale, // 'tale' | 'people'
    warm: Math.min(1, Math.max(0, (3 - state.scales.tale) / 6)), // 0 Сказка … 1 Люди
    sea: home ? 'home' : 'sea', // 'sea' | 'home'
    home: Math.min(1, Math.max(0, (4 - state.scales.sea) / 8)), // 0 Море … 1 Дом
    way, // 'secret' | 'straight'
    longren: way === 'straight' ? 'knows' : c.longren === 'go' ? 'sea' : 'home',
    ring: c.ring === 'wear' ? 'finger' : c.ring === 'hide' ? 'cord' : 'none',
    ringKind: c.leave === 'farewell' ? 'mother' : 'own',
    leave: c.leave === 'quiet' ? 'note' : 'farewell',
    girlToy: c.girl === 'give',
    wine: home,
    ending: way === 'straight' ? (tale === 'tale' ? 'waited' : 'kaperna') : tale === 'tale' ? 'grin' : 'cry',
    morning: state.marks.morning ?? 0.3,
  };
}

// The play's facts (f) as a scene's own keys: what g.scene opens it with, under the step's state.
export function carry(title, f) {
  const toy = f.girlToy ? 1 : 0;
  return {
    [SCENES.shore]: { ring: f.ring, ring_kind: f.ringKind, warm: f.warm, girl_toy: toy, longren: f.longren, ending: f.ending, morning: f.morning },
    [SCENES.home]: { ring: f.ring, ring_kind: f.ringKind, longren: f.longren, girl_toy: toy },
    [SCENES.forest]: { ring_kind: f.ringKind },
    [SCENES.castle]: { home: f.home, leave: f.leave, letter: f.wine ? 1 : 0 },
    [SCENES.deck]: { wine: f.wine ? 1 : 0, ring: f.ring, ring_kind: f.ringKind },
    [SCENES.shop]: {},
    [SCENES.far]: {},
  }[title];
}

const BEAT = 180000; // a beat longer than this has not ended: the scene lacks it

export function context(b, view, hub, state, j = null) {
  const left = new AbortController(); // the step is left behind (game.js)
  const gone = () => left.signal.aborted;
  const never = new Promise(() => {});
  const alive = p => p.then(v => (gone() ? never : v));
  const unseen = () => j?.on;
  const sleep = ms => (gone() ? never : unseen() ? j.sleep(ms) : new Promise(ok => setTimeout(() => gone() || ok(), ms)));
  const put = (key, value, seconds) => (unseen() ? j.did([key, value]) : b.set(key, value, seconds));
  let hero = 'both'; // whose scene it is
  let opening = null; // the beat the scene was opened with, till g.beat takes it up: {name, ended}
  let nudge = () => {}; // takes away the line that tells one who doesn't press how to choose
  let playing = null; // the minigame played now: {signal, end}
  // a jump at its minigame (or stuck before it: a choice the play didn't make): the scene where the step has got to
  // — and the step on from there, seen
  let seeing = null;
  const seen = () => (seeing ??= (async () => {
    const { shown, then } = j;
    for (const h of j.seen()) hub.told(h.text, h.ms).then(h.ok);
    view.gauges(state, hero);
    if (shown) await alive(b.show(shown.title, { state: shown.state, captions: false, then }));
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
      st = { ...Object.fromEntries(Object.entries(carry(title, facts(state))).filter(([key]) => key in spec.states)), ...st };
      opening = typeof st.beat === 'string' ? { name: st.beat, ended: g.told(`beat:${st.beat}`, BEAT) } : null;
      if (unseen()) j.scene(title, st);
      else {
        g.withdraw();
        await alive(b.show(title, { state: st, captions: false, fade: !cut }));
      }
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
    say(who, text, at = who) {
      return gone() ? never : speak(at, text, PEOPLE[who]);
    },
    async choose(choice, offers) {
      if (gone()) return never;
      const offer = async () => {
        nudge = g.hint('Коснись кольца', 8000);
        const { action } = await alive(hub.offer(offers));
        nudge();
        return action;
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
      nudge();
    },
    async beat(name, { wait = true } = {}) {
      if (gone()) return never;
      // (the beat the scene was opened with: playing already)
      const opened = opening?.name === name ? opening : null;
      opening = null;
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
        if (j.plays.length <= j.target) return j.result?.(minigame) ?? minigame.skipped;
        await seen();
      }
      // skipped — by its author (⏭), by the step left — it ends with its `skipped`
      const stop = new AbortController();
      const end = () => stop.abort();
      const off = view.onSkip(end);
      left.signal.addEventListener('abort', end);
      playing = { signal: stop.signal, end };
      const skipped = new Promise(ok => stop.signal.addEventListener('abort', () => {
        off();
        ok(minigame.skipped);
      }));
      try {
        return await alive(Promise.race([minigame.run(g, b, opts, stop.signal), skipped]));
      } finally {
        left.signal.removeEventListener('abort', end);
        stop.abort();
        playing = null;
      }
    },
    minigame(o = {}) {
      if (!playing) throw new Error('g.minigame — только внутри мини-игры (g.play)');
      const mg = b.minigame.start({ ...o, signal: playing.signal });
      mg.on('skip', playing.end);
      return mg;
    },
    hint(text, afterMs = 0) {
      if (gone() || unseen()) return () => {};
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
    letter(letter) {
      return gone() ? never : unseen() ? Promise.resolve() : alive(view.letter(letter, { signal: left.signal }));
    },
    title(text) {
      return gone() ? never : unseen() ? sleep(9000) : alive(view.title(text, { signal: left.signal }));
    },
    // the step is left behind (game.js): nothing it offered or still had to say stays
    leave() {
      left.abort();
      hub.withdraw();
      b.hush();
    },
  };
  return g;
}

// The page's actions and what its scenes tell and do, listened to once for the whole play (bespoke.on
// keeps a listener for good) — game.js owns it: whatever is being chosen now gets the action;
// whoever waits for a tell, a key set, a walk's end hears it.
//   hub.offer({ref: options}) → {element, action} once the player has done it (what was offered before is dropped)
//   hub.withdraw() — nothing offered; hub.told(text, ms) → true once the scene tells it, false if ms pass
//   hub.when(key, test, ms) → true once the scene sets the key to a value test holds for, false if ms pass;
//   hub.arrived(who, ms) — a walk of theirs ended; hub.watch(key, fn) → off — fn(value, old) on each
export function listen(b) {
  let offered = null;
  const waiting = new Set(), watching = new Set();
  const wait = (w, ms) => new Promise(ok => {
    w.ok = ok;
    waiting.add(w);
    setTimeout(() => { if (waiting.delete(w)) ok(false); }, ms);
  });
  const heard = (kind, hit) => { for (const w of waiting) if (w.kind === kind && hit(w)) { waiting.delete(w); w.ok(true); } };
  b.on('act', (element, action) => {
    const ok = offered;
    offered = null;
    b.offer({});
    ok?.({ element, action });
  });
  b.on('tell', text => heard('tell', w => w.text === text));
  b.on('change', (value, old, key) => {
    heard('change', w => w.key === key && w.test(value));
    for (const w of watching) if (w.key === key) w.fn(value, old);
  });
  b.on('arrived', d => heard('arrived', w => w.who === d?.who));
  return {
    offer: offers => new Promise(ok => { offered = ok; b.offer(offers); }),
    withdraw() { offered = null; b.offer({}); },
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
