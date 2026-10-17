// The check of the game's branches (game.md §11): node bespoke/check/run.mjs <a clone of the world>. No browser, no
// engine, nothing drawn. Every step of every chapter is played unseen, the way the author's map plays it (jump.js: a dry
// run, story.js context(…, j)), on a page that only knows the scenes' specs (fake.mjs): no time passes, the choices
// are those of the play walked, a minigame gives the result put in for it (else its `skipped`), a point asked for
// (g.spot) is answered with one.
// Walked: every combination of the twelve choices (4096) with every minigame skipped; and one play each with the
// results of game.md §11 ({seen: 0, caught: 1}, {jumps: 2}, {slips: 1}, {crooked: '01000100'}, {share: 0.3},
// {missed: 1}). Each play — all the steps in order, its state going from step to step.
// Noted, by a wrapper over the step's g (an unseen step's lines and offers never reach j) and over the sounds j plays:
// each scene opened and its keys (the party's too), each beat, moment waited for, key set / moved / read (beat_next
// too), point asked, offer and its options, line (who, text, over what), minigame with its opts and the fields of its
// result the chapter reads, letter (its voice is called, so its line is heard), sound. After each g.play every function
// of its opts is called once (onFocus(1), onFrame(true)…): the lines the minigames say are heard.
// Compared with each scene's scene.json and the block «Контракт для проверки» that ends its notes.md (scenes.md
// «Общее»): {beats: {name: {after, tells, seconds, show}}, points, offers, party, keys}; with the minigames' table
// (§7, MINIGAMES below), PEOPLE, sound.js and its unheard(), the lines of §8 (lines.mjs) letter for letter; and the
// agreement of each ending with what was said, played and carried (ENDS below).
// Printed: what does not match (file, step, name) — a scene the world lacks is said, the walk goes on; the cuts
// inside a scene not by its table; what the contracts have and no play named; the lines of §8 no play said; every
// line said (who, text) once — the voices are made from this list; for each ending — the beats of every step and the
// time by chapter and in all (the beats' `seconds`, the lines at 0.3 s + 0.06 s a letter, the minigames' `about`; and
// beside it with the touches and choices at 4 s, letters at 6 s, «Плёнка» at 30 s a chapter); every stretch of
// watching with nothing to do longer than 90 s.
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
const { SCENES, PEOPLE, SCALES, ENDINGS, HANDS, facts, carry, context } = await load('story.js');
const { jump } = await load('jump.js');
const sound = await load('sound.js');

const WATCH = 90; // a stretch of watching longer than this, s, is reported
const several = (stem, n, tail = '', from = 1) => Array.from({ length: n }, (_, i) => `${stem}${i + from}${tail}`);
// The minigames (game.md §7): the scene a minigame is played on, the keys it moves and those it only listens to, the
// points its marks stand on, the fields of its opts and of its result
const MINIGAMES = {
  podglyadyvat: { scene: 'hall', keys: ['peek', 'screen_film', 'bell', 'turn'], points: ['curtain#gap'], opts: ['onFirstBell', 'onCaught'], result: ['seen', 'caught'] },
  skleyka: { scene: 'booth', keys: [...several('cut', 3), ...several('glue', 3), ...several('bent', 3), 'boy_reach'],
    points: [...several('splice#cut', 3), ...several('splice#cut', 3, '_end'), ...several('splice#glue', 3)], opts: ['onCrooked'], result: ['jumps'] },
  bukvy: { scene: 'booth', keys: ['chalk_x', 'letters', 'crooked', 'wobble'], points: ['slate#start', 'slate#end'], result: ['crooked'] },
  zapravka: { scene: 'booth', keys: ['threaded', 'pull', 'loop'], points: several('thread#p', 6, '', 0), result: ['slips'] },
  luch: { scene: 'square', keys: ['beam_aim', 'beam_focus', 'wall_film'], points: ['wall#screen'], opts: ['onFocus'], result: ['seconds'] },
  vytaschit: { scene: 'booth', keys: ['drag', 'cough'], listens: ['drag_at'], points: ['toto#hand_r', 'floor#path0', 'floor#path1'], result: [] },
  kamera: { scene: 'square', keys: ['pan', 'elena_x', 'madman_x', 'rec'], points: [], opts: ['onFrame'], result: ['share'] },
  'sto-nochey': { scene: 'square', keys: ['chalk', 'night_kind', 'elena_window', 'mark_chalk'], points: ['toto', 'chalk_wall#chalk'], result: [] },
  smena: { scene: 'booth', keys: ['cue', 'motor1', 'motor2', 'active', 'white', 'clock'], points: ['projector#motor', 'projector#lever', 'projector2#motor', 'projector2#lever'], result: ['missed'] },
  zapiska: { scene: 'booth', keys: ['pages', 'fold', 'dust'], points: ['calendar#fold'], result: [] },
  lenta: { scene: 'booth', keys: ['strip_x'], points: ['strip#hand_r'], opts: ['onProgress'], result: ['seconds'] },
};
// what game.js itself takes of «Плёнка» (it is not run here): its key, the points its trees stand at (map.js) — each
// chapter's and the author's sign's
const MAP = { keys: ['shown'], points: [...Array.from({ length: 7 }, (_, i) => `c${i}`), 'author'] };
// the results put in (game.md §11): none — every minigame skipped; then one play each with these
const OTHER = [{ podglyadyvat: { seen: 0, caught: 1 } }, { skleyka: { jumps: 2 } }, { zapravka: { slips: 1 } },
  { bukvy: { crooked: '01000100' } }, { kamera: { share: 0.3 } }, { smena: { missed: 1 } }];
