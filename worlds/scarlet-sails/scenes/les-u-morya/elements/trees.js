// The wood's trunks — birches (tall, slender, white, their dark marks) and a few pines —, each a part where its tree
// stands (on the land there); the anchor 30 m ahead. Their crowns are elements of their own at their feet (crown_<i>:
// layers the wind moves). Painted in daylight; the sun and the moon throw their shadows on the land.
const L = e.lib;
const AZ = 30;
for (const tree of L.TREES) e.part(tree[0], tree[1] - AZ, (g) => L.trunk(g, tree), [-0.35, -tree[2] - 0.1, 0.35, 0.2]);
