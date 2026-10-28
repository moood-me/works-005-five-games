// Kaperna ahead, seen from the sea (metres, at the waterline; it lies where it is — 6 km off as the voyage begins): the
// hill rising from the left to Longren's house alone on its top, the village down its slope to the beach and the
// landing, the low cape on the right with its lighthouse. Pale, as the main scene's; the air between does the rest.
g.fillStyle = "#8e98a2";
g.beginPath();
g.moveTo(-620, 0);
g.lineTo(-620, -14);
g.bezierCurveTo(-450, -20, -300, -38, -150, -41);
g.bezierCurveTo(-60, -40, 0, -22, 60, -6);
g.lineTo(90, 0);
g.closePath();
g.fill();
g.fillStyle = "#9aa3ac";
g.beginPath();
g.moveTo(180, 0);
g.bezierCurveTo(240, -10, 360, -14, 470, -12);
g.lineTo(520, 0);
g.closePath();
g.fill();
g.fillStyle = "#c9cdd0";
g.fillRect(455, -30, 7, 18);
g.fillStyle = "#6f777f";
g.fillRect(453, -33, 11, 3);
g.fillStyle = "#d8d6cf";
const HOUSES = [[-160, -41, 12], [-110, -37, 9], [-80, -32, 10], [-55, -27, 8], [-30, -21, 11], [-5, -14, 9], [25, -8, 12], [-200, -38, 8], [-240, -34, 9]];
for (const [x, y, w] of HOUSES) {
  g.fillRect(x - w / 2, y - 6, w, 6.5);
  g.beginPath();
  g.moveTo(x - w / 2 - 0.5, y - 6);
  g.lineTo(x, y - 9.5);
  g.lineTo(x + w / 2 + 0.5, y - 6);
  g.fill();
}
e.at(-160, -45, "longren_house");
e.at(0, -20, "kaperna");
