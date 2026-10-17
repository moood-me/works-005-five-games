// The elephant's shed, its back: the posts behind, a beam along them.
const S = e.lib.plan.shed;
g.fillStyle = '#4a3c2a';
for (const x of [-0.75, -0.25, 0.25, 0.75]) g.fillRect(x * S.w - 0.12, -S.posts, 0.24, S.posts);
g.fillRect(-S.w - 0.2, -S.posts, 2 * S.w + 0.4, 0.2);
