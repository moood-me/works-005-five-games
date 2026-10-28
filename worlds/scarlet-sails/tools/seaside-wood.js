// «The Wood by the Sea» (scenes/seaside-wood): writes into its scene.json the elements that stand one by one where the scene's
// lib.js has them — each tree's crown (crown_<i>: TREES), the glade's grass (grass_<i>: GRASS), the undergrowth
// (tuft_<i>: UNDER), the mist's banks (mist_<i>: MIST), the falls' white water (spray_<i>: SPRAY) — in place of
// those written before, and sets the falls' anchor on the first lip, the two snags across Assol's way down the bank
// (snag, snag2: SNAG_AT) and the yacht where it is put on the water (toy and its keys: toyAt). An element of its own
// each: layers are an element's (the wind's, a drift), and each turns to the eye about its own foot when a film's
// camera looks round. Their code is one call of the lib (kept in scene.json). Run again whenever those lists, their
// boxes or the bank's way change:
//   node tools/seaside-wood.js
const fs = require('fs');
const path = require('path');
const { readScene, writeScene } = require('./lib');

const FOLDER = 'seaside-wood';
// the engine's `anim`, as much as the lib asks of it as it is made — its very numbers: the lists are chosen by them
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const mix = (a, b, u) => a + (b - a) * u;
const hash = (n, seed = 0) => {
  let h = Math.imul((n * 374761393 + seed * 668265263) | 0, 1274126177);
  h = (h ^ (h >>> 13)) >>> 0;
  h = Math.imul(h, 1103515245) >>> 0;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};
const anim = {
  clamp, mix, hash,
  span: (v, a, b) => clamp((v - a) / (b - a)),
  ease: { smooth: u => (1 - Math.cos(Math.PI * u)) / 2 },
  noise: (x, seed = 0) => { const i = Math.floor(x), f = x - i, s = f * f * (3 - 2 * f); return mix(hash(i, seed) * 2 - 1, hash(i + 1, seed) * 2 - 1, s); },
};
const L = new Function('anim', 'kit', fs.readFileSync(path.join(__dirname, '..', 'scenes', FOLDER, 'lib.js'), 'utf8'))(anim, {});
const r3 = v => Math.round(v * 1000) / 1000;
const box = b => b.map(r3);

const shadow = { onto: ['ground'], strength: 0.4 };
const made = {
  // after the trunks: the crowns, thin — the light behind them comes through, their shadows let it through too
  trees: L.TREES.map(([X, Z, H, kind], i) => ({
    id: `crown_${i}`, name: kind ? 'Pine crown' : 'Birch crown', across: r3(X), distance: r3(Z), height: r3(H), box: box(L.crownBox(i)),
    translucent: 0.35, shadow, code: `e.lib.crown(e, ${i});`,
  })).concat(L.UNDER.map(([X, Z, size, fern], i) => ({
    id: `tuft_${i}`, name: fern ? 'Fern' : 'Tuft of grass', across: r3(X), distance: r3(Z), height: r3(size * 1.4), box: box(L.underBox(i)),
    code: `e.lib.undergrowth(e, ${i});`,
  }))),
  // on the headland's top, by its axes
  cliff: L.GRASS.map(([a, b], i) => ({
    id: `grass_${i}`, name: 'Glade grass', on: 'headland', across: r3(a), distance: r3(b), height: 0.7, box: box(L.GRASS_BOX),
    code: `e.lib.grass(e, ${i});`,
  })),
  // on the land where each lies, or on the sea
  sea: L.MIST.map(([Z, X, , h], i) => ({
    id: `mist_${i}`, name: 'Mist', across: X, distance: Z, elevation: r3(L.mistFoot(i)), onLand: false, height: r3(h), box: box(L.mistBox(i)),
    code: `e.lib.mist(e, ${i});`, animate: 'e.lib.mistNow(e);',
  })),
  // over each lip, at the water's level: soft white dabs rising a little and falling back, all the time
  fall: L.SPRAY.map(([X, Z, w, over], i) => ({
    id: `spray_${i}`, name: 'White water', across: r3(X), distance: r3(Z + 0.35), elevation: r3(over + 0.04),
    particles: {
      kind: 'puff', rate: 16, life: [0.8, 1.7], source: [r3(1.8 * w), 0.9, 0.04], speed: [0.08, 0.25], direction: [0, 0, 1], spread: 50,
      gravity: 0.25, drag: 2, wind: 0, turbulence: 0.03, size: [0.07, 0.2], color: '#f4f6f5', opacity: 0.5, fade: [0.2, 0.6], soft: 0.04, shadow: 0,
    },
  })),
};

const spec = readScene(FOLDER);
spec.objects = spec.objects.filter(o => !/^(crown|tuft|grass|mist|spray)_\d+$/.test(o.id));
for (const [after, elements] of Object.entries(made)) {
  const at = spec.objects.findIndex(o => o.id === after);
  if (at < 0) throw new Error(`no element "${after}" in scenes/${FOLDER}/scene.json`);
  spec.objects.splice(at + 1, 0, ...elements);
}
const element = id => {
  const o = spec.objects.find(o => o.id === id);
  if (!o) throw new Error(`no element "${id}" in scenes/${FOLDER}/scene.json`);
  return o;
};
const fall = element('fall');
[fall.across, fall.distance] = [r3(L.SPRAY[0][0]), r3(L.SPRAY[0][1])];
L.SNAG_AT.forEach(([X, Z], i) => {
  const snag = element(i ? 'snag2' : 'snag');
  [snag.across, snag.distance] = [r3(X), r3(Z)];
});
const toy = element('toy');
[toy.across, toy.distance, toy.elevation] = L.toyAt(spec.state.toy, spec.state.toy_out).map(r3);
[spec.state.toy_a, spec.state.toy_d, spec.state.toy_e] = [toy.across, toy.distance, toy.elevation];
writeScene(FOLDER, spec);
console.log(`scenes/${FOLDER}: ${L.TREES.length} crowns, ${L.UNDER.length} tufts, ${L.GRASS.length} grass cards, ${L.MIST.length} mist banks, ${L.SPRAY.length} sprays`);
