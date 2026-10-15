// The barrier: a striped post on the left of the road and its arm across the road, red and white, pivoting at
// the post's head (its layer `arm`, turned by `barrier` in animate). Metres; the arm runs to +x, 5.4 long.
// the post
g.fillStyle = '#8a8883';
g.fillRect(-0.32, -0.25, 0.64, 0.3);
for (let i = 0; i < 4; i++) {
  g.fillStyle = i % 2 ? '#1e1e20' : '#e4e1da';
  g.fillRect(-0.1, -0.25 - 0.22 * (i + 1), 0.2, 0.22);
}
g.fillStyle = '#e3e9f1';
g.beginPath();
g.moveTo(-0.6, 0.05);
g.quadraticCurveTo(0, -0.3, 0.6, 0.05);
g.closePath();
g.fill();

e.layer('arm', { pivot: [0, -1.0], box: [-1.6, -6.7, 5.8, 0.2] }, a => {
  // the counterweight
  a.fillStyle = '#29292b';
  a.fillRect(-1.25, -1.13, 0.95, 0.26);
  // the arm: stripes of red and white, a thin rod to its tip
  const len = 5.4;
  for (let x = -0.3, i = 0; x < len - 0.6; x += 0.5, i++) {
    a.fillStyle = i % 2 ? '#d9d3c8' : '#b3271f';
    a.fillRect(x, -1.08, Math.min(0.5, len - 0.6 - x), 0.16);
  }
  // its edges dark, so the white stripes read against the snow
  a.strokeStyle = '#3a2a26';
  a.lineWidth = 0.025;
  a.strokeRect(-0.3, -1.08, len - 0.3, 0.16);
  a.fillStyle = '#b3271f';
  a.fillRect(len - 0.6, -1.04, 0.6, 0.08);
  // a red reflector disc at the tip
  a.beginPath();
  a.arc(len - 0.05, -1.0, 0.09, 0, Math.PI * 2);
  a.fill();
  // the hub
  a.fillStyle = '#1e1e20';
  a.beginPath();
  a.arc(0, -1.0, 0.12, 0, Math.PI * 2);
  a.fill();
  // a ridge of snow along the arm's top
  a.fillStyle = '#e8eef5';
  a.fillRect(0.3, -1.1, len - 1.0, 0.035);
});
