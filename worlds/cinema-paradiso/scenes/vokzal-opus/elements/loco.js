
// the locomotive's south side (a 1930s tank engine of the State Railways), its driving wheels a layer that turns
// with the train's way (animate)
const now = e.state.era === 'now';
e.lib.locoSide(g, 10.8);
e.lib.WHEELS.forEach((x, k) => e.layer('w' + k, { pivot: [x, 0.2], box: [x - 0.8, -0.6, x + 0.8, 1.0] }, r => e.lib.wheels(r, now, x)));
e.at(10.8 - 1.2, -3.7, 'chimney');
