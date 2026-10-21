// The sheet: a rope from the boom's end to the hands of whoever holds it (a metre of it painted, laid between the two
// points each frame — animate).
e.layer('rope', { pivot: [0, 0], box: [-0.02, -0.03, 1.02, 0.03] }, g => {
  g.fillStyle = '#c8b48a';
  g.fillRect(0, -0.015, 1, 0.03);
});
