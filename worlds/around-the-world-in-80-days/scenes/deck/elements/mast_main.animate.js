// falling over to port (the first part of the drag), then shrunk on its way to the hatch; gone at 0, dim if locked
const L = e.lib;
L.partAnimate(e, 'mast_main', ['mast'], [0, -6]);
e.layer('mast').rotate = L.shipOf(e.state) === 'henrietta' ? L.fallOf(e.state.drag_mast_main) : 0;
