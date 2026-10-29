// The check of the game's branches (game.md §11): node bespoke/check/run.mjs <a clone of the world>. No browser, no
// engine, nothing drawn. Every step of every chapter is played unseen, the way the author's map plays it (jump.js: a dry
// run, story.js context(…, j)), on a page that only knows the scenes' specs (fake.mjs): no time passes, the choices
// are those of the play walked, a minigame gives the result put in for it (else its `skipped`).
// Walked: every combination of the eight choices (256) — the even ones with every minigame's result on its "flawed"
// side (FLAWED below: the startled spitz, the stooping man looked at, the knife lifted…), the odd ones with every
// minigame skipped (its plain side) —, and one play more with the leash let go to the road and the hand touched in
// "The sea" (game.md §11). Each play — all the steps in order, its state going from step to step.
// Noted, by a wrapper over the step's g (an unseen step's lines and offers never reach j) and over the sounds j plays:
// each scene opened and its keys (the party's too), each beat, beat_next set (g.next), moment waited for, key set /
// moved / read, offer and its options, line (who, text, over what), minigame with its opts and the fields of its
// result the chapter reads, letter (its voice is called, so its line is heard), sound. After each g.play every
// function of its opts is called once (sea(), onFirst(), onPiano(), window()…): the lines the minigames say are heard.
// Compared with each scene's scene.json and the block "Contract for the check" that ends its notes.md (scenes.md
// "Common"): {beats: {name: {after, tells, seconds, show}}, points, offers, party, keys?}; with the minigames' table
// (§7, MINIGAMES below), people.json, sound.js and its unheard(), the lines of §8 (lines.mjs) letter for letter; the
// rule of g.next (§3.9: before every beat but the one a scene opens with, g.next of that beat, and no other g.next
// between); and the agreement of each ending with what was said, played and carried (ENDS below), the scales (§5:
// husband and wife move none; heart odd once I.1 is played, anna once II.4 is).
// Printed: what does not match (file, step, name) — a scene the world lacks is said, the walk goes on; the cuts
// inside a scene not by its table and without beat_next; what the contracts have and no play named; the lines of §8
// no play said; every line said (who, voice, text) once — the voices are made from this list; for each ending — the
// beats of every step and the time by chapter and in all (the beats' `seconds`, the lines at 0.3 s + 0.06 s a letter,
// the minigames' `about`; and beside it with the choices and touches at 5 s, letters at 6 s, the map at 10 s); every
// stretch of watching with nothing to do longer than 90 s.
// Exit code: 0 — nothing to fix, 1 — something does not match.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { page, scenes } from './fake.mjs';
import { LINES } from './lines.mjs';

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
const several = (stem, n, tail = '', from = 1) => Array.from({ length: n }, (_, i) => `${stem}${i + from}${tail}`);
// The minigames (game.md §7): the scene a minigame is played on, the keys it moves and those it only listens to, the
// points its marks stand on, the fields of its opts and of its result
const MINIGAMES = {
  coax: { scene: 'quay', keys: ['hand', 'spitz_near'], points: ['spitz#head'], result: ['startles'] },
  lorgnette: { scene: 'quay', keys: ['pass', 'look_at', 'stranger_turn', 'surge'], points: [...several('p', 6, '#head'), 'stranger#head'], result: ['looked', 'stranger'] },
  'looking-round': { scene: 'quay', keys: ['seen', 'kiss_now'], listens: ['watched'], points: ['anna#head'], result: ['seen'] },
  watermelon: { scene: 'room', keys: ['cut', 'slice', 'candle'], points: ['melon#knife', 'melon#from', 'melon#to'], result: ['lifts'] },
  'beside-her': { scene: 'room', keys: ['hand_at', 'pull', 'palm'], points: ['hands#his', 'hands#her'], result: ['pulls'] },
  sea: { scene: 'oreanda', keys: ['dawn', 'lights', 'cicada', 'hand'], points: ['steamer#lights', 'cypress#cicada', 'anna#hand_r'], opts: ['sea'], result: ['touched'] },
  shadow: { scene: 'moscow', keys: ['walk_on', 'gurov_look', ...several('shade', 4)], points: several('shade', 4, '#head'), opts: ['count', 'onFirst'], result: ['touched'] },
  leash: { scene: 'town', keys: ['anna_to'], listens: ['anna_at'], points: ['anna#hand_l'], opts: ['pull'], result: ['end'] },
  'by-the-fence': { scene: 'town', keys: ['walk_to'], listens: ['gurov_at'], points: ['gurov#head', ...several('fence#p', 5)], opts: ['tune', 'onPiano'], result: ['stood'] },
  'find-her': { scene: 'theatre', keys: ['enter', 'glint'], points: [...several('lady', 5, '#head'), 'anna#head'], result: ['wrong'] },
  'by-the-hand': { scene: 'moscow', keys: ['go'], listens: ['walked'], points: ['daughter#hand_r'], opts: ['lines'], result: ['stops'] },
  tea: { scene: 'bazaar', keys: ['glass_at', 'tap', 'fill', 'spill'], points: ['tea#glass', 'tea#under', 'tea#tap'], result: ['spills'] },
  counsel: { scene: 'bazaar', keys: ['think'], points: ['window#window', 'door#door', 'table#glasses'], opts: ['window', 'door', 'table'], result: ['touched'] },
};
// what game.js itself takes of “Lights”, the map (it is not run here): its keys, the points its trees stand at
// (map.js) — each chapter's, the finale's and the author's sign's
const MAP = { keys: ['shown', 'come'], points: [...Array.from({ length: 8 }, (_, i) => `c${i}`), 'author'] };
// the results put in (game.md §11): each minigame's other side — the even plays; the odd ones skip every minigame
const FLAWED = { coax: { startles: 1 }, lorgnette: { looked: 3, stranger: true }, 'looking-round': { seen: 1 },
  watermelon: { lifts: 2 }, 'beside-her': { pulls: 1 }, sea: { touched: ['lights', 'cicada'] }, shadow: { touched: [1, 2] },
  'by-the-fence': { stood: false }, 'find-her': { wrong: 2 }, 'by-the-hand': { stops: 1 }, tea: { spills: 1 },
  counsel: { touched: ['window', 'table'] } };
