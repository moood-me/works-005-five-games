// The landing's floor, from above: grey stone flags.
g.fillStyle = '#8a8478'; g.fillRect(-2.7, -5, 5.4, 10);
for (let i = 0; i < 40; i++) { g.fillStyle = 'rgba(60,56,50,0.12)'; g.fillRect(-2.7 + Math.floor(anim.hash(i, 3) * 9) * 0.6, -5 + Math.floor(anim.hash(i, 4) * 16) * 0.6, 0.6, 0.6); }
g.strokeStyle = 'rgba(50,46,40,0.4)'; g.lineWidth = 0.02;
for (let x = -2.7; x <= 2.71; x += 0.6) { g.beginPath(); g.moveTo(x, -5); g.lineTo(x, 5); g.stroke(); }
for (let y = -5; y <= 5.01; y += 0.6) { g.beginPath(); g.moveTo(-2.7, y); g.lineTo(2.7, y); g.stroke(); }
