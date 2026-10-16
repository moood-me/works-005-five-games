// The check of the game's branches: node bespoke/check/run.mjs <a clone of the world>. No browser, no engine,
// nothing drawn. Every step of every chapter is played unseen, the way the author's ☰ plays it (jump.js: a dry run,
// story.js context(…, j)), on a page that only knows the scenes' specs (fake.mjs): no time passes, the choices are
// those of the play walked, a minigame gives the result put in for it, a point asked for (g.spot) is answered with one.
// Walked: every combination of the chapters' choices with «Shrouds» climbed clean and the ring put on in «The ring»; and
// one play each with a slip on the shrouds and with the ring not on. Each play — all the steps in order, its state
// going from step to step.
// Noted, by a wrapper over the step's g (an unseen step's lines and offers never reach j) and over the sounds j plays:
// each scene opened and its keys, each beat, moment waited for, key set / moved / read, point asked, offer and its
// options, line (who, text, over what), minigame with its opts and the fields of its result the chapter reads, sound.
// A minigame is not run: what it takes of its scene is the table of game.md §7 below (MINIGAMES); the functions a
// chapter gives it in opts are each called once — so the lines they say are heard.
// Compared with each scene's scene.json and the block «Contract for the check» that ends its notes.md
// (docs/alye-parusa/scenes.md, its general part): {beats: {name: {after, tells, seconds, show}}, points, offers, party}.
// Printed: what does not match (file, step, name); the cuts inside a scene; what the contracts have and no play
// named; every line said (who, text) once, repeats and near-repeats flagged — the voices are made from this list;
// for each ending — the beats of every step and the time by chapter and in all (the beats' `seconds`, the lines at
// 0.3 s + 0.06 s a letter, the minigames' `about`); every stretch of watching with nothing to do longer than 90 s.
// Exit code: 0 — nothing to fix, 1 — something does not match.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { page, scenes } from './fake.mjs';

const world = process.argv[2];
if (!world || !existsSync(join(world, 'scenes'))) {
  console.error('node bespoke/check/run.mjs <a clone of the world>');
  process.exit(2);
}
const game = fileURLToPath(new URL('..', import.meta.url));
const load = file => import(pathToFileURL(join(game, file)).href);
// the game's texts as written (the source language): tr as the page gives it, without the translations
const fill = (t, p = {}) => t.replace(/\{(\w+)\}/g, (_, k) => String(p[k]));
globalThis.tr = Object.assign(fill, { n: (n, one, other, p) => fill(n === 1 ? one : other, { n, ...p }), c: (c, t, p) => fill(t, p), line: (who, t) => t, thought: (who, t) => t });
const PEOPLE = JSON.parse(readFileSync(join(game, 'people.json'), 'utf8'));
const { SCENES, SCALES, ENDINGS, facts, carry, context } = await load('story.js');
const { jump } = await load('jump.js');
const sound = await load('sound.js');

const WATCH = 90; // a stretch of watching longer than this, s, is reported
const several = (stem, n, tail = '') => Array.from({ length: n }, (_, i) => `${stem}${i + 1}${tail}`);
// The minigames (minigames/*.js heads): the scene a minigame is played on, the keys it moves and listens to, the moments
// it waits for, the points its marks stand on, the fields of its opts and of its result
const MINIGAMES = {
  osnastka: { scene: 'home', keys: [...several('rig', 4), 'guide'], points: several('closeup#rig', 4), opts: ['onGuide'], result: ['slips'] },
  'za-korablikom': { scene: 'forest', keys: ['run', 'jump', 'toy', 'reeds', 'run_at'], tells: ['chase:snag'], points: ['toy#toy', 'snag#snag', 'snag2#snag'], result: ['seconds', 'lost', 'jumps'] },
  kist: { scene: 'castle', keys: several('nail', 3), points: several('canvas#nail', 3), result: ['order', 'seconds'] },
  otpustit: { scene: 'castle', keys: several('grip', 4), points: several('hands#finger', 4), result: ['opened', 'waited'] },
  vanty: { scene: 'deck', keys: ['climb', 'hand_l', 'hand_r', 'slip', 'roll'], points: ['ropes#left', 'ropes#right'], result: ['slips', 'seconds'] },
  koltso: { scene: 'forest', keys: ['ring_at', 'stir'], tells: ['ring:on'], points: ['grey#ring'], result: ['on', 'stirs', 'seconds'] },
  alyi: { scene: 'shop', keys: ['roll', 'roll_out', 'memory'], points: ['roll'], opts: ['no', 'yes', 'last'], result: ['wrong', 'passed', 'shown'] },
  zhdat: { scene: 'shore', keys: [...several('light', 3), 'windows'], points: several('light', 3, '#light'), result: ['touched', 'waited'] },
  kurs: { scene: 'deck', keys: ['helm', 'heading', 'luff'], opts: ['leg', 'sea', 'onSteady'], result: ['steady'] },
  smotri: { scene: 'home', keys: ['gaze'], points: ['book#book', 'window#window'], opts: ['heavy'], result: ['tries', 'seconds'] },
  ruka: { scene: 'shore', keys: ['reach'], points: ['hands#her', 'hands#his'], opts: ['onReach'], result: ['seconds', 'lets'] },
};
// game.md §3.8: what game.js itself takes of the Far Sea (it is not run here)
const FAR = { keys: ['chapter_number', 'chapter_title', 'map', 'reveal', 'korablik'], offer: 'korablik#sail' };
// the results put in (game.md §11): the outcomes a chapter branches on
const CLEAN = { vanty: { slips: 0 }, koltso: { on: true } };
const OTHER = [{ vanty: { slips: 1 } }, { koltso: { on: false } }];

