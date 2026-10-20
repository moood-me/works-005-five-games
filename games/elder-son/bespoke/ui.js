// What the game shows over the scene (bespoke.layer): frost and ink (game.md §9) — slips of frosted glass with a rime
// pattern at their edges, the words in dark blue ink, in the hand («Son Hand»). Warm (--lamp) is the lamp in the
// window-gauge alone.
//   view.gauge({scales, shown} | null) — the window-gauge low on the left: a wooden window of four panes, a dark room
//     behind it; the lamp in the room (Together ↔ Apart: warm ↔ almost out) once the player has met `home`, the rime on
//     the glass (Lie ↔ Truth: from the corners to all but a small circle ↔ a touch in the corners) once they have met
//     `lie`; nothing met — none. view.gauge(null) — none (the map, the epilogue)
//   view.toast(text, kind, arrows) — a slip in the corner: 'scale' (a scale moved: its side and arrows), 'rule' (what
//     a scale means, the first time), 'mark' (remembered); three at most
//   view.hint(text, afterMs) — one line low in the middle, after `afterMs`; → a function that takes it away. One at a
//     time: a new one takes the place of the one before
//   view.title(text, {signal}) — words in the middle of the frame; → once they have gone (9 s)
//   view.quiet() — what a chapter left showing (its slips, its hint) taken away: the map comes
//   view.author({chapters, plays: [labels], at() → {chapter, step}, games(as, chapter, step) → promise of [titles of
//     its minigames], go(as, chapter, step, game)}) — the author's map,
//     opened by his sign on the map (author() → what opens or closes it), lists the chapters, their steps and the
//     steps' minigames, to go to any — as the play picked under “play as…” has it by then (as: its index)
// (⏸, ⏭ and ☰ are the page's: the game draws none of them.)
// Whatever is shown with a `signal` is taken away when it aborts (the step was left).
import { SCALES } from './story.js';

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

