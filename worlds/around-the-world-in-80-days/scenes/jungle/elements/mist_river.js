// Mist over the river beyond the clearing: long flat banks drifting slowly along the water, two layers, one each way,
// painted round their box (their ends meet). As thick as the hour makes it (its animate).
const L = e.lib, BOX = [-60, -5, 60, 0.3];
e.layer('east', { box: BOX, drift: [0.1, 0] }, gl => L.mistBank(gl, -60, 120, 14, 21, -0.2, -2.4, '#e6e4dc', 0.36));
e.layer('west', { box: BOX, drift: [-0.06, 0] }, gl => L.mistBank(gl, -60, 120, 12, 31, -0.6, -3.4, '#e6e4dc', 0.26));
