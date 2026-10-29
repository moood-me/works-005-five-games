// The landing's left wall (its x runs from the front, z 17, toward the back): plaster over a dado; the opening where
// the stairs turn down (z 22.8…24.6).
g.fillStyle = '#cbbd9e'; g.fillRect(0, -5.65, 10, 5.65);
g.fillStyle = '#5a4634'; g.fillRect(0, -1.0, 10, 1.0);
g.fillStyle = '#6a5440'; g.fillRect(5.68, -2.72, 2.04, 2.72);
g.save(); g.globalCompositeOperation = 'destination-out'; g.fillRect(5.8, -2.6, 1.8, 2.6); g.restore();
