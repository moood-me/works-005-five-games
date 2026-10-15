// the wall opposite the ports (seen from the room; its +x is the room's left): plaster, a skirting, a coat hook
const L = e.lib, ruin = e.state.era === 'ruin';
L.plaster(g, -2.1, -2.7, 4.2, 2.75, ruin ? '#7c7266' : '#7d6a54', 43, ruin);
g.fillStyle = '#3e3024'; g.fillRect(-2.1, -0.12, 4.2, 0.12);
g.fillStyle = '#2a2420'; g.fillRect(0.6, -1.75, 0.04, 0.06);
