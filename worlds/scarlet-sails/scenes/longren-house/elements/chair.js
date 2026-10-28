// The chair at the window sill, seen from behind: a plain back panel, the seat under it, four legs.
g.fillStyle = "#696863";
for (const lx of [-0.17, 0.15]) g.fillRect(lx, -0.44, 0.022, 0.42);
g.fillStyle = "#7a7772";
for (const lx of [-0.2, 0.18]) g.fillRect(lx, -0.46, 0.028, 0.46);
g.fillStyle = "#8b8883";
g.fillRect(-0.22, -0.48, 0.44, 0.035);
g.fillStyle = "#7a7772";
for (const px of [-0.2, 0.18]) g.fillRect(px, -0.88, 0.028, 0.42);
g.fillStyle = "#8b8883";
g.fillRect(-0.21, -0.9, 0.42, 0.2);
e.at(0, -0.9, "chair");
