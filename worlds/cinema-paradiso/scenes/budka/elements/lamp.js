
// The lamp over the bench: a cord from the ceiling, an enamel shade, its bulb (the scene's light `lamp_light`)
g.strokeStyle = '#1e1c1a'; g.lineWidth = 0.012; g.beginPath(); g.moveTo(0, -1.0); g.lineTo(0, -0.12); g.stroke();
g.fillStyle = '#2a3a32'; g.beginPath(); g.moveTo(-0.16, 0); g.lineTo(-0.06, -0.12); g.lineTo(0.06, -0.12); g.lineTo(0.16, 0); g.closePath(); g.fill();
g.fillStyle = '#d8d0b8'; g.beginPath(); g.ellipse(0, 0, 0.16, 0.025, 0, 0, Math.PI * 2); g.fill();
e.light(0, 0.0, 0.06, '#ffd09a', 1, 'bulb');
