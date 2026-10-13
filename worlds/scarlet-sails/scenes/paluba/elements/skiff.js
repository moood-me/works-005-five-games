// The ship's boat at her starboard side (x aft, from the water up; `korabli.skiff`, its bow toward hers): its falls
// from the rail down to the water, and the boat — a layer, painted on the water; its animate hangs it under the rail
// till it is lowered (`skiff_down`)
g.strokeStyle = e.lib.colours(e.state).rig;
g.lineWidth = 0.03;
for (const x of [-1.9, 1.9]) {
  g.beginPath();
  g.moveTo(x, -e.lib.SKIFF_HUNG - 0.75);
  g.lineTo(x, -0.5);
  g.stroke();
}
e.layer("boat", { box: [-2.5, -e.lib.SKIFF_HUNG - 0.95, 2.5, 0.25] }, g => e.kit.korabli.skiff(g, e));
