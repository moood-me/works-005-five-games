// Two white pillows lying at the bed's head, seen from above (metres, x across the room, y toward the viewer): soft
// rounded oblongs side by side along the bed's width, a little shade at their edges, a seam and a dent in each.
const pillow = (y0, y1) => {
  const x0 = -0.25, x1 = 0.25, r = 0.08;
  g.fillStyle = '#d9d2c4';
  g.beginPath(); g.roundRect(x0 - 0.01, y0 - 0.005, x1 - x0 + 0.02, y1 - y0 + 0.02, r); g.fill();
  g.fillStyle = '#f4f0e8';
  g.beginPath(); g.roundRect(x0, y0, x1 - x0, y1 - y0, r); g.fill();
  g.fillStyle = 'rgba(190,178,160,0.35)';
  g.beginPath(); g.ellipse(0.02, (y0 + y1) / 2, 0.12, (y1 - y0) * 0.26, 0, 0, Math.PI * 2); g.fill();
  g.strokeStyle = 'rgba(170,158,140,0.45)'; g.lineWidth = 0.008;
  g.beginPath(); g.roundRect(x0 + 0.03, y0 + 0.03, x1 - x0 - 0.06, y1 - y0 - 0.06, r * 0.7); g.stroke();
};
pillow(-0.38, -0.02);
pillow(0.01, 0.37);
