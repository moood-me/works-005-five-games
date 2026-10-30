// What the game shows over the scene (bespoke.layer), as an old resort postcard written in pencil: warm white paper
// with a thin faded frame, graphite words in a light hand (Bad Script — "Lady Hand"), nothing bright (game.md §9). Red
// is the leash's alone: the leash of Anna's gauge, nothing else here.
//   The scales' pictures: the white spitz on its red leash low on the left (Anna: Duty ↔ Life — it sits by the
//   parapet's end on a short leash ↔ runs ahead on a long one), the pocket watch low on the right (Gurov: Lightness ↔
//   Openness — its lid shut ↔ open). They stand on the map, not over the play (a count kept in sight would argue with
//   the story's quiet sadness); in the play a scale's picture comes up only when it moves.
//   view.gauges({scales, shown} | null) — on the map: each scale the player has met, its two ends' words under it;
//     null — none
//   view.stir(name, {scales, shown}) — in the play: that scale's picture comes up, goes to where the scale now stands
//     and fades away again
//   view.toast(text, kind) — a slip of the postcard's paper in the corner: 'scale' (a scale moved: the word of the side
//     it moved to), 'rule' (what a scale means, the first time), 'mark' (remembered); three at most
//   view.hint(text, afterMs) — one line low in the middle, after `afterMs` (what to do: “Touch the dog”); → a function
//     that takes it away. One at a time: a new one takes the place of the one before
//   view.title(text, {signal}) — the words over the scene, as a postcard's caption; → once they have gone (9 s)
//   view.letter({text, sign}, {signal, onOpen}) — a sheet the player unfolds and folds: folded in three, pressed it
//     opens, pressed again it folds and goes; onOpen — once it lies open (its voice); → once it has gone. text: its
//     lines ('\n')
//   view.quiet() — what a chapter left showing taken away (the map comes)
//   view.author({chapters, plays: [labels], at() → {chapter, step}, games(as, chapter, step) → promise of [titles of
//     its minigames], go(as, chapter, step, game)}) — the author's map,
//     opened by his sign on the map (author() → what opens or closes it), lists the chapters, their steps and the
//     steps' minigames, to go to any — as the play picked under “play as…” has it by then (as: its index)
// Whatever is shown with a `signal` is taken away when it aborts (the step was left).
import { paper } from './sound.js';

const NS = 'http://www.w3.org/2000/svg';
const HAND = '1em "Lady Hand"';
const el = (tag, cls, parent) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  parent?.append(e);
  return e;
};
const svg = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  parent?.append(e);
  return e;
};
// (a button is never focused: no keys are the game's)
const button = (text, title, onclick, cls) =>
  Object.assign(el('button', cls), { type: 'button', textContent: text, title, onclick, onmousedown: e => e.preventDefault() });
// a slip of the postcard's paper: its frame is the CSS's (.card)
const card = (tag, cls, parent) => el(tag, `card ${cls}`, parent);

