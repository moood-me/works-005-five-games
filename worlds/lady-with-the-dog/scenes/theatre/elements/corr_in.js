// The corridor's wall on the hall's side (its x runs along the corridor from its far end, z 6): yellowish plaster, a
// brown dado; the two doors into the hall are openings (the side door, z 13.6; the other door, z 16.4).
g.fillStyle = '#cfc0a0'; g.fillRect(0, -3.55, 14.5, 3.55);
g.fillStyle = '#5a4634'; g.fillRect(0, -1.0, 14.5, 1.0);
g.fillStyle = '#7a6046'; g.fillRect(0, -1.04, 14.5, 0.05);
for (const x of [7.6, 10.4]) {
  g.fillStyle = '#6a5440'; g.fillRect(x - 0.62, -2.52, 1.24, 2.52);
  g.save(); g.globalCompositeOperation = 'destination-out'; g.fillRect(x - 0.5, -2.4, 1.0, 2.4); g.restore();
}
