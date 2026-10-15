// Зал — the scene's mechanics: its film in beats (the world's `beats`: the game sets `beat`, lib.js FILM), the light's
// key from `era`, and the bodies' answers to the keys «Подглядывать» moves: `peek` — the curtain gathers toward the
// south jamb and the boy leans out past the north one (peek_lean once over 0.5, back to stand under 0.3); `bell` → 1 —
// the priest rings once (bell_ring, 3 s; without that motion: his right hand to a point over his shoulder, shaken);
// `turn` — he looks round at the curtain's gap, 0 — at the screen again.
scene.kit.beats.play(scene, scene.lib.FILM);

const has = name => !!scene.kit.cast.motions?.[name];
let leaning = false;
function peek(v) {
  if (v > 0.5 && !leaning) { leaning = true; scene.person('toto').do('peek_lean'); }
  else if (v < 0.3 && leaning) { leaning = false; scene.person('toto').do('stand'); }
}
let ringing = null;
function bell(v) {
  if (!v) return;
  const p = scene.person('adelfio');
  if (ringing) ringing.cancel();
  if (has('bell_ring')) {
    ringing = scene.sequence(async s => {
      const q = s.person('adelfio');
      await q.do('bell_ring');
      q.do({ motion: 'seated', loop: true });
    }, { name: 'bell' });
    return;
  }
  p.reach({ r: 'aud5#ring' });
  ringing = scene.sequence(async s => { await s.wait(3.2); s.person('adelfio').reach(null); }, { name: 'bell' });
}
function turn(v) { scene.person('adelfio').look(v > 0.5 ? 'curtain#gap' : 'screen#screen'); }
function light() { scene.set('ruin_k', scene.get('era') === 'ruin' ? 1 : 0); }

scene.on('change', 'era', light);
scene.on('change', 'peek', peek);
scene.on('move', 'peek', () => peek(scene.get('peek')));
scene.on('change', 'bell', bell);
scene.on('change', 'turn', turn);
light();
leaning = scene.get('peek') > 0.5;
