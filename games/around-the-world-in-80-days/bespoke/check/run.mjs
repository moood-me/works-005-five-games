// The check of the game's branches (rpg docs/vokrug-sveta/game.md §10): node bespoke/check/run.mjs <a clone of the
// world>. No browser, no engine, nothing drawn. Every step of every chapter is played unseen, the way the author's map
// plays it (jump.js: a dry run, story.js context(…, j)), on a page that only knows the scenes' specs (fake.mjs): no time
// passes, the choices are those of the play walked, a minigame gives the result put in for it (else its `skipped`).
// Walked: every combination of the choices the player makes by a press (the pyramid's is made by the hands: its
// minigame's result), with every minigame skipped; and the plays with "live" results on both edges (EDGES), each over
// three plays of choices that between them take every option (the results change the play: the notebook, the bag, who
// is where — Passepartout left at Omaha, the pyramid held, the cab late). And every step alone, from an empty play
// (steps skipped: facts' defaults). Each play — all its steps in order, its state going from step to step.
// Noted, by a wrapper over the step's g (an unseen step's lines and offers never reach j) and over the sounds j plays:
// each scene opened and its keys (the party's too), each beat, moment waited for, key set or read (beat_next too),
// offer and its options, line (who, text, over what), minigame with its opts and the fields of its result the chapter
// reads, title, letter, the bag's every change (unclamped), sound. After each g.play every function of its opts is
// called once: the lines the minigames have said are heard.
// Compared with each scene's scene.json and the block «Contract for the check» that ends its notes.md (scenes.md
// «Common»): {beats: {name: {after, tells, seconds, show}}, points, offers, party, acts: {key: {values, tells}}, keys};
// with the minigames' table (game.md §7, MINIGAMES below) and the moments their files wait for; people.json, sound.js
// and its unheard(); and the logic of the play (LOGIC below: one ending, the bag never short, every mark read, the
// lines and the beats only on their condition, no b.offer). «The route» — the map's background (game.js, not run here):
// its keys and points.
// Printed: what does not match (file, step, name) — a scene the world lacks is said, the walk goes on; the cuts inside
// a scene not by its table and without beat_next; what the contracts have and no play named; every line said (who,
// text) once — the voices are made from this list; for each ending — the beats of every step and the time by chapter
// and in all (the beats' `seconds`, the lines said in the pauses between beats at 0.3 s + 0.06 s a letter, the
// minigames' `about`; 8 s a choice, 1 s a scene's opening, 12 s the map); every stretch of watching with nothing to do
// longer than 90 s.
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
globalThis.tr = Object.assign(fill, { n: (n, one, other, p) => fill(n === 1 ? one : other, { n, ...p }), c: (c, t, p) => fill(t, p), line: (who, t) => t, thought: (who, t) => t, lang: 'en' });
const PEOPLE = JSON.parse(readFileSync(join(game, 'people.json'), 'utf8'));
const { SCENES, ENDINGS, START, HANDS, facts, carry, context } = await load('story.js');
const { jump } = await load('jump.js');
const sound = await load('sound.js');