// what does not match: text → the plays it was met in
const misses = new Map(), cuts = new Map();
let play = null; // the play walked now: its number
const put = (list, where, text) => {
  const key = `${where}: ${text}`;
  if (!list.has(key)) list.set(key, new Set());
  if (play != null) list.get(key).add(play);
};
const miss = (where, text) => put(misses, where, text);
const same = (a, b) => a.length === b.length && a.every(x => b.includes(x));

// a play at its beginning (game.js)
const fresh = () => ({
  chapter: 0, step: 0, scales: Object.fromEntries(Object.entries(SCALES).map(([k, s]) => [k, s.start])),
  shown: {}, marks: {}, choices: {},
});

// --- the world: each scene's spec, its contract block, what of it the plays named
function contract(notes) {
  const at = notes.search(/^#+\s*Contract for the check\s*$/m);
  if (at < 0) throw new Error('no section “Contract for the check”');
  const block = /```json\s*\n([\s\S]*?)\n\s*```/.exec(notes.slice(at));
  if (!block) throw new Error('the section “Contract for the check” has no ```json block');
  return JSON.parse(block[1]);
}
const WORLD = scenes(world);
for (const [folder, scene] of WORLD) {
  const notes = `scenes/${scene.folder}/notes.md`, spec = `scenes/${scene.folder}/scene.json`;
  scene.named = new Set();
  scene.states = scene.spec.states ?? {};
  scene.objects = new Map((scene.spec.objects ?? []).map(o => [o.id, o]));
  scene.contract = null;
  if (!Object.values(SCENES).includes(folder)) miss(spec, `the scene “${folder}” is not in the game's SCENES`);
  try {
    if (!existsSync(join(world, notes))) throw new Error('no such file');
    const c = contract(readFileSync(join(world, notes), 'utf8'));
    if (!c) throw new Error('the contract block is empty');
    const shaped = c.beats && typeof c.beats === 'object' && Array.isArray(c.points) && Array.isArray(c.offers) && c.party && typeof c.party === 'object';
    if (!shaped) throw new Error('the contract block is not {beats, points, offers, party}');
    scene.contract = c;
  } catch (e) {
    miss(notes, `the contract not read: ${e.message}`);
    continue;
  }
  const c = scene.contract;
  if (Object.keys(c.beats).length && !('beat' in scene.states)) miss(spec, 'states has no key “beat”');
  for (const [name, beat] of Object.entries(c.beats)) {
    if (!Array.isArray(beat.after) || !Array.isArray(beat.tells)) { miss(notes, `beat “${name}”: no after or tells`); beat.after ??= []; beat.tells ??= []; }
    if (!(beat.seconds > 0)) miss(notes, `beat “${name}”: no seconds`);
    for (const a of beat.after) if (!(a in c.beats)) miss(notes, `beat “${name}”: after names a beat “${a}” there is none of`);
    // (a moment is named after the beat it was first of: a beat may tell one of another's — the wood's ring_on, ring:on)
    for (const t of beat.tells) if (!(t.includes(':') && t.split(':')[0] in c.beats)) miss(notes, `beat “${name}”: the moment “${t}” is not named “<the scene's beat>:<moment>”`);
  }
  for (const key in c.party) if (!(key in scene.states)) miss(notes, `the play's key “${key}” is not in states (${spec})`);
  // (a key the play has not decided yet is carried as the scene's own default)
  for (const [key, value] of Object.entries(carry(folder, facts(fresh())) ?? {})) {
    if (key in c.party && JSON.stringify(c.party[key]) !== JSON.stringify(value)) miss(notes, `the play's key “${key}”: by default ${JSON.stringify(c.party[key])}, a play with no choices carries ${JSON.stringify(value)}`);
  }
  for (const ref of [...c.points, ...c.offers]) {
    if (!scene.objects.has(ref.split('#')[0])) miss(notes, `point “${ref}”: no such element in ${spec}`);
  }
  for (const ref of c.offers) {
    const o = scene.objects.get(ref.split('#')[0]);
    if (o && !o.name) miss(notes, `offer “${ref}”: the element has no name (${spec})`);
  }
}
for (const folder of Object.values(SCENES)) if (!WORLD.has(folder)) miss('story.js', `the scene “${folder}” (SCENES) is not in the world`);

// --- the game's own files
const CHAPTERS = [];
for (const name of ['prologue', '1', '2', '3', '4', '5', 'epilogue']) {
  const file = `chapters/${name}.js`, ch = (await load(file)).default;
  CHAPTERS.push({ file, ...ch });
  if (!Array.isArray(ch.choices)) throw new Error(`${file}: no choices`);
  if (!Array.isArray(ch.titles) || ch.titles.length !== ch.steps.length) miss(file, `titles: ${ch.titles?.length ?? 'none'}, steps: ${ch.steps.length}`);
}
const GAMES = new Map(); // a minigame (the module's default export) → {file, name, source}
for (const entry of readdirSync(join(game, 'minigames')).filter(f => f.endsWith('.js'))) {
  const file = `minigames/${entry}`, name = entry.slice(0, -3), m = (await load(file)).default;
  const source = readFileSync(join(game, file), 'utf8');
  GAMES.set(m, { file, name, source });
  const T = MINIGAMES[name];
  if (!T) { miss(file, 'the mini-game is not in the table of game.md §7'); continue; }
  if (typeof m.title !== 'string' || !(m.about > 0) || typeof m.run !== 'function') miss(file, 'no title, about or run');
  if (!m.skipped || !same(Object.keys(m.skipped), T.result)) miss(file, `skipped: the fields {${Object.keys(m.skipped ?? {}).join(', ')}}, the result in §7 {${T.result.join(', ')}}`);
  for (const key of T.opts ?? []) if (!new RegExp(`\\b${key}\\b`).test(source)) miss(file, `the opts field “${key}” (§7) is not named in the file`);
  for (const [, s] of source.matchAll(/\bsound\.(\w+)/g)) if (!(s in sound) || !(s in sound.unheard().sounds)) miss(file, `no sound “${s}” in sound.js or in unheard()`);
}
for (const name in MINIGAMES) if (![...GAMES.values()].some(m => m.name === name)) miss(`minigames/${name}.js`, 'no such file');
// every sound has its unheard twin
const quietNames = Object.keys(sound.unheard().sounds);
for (const name of quietNames) if (typeof sound[name] !== 'function') miss('sound.js', `the sound “${name}” is in unheard() but not in sound.js`);
for (const name in sound) {
  if (typeof sound[name] === 'function' && !['pause', 'unheard'].includes(name) && !quietNames.includes(name)) miss('sound.js', `the sound “${name}” is not in unheard()`);
}
// the Far Sea, as game.js opens it
const far = WORLD.get(SCENES.far);
if (far) {
  for (const key of FAR.keys) {
    if (!(key in far.states)) miss('game.js', `“${SCENES.far}”: no key “${key}” in states`);
    if (far.contract && !(key in far.contract.party)) miss('game.js', `“${SCENES.far}”: no key “${key}” in the contract's party`);
    far.named.add(`party:${key}`);
  }
  if (far.contract && !far.contract.offers.includes(FAR.offer)) miss('game.js', `“${SCENES.far}”: no offer “${FAR.offer}” in the contract`);
  far.named.add(`ref:${FAR.offer}`);
}

// --- a step's g, watched: `here` — where it is (file, step), `events` — what the step did, in order:
// ['scene', folder] | ['beat', name, seconds] | ['say', seconds] | ['act'] | ['play', name, about]
const lines = new Map(); // `${who}\n${text}` → {who, text, where}
const mute = () => ({ loud() {}, stop() {} });
function watched(g, j, ch, here, events) {
  const bad = text => miss(here, text);
  let cur = null; // the scene shown: {folder, scene, last: the beat begun last, opening: the beat it was opened with, not taken up yet}
  let during = false; // a minigame is on: what is said now is said inside it
  let waits = []; // the moments waited for whose beat has not begun yet: {text, beat}
  const shown = what => (cur ? true : (bad(`${what} — before g.scene`), false));
  const key = (name, what) => { if (shown(`${what} «${name}»`) && !(name in cur.scene.states)) bad(`${what}: no key “${name}” in the states of the scene “${cur.folder}”`); };
  const element = (ref, what) => {
    const o = cur.scene.objects.get(ref.split('#')[0]);
    if (!o) bad(`${what}: no element “${ref.split('#')[0]}” in the scene “${cur.folder}”`);
    return o;
  };
  const point = (ref, what) => {
    element(ref, what);
    cur.scene.named.add(`ref:${ref}`);
    if (cur.scene.contract && !cur.scene.contract.points.includes(ref)) bad(`${what}: no point “${ref}” in the points of the scene “${cur.folder}”`);
  };
  const offer = (ref, what) => {
    const o = element(ref, what);
    if (o && !o.name) bad(`${what}: the element “${o.id}” has no name`);
    cur.scene.named.add(`ref:${ref}`);
    if (cur.scene.contract && !cur.scene.contract.offers.includes(ref)) bad(`${what}: no offer “${ref}” in the offers of the scene “${cur.folder}”`);
  };
  const moment = (text, what) => {
    const c = cur.scene.contract, beat = text.split(':')[0];
    cur.scene.named.add(`tell:${text}`);
    if (c && !c.beats[beat]?.tells.includes(text)) bad(`${what}: the beat “${beat}” of the scene “${cur.folder}” has no moment “${text}”`);
  };
  const begins = (name, opening) => {
    const c = cur.scene.contract, beat = c?.beats[name];
    events.push(['beat', name, beat?.seconds ?? 0]);
    cur.scene.named.add(`beat:${name}`);
    if (c && !beat) bad(`no beat “${name}” in the scene “${cur.folder}”`);
    if (beat?.show === false) bad(`the beat “${name}” of the scene “${cur.folder}” is for showing only (show: false)`);
    if (!opening && cur.last && beat && !beat.after.includes(cur.last)) put(cuts, here, `«${cur.folder}»: ${cur.last} → ${name}`);
    for (const w of waits.filter(w => w.beat === name)) if (!w.end) moment(w.text, 'g.told');
    waits = waits.filter(w => w.beat !== name);
    cur.last = name;
  };
  j.sounds = new Proxy(j.sounds, {
    get(quiet, name) {
      if (typeof name !== 'string') return quiet[name];
      const known = n => {
        if (n in sound && n in quiet) return true;
        bad(`no sound “${n}” in sound.js or in unheard()`);
        return false;
      };
      if (name === 'beds') return (levels = {}, seconds) => { Object.keys(levels).forEach(known); quiet.beds(levels, seconds); };
      return known(name) ? quiet[name] : mute;
    },
  });
  const w = Object.create(g);
  Object.assign(w, {
    async scene(folder, st = {}, how) {
      const scene = WORLD.get(folder), party = carry(folder, facts(g.state));
      if (scene && party) {
        cur = { folder, scene, last: null, opening: typeof st.beat === 'string' ? st.beat : null };
        events.push(['scene', folder]);
        for (const k in party) {
          scene.named.add(`party:${k}`);
          if (!(k in scene.states)) bad(`the play's key “${k}” is not in the states of the scene “${folder}”`);
          if (scene.contract && !(k in scene.contract.party)) bad(`the play's key “${k}” is not in the party of the scene “${folder}”`);
        }
        // (a key the step itself opens the scene with is named too: the party's keys the play does not carry)
        for (const k in st) { key(k, 'g.scene'); scene.named.add(`party:${k}`); }
        if (cur.opening) begins(cur.opening, true);
        else bad(`the scene “${folder}” opened with no beat`);
      }
      return g.scene(folder, st, how); // (a scene the world or SCENES lacks: the step breaks there)
    },
    beat(name, how) {
      if (shown(`g.beat «${name}»`)) {
        if (cur.opening !== name) begins(name, false);
        cur.opening = null;
      }
      return g.beat(name, how);
    },
    told(text, ms) {
      const [beat, name] = text.split(':');
      if (name == null) bad(`g.told “${text}”: not “<beat>:<moment>”`);
      else if (beat === 'beat') { if (cur?.last !== name) waits.push({ text, beat: name, end: true }); }
      else if (cur?.last === beat) { moment(text, 'g.told'); bad(`g.told “${text}” set after its beat has begun (for the beat the scene opens with — after g.scene)`); }
      else waits.push({ text, beat });
      return g.told(text, ms);
    },
    set(k, value, seconds) { key(k, 'g.set'); return g.set(k, value, seconds); },
    get(k) { key(k, 'g.get'); return g.get(k); },
    move(k, value, seconds, ease) { key(k, 'g.move'); return g.move(k, value, seconds, ease); },
    when(k, test, ms) { key(k, 'g.when'); return g.when(k, test, ms); },
    watch(k, fn) { key(k, 'g.watch'); return g.watch(k, fn); },
    arrived(who, ms) { if (shown(`g.arrived «${who}»`)) element(who, 'g.arrived'); return g.arrived(who, ms); },
    // (unseen, no point is on the screen: answered with one — the step goes the way it does with the scene seen)
    async spot(ref) { if (shown(`g.spot «${ref}»`)) point(ref, 'g.spot'); return (await g.spot(ref)) ?? { x: 0, y: 0 }; },
    say(who, text, at = who) {
      const what = `the line “${text}”`;
      if (!(who in PEOPLE)) bad(`${what}: the speaker “${who}” is not in people.json`);
      if (at !== 'narrator' && shown(what)) {
        if (at.includes('#') && !cur.scene.contract?.offers.includes(at)) point(at, what);
        else if (element(at, what)) cur.scene.named.add(`ref:${at}`);
      }
      if (!lines.has(`${who}\n${text}`)) lines.set(`${who}\n${text}`, { who, text, where: here });
      if (!during) events.push(['say', 0.3 + 0.06 * text.length]);
      return g.say(who, text, at);
    },
    choose(choice, offers) {
      const what = `the choice “${choice ?? Object.keys(offers).join(', ')}”`, ids = Object.values(offers).flat().map(o => o.id);
      if (shown(what)) for (const ref in offers) offer(ref, what);
      if (choice != null) {
        const declared = ch.choices.find(c => c.id === choice);
        if (!declared) bad(`${what}: it is not in the chapter's choices`);
        else if (!same(ids, declared.options.map(o => o.id))) bad(`${what}: offered {${ids.join(', ')}}, the chapter's choices {${declared.options.map(o => o.id).join(', ')}}`);
      }
      events.push(['act']);
      return g.choose(choice, offers);
    },
    letter(letter) {
      events.push(['act']);
      return g.letter(letter);
    },
    async play(minigame, opts = {}) {
      const m = GAMES.get(minigame), T = m && MINIGAMES[m.name];
      if (!T) {
        bad('g.play: a mini-game not of minigames/, or not in §7');
        return g.play(minigame, opts);
      }
      const what = `the mini-game “${m.name}”`;
      events.push(['play', m.name, minigame.about ?? 0]);
      if (shown(what)) {
        if (cur.folder !== SCENES[T.scene]) bad(`${what} is played in the scene “${cur.folder}”, in §7 — “${SCENES[T.scene]}”`);
        else {
          for (const k of T.keys) key(k, what);
          for (const ref of T.points ?? []) point(ref, what);
          for (const text of T.tells ?? []) moment(text, what);
        }
      }
      for (const k in opts) {
        if (!(T.opts ?? []).includes(k)) bad(`${what}: no opts field “${k}” in §7`);
        else if (!new RegExp(`\\b${k}\\b`).test(m.source)) bad(`${what}: the opts field “${k}” is not named in ${m.file}`);
      }
      const result = await g.play(minigame, opts);
      // (what the chapter gives it to say and to sound: each once)
      during = true;
      for (const fn of Object.values(opts)) if (typeof fn === 'function') await fn(1);
      during = false;
      if (!result || typeof result !== 'object') {
        bad(`${what}: no result (skipped?)`);
        return result;
      }
      return new Proxy(result, {
        get(r, field) {
          if (typeof field === 'string' && field !== 'then' && !(field in (minigame.skipped ?? {}))) bad(`${what}: the chapter reads the result's field “${field}”, skipped has none`);
          return r[field];
        },
      });
    },
  });
  return { g: w, left: () => waits.forEach(t => bad(`g.told “${t.text}”: the beat “${t.beat}” did not begin in the step after it`)) };
}

// --- the walk
const b = page(WORLD, text => miss('b.trouble', text));
// one play: its choices, the results put in → {ending, chapters: [[events of each step]]}
async function walk(choices, results) {
  const result = m => {
    const name = GAMES.get(m)?.name;
    return results[name] && { ...m.skipped, ...results[name] };
  };
  let came = fresh();
  const chapters = [];
  for (const ch of CHAPTERS) {
    const steps = [];
    for (const [n, step] of ch.steps.entries()) {
      const here = `${ch.file}, step ${n + 1} “${ch.titles?.[n] ?? ''}”`, events = [];
      const j = jump(Infinity, sound.unheard(), { result });
      const state = { ...structuredClone(came), choices: Object.assign(Object.create(choices), came.choices) };
      const { g, left } = watched(context(b, null, null, state, j), j, ch, here, events);
      const done = await Promise.race([
        (async () => step(g))().then(() => true, e => { miss(here, `the step broke: ${e?.message || e}`); return true; }),
        j.idle.then(() => false),
      ]);
      if (!done) miss(here, 'the dry step did not reach its end: it waits for what an unseen step lacks');
      await j.idle; // (what the step began and did not wait for)
      left();
      came = { ...g.state, choices: { ...g.state.choices } };
      steps.push(events);
    }
    chapters.push(steps);
  }
  return { ending: facts(came).ending, chapters };
}
const CHOICES = CHAPTERS.flatMap(ch => ch.choices);
const combos = CHOICES.reduce((all, c) => all.flatMap(made => c.options.map(o => ({ ...made, [c.id]: o.id }))), [{}]);
const plays = [];
for (const choices of combos) { play = plays.length; plays.push(await walk(choices, CLEAN)); }
for (const other of OTHER) { play = plays.length; plays.push(await walk(combos[0], { ...CLEAN, ...other })); }
play = null;

// --- the report
const out = [];
const say = (text = '') => out.push(text);
const met = set => (set.size && set.size < plays.length ? ` (plays: ${set.size})` : '');
const clock = s => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;
const span = all => { const lo = Math.min(...all), hi = Math.max(...all); return lo === hi ? clock(lo) : `${clock(lo)}…${clock(hi)}`; };
const seconds = events => events.reduce((sum, e) => sum + (e[0] === 'beat' || e[0] === 'play' ? e[2] : e[0] === 'say' ? e[1] : 0), 0);

say(`World: ${world} — ${WORLD.size} scenes. Game: ${CHAPTERS.length} chapters, ${CHAPTERS.reduce((n, ch) => n + ch.steps.length, 0)} steps, ${CHOICES.length} choices.`);
say(`Plays: ${plays.length} (${combos.length} combinations of the choices and one each with ${OTHER.map(o => JSON.stringify(o)).join(', ')}).`);

say(`
== Discrepancies: ${misses.size} ==`);
for (const [text, set] of misses) say(`${text}${met(set)}`);

say(`
== Cuts inside a scene (a beat not after its after): ${cuts.size} ==`);
for (const [text, set] of cuts) say(`${text}${met(set)}`);

say('\n== In the scenes\' contracts, named by no play ==');
for (const [folder, scene] of WORLD) {
  const c = scene.contract;
  if (!c) continue;
  const left = [
    ...Object.entries(c.beats).filter(([name, beat]) => beat.show !== false && !scene.named.has(`beat:${name}`)).map(([name]) => `beat ${name}`),
    ...[...new Set(Object.values(c.beats).flatMap(beat => beat.tells))].filter(t => !scene.named.has(`tell:${t}`)).map(t => `moment ${t}`),
    ...Object.keys(c.party).filter(k => !scene.named.has(`party:${k}`)).map(k => `the play's key ${k}`),
    ...[...new Set([...c.points, ...c.offers])].filter(ref => !scene.named.has(`ref:${ref}`)).map(ref => `point ${ref}`),
  ];
  say(`${folder}: ${left.join('; ') || '—'}`);
}

// (letters and digits only: the same words written another way)
const bare = text => text.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
const apart = (a, b) => {
  let row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const next = [i];
    for (let k = 1; k <= b.length; k++) next[k] = Math.min(row[k] + 1, next[k - 1] + 1, row[k - 1] + (a[i - 1] === b[k - 1] ? 0 : 1));
    row = next;
  }
  return row[b.length];
};
say(`
== Lines: ${lines.size} (who | text | ≈ s | where first) ==`);
const said = [...lines.values()];
for (const line of said) {
  say(`${line.who} | ${line.text} | ${(0.3 + 0.06 * line.text.length).toFixed(1)} | ${line.where}`);
  for (const other of said) {
    if (other === line) continue;
    const a = bare(line.text), z = bare(other.text);
    if (a === z) say(`    ! repeat: ${other.who} | ${other.text}`);
    else if (Math.min(a.length, z.length) >= 10 && apart(a, z) <= 2) say(`    ! near repeat: ${other.who} | ${other.text}`);
  }
}

