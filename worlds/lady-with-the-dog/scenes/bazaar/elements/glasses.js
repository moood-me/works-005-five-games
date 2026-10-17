// Two glasses of tea in silver holders on the table (metres, origin at their foot's middle).
for (const x of [-0.18, 0.2]) {
  g.fillStyle = '#efe9dc'; g.beginPath(); g.ellipse(x, -0.005, 0.07, 0.012, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#8e5a2a'; g.fillRect(x - 0.03, -0.11, 0.06, 0.1);
  g.fillStyle = '#a7a9ae'; g.fillRect(x - 0.034, -0.07, 0.068, 0.06);
  g.strokeStyle = '#a7a9ae'; g.lineWidth = 0.008; g.beginPath(); g.arc(x + 0.045, -0.05, 0.02, -Math.PI / 2, Math.PI / 2); g.stroke();
}