const WATCH = 90; // a stretch of watching longer than this, s, is reported
const PARTS = ['deckhouse', 'boats', 'bunks', 'yards', 'mast_fore', 'mast_main', 'bulwarks', 'speedy_cabin'];
// The minigames (game.md §7): the scene a minigame is played on, the keys it sets and those it only reads, the points
// its marks stand on (and its pulls go to), the fields of its opts and of its result
const MINIGAMES = {
  'ten-minutes': { scene: 'row', keys: ['pp_in', 'fly', 'fly_what', 'bag', 'gas'], points: ['win_dressing', 'win_bedroom', 'win_hall', 'win_study', 'attic'], result: ['missing', 'gas'] },
  bargain: { scene: 'jungle', keys: ['offer', 'owner_back'], points: ['fogg#hands'], opts: ['onRefuse'], result: ['price', 'minutes'] },
  elephant: { scene: 'jungle', keys: ['ride', 'pace', 'goad', 'balk', 'sugar'], points: ['kiouni#head', 'guide#hands', 'kiouni#trunk'], result: ['hours'] },
  'like-the-dead': { scene: 'jungle', keys: ['walk', 'heads', 'smoke'], points: [], result: ['hours'] },
  dash: { scene: 'jungle', keys: ['charge', 'scatter', 'grab', 'guide_seen', 'litter_lane', 'kiouni_lane'], points: ['aouda#hands'], result: ['hours'] },
  'stay-awake': { scene: 'harbour', keys: ['boatman', 'message', 'pp_stumble', 'pp_sway', 'daze', 'pp_walk'], listens: ['pp_walk_at'], points: [], result: ['told'] },
  typhoon: { scene: 'sea', keys: ['green_water', 'wave', 'wave_from', 'wave_h', 'helm', 'heel'], points: [], result: ['hours'] },
  pyramid: { scene: 'harbour', keys: ['pyramid', 'tilt', 'fogg_present'], points: ['fogg#head'], result: ['choice'] },
  coupling: { scene: 'prairie', keys: ['pp_car', 'uncouple'], listens: ['swing_at'], points: ['chain#c1', 'chain#c2', 'chain#c3', 'coupling#pin'], result: ['hours'] },
  sail: { scene: 'prairie', keys: ['sledge', 'drift', 'wolves', 'wind', 'sheet', 'sl_speed'], points: [], opts: ['alone'], result: ['hours', 'caught'] },
  boilers: { scene: 'deck', keys: ['fire', 'speed', 'speedy_grief', ...PARTS, ...PARTS.map(p => `drag_${p}`), ...PARTS.map(p => `locked_${p}`)],
    points: [...PARTS.map(p => `${p}#part`), 'hatch#fire', 'speedy#head'], opts: ['who', 'money'], result: ['burned', 'cabin'] },
  cab: { scene: 'row', keys: ['traffic', 'cab_to', 'cab_pace'], listens: ['cab_at'], points: ['cab#horse'], result: ['late'] },
};
// what game.js itself takes of «The route», the map's background (it is not run here): its keys, the points its trees
// stand at (map.js) — each chapter's
const MAP = { keys: ['shown', 'come', 'route', 'dateline'], points: Array.from({ length: 6 }, (_, i) => `c${i}`) };
// the "live" results put in: both edges
const EDGES = [
  { 'ten-minutes': { missing: 4, gas: true }, bargain: { price: 2000, minutes: 60 }, elephant: { hours: -2 }, 'like-the-dead': { hours: -2 },
    dash: { hours: -2 }, 'stay-awake': { told: false }, typhoon: { hours: -3 }, pyramid: { choice: 'hold' }, coupling: { hours: -2 },
    sail: { hours: 10, caught: false }, boilers: { burned: [], cabin: false }, cab: { late: true } },
  { 'ten-minutes': { missing: 0, gas: false }, bargain: { price: 1100, minutes: 0 }, elephant: { hours: 2 }, 'like-the-dead': { hours: 0 },
    dash: { hours: 0 }, 'stay-awake': { told: true }, typhoon: { hours: 0 }, pyramid: { choice: 'drop' }, coupling: { hours: 0 },
    sail: { hours: 22, caught: true }, boilers: { burned: [...PARTS], cabin: true }, cab: { late: false } },
];
// the script's length: a choice, a scene's opening, the map
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
const fresh = () => ({ chapter: 0, step: 0, hours: START.hours, money: START.money, shown: {}, marks: {}, choices: {}, hands: {}, lines: [] });

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
  for (const [key, value] of Object.entries(carry(folder, facts(fresh()), fresh()) ?? {})) {
    if (!(key in c.party)) miss(notes, `the play's key “${key}” (story.js carry) is not in the contract's party`);
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
for (const name of ['prologue', '1', '2', '3', '4', 'epilogue']) {
  const file = `chapters/${name}.js`;
  if (!existsSync(join(game, file))) { miss(file, 'no such file'); continue; }
  const ch = (await load(file)).default;
  CHAPTERS.push({ file, source: readFileSync(join(game, file), 'utf8'), ...ch });
  if (!Array.isArray(ch.choices)) throw new Error(`${file}: no choices`);
  if (!Array.isArray(ch.titles) || ch.titles.length !== ch.steps.length) miss(file, `titles: ${ch.titles?.length ?? 'none'}, steps: ${ch.steps.length}`);
  if (!Array.isArray(ch.route) || ch.route.length !== 2) miss(file, 'route: not [from, to] of the red line');
  for (const c of ch.choices) if (c.by && !(c.by in MINIGAMES)) miss(file, `the choice “${c.id}” is made by “${c.by}”, which is no minigame`);
}
const GAMES = new Map(); // a minigame (the module's default export) → {file, name, source}
const games = existsSync(join(game, 'minigames')) ? readdirSync(join(game, 'minigames')).filter(f => f.endsWith('.js')) : [];
for (const entry of games) {
  const file = `minigames/${entry}`, name = entry.slice(0, -3), m = (await load(file)).default;
  const source = readFileSync(join(game, file), 'utf8');
  GAMES.set(m, { file, name, source });
  const T = MINIGAMES[name];
  if (!T) { miss(file, 'the minigame is not in the table of game.md §7'); continue; }
  if (m.file !== name || !HANDS.includes(name)) miss(file, `its file “${m.file}”: not its own name, or not in story.js HANDS`);
  if (typeof m.title !== 'string' || !(m.about > 0) || typeof m.run !== 'function') miss(file, 'no title, about or run');
  if (!m.skipped || !same(Object.keys(m.skipped), T.result)) miss(file, `skipped: the fields {${Object.keys(m.skipped ?? {}).join(', ')}}, the result in §7 {${T.result.join(', ')}}`);
  for (const key of T.opts ?? []) if (!new RegExp(`\\b${key}\\b`).test(source)) miss(file, `the opts field “${key}” (§7) is not named in the file`);
  for (const [, s] of source.matchAll(/\bsound\.(\w+)/g)) if (!(s in sound) || !(s in sound.unheard().sounds)) miss(file, `the sound “${s}” is not in sound.js or in unheard()`);
  if (/\bg\.state\b/.test(source)) miss(file, 'the minigame touches g.state (§7: what it needs comes in its opts)');
  if (/\bg\.say\(/.test(source)) miss(file, 'the minigame says lines of its own (§7: the chapter gives them through opts)');
  // its own hint: the ghost shows it the first time this minigame is met (not the first time its gesture is)
  for (const [, id] of source.matchAll(/teach\([^)]*\{\s*id:\s*'([^']+)'/g)) if (id.split(':')[0] !== name) miss(file, `the hint “${id}” is not this minigame's own (“${name}” or “${name}:…”)`);
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
// every sound has its unheard twin
const quiet = sound.unheard?.() ?? { sounds: {} };
const quietNames = Object.keys(quiet.sounds ?? {});
for (const name of quietNames) if (typeof sound[name] !== 'function') miss('sound.js', `the sound “${name}” is in unheard(), but not in sound.js`);
for (const name in sound) {
  if (typeof sound[name] === 'function' && !['pause', 'unheard', 'wake'].includes(name) && !quietNames.includes(name)) miss('sound.js', `the sound “${name}” is not in unheard()`);
}
// «The route», as game.js opens it: the map's keys, its points (elements of the scene)
const route = WORLD.get(SCENES.map);
if (route) {
  for (const key of MAP.keys) {
    if (!(key in route.states)) miss('game.js', `“${SCENES.map}”: the key “${key}” is not in states`);
    if (route.contract && !(key in (route.contract.keys ?? {}))) miss('game.js', `“${SCENES.map}”: the contract’s keys have no key “${key}”`);
    route.named.add(`party:${key}`);
  }
  for (const ref of MAP.points) {
    if (route.contract && !route.contract.points.includes(ref)) miss('game.js', `“${SCENES.map}”: the point “${ref}” is not in the contract`);
    if (!route.objects.has(ref.split('#')[0])) miss('game.js', `“${SCENES.map}”: no element “${ref}”`);
    route.named.add(`ref:${ref}`);
  }
}
// no b.offer anywhere (on engine 3 a choice is the language of mini-games)
for (const file of ['game.js', 'story.js', 'ui.js', 'map.js', ...CHAPTERS.map(c => c.file), ...[...GAMES.values()].map(m => m.file)]) {
  if (existsSync(join(game, file)) && /\bb\.offer\(/.test(readFileSync(join(game, file), 'utf8'))) miss(file, 'b.offer: on engine 3 a choice is made in the language of mini-games');
}
// every mark is read: in facts, or in a chapter (marks.<key>); a stamp's mark only says who remembers — the choice
// that set it is read in facts instead (STAMPS: mark → its choice)
const STAMPS = { holland: 'aouda', guide: 'sati', paid: 'fort', hit: 'liverpool' };
{
  const reader = [facts.toString(), ...CHAPTERS.map(c => c.source)].join('\n');
  const set = new Set(['aouda', 'fix', 'pp']); // (g.relate)
  for (const c of CHAPTERS) for (const [, key] of c.source.matchAll(/\bg\.mark\(\s*'(\w+)'/g)) set.add(key);
  for (const key of set) {
    if (STAMPS[key]) { if (!new RegExp(`\\bc\\.${STAMPS[key]}\\b`).test(facts.toString())) miss('story.js facts', `the stamp “${key}”: facts does not read its choice “${STAMPS[key]}”`); continue; }
    if (!new RegExp(`\\b(?:marks|m)\\.${key}\\b`).test(reader)) miss('story.js facts', `the mark “${key}” is read nowhere`);
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
    seen.beats.add(`${cur.folder}/${name}`);
    cur.scene.named.add(`beat:${name}`);
    if (c && !beat) bad(`no beat “${name}” in the scene “${cur.folder}”`);
    if (beat?.show === true) bad(`the beat “${name}” of the scene “${cur.folder}” is for the showcase only (show: true)`);
    // a beat not opening the scene: after one of its `after`, or a cut-beat — the next in the table after the one
    // before it, or the one beat_next named (scenes.md «Common»)
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
      return known(name) ? q[name] : mute;
    },
  });
  const w = Object.create(g);
  Object.assign(w, {
    async scene(folder, st = {}, how) {
      const scene = WORLD.get(folder), party = carry(folder, facts(g.state), g.state);
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
      else if (cur?.last === beat) { moment(text, 'g.told'); bad(`g.told “${text}” is made after its beat has begun (for the beat the scene opens with: before g.scene)`); }
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
      seen.lines.add(text);
      if (at !== 'narrator' && cur) {
        if (at.includes('#')) point(at, what);
        else if (element(at, what)) cur.scene.named.add(`ref:${at}`);
      }
      if (!lines.has(`${who}\n${text}`)) lines.set(`${who}\n${text}`, { who, text, where: here });
      if (!during && !open) events.push(['say', 0.3 + 0.06 * text.length]);
      return g.say(who, text, at);
    },
    choose(choice, offers, how) {
      const what = `the choice “${choice ?? Object.keys(offers).join(', ')}”`, ids = Object.values(offers).flat().map(o => o.id);
      if (shown(what)) for (const ref in offers) offer(ref, what);
      if (choice != null) {
        const declared = ch.choices.find(c => c.id === choice);
        if (!declared) bad(`${what}: not in the chapter's choices`);
        else {
          if (declared.by) bad(`${what}: made by the minigame “${declared.by}”, not by a press`);
          const all = declared.options.map(o => o.id);
          if (!same(ids, all)) bad(`${what}: offered {${ids.join(', ')}}, in the chapter's choices {${all.join(', ')}}`);
          for (const o of Object.values(offers).flat()) {
            const d = declared.options.find(x => x.id === o.id);
            // (the petal may say more than the map's word)
            if (d && d.label !== o.label && !o.label.includes(d.label)) bad(`${what}: the petal “${o.label}”, in the chapter's choices “${d.label}”`);
          }
        }
        seen.offered[choice] = ids;
      }
      events.push(['act']);
      return g.choose(choice, offers, how);
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
      seen.opts[m.name] = opts;
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
      // (what the chapter gives it to say: each once)
      during = true;
      for (const v of Object.values(opts)) for (const fn of [v].flat()) if (typeof fn === 'function') await fn(1);
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
    money(delta) {
      seen.money += delta;
      seen.least = Math.min(seen.least, seen.money);
      return g.money(delta);
    },
    title(text) {
      seen.titles.add(text);
      events.push(['say', 9]);
      return g.title(text);
    },
    letter(letter) {
      seen.letters.add(letter.text);
      events.push(['act']);
      return g.letter(letter);
    },
    book(line, hand) {
      seen.book.push(`${line}:${hand}`);
      events.push(['act']);
      return g.book(line, hand);
    },
  });
  return { g: w, left: () => waits.forEach(t => bad(`g.told “${t.text}”: the beat “${t.beat}” did not begin after it in the step`)) };
}

