// The table lamp under its silk shade: the one warm light (metres, origin at its foot). Its flame is the scene's lamp.
g.fillStyle = '#8a6c3a';
g.beginPath(); g.ellipse(0, -0.02, 0.1, 0.02, 0, 0, Math.PI * 2); g.fill();
g.fillRect(-0.02, -0.4, 0.04, 0.38);
g.beginPath(); g.ellipse(0, -0.25, 0.06, 0.1, 0, 0, Math.PI * 2); g.fill();
g.fillStyle = '#f0d9a8';
g.beginPath(); g.moveTo(-0.11, -0.66); g.lineTo(0.11, -0.66); g.lineTo(0.22, -0.42); g.lineTo(-0.22, -0.42); g.closePath(); g.fill();
g.fillStyle = 'rgba(180,130,70,0.35)'; g.fillRect(-0.22, -0.45, 0.44, 0.03);
e.light(0, -0.48, 0.18, '#ffd08a', 1.6, 'flame');
