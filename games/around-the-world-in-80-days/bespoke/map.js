// The map's trees (game.js map), over «The route» — an old map of the world, the way in red ink. The scene is only the
// background and a point for each chapter (c<i>: unseen, where the chapter's knot is — the place on the map the chapter
// is played at) and for the author's sign (author); each tree is the game's own, HTML laid out by CSS in normal flow (its
// words never run into one another) — each chapter a page of the old edition pinned to the map at its place: its
// number, title and heading («in which…») at the top, its knot a red-ink pin, its rows of choices (the forks) — what
// was chosen written in red ink, what could have been in pencil, what was never reached left blank —, in
// bespoke.underlay (under the language's marks, which stand on its knots, forks and pointers). A row: the question
// left, the trunk and its dot in the middle (a short SVG, seg), the answers right: the one chosen first, the others on
// twigs; a replay's thread dashed beside the trunk, its plate over the page; where the play stands — a pointer at the
// trunk's end, «continue the game» or «continue the replay». A chapter to come — a blank page, its number only. The
// epilogue's page, once the play is through, ends with the finale: its endings, the one it came to inked. It stands at
// its chapter's point, the knot there, and goes with it each frame the scene says (bespoke.onFrame): the view dragged,
// brought to a chapter, walked toward (the wheel, a pinch: nearer, larger — by the point's depth). What lives is CSS,
// the page's own (it stands with the play's pause): the pins breathe, the pointers nudge; a chapter just played grows
// row by row.
// What can be done on it is the map's own: its pointers, played forks (the dot, the answer chosen), knots and heads,
// the replay's plate, the author's sign — pressed, the game opens the language's mark there, born open (story.js
// hub.ask). Only what is offered takes a touch (≥ 44 px); the rest of it is the scene's (the view dragged).
//   trees(b, chapters, {grow, seconds, author}) → { at(ref) → () => {x, y} | null — that element's page point now
//     (refs: knot:<i>, fork:<i>:<k> — the dot of row k —, go:<i> — the main run's pointer —, goreplay:<i> — the
//     replay's —, badge:<i> — the replay's plate —, author); offer(refs, fn) — those take a press, fn(ref) told; remove() }
//   chapters — as game.js sky() gives them: [{number, title, heading, kind: here | played | next | future, rows: [{title, weight, options: [{label, state: chosen | tried | both | open | unseen}]}], go: the play's
//     pointer's words | null, replay: a replay goes on in it, badge: a replay of it — its plate, badge:<i>}]; grow —
//     the chapter whose rows come one after another over `seconds`; author — the author's sign shown
const DIST = 10; // m: the points' distance from the eye — a tree drawn at its size there
const FLAG = '◆'; // a key fork's sign (⚑)
// the author's sign (SVG): a quill in an inkwell
const AUTHOR = '<svg viewBox="-26 -30 52 56" aria-hidden="true"><path class="well" d="M-14 8 H14 L11 24 H-11 Z"></path><path class="neck" d="M-7 8 V3 H7 V8"></path><path class="quill" d="M2 4 L20 -28 C10 -24 4 -14 2 4 Z"></path><path class="rib" d="M2 4 L16 -22"></path></svg>';
const NS = 'http://www.w3.org/2000/svg';
const el = (tag, cls, text) => Object.assign(document.createElement(tag), cls ? { className: cls } : {}, text != null ? { textContent: text } : {});
const svg = (tag, attrs) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); return e; };

