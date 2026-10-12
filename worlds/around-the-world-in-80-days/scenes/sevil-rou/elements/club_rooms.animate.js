// the rooms and their light as lit as the gas is at this hour
const k = e.kit.svet.gas(e.state.night);
e.uniform('gas', k);
e.glow('hall', k);
e.glow('saloon', k);
