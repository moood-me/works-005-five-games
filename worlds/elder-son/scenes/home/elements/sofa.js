// The old sofa's high back against the room's back wall: worn brown plush in buttoned panels, a carved wooden rail on
// top, a little shelf. Metres; 2.0 wide, from the floor (the seat is `sofa_top`, its front `sofa_front`).
g.fillStyle = '#5b463a';
g.fillRect(-1.0, -0.92, 2.0, 0.92);
g.fillStyle = '#4a3a31';
for (const x of [-0.95, -0.32, 0.31]) g.fillRect(x, -0.88, 0.62, 0.4);
g.fillStyle = '#6b5446';
for (const x of [-0.65, 0, 0.65]) for (const y of [-0.78, -0.6]) {
  g.beginPath();
  g.arc(x, y, 0.015, 0, Math.PI * 2);
  g.fill();
}
g.fillStyle = '#3e2a1e';
g.fillRect(-1.03, -0.97, 2.06, 0.06);
g.fillStyle = '#e8e2d4';
g.fillRect(0.6, -1.06, 0.08, 0.09);