// the times of the script's length (game.md §11 «Длина по сценарию»): a touch or a choice, a letter, «Плёнка»
const ACT = 4, LETTER = 6, STRIP_S = 30;

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
  shown: {}, marks: {}, choices: {}, hands: {},
});

// --- the lines of §8: who and text → the number
const LINE = new Map(LINES.map(([n, who, text]) => [`${who}\n${text}`, n]));
const R = n => LINES.find(l => l[0] === n);

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
  if (!Object.values(SCENES).includes(title)) { miss(spec, `сцены «${title}» нет в SCENES игры (в игре её нет)`); continue; }
  try {
    if (!existsSync(join(world, notes))) throw new Error('файла нет');
    const c = contract(readFileSync(join(world, notes), 'utf8'));
    if (!c) throw new Error('блок контракта пуст');
    const shaped = c.beats && typeof c.beats === 'object' && Array.isArray(c.points) && Array.isArray(c.offers) && c.party && typeof c.party === 'object';
    if (!shaped) throw new Error('блок контракта не {beats, points, offers, party, keys}');
    if (!c.keys || typeof c.keys !== 'object') { miss(notes, 'в контракте нет «keys» (ключи игры)'); c.keys = null; }
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
    for (const t of beat.tells) if (!(t.includes(':') && t.split(':')[0] in c.beats)) miss(notes, `кусок «${name}»: момент «${t}» назван не «<кусок сцены>:<момент>»`);
  }
  for (const key in c.party) if (!(key in scene.states)) miss(notes, `ключа партии «${key}» нет в states (${spec})`);
  for (const key in c.keys ?? {}) if (!(key in scene.states)) miss(notes, `ключа игры «${key}» нет в states (${spec})`);
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
  if ((m.file ?? HANDS[m.title]) !== name) miss(file, `итог рук ляжет в hands «${m.file ?? HANDS[m.title]}», а файл — «${name}» (title «${m.title}», story.js HANDS)`);
  if (!m.skipped || !same(Object.keys(m.skipped), T.result)) miss(file, `skipped: поля {${Object.keys(m.skipped ?? {}).join(', ')}}, в §7 итог {${T.result.join(', ')}}`);
  for (const key of T.opts ?? []) if (!new RegExp(`\\b${key}\\b`).test(source)) miss(file, `поле opts «${key}» (§7) в файле не названо`);
  for (const [, s] of source.matchAll(/\bsound\.(\w+)/g)) if (!(s in sound) || !(s in sound.unheard().sounds)) miss(file, `звука «${s}» нет в sound.js или в unheard()`);
}
for (const name in MINIGAMES) if (![...GAMES.values()].some(m => m.name === name)) miss(`minigames/${name}.js`, 'файла нет');
// every sound has its unheard twin; and the names game.md §8 lists
const SOUNDS = ['beds', 'wake', 'pause', 'unheard', 'whirr', 'hall', 'square', 'crowd', 'cicadas', 'sea', 'rain', 'fire', 'wind_cold', 'station',
  'theme', 'motif', 'camera8', 'bell', 'creak', 'scissors', 'press', 'chalk', 'chalkSqueak', 'click', 'clunk', 'motor', 'tick', 'tick2',
  'laugh', 'roar', 'applause', 'whistle', 'whisper', 'giggle', 'coins', 'slap', 'flame', 'drag', 'cough', 'band', 'shutter', 'fireworks',
  'reelEnd', 'steps', 'door', 'car', 'trainHiss', 'trainWhistle', 'church', 'pigeons', 'paper', 'puff', 'whistleBlow', 'blast'];
