// What the game shows over the scene (bespoke.layer), as the intertitles of a silent film: black cards, a thin double
// white frame with corners, white serif letters, a little flicker and grain (game.md §9). Warm is the beam's alone:
// the beam of Toto's gauge and, in the strip, the chosen frames — nothing else here.
//   view.gauges({scales, shown} | null, hero) — each scale once the player has met it: the booth's window with its beam
//     low on the left (Cinema ↔ People: the beam brighter ↔ the square's three windows warmer), the reel low on the right
//     (Hold ↔ Let go: the film wound tight ↔ a long tail flying); hero ('toto' | 'alfredo' | 'both') — whose
//     scene it is: their scale in full, the other at a third. view.gauges(null) — none (the strip, the epilogue)
//   view.toast(text, kind) — a card in the corner: 'scale' (a scale moved), 'rule' (what a scale means, the first
//     time), 'mark' (remembered); three at most
//   view.hint(text, afterMs) — one line low in the middle, after `afterMs` (what to do); → a function that takes it
//     away. One at a time: a new one takes the place of the one before
//   view.title(text, {signal}) — the title over the scene, an intertitle the size of the frame, see-through at its
//     edges; → once it has gone (9 s)
//   view.letter({text, sign, kind}, {signal, onOpen}) — a sheet the player unfolds and folds: kind 'note' (a yellowed
//     calendar leaf, pencil), 'letter' (a ruled sheet, blue ink) — folded in three, pressed it opens, pressed again it
//     folds and goes; 'envelope' — an envelope face down: pressed it turns over (its violet stamp: the text), pressed
//     again it goes. onOpen — once it lies open (its voice). → once it has gone. text: its lines ('\n')
//   view.replaying(on) — the plate «Replay» in the corner while a replay goes on (game.js)
//   view.author({chapters, plays: [labels], at() → {chapter, step}, games(as, chapter, step) → promise of [titles of
//     its minigames], go(as, chapter, step, game)}) — the author's map,
//     opened by his sign on the map (author() → what opens or closes it), lists the chapters, their steps and the
//     steps' minigames, to go to any — as the play picked under «play as…» has it by then (as: its index)
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
// (a button is never focused: no keys are the game's)
const button = (text, title, onclick, cls) =>
  Object.assign(el('button', cls), { type: 'button', textContent: text, title, onclick, onmousedown: e => e.preventDefault() });
// an intertitle card: the double frame and its corners are the CSS's (.card)
const card = (tag, cls, parent) => el(tag, `card ${cls}`, parent);

