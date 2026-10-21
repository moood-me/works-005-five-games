// The «Tankadere»'s deck from above (its far edge the stem): pale planks along her, narrowing to the stem at the bow,
// the hold's hatch amidships; what is outside her shape is left unpainted.
const L = e.lib, B = L.plan.beam;
// her outline: straight sides to 3 m forward of her middle (y −2.75 here), closing to the stem (y −7.75)
const half = y => (y > -2.75 ? B : B * Math.sqrt(Math.max(0, (y + 7.75) / 5)));
g.fillStyle = L.C.deck;
g.beginPath();
g.moveTo(-B, 7.75);
for (let y = 7.75; y >= -7.75; y -= 0.25) g.lineTo(-half(y), y);
for (let y = -7.75; y <= 7.75; y += 0.25) g.lineTo(half(y), y);
g.closePath();
g.fill();
g.save();
g.clip();
g.fillStyle = L.shade(L.C.deck, 0.28);
for (let x = -B; x < B; x += 0.14) g.fillRect(x, -7.75, 0.015, 15.5);
g.restore();
// the hold's hatch
L.rect(g, -0.7, -1.6, 1.4, 1.4, L.shade(L.C.deck, 0.35));
L.rect(g, -0.6, -1.5, 1.2, 1.2, '#6a5a44');
