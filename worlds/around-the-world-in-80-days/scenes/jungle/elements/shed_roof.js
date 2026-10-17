// The shed's thatch, its front slope (seen from above; from the trail, from below).
const S = e.lib.plan.shed;
e.lib.thatch(g, 2 * (S.w + 0.4), Math.hypot(S.d + S.eaves, (S.ridge - S.posts) * (1 + S.eaves / S.d)), '#8a7650');