// --- the logic of the play: each a name and the sides that must all be true or all false
const beat = (s, folder, name) => s.beats.has(`${SCENES[folder]}/${name}`);
const said = (s, text) => s.lines.has(text);
const LOGIC = [
  ['the ending «On time»', (f, s) => [f.ending === 'friday', beat(s, 'club', 'friday_in')]],
  ['the ending «Here I am, gentlemen»', (f, s) => [f.ending === 'door', beat(s, 'club', 'door')]],
  ['the ending «Lost — and won»', (f, s) => [f.ending === 'lost', beat(s, 'row', 'lost')]],
  ['the ending «Two Wednesdays»', (f, s) => [f.ending === 'sunday', beat(s, 'row', 'sunday'), s.titles.has('Two Wednesdays')]],
  ['Aouda finds Saturday', (f, s) => [f.ending !== 'friday' && f.opener === 'aouda', beat(s, 'row', 'proposal')]],
  ['Fix finds Saturday', (f, s) => [f.ending !== 'friday' && f.opener === 'fix', beat(s, 'row', 'fix_paper')]],
  ['the day written in the notebook', (f, s) => [f.ending === 'door' || f.ending === 'lost', s.book.includes('day:pp') || s.book.includes('day:fogg')]],
  ['Aouda in Holland', (f, s) => [f.aouda === 'holland', beat(s, 'harbour', 'stay_behind'), s.letters.size > 0]],
  ['Passepartout left at Omaha', (f, s) => [f.pp === 'omaha', beat(s, 'row', 'pp_returns'), said(s, 'I\'ll catch you up, monsieur. Somewhere')]],
  ['Passepartout caught the train at Omaha', (f, s, st) => [st.choices.fort === 'pay' && f.pp === 'with', said(s, 'Master! By London time — to the minute!')]],
  ['the suttee at night', (f, s) => [f.sati === 'night', beat(s, 'jungle', 'pyre'), s.played.has('like-the-dead'), !s.played.has('dash')]],
  ['Kiouni given', (f, s) => [f.kiouni === 'gift', beat(s, 'jungle', 'gift'), s.titles.has('A postcard came from Allahabad. There is an elephant on it')]],
  ['the gas', (f, s) => [f.gas, said(s, 'The gas! I forgot to turn off the gas in my room!'), beat(s, 'row', 'gas_off')]],
  ['the news through the boatman', (f, s, st) => [!!st.marks.told, said(s, 'The boatman was right. The Carnatic sailed in the night')]],
  ['the pyramid held', (f, s, st) => [st.choices.pyramid === 'hold', beat(s, 'harbour', 'finish'), !beat(s, 'harbour', 'collapse')]],
  ['the fort, Fogg himself', (f, s, st) => [st.choices.fort === 'go', beat(s, 'prairie', 'column'), !s.opts.sail?.alone]],
  ['the Henrietta burnt', (f, s) => [f.henrietta === 'burn', s.played.has('boilers'), beat(s, 'deck', 'queenstown'), !beat(s, 'deck', 'sails_only')]],
  ['the boilers by Passepartout\'s hands', (f, s, st) => (s.played.has('boilers') ? [f.pp === 'with', s.opts.boilers?.who === 'pp'] : [true])],
  ['Fix struck at Liverpool', (f, s, st) => [st.choices.liverpool === 'hit', beat(s, 'deck', 'fix_down'), !beat(s, 'deck', 'fix_hand')]],
  ['the cab', (f, s) => [f.ending === 'door' || (f.ending === 'lost' && f.gained >= 0), s.played.has('cab')]],
];

