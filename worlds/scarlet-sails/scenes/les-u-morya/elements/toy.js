// Assol's yacht on the stream (the world's: korabli.toy; its point `toy`) — a layer its animate shows while it is on
// the water (`toy_water`) and rocks; script.js keeps it where `toy` says along the stream. Before it the reeds it is
// caught in (korabli.reeds) — a layer shown by `reeds`
e.layer("toy", { pivot: [0, 0] }, (g) => e.kit.korabli.toy(g, e));
e.layer("reeds", (g) => e.kit.korabli.reeds(g, e));
