const S = e.state, on = Math.max(0, Math.min(1, S.beam_on || 0)), w = S.white || S.tail ? 1 : 0, c = Math.max(0, Math.min(1, S.cue || 0));
e.layer('f_romance').alpha = on * (1 - w); e.layer('f_white').alpha = on * w;
// the loop lost: the frame jumps in the gate — the picture hops and flickers till Alfredo's palm on the gate
const jt = S.jitter ? 1 : 0;
e.layer('f_romance').y = jt * (Math.sin(e.t * 53) > 0.2 ? -0.03 : 0.012);
e.layer('f_romance').alpha = on * (1 - w) * (1 - jt * 0.45 * (0.5 + 0.5 * Math.sin(e.t * 37)));
const blink = c * (0.55 + 0.45 * Math.sin(e.t * 18));
e.layer('cue').alpha = c; e.layer('blink').alpha = blink;
