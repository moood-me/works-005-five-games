// The world's beam shader in a scene (module kino: kino.beam): writes tools/kino-beam.wgsl into the beam element and
// its uniform `on` (the element's animate sets it: kino.beamMove). Run again whenever the shader changes.
//   node tools/kino-beam.js <scene folder> <beam element id> [more ids…]
const { readScene, writeScene, writeElement, wgsl } = require('./lib');

const [folder, ...ids] = process.argv.slice(2);
if (!folder || !ids.length) throw new Error('usage: node tools/kino-beam.js <scene folder> <beam element id>…');
const spec = readScene(folder);
for (const id of ids) {
  const el = (spec.objects || []).find(o => o.id === id);
  if (!el) throw new Error(`no element "${id}" in scenes/${folder}/scene.json`);
  el.glows = true;
  el.uniforms = { on: 0, ...(el.uniforms || {}) };
  writeElement(folder, id, 'wgsl', wgsl('kino-beam'));
}
writeScene(folder, spec);
console.log(`scenes/${folder}: ${ids.join(', ')} — the world's beam shader`);
