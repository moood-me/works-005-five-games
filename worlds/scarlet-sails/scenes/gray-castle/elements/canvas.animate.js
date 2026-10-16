// The fresh paint as far as each nail is painted over; and the hand: the brush's tip goes to the nail whose paint is
// growing now (the last one that grew; before any — waiting below the feet), settling there, working it in small
// strokes while it grows; the arm reaches up to it from the boy's shoulder under the frame.
const lib = e.lib, C = lib.CLOSE, m = e.mem, mid = e.aspect / 2;
lib.dabsNow(e);
const [hx, hy] = C.hand(e.aspect);
let busy = 0;
for (const [x, y, , key] of lib.NAILS) {
  if (Math.abs(e.speed(key)) > 1e-4) { m.tx = mid + C.k * x; m.ty = C.y0 + C.k * y; busy = 1; }
}
m.tx ??= hx; m.ty ??= hy; m.x ??= m.tx; m.y ??= m.ty; m.busy ??= 0;
if (e.cut < e.dt * 1.5) { m.x = m.tx; m.y = m.ty; }
const k = 1 - Math.exp(-e.dt * 5);
m.x += (m.tx - m.x) * k;
m.y += (m.ty - m.y) * k;
m.busy += (busy - m.busy) * (1 - Math.exp(-e.dt * 8));
const hand = e.layer("hand");
const x = m.x + m.busy * 0.012 * Math.sin(e.t * 9) + 0.003 * e.anim.drift(e.t * 0.4, 1);
const y = m.y + m.busy * 0.008 * Math.sin(e.t * 7.3 + 1) + 0.003 * e.anim.drift(e.t * 0.4, 2);
const [sx, sy] = C.shoulder(e.aspect, x);
hand.x = x - hx;
hand.y = y - hy;
// (painted straight down from the tip: turned so the sleeve runs to the shoulder)
hand.rotate = Math.atan2(sy - y, sx - x) - Math.PI / 2 + m.busy * 0.04 * Math.sin(e.t * 9 + 0.5);