export function ui(layer) {
  const leash = leashGauge(layer);
  const watch = watchGauge(layer);
  const toasts = el('div', 'toasts', layer);
  let hinted = () => {}; // takes the hint shown now away
  return {
    gauges(state) {
      watch.show(state?.shown.heart, state?.scales.heart);
      leash.show(state?.shown.anna, state?.scales.anna);
    },
    stir(name, state) {
      (name === 'heart' ? watch : leash).stir(state.scales[name]);
    },
    toast(text, kind) {
      // three at most: the oldest goes for a new one
      while (toasts.childElementCount > 2) toasts.firstElementChild.remove();
      const slip = card('p', `slip ${kind}`, toasts);
      el('span', 'words', slip).textContent = text;
      const stay = kind === 'rule' ? 7500 : 4200;
      setTimeout(() => slip.classList.add('gone'), stay);
      setTimeout(() => slip.remove(), stay + 1600);
    },
    hint(text, afterMs = 0) {
      hinted();
      const h = card('p', 'hint', layer);
      el('span', 'words', h).textContent = text;
      const timer = setTimeout(() => h.classList.add('on'), afterMs);
      const off = () => {
        clearTimeout(timer);
        h.classList.remove('on');
        setTimeout(() => h.remove(), 1200);
      };
      hinted = off;
      return off;
    },
    title(text, { signal } = {}) {
      const t = el('div', 'title', layer);
      el('span', 'words', el('div', 'caption', t)).textContent = text;
      return new Promise(ok => {
        const timers = [setTimeout(() => t.classList.add('on'), 60), setTimeout(() => t.classList.remove('on'), 6600),
          setTimeout(() => { t.remove(); ok(); }, 9000)];
        signal?.addEventListener('abort', () => { timers.forEach(clearTimeout); t.remove(); ok(); });
      });
    },
    letter: (letter, { signal, onOpen } = {}) => unfold(layer, letter, signal, onOpen),
    // what a chapter left showing (its slips, its hint) taken away: the map comes
    quiet() {
      toasts.replaceChildren();
      hinted();
    },
    author({ chapters, plays, at, games, go }) {
      // the map (his sign on the map opens it): “play as…”, then every chapter a column of its steps (and their
      // minigames) in a window over the scene; a click outside, ✕ or Esc closes it
      const map = el('div', 'author-map', layer);
      map.hidden = true;
      let as = 0; // the play picked
      const close = () => { map.hidden = true; };
      map.onclick = e => { if (e.target === map) close(); };
      addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
      const open = () => {
        const here = at(), panel = el('div', 'author-panel');
        const pick = el('label', 'as');
        pick.append(`${tr('play as…')} `);
        const list = el('select', '', pick);
        list.append(...plays.map((label, i) => Object.assign(el('option'), { value: i, textContent: label, selected: i === as })));
        list.onchange = () => { as = Number(list.value); open(); };
        panel.append(button('✕', tr('close'), close, 'close'), pick, ...chapters.map((c, ci) => {
          const col = el('section');
          el('h3', '', col).textContent = c.number ? `${c.number}. ${c.title}` : c.title;
          for (const [si] of c.steps.entries()) {
            const step = button(c.titles[si], '', () => { close(); go(as, ci, si); }, ci === here.chapter && si === here.step ? 'here' : '');
            // (its minigames under it, once they are known: straight to one)
            const under = el('div', 'minigames');
            games(as, ci, si).then(list => under.append(...list.map((name, k) =>
              button(`◆ ${name}`, tr('straight to the minigame'), () => { close(); go(as, ci, si, k); }, 'minigame'))));
            col.append(step, under);
          }
          return col;
        }));
        map.replaceChildren(panel);
        map.hidden = false;
      };
      const toggle = () => (map.hidden ? open() : close());
      return toggle;
    },
  };
}