export function trees(b, chapters, { grow = null, seconds = 6, author = false } = {}) {
  const root = el('div', 'map route');
  b.underlay.append(root);
  // [{ref: the scene's point, box: at it (scaled there), nodes: Map ref → an element a mark stands on, offsets: Map ref
  // → [x, y] from the point at size 1}]
  const stands = [];
  const where = new Map(); // a mark's ref → the stand it is in
  let offered = new Set(), told = null;
  root.addEventListener('click', e => {
    const ref = e.target.closest?.('[data-ref]')?.dataset.ref;
    if (ref && offered.has(ref)) told?.(ref);
  });
  // (what is offered takes a touch, the rest does not)
  const can = () => {
    for (const n of root.querySelectorAll('[data-ref]')) {
      const on = offered.has(n.dataset.ref);
      n.classList.toggle('can', on);
      if (n.tagName === 'BUTTON') n.tabIndex = on ? 0 : -1;
    }
  };

  function build() {
    root.replaceChildren();
    stands.length = 0;
    where.clear();
    root.style.setProperty('--h', `${b.frame().h}px`);
    chapters.forEach((c, i) => stand(`c${i}`, chapter(c, i)));
    if (author) stand('author', sign());
    can();
    // (laid out: the tree hung by its knot from its point; where each mark's element is — offsets, as laid out, not as
    // drawn: no transform counts)
    for (const s of stands) {
      const [ox, oy] = s.origin();
      s.tree.style.left = `${-ox}px`;
      s.tree.style.top = `${-oy}px`;
      for (const [ref, node] of s.nodes) {
        const [x, y] = within(node, s.tree);
        s.offsets.set(ref, [x + node.offsetWidth / 2 - ox, y + node.offsetHeight / 2 - oy]);
        where.set(ref, s);
      }
    }
    place(true);
  }
  // where an element lies in the tree, as laid out
  const within = (node, tree) => {
    let x = 0, y = 0;
    for (let n = node; n && n !== tree; n = n.offsetParent) { x += n.offsetLeft; y += n.offsetTop; }
    return [x, y];
  };
  // a stand: an element at a point of the scene; origin() — where in the tree the point is
  function stand(ref, { tree, nodes, origin }) {
    const box = el('div', 'stand');
    box.append(tree);
    root.append(box);
    stands.push({ ref, box, tree, nodes, origin, offsets: new Map(), now: '' });
  }

  // the trunk's piece of a row: a line of red ink
  const seg = () => {
    const s = svg('svg', { class: 'seg', viewBox: '0 0 10 100', preserveAspectRatio: 'none', 'aria-hidden': 'true' });
    s.append(svg('path', { class: 'glow', d: 'M5 0V100' }), svg('path', { class: 'line', d: 'M5 0V100' }));
    return s;
  };
  const arrow = () => { const a = svg('svg', { class: 'arr', viewBox: '0 0 26 10', 'aria-hidden': 'true' }); a.append(svg('path', { d: 'M0 5H24M19 1l5 4-5 4' })); return a; };
  // a press's place: a button (none of it seen) over what it is on
  const hit = (ref, label) => {
    const h = Object.assign(el('button', 'hit'), { type: 'button', tabIndex: -1, ariaLabel: label });
    h.dataset.ref = ref;
    return h;
  };
  const tip = r => { const t = svg('svg', { class: r ? 'tip r' : 'tip', viewBox: '0 0 12 8', 'aria-hidden': 'true' }); t.append(svg('path', { d: 'M1 1L6 6L11 1' })); return t; };
  // the knot: the pin on the page's top (its core — where the chapter's point is)
  const lamp = (i, label) => {
    const knot = el('div', 'knot'), core = el('i', 'core');
    knot.append(seg(), el('i', 'halo'), core);
    if (label != null) knot.append(hit(`knot:${i}`, label));
    return { knot, core };
  };
  const hang = (tree, core) => () => { const [x, y] = within(core, tree); return [x + core.offsetWidth / 2, y + core.offsetHeight / 2]; };

  // a chapter's tree — a page pinned to the map (one to come: a blank page, its number only, its pin where a played
  // one's is)
  function chapter(c, i) {
    const tree = el('section', `tree ${c.kind}${c.kind === 'here' ? ' current' : ''}${i === grow ? ' grow' : ''}`), nodes = new Map();
    const head = el('header', 'head');
    head.append(el('div', 'num', c.number || ''));
    if (c.kind === 'future') {
      head.append(el('div', 'title', ' '));
      const { knot, core } = lamp(i, null);
      tree.append(head, knot, el('i', 'blank'));
      return { tree, nodes, origin: hang(tree, core) };
    }
    if (c.badge) {
      const badge = el('div', 'badge');
      badge.append(el('i'), tr('Replay'));
      badge.dataset.ref = `badge:${i}`;
      tree.prepend(badge);
      nodes.set(`badge:${i}`, badge);
    }
    head.append(el('div', 'title', c.title));
    if (c.heading) head.append(el('div', 'heading', c.heading));
    head.dataset.ref = `knot:${i}`;
    const { knot, core } = lamp(i, c.title);
    tree.append(head, knot);
    nodes.set(`knot:${i}`, core);
    const rows = c.rows || [], list = el('ol', 'rows');
    if (rows.length > 6) tree.classList.add('dense');
    // the replay's thread: from the first row it chose in to the last — its pointer under that, while it goes on
    const tried = rows.map(r => r.options.some(o => o.state === 'tried' || o.state === 'both'));
    const r0 = tried.indexOf(true), r1 = tried.lastIndexOf(true);
    const line = (cls, name, opts) => {
      const li = el('li', cls), stem = el('div', 'stem'), dot = el('i', 'dot');
      stem.append(seg());
      if (cls.includes(' r')) stem.append(el('i', 'rseg'));
      stem.append(dot);
      const n = el('div', 'name');
      if (name) n.append(name);
      li.append(n, stem, opts);
      list.append(li);
      return { li, n, stem, dot };
    };
    const pointer = (row, words, replay, ref) => {
      const go = Object.assign(el('button', replay ? 'go go-replay' : 'go go-game'), { type: 'button', tabIndex: -1 }), w = el('span');
      go.dataset.ref = ref;
      words.split('\n').forEach((t, k) => { if (k) w.append(el('br')); w.append(t); });
      go.append(w, arrow());
      row.n.append(go);
      // (its mark on the arrow's tip, at the trunk)
      const at = el('i', 'at');
      row.stem.append(tip(replay), at);
      nodes.set(ref, at);
    };
    if (c.replay && r1 < 0) pointer(line('row cursor r', '', el('ul', 'opts')), tr('continue\nthe replay'), true, `goreplay:${i}`);
    rows.forEach((row, k) => {
      const opts = el('ul', 'opts'), chosen = row.options.filter(o => o.state === 'chosen' || o.state === 'both');
      const rest = row.options.filter(o => !chosen.includes(o) && o.state !== 'unseen');
      // (a fork never reached: its window boarded up)
      if (!chosen.length && !rest.length) opts.append(el('li', 'opt unseen', '· · ·'));
      for (const o of chosen) {
        const li = el('li', 'opt chosen', o.label);
        li.dataset.ref = `fork:${i}:${k}`;
        opts.append(li);
      }
      for (const o of rest) {
        const li = el('li', `opt alt${o.state === 'tried' ? ' tried' : ''}`), t = svg('svg', { class: 'twig', viewBox: '0 0 22 16', preserveAspectRatio: 'none', 'aria-hidden': 'true' });
        t.append(svg('path', { d: 'M0 0 C0 9 9 16 22 16' }));
        li.append(t, el('i', 'pip'), o.label);
        opts.append(li);
      }
      const name = el('span');
      if (row.weight === '⚑') name.append(el('span', 'flag', `${FLAG} `));
      name.append(row.title);
      const inReplay = k >= r0 && k <= r1 && r0 >= 0;
      const r = line(['row', row.weight === '⚑' ? 'key' : '', inReplay ? 'r' : '', k === r0 ? 'r-start' : ''].filter(Boolean).join(' '), name, opts);
      if (i === grow) r.li.style.animationDelay = `${(k * seconds) / rows.length}s`;
      if (chosen.length) { r.stem.append(hit(`fork:${i}:${k}`, row.title)); nodes.set(`fork:${i}:${k}`, r.dot); }
      if (c.replay && k === r1) pointer(line('row cursor r', '', el('ul', 'opts')), tr('continue\nthe replay'), true, `goreplay:${i}`);
    });
    if (c.go) pointer(line('row pending', '', el('ul', 'opts')), c.go, false, `go:${i}`);
    tree.append(list);
    return { tree, nodes, origin: hang(tree, core) };
  }

  // the author's sign, “the author” under it
  function sign() {
    const tree = el('div', 'author'), mark = el('div');
    mark.innerHTML = AUTHOR;
    tree.append(mark, el('span', '', tr('the author')), hit('author', tr('The author’s map')));
    return { tree, nodes: new Map([['author', mark]]), origin: () => [tree.offsetWidth / 2, mark.offsetHeight / 2] };
  }

  // each frame the scene says: every stand at its point, as large as its depth makes it
  const scale = p => DIST / Math.max(0.5, p.depth);
  function place(again = false) {
    for (const s of stands) {
      const p = b.where(s.ref);
      const now = p ? `translate(${Math.round(p.x)}px, ${Math.round(p.y)}px) scale(${scale(p).toFixed(4)})` : 'hidden';
      if (now === s.now && !again) continue;
      s.now = now;
      s.box.hidden = !p;
      if (p) s.box.style.transform = now;
    }
  }
  const off = b.onFrame(() => place());
  const resized = () => build();
  addEventListener('resize', resized);
  build();

  return {
    at: ref => () => {
      const s = where.get(ref), o = s?.offsets.get(ref), p = s && b.where(s.ref);
      if (!p) return null;
      const k = scale(p);
      return { x: p.x + o[0] * k, y: p.y + o[1] * k };
    },
    offer(refs, fn) { offered = new Set(refs); told = fn; can(); },
    remove() { off(); removeEventListener('resize', resized); root.remove(); },
  };
}
