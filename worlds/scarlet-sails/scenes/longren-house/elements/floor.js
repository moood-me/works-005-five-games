// The floor, seen from above (x across, y toward the eye; centre 0.7 m right, 1.9 m ahead): wide
// boards running to the window. The lights of the room lie on it (`lit`): the window's, the lamp's.
g.fillStyle = "#aeaaa2";
g.fillRect(-2.3, -3.1, 4.6, 6.2);
g.fillStyle = "rgba(20,20,24,0.28)";
for (let x = -2.3; x < 2.3; x += 0.22) g.fillRect(x, -3.1, 0.012, 6.2);
