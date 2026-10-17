// The elephant's shed, its front: four posts open to the trail — where Kiouni stands.
const S = e.lib.plan.shed;
g.fillStyle = '#5a4a34';
for (const x of [-0.75, -0.25, 0.25, 0.75]) g.fillRect(x * S.w - 0.12, -S.posts, 0.24, S.posts);
g.fillRect(-S.w - 0.2, -S.posts, 2 * S.w + 0.4, 0.2);
e.at(0, -2.4, 'kiouni_shed');
