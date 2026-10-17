// "Secret" in a scene, seen from outside (module ships): writes her elements onto the anchor `id` — her hull's
// plates, her decks, her rig, her masts and yards, her sails with the world's cloth shader (ships.assembly says
// which). The anchor is the scene's own (unseen; its place, facing and tilt: where she is, how she heads, how she
// rolls) — made here only if the scene has none; her elements are put right after it, in place of those written
// before. Run again whenever the module's assembly or the shader changes.
//   node tools/ship.js <scene folder> [anchor id = ship] [brace degrees = 35]
// The cloth shader alone, onto sails a scene builds itself (the deck's): each element's uniforms — its painting's
// head and foot (y, its units), whether it rises from its foot (1) or drops from its head (0), a seed of its own —
//   node tools/ship.js <scene folder> cloth <element id>:<head>:<foot>:<rise>:<seed> …
const { load, readScene, writeScene, writeElement, wgsl } = require('./lib');

const [folder, ...args] = process.argv.slice(2);
if (!folder) throw new Error('usage: node tools/ship.js <scene folder> [anchor id] [brace] | <scene folder> cloth <id>:<head>:<foot>:<rise>:<seed> …');
const K = load('ships');
const spec = readScene(folder);
spec.objects ||= [];
if (args[0] === 'cloth') {
  for (const a of args.slice(1)) {
    const [id, head, foot, rise, seed = 1] = a.split(':');
    const el = spec.objects.find(o => o.id === id);
    if (!el) throw new Error(`no element "${id}" in scenes/${folder}/scene.json`);
    el.uniforms = K.clothUniforms([0, Number(head), 0, Number(foot)], Number(rise) > 0, Number(seed));
    writeElement(folder, id, 'wgsl', wgsl('ship-cloth'));
    console.log(`scenes/${folder}: ${id} — the world's cloth shader`);
  }
} else {
  const id = args[0] || 'ship';
  const brace = args[1] == null ? 35 : Number(args[1]);
  const parts = K.assembly(id, { brace });
  const mine = new Set(parts.map(p => p.id));
  if (!spec.objects.some(o => o.id === id)) spec.objects.push({ id, name: 'Secret', unseen: true, across: 0, distance: 200, facing: 0 });
  spec.objects = spec.objects.filter(o => !mine.has(o.id));
  const at = spec.objects.findIndex(o => o.id === id);
  spec.objects.splice(at + 1, 0, ...parts.map(({ code, animate, wgsl: shader, ...el }) => el));
  for (const p of parts) {
    writeElement(folder, p.id, 'js', p.code);
    writeElement(folder, p.id, 'animate.js', p.animate ?? null);
    writeElement(folder, p.id, 'wgsl', p.wgsl ? wgsl(`ship-${p.wgsl}`) : null);
  }
  console.log(`scenes/${folder}: "Secret" on ${id} — ${parts.length} elements`);
}
writeScene(folder, spec);
