// The gas lamps on the pavement before the club (the world's London lamp, modules/light) — each where it stands (a part),
// on the street a little below the club's floor (the element's elevation); their flames "lamp1"…"lamp3", lit as the hour
// has the gas (lamps.animate.js).
const d0 = 23;
e.lib.plan.lamps.forEach(([across, d], i) => e.part(across, d - d0, g => e.kit.light.gasLamp(g, e, `lamp${i + 1}`), [-0.5, -4.4, 0.5, 0.1]));
