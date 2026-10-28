// The camp bed from above: the khaki canvas, a white pillow at its head (by the doorway), the grey striped blanket
// over its foot half. Its point: bed (where one lying on it has the hips — `cot_top#bed`). Metres; 0.7 × 1.7,
// y = 1.55 − the plan's z (the head at y −0.85).
g.fillStyle = '#7c7a5a';
g.fillRect(-0.35, -0.85, 0.7, 1.7);
g.fillStyle = '#e8e4da';
g.beginPath();
g.ellipse(0, -0.68, 0.27, 0.13, 0, 0, Math.PI * 2);
g.fill();
g.fillStyle = '#6a6c72';
g.fillRect(-0.36, -0.05, 0.72, 0.9);
g.fillStyle = '#8c8e94';
for (const y of [0.1, 0.16, 0.7, 0.76]) g.fillRect(-0.36, y, 0.72, 0.025);
e.at(0, 0, 'bed');
