// The quay's paving seen from above (x away from the ship, y back toward her stern): pale stone setts; the lamps'
// light lies on it (`lit`)
g.fillStyle = "#bbb6ac";
g.fillRect(-16, -70, 32, 140);
g.fillStyle = "rgba(60,56,50,0.12)";
for (let x = -16; x < 16; x += 1.6) g.fillRect(x, -70, 0.05, 140);
