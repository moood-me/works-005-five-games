// The wood of the forest along the trail, each at its own depth (a part, on the land there): the straight grey trunks of
// the tall trees on their buttresses, the great fig behind the temple — its fused trunk, its limbs, its aerial roots.
// Their crowns are the canopy's, the palms, bamboo and leaves between them the undergrowth's (layers the wind moves).
// It leaves the trail, the embankment where the rails end, the stream's way and the clearing by the river open.
const L = e.lib, A = 12;
for (const t of L.TREES) e.part(t.a, t.d - A, gp => L.trunk(gp, t.h, t.v, '#5c5f50'), [-t.h * 0.2, -t.h * 0.9, t.h * 0.2, 0.2]);
e.part(L.plan.fig[0], L.plan.fig[1] - A, gp => L.figWood(gp, 18), [-17, -10.6, 17, 0.2]);
// the trail, where it passes before the viewer
e.part(0, L.trail(0) - A, () => e.at(0, -1, 'trail'), [-1, -2, 1, 0.2]);
