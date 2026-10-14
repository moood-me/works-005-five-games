const houses = [[-24, 5.5, 3.4], [-15, 6.2, 3.8], [-5, 5.8, 3.2], [4, 6.5, 4], [13, 5.6, 3.3], [22, 6, 3.6]];
houses.forEach((hs, i) => {
  g.fillStyle = '#26324f';
  g.fillRect(hs[0] - hs[1] / 2, -hs[2], hs[1], hs[2]);
  g.beginPath(); g.moveTo(hs[0] - hs[1] / 2 - 0.4, -hs[2]); g.lineTo(hs[0], -hs[2] - 1.9); g.lineTo(hs[0] + hs[1] / 2 + 0.4, -hs[2]); g.closePath(); g.fill();
  g.fillStyle = '#c8d2e6';
  g.beginPath(); g.moveTo(hs[0] - hs[1] / 2 - 0.4, -hs[2]); g.lineTo(hs[0], -hs[2] - 1.9); g.lineTo(hs[0] + hs[1] / 2 + 0.4, -hs[2]); g.lineTo(hs[0] + hs[1] / 2 - 0.2, -hs[2] - 0.2); g.lineTo(hs[0], -hs[2] - 1.6); g.lineTo(hs[0] - hs[1] / 2 + 0.2, -hs[2] - 0.2); g.closePath(); g.fill();
  if (i % 2 === 0 || i === 3) {
    g.fillStyle = '#f2b868';
    g.fillRect(hs[0] - 0.5, -hs[2] * 0.7, 0.9, 0.7);
    e.light(hs[0], -hs[2] * 0.7 + 0.3, 2.2, '#ffb35a', 0.55);
  }
});
