// The port on the horizon to starboard ahead, 1.5 km off: its skyline (lib.skyline), in daylight colours — the dawn,
// the fog, the haze make the rest. Nothing for the open sea.
const port = e.lib.portOf(e.state);
if (port !== 'none') {
  e.lib.skyline(g, port, e.rnd);
  e.at(0, -40, 'town');
}
