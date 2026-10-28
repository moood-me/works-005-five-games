// The lamps on the viewer's own pavement, at the kerb: dark posts close by, their globes high above the frame, their
// light on the near pavement and the roadway.
const L = e.lib;
const d0 = 2.35;
for (const [name, across, d] of L.plan.near) e.part(across, d - d0, g => e.kit.light.gasLamp(g, e, name));
