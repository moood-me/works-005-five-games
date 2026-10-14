// The duty keeper's booth: a small plank hut under a snowy roof, a door at its left, a stovepipe. Its window is
// another element (booth_window) in front of the wall.
g.fillStyle = '#4b3c36';
g.fillRect(-1.8, -2.6, 3.6, 2.6);
g.strokeStyle = '#33292a'; g.lineWidth = 0.05;
for (let x = -1.8; x <= 1.8; x += 0.3) { g.beginPath(); g.moveTo(x, -2.6); g.lineTo(x, 0); g.stroke(); }
// door
g.fillStyle = '#2b2224';
g.fillRect(-1.55, -2.0, 0.8, 2.0);
// roof with snow
g.fillStyle = '#2d2527';
g.beginPath(); g.moveTo(-2.1, -2.55); g.lineTo(2.1, -2.55); g.lineTo(1.7, -3.15); g.lineTo(-1.7, -3.15); g.closePath(); g.fill();
g.fillStyle = '#dfe7f6';
g.beginPath(); g.moveTo(-2.15, -2.75); g.lineTo(2.15, -2.75); g.lineTo(1.75, -3.45); g.lineTo(-1.75, -3.45); g.closePath(); g.fill();
// pipe
g.fillStyle = '#2a2a30';
g.fillRect(0.9, -4.4, 0.3, 1.2);
g.fillStyle = '#dfe7f6'; g.fillRect(0.86, -4.5, 0.38, 0.12);
// snowdrift at the foot
g.fillStyle = '#d4dcef';
g.beginPath(); g.ellipse(0, 0.05, 2.3, 0.22, 0, 0, 6.283); g.fill();
e.at(1.05, -4.6, 'chimney');
