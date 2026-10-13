// beats — an engine-2 scene's film in beats (beats.md): for the game playing it, one beat at a time (the scene's `beat`
// key), and for the scene's own showcase (all of them, in order). The old engine's scenes keep `film`.
//   FILM: { <name>: { run: async s => …, from: () => ({ key: value … }) | null, after: name | [names] } }
// `run` — the beat itself, a sequence (the director's `s`): its people's actions, its keys moved, its camera. `from` —
// the values it begins at (everything it does not set itself): cut to at once when it does not follow one of `after`
// (the beat before it — playing, or the last to end), so a game may begin anywhere. A beat that follows goes on from what
// the one before left.
const follows = (b, prev) => prev != null && [].concat(b.after ?? []).includes(prev);
return {
  // The game's: `beat` set to a name plays that beat from its start (another beat playing stops: its waits unwind);
  // when it ends the scene tells 'beat:<name>' (scene.tell) — of a name it has not, at once 'beat-unknown:<name>'. The
  // same name again: set the key to null first. The scene opened (or restored) with a beat named plays it from its start.
  play(scene, film, key = 'beat') {
    let last = null;
    const go = name => {
      const b = film[name];
      if (!b) { scene.tell(`beat-unknown:${name}`); return; }
      const cut = !follows(b, last) && b.from;
      last = name;
      scene.sequence(async s => {
        if (cut) s.cut(b.from());
        await b.run(s);
        scene.tell(`beat:${name}`);
      }, { name: key });
    };
    scene.on('change', key, v => { if (typeof v === 'string' && v) go(v); });
    const now = scene.get(key);
    if (typeof now === 'string' && now) go(now);
  },
  // The showcase's: the beats of `order` one after another (the showcase's own beats, named so) — each cut to its `from`
  // unless it follows the one before; the next one's cut made ready as each begins (scene.shot: its view resident by
  // the time it is cut to), shown whole at once. `scene` — the showcase's own (its code's `scene`).
  showcase(scene, film, order) {
    let next = null;
    return order.map((name, i) => ({
      name,
      run: async s => {
        const b = film[name];
        if (next?.for === name) next.shot.cut();
        else if (b.from && !(i > 0 && follows(b, order[i - 1]))) s.cut(b.from());
        next = null;
        const n = film[order[i + 1]];
        if (n?.from && !follows(n, name)) next = { for: order[i + 1], shot: scene.shot(n.from()) };
        await b.run(s);
      },
    }));
  },
};
