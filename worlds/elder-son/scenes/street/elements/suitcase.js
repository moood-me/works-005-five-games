// The old fibre suitcase on a stool by the kitchen window, in the lamp's light — only in the epilogue's `suitcase`
// ending (`ending`, a party key: set as the scene opens). Metres; the anchor on the stool's seat.
if (e.state.ending === 'suitcase') {
  g.fillStyle = '#5b4a3a';
  g.fillRect(-0.3, 0, 0.6, 0.04);
  g.fillRect(-0.26, 0.04, 0.05, 0.46);
  g.fillRect(0.21, 0.04, 0.05, 0.46);
  g.fillStyle = '#8a6a4a';
  g.fillRect(-0.32, -0.44, 0.64, 0.44);
  g.fillStyle = '#6c5038';
  g.fillRect(-0.32, -0.44, 0.64, 0.05);
  g.fillRect(-0.32, -0.05, 0.64, 0.05);
  g.fillStyle = '#c9b48a';
  for (const x of [-0.28, 0.24]) g.fillRect(x, -0.44, 0.04, 0.44);
  g.fillStyle = '#2e2620';
  g.fillRect(-0.08, -0.5, 0.16, 0.06);
  e.at(0, -0.22);
}
