// builds every character of a world's cast (and every part, as carried) with the engine's own shapes.js — node, no GPU
import fs from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
const [,, ENGINE, WORLD] = process.argv;
globalThis.XMLHttpRequest = class { open(m, u) { this.u = u; } send() { try { const b = fs.readFileSync(fileURLToPath(String(this.u))); this.response = b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength); this.status = 200; this.onload(); } catch (e) { this.onerror(e); } } };
const P = p => pathToFileURL(`${ENGINE}/web/scene3/people/${p}`).href;
const wardrobe = await import(P('wardrobe.js')), shapes = await import(P('shapes.js')), rigm = await import(P('rig.js'));
globalThis.MooodShapes = { V: wardrobe.V };
const src = fs.readFileSync(`${WORLD}/modules/cast.js`, 'utf8');
const cast = new Function('data', 'anim', 'kit', 'MooodShapes', src)({ motions: {} }, {}, {}, globalThis.MooodShapes);
const rig = rigm.rigOf(await rigm.loadSoma());
let bad = 0;
const warn = w => { console.log('  warn:', w); };
const parts = Object.keys(cast.shapes.parts);
for (const [name, c] of Object.entries(cast.characters)) {
  try {
    const L = wardrobe.look({ ...c }, cast);
    const M = shapes.createModel(L, { rig, warn });
    const I = M.state();
    let pn = [];
    if (name === 'fogg' || name === 'soldier') for (const p of parts) { const r = M.part(p); if (!r) pn.push(p + '?'); }
    console.log(name, 'ok', L.garment, L.hat, L.parts.join(','), 'height', M.height?.toFixed?.(2), pn.join(' '));
  } catch (e) { bad++; console.log(name, 'FAILED', e.stack.split('\n').slice(0, 4).join(' | ')); }
}
for (const [w, o] of Object.entries(cast.wears || {})) {
  try { const base = { fix_bruise: 'fix', pp_wings: 'passepartout', aouda_dress: 'aouda' }[w]; shapes.createModel(wardrobe.look({ ...cast.characters[base], ...o }, cast), { rig, warn }); console.log('wear', w, 'ok'); }
  catch (e) { bad++; console.log('wear', w, 'FAILED', e.stack.split('\n').slice(0, 4).join(' | ')); }
}
process.exit(bad ? 1 : 0);
