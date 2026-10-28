// the film shown while the beam is on: white when the reel ran out (tail) or the change was missed (white); it
// trembles while the loop was lost (jitter)
const S = e.state, on = Math.max(0, Math.min(1, S.beam_on || 0)), w = S.white || S.tail ? 1 : 0;
e.layer('f_romance').alpha = on * (1 - w); e.layer('f_white').alpha = on * w;
const j = S.jitter ? Math.sin(e.t * 53) * 0.06 + Math.sin(e.t * 31) * 0.04 : 0;
e.layer('f_romance').y = j;
