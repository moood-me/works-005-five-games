const S = e.state, on = Math.max(0, Math.min(1, S.beam_on || 0)), w = S.white || S.tail ? 1 : 0, c = Math.max(0, Math.min(1, S.cue || 0));
e.layer('f_romance').alpha = on * (1 - w); e.layer('f_white').alpha = on * w;
e.layer('f_romance').y = S.jitter ? Math.sin(e.t * 53) * 0.006 : 0;
const blink = c * (0.55 + 0.45 * Math.sin(e.t * 18));
e.layer('cue').alpha = c; e.layer('blink').alpha = blink;