for (const name of SOUNDS) if (typeof sound[name] !== 'function') miss('sound.js', `нет «${name}» (game.md §8)`);
const quiet = sound.unheard?.() ?? { sounds: {} };
const quietNames = Object.keys(quiet.sounds ?? {});
for (const name of quietNames) if (typeof sound[name] !== 'function') miss('sound.js', `звук «${name}» есть в unheard(), а в sound.js его нет`);
for (const name in sound) {
  if (typeof sound[name] === 'function' && !['pause', 'unheard', 'wake'].includes(name) && !quietNames.includes(name)) miss('sound.js', `звука «${name}» нет в unheard()`);
}
for (const handle of ['theme', 'camera8']) {
  const h = quiet.sounds?.[handle]?.();
  if (!h || typeof h.loud !== 'function' || typeof h.stop !== 'function') miss('sound.js', `unheard().sounds.${handle}() — не ручка {loud, stop}`);
}
// «Плёнка», as game.js opens it
const strip = WORLD.get(SCENES.strip);
if (strip) {
  for (const key of MAP.keys) {
    if (!(key in strip.states)) miss('game.js', `«${SCENES.strip}»: ключа «${key}» нет в states`);
    if (strip.contract && !(key in (strip.contract.keys ?? {}))) miss('game.js', `«${SCENES.strip}»: ключа «${key}» нет в keys контракта`);
    strip.named.add(`party:${key}`);
  }
  for (const ref of MAP.points) {
    if (strip.contract && !strip.contract.points.includes(ref)) miss('game.js', `«${SCENES.strip}»: точки «${ref}» нет в контракте`);
    strip.named.add(`ref:${ref}`);
  }
}

