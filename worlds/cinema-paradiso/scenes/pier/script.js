// The pier — the scene's mechanics: its film in beats (the world's `beats`: the game sets `beat`; lib.film), the
// light's keys from `hour` and `era`, the car's place from `car_arrive` and `car_go`.
const L = scene.lib;
scene.kit.beats.play(scene, L.film(scene));
function light() {
  const h = scene.get('hour'), era = scene.get('era');
  scene.set('dusk_k', h < 0.84 ? 1 : 0);
  scene.set('now_k', era === 'now' ? 1 : 0);
}
function placeCar() {
  const t = scene.get('car');
  if (t !== 'old' && t !== 'new') return;
  const c = L.carAt(t, scene.get('car_arrive'), scene.get('car_go'));
  scene.set('car_a', c.x); scene.set('car_d', c.z); scene.set('car_f', c.h);
}
scene.on('change', 'hour', light);
scene.on('change', 'era', light);
for (const k of ['car', 'car_arrive', 'car_go']) { scene.on('change', k, placeCar); scene.on('move', k, placeCar); }
light(); placeCar();
