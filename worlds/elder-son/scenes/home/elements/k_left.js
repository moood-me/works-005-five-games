// The kitchen's left wall, behind the stove; near the window a tin washstand over a basin on its stand, a towel on a
// nail. Metres; 4 deep, x = the plan's z − 2.
e.lib.kitchenWall(g, e, 4);
g.fillStyle = '#9aa3a8';
g.beginPath();
g.moveTo(1.18, -1.46);
g.lineTo(1.42, -1.46);
g.lineTo(1.38, -1.2);
g.lineTo(1.22, -1.2);
g.closePath();
g.fill();
g.fillStyle = '#6f777c';
g.fillRect(1.28, -1.2, 0.04, 0.06);
g.fillStyle = '#5a4434';
g.fillRect(1.1, -0.8, 0.4, 0.8);
g.fillStyle = '#dcd8cc';
g.beginPath();
g.ellipse(1.3, -0.82, 0.24, 0.06, 0, 0, Math.PI * 2);
g.fill();
g.fillStyle = '#ece6d6';
g.fillRect(1.62, -1.5, 0.22, 0.5);
g.fillStyle = '#a5453a';
g.fillRect(1.62, -1.1, 0.22, 0.03);
g.fillRect(1.62, -1.06, 0.22, 0.015);