export function ui(layer) {
  const window_ = windowGauge(layer);
  const toasts = el('div', 'toasts', layer);
  let hinted = () => {}; // takes the hint shown now away
  return {
    gauge(state) {
      window_.show(state);
    },
    toast(text, kind, arrows = '') {
      // three at most: the oldest goes for a new one
      while (toasts.childElementCount > 2) toasts.firstElementChild.remove();
      const slip = el('p', `slip ${kind}`, toasts);
      el('span', 'words', slip).textContent = text;
      if (arrows) el('span', 'arrows', slip).textContent = ` ${arrows}`;
      const stay = kind === 'rule' ? 7500 : 4200;
      setTimeout(() => slip.classList.add('gone'), stay);
      setTimeout(() => slip.remove(), stay + 1600);
    },
    hint(text, afterMs = 0) {
      hinted();
      const h = el('p', 'hint', layer);
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
      el('span', 'words', t).textContent = text;
      return new Promise(ok => {
        const timers = [setTimeout(() => t.classList.add('on'), 60), setTimeout(() => t.classList.remove('on'), 6600),
          setTimeout(() => { t.remove(); ok(); }, 9000)];
        signal?.addEventListener('abort', () => { timers.forEach(clearTimeout); t.remove(); ok(); });
      });
    },
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

// The window-gauge (80×80): a wooden frame of four panes; behind the glass a dark room. The lamp (home): a shade and a
// warm circle of light, its colour between #1d2a3c and the lamp's by u = (home − min) / (max − min), all but out
// below u 0.3. The rime (lie): a pattern from the corners toward the middle, drawn through a mask whose clear middle
// shrinks as v = (lie − min) / (max − min) grows — at 0 a touch in the corners, at 1 all the glass but a small circle;
// it goes there over 2 s.
const LAMP = '#e8963a', DARK = '#1d2a3c';
let gauges = 0; // (each gauge's own ids in the page)
function windowGauge(layer) {
  const id = `son-gauge-${gauges++}`;
  const box = svg('svg', { class: 'gauge window', viewBox: '0 0 80 80', 'aria-hidden': 'true' }, layer);
  const defs = svg('defs', {}, box);
  // the light of the lamp: a soft circle
  const glow = svg('radialGradient', { id: `${id}-glow` }, defs);
  const glowIn = svg('stop', { offset: '0', 'stop-color': LAMP, 'stop-opacity': '0.9' }, glow);
  svg('stop', { offset: '1', 'stop-color': LAMP, 'stop-opacity': '0' }, glow);
  // the rime's mask: clear in the middle up to `clear`, frosted from `clear` + 0.18 outward
  const fade = svg('radialGradient', { id: `${id}-fade`, cx: '0.5', cy: '0.5', r: '0.71' }, defs);
  const clearAt = svg('stop', { offset: '0.85', 'stop-color': '#000' }, fade);
  const frostAt = svg('stop', { offset: '1', 'stop-color': '#fff' }, fade);
  const mask = svg('mask', { id: `${id}-mask`, maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: 80, height: 80 }, defs);
  svg('rect', { x: 6, y: 6, width: 68, height: 68, fill: `url(#${id}-fade)` }, mask);
  // the rime itself: fern-like noise, white
  const filter = svg('filter', { id: `${id}-rime`, x: 0, y: 0, width: 1, height: 1 }, defs);
  svg('feTurbulence', { type: 'fractalNoise', baseFrequency: '0.09 0.16', numOctaves: 4, seed: 7, result: 'n' }, filter);
  svg('feColorMatrix', { in: 'n', values: '0 0 0 0 0.89  0 0 0 0 0.91  0 0 0 0 0.94  0 0 0 2.6 -0.75' }, filter);
  // the room behind the glass
  svg('rect', { class: 'room', x: 6, y: 6, width: 68, height: 68 }, box);
  const lamp = svg('g', { class: 'lamp' }, box);
  const light = svg('circle', { cx: 40, cy: 44, r: 30, fill: `url(#${id}-glow)` }, lamp);
  svg('line', { class: 'cord', x1: 40, y1: 6, x2: 40, y2: 30 }, lamp);
  const shade = svg('path', { class: 'shade', d: 'M31 38 L35 30 L45 30 L49 38 Z' }, lamp);
  const bulb = svg('circle', { cx: 40, cy: 39.5, r: 2.6 }, lamp);
  const rime = svg('rect', { class: 'rime', x: 6, y: 6, width: 68, height: 68, filter: `url(#${id}-rime)`, mask: `url(#${id}-mask)` }, box);
  // the frame: the sash, the cross of the four panes
  svg('path', { class: 'frame', 'fill-rule': 'evenodd',
    d: 'M2 2 H78 V78 H2 Z M6 6 V38.5 H38.5 V6 Z M41.5 6 V38.5 H74 V6 Z M6 41.5 V74 H38.5 V41.5 Z M41.5 41.5 V74 H74 V41.5 Z' }, box);
  let clear = 0.85, toward = 0.85, from = 0.85, began = 0, raf = 0;
  const paintRime = () => {
    clearAt.setAttribute('offset', clear.toFixed(3));
    frostAt.setAttribute('offset', Math.min(1, clear + 0.18).toFixed(3));
  };
  const tween = now => {
    const k = Math.min(1, (now - began) / 2000), e = k * k * (3 - 2 * k);
    clear = from + (toward - from) * e;
    paintRime();
    raf = k < 1 ? requestAnimationFrame(tween) : 0;
  };
  paintRime();
  return {
    show(state) {
      const home = state?.shown.home, lie = state?.shown.lie;
      box.style.opacity = home || lie ? 1 : 0;
      if (!state) return;
      lamp.style.opacity = home ? 1 : 0;
      if (home) {
        const H = SCALES.home, u = Math.min(1, Math.max(0, (state.scales.home - H.min) / (H.max - H.min)));
        const on = u < 0.3 ? u / 0.3 * 0.25 : 0.25 + 0.75 * (u - 0.3) / 0.7; // (below 0.3 all but out)
        const colour = `color-mix(in srgb, ${LAMP} ${(on * 100).toFixed(1)}%, ${DARK})`;
        light.style.opacity = on.toFixed(3);
        glowIn.setAttribute('stop-opacity', (0.35 + 0.55 * on).toFixed(3));
        shade.style.fill = colour;
        bulb.style.fill = colour;
      }
      rime.style.opacity = lie ? 1 : 0;
      if (lie) {
        const L = SCALES.lie, v = Math.min(1, Math.max(0, (state.scales.lie - L.min) / (L.max - L.min)));
        const target = 0.85 - 0.75 * v; // 0.85: the corners only … 0.10: all but a small circle
        if (Math.abs(target - toward) > 1e-3) {
          from = clear;
          toward = target;
          began = performance.now();
          if (!raf) raf = requestAnimationFrame(tween);
        }
      }
    },
  };
}
