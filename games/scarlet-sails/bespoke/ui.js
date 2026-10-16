// What the game shows over the scene (bespoke.layer), on linen, in ink:
//   view.gauges({scales, shown} | null, hero) — each scale once the player has met it: the toy yacht low on the left
//     (Tale ↔ People: its sails scarlet ↔ white), the compass low on the right (Sea ↔ Home: its needle to the wave or
//     to the tower); hero ('assol' | 'grey' | 'both') — whose scene it is: their scale in full, the other one faint.
//     view.gauges(null) — none (the Far Sea, the epilogue)
//   view.toast(text, kind) — a strip of linen under the tools: 'scale' (a scale moved), 'rule' (what a scale means,
//     the first time), 'mark' (remembered)
//   view.hint(text, afterMs) — one line low in the middle, after `afterMs` (what to do); → a function that takes it
//     away. One at a time: a new one takes the place of the one before
//   view.title(text, {signal}) — words in the middle of the frame, as a film's title; → once they have gone
//   view.letter({text, sign}, {signal}) — a sheet of unbleached paper folded in three: pressed, it unfolds and can be
//     read; pressed again, it folds and goes; → then. text: its lines ('\n')
//   view.onSkip(fn) → off — what the ⏭ does now (the latest one, until off()); none, or null — the ⏭ not shown
//     (a minigame: skips the minigame, for every player — a safety net if it glitches, not a way through; a step:
//     skips the step, the author's only — game.js)
//   view.author({chapters, plays: [labels], at() → {chapter, step}, games(as, chapter, step) → promise of [titles of
//     its minigames], go(as, chapter, step, game)}) — the author's map,
//     opened by the page's ☰ (author() → what opens it, for bespoke.menu), lists
//     the chapters, their steps and the steps' minigames, to go to any (a minigame: its index among the step's) — as
//     the play picked under «play as…» has it by then (as: its index)
// Whatever is shown with a `signal` is taken away when it aborts (the step was left).
import { paper } from './sound.js';

const NS = 'http://www.w3.org/2000/svg';
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
// (a button is never focused: the keys are the minigames')
const button = (text, title, onclick, cls) =>
  Object.assign(el('button', cls), { type: 'button', textContent: text, title, onclick, onmousedown: e => e.preventDefault() });