// a value going to a new one over 2 s (the gauges' drawings follow it each frame): set(v) → fn(now) as it goes
function glide(fn, seconds = 2) {
  let now = null, raf = 0;
  return v => {
    cancelAnimationFrame(raf);
    if (now == null) { now = v; fn(v); return; }
    const from = now, t0 = performance.now();
    const step = t => {
      const u = Math.min(1, (t - t0) / (seconds * 1000)), e = u * u * (3 - 2 * u);
      now = from + (v - from) * e;
      fn(now);
      if (u < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  };
}
// one scale's picture in its corner: on the map — once the scale is met, its two ends' words under it (`ends`: the
// low one, the high one); in the play — for a few seconds as it moves (STIR s)
const STIR = 5;
function gauge(box, set, [low, high]) {
  const words = svg('text', { class: 'ends', x: 36, y: 80, 'text-anchor': 'middle' }, box);
  words.textContent = `${low} · ${high}`;
  let timer = 0;
  return {
    show(met, value) {
      clearTimeout(timer);
      box.classList.toggle('named', !!met);
      box.style.opacity = met ? 1 : 0;
      if (met) set(value);
    },
    stir(value) {
      clearTimeout(timer);
      box.classList.remove('named');
      box.style.opacity = 1;
      // (it moves once it can be seen coming up)
      setTimeout(() => set(value), 600);
      timer = setTimeout(() => { box.style.opacity = 0; }, STIR * 1000);
    },
  };
}

// Anna (Duty ↔ Life, −3…3): the parapet's line, a hand at the left edge holding the red leash, the white spitz on the
// parapet at x = 14 + 44·(a + 3)/6 — the further it has run, the longer the leash
function leashGauge(layer) {
  const box = svg('svg', { class: 'gauge leash', viewBox: '0 0 72 72', 'aria-hidden': 'true' }, layer);
  svg('path', { class: 'parapet', d: 'M2 57.5 H70 M2 60.5 H70' }, box);
  svg('path', { class: 'hand', d: 'M1 30 q4 -2 6 1 q1 2 -1 3.5 q-3 1 -5 -0.5' }, box);
  const line = svg('path', { class: 'line' }, box);
  const dog = svg('g', { class: 'spitz' }, box);
  // (drawn facing right, its collar at (4, -9) from where it sits)
  svg('path', { class: 'tail', d: 'M-6 -6 c-5 -3 -4 -9 1 -9 c3 0 4 3 2 5' }, dog);
  svg('path', { class: 'body', d: 'M-7 0 c-1 -5 2 -9 7 -9 c4 0 6 2 7 5 c1 2 0 4 -1 4 z' }, dog);
  svg('path', { class: 'body', d: 'M1 -9 c-1 -4 2 -7 5 -7 c2 0 4 1 5 3 l3 1 c0 2 -2 3 -4 3 c-1 1 -2 2 -4 2 c-2 0 -4 -1 -5 -2 z' }, dog);
  svg('path', { class: 'ear', d: 'M4 -15 l1 -4 l2 3.5 M7.5 -15.5 l2 -3.5 l1 4' }, dog);
  svg('circle', { class: 'eye', cx: 9, cy: -12.5, r: 0.7 }, dog);
  svg('path', { class: 'collar', d: 'M3 -11 q2 2.5 4.5 2.2' }, dog);
  const move = glide(a => {
    const x = 14 + (44 * (Math.min(3, Math.max(-3, a)) + 3)) / 6, y = 57;
    dog.setAttribute('transform', `translate(${x.toFixed(2)} ${y})`);
    // the leash from the hand to the collar, sagging the less the further it is pulled
    const x0 = 6, y0 = 32, x1 = x + 5, y1 = y - 10, sag = Math.max(1.5, 9 - (x1 - x0) * 0.12);
    line.setAttribute('d', `M${x0} ${y0} Q ${((x0 + x1) / 2).toFixed(2)} ${(Math.max(y0, y1) + sag).toFixed(2)} ${x1.toFixed(2)} ${y1}`);
  });
  return gauge(box, move, [tr('Duty'), tr('Life')]);
}

// Gurov (Lightness ↔ Openness, −5…5): a pocket watch, its chain, its lid on a hinge at the top — shut when he keeps
// it light (0…15°: a little ajar about the middle), open when he hides nothing (60…110°); the lid seen turning over its
// hinge (its height cos of the angle: past 90° it stands above the watch, its inside to us)
function watchGauge(layer) {
  const box = svg('svg', { class: 'gauge watch', viewBox: '0 0 72 72', 'aria-hidden': 'true' }, layer);
  svg('path', { class: 'chain', d: 'M36 22 C 44 14, 56 16, 60 6 M60 6 l3 -2' }, box);
  svg('circle', { class: 'bow', cx: 36, cy: 22, r: 3 }, box);
  svg('rect', { class: 'crown', x: 34, y: 24, width: 4, height: 3, rx: 1 }, box);
  svg('circle', { class: 'case', cx: 36, cy: 45, r: 18 }, box);
  svg('circle', { class: 'face', cx: 36, cy: 45, r: 15.5 }, box);
  for (let h = 0; h < 12; h++) {
    const r = (h * Math.PI) / 6, long = h % 3 === 0 ? 3 : 1.6;
    svg('line', { class: 'tickmark', x1: 36 + Math.sin(r) * 13.5, y1: 45 - Math.cos(r) * 13.5, x2: 36 + Math.sin(r) * (13.5 - long), y2: 45 - Math.cos(r) * (13.5 - long) }, box);
  }
  svg('path', { class: 'hands', d: 'M36 45 L29.5 40.5 M36 45 L41 34' }, box);
  svg('circle', { class: 'pin', cx: 36, cy: 45, r: 1 }, box);
  // the lid: hinged at the top of the case (36, 27)
  const lid = svg('g', { class: 'lid' }, box);
  svg('circle', { class: 'lid-face', cx: 36, cy: 45, r: 18 }, lid);
  svg('circle', { class: 'lid-ring', cx: 36, cy: 45, r: 12 }, lid);
  svg('path', { class: 'lid-ring', d: 'M30 45 q6 -6 12 0 q-6 6 -12 0' }, lid);
  const turn = glide(h => {
    h = Math.min(5, Math.max(-5, h));
    const deg = h <= 0 ? (15 * (5 + h)) / 5 : 60 + (50 * (h - 1)) / 4;
    const k = Math.cos((Math.min(deg, 110) * Math.PI) / 180);
    lid.setAttribute('transform', `translate(0 27) scale(1 ${k.toFixed(3)}) translate(0 -27)`);
    lid.classList.toggle('inside', k < 0);
  });
  return gauge(box, turn, [tr('Lightness'), tr('Openness')]);
}

// the letter or the note: folded in three; pressed, it opens — the top third, then the bottom — and can be read; pressed
// again, it folds and goes
function unfold(layer, { text = '', sign }, signal, onOpen) {
  const veil = el('div', 'letter-veil', layer);
  const letter = el('div', 'letter', veil);
  const hint = card('p', 'letter-hint', veil);
  const sheet = el('div', 'sheet');
  for (const line of text.split('\n')) el('p', '', sheet).textContent = line;
  if (sign) el('p', 'sign', sheet).textContent = sign;
  for (const part of ['top', 'mid', 'bottom']) {
    const panel = el('div', `panel ${part}`, letter);
    el('div', 'face front', panel).append(part === 'top' ? sheet : sheet.cloneNode(true));
    el('div', 'face back', panel);
  }
  let stage = 'folded';
  const wait = ms => new Promise(ok => setTimeout(ok, ms));
  const cue = word => { hint.replaceChildren(); el('span', 'words', hint).textContent = word; };
  return new Promise(done => {
    const leave = () => { veil.remove(); done(); };
    signal?.addEventListener('abort', leave);
    const press = async () => {
      if (stage === 'folded') {
        stage = 'opening';
        hint.classList.remove('on');
        paper();
        letter.classList.add('open-top');
        await wait(650);
        paper();
        letter.classList.add('open-bottom');
        onOpen?.();
        await wait(2400);
        cue(tr('fold'));
        hint.classList.add('on');
        stage = 'open';
      } else if (stage === 'open') {
        stage = 'closing';
        hint.classList.remove('on');
        paper();
        letter.classList.remove('open-bottom');
        await wait(650);
        paper();
        letter.classList.remove('open-top');
        await wait(1100);
        veil.classList.remove('on');
        await wait(1300);
        signal?.removeEventListener('abort', leave);
        leave();
      }
    };
    veil.addEventListener('click', press);
    document.fonts.load(HAND).finally(async () => {
      veil.classList.add('on');
      await wait(1600);
      cue(tr('unfold'));
      if (stage === 'folded') hint.classList.add('on');
    });
  });
}
