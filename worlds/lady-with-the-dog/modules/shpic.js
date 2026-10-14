const WHITE = '#f4f2ee';
const SHADE = '#d9d6d4';
const RED = '#a8322c';
const blob = (g, x, y, rx, ry, col) => {
  g.fillStyle = col;
  g.beginPath();
  g.ellipse(x, y, rx, ry, 0, 0, 6.283);
  g.fill();
};
return {
  body(g, view) {
    if (view === 'back') {
      blob(g, 0, -0.16, 0.19, 0.15, SHADE);
      blob(g, 0, -0.18, 0.17, 0.14, WHITE);
      blob(g, -0.1, -0.1, 0.09, 0.07, WHITE);
      blob(g, 0.1, -0.1, 0.09, 0.07, WHITE);
      blob(g, -0.02, -0.3, 0.075, 0.07, WHITE);
      g.fillStyle = WHITE;
      g.beginPath();
      g.moveTo(-0.08, -0.34);
      g.lineTo(-0.1, -0.43);
      g.lineTo(-0.02, -0.37);
      g.closePath();
      g.fill();
      g.beginPath();
      g.moveTo(0.04, -0.37);
      g.lineTo(0.08, -0.45);
      g.lineTo(0.09, -0.34);
      g.closePath();
      g.fill();
      g.strokeStyle = WHITE;
      g.lineWidth = 0.07;
      g.beginPath();
      g.arc(0.1, -0.29, 0.07, 3.4, 8.4);
      g.stroke();
    } else {
      blob(g, 0, -0.17, 0.21, 0.13, SHADE);
      blob(g, 0.01, -0.19, 0.2, 0.13, WHITE);
      blob(g, -0.2, -0.27, 0.08, 0.07, WHITE);
      blob(g, -0.29, -0.25, 0.05, 0.03, WHITE);
      g.fillStyle = WHITE;
      g.beginPath();
      g.moveTo(-0.22, -0.32);
      g.lineTo(-0.2, -0.42);
      g.lineTo(-0.14, -0.31);
      g.closePath();
      g.fill();
      g.strokeStyle = WHITE;
      g.lineWidth = 0.07;
      g.beginPath();
      g.arc(0.2, -0.3, 0.08, 3.0, 8.3);
      g.stroke();
      g.fillStyle = SHADE;
      for (const x of [-0.12, -0.04, 0.1, 0.17]) g.fillRect(x - 0.025, -0.06, 0.05, 0.06);
    }
  },
  leash(g, view, mode) {
    if (mode === 'none') return;
    g.strokeStyle = RED;
    g.lineWidth = 0.028;
    g.lineCap = 'round';
    g.beginPath();
    if (view === 'back') {
      g.moveTo(-0.04, -0.25);
      g.quadraticCurveTo(-0.2, 0.0, -0.45, 0.08);
    } else {
      g.moveTo(-0.17, -0.2);
      g.quadraticCurveTo(-0.35, 0.0, -0.6, 0.06);
    }
    g.stroke();
  },
};
