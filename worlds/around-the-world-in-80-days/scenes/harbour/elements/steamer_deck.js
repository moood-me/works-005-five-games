// The Carnatic's deck by her gangway's head: a coil of rope by the rail — and where Passepartout falls aboard
// (steamer_deck#aboard).
g.strokeStyle = '#8a7a5a';
g.lineWidth = 0.05;
for (let k = 0; k < 3; k++) {
  g.beginPath();
  g.ellipse(24.2, -0.12 - 0.05 * k, 0.32 - 0.04 * k, 0.07, 0, 0, Math.PI * 2);
  g.stroke();
}
e.at(22, 0, 'aboard');
