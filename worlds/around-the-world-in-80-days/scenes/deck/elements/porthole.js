// Insert: Captain Speedy at his cabin's porthole, close — the brass ring, the glass, behind it his big face: the peaked
// cap, the red beard, the mouth wide open, roaring, a fist against the glass (layer `speedy`: its animate shakes it as
// he bangs and roars). Painted in its own light, as the day is outside.
const L = e.lib, w = e.aspect, cx = w / 2, cy = 0.5;
// the cabin's side round the porthole: planks
L.rect(g, 0, 0, w, 1, '#93683f');
g.fillStyle = '#7a5434';
for (let y = 0.04; y < 1; y += 0.11) g.fillRect(0, y, w, 0.008);
// the glass and, behind it, the dark cabin
g.fillStyle = '#2a2420';
g.beginPath();
g.arc(cx, cy, 0.36, 0, Math.PI * 2);
g.fill();
e.layer('speedy', { pivot: [cx, cy + 0.3] }, g => {
  g.save();
  g.beginPath();
  g.arc(cx, cy, 0.36, 0, Math.PI * 2);
  g.clip();
  // shoulders, the pea jacket
  L.poly(g, [[cx - 0.4, 1], [cx - 0.3, 0.74], [cx + 0.3, 0.74], [cx + 0.4, 1]], '#2a3448');
  // the face
  g.fillStyle = '#d89a78';
  g.beginPath();
  g.ellipse(cx, cy + 0.02, 0.17, 0.2, 0, 0, Math.PI * 2);
  g.fill();
  // the red beard round the open mouth
  g.fillStyle = '#b4502a';
  g.beginPath();
  g.moveTo(cx - 0.17, cy - 0.02);
  g.quadraticCurveTo(cx - 0.2, cy + 0.26, cx, cy + 0.3);
  g.quadraticCurveTo(cx + 0.2, cy + 0.26, cx + 0.17, cy - 0.02);
  g.quadraticCurveTo(cx + 0.1, cy + 0.06, cx, cy + 0.05);
  g.quadraticCurveTo(cx - 0.1, cy + 0.06, cx - 0.17, cy - 0.02);
  g.fill();
  // the mouth, roaring
  g.fillStyle = '#4a1a14';
  g.beginPath();
  g.ellipse(cx, cy + 0.12, 0.06, 0.065, 0, 0, Math.PI * 2);
  g.fill();
  L.rect(g, cx - 0.04, cy + 0.065, 0.08, 0.015, '#f2ece0');
  // the nose, the eyes glaring, the brows down
  g.fillStyle = '#c47a5a';
  g.beginPath();
  g.ellipse(cx, cy - 0.01, 0.03, 0.045, 0, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = '#f4f0e8';
  for (const s of [-1, 1]) { g.beginPath(); g.ellipse(cx + s * 0.07, cy - 0.06, 0.028, 0.02, 0, 0, Math.PI * 2); g.fill(); }
  g.fillStyle = '#1e1a18';
  for (const s of [-1, 1]) { g.beginPath(); g.arc(cx + s * 0.07, cy - 0.06, 0.012, 0, Math.PI * 2); g.fill(); }
  for (const s of [-1, 1]) L.poly(g, [[cx + s * 0.03, cy - 0.08], [cx + s * 0.12, cy - 0.115], [cx + s * 0.12, cy - 0.095], [cx + s * 0.03, cy - 0.065]], '#8a3a1e');
  // the peaked cap
  L.poly(g, [[cx - 0.18, cy - 0.12], [cx - 0.16, cy - 0.24], [cx + 0.16, cy - 0.24], [cx + 0.18, cy - 0.12]], '#1e2230');
  L.poly(g, [[cx - 0.2, cy - 0.12], [cx + 0.2, cy - 0.12], [cx + 0.15, cy - 0.09], [cx - 0.15, cy - 0.09]], '#121418');
  L.rect(g, cx - 0.04, cy - 0.2, 0.08, 0.04, '#c8a050');
  // a fist against the glass
  g.fillStyle = '#d08e6c';
  g.beginPath();
  g.ellipse(cx + 0.24, cy + 0.2, 0.07, 0.06, -0.4, 0, Math.PI * 2);
  g.fill();
  g.restore();
});
// the glass's glint, the brass ring and its bolts
g.fillStyle = 'rgba(230,240,240,0.18)';
g.beginPath();
g.ellipse(cx - 0.15, cy - 0.17, 0.12, 0.05, -0.6, 0, Math.PI * 2);
g.fill();
g.strokeStyle = '#b08a48';
g.lineWidth = 0.07;
g.beginPath();
g.arc(cx, cy, 0.395, 0, Math.PI * 2);
g.stroke();
g.fillStyle = '#7a5a2a';
for (let k = 0; k < 8; k++) { const a = (k * Math.PI) / 4; g.beginPath(); g.arc(cx + Math.cos(a) * 0.395, cy + Math.sin(a) * 0.395, 0.012, 0, Math.PI * 2); g.fill(); }
e.at(cx, cy - 0.05, 'speedy');
