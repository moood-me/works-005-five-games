// The check of the game's branches (game.md §11): node bespoke/check/run.mjs <a clone of the world>. No browser, no
// engine, nothing drawn. Every step of every chapter is played unseen, the way the author's ☰ plays it (jump.js: a dry
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
// Compared with each scene's scene.json and the block «Контракт для проверки» that ends its notes.md (scenes.md
// «Общее»): {beats: {name: {after, tells, seconds, show}}, points, offers, party, acts: {key: {values, tells}}}; with
// the minigames' table (§7, MINIGAMES below) and the moments their files wait for; PEOPLE, sound.js and its unheard(),
// the lines of §8 (lines.mjs) letter for letter; and the logic of the play (LOGIC below: one ending, the scales within
// their bounds, every mark read in facts, the lines said only on their condition, no b.offer).
// Printed: what does not match (file, step, name) — a scene the world lacks is said, the walk goes on; the cuts inside
// a scene not by its table and without beat_next; what the contracts have and no play named; the lines of §8 no play
// said; every line said (who, text) once — the voices are made from this list; for each ending and who came — the
// beats of every step and the time by chapter and in all (the beats' `seconds`, the lines said in the pauses between
// beats at 0.3 s + 0.06 s a letter, the minigames' `about`; 8 s a choice, 1 s a scene's opening, «Состав» 7 s a title
// and 12 s a map); every stretch of watching with nothing to do longer than 90 s.
// Exit code: 0 — nothing to fix, 1 — something does not match.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { page, scenes } from './fake.mjs';
import { LINES } from './lines.mjs';

const world = process.argv[2];
if (!world || !existsSync(join(world, 'scenes'))) {
  console.error('node bespoke/check/run.mjs <клон мира>');
  process.exit(2);
}
const game = fileURLToPath(new URL('..', import.meta.url));
const load = file => import(pathToFileURL(join(game, file)).href);
const { SCENES, PEOPLE, SCALES, EFFECTS, ENDINGS, facts, carry, context } = await load('story.js');
const { jump } = await load('jump.js');
const sound = await load('sound.js');

