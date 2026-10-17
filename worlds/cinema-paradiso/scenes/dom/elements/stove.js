// The small iron stove in the corner by the north wall, east of the table: its body on bent legs, the door with a
// glow-less grate (cold — only the lamp is warm), a kettle and a coffee pot on the top, the black pipe up the wall and
// into it at the ceiling; a dish towel hanging from the rail. Painted once.
g.fillStyle = '#25211e';
g.fillRect(-0.28, -0.85, 0.56, 0.62);
g.fillRect(-0.3, -0.88, 0.6, 0.05);
for (const x of [-0.24, 0.2]) { g.beginPath(); g.moveTo(x, -0.23); g.lineTo(x + 0.04, -0.23); g.lineTo(x + (x < 0 ? -0.02 : 0.06), 0); g.lineTo(x + (x < 0 ? -0.04 : 0.04), 0); g.closePath(); g.fill(); }
g.fillStyle = '#3a3430'; g.fillRect(-0.16, -0.7, 0.32, 0.3);
g.fillStyle = '#1a1714'; for (let k = 0; k < 4; k++) g.fillRect(-0.12, -0.66 + k * 0.07, 0.24, 0.025);
g.fillStyle = '#8f8a7e'; g.fillRect(-0.3, -0.36, 0.6, 0.02);
// the towel on the rail
g.fillStyle = '#d9d1bd'; g.fillRect(0.06, -0.36, 0.16, 0.26);
g.fillStyle = 'rgba(160,60,50,0.55)'; g.fillRect(0.06, -0.16, 0.16, 0.02); g.fillRect(0.06, -0.12, 0.16, 0.01);
// the kettle and the coffee pot
g.fillStyle = '#6e6a63';
g.beginPath(); g.ellipse(-0.12, -0.95, 0.1, 0.07, 0, 0, Math.PI * 2); g.fill();
g.fillRect(-0.04, -1.0, 0.1, 0.02);
g.strokeStyle = '#4a4640'; g.lineWidth = 0.015; g.beginPath(); g.arc(-0.12, -1.0, 0.06, Math.PI, 0); g.stroke();
g.fillStyle = '#8a7a5e'; g.beginPath(); g.moveTo(0.1, -0.88); g.lineTo(0.13, -1.08); g.lineTo(0.21, -1.08); g.lineTo(0.24, -0.88); g.fill();
// the pipe up the wall
g.fillStyle = '#1d1a18'; g.fillRect(-0.05, -2.8, 0.1, 1.92);
g.fillStyle = '#2a2622'; g.fillRect(-0.06, -1.9, 0.12, 0.03); g.fillRect(-0.06, -2.5, 0.12, 0.03);
