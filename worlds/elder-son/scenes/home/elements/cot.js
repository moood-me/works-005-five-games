// The camp bed's side toward the room: the aluminium frame, the khaki canvas sagging between, the grey blanket's edge
// hanging over it, the crossed legs. Its own point — the bed's middle (where the game offers “Stay”). Metres; 1.7
// long, x = the plan's z − 1.55 (its head by the doorway on the right).
g.strokeStyle = '#a9adb0';
g.lineCap = 'round';
g.lineWidth = 0.022;
g.beginPath();
g.moveTo(-0.85, -0.42);
g.lineTo(0.85, -0.42);
for (const c of [-0.55, 0.55]) {
  g.moveTo(c - 0.2, 0);
  g.lineTo(c + 0.2, -0.42);
  g.moveTo(c + 0.2, 0);
  g.lineTo(c - 0.2, -0.42);
}
g.stroke();
g.fillStyle = '#7c7a5a';
g.beginPath();
g.moveTo(-0.85, -0.42);
g.quadraticCurveTo(0, -0.33, 0.85, -0.42);
g.lineTo(0.85, -0.45);
g.lineTo(-0.85, -0.45);
g.closePath();
g.fill();
g.fillStyle = '#6a6c72';
g.beginPath();
g.moveTo(-0.85, -0.46);
g.lineTo(0.35, -0.46);
g.lineTo(0.33, -0.3);
g.quadraticCurveTo(-0.25, -0.26, -0.85, -0.3);
g.closePath();
g.fill();
g.fillStyle = '#8c8e94';
g.fillRect(-0.85, -0.38, 1.2, 0.02);
e.at(0, -0.46);
