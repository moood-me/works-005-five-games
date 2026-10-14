// The town across the road (copies): three narrow Sicilian houses, lime plaster, shutters, iron balconies; one
// window lit (in the past only: in 1988 the street sleeps).
const an = e.anim, past = e.state.era !== 'now';
const cols = ['#d4c3a2', '#c9ae8c', '#d9cfb8'];
for (let h = 0; h < 3; h++) {
  const x0 = -7 + h * 4.7, H = 7 + an.hash(h, 91) * 3;
  g.fillStyle = cols[h]; g.fillRect(x0, -H, 4.6, H);
  g.fillStyle = '#a89070'; g.fillRect(x0, -H, 4.6, 0.3);
  for (let fl = 0; fl < 2; fl++) for (let w = 0; w < 2; w++) {
    const wx = x0 + 0.8 + w * 2.0, wy = -3.4 - fl * 3.0;
    const lit = past && h === 1 && fl === 0 && w === 1;
    g.fillStyle = lit ? '#ffcf8a' : '#2a3038'; g.fillRect(wx, wy, 0.9, 1.6);
    g.fillStyle = '#4f6b5e'; g.fillRect(wx - 0.4, wy, 0.38, 1.6); g.fillRect(wx + 0.92, wy, 0.38, 1.6);
    if (fl === 1) { g.fillStyle = '#2a2a2c'; g.fillRect(wx - 0.3, wy + 1.6, 1.5, 0.06); for (let k = 0; k < 7; k++) g.fillRect(wx - 0.28 + k * 0.24, wy + 1.15, 0.02, 0.45); }
    if (lit) e.light(wx + 0.45, wy + 0.8, 0.4, '#ffcf8a', 0.6, 'window');
  }
  g.fillStyle = '#3b2d24'; g.fillRect(x0 + 1.8, -2.4, 1.0, 2.4);
}
