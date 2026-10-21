// The hatch's opening from above: the dark shaft, the furnaces' glow down in it — a layer its animate brightens with
// `fire` (glowing: the scene's light does not darken it).
const L = e.lib;
L.rect(g, -0.75, -0.75, 1.5, 1.5, '#1c1716');
e.layer('glow', {}, g => {
  L.glow(g, 0, 0, 0.8, '#ff9a40', 0.95);
  L.glow(g, 0.1, -0.1, 0.35, '#ffe0a0', 0.9);
});
