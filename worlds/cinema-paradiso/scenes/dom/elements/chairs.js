// A plain wooden kitchen chair seen from its front: the rush seat at 0.46, the back rising behind it, four legs.
// (chair_n, chair_e, chair_w share it.) Painted once.
g.fillStyle = '#4c3a2a';
for (const x of [-0.19, 0.15]) g.fillRect(x, -0.46, 0.04, 0.46);
g.fillStyle = '#3c2e22';
for (const x of [-0.17, 0.13]) g.fillRect(x, -0.95, 0.04, 0.5);
g.fillStyle = '#4c3a2a'; g.fillRect(-0.17, -0.95, 0.34, 0.06); g.fillRect(-0.17, -0.78, 0.34, 0.04);
g.fillStyle = '#a8905e'; g.fillRect(-0.21, -0.5, 0.42, 0.05);
g.fillStyle = 'rgba(90,70,40,0.4)';
for (let x = -0.2; x < 0.2; x += 0.03) g.fillRect(x, -0.5, 0.012, 0.05);
