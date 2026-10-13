// The cape: a long low arm of land out into the sea, its end a steep little cliff under the
// lighthouse. Far off: the air makes it pale.
const SKY = [
  [-520, 26], [-300, 23], [-150, 20], [0, 18], [60, 16.5], [80, 15.8], [84, 15.2], [86, 5], [89, 0],
];
g.beginPath();
g.moveTo(SKY[0][0], 0);
g.lineTo(SKY[0][0], -SKY[0][1]);
for (let i = 1; i < SKY.length - 1; i++) {
  const [x, h] = SKY[i];
  const [nx, nh] = SKY[i + 1];
  g.quadraticCurveTo(x, -h, (x + nx) / 2, -(h + nh) / 2);
}
g.lineTo(89, 0);
g.closePath();
g.fillStyle = "#7f8b98";
g.fill();
