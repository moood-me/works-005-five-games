// Зал — the scene's mechanics: its film in beats (the world's `beats`: the game sets `beat`, lib.js FILM), the light's
// key from `era`, and the bodies' answers to the keys «Подглядывать» moves: `peek` — the curtain gathers toward the
// south jamb and the boy steps out into the gap past the north one (once over 0.5, back under 0.3); `bell` → 1 —
// the priest rings once (bell_ring, 3 s, his right hand over his shoulder, shaken);
// `turn` — he looks round at the curtain's gap, 0 — at the screen again.
scene.kit.beats.play(scene, scene.lib.FILM);

const has = name => !!scene.kit.cast.motions?.[name];
let leaning = false;
// (the cast's peek_lean barely leans: the boy is moved a step into the gap instead, no steps, his left hand on the
// curtain's edge, his eyes on the priest)
const B = scene.lib.G.BOY, OUT = [B[0] + 0.28, B[1] - 0.16];
function peek(v) {
  if (v > 0.5 && !leaning) {
    leaning = true;
    const boy = scene.person('toto');
    boy.walk([OUT], { steps: false, queue: false }); boy.reach({ l: 'curtain#gap' }); boy.look('adelfio');
  } else if (v < 0.3 && leaning) {
    leaning = false;
    const boy = scene.person('toto');
    boy.walk([B], { steps: false }); boy.reach(null);
  }
}
let ringing = null;
function bell(v) {
  if (!v) return;
  if (ringing) ringing.cancel();
  // bell_ring (its hand rises only to the shoulder) with the right hand reaching over the shoulder for the point the
  // row-5 element shakes for 3 s; without the motion — the reach alone (scenes.md's fallback)
  ringing = scene.sequence(async s => {
    const q = s.person('adelfio');
    q.reach({ r: 'aud5#ring' });
    if (has('bell_ring')) await q.do('bell_ring'); else await s.wait(3.2);
    q.reach(null);
    q.do({ motion: 'seated', loop: true });
  }, { name: 'bell' });
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
