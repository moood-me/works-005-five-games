// A telegraph pole beyond the line, its crossarm and green glass insulators, snow on the arm (copies 50 m apart). One
// layer that runs back 50 m while the train or the sledge runs, so each pole hands over to the next.
const { R, C } = e.lib;
e.layer('pole', { box: [-26, -7.4, 26, 0.2] }, g => {
  R(g, 24.87, -7.2, 25.13, 0.1, '#5e4c3a');
  R(g, 24.0, -6.95, 26.0, -6.78, '#5e4c3a');
  R(g, 24.0, -7.0, 26.0, -6.95, '#eef2f6');
  for (const x of [24.15, 24.55, 25.45, 25.85]) C(g, x, -7.03, 0.05, '#7fb0a0');
});
