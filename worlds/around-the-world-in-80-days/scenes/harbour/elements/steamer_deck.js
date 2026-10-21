// The Carnatic's deck by her gangway's head: a coil of rope by the rail, a lantern on a stanchion lighting the deck there
// (the light `aboard_lamp`, as the lanterns are) — and where Passepartout falls aboard (steamer_deck#aboard).
g.strokeStyle = '#8a7a5a';
g.lineWidth = 0.05;
for (let k = 0; k < 3; k++) {
  g.beginPath();
  g.ellipse(24.2, -0.12 - 0.05 * k, 0.32 - 0.04 * k, 0.07, 0, 0, Math.PI * 2);
  g.stroke();
}
g.fillStyle = '#2a2420';
g.fillRect(20.9, -1.9, 0.06, 1.9);
e.lib.lantern(e, g, 21.1, -1.7, 0.16, '#f0c070', 'lamp');
e.at(22, 0, 'aboard');
