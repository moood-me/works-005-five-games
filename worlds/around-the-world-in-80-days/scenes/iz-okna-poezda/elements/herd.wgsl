// The herd laid out of the atlas (layer 1: one buffalo in FRAMES poses of its stride, CELL metres apart from AT): ROWS
// rows, the nearest lowest on the card and drawn over the farther; in each, one buffalo every SLOT metres of the herd
// (jittered), LONG metres from its head to its tail; the head GONE metres on from the card's left edge (−HALF). Each
// its own size and stride length; its pose — where its own stride has come to over the way gone.
const HALF = 50.0;
const LONG = 260.0;
const SLOT = 7.0;
const CELL = 4.0;
const AT = 60.0;
const FRAMES = 12.0;
const ROWS = 6;
fn shade(painted: vec4f, at: vec2f, uv: vec2f) -> vec4f {
  var c = vec4f(0.0);
  if (u_crossing < 0.5) { return c; }
  let head = -HALF + u_gone;
  let q = head - at.x;
  for (var r = 0; r < ROWS; r++) {
    let y0 = -0.22 * f32(r);
    let k0 = floor(q / SLOT);
    for (var dk = -1; dk <= 1; dk++) {
      let k = k0 + f32(dk);
      if (k < 0.0 || k >= LONG / SLOT) { continue; }
      let id = u32(i32(k)) * 16u + u32(r);
      let p = (k + 0.5 + (hashU(id * 7u + 1u) - 0.5) * 0.7) * SLOT;
      let s = 0.85 + 0.3 * hashU(id * 7u + 2u);
      let l = vec2f(at.x - (head - p), at.y - y0) / s;
      if (abs(l.x) > CELL * 0.5 || l.y < -2.4 || l.y > 0.2) { continue; }
      let stride = 3.2 + 0.6 * hashU(id * 7u + 3u);
      let f = floor(fract(u_gone / stride + hashU(id * 7u + 4u)) * FRAMES);
      let b = layer(1, vec2f(AT + (f + 0.5) * CELL + l.x, l.y));
      c += (1.0 - c.a) * b;
    }
  }
  return c;
}
