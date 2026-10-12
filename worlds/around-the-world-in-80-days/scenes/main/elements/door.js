// The door's left leaf, walnut, hinged on the left jamb: it turns into the room as `door` opens (`leaf_l`,
// worked out by script.js). Its free edge carries the handle.
const P = e.lib.plan.door;
e.lib.leaf(g, 1);
e.at(P.w / 2 - 0.12, -1.1, 'handle');
e.at(P.w / 2, -P.h / 2, 'door');
