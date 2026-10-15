// pulled by `peek`: gathered toward the south end (0 — hanging, 1 — a quarter of its width), the edge's point with it
if (e.state.era === 'ruin') return;
const W = 2.0, u = Math.max(0, Math.min(1, e.state.peek || 0)), k = 1 - 0.74 * e.anim.ease.smooth(u);
e.layer('drape').scaleX = k;
e.at(W - W * k, -1.15, 'gap');
e.at(W - W * k, -1.15, 'edge');
