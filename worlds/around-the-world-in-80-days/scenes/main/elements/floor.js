// The salon's floor seen from above: long boards of dark polished oak running away from you. Painted flat;
// the engine lays it in perspective, lets the lights lie on it and mirrors the room in its polish.
const w = 52;
const d = 16;
g.fillStyle = '#2a201b';
g.fillRect(-w / 2, -d / 2, w, d);
// the boards: long joints running away, each board a hair lighter or darker than the next
for (let x = -w / 2, i = 0; x < w / 2; x += 0.24, i++) {
  const v = e.anim.hash(i, 7);
  g.fillStyle = `rgba(${v > 0.5 ? '255,236,214' : '0,0,0'},${0.015 + 0.03 * Math.abs(v - 0.5)})`;
  g.fillRect(x, -d / 2, 0.24, d);
  g.fillStyle = 'rgba(0,0,0,0.3)';
  g.fillRect(x, -d / 2, 0.012, d);
}
