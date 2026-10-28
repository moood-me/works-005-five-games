// The tiller from above: the rudder head aft (near), the bar running forward from it — a layer its animate puts over
// by `helm` (the bow to starboard: the bar to port). Its point tiller#tiller — the bar's end, where the hands hold it.
const L = e.lib;
e.layer('bar', { pivot: [0, 0.6] }, g => {
  L.poly(g, [[-0.06, 0.6], [0.06, 0.6], [0.04, -0.85], [-0.04, -0.85]], '#7a5a36');
  L.rect(g, -0.05, -0.9, 0.1, 0.12, '#5a4026');
  e.at(0, -0.8, 'tiller');
});
