// The sea chest's end, toward the room (x from its front back to the wall): the body, the lid's lip,
// the iron band at its edge, a rope handle (not painted when the chest is not in the house: `chest_here` 0)
if (!(e.state.chest_here > 0.5)) return;
g.fillStyle = "#4d4944";
g.fillRect(-0.16, -0.46, 0.32, 0.46);
g.fillStyle = "#5a554f";
g.fillRect(-0.17, -0.56, 0.34, 0.1);
g.fillStyle = "#282523";
g.fillRect(-0.16, -0.56, 0.03, 0.56);
g.strokeStyle = "#887d6e";
g.lineWidth = 0.022;
g.beginPath();
g.moveTo(-0.07, -0.32);
g.quadraticCurveTo(0, -0.22, 0.07, -0.32);
g.stroke();
