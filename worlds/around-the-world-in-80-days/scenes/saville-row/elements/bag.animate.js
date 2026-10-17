// as full as `bag` (0 — not there; its height from 0.16 m just begun to 0.32 m full), its clasp shut at the end; its
// point at its mouth
const k = e.anim.clamp(e.state.bag ?? 0, 0, 1);
const s = (0.16 + 0.16 * k) / 0.32;
const bag = e.layer('bag');
bag.alpha = k > 0.001 ? 1 : 0;
bag.scaleY = s;
bag.scaleX = 0.94 + 0.06 * k;
const clasp = e.layer('clasp');
clasp.alpha = k > 0.98 ? 1 : 0;
clasp.y = 0.32 * (1 - s);
e.at(0, -0.32 * s, 'bag');
