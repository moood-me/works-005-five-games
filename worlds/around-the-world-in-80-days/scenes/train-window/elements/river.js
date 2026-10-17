// India: the Ganges along the line, from its near bank to its far bank — still water over its bed: the engine mirrors in
// it all that stands above it (the far bank, the sky, the low sun, the lamps of the ghats).
const L = e.lib, [a, b] = L.plan.river, W = L.riverWidth, C = L.colours('india');
g.fillStyle = L.rgba(L.mixc(C.water, '#4a5a58', 0.4));
g.fillRect(-W / 2, -(b - a) / 2, W, b - a);
