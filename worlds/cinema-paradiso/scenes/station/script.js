// The station — the scene's mechanics: its film in beats (the world's `beats`: the game sets `beat`; lib.film), the train's
// place from `train`, the light's keys from `era`. `alfredo_stays` (the game's, set before `boarding`): 0 — Alfredo
// turns and goes off along the platform, tapping his cane; 1 — he stays at the platform's edge.
const L = scene.lib, G = L.G;
scene.kit.beats.play(scene, L.film(scene));
function train() { scene.set('train_x', G.trainX(scene.get('train'))); }
function light() { const now = scene.get('era') === 'now'; scene.set('now_k', now ? 1 : 0); scene.set('dawn_k', now ? 0 : 1); }
scene.on('change', 'train', train);
scene.on('move', 'train', train);
scene.on('change', 'era', light);
train(); light();
