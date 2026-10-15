// the stair landing's far wall seen through the door: limewash, the stair going down, a bare bulb
const an = e.anim;
g.fillStyle = '#5e564c'; g.fillRect(-1.45, -2.7, 2.9, 2.75);
for (let i = 0; i < 40; i++) { g.fillStyle = 'rgba(40,32,26,0.12)'; g.fillRect(-1.3 + an.hash(i, 1) * 2.4, -2.6 + an.hash(i, 2) * 2.4, 0.1 + an.hash(i, 3) * 0.3, 0.06); }
g.fillStyle = '#3e372f'; g.fillRect(-1.45, -0.9, 2.9, 0.95);
g.strokeStyle = '#3a332b'; g.lineWidth = 0.04; g.beginPath(); g.moveTo(-1.3, -1.0); g.lineTo(0.3, -0.1); g.stroke();
g.fillStyle = '#e8e2d0'; g.beginPath(); g.arc(0.0, -2.25, 0.04, 0, Math.PI * 2); g.fill();
g.strokeStyle = '#2a2622'; g.lineWidth = 0.01; g.beginPath(); g.moveTo(0.0, -2.6); g.lineTo(0.0, -2.29); g.stroke();
e.light(0.0, -2.25, 0.08, '#efe6cc', 0.8, 'bulb');
