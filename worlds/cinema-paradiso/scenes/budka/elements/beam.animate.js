const S = e.state, on = S.era === 'ruin' ? 0 : Math.max(0, Math.min(1, S.beam_on || 0)) * (S.active === 1 ? 1 : 0);
const fl = S.jitter ? 0.6 + 0.4 * Math.abs(Math.sin(e.t * 17)) : 1;
e.kit.kino.beamMove(e, on * fl * (1 - 0.6 * Math.max(0, Math.min(1, S.fire || 0))));
