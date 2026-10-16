// a small brass wall lamp with a pink silk shade; lit by `lights` (dimmed as the reel begins)
g.fillStyle = '#8a6c3a'; g.fillRect(-0.02, -0.26, 0.04, 0.26); g.fillRect(-0.1, -0.03, 0.2, 0.03);
g.fillStyle = '#e8c4a8';
g.beginPath(); g.moveTo(-0.11, -0.24); g.lineTo(0.11, -0.24); g.lineTo(0.06, -0.42); g.lineTo(-0.06, -0.42); g.closePath(); g.fill();
e.light(0, -0.33, 0.14, '#ffd2a8', 1, 'lamp');
