// The curtain of the window upstairs (thin: the room's lamp behind it lights it through): drawn (`curtain` 1) or open;
// on it the shadows of two at a table under the lamp (`shadows`) — a painted silhouette, not people, stirring a little
e.layer('cloth', {}, gc => {
  gc.fillStyle = '#efe3c9';
  gc.fillRect(-0.4, -1.6, 0.8, 1.6);
  gc.fillStyle = 'rgba(150,120,80,0.18)';
  for (let x = -0.36; x < 0.4; x += 0.09) gc.fillRect(x, -1.6, 0.03, 1.6);
});
e.layer('shadows', { blend: 'multiply' }, gs => {
  gs.fillStyle = 'rgba(90,70,50,0.55)';
  // the lamp's shade over the table, the table's edge
  gs.beginPath();
  gs.moveTo(-0.08, -1.12);
  gs.lineTo(0.08, -1.12);
  gs.lineTo(0.13, -1.0);
  gs.lineTo(-0.13, -1.0);
  gs.closePath();
  gs.fill();
  gs.fillRect(-0.3, -0.42, 0.6, 0.05);
  // two at the table, a head and shoulders each, turned to each other
  const one = (x, s) => {
    gs.beginPath();
    gs.ellipse(x, -0.86, 0.07, 0.085, 0, 0, Math.PI * 2);
    gs.fill();
    gs.beginPath();
    gs.moveTo(x - 0.15 * s, -0.42);
    gs.quadraticCurveTo(x - 0.15 * s, -0.74, x, -0.76);
    gs.quadraticCurveTo(x + 0.14 * s, -0.74, x + 0.14 * s, -0.42);
    gs.closePath();
    gs.fill();
  };
  one(-0.22, 1);
  one(0.23, -1);
});
