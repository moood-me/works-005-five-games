// What the game shows over the scene (bespoke.layer), as the pages of an old illustrated edition: cream paper, sepia
// ink, a thin double engraved frame with corners, a serif (game.md §6). The notebook and the bag are the play's two
// figures; the stamps of a consul's visa say who remembers.
//   view.gauges({hours, money, shown, lines} | null) — the notebook (Time in hand) low on the left, the bag (the
//     carpet-bag) low on the right, each once the player has met it; null — none (the map, «The route»)
//   view.hours(state, was, line) — the old figure struck out, the new one written, and its entry under it: the
//     change and `line`, what it was for
//   view.money(state, was) — the sum changes; spent: notes fly from the bag
//   view.hero('fogg' | 'pp') — the medallion of his face, a moment, high on the left
//   view.giveBook({signal}) → once the player has touched the notebook (it glows till then)
//   view.toast(text, kind) — a card under the tools: 'rule' (what a figure means, the first time), 'stamp' (a visa
//     stamp: who remembers), 'stamp cold'; three at most
//   view.hint(text, afterMs) — one line low in the middle; → a function that takes it away
//   view.title(text, {signal}) — the title over the scene, a page of the old edition; → once it has gone (9 s)
//   view.letter({text, sign, kind}, {signal, onOpen}) — a sheet the player unfolds and folds: 'note', 'letter',
//     'envelope'; → once it has gone
//   view.quiet() — what a chapter left showing (its cards, its hint) taken away: the map comes
//   view.author({chapters, plays: [labels], at() → {chapter, step}, games(as, chapter, step) → promise of [titles of
//     its minigames], go(as, chapter, step, game)}) — the author's map, opened by his sign on the play's map (author()
//     → what opens or closes it): the chapters, their steps and the steps' minigames, to go to any — as the play picked
//     under «play as…» has it by then (as: its index)
// (⏸, ⏭ and ☰ are the page's: the game draws none of them.)
// Whatever is shown with a `signal` is taken away when it aborts (the step was left).
import { paper } from './sound.js';
import { BOOK, hoursText, moneyText } from './story.js';

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
  const book = bookGauge(layer);
  const bag = bagGauge(layer);
  const medal = el('div', 'medal', layer);
  const toasts = el('div', 'toasts', layer);
  let hinted = () => {}; // takes the hint shown now away
  return {
    gauges(state) {
      book.show(state?.shown.hours, state);
      bag.show(state?.shown.money, state);
    },
    hours(state, was, line) { book.change(state, was, line); },
    money(state, was) { bag.change(state, was); },
    hero(who) {
      medal.className = `medal ${who}`;
      medal.replaceChildren();
      el('div', 'face', medal);
      el('p', 'name', medal).textContent = who === 'pp' ? tr('Passepartout') : tr('Phileas Fogg');
      void medal.offsetWidth;
      medal.classList.add('on');
      clearTimeout(medal.timer);
      medal.timer = setTimeout(() => medal.classList.remove('on'), 1800);
    },
    giveBook({ signal } = {}) { return book.give(signal); },
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
    quiet() {
      toasts.replaceChildren();
      hinted();
    },
    author({ chapters, plays, at, games, go }) {
      // the map (his sign on the play's map opens it): «play as…», then every chapter a column of its steps (and their
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
        pick.append(tr('play as…'), ' ');
        const list = el('select', '', pick);
        list.append(...plays.map((label, i) => Object.assign(el('option'), { value: i, textContent: label, selected: i === as })));
        list.onchange = () => { as = Number(list.value); open(); };
        panel.append(button('✕', tr('close (Esc)'), close, 'close'), pick, ...chapters.map((c, ci) => {
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

// Fogg's notebook, low on the left: a narrow ruled page, «Time in hand» and the figure in an even hand; under it the
// last entries, each its change and what it was for (`+2 d · The Mongolia: two days early`); a change strikes the old
// figure out above the new one and writes its entry — changes coming close together are written one after another,
// each given its time to be read; the lines others wrote below — Aouda's slanted, Passepartout's a scrawl
const ENTRIES = 3, READ = 3500; // the entries the page shows; ms each new one is given before the next is written
function bookGauge(layer) {
  const box = el('div', 'book', layer);
  const page = el('div', 'page', box);
  el('p', 'head', page).textContent = tr('Time in hand');
  const was = el('p', 'was', page), now = el('p', 'now', page), log = el('div', 'log', page);
  const lines = el('div', 'lines', page);
  const queue = [];
  let writing = false;
  const hand = state => lines.replaceChildren(...(state.lines ?? []).map(l => Object.assign(el('p', `hand-${l.hand}`), { textContent: BOOK[l.line] })));
  // the next change in the queue written: struck, the new figure, its entry
  const next = () => {
    const c = queue.shift();
    writing = !!c;
    if (!c) return;
    was.textContent = hoursText(c.old);
    was.classList.remove('struck');
    void was.offsetWidth;
    was.classList.add('struck');
    now.textContent = hoursText(c.now);
    now.classList.remove('fresh');
    void now.offsetWidth;
    now.classList.add('fresh');
    const entry = el('p', 'entry fresh', log);
    entry.textContent = c.line ? `${hoursText(c.now - c.old)} · ${c.line}` : hoursText(c.now - c.old);
    while (log.childElementCount > ENTRIES) log.firstElementChild.remove();
    setTimeout(next, READ);
  };
  return {
    show(met, state) {
      box.classList.toggle('on', !!met);
      if (!met) return;
      if (!writing) now.textContent = hoursText(state.hours);
      hand(state);
    },
    change(state, old, line) {
      if (!state.shown.hours) return;
      queue.push({ old, now: state.hours, line });
      hand(state);
      if (!writing) next();
    },
    give(signal) {
      box.classList.add('on', 'asked');
      return new Promise(ok => {
        const done = () => { box.classList.remove('asked'); box.removeEventListener('click', done); paper(); ok(); };
        box.addEventListener('click', done);
        signal?.addEventListener('abort', () => { box.classList.remove('asked'); box.removeEventListener('click', done); });
      });
    },
  };
}

// the bag, low on the right: the corner of a wad of notes and the sum in engraved figures; spent — notes fly out
function bagGauge(layer) {
  const box = el('div', 'bag', layer);
  el('div', 'wad', box);
  const sum = el('p', 'sum', box);
  return {
    show(met, state) {
      box.classList.toggle('on', !!met);
      if (met) sum.textContent = moneyText(state.money);
    },
    change(state, old) {
      if (!state.shown.money) return;
      sum.textContent = moneyText(state.money);
      const n = Math.min(7, Math.max(1, Math.round(Math.abs(state.money - old) / 400)));
      for (let i = 0; i < n; i++) {
        const note = el('div', state.money < old ? 'flying out' : 'flying in', box);
        note.style.setProperty('--dx', `${Math.round(-60 + Math.random() * 50)}px`);
        note.style.setProperty('--r', `${Math.round(-40 + Math.random() * 80)}deg`);
        note.style.animationDelay = `${i * 0.12}s`;
        setTimeout(() => note.remove(), 2200 + i * 120);
      }
    },
  };
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
  const ask = word => { hint.replaceChildren(); el('span', 'words', hint).textContent = word; };
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
        ask(tr('fold'));
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
    document.fonts.load('1em "Around Title"').finally(async () => {
      veil.classList.add('on');
      await wait(1600);
      ask(tr('unfold'));
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
  el('p', 'address', face).textContent = tr('No. 7, Saville Row, London');
  el('p', 'stamp', face).textContent = text;
  if (sign) el('p', 'sign', face).textContent = sign;
  const hint = card('p', 'letter-hint', veil);
  let stage = 'down';
  const wait = ms => new Promise(ok => setTimeout(ok, ms));
  const ask = word => { hint.replaceChildren(); el('span', 'words', hint).textContent = word; };
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
        ask(tr('put aside'));
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
    document.fonts.load('1em "Around Title"').finally(async () => {
      veil.classList.add('on');
      await wait(1600);
      ask(tr('turn over'));
      if (stage === 'down') hint.classList.add('on');
    });
  });
}