export function ui(layer) {
  const boat = yacht(layer);
  const needle = compass(layer);
  const toasts = el('div', 'toasts', layer);
  // the corner's tools: ⏭ for everyone (⏸, ☰ — the page's)
  const tools = el('div', 'tools', layer);
  const skips = [];
  // (shown while the latest skip is something)
  const skipButton = button('⏭', tr('skip'), () => skips.at(-1)?.fn?.());
  const skipShown = () => { skipButton.hidden = !skips.at(-1)?.fn; };
  tools.append(skipButton);
  skipShown();
  let hinted = () => {}; // takes the hint shown now away
  return {
    gauges(state, hero) {
      boat.show(state?.shown.tale, state?.scales.tale, hero !== 'grey');
      needle.show(state?.shown.sea, state?.scales.sea, hero !== 'assol');
    },
    toast(text, kind) {
      // three at most: the oldest goes for a new one
      while (toasts.childElementCount > 2) toasts.firstElementChild.remove();
      const slip = el('p', `slip ${kind}`, toasts);
      // the arrows are the serif's: the hand has none
      for (const part of text.split(/(↑+)/)) if (part) el('span', part[0] === '↑' ? 'arrow' : '', slip).textContent = part;
      const stay = kind === 'rule' ? 7500 : 4200;
      setTimeout(() => slip.classList.add('gone'), stay);
      setTimeout(() => slip.remove(), stay + 1600);
    },
    hint(text, afterMs = 0) {
      hinted();
      const h = el('p', 'hint', layer);
      h.textContent = text;
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
      el('span', '', t).textContent = text;
      return new Promise(ok => {
        const timers = [setTimeout(() => t.classList.add('on'), 60), setTimeout(() => t.classList.remove('on'), 6600),
          setTimeout(() => { t.remove(); ok(); }, 9000)];
        signal?.addEventListener('abort', () => { timers.forEach(clearTimeout); t.remove(); });
      });
    },
    letter: (letter, { signal } = {}) => unfold(layer, letter, signal),
    onSkip(fn) {
      const it = { fn };
      skips.push(it);
      skipShown();
      return () => { const i = skips.indexOf(it); if (i >= 0) skips.splice(i, 1); skipShown(); };
    },
    author({ chapters, plays, at, games, go }) {
      // the map (the page's ☰ opens it): «play as…», then every chapter a column of its steps (and their minigames)
      // in a window over the scene;
      // a click outside, ✕ or Esc closes it
      const map = el('div', 'author-map', layer);
      map.hidden = true;
      let as = 0; // the play picked
      const close = () => { map.hidden = true; };
      map.onclick = e => { if (e.target === map) close(); };
      addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
      const open = () => {
        const here = at(), panel = el('div', 'author-panel');
        const pick = el('label', 'as');
        pick.append('play as… ');
        const list = el('select', '', pick);
        list.append(...plays.map((label, i) => Object.assign(el('option'), { value: i, textContent: label, selected: i === as })));
        list.onchange = () => { as = Number(list.value); open(); };
        panel.append(button('✕', 'close (Esc)', close, 'close'), pick, ...chapters.map((c, ci) => {
          const col = el('section');
          el('h3', '', col).textContent = c.number ? `${c.number}. ${c.title}` : c.title;
          for (const [si] of c.steps.entries()) {
            const step = button(c.titles[si], '', () => go(as, ci, si), ci === here.chapter && si === here.step ? 'here' : '');
            // (its minigames under it, once they are known: straight to one)
            const under = el('div', 'minigames');
            games(as, ci, si).then(list => under.append(...list.map((name, k) =>
              button(`◆ ${name}`, 'straight to the mini-game', () => go(as, ci, si, k), 'minigame'))));
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

// one scale's picture in its corner: seen once the scale is met, in full when the scene is its hero's
const gauge = (box, set) => ({
  show(met, value, full) {
    box.style.opacity = !met ? 0 : full ? 1 : 0.35;
    if (met) set(value);
  },
});

// the toy yacht (Tale ↔ People, −3…3): hull and mast in ink, its two sails between white and scarlet
function yacht(layer) {
  const box = svg('svg', { class: 'gauge yacht', viewBox: '0 0 72 72', 'aria-hidden': 'true' }, layer);
  svg('path', { class: 'ink', d: 'M8 50 H64 L55 62 H19 Z' }, box);
  svg('path', { class: 'line', d: 'M34 50 V6 M8 50 H64' }, box);
  const sails = [svg('path', { class: 'sail', d: 'M37 9 L61 45 H37 Z' }, box), svg('path', { class: 'sail', d: 'M31 15 V45 H11 Z' }, box)];
  return gauge(box, t => {
    const u = t >= 0 ? 0.65 + 0.35 * t / 3 : 0.65 * (1 + t / 3);
    for (const s of sails) s.style.fill = `color-mix(in srgb, var(--scarlet) ${(u * 100).toFixed(1)}%, #fff)`;
  });
}

// the compass (Sea ↔ Home, −4…4): a ring, the tower on its left, the wave on its right, the needle 15° a step —
// to the wave: to the right
function compass(layer) {
  const box = svg('svg', { class: 'gauge compass', viewBox: '0 0 72 72', 'aria-hidden': 'true' }, layer);
  svg('circle', { class: 'face', cx: 36, cy: 36, r: 33 }, box);
  svg('path', { class: 'ink', d: 'M9 44 V30 H11 V33 H13 V30 H15 V33 H17 V30 H19 V44 Z' }, box);
  svg('path', { class: 'line', d: 'M52 38 q2.5 -5 5 0 t5 0 M52 44 q2.5 -5 5 0 t5 0' }, box);
  const hand = svg('g', { class: 'needle' }, box);
  svg('path', { class: 'ink', d: 'M36 9 L40 36 H32 Z' }, hand);
  svg('path', { class: 'line', d: 'M32 36 L36 52 L40 36' }, hand);
  svg('circle', { class: 'ink', cx: 36, cy: 36, r: 2.5 }, box);
  return gauge(box, v => { hand.style.rotate = `${15 * v}deg`; });
}

// the letter: folded in three; pressed, it opens — the top third, then the bottom — and can be read; pressed again,
// it folds and goes
function unfold(layer, { text, sign }, signal) {
  const veil = el('div', 'letter-veil', layer);
  veil.tabIndex = 0;
  const letter = el('div', 'letter', veil);
  const hint = el('p', 'letter-hint', veil);
  const sheet = el('div', 'sheet');
  for (const line of text.split('\n')) el('p', '', sheet).textContent = line;
  el('p', 'sign', sheet).textContent = sign;
  for (const part of ['top', 'mid', 'bottom']) {
    const panel = el('div', `panel ${part}`, letter);
    el('div', 'face front', panel).append(part === 'top' ? sheet : sheet.cloneNode(true));
    el('div', 'face back', panel);
  }
  let stage = 'folded';
  const wait = ms => new Promise(ok => setTimeout(ok, ms));
  return new Promise(done => {
    const leave = () => veil.remove();
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
        await wait(2400);
        hint.textContent = tr('fold');
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
        done();
      }
    };
    veil.addEventListener('click', press);
    veil.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); press(); } });
    document.fonts.load('1em "Parusa Hand"').finally(async () => {
      veil.classList.add('on');
      veil.focus({ preventScroll: true });
      await wait(1600);
      hint.textContent = tr('unfold');
      if (stage === 'folded') hint.classList.add('on');
    });
  });
}
