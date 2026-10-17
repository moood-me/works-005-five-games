// Mist lying low over the forest floor and the stream before the trail: soft flat banks in two layers drifting slowly
// along, one each way, painted round their box (their ends meet). As thick as the hour makes it — its animate: most at
// dawn, some at night, little by day.
const L = e.lib, BOX = [-110, -3, 110, 0.3];
e.layer('east', { box: BOX, drift: [0.12, 0] }, gl => L.mistBank(gl, -110, 220, 22, 3, -0.2, -1.6, '#dfe6de', 0.32));
e.layer('west', { box: BOX, drift: [-0.08, 0] }, gl => L.mistBank(gl, -110, 220, 18, 11, -0.4, -2.2, '#dfe6de', 0.24));
