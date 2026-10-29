// The lantern on its iron bracket on the gate's right post: a four-sided glass lamp with a little roof; its light is
// the scene's lantern light (`lamp`).
g.strokeStyle = '#2e2c2c'; g.lineWidth = 0.025;
g.beginPath(); g.moveTo(0.0, -2.25); g.lineTo(-0.28, -2.25); g.quadraticCurveTo(-0.32, -2.5, -0.2, -2.62); g.stroke();
g.fillStyle = '#2e2c2c';
g.beginPath(); g.moveTo(-0.33, -2.66); g.lineTo(-0.17, -2.78); g.lineTo(-0.01, -2.66); g.fill();
g.fillStyle = '#f4dca0'; g.fillRect(-0.27, -2.62, 0.2, 0.26);
g.strokeStyle = '#2e2c2c'; g.lineWidth = 0.015; g.strokeRect(-0.27, -2.62, 0.2, 0.26);
g.beginPath(); g.moveTo(-0.17, -2.62); g.lineTo(-0.17, -2.36); g.stroke();
e.light(-0.17, -2.49, 0.3, '#ffd08a', 1.1, 'flame');