say('\n== Beats and time by ending (beats — the contract\'s seconds, lines — 0.3 s + 0.06 s a letter, mini-games — about) ==');
for (const ending of ENDINGS) {
  const mine = plays.filter(p => p.ending === ending.id);
  say(`
-- ${ending.label} (${ending.id}): ${mine.length} plays --`);
  if (!mine.length) continue;
  const times = mine.map(p => p.chapters.map(steps => seconds(steps.flat())));
  say(`time: ${CHAPTERS.map((ch, c) => `${ch.number || ch.title} ${span(times.map(t => t[c]))}`).join(' · ')} · in all ${span(times.map(t => t.reduce((a, x) => a + x, 0)))}`);
  for (const [c, ch] of CHAPTERS.entries()) {
    for (const n of ch.steps.keys()) {
      const ways = new Map();
      for (const p of mine) {
        const events = p.chapters[c][n];
        const way = `${events.filter(e => e[0] !== 'say' && e[0] !== 'act').map(e => (e[0] === 'scene' ? `| ${e[1]}:` : e[0] === 'play' ? `[${e[1]}]` : e[1])).join(' ').replace(/^\| /, '') || '—'} — ${Math.round(seconds(events))} s`;
        ways.set(way, (ways.get(way) ?? 0) + 1);
      }
      for (const [way, count] of ways) say(`${ch.file} ${n + 1} «${ch.titles?.[n] ?? ''}»: ${way}${count < mine.length ? ` (plays: ${count})` : ''}`);
    }
  }
}

