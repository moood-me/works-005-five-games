// Moscow: the scene's mechanics. The hour's light (the world's module sky); its film in beats (lib.js film(scene), the
// world's module beats); the door's leaf by `door`; the sledges where `sledge_at` / `sledge2_at` put them; the season's
// ground (the thaw: the road a wet mirror, drops from the eaves). Between the beats, what the game's minigames move:
// “The shadow” — Gurov walks down the lane to the point `walk_on` names and says so (`evening_walk:stopN`), the women
// come out (`shadeN` 1) and turn and go (2); “By the hand” — he and his daughter walk to school while `go` is 1, and
// the scene says how far they are (`walked`).
const L = scene.lib;
const s = scene;
s.kit.sky.follow(s);
s.kit.beats.play(s, L.film(s));

function door() { s.set('door_f', L.doorFacing(s.get('door'))); }
s.on('change', 'door', door);
s.on('move', 'door', door);
function sledges() {
  const k = { ...L.sledgeKeys(s.get('sledge_at')), ...L.sledge2Keys(s.get('sledge2_at')) };
  for (const key in k) s.set(key, k[key]);
}
s.on('change', 'sledge_at', sledges);
s.on('change', 'sledge2_at', sledges);
function season() {
  const k = L.seasonKeys(L.seasonOf(s.get('season')));
  s.set('puddles', k.puddles);
  s.set('drip', k.drip);
}
s.on('change', 'season', season);

// “The shadow”: he strolls to the N-th stop and stands; there the scene says so
s.on('change', 'walk_on', n => {
  n = Math.round(L.num(n));
  if (n < 1 || n > L.STOPS.length) return;
  s.sequence(async q => {
    const gurov = q.person('gurov');
    gurov.gait('stroll');
    const went = await gurov.walk([L.STOPS[n - 1]]);
    if (went !== 'done') return;
    q.tell(`evening_walk:stop${n}`);
  }, { name: 'walk_on' });
});
// a woman comes out ahead of his stop and stands, her back to us (1); turns — a stranger's face in profile — and goes (2)
for (const id of Object.keys(L.SHADES)) {
  const p = L.SHADES[id];
  s.on('change', id, v => {
    v = Math.round(L.num(v));
    if (v === 1) s.sequence(async q => {
      const she = q.person(id);
      q.set(`${id}_a`, p.from[0]);
      q.set(`${id}_d`, p.from[1]);
      she.do('stand');
      she.here(true);
      await she.walk([p.at]);
      await she.turn(p.turn);
      she.do('stand_cold', { loop: true });
    }, { name: id });
    else if (v === 2) s.sequence(async q => {
      const she = q.person(id);
      she.do('stand');
      await she.turn(p.face);
      await q.wait(0.9);
      await she.walk(p.off);
      she.here(false);
    }, { name: id });
    else s.sequence(async q => { q.person(id).here(false); }, { name: id });
  });
}
// “By the hand”: held — they walk on toward the gate; let go — they stand, and she lifts her face to him
s.on('change', 'go', v => {
  if (L.num(v) > 0.5) s.sequence(async q => {
    const gurov = q.person('gurov'), daughter = q.person('daughter');
    daughter.look(null);
    gurov.gait('walk_child');
    gurov.reach({ l: 'daughter#hand_r' });
    daughter.reach({ r: 'gurov#hand_l' });
    await q.all(gurov.walk([L.SCHOOL_TO.gurov]), daughter.walk([L.SCHOOL_TO.daughter]));
  }, { name: 'go' });
  else s.sequence(async q => { q.person('daughter').look('gurov#head'); }, { name: 'go' });
});
function walked() { s.set('walked', L.walkedOf(s.get('daughter_d'))); }
s.on('move', 'daughter_d', walked);
s.on('change', 'daughter_d', walked);
