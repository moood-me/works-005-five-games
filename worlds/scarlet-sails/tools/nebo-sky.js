// The world's sky in a scene (module nebo): writes the sky's shader (tools/nebo-sky.glsl) and its uniforms into the
// scene's sky element — after this the scene has elements/<id>.glsl and "uniforms" on the element; its code and animate
// are the scene's (nebo.sky, nebo.skyMotion: modules/nebo.md). Run again whenever the shader changes.
//   node tools/nebo-sky.js <scene folder> [sky element id = sky]
const { load, readScene, writeScene, writeElement, glsl } = require('./lib');

const [folder, id = 'sky'] = process.argv.slice(2);
if (!folder) throw new Error('usage: node tools/nebo-sky.js <scene folder> [sky element id]');
const spec = readScene(folder);
const sky = (spec.objects || []).find(o => o.id === id);
if (!sky) throw new Error(`no element "${id}" in scenes/${folder}/scene.json`);
sky.sky = true;
sky.uniforms = { ...load('nebo').UNIFORMS };
writeScene(folder, spec);
writeElement(folder, id, 'glsl', glsl('nebo-sky'));
console.log(`scenes/${folder}: ${id} — the world's sky shader and its uniforms`);