export function ui(layer) {
  const beam = beamGauge(layer);
  const reel = reelGauge(layer);
  const toasts = el('div', 'toasts', layer);
  const replay = el('div', 'replay', layer);
  replay.textContent = tr('Replay');
  replay.hidden = true;
  let hinted = () => {}; // takes the hint shown now away
  return {
    gauges(state, hero) {
      beam.show(state?.shown.toto, state?.scales.toto, hero !== 'alfredo');
      reel.show(state?.shown.alfredo, state?.scales.alfredo, hero !== 'toto');
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
      el('span', 'words', card('div', 'title-card', t)).textContent = text;
      return new Promise(ok => {
        const timers = [setTimeout(() => t.classList.add('on'), 60), setTimeout(() => t.classList.remove('on'), 6600),
          setTimeout(() => { t.remove(); ok(); }, 9000)];
        signal?.addEventListener('abort', () => { timers.forEach(clearTimeout); t.remove(); ok(); });
      });
    },
    letter: (letter, { signal, onOpen } = {}) => (letter.kind === 'envelope' ? envelope(layer, letter, signal, onOpen) : unfold(layer, letter, signal, onOpen)),
    replaying(on) { replay.hidden = !on; },
    author({ chapters, plays, at, games, go }) {
      // the map (his sign on the map opens it): «play as…», then every chapter a column of its steps (and their
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
        pick.append('play as… ');
        const list = el('select', '', pick);
        list.append(...plays.map((label, i) => Object.assign(el('option'), { value: i, textContent: label, selected: i === as })));
        list.onchange = () => { as = Number(list.value); open(); };
        panel.append(button('✕', 'close (Esc)', close, 'close'), pick, ...chapters.map((c, ci) => {
          const col = el('section');
          el('h3', '', col).textContent = c.number ? `${c.number}. ${c.title}` : c.title;
          for (const [si] of c.steps.entries()) {
            const step = button(c.titles[si], '', () => { close(); go(as, ci, si); }, ci === here.chapter && si === here.step ? 'here' : '');
            // (its minigames under it, once they are known: straight to one)
            const under = el('div', 'minigames');
            games(as, ci, si).then(list => under.append(...list.map((name, k) =>
              button(`◆ ${name}`, 'straight to the minigame', () => { close(); go(as, ci, si, k); }, 'minigame'))));
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

// Toto (Cinema ↔ People, −5…5): the booth's dark window top left, its beam down to the right — brighter the more he lives
// for the cinema —, the square's three small windows below — warmer the more he lives for people
function beamGauge(layer) {
  const box = svg('svg', { class: 'gauge beam', viewBox: '0 0 72 72', 'aria-hidden': 'true' }, layer);
  svg('rect', { class: 'wall', x: 4, y: 4, width: 64, height: 64, rx: 2 }, box);
  svg('rect', { class: 'port', x: 8, y: 9, width: 13, height: 10 }, box);
  const ray = svg('path', { class: 'ray', d: 'M20 11 L66 34 L66 54 L20 18 Z' }, box);
  const windows = [[14, 52], [32, 56], [50, 52]].map(([x, y]) => svg('rect', { class: 'window', x, y, width: 8, height: 9 }, box));
  return gauge(box, t => {
    const u = Math.min(1, Math.max(0, (t + 5) / 10));
    ray.style.opacity = (0.2 + 0.8 * u).toFixed(3);
    for (const w of windows) {
      w.style.fill = `color-mix(in srgb, #e9b46a ${((1 - u) * 100).toFixed(1)}%, #2a2620)`;
      w.style.opacity = (0.2 + 0.8 * (1 - u)).toFixed(3);
    }
  });
}

// Alfredo (Hold ↔ Let go, −3…3): a reel, the film wound on it; its tail goes out right and up — short when he
// holds the boy, long and flying when he lets him go
function reelGauge(layer) {
  const box = svg('svg', { class: 'gauge reel', viewBox: '0 0 72 72', 'aria-hidden': 'true' }, layer);
  svg('circle', { class: 'flange', cx: 30, cy: 42, r: 24 }, box);
  svg('circle', { class: 'film', cx: 30, cy: 42, r: 17 }, box);
  for (const a of [0, 120, 240]) {
    const r = (a * Math.PI) / 180;
    svg('circle', { class: 'hole', cx: 30 + Math.cos(r) * 9, cy: 42 + Math.sin(r) * 9, r: 3.6 }, box);
  }
  svg('circle', { class: 'hub', cx: 30, cy: 42, r: 2.4 }, box);
  // the tail leaves the wound film at its top right; a group so that CSS can let it sway about its root
  const sway = svg('g', { class: 'tail' }, box);
  const tail = svg('path', { class: 'strip' }, sway);
  return gauge(box, a => {
    const len = 8 + (40 * (3 - Math.min(3, Math.max(-3, a)))) / 6;
    const x0 = 42, y0 = 30, x1 = x0 + len * 0.72, y1 = y0 - len * 0.62;
    tail.setAttribute('d', `M${x0} ${y0} Q ${x0 + len * 0.5} ${y0 - len * 0.05} ${x1.toFixed(1)} ${y1.toFixed(1)}`);
    sway.style.setProperty('--fly', `${(len / 48) * 9}deg`);
  });
}

// the letter or the note: folded in three; pressed, it opens — the top third, then the bottom — and can be read; pressed
// again, it folds and goes
function unfold(layer, { text, sign, kind = 'letter' }, signal, onOpen) {
  const veil = el('div', 'letter-veil', layer);
  const letter = el('div', `letter kind-${kind}`, veil);
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
  const prompt = word => { hint.replaceChildren(); el('span', 'words', hint).textContent = word; };
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
        prompt(tr('fold'));
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
    document.fonts.load('1em "Paradiso Title"').finally(async () => {
      veil.classList.add('on');
      await wait(1600);
      prompt(tr('unfold'));
      if (stage === 'folded') hint.classList.add('on');
    });
  });
}

// the envelope that came back: face down; pressed, it turns over — the address, the violet stamp with its words;
// pressed again, it goes
function envelope(layer, { text, sign }, signal, onOpen) {
  const veil = el('div', 'letter-veil', layer);
  const env = el('div', 'envelope', veil);
  el('div', 'side back', env);
  const face = el('div', 'side front', env);
  el('p', 'address', face).textContent = tr('Palermo');
  el('p', 'stamp', face).textContent = text;
  if (sign) el('p', 'sign', face).textContent = sign;
  const hint = card('p', 'letter-hint', veil);
  let stage = 'down';
  const wait = ms => new Promise(ok => setTimeout(ok, ms));
  const prompt = word => { hint.replaceChildren(); el('span', 'words', hint).textContent = word; };
  return new Promise(done => {
    const leave = () => { veil.remove(); done(); };
    signal?.addEventListener('abort', leave);
    veil.addEventListener('click', async () => {
      if (stage === 'down') {
        stage = 'turning';
        hint.classList.remove('on');
        paper();
        env.classList.add('turned');
        onOpen?.();
        await wait(2400);
        prompt(tr('put aside'));
        hint.classList.add('on');
        stage = 'up';
      } else if (stage === 'up') {
        stage = 'going';
        hint.classList.remove('on');
        paper();
        veil.classList.remove('on');
        await wait(1300);
        signal?.removeEventListener('abort', leave);
        leave();
      }
    });
    document.fonts.load('1em "Paradiso Title"').finally(async () => {
      veil.classList.add('on');
      await wait(1600);
      prompt(tr('turn over'));
      if (stage === 'down') hint.classList.add('on');
    });
  });
}
