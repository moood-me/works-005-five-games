// The parterre's floor (from above, metres; x across, y toward the start): dark oak boards across, a dull green runner
// down the middle aisle and along the front of the stage.
g.fillStyle = '#4a3a2c';
g.fillRect(-7, -9.25, 14, 18.5);
for (let i = 0; i < 74; i++) {
  const y = -9.25 + i * 0.25;
  g.fillStyle = i % 2 ? 'rgba(30,20,14,0.22)' : 'rgba(120,90,60,0.1)';
  g.fillRect(-7, y, 14, 0.25);
  g.fillStyle = 'rgba(20,14,10,0.4)';
  g.fillRect(-7, y, 14, 0.012);
}
g.fillStyle = '#44523f';
g.fillRect(-0.36, -9.25, 0.72, 18.5);
g.fillRect(-7, -9.25, 14, 1.2);
g.fillStyle = '#5c6a52';
g.fillRect(-0.36, -9.25, 0.04, 18.5); g.fillRect(0.32, -9.25, 0.04, 18.5);