// a stretch of watching: from one thing the player does (the yacht of the Far Sea, a choice, a letter, a minigame) to
// the next. The Far Sea stands before a chapter unless it says wall: false, and after one that has choices (game.js)
const long = new Map(); // `${from} → ${to}` → [seconds of each play it is long in]
for (const p of plays) {
  let run = 0, from = 'the beginning';
  const acted = to => {
    if (run > WATCH) long.set(`${from} → ${to}`, [...(long.get(`${from} → ${to}`) ?? []), run]);
    run = 0;
    from = to;
  };
  for (const [c, ch] of CHAPTERS.entries()) {
    if (ch.wall !== false) acted(`the Far Sea before ${ch.file}`);
    for (const [n, events] of p.chapters[c].entries()) {
      for (const e of events) {
        if (e[0] === 'beat') run += e[2];
        else if (e[0] === 'say') run += e[1];
        else if (e[0] !== 'scene') acted(`${ch.file}, step ${n + 1} “${ch.titles?.[n] ?? ''}”`);
      }
    }
    if (ch.choices.length) acted(`the Far Sea after ${ch.file}`);
  }
  acted('the end');
}
say(`
== Watching with nothing to do longer than ${WATCH} s: ${long.size} ==`);
for (const [where, all] of long) say(`${where}: ${span(all)} (plays: ${all.length})`);

// (a dry run's clock — jump.js — keeps the process alive: leave once all is written)
process.stdout.write(`${out.join('\n')}\n`, () => process.exit(misses.size ? 1 : 0));
