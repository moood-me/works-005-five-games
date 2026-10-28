// The compartment seen through her window: a warm panelled wall, the luggage rack, the lamp's glow (it lights her).
// Metres over the rail, origin at the window's middle across.
g.fillStyle = '#c3955e'; g.fillRect(-1.0, -3.4, 2.0, 2.4);
g.fillStyle = '#a77a48';
for (const x of [-0.95, -0.15, 0.65]) g.fillRect(x, -3.3, 0.04, 2.2);
g.fillRect(-1.0, -2.25, 2.0, 0.05);
g.fillStyle = '#6f5034'; g.fillRect(-1.0, -1.95, 2.0, 0.6);          // the seat's back
g.strokeStyle = '#8a6a44'; g.lineWidth = 0.025;
g.beginPath(); g.moveTo(-1, -3.05); g.lineTo(1, -3.05); g.moveTo(-1, -2.95); g.lineTo(1, -2.95); g.stroke();   // the rack
g.fillStyle = '#efd9a8';
g.beginPath(); g.arc(0.55, -3.22, 0.07, 0, Math.PI * 2); g.fill();
e.light(0.55, -3.22, 0.14, '#ffd59a', 1.2, 'lamp');
