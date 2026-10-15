const S = e.state, L = e.lib;
if (S.beam_sky) { e.kit.kino.beamMove(e, S.beam_on, 1, -0.16, L.BEAM_LEN); e.glow('tip', 0); }
else { const b = L.beamOf(S.beam_aim ?? 0); e.kit.kino.beamMove(e, S.beam_on, b.len / L.BEAM_LEN, b.tilt, L.BEAM_LEN); }
