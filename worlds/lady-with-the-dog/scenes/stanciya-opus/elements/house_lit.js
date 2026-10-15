// The station house's lit panes: the windows and the door's fanlight, warm from the lamp inside.
g.fillStyle = '#f4c98a';
for (const x of [-2.4, 2.4]) {
  g.fillRect(x - 0.45, -2.62, 0.9, 1.45);
  g.fillStyle = '#d9a866'; g.fillRect(x - 0.45, -2.62, 0.9, 0.35); g.fillStyle = '#f4c98a';
}
g.fillRect(-0.62, -2.98, 1.24, 0.42);
g.strokeStyle = '#efe6d2'; g.lineWidth = 0.04;
for (const x of [-2.4, 2.4]) { g.beginPath(); g.moveTo(x, -2.62); g.lineTo(x, -1.17); g.moveTo(x - 0.45, -1.9); g.lineTo(x + 0.45, -1.9); g.stroke(); }
g.beginPath(); for (let i = 1; i < 4; i++) { g.moveTo(-0.62 + i * 0.31, -2.98); g.lineTo(-0.62 + i * 0.31, -2.56); } g.stroke();
