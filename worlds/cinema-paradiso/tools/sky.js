// The world's sky in a scene (module sky): writes its shader (tools/sky.wgsl: the stars twinkle) into the
// scene's sky element. Its code is the scene's: e.kit.sky.sky(g, e, e.lib.SKY) (modules/sky.md). Run again whenever
// the shader changes.
//   node tools/sky.js <scene folder> [sky element id = sky]
const { readScene, writeScene, writeElement, wgsl } = require('./lib');

const [folder, id = 'sky'] = process.argv.slice(2);
if (!folder) throw new Error('usage: node tools/sky.js <scene folder> [sky element id]');
const spec = readScene(folder);
const sky = (spec.objects || []).find(o => o.id === id);
if (!sky) throw new Error(`no element "${id}" in scenes/${folder}/scene.json`);
sky.sky = true;
writeScene(folder, spec);
writeElement(folder, id, 'wgsl', wgsl('sky'));
console.log(`scenes/${folder}: ${id} — the world's sky shader`);
