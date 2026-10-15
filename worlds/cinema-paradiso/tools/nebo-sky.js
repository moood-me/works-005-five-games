// The world's sky in a scene (module nebo): writes its shader (tools/nebo-sky.wgsl: the stars twinkle) into the
// scene's sky element. Its code is the scene's: e.kit.nebo.sky(g, e, e.lib.SKY) (modules/nebo.md). Run again whenever
// the shader changes.
//   node tools/nebo-sky.js <scene folder> [sky element id = sky]
const { readScene, writeScene, writeElement, wgsl } = require('./lib');

const [folder, id = 'sky'] = process.argv.slice(2);
if (!folder) throw new Error('usage: node tools/nebo-sky.js <scene folder> [sky element id]');
const spec = readScene(folder);
const sky = (spec.objects || []).find(o => o.id === id);
if (!sky) throw new Error(`no element "${id}" in scenes/${folder}/scene.json`);
sky.sky = true;
writeScene(folder, spec);
writeElement(folder, id, 'wgsl', wgsl('nebo-sky'));
console.log(`scenes/${folder}: ${id} — the world's sky shader`);