// --- the walk
const b = page(WORLD, text => miss('b.trouble', text));
// one play: its choices, the results put in → {ending, chapters: [[events of each step]], lines}
async function walk(choices, results, steps = null) {
  const result = m => {
    const name = GAMES.get(m)?.name;
    return results[name] && { ...m.skipped, ...structuredClone(results[name]) };
  };
  let came = fresh();
  const seen = { lines: new Set(), beats: new Set(), played: new Set(), opened: {}, set: {}, offered: {}, results: {}, opts: {},
    titles: new Set(), letters: new Set(), book: [], money: START.money, least: START.money };
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
    if (seen.least < 0) miss('the play\'s logic', `the carpet-bag short: £${seen.least} at its lowest (unclamped)`);
    for (const [name, test] of LOGIC) {
      const sides = test(f, seen, came);
      if (!sides.every(x => x === sides[0])) miss('the play\'s logic', `${name}: ${sides.map(x => (x ? 'yes' : 'no')).join(' / ')} (the ending ${f.ending})`);
    }
  }
  return { ending: f.ending, hours: f.hours, money: came.money, chapters, lines: seen.lines };
}
// the choices made by a press (the pyramid's is the hands')
const CHOICES = CHAPTERS.flatMap(ch => ch.choices).filter(c => !c.by);
const combos = CHOICES.reduce((all, c) => all.flatMap(made => c.options.map(o => ({ ...made, [c.id]: o.id }))), [{}]);
// three plays that between them take every option of every choice (for the live results)
const cover = [0, 1, 2].map(i => Object.fromEntries(CHOICES.map(c => [c.id, c.options[i % c.options.length].id])));
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
const say = (text = '') => out.push(text);
const met = set => (set.size && set.size < full ? ` (plays: ${set.size})` : '');
const clock = s => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;
const span = all => { const lo = Math.min(...all), hi = Math.max(...all); return lo === hi ? clock(lo) : `${clock(lo)}…${clock(hi)}`; };
const range = all => { const lo = Math.min(...all), hi = Math.max(...all); return lo === hi ? `${lo}` : `${lo}…${hi}`; };
const seconds = events => events.reduce((sum, e) => sum + (e[0] === 'beat' || e[0] === 'play' ? e[2] : e[0] === 'say' ? e[1] : 0), 0);
const withActs = events => seconds(events) + events.reduce((sum, e) => sum + (e[0] === 'act' ? ACT : e[0] === 'scene' ? OPEN : 0), 0);
// the map («The route», game.js): before each chapter but one that says wall: false (the one before runs into it), and
// after the epilogue (its finale)
const maps = () => (CHAPTERS.reduce((n, ch) => n + (ch.wall !== false ? 1 : 0), 0) + 1) * MAP_S;