// and the play with the leash let go (its pieces of III.2) and the hand touched by the sea
const OTHER = [{ leash: { end: 'road' }, sea: { touched: ['hand'] } }];
// the times of the length (game.md §11 "Length — honestly"): a choice or a touch, a letter, the map
const ACT = 5, LETTER = 6, MAP_S = 10;

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

// --- the lines of §8: who and text → the number
const LINE = new Map(LINES.map(([n, who, text]) => [`${who}\n${text}`, n]));
const R = n => LINES.find(l => l[0] === n);

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
  if (!Object.values(SCENES).includes(folder)) { miss(spec, `the scene “${folder}” is not in the game's SCENES (the game does not have it)`); continue; }
  try {
    if (!existsSync(join(world, notes))) throw new Error('no file');
    const c = contract(readFileSync(join(world, notes), 'utf8'));
    if (!c) throw new Error('the contract block is empty');
    const shaped = c.beats && typeof c.beats === 'object' && Array.isArray(c.points) && Array.isArray(c.offers) && c.party && typeof c.party === 'object';
    if (!shaped) throw new Error('the contract block is not {beats, points, offers, party, keys?}');
    // (the game's keys: checked against the contract where it names them, else against states alone)
    if (c.keys != null && typeof c.keys !== 'object') { miss(notes, 'the contract\'s “keys” is not an object'); c.keys = null; }
    scene.contract = c;
  } catch (e) {
    miss(notes, `the contract was not read: ${e.message}`);
    continue;
  }
  const c = scene.contract;
  scene.order = Object.keys(c.beats); // the film's table, in order: a cut-beat is the next after the one before it
  if (Object.keys(c.beats).length && !('beat' in scene.states)) miss(spec, 'states has no key “beat”');
  if (Object.keys(c.beats).length && !('beat_next' in scene.states)) miss(spec, 'states has no key “beat_next”');
  for (const [name, beat] of Object.entries(c.beats)) {
    if (!Array.isArray(beat.after) || !Array.isArray(beat.tells)) { miss(notes, `beat “${name}”: no after or tells`); beat.after ??= []; beat.tells ??= []; }
    if (!(beat.seconds > 0)) miss(notes, `beat “${name}”: no seconds`);
    for (const a of beat.after) if (!(a in c.beats)) miss(notes, `beat “${name}”: its after names the beat “${a}”, which does not exist`);
    for (const t of beat.tells) if (!(t.includes(':') && t.split(':')[0] in c.beats)) miss(notes, `beat “${name}”: the moment “${t}” is not named “<the scene's beat>:<moment>”`);
  }
  for (const key in c.party) if (!(key in scene.states)) miss(notes, `the party key “${key}” is not in states (${spec})`);
  for (const key in c.keys ?? {}) if (!(key in scene.states)) miss(notes, `the game's key “${key}” is not in states (${spec})`);
  // (a key the play has not decided yet is carried as the scene's own default)
  for (const [key, value] of Object.entries(carry(folder, facts(fresh())) ?? {})) {
    if (!(key in c.party)) miss(notes, `the party key “${key}” (game.md §5 carry) is not in the contract's party`);
    else if (JSON.stringify(c.party[key]) !== JSON.stringify(value)) miss(notes, `the party key “${key}”: by default ${JSON.stringify(c.party[key])}, a play with no choices carries ${JSON.stringify(value)}`);
  }
  for (const ref of [...c.points, ...c.offers]) {
    if (!scene.objects.has(ref.split('#')[0])) miss(notes, `the point “${ref}”: no such element in ${spec}`);
  }
  for (const ref of c.offers) {
    const o = scene.objects.get(ref.split('#')[0]);
    if (o && !o.name) miss(notes, `the offer “${ref}”: the element has no name (${spec})`);
  }
}
for (const folder of Object.values(SCENES)) if (!WORLD.has(folder)) miss('story.js', `the scene “${folder}” (SCENES) is not in the world`);

