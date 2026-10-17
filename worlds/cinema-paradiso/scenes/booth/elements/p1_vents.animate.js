const S = e.state, on = S.era === 'ruin' ? 0 : Math.max(0, Math.min(1, S.beam_on || 0)) * (S.active === 1 ? 1 : 0);
if (S.era !== 'ruin') e.glow('vents', on * (0.9 + 0.1 * Math.sin(e.t * 13)));
