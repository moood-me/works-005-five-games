// The shed's thatch, its back slope.
const S = e.lib.plan.shed;
e.lib.thatch(g, 2 * (S.w + 0.4), Math.hypot(S.d + S.eaves, (S.ridge - S.posts) * (1 + S.eaves / S.d)), '#8a7650');