// --- the game's own files
const CHAPTERS = [];
for (const name of ['prologue', '1', '2', '3', '4', '5', 'epilogue']) {
  const file = `chapters/${name}.js`;
  if (!existsSync(join(game, file))) { miss(file, 'no file'); continue; }
  const ch = (await load(file)).default;
  CHAPTERS.push({ file, ...ch });
  if (!Array.isArray(ch.choices)) throw new Error(`${file}: no choices`);
  if (!Array.isArray(ch.titles) || ch.titles.length !== ch.steps.length) miss(file, `titles: ${ch.titles?.length ?? 'none'}, steps: ${ch.steps.length}`);
}
const GAMES = new Map(); // a minigame (the module's default export) → {file, name, source}
const games = existsSync(join(game, 'minigames')) ? readdirSync(join(game, 'minigames')).filter(f => f.endsWith('.js')) : [];
for (const entry of games) {
  const file = `minigames/${entry}`, name = entry.slice(0, -3), m = (await load(file)).default;
  const source = readFileSync(join(game, file), 'utf8');
  GAMES.set(m, { file, name, source });
  const T = MINIGAMES[name];
  if (!T) { miss(file, 'the minigame is not in the table of game.md §7'); continue; }
  if (typeof m.title !== 'string' || !(m.about > 0) || typeof m.run !== 'function') miss(file, 'no title, about or run');
  if (!m.skipped || !same(Object.keys(m.skipped), T.result)) miss(file, `skipped: the fields {${Object.keys(m.skipped ?? {}).join(', ')}}, the result in §7 {${T.result.join(', ')}}`);
  for (const key of T.opts ?? []) if (!new RegExp(`\\b${key}\\b`).test(source)) miss(file, `the opts field “${key}” (§7) is not named in the file`);
  for (const [, s] of source.matchAll(/\bsound\.(\w+)/g)) if (!(s in sound) || !(s in sound.unheard().sounds)) miss(file, `the sound “${s}” is not in sound.js or in unheard()`);
}
for (const name in MINIGAMES) if (![...GAMES.values()].some(m => m.name === name)) miss(`minigames/${name}.js`, 'no file');
// every sound has its unheard twin; and the names game.md §8 lists
const SOUNDS = ['beds', 'wake', 'pause', 'unheard', 'sea', 'cicadas', 'crowd', 'wind', 'crickets', 'wires', 'steam', 'snow', 'thaw',
  'room', 'hall', 'weep', 'band', 'piano', 'tuning', 'bark', 'yap', 'growl', 'clink', 'heart', 'knife', 'horn', 'bell', 'whistle',
  'wheels', 'sleigh', 'gate', 'door', 'pour', 'spill', 'paper', 'watch'];
for (const name of SOUNDS) if (typeof sound[name] !== 'function') miss('sound.js', `no “${name}” (game.md §8)`);
const quiet = sound.unheard?.() ?? { sounds: {} };
const quietNames = Object.keys(quiet.sounds ?? {});
for (const name of quietNames) if (typeof sound[name] !== 'function') miss('sound.js', `the sound “${name}” is in unheard() but not in sound.js`);
for (const name in sound) {
  if (typeof sound[name] === 'function' && !['pause', 'unheard', 'wake'].includes(name) && !quietNames.includes(name)) miss('sound.js', `the sound “${name}” is not in unheard()`);
}
for (const handle of ['band', 'piano']) {
  const h = quiet.sounds?.[handle]?.('waltz');
  if (!h || typeof h.loud !== 'function' || typeof h.stop !== 'function') miss('sound.js', `unheard().sounds.${handle}() — not a handle {loud, stop}`);
}
// “Lights”, the map, as game.js opens it
const lights = WORLD.get(SCENES.lights);
if (lights) {
  for (const key of MAP.keys) {
    if (!(key in lights.states)) miss('game.js', `“${SCENES.lights}”: states has no key “${key}”`);
    if (lights.contract?.keys && !(key in lights.contract.keys)) miss('game.js', `“${SCENES.lights}”: the contract’s keys have no key “${key}”`);
    lights.named.add(`party:${key}`);
  }
  for (const ref of MAP.points) {
    if (lights.contract && !lights.contract.points.includes(ref)) miss('game.js', `“${SCENES.lights}”: the point “${ref}” is not in the contract`);
    lights.named.add(`ref:${ref}`);
  }
}

