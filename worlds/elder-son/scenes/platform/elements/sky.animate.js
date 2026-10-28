const S = e.state;
e.layer('dusk').alpha = Number(S.dusk_k) || 0;
e.layer('late').alpha = (Number(S.late_k) || 0) * 0.75;
e.layer('dawn').alpha = Number(S.dawn_k) || 0;