const WATCH = 90; // a stretch of watching longer than this, s, is reported
const several = (stem, n, tail = '', from = 1) => Array.from({ length: n }, (_, i) => `${stem}${i + from}${tail}`);
// The minigames (game.md §7): the scene a minigame is played on, the keys it moves and those it only listens to, the
// points its marks stand on, the fields of its opts and of its result
const MINIGAMES = {
  okna: { scene: 'street', keys: ['knock', ...several('win', 5), 'snow'], points: several('win', 5), opts: ['refuse'], result: ['knocked'] },
  ruki: { scene: 'home', keys: ['thaw', 'rub'], points: ['hands#hands'], result: ['seconds'] },
  chai: { scene: 'home', keys: ['which', 'pour', 'glass1', 'glass2', 'spill', 'shake'], points: ['tea#glass1', 'tea#glass2'], opts: ['ask'], result: ['spills'] },
  tabakerka: { scene: 'home', keys: [...several('finger', 4), 'old', 'push', 'old_close'],
    points: [...several('box#finger', 4), 'box#box', 'box#old'], opts: ['mode'], result: ['closed', 'seconds'] },
  tsypochki: { scene: 'home', keys: ['sneak', 'stir'], listens: ['sneak_at'], points: ['clock#face'], result: ['creaks'] },
  inei: { scene: 'home', keys: ['hole', 'far_train'], points: ['window#pane'], result: ['hole'] },
  'pod-ruku': { scene: 'hill', keys: ['down', 'catch', 'fall'], listens: ['down_at'], points: ['sarafanov#shoulder_l'], result: ['falls'] },
  sledom: { scene: 'hill', keys: ['sar_go', 'follow', 'hold', 'duck'], listens: ['follow_at', 'sar_at'], points: ['sarafanov'], result: ['seen'] },
  ryukzak: { scene: 'platform', keys: ['pull', 'grip', 'door_bg'], points: ['strap#grip'], result: ['slips'] },
  vyodra: { scene: 'street', keys: ['vyodra', 'fire'], points: ['barrel', 'shed'], result: ['buckets'] },
  palto: { scene: 'street', keys: ['lay'], points: ['shawl#coat', 'shawl#shoulders'], result: ['seconds'] },
  begom: { scene: 'street', keys: ['run', 'look_back'], listens: ['run_at'], points: ['busygin'], result: ['seconds', 'looks'] },
  steklo: { scene: 'platform', keys: ['wipe'], points: ['train_window#pane'], result: ['wipe'] },
};
// game.md §3.4: what game.js itself takes of «Состав» (it is not run here)
const YARD = { keys: ['chapter_number', 'chapter_title', 'map', 'reveal', 'go', 'snow'], offer: 'signal#light' };
// the "live" results put in (game.md §11): both edges
const EDGES = [
  { okna: { knocked: [] }, chai: { spills: 1 }, tsypochki: { creaks: 0 }, inei: { hole: 0 }, 'pod-ruku': { falls: 0 }, sledom: { seen: 0 },
    ryukzak: { slips: 0 }, vyodra: { buckets: 0 }, begom: { looks: 0 }, steklo: { wipe: 0.3 } },
  { okna: { knocked: [1, 2, 3, 4, 5] }, chai: { spills: 2 }, tsypochki: { creaks: 2 }, inei: { hole: 1 }, 'pod-ruku': { falls: 1 }, sledom: { seen: 1 },
    ryukzak: { slips: 2 }, vyodra: { buckets: 3 }, begom: { looks: 3 }, steklo: { wipe: 1 } },
];
// the script's length (game.md §11): a choice, a scene's opening, «Состав» with a title, with a map
const ACT = 8, OPEN = 1, TITLE_S = 7, MAP_S = 12;

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
  const at = notes.search(/^#+\s*Контракт для проверки\s*$/m);
  if (at < 0) throw new Error('нет раздела «Контракт для проверки»');
  const block = /```json\s*\n([\s\S]*?)\n\s*```/.exec(notes.slice(at));
  if (!block) throw new Error('в разделе «Контракт для проверки» нет блока ```json');
  return JSON.parse(block[1]);
}
const WORLD = scenes(world);
for (const [title, scene] of WORLD) {
  const notes = `scenes/${scene.folder}/notes.md`, spec = `scenes/${scene.folder}/scene.json`;
  scene.named = new Set();
  scene.states = scene.spec.states ?? {};
  scene.objects = new Map((scene.spec.objects ?? []).map(o => [o.id, o]));
  scene.contract = null;
  if (!Object.values(SCENES).includes(title)) { miss(spec, `сцены «${title}» нет в SCENES игры (название сцены — ровно как в scenes.md?)`); continue; }
  try {
    if (!existsSync(join(world, notes))) throw new Error('файла нет');
    const c = contract(readFileSync(join(world, notes), 'utf8'));
    if (!c) throw new Error('блок контракта пуст');
    const shaped = c.beats && typeof c.beats === 'object' && Array.isArray(c.points) && Array.isArray(c.offers) && c.party && typeof c.party === 'object';
    if (!shaped) throw new Error('блок контракта не {beats, points, offers, party, acts}');
    if (c.acts == null) c.acts = {};
    if (typeof c.acts !== 'object') throw new Error('acts — не объект');
    scene.contract = c;
  } catch (e) {
    miss(notes, `контракт не прочитан: ${e.message}`);
    continue;
  }
  const c = scene.contract;
  scene.order = Object.keys(c.beats); // the film's table, in order: a cut-beat is the next after the one before it
  if (Object.keys(c.beats).length && !('beat' in scene.states)) miss(spec, 'в states нет ключа «beat»');
  if (Object.keys(c.beats).length && !('beat_next' in scene.states)) miss(spec, 'в states нет ключа «beat_next»');
  for (const [name, beat] of Object.entries(c.beats)) {
    if (!Array.isArray(beat.after) || !Array.isArray(beat.tells)) { miss(notes, `кусок «${name}»: нет after или tells`); beat.after ??= []; beat.tells ??= []; }
    if (!(beat.seconds > 0)) miss(notes, `кусок «${name}»: нет seconds`);
    for (const a of beat.after) if (!(a in c.beats)) miss(notes, `кусок «${name}»: в after кусок «${a}», которого нет`);
    for (const t of beat.tells) if (!(t.includes(':') && t.split(':')[0] === name)) miss(notes, `кусок «${name}»: момент «${t}» назван не «${name}:<момент>»`);
  }
  for (const [key, act] of Object.entries(c.acts)) {
    if (!(key in scene.states)) miss(notes, `ключа действия «${key}» нет в states (${spec})`);
    act.values ??= [];
    act.tells ??= [];
    for (const t of act.tells) if (!(t.includes(':') && t.split(':')[0] === key)) miss(notes, `ключ действия «${key}»: момент «${t}» назван не «${key}:<момент>»`);
  }
  for (const key in c.party) if (!(key in scene.states)) miss(notes, `ключа партии «${key}» нет в states (${spec})`);
  // (a key the play has not decided yet is carried as the scene's own default)
  for (const [key, value] of Object.entries(carry(title, facts(fresh())) ?? {})) {
    if (!(key in c.party)) miss(notes, `ключа партии «${key}» (game.md §5 carry) нет в party контракта`);
    else if (JSON.stringify(c.party[key]) !== JSON.stringify(value)) miss(notes, `ключ партии «${key}»: по умолчанию ${JSON.stringify(c.party[key])}, игра без выборов несёт ${JSON.stringify(value)}`);
  }
  for (const ref of [...c.points, ...c.offers]) {
    if (!scene.objects.has(ref.split('#')[0])) miss(notes, `точка «${ref}»: элемента нет в ${spec}`);
  }
  for (const ref of c.offers) {
    const o = scene.objects.get(ref.split('#')[0]);
    if (o && !o.name) miss(notes, `предложение «${ref}»: у элемента нет name (${spec})`);
  }
}
for (const title of Object.values(SCENES)) if (!WORLD.has(title)) miss('story.js', `сцены «${title}» (SCENES) нет в мире`);
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
  if (!existsSync(join(game, file))) { miss(file, 'файла нет'); continue; }
  const ch = (await load(file)).default;
  CHAPTERS.push({ file, ...ch });
  if (!Array.isArray(ch.choices)) throw new Error(`${file}: нет choices`);
  if (!Array.isArray(ch.titles) || ch.titles.length !== ch.steps.length) miss(file, `titles: ${ch.titles?.length ?? 'нет'}, шагов: ${ch.steps.length}`);
}
const GAMES = new Map(); // a minigame (the module's default export) → {file, name, source}
const games = existsSync(join(game, 'minigames')) ? readdirSync(join(game, 'minigames')).filter(f => f.endsWith('.js')) : [];
for (const entry of games) {
  const file = `minigames/${entry}`, name = entry.slice(0, -3), m = (await load(file)).default;
  const source = readFileSync(join(game, file), 'utf8');
  GAMES.set(m, { file, name, source });
  const T = MINIGAMES[name];
  if (!T) { miss(file, 'мини-игры нет в таблице game.md §7'); continue; }
  if (typeof m.title !== 'string' || !(m.about > 0) || typeof m.run !== 'function') miss(file, 'нет title, about или run');
  if (!m.skipped || !same(Object.keys(m.skipped), T.result)) miss(file, `skipped: поля {${Object.keys(m.skipped ?? {}).join(', ')}}, в §7 итог {${T.result.join(', ')}}`);
  for (const key of T.opts ?? []) if (!new RegExp(`\\b${key}\\b`).test(source)) miss(file, `поле opts «${key}» (§7) в файле не названо`);
  for (const [, s] of source.matchAll(/\bsound\.(\w+)/g)) if (!(s in sound) || !(s in sound.unheard().sounds)) miss(file, `звука «${s}» нет в sound.js или в unheard()`);
  if (/\bg\.state\b/.test(source)) miss(file, 'мини-игра трогает g.state (§7: не трогает)');
  if (/\bg\.say\(/.test(source)) miss(file, 'мини-игра говорит свои реплики (§7: их даёт глава через opts)');
  // what it sets and waits for in its scene: the keys of §7 and the moments of the scene's contract
  const scene = sceneOf(T.scene);
  if (scene) {
    for (const k of [...T.keys, ...(T.listens ?? [])]) if (!(k in scene.states)) miss(file, `ключа «${k}» нет в states сцены «${SCENES[T.scene]}»`);
    for (const ref of T.points) {
      scene.named.add(`ref:${ref}`);
      if (scene.contract && !scene.contract.points.includes(ref) && !scene.contract.offers.includes(ref)) miss(file, `точки «${ref}» нет в points сцены «${SCENES[T.scene]}»`);
    }
    for (const [, text] of source.matchAll(/\btold\(\s*['"`]([^'"`]+)['"`]/g)) {
      scene.named.add(`tell:${text}`);
      if (!tells(scene, text)) miss(file, `момента «${text}» нет в контракте сцены «${SCENES[T.scene]}» (ни у куска, ни в acts)`);
    }
    for (const [, k, v] of source.matchAll(/\b(?:send|g\.set)\(\s*['"`](\w+)['"`]\s*,\s*['"`]([^'"`]+)['"`]/g)) {
      const act = scene.contract?.acts[k];
      if (act && !act.values.includes(v)) miss(file, `значения «${v}» ключа действия «${k}» нет в acts сцены «${SCENES[T.scene]}»`);
    }
  }
}
for (const name in MINIGAMES) if (![...GAMES.values()].some(m => m.name === name)) miss(`minigames/${name}.js`, 'файла нет');
// every sound has its unheard twin; and the names game.md §8 lists
const SOUNDS = ['beds', 'wake', 'pause', 'unheard', 'wind', 'rails', 'train', 'freight', 'crossing', 'room', 'clock', 'fire', 'crowd', 'pour',
  'horn', 'doors', 'knock', 'dog', 'door', 'creak', 'cough', 'tick', 'strike', 'rub', 'spill', 'box', 'glass', 'splash', 'crunch', 'thud',
  'scrape', 'clarinet', 'march', 'dance'];
for (const name of SOUNDS) if (typeof sound[name] !== 'function') miss('sound.js', `нет «${name}» (game.md §8)`);
const quiet = sound.unheard?.() ?? { sounds: {} };
const quietNames = Object.keys(quiet.sounds ?? {});
for (const name of quietNames) if (typeof sound[name] !== 'function') miss('sound.js', `звук «${name}» есть в unheard(), а в sound.js его нет`);
for (const name in sound) {
  if (typeof sound[name] === 'function' && !['pause', 'unheard', 'wake'].includes(name) && !quietNames.includes(name)) miss('sound.js', `звука «${name}» нет в unheard()`);
}
{
  const h = quiet.sounds?.march?.();
  if (!h || typeof h.loud !== 'function' || typeof h.stop !== 'function') miss('sound.js', 'unheard().sounds.march() — не ручка {loud, stop}');
}
// «Состав», as game.js opens it
const yard = WORLD.get(SCENES.yard);
if (yard) {
  for (const key of YARD.keys) {
    if (!(key in yard.states)) miss('game.js', `«${SCENES.yard}»: ключа «${key}» нет в states`);
    yard.named.add(`party:${key}`);
  }
  if (yard.contract && !yard.contract.offers.includes(YARD.offer)) miss('game.js', `«${SCENES.yard}»: предложения «${YARD.offer}» нет в контракте`);
  if (!yard.objects.has(YARD.offer.split('#')[0])) miss('game.js', `«${SCENES.yard}»: элемента «${YARD.offer.split('#')[0]}» нет`);
  else if (!yard.objects.get(YARD.offer.split('#')[0]).name) miss('game.js', `«${SCENES.yard}»: у элемента «signal» нет name`);
  yard.named.add(`ref:${YARD.offer}`);
}
// no b.offer anywhere (on engine 3 a choice is the language of mini-games)
for (const file of ['game.js', 'story.js', 'ui.js', ...CHAPTERS.map(c => c.file), ...[...GAMES.values()].map(m => m.file)]) {
  if (existsSync(join(game, file)) && /\bb\.offer\(/.test(readFileSync(join(game, file), 'utf8'))) miss(file, 'b.offer — на движке 3 выбор делается языком мини-игр');
}
// every mark is read in facts: itself, or the choice that set it (game.md §5)
{
  const reader = facts.toString();
  const marks = new Map([['knocked', null]]);
  for (const [choice, options] of Object.entries(EFFECTS)) for (const fx of Object.values(options)) for (const [key] of fx.marks ?? []) marks.set(key, choice);
  for (const [key, choice] of marks) {
    const self = new RegExp(`marks\\.${key}\\b`).test(reader), by = choice && new RegExp(`\\bc\\.${choice}\\b`).test(reader);
    if (!self && !by) miss('story.js facts', `метку «${key}» (и её выбор «${choice}») facts не читает`);
  }
}

// --- a step's g, watched: `here` — where it is (file, step), `events` — what the step did, in order:
// ['scene', title] | ['beat', name, seconds] | ['say', seconds] | ['act'] | ['play', name, about];
// `seen` — what the play did that its logic is checked by (LOGIC)
const lines = new Map(); // `${who}\n${text}` → {who, text, where}
const mute = () => ({ loud() {}, stop() {} });
function watched(g, j, ch, here, events, seen) {
  const bad = text => miss(here, text);
  let cur = null; // the scene shown: {title, scene, last: the beat begun last, opening: the beat it was opened with, not taken up yet, next: beat_next set}
  let during = false; // a minigame is on: what is said now is said inside it
  let open = 0; // beats begun and not yet waited for: a line said meanwhile is in the beat's own length
  let waits = []; // the moments waited for whose beat has not begun yet: {text, beat}
  const shown = what => (cur ? true : (bad(`${what} — до g.scene`), false));
  const key = (name, what, value) => {
    if (!shown(`${what} «${name}»`)) return;
    if (!(name in cur.scene.states)) bad(`${what}: ключа «${name}» нет в states сцены «${cur.title}»`);
    const act = cur.scene.contract?.acts[name];
    if (act && typeof value === 'string' && !act.values.includes(value)) bad(`${what}: значения «${value}» ключа действия «${name}» нет в acts сцены «${cur.title}»`);
  };
  const element = (ref, what) => {
    const o = cur.scene.objects.get(ref.split('#')[0]);
    if (!o) bad(`${what}: элемента «${ref.split('#')[0]}» нет в сцене «${cur.title}»`);
    return o;
  };
  const point = (ref, what) => {
    element(ref, what);
    cur.scene.named.add(`ref:${ref}`);
    if (cur.scene.contract && !cur.scene.contract.points.includes(ref) && !cur.scene.contract.offers.includes(ref)) bad(`${what}: точки «${ref}» нет в points сцены «${cur.title}»`);
  };
  const offer = (ref, what) => {
    const o = element(ref, what);
    if (o && !o.name) bad(`${what}: у элемента «${o.id}» нет name`);
    cur.scene.named.add(`ref:${ref}`);
    if (cur.scene.contract && !cur.scene.contract.offers.includes(ref)) bad(`${what}: предложения «${ref}» нет в offers сцены «${cur.title}»`);
  };
  const moment = (text, what) => {
    cur.scene.named.add(`tell:${text}`);
    if (!tells(cur.scene, text)) bad(`${what}: момента «${text}» нет у куска «${text.split(':')[0]}» сцены «${cur.title}»`);
  };
  const begins = (name, opening) => {
    const c = cur.scene.contract, beat = c?.beats[name];
    events.push(['beat', name, beat?.seconds ?? 0]);
    seen.beats.add(name);
    cur.scene.named.add(`beat:${name}`);
    if (c && !beat) bad(`куска «${name}» нет в сцене «${cur.title}»`);
    if (beat?.show === true) bad(`кусок «${name}» сцены «${cur.title}» — только для показа (show: true)`);
    // a beat not opening the scene: after one of its `after`, or a cut-beat — the next in the table after the one
    // before it, or the one beat_next named (game.md §4)
    if (!opening && cur.last && beat && !beat.after.includes(cur.last)) {
      const next = cur.scene.order[cur.scene.order.indexOf(cur.last) + 1];
      if (name !== next && cur.next !== name) put(cuts, here, `«${cur.title}»: ${cur.last} → ${name} — склейка не по таблице и без beat_next`);
    }
    // beat_next names the beat that truly comes next
    if (cur.next && cur.next !== name && !opening) bad(`beat_next «${cur.next}», а следующим играется «${name}» (сцена «${cur.title}»)`);
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
        bad(`звука «${n}» нет в sound.js или в unheard()`);
        return false;
      };
      if (name === 'beds') return (levels = {}, seconds) => { Object.keys(levels).forEach(known); q.beds(levels, seconds); };
      return known(name) ? q[name] : mute;
    },
  });
  const w = Object.create(g);
  Object.assign(w, {
    async scene(title, st = {}, how) {
      const scene = WORLD.get(title), party = carry(title, facts(g.state));
      if (!party) bad(`g.scene «${title}»: такой сцены нет в SCENES`);
      events.push(['scene', title]);
      if (scene && party) {
        cur = { title, scene, last: null, opening: typeof st.beat === 'string' ? st.beat : null, next: null };
        const carried = {};
        for (const k in party) {
          scene.named.add(`party:${k}`);
          if (!(k in scene.states)) bad(`ключа партии «${k}» нет в states сцены «${title}»`);
          if (scene.contract && !(k in scene.contract.party)) bad(`ключа партии «${k}» нет в party сцены «${title}»`);
          carried[k] = party[k];
        }
        (seen.opened[title] ??= []).push({ ...carried, ...st });
        // (a key the step itself opens the scene with: in states)
        for (const k in st) if (k !== 'beat') { key(k, 'g.scene', st[k]); scene.named.add(`party:${k}`); }
        if (cur.opening) begins(cur.opening, true);
        else bad(`сцена «${title}» открыта без куска`);
      } else if (!scene) cur = null;
      return g.scene(title, st, how); // (a scene the world lacks: the step breaks there — said)
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
      if (name == null) bad(`g.told «${text}»: не «<кусок>:<момент>»`);
      else if (beat === 'beat') { /* (a beat's end) */ }
      else if (cur?.scene.contract?.acts[beat]) moment(text, 'g.told');
      else if (cur?.last === beat) { moment(text, 'g.told'); bad(`g.told «${text}» поставлено после начала своего куска (у куска, которым сцена открыта, — после g.scene)`); }
      else waits.push({ text, beat });
      return g.told(text, ms);
    },
    set(k, value, seconds) {
      key(k, 'g.set', value);
      if (k === 'beat_next' && cur) {
        cur.next = value;
        if (cur.scene.contract && !(value in cur.scene.contract.beats)) bad(`beat_next «${value}»: такого куска нет в сцене «${cur.title}»`);
      }
      if (cur) (seen.set[cur.title] ??= {})[k] = value;
      return g.set(k, value, seconds);
    },
    get(k) { key(k, 'g.get'); return g.get(k); },
    move(k, value, seconds, ease) { key(k, 'g.move', value); if (cur) (seen.set[cur.title] ??= {})[k] = value; return g.move(k, value, seconds, ease); },
    when(k, test, ms) { key(k, 'g.when'); return g.when(k, test, ms); },
    watch(k, fn) { key(k, 'g.watch'); return g.watch(k, fn); },
    arrived(who, ms) { if (shown(`g.arrived «${who}»`)) element(who, 'g.arrived'); return g.arrived(who, ms); },
    say(who, text, at = who) {
      const what = `реплика «${text}»`;
      if (!(who in PEOPLE)) bad(`${what}: говорящего «${who}» нет в PEOPLE`);
      if (typeof text !== 'string' || typeof who !== 'string') bad(`${what}: не строка`);
      const n = LINE.get(`${who}\n${text}`);
      if (!n) {
        const near = LINES.find(l => l[2] === text);
        bad(near ? `${what}: в §8 это Р${String(near[0]).padStart(2, '0')} у «${near[1]}», не у «${who}»` : `${what} (${who}): такой реплики нет в §8 буква в букву`);
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
      const what = `выбор «${choice ?? Object.keys(offers).join(', ')}»`, ids = Object.values(offers).flat().map(o => o.id);
      if (shown(what)) for (const ref in offers) offer(ref, what);
      if (choice != null) {
        const declared = ch.choices.find(c => c.id === choice);
        if (!declared) bad(`${what}: его нет в choices главы`);
        else {
          // (an option offered only on a condition — kudimov's third — may be left out)
          const all = declared.options.map(o => o.id);
          if (!ids.every(id => all.includes(id)) || ids.length < 2) bad(`${what}: предложено {${ids.join(', ')}}, в choices главы {${all.join(', ')}}`);
          for (const o of Object.values(offers).flat()) {
            const d = declared.options.find(x => x.id === o.id);
            // (the petal may say more than the map's word: «Сказать: «Я его сын»» for «Я его сын», game.md §6)
            if (d && d.label !== o.label && !o.label.includes(d.label)) bad(`${what}: лепесток «${o.label}», в choices главы «${d.label}»`);
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
        bad('g.play: мини-игра не из minigames/ или её нет в §7');
        return g.play(minigame, opts);
      }
      const what = `мини-игра «${m.name}»`;
      events.push(['play', m.name, minigame.about ?? 0]);
      seen.played.add(m.name);
      if (shown(what)) {
        if (cur.title !== SCENES[T.scene]) bad(`${what} идёт в сцене «${cur.title}», в §7 — «${SCENES[T.scene]}»`);
        else {
          for (const k of T.keys) key(k, what);
          for (const k of T.listens ?? []) key(k, what);
          for (const ref of T.points ?? []) point(ref, what);
        }
      }
      for (const k in opts) {
        if (!(T.opts ?? []).includes(k)) bad(`${what}: поля opts «${k}» нет в §7`);
        else if (!new RegExp(`\\b${k}\\b`).test(m.source)) bad(`${what}: поле opts «${k}» в ${m.file} не названо`);
      }
      const result = await g.play(minigame, opts);
      // (what the chapter gives it to say: each once — an array of them, each of those)
      during = true;
      for (const v of Object.values(opts)) for (const fn of [v].flat()) if (typeof fn === 'function') await fn(T.points[0] ?? 'narrator');
      during = false;
      if (!result || typeof result !== 'object') {
        bad(`${what}: итога нет (skipped?)`);
        return result;
      }
      seen.results[m.name] = result;
      return new Proxy(result, {
        get(r, field) {
          if (typeof field === 'string' && field !== 'then' && !(field in (minigame.skipped ?? {}))) bad(`${what}: глава читает поле итога «${field}», в skipped его нет`);
          return r[field];
        },
      });
    },
  });
  return { g: w, left: () => waits.forEach(t => bad(`g.told «${t.text}»: кусок «${t.beat}» после этого в шаге не начался`)) };
}

// --- the logic of the play (game.md §11): each a name and the sides that must all be true or all false
const said = (s, n) => s.lines.has(n);
const opened = (s, title, beat) => (s.opened[title] ?? []).filter(o => !beat || o.beat === beat).at(-1);
const LOGIC = [
  ['Р102 «Возьми. Она — старшему»', (f, s) => [f.train === 'go' && f.boxHand, said(s, 102)]],
  ['Р106 «Теперь возьмёшь?»', (f, s) => [f.train === 'stay' && f.told === 'self' && f.boxWhere === 'cupboard', said(s, 106)]],
  ['Р110 «Табакерка уехала с ним»', (f, s) => [f.boxGone, said(s, 110)]],
  ['Р115 «Про оркестр»', (f, s) => [f.secret, said(s, 115)]],
  ['Р116 «Останься. Не ради отца»', (f, s) => [f.ninaFor, said(s, 116)]],
  ['Р119 «Володя» Нины', (f, s) => [f.came === 'none' && f.ninaCame, said(s, 119)]],
  ['Р101 «Володя!»', (f, s) => [f.came !== 'none', said(s, 101)]],
  ['Р100 Сильва в дверях', (f, s) => [f.silvaDoor, said(s, 100)]],
  ['Р103 «В субботу приезжай!»', (f, s) => [f.train === 'go' && f.told === 'self' && f.came !== 'none', said(s, 103)]],
  ['концовка «Опоздал»', (f, s) => [f.ending === 'late', said(s, 104), s.beats.has('home_late')]],
  ['концовка «Всё равно»', (f, s) => [f.ending === 'anyway', said(s, 107), s.beats.has('home_anyway')]],
  ['концовка «В субботу»', (f, s) => [f.ending === 'saturday', said(s, 108)]],
  ['концовка «Чемодан»', (f, s) => [f.ending === 'suitcase', said(s, 109)]],
  ['уехал', (f, s) => [f.train === 'go', s.beats.has('boards'), s.played.has('steklo')]],
  ['Р89 / Р90', (f, s) => [f.ninaIs === 'knows', said(s, 89), !said(s, 90)]],
  ['Р97 / Р98', (f, s, st) => (st.choices.truth === 'silent' ? [f.entry === 'asked', said(s, 97), !said(s, 98)] : [true])],
  ['третий вариант Жениха', (f, s) => [f.ninaIs === 'knows', (s.offered.kudimov ?? []).includes('for_me')]],
  ['итог «Окон» → knocked', (f, s) => [true, f.knocked === (s.results.okna?.knocked ?? []).join(''), (opened(s, SCENES.street, 'evening')?.knocked ?? f.knocked) === f.knocked]],
  ['итог «На цыпочках» → heard', (f, s) => (s.played.has('tsypochki') ? [true, s.set[SCENES.home]?.heard === (s.results.tsypochki.creaks > 0 ? 1 : 0)] : [true])],
  ['итог «Под руку» → snowy', (f, s) => (s.played.has('pod-ruku') ? [true, s.set[SCENES.hill]?.snowy === (s.results['pod-ruku'].falls > 0 ? 1 : 0)] : [true])],
  ['итог «Следом» → seen', (f, s) => (s.played.has('sledom') ? [true, s.set[SCENES.hill]?.seen === (s.results.sledom.seen > 0 ? 1 : 0)] : [true])],
  ['итог «Рюкзак» → torn', (f, s) => (s.played.has('ryukzak') ? [true, s.set[SCENES.platform]?.torn === (s.results.ryukzak.slips >= 2 ? 1 : 0)] : [true])],
  ['итог «Вёдра» → shed_left', (f, s) => (s.played.has('vyodra') ? [true, s.set[SCENES.street]?.shed_left === (s.results.vyodra.buckets >= 3 ? 1 : 0)] : [true])],
  ['итог «Бегом» → late_run', (f, s) => (s.played.has('begom') ? [true, opened(s, SCENES.platform, 'last')?.late_run === (s.results.begom.looks >= 2 ? 1 : 0)] : [true])],
];
// the scales as the choices move them, unclamped: within their bounds (a clamp would hide a slip)
const raw = choices => {
  const sum = { home: 0, lie: 0 };
  for (const [c, o] of Object.entries(choices)) for (const k in sum) sum[k] += EFFECTS[c]?.[o]?.[k] ?? 0;
  return sum;
};

// --- the walk
const b = page(WORLD, text => miss('b.trouble', text));
// one play: its choices, the results put in → {ending, came, chapters: [[events of each step]], lines}
async function walk(choices, results, steps = null) {
  const result = m => {
    const name = GAMES.get(m)?.name;
    return results[name] && { ...m.skipped, ...results[name] };
  };
  let came = fresh();
  const seen = { lines: new Set(), beats: new Set(), played: new Set(), opened: {}, set: {}, offered: {}, results: {} };
  const chapters = [];
  for (const ch of CHAPTERS) {
    const done = [];
    for (const [n, step] of ch.steps.entries()) {
      if (steps && !steps(ch, n)) continue;
      const here = `${ch.file}, шаг ${n + 1} «${ch.titles?.[n] ?? ''}»`, events = [];
      const j = jump(Infinity, sound.unheard(), { result });
      const state = { ...structuredClone(came), choices: Object.assign(Object.create(choices), came.choices) };
      const { g, left } = watched(context(b, null, null, state, j), j, ch, here, events, seen);
      const ok = await Promise.race([
        (async () => step(g))().then(() => true, e => { miss(here, `шаг сломался: ${e?.message || e}`); return true; }),
        j.idle.then(() => false),
      ]);
      if (!ok) miss(here, 'шаг всухую не дошёл до конца: ждёт того, чего в невидимом шаге нет');
      await j.idle; // (what the step began and did not wait for)
      left();
      came = { ...g.state, choices: { ...g.state.choices } };
      done.push(events);
    }
    chapters.push(done);
  }
  const f = facts(came);
  if (!steps) {
    if (!ENDINGS.some(e => e.id === f.ending)) miss('логика партии', `концовка «${f.ending}» — не из ENDINGS`);
    const sum = raw(came.choices);
    for (const [k, S] of Object.entries(SCALES)) {
      if (sum[k] < S.min || sum[k] > S.max) miss('логика партии', `шкала ${k}: ${sum[k]} — за пределами ${S.min}…${S.max}`);
    }
    for (const [name, test] of LOGIC) {
      const sides = test(f, seen, came);
      if (!sides.every(x => x === sides[0])) miss('логика партии', `${name}: ${sides.map(x => (x ? 'да' : 'нет')).join(' / ')} (концовка ${f.ending})`);
    }
  }
  return { ending: f.ending, came: f.came, chapters, lines: seen.lines };
}
const CHOICES = CHAPTERS.flatMap(ch => ch.choices);
// (kudimov's third — «Останься. Не ради отца» — only when Nina knows: crossing truth)
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
const say = (text = '') => out.push(text);
const met = set => (set.size && set.size < full ? ` (партий: ${set.size})` : '');
const clock = s => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;
const span = all => { const lo = Math.min(...all), hi = Math.max(...all); return lo === hi ? clock(lo) : `${clock(lo)}…${clock(hi)}`; };
const seconds = events => events.reduce((sum, e) => sum + (e[0] === 'beat' || e[0] === 'play' ? e[2] : e[0] === 'say' ? e[1] : 0), 0);
const withActs = events => seconds(events) + events.reduce((sum, e) => sum + (e[0] === 'act' ? ACT : e[0] === 'scene' ? OPEN : 0), 0);
// «Состав»: the very first (no title) and before each chapter with a wall (a title); after each with choices but V (a
// map); after the epilogue (the whole play's map)
const yards = () => TITLE_S + CHAPTERS.reduce((s, ch, c) => s + (c && ch.wall !== false ? TITLE_S : 0)
  + (ch.choices.length && c !== CHAPTERS.length - 2 ? MAP_S : 0), 0) + MAP_S;

say(`Мир: ${world} — сцен ${WORLD.size}. Игра: глав ${CHAPTERS.length}, шагов ${CHAPTERS.reduce((n, ch) => n + ch.steps.length, 0)}, выборов ${CHOICES.length}.`);
say(`Партий: ${full} (${combos.length} сочетаний выборов и ${EDGES.length * cover.length} с живыми итогами мини-игр на обоих краях), и каждый шаг отдельно.`);

say(`\n== Расхождения: ${misses.size} ==`);
for (const [text, set] of misses) say(`${text}${met(set)}`);

say(`\n== Склейки внутри сцены не по таблице и без beat_next: ${cuts.size} ==`);
for (const [text, set] of cuts) say(`${text}${met(set)}`);

say('\n== В контрактах сцен есть, ни одна партия не назвала ==');
for (const [title, scene] of WORLD) {
  const c = scene.contract;
  if (!c) continue;
  const left = [
    ...Object.entries(c.beats).filter(([name, beat]) => beat.show !== true && !scene.named.has(`beat:${name}`)).map(([name]) => `кусок ${name}`),
    ...[...new Set([...Object.values(c.beats).flatMap(beat => beat.tells), ...Object.values(c.acts).flatMap(a => a.tells)])].filter(t => !scene.named.has(`tell:${t}`)).map(t => `момент ${t}`),
    ...Object.keys(c.party).filter(k => !scene.named.has(`party:${k}`)).map(k => `ключ партии ${k}`),
    ...[...new Set([...c.points, ...c.offers])].filter(ref => !scene.named.has(`ref:${ref}`)).map(ref => `точка ${ref}`),
  ];
  say(`${title}: ${left.join('; ') || '—'}`);
}

const never = LINES.filter(([n]) => !plays.some(p => p.lines.has(n)));
say(`\n== Реплики §8, не сказанные ни в одной партии: ${never.length} ==`);
for (const [n, who, text] of never) say(`Р${String(n).padStart(2, '0')} ${who} | ${text}`);

say(`\n== Реплики: ${lines.size} (№ | кто | голос | текст | ≈ с) — по ним записывают голоса ==`);
for (const line of [...lines.values()].sort((a, z) => (a.n ?? 999) - (z.n ?? 999))) {
  say(`${line.n ? `Р${String(line.n).padStart(2, '0')}` : '—'} | ${line.who} | ${PEOPLE[line.who]?.voice ?? '?'} | ${line.text} | ${(0.3 + 0.06 * line.text.length).toFixed(1)}`);
}

say(`\n== Куски и время по концовкам и тому, кто пришёл (куски — seconds контракта, реплики в паузах — 0.3 с + 0.06 с на букву, мини-игры — about; в скобках — с выборами по ${ACT} с, открытием сцены по ${OPEN} с и «Составом»: титул ${TITLE_S} с, карта ${MAP_S} с) ==`);
for (const ending of ENDINGS) for (const who of ['family', 'father', 'none']) {
  const mine = plays.slice(0, full).filter(p => p.ending === ending.id && p.came === who);
  say(`\n-- ${ending.label} (${ending.id}), пришли: ${who} — партий ${mine.length} --`);
  if (!mine.length) continue;
  const times = mine.map(p => p.chapters.map(steps => seconds(steps.flat())));
  const all = mine.map(p => p.chapters.reduce((sum, steps) => sum + withActs(steps.flat()), 0) + yards());
  say(`время: ${CHAPTERS.map((ch, c) => `${ch.number || ch.title} ${span(times.map(t => t[c]))}`).join(' · ')} · всего ${span(times.map(t => t.reduce((a, x) => a + x, 0)))} (${span(all)})`);
  for (const [c, ch] of CHAPTERS.entries()) {
    for (const n of ch.steps.keys()) {
      const ways = new Map();
      for (const p of mine) {
        const events = p.chapters[c][n];
        const way = `${events.filter(e => e[0] !== 'say' && e[0] !== 'act').map(e => (e[0] === 'scene' ? `| ${e[1]}:` : e[0] === 'play' ? `[${e[1]}]` : e[1])).join(' ').replace(/^\| /, '') || '—'} — ${Math.round(seconds(events))} с`;
        ways.set(way, (ways.get(way) ?? 0) + 1);
      }
      for (const [way, count] of ways) say(`${ch.file} ${n + 1} «${ch.titles?.[n] ?? ''}»: ${way}${count < mine.length ? ` (партий: ${count})` : ''}`);
    }
  }
}

// a stretch of watching: from one thing the player does («Состав»'s semaphore, a choice, a minigame) to the next.
// «Состав» stands before a chapter unless it says wall: false, and after one that has choices but V (game.js)
const long = new Map(); // `${from} → ${to}` → [seconds of each play it is long in]
for (const p of plays.slice(0, full)) {
  let run = 0, from = 'начало';
  const acted = to => {
    if (run > WATCH) long.set(`${from} → ${to}`, [...(long.get(`${from} → ${to}`) ?? []), run]);
    run = 0;
    from = to;
  };
  for (const [c, ch] of CHAPTERS.entries()) {
    if (!c || ch.wall !== false) acted(`«Состав» перед ${ch.file}`);
    for (const [n, events] of p.chapters[c].entries()) {
      for (const e of events) {
        if (e[0] === 'beat') run += e[2];
        else if (e[0] === 'say') run += e[1];
        else if (e[0] !== 'scene') acted(`${ch.file}, шаг ${n + 1} «${ch.titles?.[n] ?? ''}»`);
      }
    }
    if (ch.choices.length && c !== CHAPTERS.length - 2) acted(`«Состав» после ${ch.file}`);
  }
  acted('конец');
}
say(`\n== Смотрение без действия дольше ${WATCH} с: ${long.size} ==`);
for (const [where, all] of long) say(`${where}: ${span(all)} (партий: ${all.length})`);

// (a dry run's clock — jump.js — keeps the process alive: leave once all is written)
process.stdout.write(`${out.join('\n')}\n`, () => process.exit(misses.size || cuts.size ? 1 : 0));
