// The door to Sarafanov's own room: plain painted panels, a brass knob. From its hinge (x 0) to its free edge (−0.8);
// it turns by `sar_door_f` (always a little ajar).
g.fillStyle = '#c8bca4';
g.fillRect(-0.8, -2.0, 0.8, 2.0);
g.strokeStyle = '#9d907a';
g.lineWidth = 0.02;
g.strokeRect(-0.7, -1.88, 0.6, 0.78);
g.strokeRect(-0.7, -0.92, 0.6, 0.8);
g.fillStyle = '#b08a3a';
g.beginPath();
g.arc(-0.72, -1.0, 0.025, 0, Math.PI * 2);
g.fill();
