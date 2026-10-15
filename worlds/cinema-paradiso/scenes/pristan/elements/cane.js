// Alfredo's cane, standing between his knees when he sits on the bench (shown while he is here).
if (e.state.alfredo_here === false) return;
g.strokeStyle = '#3b2b20'; g.lineWidth = 0.028; g.lineCap = 'round';
g.beginPath(); g.moveTo(0.02, 0); g.lineTo(0, -0.84); g.quadraticCurveTo(-0.01, -0.94, -0.09, -0.93); g.quadraticCurveTo(-0.14, -0.91, -0.13, -0.86); g.stroke();
e.at(-0.02, -0.86, 'grip');