// --- a step's g, watched: `here` — where it is (file, step), `events` — what the step did, in order:
// ['scene', title] | ['beat', name, seconds] | ['say', seconds] | ['act'] | ['letter'] | ['play', name, about];
// `seen` — what the play did that the endings are checked by (ENDS)
const lines = new Map(); // `${who}\n${text}` → {who, text, where}
const mute = () => ({ loud() {}, stop() {} });
function watched(g, j, ch, here, events, seen) {
  const bad = text => miss(here, text);
  let cur = null; // the scene shown: {title, scene, last: the beat begun last, opening: the beat it was opened with, not taken up yet, next: beat_next set}
  let during = false; // a minigame is on: what is said now is said inside it
  let waits = []; // the moments waited for whose beat has not begun yet: {text, beat}
  const shown = what => (cur ? true : (bad(`${what} — до g.scene`), false));
  const key = (name, what, game) => {
    if (!shown(`${what} «${name}»`)) return;
    if (!(name in cur.scene.states)) bad(`${what}: ключа «${name}» нет в states сцены «${cur.title}»`);
    else if (game && cur.scene.contract?.keys && !(name in cur.scene.contract.keys) && name !== 'beat') bad(`${what}: ключа «${name}» нет в keys контракта сцены «${cur.title}»`);
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
    const c = cur.scene.contract, beat = text.split(':')[0];
    cur.scene.named.add(`tell:${text}`);
    if (c && !c.beats[beat]?.tells.includes(text)) bad(`${what}: момента «${text}» нет у куска «${beat}» сцены «${cur.title}»`);
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
    if (cur.next === name) cur.next = null;
    for (const w of waits.filter(w => w.beat === name)) if (!w.end) moment(w.text, 'g.told');
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
      if (scene && party) {
        cur = { title, scene, last: null, opening: typeof st.beat === 'string' ? st.beat : null, next: null };
        events.push(['scene', title]);
        const carried = {};
        for (const k in party) {
          scene.named.add(`party:${k}`);
          if (!(k in scene.states)) bad(`ключа партии «${k}» нет в states сцены «${title}»`);
          if (scene.contract && !(k in scene.contract.party)) bad(`ключа партии «${k}» нет в party сцены «${title}»`);
          carried[k] = party[k];
        }
        seen.carried[title] = { ...carried, beat: st.beat };
        (seen.opened[title] ??= []).push({ ...carried, beat: st.beat });
        // (a key the step itself opens the scene with: in states; a party key named so is named too)
        for (const k in st) { if (k !== 'beat') key(k, 'g.scene'); scene.named.add(`party:${k}`); }
        if (cur.opening) begins(cur.opening, true);
        else bad(`сцена «${title}» открыта без куска`);
      } else if (!scene) {
        cur = null;
        events.push(['scene', title]);
      }
      return g.scene(title, st, how); // (a scene the world lacks: the step breaks there — said)
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
      if (name == null) bad(`g.told «${text}»: не «<кусок>:<момент>»`);
      else if (beat === 'beat') { if (cur?.last !== name) waits.push({ text, beat: name, end: true }); }
      else if (cur?.last === beat) { moment(text, 'g.told'); bad(`g.told «${text}» поставлено после начала своего куска (у куска, которым сцена открыта, — после g.scene)`); }
      else waits.push({ text, beat });
      return g.told(text, ms);
    },
    set(k, value, seconds) {
      key(k, 'g.set', true);
      if (k === 'beat_next' && cur) cur.next = value;
      if (cur) (seen.set[cur.title] ??= {})[k] = value;
      return g.set(k, value, seconds);
    },
    get(k) { key(k, 'g.get'); return g.get(k); },
    move(k, value, seconds, ease) { key(k, 'g.move', true); if (cur) (seen.set[cur.title] ??= {})[k] = value; return g.move(k, value, seconds, ease); },
    when(k, test, ms) { key(k, 'g.when'); return g.when(k, test, ms); },
    watch(k, fn) { key(k, 'g.watch'); return g.watch(k, fn); },
    arrived(who, ms) { if (shown(`g.arrived «${who}»`)) element(who, 'g.arrived'); return g.arrived(who, ms); },
    // (unseen, no point is on the screen: answered with one — the step goes the way it does with the scene seen)
    async spot(ref) { if (shown(`g.spot «${ref}»`)) point(ref, 'g.spot'); return (await g.spot(ref)) ?? { x: 0, y: 0 }; },
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
      if (!during) events.push(['say', 0.3 + 0.06 * text.length]);
      return g.say(who, text, at);
    },
    choose(choice, offers) {
      const what = `выбор «${choice ?? Object.keys(offers).join(', ')}»`, ids = Object.values(offers).flat().map(o => o.id);
      if (shown(what)) for (const ref in offers) offer(ref, what);
      if (choice != null) {
        const declared = ch.choices.find(c => c.id === choice);
        if (!declared) bad(`${what}: его нет в choices главы`);
        else {
          if (!same(ids, declared.options.map(o => o.id))) bad(`${what}: предложено {${ids.join(', ')}}, в choices главы {${declared.options.map(o => o.id).join(', ')}}`);
          for (const o of Object.values(offers).flat()) {
            const d = declared.options.find(x => x.id === o.id);
            if (d && d.label !== o.label) bad(`${what}: лепесток «${o.label}», в choices главы «${d.label}»`);
          }
        }
      }
      events.push(['act']);
      return g.choose(choice, offers);
    },
    async letter(letter) {
      events.push(['letter']);
      if (!['note', 'letter', 'envelope'].includes(letter?.kind)) bad(`g.letter: kind «${letter?.kind}» — не note, letter, envelope`);
      const r = await g.letter(letter);
      // (its voice: said here, so that its line is heard)
      if (typeof letter?.voice === 'function') { during = true; await letter.voice(); during = false; }
      return r;
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
          for (const k of T.keys) key(k, what, true);
          for (const k of T.listens ?? []) key(k, what);
          for (const ref of T.points ?? []) point(ref, what);
        }
      }
      for (const k in opts) {
        if (!(T.opts ?? []).includes(k)) bad(`${what}: поля opts «${k}» нет в §7`);
        else if (!new RegExp(`\\b${k}\\b`).test(m.source)) bad(`${what}: поле opts «${k}» в ${m.file} не названо`);
      }
      const result = await g.play(minigame, opts);
      // (what the chapter gives it to say and to sound: each once)
      during = true;
      for (const fn of Object.values(opts)) if (typeof fn === 'function') await fn(1);
      during = false;
      if (!result || typeof result !== 'object') {
        bad(`${what}: итога нет (skipped?)`);
        return result;
      }
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

