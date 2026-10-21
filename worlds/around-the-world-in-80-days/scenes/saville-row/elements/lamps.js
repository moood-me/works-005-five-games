// The gas lamps of the street (the world's London lamp, modules/light), each where it stands (a part): the one by Fogg's
// door against the railings, the others along the far kerb, before the club and down the side street into the fog.
// Each its own light (lamps#door, lamps#l1 …), reaching the pavement and the fronts — burning as the hour has the gas
// (its animate); the point lamps#door — under the lamp by Fogg's door.
const L = e.lib;
const d0 = 15.9;
for (const [name, across, d] of L.plan.lamps) {
  e.part(across, d - d0, g => {
    e.kit.light.gasLamp(g, e, name);
    // (under it, where Fix waits; its globe — where it is lit)
    if (name === 'door') { e.at(0.4, -1.7, 'door'); e.at(0, -3.95, 'door_flame'); }
  });
}
