// the hours going by: the watch's hands from 11:40 to 14:33, the bars' shadow sliding across
const u = e.lib.clamp01(e.state.cell_time), min = 40 + 173 * u, TAU = 2 * Math.PI;
e.layer('minute').rotate = (min / 60) * TAU;
e.layer('hour').rotate = ((11 + min / 60) / 12) * TAU;
e.layer('bars').x = -0.7 * u;
