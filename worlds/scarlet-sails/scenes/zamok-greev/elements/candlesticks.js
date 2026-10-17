// Two slim silver candlesticks across the table, the candles in them (their flames are `candles`)
for (const x of [-0.12, 0.12]) {
  g.fillStyle = "#8e8b84";
  g.beginPath();
  g.ellipse(x, -0.01, 0.045, 0.012, 0, 0, 7);
  g.fill();
  g.fillRect(x - 0.008, -0.28, 0.016, 0.27);
  g.fillRect(x - 0.025, -0.29, 0.05, 0.012);
  g.fillStyle = "#e9e4d8";
  g.fillRect(x - 0.012, -0.47, 0.024, 0.18);
}