// --- the agreement of the ending with what the play did (game.md §11 «Согласие концовки»): each a name and the
// sides that must all be true or all false
const said = (s, n) => s.lines.has(n);
const carried = (s, title, key, beat) => {
  const all = s.opened[title] ?? [], at = beat ? all.filter(o => o.beat === beat) : all;
  return at.length ? at.at(-1)[key] : undefined;
};
const ENDS = [
  ['«Записка»', (f, s) => [f.ending === 'note', said(s, 93), s.played.has('zapiska'), carried(s, SCENES.rome, 'note_in_hand') === 1, said(s, 107)]],
  ['«Письма»', (f, s) => [f.ending === 'letters', said(s, 97)]],
  ['«Пусть останется»', (f, s) => [f.ending === 'turn', said(s, 89)]],
  ['Альфредо держит', (f, s) => [f.hold, said(s, 105)]],
  ['Тото — кино', (f, s) => [f.kino, said(s, 85), carried(s, SCENES.square, 'with_mother', 'demolition') === 0]],
  ['кадр у Тото', (f, s) => [f.frame, s.beats.has('wallet')]],
  ['плёнка у Тото', (f, s) => [f.reel8, s.beats.has('home_movie')]],
  ['«Останусь»', (f, s, st) => [st.choices.stay === 'stay', s.beats.has('autumn')]],
  ['правда Елене', (f, s) => [f.elena === 'truth', said(s, 114), carried(s, SCENES.quay, 'letter_in_hand', 'back') === 1]],
  ['подглядел меньше двух', (f, s) => [f.seen < 2, said(s, 128)]],
  ['смену пропустил', (f, s) => [f.missed >= 1, said(s, 129)]],
  ['кривые склейки', (f, s) => [f.jumps > 0, (carried(s, SCENES.booth, 'jumps', 'ruins') ?? 0) > 0, (carried(s, SCENES.rome, 'jumps') ?? 0) > 0]],
  ['кривые склейки — сколько', (f, s) => [true, (carried(s, SCENES.booth, 'jumps', 'ruins') ?? f.jumps) === f.jumps, (carried(s, SCENES.rome, 'jumps') ?? f.jumps) === f.jumps]],
  ['её доля в плёнке', (f, s) => (f.reel8 ? [f.share < 1, (carried(s, SCENES.home, 'share', 'room') ?? 1) < 1] : [true])],
  ['кривые буквы', (f, s) => [f.slate !== '00000000', (carried(s, SCENES.booth, 'slate_letters', 'ruins') ?? '00000000') !== '00000000']],
  ['петля не удержана', (f, s) => [f.slips >= 1, (s.set[SCENES.booth]?.stutter ?? 0) === 1]],
];

// --- the walk
const b = page(WORLD, text => miss('b.trouble', text));
// one play: its choices, the results put in → {ending, chapters: [[events of each step]], state}
async function walk(choices, results) {
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
      const here = `${ch.file}, шаг ${n + 1} «${ch.titles?.[n] ?? ''}»`, events = [];
      const j = jump(Infinity, sound.unheard(), { result });
      const state = { ...structuredClone(came), choices: Object.assign(Object.create(choices), came.choices) };
      const { g, left } = watched(context(b, null, null, state, j), j, ch, here, events, seen);
      const done = await Promise.race([
        (async () => step(g))().then(() => true, e => { miss(here, `шаг сломался: ${e?.message || e}`); return true; }),
        j.idle.then(() => false),
      ]);
      if (!done) miss(here, 'шаг всухую не дошёл до конца: ждёт того, чего в невидимом шаге нет');
      await j.idle; // (what the step began and did not wait for)
      left();
      came = { ...g.state, choices: { ...g.state.choices } };
      steps.push(events);
    }
    chapters.push(steps);
  }
  const f = facts(came);
  for (const [name, test] of ENDS) {
    const sides = test(f, seen, came);
    if (!sides.every(x => x === sides[0])) miss('согласие концовки', `${name}: ${sides.map(x => (x ? 'да' : 'нет')).join(' / ')} (концовка ${f.ending})`);
  }
  return { ending: f.ending, chapters, lines: seen.lines };
}
const CHOICES = CHAPTERS.flatMap(ch => ch.choices);
const combos = CHOICES.reduce((all, c) => all.flatMap(made => c.options.map(o => ({ ...made, [c.id]: o.id }))), [{}]);
const plays = [];
for (const choices of combos) { play = plays.length; plays.push(await walk(choices, {})); }
for (const other of OTHER) { play = plays.length; plays.push(await walk(combos[0], other)); }
play = null;

