// The hut's thatch, the slope toward the line, seen from above.
const H = e.lib.plan.hut;
e.lib.thatch(g, 2 * (H.w + 0.3), Math.hypot(H.d + H.eaves, (H.ridge - H.wall) * (1 + H.eaves / H.d)), '#7a6a48');
