// the gas lit at this hour (`day`): unlit by day, lit from dusk — their glows and the light they give the fog and the street
const k = e.kit.light.gas(e.state.day);
for (let i = 1; i <= 3; i++) e.glow(`lamp${i}`, k);
