// Площадь — the scene's mechanics: its film (the game sets `beat`: scene.kit.beats, lib.FILM), and what follows from
// the keys the game and the beats move: the beam's turn in plan from `beam_aim`, the wall's light from the film on it,
// Toto's chalk mark from the impulse `mark_chalk`, the weather of the week from `night_kind`, the procession walking
// with the hearse as `cart` moves.
const L = scene.lib;
scene.kit.beats.play(scene, L.FILM);

// the beam: its anchor turned in plan and pitched toward where `beam_aim` puts its end (what is past the end is hidden by
// the stone or the wall it meets); the spot of light at the end (a light of the scene's, moved there)
const aimed = () => {
  const S = scene.state;
  if (S.beam_sky) { scene.set('beam_turn', 70); scene.set('beam_pitch', 9); scene.set('tip_on', 0); return; }
  const b = L.beamOf(S.beam_aim ?? 0), p = L.aimPoint(S.beam_aim ?? 0);
  scene.set('beam_turn', b.heading); scene.set('beam_pitch', -b.tilt * 180 / Math.PI);
  scene.set('tip_x', p[0]); scene.set('tip_z', p[1]); scene.set('tip_y', p[2] + 0.4);
  scene.set('tip_on', Math.max(0, Math.min(1, S.beam_on ?? 0)));
};
scene.on('change', 'beam_sky', aimed);
scene.on('change', 'beam_on', aimed);
scene.on('move', 'beam_on', aimed);
scene.on('change', 'beam_aim', aimed);
scene.on('move', 'beam_aim', aimed);
scene.on('load', aimed);
aimed();

// the white wall is lit while a film is on it and the beam burns
const lit = () => scene.set('wall_lit', scene.state.wall_film !== 'none' && (scene.state.beam_on ?? 0) > 0.3 ? 1 : 0);
scene.on('change', 'wall_film', lit);
scene.on('change', 'beam_on', lit);

// a chalk mark (the game's impulse): Toto, seated, reaches to the wall and draws one; back to sitting
scene.on('change', 'mark_chalk', v => {
  if (!v) return;
  scene.set('mark_chalk', 0);
  scene.sequence(async s => {
    const toto = s.person('toto');
    toto.look('chalk_wall#chalk');
    toto.reach({ l: 'chalk_wall#chalk' });
    await toto.do('chalk_mark');
    toto.reach(null); toto.look('balcony');
    toto.do('seated', { loop: true });
  }, { name: 'chalk' });
});

// the week's weather: rain, wind, the feast's garland, the cold
const weather = () => {
  const k = scene.state.night_kind ?? 'clear';
  scene.set('rain', k === 'rain' ? 1 : 0, 1.5);
  scene.set('wind_k', k === 'wind' ? 1 : 0, 1.5);
  scene.set('cold_k', k === 'cold' ? 1 : 0, 1.5);
  scene.set('garland', k === 'feast' ? 1 : 0);
};
scene.on('change', 'night_kind', weather);

// the procession: the bearers behind the hearse, the widow and the old behind them, Salvatore at its rail — all
// where the cart is now (their places move: they walk at the cart's pace)
const follow = () => {
  const S = scene.state, u = S.cart ?? 0, c = L.cartAt(u);
  scene.set('hearse_a', c[0]); scene.set('hearse_d', c[1]); scene.set('hearse_f', c[2]);
  if (!S.follow) return;
  const back = L.cartAt(u, 1.75), h = back[2];
  const put = (id, p) => { if (S[id + '_here'] === false) return; scene.set(id + '_a', p[0]); scene.set(id + '_d', p[1]); };
  put('bearer1', L.off(back, h, 0, -0.38)); put('bearer2', L.off(back, h, 0, 0.38));
  const m = L.cartAt(u, 3.2), mh = m[2];
  put('anna', L.off(m, mh, 0, 0.1));
  put('c1', L.off(m, mh, -0.9, -0.5)); put('c2', L.off(m, mh, -1.0, 0.6)); put('c3', L.off(m, mh, -2.0, -0.2)); put('c4', L.off(m, mh, -2.1, 0.7));
  if (S.sal_rail) { const r = L.cartAt(u, 1.1); put('toto', L.off(r, r[2], 0, 0.95)); }
};
scene.on('change', 'cart', follow);
scene.on('move', 'cart', follow);
