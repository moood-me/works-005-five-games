// The letters on the table (`letters`): `returned` — his envelopes come back, a violet stamp «Адресат выбыл» on each,
// a tidy pile (and one more on top once she lays it: `pile` 1); `answered` — her envelopes from Palermo, opened, a
// few sheets out; `none` — nothing. Painted once a value.
const kind = e.state.letters;
if (kind === 'none' || !kind) return;
const env = (x, y, a, col, stamp) => {
  g.save(); g.translate(x, y); g.rotate(a);
  g.fillStyle = col; g.fillRect(-0.11, -0.012, 0.22, 0.012);
  g.fillStyle = 'rgba(0,0,0,0.15)'; g.fillRect(-0.11, -0.002, 0.22, 0.002);
  if (stamp) { g.fillStyle = '#6a4a8a'; g.fillRect(0.03, -0.014, 0.05, 0.004); }
  g.restore();
};
const n = kind === 'returned' ? 9 + (e.state.pile ? 1 : 0) : 7;
for (let i = 0; i < n; i++) {
  env((e.rnd() - 0.5) * 0.02, -i * 0.012, (e.rnd() - 0.5) * 0.04, kind === 'returned' ? (i % 2 ? '#e4dcc8' : '#d9cfb8') : (i % 2 ? '#e8e1d0' : '#ddd5c0'), kind === 'returned');
}
if (kind === 'answered') {
  g.fillStyle = '#f0ece0';
  g.save(); g.translate(0.2, -0.004); g.rotate(-0.15); g.fillRect(-0.08, -0.004, 0.16, 0.004); g.restore();
  g.fillStyle = '#3a4a8a'; g.fillRect(0.14, -0.006, 0.08, 0.002);
}
e.at(0, -n * 0.012 - 0.01, 'pile');
