// The prairie: buffalo crossing the line before the stopped train, sixty metres off — a dense stream of humped backs.
// Painted once: one buffalo in HERD.frames poses of its stride, side by side (the layer `atlas`, out of the card's own
// box); its shader (herd.wgsl) lays the herd out of it — rows of them, each at its own place, size and stride, its legs
// at the stride its own way has come to — as far as `herd` says it has gone by (its animate). Nothing is painted again
// as it passes.
const L = e.lib, H = L.HERD, C = L.colours('prairie');
e.layer('atlas', { box: [H.at, -2.4, H.at + H.frames * H.cell, 0.2] }, g => {
  g.fillStyle = L.rgba(L.mixc(C.hide, C.near, 0.15));
  for (let f = 0; f < H.frames; f++) {
    g.save();
    g.translate(H.at + (f + 0.5) * H.cell, 0);
    L.buffalo(g, f / H.frames);
    g.restore();
  }
});
