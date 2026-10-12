// The herd laid out of the atlas (layer 1: one buffalo in FRAMES poses of its stride, CELL metres apart from AT): ROWS
// rows, the nearest lowest on the card and drawn over the farther; in each, one buffalo every SLOT metres of the herd
// (jittered), LONG metres from its head to its tail; the head GONE metres on from the card's left edge (−HALF). Each
// its own size and stride length; its pose — where its own stride has come to over the way gone.
const float HALF = 50.0, LONG = 260.0, SLOT = 7.0, CELL = 4.0, AT = 60.0, FRAMES = 12.0;
const int ROWS = 6;
vec4 shade(vec4 painted, vec2 at, vec2 uv) {
  vec4 c = vec4(0.0);
  if (crossing < 0.5) return c;
  float head = -HALF + gone, q = head - at.x;
  for (int r = 0; r < ROWS; r++) {
    float y0 = -0.22 * float(r);
    float k0 = floor(q / SLOT);
    for (int dk = -1; dk <= 1; dk++) {
      float k = k0 + float(dk);
      if (k < 0.0 || k >= LONG / SLOT) continue;
      uint id = uint(int(k)) * 16u + uint(r);
      float p = (k + 0.5 + (hash1(id * 7u + 1u) - 0.5) * 0.7) * SLOT;
      float s = 0.85 + 0.3 * hash1(id * 7u + 2u);
      vec2 l = vec2(at.x - (head - p), at.y - y0) / s;
      if (abs(l.x) > CELL * 0.5 || l.y < -2.4 || l.y > 0.2) continue;
      float stride = 3.2 + 0.6 * hash1(id * 7u + 3u);
      float f = floor(fract(gone / stride + hash1(id * 7u + 4u)) * FRAMES);
      vec4 b = layer(1, vec2(AT + (f + 0.5) * CELL + l.x, l.y));
      c += (1.0 - c.a) * b;
    }
  }
  return c;
}
