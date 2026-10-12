// The hall's floor, seen through the open door: black and white stone in squares.
for (let x = -3.6, i = 0; x < 3.6; x += 0.45, i++) {
  for (let y = -1.3, j = 0; y < 1.3; y += 0.45, j++) {
    g.fillStyle = (i + j) % 2 ? '#2a2826' : '#c8c4ba';
    g.fillRect(x, y, 0.45, Math.min(0.45, 1.3 - y));
  }
}
