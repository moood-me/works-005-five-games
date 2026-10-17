// The hall's floor, seen from above (x across, y toward the eye; centre 0.25 m right, 3.75 m ahead):
// dark polished oak in long boards — it mirrors the windows, the fire, the lamps (`reflect`); the
// light of the sun, the fire and the lamps lies on it (`lit`).
g.fillStyle = "#6b5a48";
g.fillRect(-4.25, -5.25, 8.5, 10.5);
g.fillStyle = "rgba(20,14,10,0.35)";
for (let x = -4.25; x < 4.25; x += 0.19) g.fillRect(x, -5.25, 0.006, 10.5);
for (let i = 0; i < 45; i++) {
  const x = -4.25 + 0.19 * Math.floor(e.anim.hash(i, 1) * 45);
  g.fillRect(x, -5.25 + e.anim.hash(i, 2) * 10.5, 0.19, 0.006);
}
