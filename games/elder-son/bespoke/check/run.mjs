// The check of the game's branches (game.md §11): node bespoke/check/run.mjs <a clone of the world>. No browser, no
// engine, nothing drawn. Every step of every chapter is played unseen, the way the author's map plays it (jump.js: a dry
// run, story.js context(…, j)), on a page that only knows the scenes' specs (fake.mjs): no time passes, the choices
// are those of the play walked, a minigame gives the result put in for it (else its `skipped`).
// Walked: every combination of the ten choices (1792: `crossing` three ways; `kudimov` three at `crossing` truth, else
// two) with every minigame skipped; and two plays with "live" results on both edges (EDGES), each over three plays of
// choices that between them take every option (their results do not change the choices but do change the keys —
// heard, snowy, seen, torn, shed_left, late_run, knocked: each must reach its scene). And every step alone, from an
// empty play (steps skipped: facts' defaults). Each play — all 22 steps in order, its state going from step to step.
// Noted, by a wrapper over the step's g (an unseen step's lines and offers never reach j) and over the sounds j plays:
// each scene opened and its keys (the party's too), each beat, moment waited for, key set / moved / read (beat_next
// too), offer and its options, line (who, text, over what), minigame with its opts and the fields of its result the
// chapter reads, sound. After each g.play every function of its opts is called once: the lines the minigames say are
// heard.
// Compared with each scene's scene.json and the block “Contract for the check” that ends its notes.md (scenes.md
// “Common”): {beats: {name: {after, tells, seconds, show}}, points, offers, party, acts: {key: {values, tells}}}; with
// the minigames' table (§7, MINIGAMES below) and the moments their files wait for; people.json, sound.js and its unheard(),
// the lines of §8 (lines.mjs) letter for letter; and the logic of the play (LOGIC below: one ending, the scales within
// their bounds, every mark read in facts, the lines said only on their condition, who comes to the platform, the
// clarinet's phrase, no b.offer). “The Yard” — the map's background (game.js, not run here): its keys and points.
// Printed: what does not match (file, step, name) — a scene the world lacks is said, the walk goes on; the cuts inside
// a scene not by its table and without beat_next; what the contracts have and no play named; the lines of §8 no play
// said; every line said (who, text) once — the voices are made from this list; for each ending and who stands on the
// platform's stairs — the beats of every step and the time by chapter and in all (the beats' `seconds`, the lines said
// in the pauses between beats at 0.3 s + 0.06 s a letter, the minigames' `about`; 8 s a choice, 1 s a scene's opening,
// 12 s the map); every stretch of watching with nothing to do longer than 90 s.
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
const { SCENES, SCALES, EFFECTS, ENDINGS, facts, carry, context } = await load('story.js');
const { jump } = await load('jump.js');
const sound = await load('sound.js');

