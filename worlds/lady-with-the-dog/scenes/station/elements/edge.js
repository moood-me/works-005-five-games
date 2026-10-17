// The platform's stone face toward the track (metres, origin at its foot on the track bed).
g.fillStyle = '#8f877c';
g.fillRect(-26, -0.62, 52, 0.62);
g.fillStyle = '#b8b0a2'; g.fillRect(-26, -0.64, 52, 0.08);
g.strokeStyle = 'rgba(60,56,52,0.45)'; g.lineWidth = 0.02;
for (let x = -26; x < 26; x += 0.9) { g.beginPath(); g.moveTo(x, -0.56); g.lineTo(x, 0); g.stroke(); }
g.beginPath(); g.moveTo(-26, -0.3); g.lineTo(26, -0.3); g.stroke();