say(`World: ${world}, ${WORLD.size} scenes. Game: ${CHAPTERS.length} chapters, ${CHAPTERS.reduce((n, ch) => n + ch.steps.length, 0)} steps, ${CHOICES.length} choices made by a press.`);
say(`Plays: ${full} (${combos.length} combinations of the choices and ${EDGES.length * cover.length} with live minigame results on both edges), and every step alone.`);

say(`\n== Discrepancies: ${misses.size} ==`);
for (const [text, set] of misses) say(`${text}${met(set)}`);

say(`\n== Cuts inside a scene not by its table and without beat_next: ${cuts.size} ==`);
for (const [text, set] of cuts) say(`${text}${met(set)}`);

say('\n== In the scenes\' contracts, named by no play ==');
for (const [folder, scene] of WORLD) {
  const c = scene.contract;
  if (!c) continue;
  const left = [
    ...Object.entries(c.beats).filter(([name, beat]) => beat.show !== true && !scene.named.has(`beat:${name}`)).map(([name]) => `beat ${name}`),
    ...[...new Set([...Object.values(c.beats).flatMap(beat => beat.tells), ...Object.values(c.acts).flatMap(a => a.tells)])].filter(t => !scene.named.has(`tell:${t}`)).map(t => `moment ${t}`),
    ...Object.keys(c.party).filter(k => !scene.named.has(`party:${k}`)).map(k => `play key ${k}`),
    ...[...new Set([...c.points, ...c.offers])].filter(ref => !scene.named.has(`ref:${ref}`)).map(ref => `point ${ref}`),
  ];
  say(`${folder}: ${left.join('; ') || '—'}`);
}

