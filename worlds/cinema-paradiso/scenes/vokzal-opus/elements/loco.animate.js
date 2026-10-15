
// the driving wheels turn by the way gone (0.72 m in radius: clockwise seen from the south as it goes east)
const rot = e.lib.G.trainX(e.state.train || 0) / 0.72;
for (let k = 0; k < 3; k++) e.layer('w' + k).rotate = rot;
