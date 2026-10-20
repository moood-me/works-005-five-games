// The Platform's mechanics: the film's beats by `beat` (the world's beats: one at a time, the next one's opening made
// ready by `beat_next`); the train's place in metres (`train_x`) by its meaning `train`; the light's looks by `hour`.
const L = scene.lib, G = L.G;
scene.kit.beats.play(scene, L.film(scene));
function train() {
  scene.set('train_x', G.trainX(Number(scene.get('train')) || 0));
}
function looks() {
  const k = G.looks(scene.get('hour'));
  for (const name in k) scene.set(name, k[name]);
}
scene.on('change', 'train', train);
scene.on('move', 'train', train);
scene.on('change', 'hour', looks);
scene.on('move', 'hour', looks);
train();
looks();
