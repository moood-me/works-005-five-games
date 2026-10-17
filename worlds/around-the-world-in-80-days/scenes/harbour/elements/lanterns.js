// The nearer row of lanterns strung over the tavern's terrace on two poles — red and gold in Hong Kong, white paper in
// Yokohama —, each swinging from its hook in the wind; the middle one lights the terrace (lanterns#t1: the light
// terrace_1). Lit as `lanterns` says; dazed (`daze`), their glows double (lib.lanternRow, lib.dazed).
const L = e.lib;
L.lanternRow(e, g, { half: 7, high: 3.2, n: 5, foot: 0, middle: 't1', colors: L.LANTERN_COLORS(L.portOf(e.state)) });