// --- the report
const out = [];
const say = (text = '') => out.push(text);
const met = set => (set.size && set.size < plays.length ? ` (партий: ${set.size})` : '');
const clock = s => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;
const span = all => { const lo = Math.min(...all), hi = Math.max(...all); return lo === hi ? clock(lo) : `${clock(lo)}…${clock(hi)}`; };
const seconds = events => events.reduce((sum, e) => sum + (e[0] === 'beat' || e[0] === 'play' ? e[2] : e[0] === 'say' ? e[1] : 0), 0);
const withActs = (events, ch) => seconds(events) + events.reduce((sum, e) => sum + (e[0] === 'act' ? ACT : e[0] === 'letter' ? LETTER : 0), 0);

say(`Мир: ${world} — сцен ${WORLD.size}. Игра: глав ${CHAPTERS.length}, шагов ${CHAPTERS.reduce((n, ch) => n + ch.steps.length, 0)}, выборов ${CHOICES.length}.`);
say(`Партий: ${plays.length} (${combos.length} сочетаний выборов и по одной с ${OTHER.map(o => JSON.stringify(o)).join(', ')}).`);

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
    ...[...new Set(Object.values(c.beats).flatMap(beat => beat.tells))].filter(t => !scene.named.has(`tell:${t}`)).map(t => `момент ${t}`),
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

say(`\n== Куски и время по концовкам (куски — seconds контракта, реплики — 0.3 с + 0.06 с на букву, мини-игры — about; в скобках — с касаниями и выборами по ${ACT} с, письмами по ${LETTER} с и «Плёнкой» по ${STRIP_S} с) ==`);
const stripsOf = () => CHAPTERS.reduce((n, ch) => n + (ch.wall !== false ? 1 : 0), 0) + 1;
for (const ending of ENDINGS) {
  const mine = plays.filter(p => p.ending === ending.id);
  say(`\n-- ${ending.label} (${ending.id}): партий ${mine.length} --`);
  if (!mine.length) continue;
  const times = mine.map(p => p.chapters.map(steps => seconds(steps.flat())));
  const full = mine.map(p => p.chapters.reduce((sum, steps) => sum + withActs(steps.flat()), 0) + stripsOf() * STRIP_S);
  say(`время: ${CHAPTERS.map((ch, c) => `${ch.number || ch.title} ${span(times.map(t => t[c]))}`).join(' · ')} · всего ${span(times.map(t => t.reduce((a, x) => a + x, 0)))} (${span(full)})`);
  for (const [c, ch] of CHAPTERS.entries()) {
    for (const n of ch.steps.keys()) {
      const ways = new Map();
      for (const p of mine) {
        const events = p.chapters[c][n];
        const way = `${events.filter(e => e[0] !== 'say' && e[0] !== 'act' && e[0] !== 'letter').map(e => (e[0] === 'scene' ? `| ${e[1]}:` : e[0] === 'play' ? `[${e[1]}]` : e[1])).join(' ').replace(/^\| /, '') || '—'} — ${Math.round(seconds(events))} с`;
        ways.set(way, (ways.get(way) ?? 0) + 1);
      }
      for (const [way, count] of ways) say(`${ch.file} ${n + 1} «${ch.titles?.[n] ?? ''}»: ${way}${count < mine.length ? ` (партий: ${count})` : ''}`);
    }
  }
}

// a stretch of watching: from one thing the player does (the lamp of «Плёнка», a choice, a letter, a minigame) to
// the next. «Плёнка» stands before a chapter unless it says wall: false, and after one that has choices (game.js)
const long = new Map(); // `${from} → ${to}` → [seconds of each play it is long in]
for (const p of plays) {
  let run = 0, from = 'начало';
  const acted = to => {
    if (run > WATCH) long.set(`${from} → ${to}`, [...(long.get(`${from} → ${to}`) ?? []), run]);
    run = 0;
    from = to;
  };
  for (const [c, ch] of CHAPTERS.entries()) {
    if (ch.wall !== false) acted(`«Плёнка» перед ${ch.file}`);
    for (const [n, events] of p.chapters[c].entries()) {
      for (const e of events) {
        if (e[0] === 'beat') run += e[2];
        else if (e[0] === 'say') run += e[1];
        else if (e[0] !== 'scene') acted(`${ch.file}, шаг ${n + 1} «${ch.titles?.[n] ?? ''}»`);
      }
    }
  }
  acted('конец');
}
say(`\n== Смотрение без действия дольше ${WATCH} с: ${long.size} ==`);
for (const [where, all] of long) say(`${where}: ${span(all)} (партий: ${all.length})`);

// (a dry run's clock — jump.js — keeps the process alive: leave once all is written)
process.stdout.write(`${out.join('\n')}\n`, () => process.exit(misses.size || cuts.size ? 1 : 0));
