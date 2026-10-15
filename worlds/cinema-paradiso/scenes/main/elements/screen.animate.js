const S = e.state, on = S.wall_film !== 'none' ? Math.max(0, Math.min(1, S.beam_on ?? 0)) : 0, f = Math.max(0, Math.min(1, S.beam_focus ?? 0));
const film = S.wall_film === 'comedy' ? 1 : 0;
e.layer('sharp').alpha = on * film * f; e.layer('blur').alpha = on * film * (1 - f) * 0.85;
e.layer('white').alpha = S.wall_film === 'white' ? on : 0;
const b = Math.max(0, Math.min(1, S.wall_burn ?? 0)), l = e.layer('burn'); l.alpha = Math.min(1, b * 1.6) * (film || S.wall_film === 'white' ? 1 : 0); l.scale = 0.05 + 0.95 * b;
