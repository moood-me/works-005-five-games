// A ship's lantern hung on the main shrouds at the starboard rail, by the people at the night's rail: an iron bracket,
// the brass lantern, its glass; its flame — the light lantern#lamp (lit at night: the animate, the scene's deck_lamp).
const L = e.lib;
L.line(g, [[0.25, -1.2], [0.25, -2.75], [-0.05, -2.75]], '#2e2f33', 0.05);
L.rect(g, -0.16, -2.72, 0.22, 0.06, '#8a6a3a');
L.rect(g, -0.15, -2.62, 0.2, 0.3, 'rgba(240,226,190,0.85)');
L.rect(g, -0.17, -2.33, 0.24, 0.06, '#8a6a3a');
L.rect(g, -0.15, -2.66, 0.2, 0.04, '#8a6a3a');
e.light(-0.05, -2.47, 0.16, '#ffcf88', 1, 'lamp');
