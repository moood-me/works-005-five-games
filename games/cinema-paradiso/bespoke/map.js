// The map's trees (game.js map), over «Плёнка» — the play on the dark of the booth. The scene is only the background
// and a point for each chapter (c<i>: unseen, where the chapter's knot is) and for the author's sign (author); each
// tree is the game's own — HTML laid out by CSS (its words never run into one another), its threads SVG drawn once it
// is laid out —, in bespoke.underlay (under the language's marks, which stand on its knots and forks). A tree stands at
// its chapter's point and goes with it each frame the scene says (bespoke.onFrame): the view dragged, brought to a
// chapter, walked toward (the wheel, a pinch: nearer, larger — by the point's depth). What lives is CSS, the page's own
// (it stands with the play's pause): the knots breathe; a chapter just played grows row by row.
//   trees(b, chapters, {shown, grow, seconds, author}) → { at(ref) → () => {x, y} | null — where a mark on it stands
//     on the page now (refs: knot:<i>, fork:<i>:<k> — the main run's choice of that row —, author); shown(i) — the
//     chapter in the middle (its knot brighter); remove() }
//   chapters — as game.js sky() gives them: [{number, title, kind: here | played | next | future | end, map: [{title,
//     weight, options: [{label, state: chosen | tried | both | open | unseen}]}] | null}]; grow — the chapter whose
//     rows come one after another over `seconds`; author — the author's sign shown
const DIST = 10; // m: the points' distance from the eye — a tree drawn at its size there
const NS = 'http://www.w3.org/2000/svg';
const el = (tag, cls, text) => Object.assign(document.createElement(tag), cls ? { className: cls } : {}, text != null ? { textContent: text } : {});
const svg = (tag, attrs) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); return e; };

export function trees(b, chapters, { shown = 0, grow = null, seconds = 6, author = false } = {}) {
  const root = el('div', 'map');
  b.underlay.append(root);
  // [{ref: the scene's point, box: at it (scaled there), node: what stands in it, nodes: Map ref → an element marks stand
  // on, offsets: Map ref → [x, y] from the point at size 1, draw(at), i: the chapter}]
  const stands = [];
  const offsets = new Map(); // a mark's ref → the stand it is in

  function build() {
    root.replaceChildren();
    stands.length = 0;
    offsets.clear();
    root.style.setProperty('--h', `${b.frame().h}px`);
    chapters.forEach((c, i) => stand(`c${i}`, chapter(c, i), i));
    if (author) stand('author', sign());
    // (laid out: where each knot, fork and its threads are, at the point's size 1 — then the threads drawn)
    for (const s of stands) {
      s.box.hidden = false;
      s.box.style.transform = 'none';
      const o = s.box.getBoundingClientRect();
      for (const [ref, node] of s.nodes) {
        const r = node.getBoundingClientRect();
        s.offsets.set(ref, [r.left + r.width / 2 - o.left, r.top + r.height / 2 - o.top]);
        offsets.set(ref, s);
      }
      s.draw?.(ref => s.offsets.get(ref));
    }
    place(true);
  }
  // a stand: an element at a point of the scene, its content laid out round it — the point its origin
  function stand(ref, { node, nodes, draw }, i = null) {
    const box = el('div', 'stand');
    box.append(node);
    root.append(box);
    stands.push({ ref, box, node, nodes, draw: draw && (at => draw(box, at)), offsets: new Map(), i, now: '' });
  }

  // a chapter's tree: its number and title over its knot, its rows of choices under it (one to come: its number only)
  function chapter(c, i) {
    const tree = el('div', `tree ${c.kind}${i === shown ? ' shown' : ''}${i === grow ? ' grow' : ''}`), nodes = new Map();
    tree.append(el('div', 'num', c.number || ''));
    if (c.kind === 'future') return { node: tree, nodes };
    tree.append(el('div', 'title', c.title));
    const knot = el('div', 'knot');
    knot.append(el('i', 'halo'), el('i', 'core'));
    tree.append(knot);
    nodes.set(`knot:${i}`, knot);
    const rows = c.map || [], list = el('div', 'rows');
    if (rows.length > 6) tree.classList.add('dense');
    rows.forEach((row, k) => {
      const r = el('div', 'row');
      if (i === grow) r.style.animationDelay = `${(k * seconds) / rows.length}s`;
      r.append(el('div', 'name', `${row.weight === '⚑' ? '⚑ ' : ''}${row.title}`));
      const opts = el('div', 'opts');
      row.options.forEach((o, j) => {
        const opt = el('div', `opt ${o.state}`), dot = el('i', 'dot');
        opt.append(dot, el('span', 'label', o.state === 'unseen' ? '· · ·' : o.label));
        opts.append(opt);
        nodes.set(`dot:${i}:${k}:${j}`, dot);
        if (o.state === 'chosen' || o.state === 'both') nodes.set(`fork:${i}:${k}`, dot);
      });
      r.append(opts);
      list.append(r);
    });
    tree.append(list);
    return { node: tree, nodes, draw: (box, at) => threads(box, c, i, at) };
  }
  // the threads: from the knot down through the main run's choices (bright, a soft glow under), to each other option
  // of a row reached from where the main run came (faint; one never reached — dotted), a replay's (pale blue, dashed)
  function threads(box, c, i, at) {
    const sheet = svg('svg', { class: 'threads' }), glow = svg('svg', { class: 'threads glow' });
    let main = at(`knot:${i}`), tried = main;
    (c.map || []).forEach((row, k) => {
      const g = svg('g', {}), h = svg('g', {});
      // (a chapter growing: its row's threads come with it)
      if (i === grow) for (const x of [g, h]) { x.classList.add('grow'); x.style.animationDelay = `${(k * seconds) / c.map.length}s`; }
      let nextMain = null, nextTried = null;
      row.options.forEach((o, j) => {
        const p = at(`dot:${i}:${k}:${j}`), isMain = o.state === 'chosen' || o.state === 'both', isTried = o.state === 'tried' || o.state === 'both';
        if (isTried) g.append(svg('path', { d: curve(tried, p), class: 'tried' }));
        if (isMain) h.append(svg('path', { d: curve(main, p) }));
        g.append(svg('path', { d: curve(main, p), class: isMain ? 'main' : o.state === 'unseen' ? 'unseen' : 'other' }));
        if (isMain) nextMain = p;
        if (isTried) nextTried = p;
      });
      sheet.append(g);
      glow.append(h);
      main = nextMain || main;
      tried = nextTried || main;
    });
    box.prepend(glow, sheet);
  }
  const curve = (a, z) => `M${a[0]} ${a[1]} C${a[0]} ${a[1] + (z[1] - a[1]) * 0.55} ${z[0]} ${z[1] - (z[1] - a[1]) * 0.45} ${z[0]} ${z[1]}`;

  // the author's sign: a small ring of stars, «автор» under it
  function sign() {
    const node = el('div', 'sign'), ring = el('div', 'ring');
    for (let k = 0; k < 5; k++) ring.append(el('i'));
    node.append(ring, el('span', 'label', 'автор'));
    return { node, nodes: new Map([['author', ring]]) };
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
      const s = offsets.get(ref), o = s?.offsets.get(ref), p = s && b.where(s.ref);
      if (!p) return null;
      const k = scale(p);
      return { x: p.x + o[0] * k, y: p.y + o[1] * k };
    },
    shown(i) { for (const s of stands) if (s.i != null) s.node.classList.toggle('shown', s.i === i); },
    remove() { off(); removeEventListener('resize', resized); root.remove(); },
  };
}