// --- a step's g, watched: `here` — where it is (file, step), `events` — what the step did, in order:
// ['scene', folder] | ['beat', name, seconds] | ['say', seconds] | ['act'] | ['letter'] | ['play', name, about];
// `seen` — what the play did that the endings are checked by (ENDS)
const lines = new Map(); // `${who}\n${text}` → {who, text, where}
const mute = () => ({ loud() {}, stop() {} });
function watched(g, j, ch, here, events, seen) {
  const bad = text => miss(here, text);
  let cur = null; // the scene shown: {folder, scene, last: the beat begun last, opening: the beat it was opened with, not taken up yet, next: beat_next set, nexts: the g.next said since the last beat began}
  let during = false; // a minigame is on: what is said now is said inside it
  let waits = []; // the moments waited for whose beat has not begun yet: {text, beat}
  const shown = what => (cur ? true : (bad(`${what} — before g.scene`), false));
  const key = (name, what, game) => {
    if (!shown(`${what} «${name}»`)) return;
    if (!(name in cur.scene.states)) bad(`${what}: the key “${name}” is not in the states of the scene “${cur.folder}”`);
    else if (game && cur.scene.contract?.keys && !(name in cur.scene.contract.keys) && name !== 'beat') bad(`${what}: the key “${name}” is not in the contract keys of the scene “${cur.folder}”`);
  };
  const element = (ref, what) => {
    const o = cur.scene.objects.get(ref.split('#')[0]);
    if (!o) bad(`${what}: the element “${ref.split('#')[0]}” is not in the scene “${cur.folder}”`);
    return o;
  };
  const point = (ref, what) => {
    element(ref, what);
    cur.scene.named.add(`ref:${ref}`);
    if (cur.scene.contract && !cur.scene.contract.points.includes(ref) && !cur.scene.contract.offers.includes(ref)) bad(`${what}: the point “${ref}” is not in the points of the scene “${cur.folder}”`);
  };
  const offer = (ref, what) => {
    const o = element(ref, what);
    if (o && !o.name) bad(`${what}: the element “${o.id}” has no name`);
    cur.scene.named.add(`ref:${ref}`);
    if (cur.scene.contract && !cur.scene.contract.offers.includes(ref)) bad(`${what}: the offer “${ref}” is not in the offers of the scene “${cur.folder}”`);
  };
  const moment = (text, what) => {
    const c = cur.scene.contract, beat = text.split(':')[0];
    cur.scene.named.add(`tell:${text}`);
    if (c && !c.beats[beat]?.tells.includes(text)) bad(`${what}: the beat “${beat}” of the scene “${cur.folder}” has no moment “${text}”`);
  };
  const begins = (name, opening) => {
    const c = cur.scene.contract, beat = c?.beats[name];
    events.push(['beat', name, beat?.seconds ?? 0]);
    seen.beats.add(name);
    cur.scene.named.add(`beat:${name}`);
    if (c && !beat) bad(`the scene “${cur.folder}” has no beat “${name}”`);
    if (beat?.show === true) bad(`the beat “${name}” of the scene “${cur.folder}” is for the showcase only (show: true)`);
    // a beat not opening the scene: after one of its `after`, or a cut-beat — the next in the table after the one
    // before it, or the one beat_next named (game.md §4)
    if (!opening && cur.last && beat && !beat.after.includes(cur.last)) {
      const next = cur.scene.order[cur.scene.order.indexOf(cur.last) + 1];
      if (name !== next && cur.next !== name) put(cuts, here, `“${cur.folder}”: ${cur.last} → ${name} — a cut not by the table and without beat_next`);
    }
    if (cur.next === name) cur.next = null;
    // (§3.9: every beat but the one the scene opens with — g.next of it before, no other g.next between)
    if (!opening && (cur.nexts.at(-1) !== name)) bad(`g.beat “${name}”: ${cur.nexts.length ? `the g.next before it named “${cur.nexts.at(-1)}”` : 'no g.next of it before it'} (game.md §3.9)`);
    cur.nexts = [];
    for (const w of waits.filter(w => w.beat === name)) if (!w.end) moment(w.text, 'g.told');
    waits = waits.filter(w => w.beat !== name);
    cur.last = name;
  };
  j.sounds = new Proxy(j.sounds, {
    get(q, name) {
      if (typeof name !== 'string') return q[name];
      const known = n => {
        if (n in sound && n in q) return true;
        bad(`the sound “${n}” is not in sound.js or in unheard()`);
        return false;
      };
      if (name === 'beds') return (levels = {}, seconds) => { Object.keys(levels).forEach(known); q.beds(levels, seconds); };
      return known(name) ? q[name] : mute;
    },
  });
  const w = Object.create(g);
  Object.assign(w, {
    async scene(folder, st = {}, how) {
      const scene = WORLD.get(folder), party = carry(folder, facts(g.state));
      if (!party) bad(`g.scene “${folder}”: no such scene in SCENES`);
      if (scene && party) {
        cur = { folder, scene, last: null, opening: typeof st.beat === 'string' ? st.beat : null, next: null, nexts: [] };
        events.push(['scene', folder]);
        const carried = {};
        for (const k in party) {
          scene.named.add(`party:${k}`);
          if (!(k in scene.states)) bad(`the party key “${k}” is not in the states of the scene “${folder}”`);
          if (scene.contract && !(k in scene.contract.party)) bad(`the party key “${k}” is not in the party of the scene “${folder}”`);
          carried[k] = party[k];
        }
        seen.carried[folder] = { ...carried, beat: st.beat };
        (seen.opened[folder] ??= []).push({ ...carried, beat: st.beat });
        // (a key the step itself opens the scene with: in states; a party key named so is named too)
        for (const k in st) { if (k !== 'beat') key(k, 'g.scene'); scene.named.add(`party:${k}`); }
        if (cur.opening) begins(cur.opening, true);
        else bad(`the scene “${folder}” is opened without a beat`);
      } else if (!scene) {
        cur = null;
        events.push(['scene', folder]);
      }
      return g.scene(folder, st, how); // (a scene the world lacks: the step breaks there — said)
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
      else if (cur?.last === beat) { moment(text, 'g.told'); bad(`g.told “${text}” is set after its beat has begun (for the beat the scene is opened with — after g.scene)`); }
      else waits.push({ text, beat });
      return g.told(text, ms);
    },
    set(k, value, seconds) {
      key(k, 'g.set', true);
      if (k === 'beat_next' && cur) { cur.next = value; cur.nexts.push(value); }
      if (cur) (seen.set[cur.folder] ??= {})[k] = value;
      return g.set(k, value, seconds);
    },
    get(k) { key(k, 'g.get'); return g.get(k); },
    next(name) {
      if (shown(`g.next «${name}»`)) {
        key('beat_next', 'g.next');
        if (cur.scene.contract && !(name in cur.scene.contract.beats)) bad(`g.next “${name}”: the scene “${cur.folder}” has no such beat`);
        cur.next = name;
        cur.nexts.push(name);
      }
      return g.next(name);
    },
    move(k, value, seconds, ease) { key(k, 'g.move', true); if (cur) (seen.set[cur.folder] ??= {})[k] = value; return g.move(k, value, seconds, ease); },
    when(k, test, ms) { key(k, 'g.when'); return g.when(k, test, ms); },
    watch(k, fn) { key(k, 'g.watch'); return g.watch(k, fn); },
    arrived(who, ms) { if (shown(`g.arrived «${who}»`)) element(who, 'g.arrived'); return g.arrived(who, ms); },
    say(who, text, at = who) {
      const what = `the line “${text}”`;
      if (!(who in PEOPLE)) bad(`${what}: the speaker “${who}” is not in people.json`);
      if (typeof text !== 'string' || typeof who !== 'string') bad(`${what}: not a string`);
      const n = LINE.get(`${who}\n${text}`);
      if (!n) {
        const near = LINES.find(l => l[2] === text);
        bad(near ? `${what}: in §8 this is L${String(near[0]).padStart(2, '0')} of “${near[1]}”, not of “${who}”` : `${what} (${who}): no such line in §8, letter for letter`);
      } else seen.lines.add(n);
      if (at !== 'narrator' && cur) {
        if (at.includes('#')) point(at, what);
        else if (element(at, what)) cur.scene.named.add(`ref:${at}`);
      }
      if (!lines.has(`${who}\n${text}`)) lines.set(`${who}\n${text}`, { who, text, where: here, n });
      if (!during) events.push(['say', 0.3 + 0.06 * text.length]);
      return g.say(who, text, at);
    },
    choose(choice, offers) {
      const what = `the choice “${choice ?? Object.keys(offers).join(', ')}”`, ids = Object.values(offers).flat().map(o => o.id);
      if (shown(what)) for (const ref in offers) offer(ref, what);
      if (choice != null) {
        const declared = ch.choices.find(c => c.id === choice);
        if (!declared) bad(`${what}: it is not in the chapter's choices`);
        else {
          if (!same(ids, declared.options.map(o => o.id))) bad(`${what}: offered {${ids.join(', ')}}, in the chapter's choices {${declared.options.map(o => o.id).join(', ')}}`);
          for (const o of Object.values(offers).flat()) {
            const d = declared.options.find(x => x.id === o.id);
            if (d && d.label !== o.label) bad(`${what}: the petal “${o.label}”, in the chapter's choices “${d.label}”`);
          }
        }
      }
      events.push(['act']);
      return g.choose(choice, offers);
    },
    async letter(letter) {
      events.push(['letter']);
      if (typeof letter?.text !== 'string' || typeof letter?.voice !== 'function') bad('g.letter: no text or no voice (game.md §3.6: its words are heard too)');
      const r = await g.letter(letter);
      // (its voice: said here, so that its line is heard)
      if (typeof letter?.voice === 'function') { during = true; await letter.voice(); during = false; }
      return r;
    },
    async play(minigame, opts = {}) {
      const m = GAMES.get(minigame), T = m && MINIGAMES[m.name];
      if (!T) {
        bad('g.play: the minigame is not from minigames/ or not in §7');
        return g.play(minigame, opts);
      }
      const what = `the minigame “${m.name}”`;
      events.push(['play', m.name, minigame.about ?? 0]);
      seen.played.add(m.name);
      if (shown(what)) {
        if (cur.folder !== SCENES[T.scene]) bad(`${what} is played in the scene “${cur.folder}”, in §7 — “${SCENES[T.scene]}”`);
        else {
          for (const k of T.keys) key(k, what, true);
          for (const k of T.listens ?? []) key(k, what);
          for (const ref of T.points ?? []) point(ref, what);
        }
      }
      for (const k in opts) {
        if (!(T.opts ?? []).includes(k)) bad(`${what}: the opts field “${k}” is not in §7`);
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
  return { g: w, left: () => waits.forEach(t => bad(`g.told “${t.text}”: the beat “${t.beat}” did not begin after it in the step`)) };
}

// --- the agreement of the ending with what the play did (game.md §11 "The ending's agreement"): each a name and the
// sides that must all be true or all false
const said = (s, n) => s.lines.has(n);
const carried = (s, folder, key, beat) => {
  const all = s.opened[folder] ?? [], at = beat ? all.filter(o => o.beat === beat) : all;
  return at.length ? at.at(-1)[key] : undefined;
};
const ENDS = [
  ['“Two cages”', (f, s) => [f.ending === 'cages', said(s, 101)]],
  ['his wife knows', (f, s) => [f.wife === 'truth', said(s, 86), said(s, 87), said(s, 102), s.played.has('counsel') && carried(s, SCENES.bazaar, 'wife_knows') === 1, carried(s, SCENES.moscow, 'wife_knows', 'porch_end') === 1]],
  ['his wife does not', (f, s) => [f.wife === 'lie', said(s, 85)]],
  ['her husband knows', (f, s) => [f.husband === 'truth', said(s, 80), said(s, 82), said(s, 104), said(s, 105), carried(s, SCENES.bazaar, 'husband_knows') === 1, carried(s, SCENES.town, 'husband_knows', 'fence_end') === 1]],
  ['her husband does not', (f, s) => [f.husband === 'lie', said(s, 78), said(s, 114)]],
  ['“Her husband knows”, and he alone', (f, s) => [f.ending === 'husband', said(s, 104) && !said(s, 102)]],
  ['“His wife knows”, and she alone', (f, s) => [f.ending === 'wife', said(s, 103)]],
  ['“No lies”', (f, s) => [f.ending === 'open', said(s, 102) && said(s, 104)]],
  ['she ate — he ate at the table', (f, s) => [f.eat, said(s, 36), s.beats.has('melon_eat')]],
  ['he called the dog', (f, s, st) => [f.talk, st.marks.maid === true, carried(s, SCENES.theatre, 'talk') !== 0 && s.beats.has('interval_stay')]],
  ['she sent him away — till spring', (f, s) => [f.spring, said(s, 74), said(s, 76)]],
];
// --- the walk
const b = page(WORLD, text => miss('b.trouble', text));
// one play: its choices, the results put in → {ending, chapters: [[events of each step]], state}
async function walk(choices, results) {
  const sides = []; // the scales after each step: [file, step, {heart, anna}]
  const result = m => {
    const name = GAMES.get(m)?.name;
    return results[name] && { ...m.skipped, ...results[name] };
  };
  let came = fresh();
  const seen = { lines: new Set(), beats: new Set(), played: new Set(), opened: {}, carried: {}, set: {} };
  const chapters = [];
  for (const ch of CHAPTERS) {
    const steps = [];
    for (const [n, step] of ch.steps.entries()) {
      const here = `${ch.file}, step ${n + 1} “${ch.titles?.[n] ?? ''}”`, events = [];
      const j = jump(Infinity, sound.unheard(), { result });
      const state = { ...structuredClone(came), choices: Object.assign(Object.create(choices), came.choices) };
      const { g, left } = watched(context(b, null, null, state, j), j, ch, here, events, seen);
      const done = await Promise.race([
        (async () => step(g))().then(() => true, e => { miss(here, `the step broke: ${e?.message || e}`); return true; }),
        j.idle.then(() => false),
      ]);
      if (!done) miss(here, 'the step did not get to its end dry: it waits for what an unseen step does not have');
      await j.idle; // (what the step began and did not wait for)
      left();
      // (§5: the spouses' choices move no scale)
      if ((ch.file === 'chapters/4.js' && n === 2) || (ch.file === 'chapters/5.js' && n === 0)) {
        for (const k in SCALES) if (g.state.scales[k] !== came.scales[k]) miss(here, `the scale “${k}” moved (${came.scales[k]} → ${g.state.scales[k]}): the spouses' choices move none`);
      }
      came = { ...g.state, choices: { ...g.state.choices } };
      sides.push([ch.file, n, { ...came.scales }]);
      steps.push(events);
    }
    chapters.push(steps);
  }
  const f = facts(came);
  // (§5: where a side is read it is never the undecided 0 — heart odd once I.1 is played, anna once II.4)
  for (const [file, n, sc] of sides) {
    const after = (f2, k) => sides.findIndex(([x, m]) => x === f2 && m === k);
    const i = sides.findIndex(([x, m]) => x === file && m === n);
    if (i >= after('chapters/1.js', 0) && sc.heart % 2 === 0) miss(`${file}, step ${n + 1}`, `the scale heart is even (${sc.heart}) after I.1`);
    if (i >= after('chapters/2.js', 3) && sc.anna % 2 === 0) miss(`${file}, step ${n + 1}`, `the scale anna is even (${sc.anna}) after II.4`);
  }
  for (const [name, test] of ENDS) {
    const sides = test(f, seen, came);
    if (!sides.every(x => x === sides[0])) miss('the ending\'s agreement', `${name}: ${sides.map(x => (x ? 'yes' : 'none')).join(' / ')} (ending ${f.ending})`);
  }
  return { ending: f.ending, chapters, lines: seen.lines };
}
const CHOICES = CHAPTERS.flatMap(ch => ch.choices);
const combos = CHOICES.reduce((all, c) => all.flatMap(made => c.options.map(o => ({ ...made, [c.id]: o.id }))), [{}]);
const plays = [];
for (const [i, choices] of combos.entries()) { play = plays.length; plays.push(await walk(choices, i % 2 ? {} : FLAWED)); }
for (const other of OTHER) { play = plays.length; plays.push(await walk(combos[1], other)); }
play = null;

// --- the report
const out = [];
const print = (text = '') => out.push(text);
const met = set => (set.size && set.size < plays.length ? ` (plays: ${set.size})` : '');
const clock = s => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;
const span = all => { const lo = Math.min(...all), hi = Math.max(...all); return lo === hi ? clock(lo) : `${clock(lo)}…${clock(hi)}`; };
const seconds = events => events.reduce((sum, e) => sum + (e[0] === 'beat' || e[0] === 'play' ? e[2] : e[0] === 'say' ? e[1] : 0), 0);
const withActs = (events, ch) => seconds(events) + events.reduce((sum, e) => sum + (e[0] === 'act' ? ACT : e[0] === 'letter' ? LETTER : 0), 0);

print(`World: ${world} — ${WORLD.size} scenes. Game: ${CHAPTERS.length} chapters, ${CHAPTERS.reduce((n, ch) => n + ch.steps.length, 0)} steps, ${CHOICES.length} choices.`);
print(`Plays: ${plays.length} (${combos.length} combinations of choices — the even ones with the minigames' other sides, the odd ones skipped — and one each with ${OTHER.map(o => JSON.stringify(o)).join(', ')}).`);

print(`\n== Discrepancies: ${misses.size} ==`);
for (const [text, set] of misses) print(`${text}${met(set)}`);

print(`\n== Cuts inside a scene not by the table and without beat_next: ${cuts.size} ==`);
for (const [text, set] of cuts) print(`${text}${met(set)}`);

print('\n== In the scenes\' contracts, named by no play ==');
for (const [folder, scene] of WORLD) {
  const c = scene.contract;
  if (!c) continue;
  const left = [
    ...Object.entries(c.beats).filter(([name, beat]) => beat.show !== true && !scene.named.has(`beat:${name}`)).map(([name]) => `beat ${name}`),
    ...[...new Set(Object.values(c.beats).flatMap(beat => beat.tells))].filter(t => !scene.named.has(`tell:${t}`)).map(t => `moment ${t}`),
    ...Object.keys(c.party).filter(k => !scene.named.has(`party:${k}`)).map(k => `party key ${k}`),
    ...[...new Set([...c.points, ...c.offers])].filter(ref => !scene.named.has(`ref:${ref}`)).map(ref => `point ${ref}`),
  ];
  print(`${folder}: ${left.join('; ') || '—'}`);
}

const never = LINES.filter(([n]) => !plays.some(p => p.lines.has(n)));
print(`\n== Lines of §8 said in no play: ${never.length} ==`);
for (const [n, who, text] of never) print(`L${String(n).padStart(2, '0')} ${who} | ${text}`);

print(`\n== Lines: ${lines.size} (№ | who | voice | text | ≈ s) — the voices are recorded from them ==`);
for (const line of [...lines.values()].sort((a, z) => (a.n ?? 999) - (z.n ?? 999))) {
  print(`${line.n ? `L${String(line.n).padStart(2, '0')}` : '—'} | ${line.who} | ${PEOPLE[line.who]?.voice ?? '?'} | ${line.text} | ${(0.3 + 0.06 * line.text.length).toFixed(1)}`);
}

print(`\n== Beats and time by ending (beats — the contract's seconds, lines — 0.3 s + 0.06 s a letter, minigames — about; in brackets — with the touches and choices at ${ACT} s, letters at ${LETTER} s and the map at ${MAP_S} s) ==`);
const mapsOf = () => CHAPTERS.reduce((n, ch) => n + (ch.wall !== false ? 1 : 0), 0) + 1;
for (const ending of ENDINGS) {
  const mine = plays.filter(p => p.ending === ending.id);
  print(`\n-- ${ending.label} (${ending.id}): ${mine.length} plays --`);
  if (!mine.length) continue;
  const times = mine.map(p => p.chapters.map(steps => seconds(steps.flat())));
  const full = mine.map(p => p.chapters.reduce((sum, steps) => sum + withActs(steps.flat()), 0) + mapsOf() * MAP_S);
  print(`time: ${CHAPTERS.map((ch, c) => `${ch.number || ch.title} ${span(times.map(t => t[c]))}`).join(' · ')} · in all ${span(times.map(t => t.reduce((a, x) => a + x, 0)))} (${span(full)})`);
  for (const [c, ch] of CHAPTERS.entries()) {
    for (const n of ch.steps.keys()) {
      const ways = new Map();
      for (const p of mine) {
        const events = p.chapters[c][n];
        const way = `${events.filter(e => e[0] !== 'say' && e[0] !== 'act' && e[0] !== 'letter').map(e => (e[0] === 'scene' ? `| ${e[1]}:` : e[0] === 'play' ? `[${e[1]}]` : e[1])).join(' ').replace(/^\| /, '') || '—'} — ${Math.round(seconds(events))} s`;
        ways.set(way, (ways.get(way) ?? 0) + 1);
      }
      for (const [way, count] of ways) print(`${ch.file} ${n + 1} «${ch.titles?.[n] ?? ''}»: ${way}${count < mine.length ? ` (plays: ${count})` : ''}`);
    }
  }
}

// a stretch of watching: from one thing the player does (a press on the map, a choice, a letter, a minigame) to the
// next. The map stands before a chapter unless it says wall: false (game.js)
const long = new Map(); // `${from} → ${to}` → [seconds of each play it is long in]
for (const p of plays) {
  let run = 0, from = 'the beginning';
  const acted = to => {
    if (run > WATCH) long.set(`${from} → ${to}`, [...(long.get(`${from} → ${to}`) ?? []), run]);
    run = 0;
    from = to;
  };
  for (const [c, ch] of CHAPTERS.entries()) {
    if (ch.wall !== false) acted(`the map before ${ch.file}`);
    for (const [n, events] of p.chapters[c].entries()) {
      for (const e of events) {
        if (e[0] === 'beat') run += e[2];
        else if (e[0] === 'say') run += e[1];
        else if (e[0] !== 'scene') acted(`${ch.file}, step ${n + 1} “${ch.titles?.[n] ?? ''}”`);
      }
    }
  }
  acted('the end');
}
print(`\n== Watching with nothing to do longer than ${WATCH} s: ${long.size} ==`);
for (const [where, all] of long) print(`${where}: ${span(all)} (plays: ${all.length})`);

// (a dry run's clock — jump.js — keeps the process alive: leave once all is written)
process.stdout.write(`${out.join('\n')}\n`, () => process.exit(misses.size || cuts.size ? 1 : 0));
