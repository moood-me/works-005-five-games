// A train far off on the bank: the engine and six carriages, dark against the sky, their windows lit; a small red
// light on the last carriage. Its place along the bank is `far_train_a` (the scene's, from `far_train`).
g.fillStyle = '#24242a';
g.fillRect(28, -4.0, 11, 3.4); g.fillRect(36, -5.2, 1.0, 1.4); g.fillRect(28, -4.6, 5, 0.8);
for (let c = 0; c < 6; c++) {
  const x0 = 13 - c * 14;
  g.fillStyle = '#2a2a32'; g.fillRect(x0, -4.0, 13.2, 3.4);
  for (let w = 0; w < 7; w++) {
    g.fillStyle = '#ffd890'; g.fillRect(x0 + 0.8 + w * 1.75, -3.2, 0.9, 0.8);
    e.light(x0 + 1.25 + w * 1.75, -2.8, 0.5, '#ffd08a', 0.5);
  }
}
e.at(36.5, -5.3, 'chimney');
e.light(-57.3, -1.4, 0.5, '#ff3a26', 1.4, 'tail');
