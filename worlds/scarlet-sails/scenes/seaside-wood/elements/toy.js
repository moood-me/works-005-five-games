// Assol's yacht on the stream (the world's: ships.toy; its point `toy`) — a layer its animate shows while it is on
// the water (`toy_water`) and rocks; script.js keeps it where `toy` says along the stream. Before it the reeds it is
// caught in (ships.reeds) — a layer shown by `reeds`
e.layer("toy", { pivot: [0, 0] }, (g) => e.kit.ships.toy(g, e));
e.layer("reeds", (g) => e.kit.ships.reeds(g, e));
