// the leaf turned up over the top as `leaf` goes 0 → 1 (its face, then its back); all of it gone with the deckhouse
const L = e.lib, k = L.partLook(e.state, 'deckhouse'), u = L.clamp01(e.state.leaf), f = Math.cos(Math.PI * u);
for (const n of ['board', 'under']) { const l = e.layer(n); l.scaleX = k.scale; l.scaleY = k.scale; l.alpha = k.alpha; l.brightness = k.bright; }
const front = e.layer('leaf'), back = e.layer('leaf_back');
front.scaleX = back.scaleX = k.scale;
front.scaleY = back.scaleY = f * k.scale;
front.alpha = f > 0 ? k.alpha : 0;
back.alpha = f > 0 ? 0 : k.alpha;
front.brightness = back.brightness = k.bright;