say(`\n== Lines: ${lines.size} (who | voice | text | ≈ s) — the voices are recorded from them ==`);
for (const line of lines.values()) say(`${line.who} | ${PEOPLE[line.who]?.voice ?? '?'} | ${line.text} | ${(0.3 + 0.06 * line.text.length).toFixed(1)}`);

say(`\n== Beats and time by ending (beats — the contract's seconds, lines in the pauses — 0.3 s + 0.06 s a letter, titles 9 s, minigames — about; in brackets — with the choices, the notebook given and the letter at ${ACT} s, a scene's opening at ${OPEN} s and the map at ${MAP_S} s) ==`);
for (const ending of ENDINGS) {
  const mine = plays.slice(0, full).filter(p => p.ending === ending.id);
  if (!mine.length) { say(`\n-- ${ending.label} (${ending.id}) — no play comes to it --`); continue; }
  say(`\n-- ${ending.label} (${ending.id}) — ${mine.length} plays; the notebook at the end ${range(mine.map(p => p.hours))} h, the bag £${range(mine.map(p => p.money))} --`);
  const times = mine.map(p => p.chapters.map(steps => seconds(steps.flat())));
  const all = mine.map(p => p.chapters.reduce((sum, steps) => sum + withActs(steps.flat()), 0) + maps());
  say(`time: ${CHAPTERS.map((ch, c) => `${ch.number || ch.title} ${span(times.map(t => t[c]))}`).join(' · ')} · in all ${span(times.map(t => t.reduce((a, x) => a + x, 0)))} (${span(all)})`);
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
say(`\n== Watching with nothing to do longer than ${WATCH} s: ${long.size} ==`);
for (const [where, all] of long) say(`${where}: ${span(all)} (plays: ${all.length})`);

// (a dry run's clock — jump.js — keeps the process alive: leave once all is written)
process.stdout.write(`${out.join('\n')}\n`, () => process.exit(misses.size || cuts.size ? 1 : 0));