const WATCH = 90; // a stretch of watching longer than this, s, is reported
const several = (stem, n, tail = '', from = 1) => Array.from({ length: n }, (_, i) => `${stem}${i + from}${tail}`);
// The minigames (game.md §7): the scene a minigame is played on, the keys it moves and those it only listens to, the
// points its marks stand on, the fields of its opts and of its result
const MINIGAMES = {
  windows: { scene: 'street', keys: ['knock', ...several('win', 5), 'snow'], points: several('win', 5), opts: ['refuse'], result: ['knocked'] },
  hands: { scene: 'home', keys: ['thaw', 'rub'], points: ['hands#hands'], result: ['seconds'] },
  tea: { scene: 'home', keys: ['which', 'pour', 'glass1', 'glass2', 'spill', 'shake'], points: ['tea#glass1', 'tea#glass2'], opts: ['ask'], result: ['spills'] },
  snuffbox: { scene: 'home', keys: [...several('finger', 4), 'old', 'push', 'old_close'],
    points: [...several('box#finger', 4), 'box#box', 'box#old'], opts: ['mode'], result: ['closed', 'seconds'] },
  tiptoe: { scene: 'home', keys: ['sneak', 'stir'], listens: ['sneak_at'], points: ['clock#face'], result: ['creaks'] },
  frost: { scene: 'home', keys: ['hole', 'far_train'], points: ['window#pane'], result: ['hole'] },
  'arm-in-arm': { scene: 'hill', keys: ['down', 'catch', 'fall'], listens: ['down_at'], points: ['sarafanov#shoulder_l'], result: ['falls'] },
  following: { scene: 'hill', keys: ['sar_go', 'follow', 'hold', 'duck'], listens: ['follow_at', 'sar_at'], points: ['sarafanov#chest'], result: ['seen'] },
  rucksack: { scene: 'platform', keys: ['pull', 'grip', 'door_bg'], points: ['strap#grip'], result: ['slips'] },
  buckets: { scene: 'street', keys: ['buckets', 'fire'], points: ['barrel', 'shed'], result: ['buckets'] },
  coat: { scene: 'street', keys: ['lay'], points: ['shawl#coat', 'shawl#shoulders'], result: ['seconds'] },
  running: { scene: 'street', keys: ['run', 'look_back'], listens: ['run_at'], points: ['busygin'], result: ['seconds', 'looks'] },
  glass: { scene: 'platform', keys: ['wipe'], points: ['train_window#pane'], result: ['wipe'] },
};
// game.md §3.4: what game.js itself takes of “The Yard”, the map's background (it is not run here): its keys, the points
// its trees stand at (map.js) — each chapter's, the finale's (c7) and the author's sign's
const MAP = { keys: ['shown', 'come'], points: [...Array.from({ length: 8 }, (_, i) => `c${i}`), 'author'] };
// the "live" results put in (game.md §11): both edges
const EDGES = [
  { windows: { knocked: [] }, tea: { spills: 1 }, tiptoe: { creaks: 0 }, frost: { hole: 0 }, 'arm-in-arm': { falls: 0 }, following: { seen: 0 },
    rucksack: { slips: 0 }, buckets: { buckets: 0 }, running: { looks: 0 }, glass: { wipe: 0.3 } },
  { windows: { knocked: [1, 2, 3, 4, 5] }, tea: { spills: 2 }, tiptoe: { creaks: 2 }, frost: { hole: 1 }, 'arm-in-arm': { falls: 1 }, following: { seen: 1 },
    rucksack: { slips: 2 }, buckets: { buckets: 3 }, running: { looks: 3 }, glass: { wipe: 1 } },
];
// the script's length (game.md §11): a choice, a scene's opening, the map
const ACT = 8, OPEN = 1, MAP_S = 12;

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
  if (!Object.values(SCENES).includes(folder)) { miss(spec, `the scene “${folder}” is not in the game's SCENES (the game does not play it)`); continue; }
  try {
    if (!existsSync(join(world, notes))) throw new Error('no such file');
    const c = contract(readFileSync(join(world, notes), 'utf8'));
    if (!c) throw new Error('the contract\'s block is empty');
    const shaped = c.beats && typeof c.beats === 'object' && Array.isArray(c.points) && Array.isArray(c.offers) && c.party && typeof c.party === 'object';
    if (!shaped) throw new Error('the contract\'s block is not {beats, points, offers, party, acts}');
    if (c.acts == null) c.acts = {};
    if (typeof c.acts !== 'object') throw new Error('acts is not an object');
    scene.contract = c;
  } catch (e) {
    miss(notes, `the contract not read: ${e.message}`);
    continue;
  }
  const c = scene.contract;
  scene.order = Object.keys(c.beats); // the film's table, in order: a cut-beat is the next after the one before it
  if (Object.keys(c.beats).length && !('beat' in scene.states)) miss(spec, 'states has no key “beat”');
  if (Object.keys(c.beats).length && !('beat_next' in scene.states)) miss(spec, 'states has no key “beat_next”');
  for (const [name, beat] of Object.entries(c.beats)) {
    if (!Array.isArray(beat.after) || !Array.isArray(beat.tells)) { miss(notes, `the beat “${name}”: no after or tells`); beat.after ??= []; beat.tells ??= []; }
    if (!(beat.seconds > 0)) miss(notes, `the beat “${name}”: no seconds`);
    for (const a of beat.after) if (!(a in c.beats)) miss(notes, `the beat “${name}”: its after names the beat “${a}”, which is not there`);
    for (const t of beat.tells) if (!(t.includes(':') && t.split(':')[0] === name)) miss(notes, `the beat “${name}”: the moment “${t}” is not named “${name}:<moment>”`);
  }
  for (const [key, act] of Object.entries(c.acts)) {
    if (!(key in scene.states)) miss(notes, `the action key “${key}” is not in states (${spec})`);
    act.values ??= [];
    act.tells ??= [];
    for (const t of act.tells) if (!(t.includes(':') && t.split(':')[0] === key)) miss(notes, `the action key “${key}”: the moment “${t}” is not named “${key}:<moment>”`);
  }
  for (const key in c.party) if (!(key in scene.states)) miss(notes, `the play's key “${key}” is not in states (${spec})`);
  // (a key the play has not decided yet is carried as the scene's own default)
  for (const [key, value] of Object.entries(carry(folder, facts(fresh())) ?? {})) {
    if (!(key in c.party)) miss(notes, `the play's key “${key}” (game.md §5 carry) is not in the contract's party`);
    else if (JSON.stringify(c.party[key]) !== JSON.stringify(value)) miss(notes, `the play's key “${key}”: by default ${JSON.stringify(c.party[key])}, the game with no choices carries ${JSON.stringify(value)}`);
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
const sceneOf = name => WORLD.get(SCENES[name]);
// a moment the scene tells: of a beat, or of a key of action → whether the contract has it
const tells = (scene, text) => {
  const c = scene.contract, [head] = text.split(':');
  return !c || (c.beats[head]?.tells.includes(text) ?? false) || (c.acts[head]?.tells.includes(text) ?? false);
};

// --- the game's own files
const CHAPTERS = [];
for (const name of ['prologue', '1', '2', '3', '4', '5', 'epilogue']) {
  const file = `chapters/${name}.js`;
  if (!existsSync(join(game, file))) { miss(file, 'no such file'); continue; }
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
  if (/\bg\.state\b/.test(source)) miss(file, 'the minigame touches g.state (§7: it does not)');
  if (/\bg\.say\(/.test(source)) miss(file, 'the minigame says lines of its own (§7: the chapter gives them through opts)');
  // what it sets and waits for in its scene: the keys of §7 and the moments of the scene's contract
  const scene = sceneOf(T.scene);
  if (scene) {
    for (const k of [...T.keys, ...(T.listens ?? [])]) if (!(k in scene.states)) miss(file, `the key “${k}” is not in the states of the scene “${SCENES[T.scene]}”`);
    for (const ref of T.points) {
      scene.named.add(`ref:${ref}`);
      if (scene.contract && !scene.contract.points.includes(ref) && !scene.contract.offers.includes(ref)) miss(file, `the point “${ref}” is not in the points of the scene “${SCENES[T.scene]}”`);
    }
    for (const [, text] of source.matchAll(/\btold\(\s*['"`]([^'"`]+)['"`]/g)) {
      scene.named.add(`tell:${text}`);
      if (!tells(scene, text)) miss(file, `the moment “${text}” is not in the contract of the scene “${SCENES[T.scene]}” (neither a beat's nor in acts)`);
    }
    for (const [, k, v] of source.matchAll(/\b(?:send|g\.set)\(\s*['"`](\w+)['"`]\s*,\s*['"`]([^'"`]+)['"`]/g)) {
      const act = scene.contract?.acts[k];
      if (act && !act.values.includes(v)) miss(file, `the value “${v}” of the action key “${k}” is not in the acts of the scene “${SCENES[T.scene]}”`);
    }
  }
}
for (const name in MINIGAMES) if (![...GAMES.values()].some(m => m.name === name)) miss(`minigames/${name}.js`, 'no such file');
// every sound has its unheard twin; and the names game.md §8 lists
const SOUNDS = ['beds', 'wake', 'pause', 'unheard', 'wind', 'rails', 'train', 'freight', 'crossing', 'room', 'clock', 'fire', 'crowd', 'pour',
  'horn', 'doors', 'knock', 'dog', 'door', 'creak', 'cough', 'tick', 'strike', 'rub', 'spill', 'box', 'glass', 'splash', 'crunch', 'thud',
  'scrape', 'clarinet', 'march', 'dance'];
for (const name of SOUNDS) if (typeof sound[name] !== 'function') miss('sound.js', `no “${name}” (game.md §8)`);
const quiet = sound.unheard?.() ?? { sounds: {} };
const quietNames = Object.keys(quiet.sounds ?? {});
for (const name of quietNames) if (typeof sound[name] !== 'function') miss('sound.js', `the sound “${name}” is in unheard(), but not in sound.js`);
for (const name in sound) {
  if (typeof sound[name] === 'function' && !['pause', 'unheard', 'wake'].includes(name) && !quietNames.includes(name)) miss('sound.js', `the sound “${name}” is not in unheard()`);
}
{
  const h = quiet.sounds?.march?.();
  if (!h || typeof h.loud !== 'function' || typeof h.stop !== 'function') miss('sound.js', 'unheard().sounds.march() is not a handle {loud, stop}');
}
// “The Yard”, as game.js opens it: the map's keys, its points (elements of the scene)
const yard = WORLD.get(SCENES.yard);
if (yard) {
  for (const key of MAP.keys) {
    if (!(key in yard.states)) miss('game.js', `“${SCENES.yard}”: the key “${key}” is not in states`);
    if (yard.contract && !(key in (yard.contract.keys ?? {}))) miss('game.js', `“${SCENES.yard}”: the contract’s keys have no key “${key}”`);
    yard.named.add(`party:${key}`);
  }
  for (const ref of MAP.points) {
    if (yard.contract && !yard.contract.points.includes(ref)) miss('game.js', `“${SCENES.yard}”: the point “${ref}” is not in the contract`);
    yard.named.add(`ref:${ref}`);
  }
}
// no b.offer anywhere (on engine 3 a choice is the language of mini-games)
for (const file of ['game.js', 'story.js', 'ui.js', ...CHAPTERS.map(c => c.file), ...[...GAMES.values()].map(m => m.file)]) {
  if (existsSync(join(game, file)) && /\bb\.offer\(/.test(readFileSync(join(game, file), 'utf8'))) miss(file, 'b.offer: on engine 3 a choice is made in the language of mini-games');
}
// every mark is read in facts: itself, or the choice that set it (game.md §5)
{
  const reader = facts.toString();
  const marks = new Map([['knocked', null]]);
  for (const [choice, options] of Object.entries(EFFECTS)) for (const fx of Object.values(options)) for (const [key] of fx.marks ?? []) marks.set(key, choice);
  for (const [key, choice] of marks) {
    const self = new RegExp(`marks\\.${key}\\b`).test(reader), by = choice && new RegExp(`\\bc\\.${choice}\\b`).test(reader);
    if (!self && !by) miss('story.js facts', `facts does not read the mark “${key}” (nor its choice “${choice}”)`);
  }
}

// --- a step's g, watched: `here` — where it is (file, step), `events` — what the step did, in order:
// ['scene', folder] | ['beat', name, seconds] | ['say', seconds] | ['act'] | ['play', name, about];
// `seen` — what the play did that its logic is checked by (LOGIC)
const lines = new Map(); // `${who}\n${text}` → {who, text, where}
const mute = () => ({ loud() {}, stop() {} });
function watched(g, j, ch, here, events, seen) {
  const bad = text => miss(here, text);
  let cur = null; // the scene shown: {folder, scene, last: the beat begun last, opening: the beat it was opened with, not taken up yet, next: beat_next set}
  let during = false; // a minigame is on: what is said now is said inside it
  let open = 0; // beats begun and not yet waited for: a line said meanwhile is in the beat's own length
  let waits = []; // the moments waited for whose beat has not begun yet: {text, beat}
  const shown = what => (cur ? true : (bad(`${what} before g.scene`), false));
  const key = (name, what, value) => {
    if (!shown(`${what} «${name}»`)) return;
    if (!(name in cur.scene.states)) bad(`${what}: the key “${name}” is not in the states of the scene “${cur.folder}”`);
    const act = cur.scene.contract?.acts[name];
    if (act && typeof value === 'string' && !act.values.includes(value)) bad(`${what}: the value “${value}” of the action key “${name}” is not in the acts of the scene “${cur.folder}”`);
  };
  const element = (ref, what) => {
    const o = cur.scene.objects.get(ref.split('#')[0]);
    if (!o) bad(`${what}: no element “${ref.split('#')[0]}” in the scene “${cur.folder}”`);
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
    cur.scene.named.add(`tell:${text}`);
    if (!tells(cur.scene, text)) bad(`${what}: the beat “${text.split(':')[0]}” of the scene “${cur.folder}” has no moment “${text}”`);
  };
  const begins = (name, opening) => {
    const c = cur.scene.contract, beat = c?.beats[name];
    events.push(['beat', name, beat?.seconds ?? 0]);
    seen.beats.add(name);
    cur.scene.named.add(`beat:${name}`);
    if (c && !beat) bad(`no beat “${name}” in the scene “${cur.folder}”`);
    if (beat?.show === true) bad(`the beat “${name}” of the scene “${cur.folder}” is for the showcase only (show: true)`);
    // a beat not opening the scene: after one of its `after`, or a cut-beat — the next in the table after the one
    // before it, or the one beat_next named (game.md §4)
    if (!opening && cur.last && beat && !beat.after.includes(cur.last)) {
      const next = cur.scene.order[cur.scene.order.indexOf(cur.last) + 1];
      if (name !== next && cur.next !== name) put(cuts, here, `“${cur.folder}”: ${cur.last} → ${name}, a cut not by the table and without beat_next`);
    }
    // beat_next names the beat that truly comes next
    if (cur.next && cur.next !== name && !opening) bad(`beat_next “${cur.next}”, but “${name}” plays next (the scene “${cur.folder}”)`);
    cur.next = null;
    for (const w of waits.filter(w => w.beat === name)) moment(w.text, 'g.told');
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
      // (the clarinet's phrase: whether it resolves, and where — in the house, or from afar)
      if (name === 'clarinet' && known(name)) return (o = {}) => { seen.clarinet.push({ resolve: !!o.resolve, far: !!o.far }); return q.clarinet(o); };
      return known(name) ? q[name] : mute;
    },
  });
  const w = Object.create(g);
  Object.assign(w, {
    async scene(folder, st = {}, how) {
      const scene = WORLD.get(folder), party = carry(folder, facts(g.state));
      if (!party) bad(`g.scene “${folder}”: no such scene in SCENES`);
      events.push(['scene', folder]);
      if (scene && party) {
        cur = { folder, scene, last: null, opening: typeof st.beat === 'string' ? st.beat : null, next: null };
        const carried = {};
        for (const k in party) {
          scene.named.add(`party:${k}`);
          if (!(k in scene.states)) bad(`the play's key “${k}” is not in the states of the scene “${folder}”`);
          if (scene.contract && !(k in scene.contract.party)) bad(`the play's key “${k}” is not in the party of the scene “${folder}”`);
          carried[k] = party[k];
        }
        (seen.opened[folder] ??= []).push({ ...carried, ...st });
        // (a key the step itself opens the scene with: in states)
        for (const k in st) if (k !== 'beat') { key(k, 'g.scene', st[k]); scene.named.add(`party:${k}`); }
        if (cur.opening) begins(cur.opening, true);
        else bad(`the scene “${folder}” opened without a beat`);
      } else if (!scene) cur = null;
      return g.scene(folder, st, how); // (a scene the world lacks: the step breaks there — said)
    },
    beat(name, how) {
      if (shown(`g.beat «${name}»`)) {
        if (cur.opening !== name) begins(name, false);
        cur.opening = null;
      }
      const p = g.beat(name, how);
      if (how?.wait === false) return p;
      // (open till the chapter waits for it: a line said meanwhile is inside the beat)
      open++;
      let waited = false;
      return { then(ok, no) { if (!waited) { waited = true; open--; } return p.then(ok, no); } };
    },
    told(text, ms) {
      const [beat, name] = text.split(':');
      if (name == null) bad(`g.told “${text}”: not “<beat>:<moment>”`);
      else if (beat === 'beat') { /* (a beat's end) */ }
      else if (cur?.scene.contract?.acts[beat]) moment(text, 'g.told');
      else if (cur?.last === beat) { moment(text, 'g.told'); bad(`g.told “${text}” is made after its beat has begun (for the beat the scene opens with: after g.scene)`); }
      else waits.push({ text, beat });
      return g.told(text, ms);
    },
    set(k, value, seconds) {
      key(k, 'g.set', value);
      if (k === 'beat_next' && cur) {
        cur.next = value;
        if (value != null && cur.scene.contract && !(value in cur.scene.contract.beats)) bad(`beat_next “${value}”: no such beat in the scene “${cur.folder}”`);
      }
      if (cur) (seen.set[cur.folder] ??= {})[k] = value;
      return g.set(k, value, seconds);
    },
    get(k) { key(k, 'g.get'); return g.get(k); },
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
      if (!during && !open) events.push(['say', 0.3 + 0.06 * text.length]);
      return g.say(who, text, at);
    },
    choose(choice, offers) {
      const what = `the choice “${choice ?? Object.keys(offers).join(', ')}”`, ids = Object.values(offers).flat().map(o => o.id);
      if (shown(what)) for (const ref in offers) offer(ref, what);
      if (choice != null) {
        const declared = ch.choices.find(c => c.id === choice);
        if (!declared) bad(`${what}: not in the chapter's choices`);
        else {
          // (an option offered only on a condition — kudimov's third — may be left out)
          const all = declared.options.map(o => o.id);
          if (!ids.every(id => all.includes(id)) || ids.length < 2) bad(`${what}: offered {${ids.join(', ')}}, in the chapter's choices {${all.join(', ')}}`);
          for (const o of Object.values(offers).flat()) {
            const d = declared.options.find(x => x.id === o.id);
            // (the petal may say more than the map's word: “Say: “I'm his son”” for “I'm his son”, game.md §6)
            if (d && d.label !== o.label && !o.label.includes(d.label)) bad(`${what}: the petal “${o.label}”, in the chapter's choices “${d.label}”`);
          }
        }
        seen.offered[choice] = ids;
      }
      events.push(['act']);
      return g.choose(choice, offers);
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
        if (cur.folder !== SCENES[T.scene]) bad(`${what} is played in the scene “${cur.folder}”, in §7 in “${SCENES[T.scene]}”`);
        else {
          for (const k of T.keys) key(k, what);
          for (const k of T.listens ?? []) key(k, what);
          for (const ref of T.points ?? []) point(ref, what);
        }
      }
      for (const k in opts) {
        if (!(T.opts ?? []).includes(k)) bad(`${what}: the opts field “${k}” is not in §7`);
        else if (!new RegExp(`\\b${k}\\b`).test(m.source)) bad(`${what}: the opts field “${k}” is not named in ${m.file}`);
      }
      const result = await g.play(minigame, opts);
      // (what the chapter gives it to say: each once — an array of them, each of those)
      during = true;
      for (const v of Object.values(opts)) for (const fn of [v].flat()) if (typeof fn === 'function') await fn(T.points[0] ?? 'narrator');
      during = false;
      if (!result || typeof result !== 'object') {
        bad(`${what}: no result (skipped?)`);
        return result;
      }
      seen.results[m.name] = result;
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

// --- the logic of the play (game.md §11): each a name and the sides that must all be true or all false
const said = (s, n) => s.lines.has(n);
const opened = (s, folder, beat) => (s.opened[folder] ?? []).filter(o => !beat || o.beat === beat).at(-1);
const LOGIC = [
  ['L102 “Take it. It goes to the eldest”', (f, s) => [f.train === 'go' && f.boxHand, said(s, 102)]],
  ['L106 “Will you take it now?”', (f, s) => [f.train === 'stay' && f.told === 'self' && f.boxWhere === 'cupboard', said(s, 106)]],
  ['L110 “The snuffbox went with him”', (f, s) => [f.boxGone, said(s, 110)]],
  ['L115 “About the orchestra”', (f, s) => [f.secret, said(s, 115)]],
  ['L116 “Stay. Not for Father\'s sake”', (f, s) => [f.ninaFor, said(s, 116)]],
  ['L119 Nina\'s “Volodya”', (f, s) => [!f.fatherCame && f.ninaCame, said(s, 119)]],
  ['L101 “Volodya!”', (f, s) => [f.fatherCame, said(s, 101)]],
  ['L100 Silva at the door', (f, s) => [f.silvaDoor, said(s, 100)]],
  ['L103 “Come on Saturday!”', (f, s) => [f.train === 'go' && f.told === 'self' && f.fatherCame, said(s, 103)]],
  // who comes to the platform (design.md “Finale”): by “Together” — and those he bound with the truth himself
  ['his father on the platform', (f, s, st) => [f.came !== 'none' || st.choices.truth === 'self', opened(s, SCENES.platform, 'last')?.father_came === 1]],
  ['Nina on the platform', (f, s, st) => [f.came === 'family' || st.choices.crossing === 'truth', opened(s, SCENES.platform, 'last')?.nina_came === 1]],
  ['Vasenka on the platform', (f, s, st) => [f.came === 'family' || st.choices.fire === 'own_up', opened(s, SCENES.platform, 'last')?.vasya_came === 1]],
  // the clarinet's phrase resolves where he stayed and someone came for him; at once, in the house, only where the
  // house held together and there was little untruth — else later, from afar (the epilogue)
  ['the clarinet\'s phrase resolves', (f, s, st) => [st.choices.train !== 'go' && (f.fatherCame || f.ninaCame || f.vasyaCame), s.clarinet.some(c => c.resolve)]],
  ['…at once, in the house', (f, s, st) => [st.choices.train !== 'go' && st.choices.truth !== 'silent' && f.came !== 'none' && !f.hurt, s.clarinet.some(c => c.resolve && !c.far)]],
  ['the ending “Missed the Train”', (f, s) => [f.ending === 'late', said(s, 104), s.beats.has('home_late')]],
  ['the ending “Anyway”', (f, s) => [f.ending === 'anyway', said(s, 107), s.beats.has('home_anyway')]],
  ['the ending “Saturday”', (f, s) => [f.ending === 'saturday', said(s, 108)]],
  ['the ending “Suitcase”', (f, s) => [f.ending === 'suitcase', said(s, 109)]],
  ['he left', (f, s) => [f.train === 'go', s.beats.has('boards'), s.played.has('glass')]],
  ['L89 / L90', (f, s) => [f.ninaIs === 'knows', said(s, 89), !said(s, 90)]],
  ['L97 / L98', (f, s, st) => (st.choices.truth === 'silent' ? [f.entry === 'asked', said(s, 97), !said(s, 98)] : [true])],
  ['the Fiancé\'s third option', (f, s) => [f.ninaIs === 'knows', (s.offered.kudimov ?? []).includes('for_me')]],
  ['the result of “Windows” → knocked', (f, s) => [true, f.knocked === (s.results.windows?.knocked ?? []).join(''), (opened(s, SCENES.street, 'evening')?.knocked ?? f.knocked) === f.knocked]],
  ['the result of “On Tiptoe” → heard', (f, s) => (s.played.has('tiptoe') ? [true, s.set[SCENES.home]?.heard === (s.results.tiptoe.creaks > 0 ? 1 : 0)] : [true])],
  ['the result of “Arm in Arm” → snowy', (f, s) => (s.played.has('arm-in-arm') ? [true, s.set[SCENES.hill]?.snowy === (s.results['arm-in-arm'].falls > 0 ? 1 : 0)] : [true])],
  ['the result of “Following” → seen', (f, s) => (s.played.has('following') ? [true, s.set[SCENES.hill]?.seen === (s.results.following.seen > 0 ? 1 : 0)] : [true])],
  ['the result of “The Rucksack” → torn', (f, s) => (s.played.has('rucksack') ? [true, s.set[SCENES.platform]?.torn === (s.results.rucksack.slips >= 2 ? 1 : 0)] : [true])],
  ['the result of “Buckets” → shed_left', (f, s) => (s.played.has('buckets') ? [true, s.set[SCENES.street]?.shed_left === (s.results.buckets.buckets >= 3 ? 1 : 0)] : [true])],
  ['the result of “Running” → late_run', (f, s) => (s.played.has('running') ? [true, opened(s, SCENES.platform, 'last')?.late_run === (s.results.running.looks >= 2 ? 1 : 0)] : [true])],
];
// the scales as the choices move them, unclamped: within their bounds (a clamp would hide a slip)
const raw = choices => {
  const sum = { home: 0, lie: 0 };
  for (const [c, o] of Object.entries(choices)) for (const k in sum) sum[k] += EFFECTS[c]?.[o]?.[k] ?? 0;
  return sum;
};

// --- the walk
const b = page(WORLD, text => miss('b.trouble', text));
// who stands on the platform's stairs for him (V.3), in words
const stairs = f => [f.fatherCame && 'father', f.ninaCame && 'Nina', f.vasyaCame && 'Vasenka'].filter(Boolean).join(', ') || 'no one';
// one play: its choices, the results put in → {ending, came: who stands on the stairs, chapters: [[events of each step]], lines}
async function walk(choices, results, steps = null) {
  const result = m => {
    const name = GAMES.get(m)?.name;
    return results[name] && { ...m.skipped, ...results[name] };
  };
  let came = fresh();
  const seen = { lines: new Set(), beats: new Set(), played: new Set(), opened: {}, set: {}, offered: {}, results: {}, clarinet: [] };
  const chapters = [];
  for (const ch of CHAPTERS) {
    const done = [];
    for (const [n, step] of ch.steps.entries()) {
      if (steps && !steps(ch, n)) continue;
      const here = `${ch.file}, step ${n + 1} “${ch.titles?.[n] ?? ''}”`, events = [];
      const j = jump(Infinity, sound.unheard(), { result });
      const state = { ...structuredClone(came), choices: Object.assign(Object.create(choices), came.choices) };
      const { g, left } = watched(context(b, null, null, state, j), j, ch, here, events, seen);
      const ok = await Promise.race([
        (async () => step(g))().then(() => true, e => { miss(here, `the step broke: ${e?.message || e}`); return true; }),
        j.idle.then(() => false),
      ]);
      if (!ok) miss(here, 'the step did not reach its end dry: it waits for what an unseen step has not');
      await j.idle; // (what the step began and did not wait for)
      left();
      came = { ...g.state, choices: { ...g.state.choices } };
      done.push(events);
    }
    chapters.push(done);
  }
  const f = facts(came);
  if (!steps) {
    if (!ENDINGS.some(e => e.id === f.ending)) miss('the play\'s logic', `the ending “${f.ending}” is not one of ENDINGS`);
    const sum = raw(came.choices);
    for (const [k, S] of Object.entries(SCALES)) {
      if (sum[k] < S.min || sum[k] > S.max) miss('the play\'s logic', `the scale ${k}: ${sum[k]}, out of ${S.min}…${S.max}`);
    }
    for (const [name, test] of LOGIC) {
      const sides = test(f, seen, came);
      if (!sides.every(x => x === sides[0])) miss('the play\'s logic', `${name}: ${sides.map(x => (x ? 'yes' : 'no')).join(' / ')} (the ending ${f.ending})`);
    }
  }
  return { ending: f.ending, came: stairs(f), chapters, lines: seen.lines };
}
const CHOICES = CHAPTERS.flatMap(ch => ch.choices);
// (kudimov's third — “Not for Father's sake” — only when Nina knows: crossing truth)
const allowed = (c, o, made) => !(c.id === 'kudimov' && o.id === 'for_me' && made.crossing !== 'truth');
const combos = CHOICES.reduce((all, c) => all.flatMap(made => c.options.filter(o => allowed(c, o, made)).map(o => ({ ...made, [c.id]: o.id }))), [{}]);
// three plays that between them take every option of every choice (for the live results)
const cover = [0, 1, 2].map(i => CHOICES.reduce((made, c) => {
  const options = c.options.filter(o => allowed(c, o, made));
  return { ...made, [c.id]: options[i % options.length].id };
}, {}));
const plays = [];
for (const choices of combos) { play = plays.length; plays.push(await walk(choices, {})); }
for (const edge of EDGES) for (const choices of cover) { play = plays.length; plays.push(await walk(choices, edge)); }
const full = plays.length;
// every step alone, from an empty play
for (const [c, ch] of CHAPTERS.entries()) for (const n of ch.steps.keys()) {
  play = null;
  await walk({}, {}, (x, k) => x === CHAPTERS[c] && k === n);
}
play = null;

// --- the report
const out = [];
const print = (text = '') => out.push(text);
const met = set => (set.size && set.size < full ? ` (plays: ${set.size})` : '');
const clock = s => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;
const span = all => { const lo = Math.min(...all), hi = Math.max(...all); return lo === hi ? clock(lo) : `${clock(lo)}…${clock(hi)}`; };
const seconds = events => events.reduce((sum, e) => sum + (e[0] === 'beat' || e[0] === 'play' ? e[2] : e[0] === 'say' ? e[1] : 0), 0);
const withActs = events => seconds(events) + events.reduce((sum, e) => sum + (e[0] === 'act' ? ACT : e[0] === 'scene' ? OPEN : 0), 0);
// the map (“The Yard”, game.js): before each chapter but one that says wall: false (the one before runs into it), and
// after the epilogue (its finale)
const maps = () => (CHAPTERS.reduce((n, ch) => n + (ch.wall !== false ? 1 : 0), 0) + 1) * MAP_S;

print(`World: ${world}, ${WORLD.size} scenes. Game: ${CHAPTERS.length} chapters, ${CHAPTERS.reduce((n, ch) => n + ch.steps.length, 0)} steps, ${CHOICES.length} choices.`);
print(`Plays: ${full} (${combos.length} combinations of the choices and ${EDGES.length * cover.length} with live minigame results on both edges), and every step alone.`);

print(`\n== Discrepancies: ${misses.size} ==`);
for (const [text, set] of misses) print(`${text}${met(set)}`);

print(`\n== Cuts inside a scene not by its table and without beat_next: ${cuts.size} ==`);
for (const [text, set] of cuts) print(`${text}${met(set)}`);

print('\n== In the scenes\' contracts, named by no play ==');
for (const [folder, scene] of WORLD) {
  const c = scene.contract;
  if (!c) continue;
  const left = [
    ...Object.entries(c.beats).filter(([name, beat]) => beat.show !== true && !scene.named.has(`beat:${name}`)).map(([name]) => `beat ${name}`),
    ...[...new Set([...Object.values(c.beats).flatMap(beat => beat.tells), ...Object.values(c.acts).flatMap(a => a.tells)])].filter(t => !scene.named.has(`tell:${t}`)).map(t => `moment ${t}`),
    ...Object.keys(c.party).filter(k => !scene.named.has(`party:${k}`)).map(k => `play key ${k}`),
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

print(`\n== Beats and time by ending and by who stands on the platform's stairs (beats — the contract's seconds, lines in the pauses — 0.3 s + 0.06 s a letter, minigames — about; in brackets — with the choices at ${ACT} s, a scene's opening at ${OPEN} s and the map at ${MAP_S} s) ==`);
for (const ending of ENDINGS) for (const who of [...new Set(plays.slice(0, full).map(p => p.came))].sort()) {
  const mine = plays.slice(0, full).filter(p => p.ending === ending.id && p.came === who);
  if (!mine.length) continue;
  print(`\n-- ${ending.label} (${ending.id}), came: ${who} — ${mine.length} plays --`);
  const times = mine.map(p => p.chapters.map(steps => seconds(steps.flat())));
  const all = mine.map(p => p.chapters.reduce((sum, steps) => sum + withActs(steps.flat()), 0) + maps());
  print(`time: ${CHAPTERS.map((ch, c) => `${ch.number || ch.title} ${span(times.map(t => t[c]))}`).join(' · ')} · in all ${span(times.map(t => t.reduce((a, x) => a + x, 0)))} (${span(all)})`);
  for (const [c, ch] of CHAPTERS.entries()) {
    for (const n of ch.steps.keys()) {
      const ways = new Map();
      for (const p of mine) {
        const events = p.chapters[c][n];
        const way = `${events.filter(e => e[0] !== 'say' && e[0] !== 'act').map(e => (e[0] === 'scene' ? `| ${e[1]}:` : e[0] === 'play' ? `[${e[1]}]` : e[1])).join(' ').replace(/^\| /, '') || '—'} — ${Math.round(seconds(events))} s`;
        ways.set(way, (ways.get(way) ?? 0) + 1);
      }
      for (const [way, count] of ways) print(`${ch.file} ${n + 1} «${ch.titles?.[n] ?? ''}»: ${way}${count < mine.length ? ` (plays: ${count})` : ''}`);
    }
  }
}

// a stretch of watching: from one thing the player does (the map, a choice, a minigame) to the next. The map stands
// before a chapter unless it says wall: false (game.js)
const long = new Map(); // `${from} → ${to}` → [seconds of each play it is long in]
for (const p of plays.slice(0, full)) {
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
