// A small harbour lamp on an iron bracket on the warehouse wall over the bench: a pale bulb under a tin shade. Its
// light falls on the two on the bench (the scene's `bench_light`), so their faces read at dusk and at night.
g.strokeStyle = '#26272b'; g.lineWidth = 0.035;
g.beginPath(); g.moveTo(0, 0); g.lineTo(0.48, 0); g.lineTo(0.48, 0.12); g.moveTo(0, 0.25); g.lineTo(0.3, 0); g.stroke();
g.fillStyle = '#2c2e33'; g.beginPath(); g.moveTo(0.3, 0.12); g.lineTo(0.66, 0.12); g.lineTo(0.56, 0.02); g.lineTo(0.4, 0.02); g.closePath(); g.fill();
g.fillStyle = '#f2eedf'; g.beginPath(); g.ellipse(0.48, 0.17, 0.06, 0.07, 0, 0, Math.PI * 2); g.fill();
e.light(0.48, 0.17, 0.16, '#efe9d8', 1, 'bulb');
