// The sea from the beach to the horizon, seen from above (its centre 1530 m ahead): a mirror over its own colour,
// deeper toward the eye; and where the stream comes out below its last fall — its thin pale water spread over the
// sand, as far as the shore
const deep = g.createLinearGradient(0, 1500, 0, 600);
deep.addColorStop(0, "#4f667d");
deep.addColorStop(1, "#7189a0");
g.fillStyle = deep;
g.fillRect(-3000, -1500, 6000, 3000);
e.lib.streamPainting(g, 0, 1530, 33.6, 41, e.lib.MOUTH_WATER, "#7f909c");
