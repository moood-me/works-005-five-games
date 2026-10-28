// The sideboard against the west wall: two doors below, a shelf of plates above, a coffee pot, a radio. Painted once.
g.fillStyle = '#4e3a29'; g.fillRect(-0.6, -0.9, 1.2, 0.9);
g.fillStyle = '#5d4632'; g.fillRect(-0.56, -0.82, 0.54, 0.74); g.fillRect(0.02, -0.82, 0.54, 0.74);
g.fillStyle = '#8f7a52'; g.fillRect(-0.06, -0.5, 0.03, 0.06); g.fillRect(0.03, -0.5, 0.03, 0.06);
g.fillStyle = '#3e2e21'; g.fillRect(-0.64, -0.94, 1.28, 0.05);
// the plate rack above
g.fillStyle = '#4e3a29'; g.fillRect(-0.55, -1.7, 1.1, 0.04); g.fillRect(-0.55, -1.38, 1.1, 0.04);
for (let i = 0; i < 6; i++) {
  g.fillStyle = i % 2 ? '#d9d2c0' : '#c8bfa8';
  g.beginPath(); g.ellipse(-0.45 + i * 0.18, -1.52, 0.08, 0.13, 0, 0, Math.PI * 2); g.fill();
  g.strokeStyle = 'rgba(60,80,120,0.6)'; g.lineWidth = 0.008; g.stroke();
}
// a coffee pot and an old radio on the top
g.fillStyle = '#7a7268'; g.beginPath(); g.moveTo(-0.42, -0.94); g.lineTo(-0.36, -1.2); g.lineTo(-0.24, -1.2); g.lineTo(-0.18, -0.94); g.fill();
g.fillStyle = '#3a2a20'; g.fillRect(0.1, -1.22, 0.4, 0.28);
g.fillStyle = '#b9a47a'; g.fillRect(0.14, -1.18, 0.2, 0.14);
g.fillStyle = '#2a2018'; g.beginPath(); g.arc(0.42, -1.1, 0.04, 0, Math.PI * 2); g.fill();
