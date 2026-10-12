// India: the far bank of the Ganges — the ghats' long steps down to the water, temples with their curved spires, a palm
// grove; the river mirrors them (the engine's reflection). The lamps on the steps glow as the night is (its animate).
const L = e.lib, land = 'india', D = 330, h = e.anim.hash;
const C = L.colours(land), stone = L.mixc(C.distant, C.low, 0.3);
// palms behind
g.strokeStyle = L.rgba(C.distant);
g.fillStyle = L.rgba(C.distant);
g.lineWidth = 0.45;
g.lineCap = 'round';
L.along(land, 10, D, 41, (x, j) => {
  const t = 10 + 8 * h(j, 42);
  g.fillRect(x - 0.25, -t, 0.5, t);
  g.beginPath();
  for (let k = 0; k < 7; k++) {
    const a = Math.PI * (1.08 + (0.84 * k) / 6);
    g.moveTo(x, -t);
    g.quadraticCurveTo(x + Math.cos(a) * 2.2, -t + Math.sin(a) * 1.6, x + Math.cos(a) * 3.6, -t + Math.sin(a) * 1.2 + 1.2);
  }
  g.stroke();
}, 4);
L.along(land, 160, D, 43, (x, j) => {
  if (h(j, 44) < 0.25) return;
  const w = 40 + 50 * h(j, 45);
  // the ghat: steps from the water up to the buildings
  g.fillStyle = L.rgba(stone);
  for (let s = 0; s < 6; s++) g.fillRect(x - w / 2 + s * 1.2, -s * 0.9 - 0.9, w - s * 2.4, 0.9);
  // buildings on the ghat, and a temple's spire
  g.fillStyle = L.rgba(L.mixc(stone, C.distant, 0.3));
  g.fillRect(x - w / 2 + 6, -16, w - 12, 10.6);
  const tx = x + (h(j, 46) - 0.5) * w * 0.5, th = 22 + 14 * h(j, 47);
  g.beginPath();
  g.moveTo(tx - 6, -6);
  g.bezierCurveTo(tx - 6, -th * 0.6, tx - 2, -th * 0.95, tx, -th);
  g.bezierCurveTo(tx + 2, -th * 0.95, tx + 6, -th * 0.6, tx + 6, -6);
  g.closePath();
  g.fill();
  g.fillRect(tx - 0.3, -th - 3, 0.6, 3);
  // lamps on the steps
  for (let k = 0; k < 3; k++) e.light(x - w / 3 + k * (w / 3), -2.5, 2.5, L.css(C.lights), 0.4);
}, 50);
