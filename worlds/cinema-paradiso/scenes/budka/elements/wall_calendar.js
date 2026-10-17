// The wall calendar of 1958 behind the door's leaf (scenes.md: hung only from chapter IV — month 'none': only the
// nail). 8 — open at August (Elena's pencil lines: layers by `written`); 9 — September, August turned up over the
// top (its edge with the pencil showing); 12 — December, the months before turned over the top; in 1988 dusty.
const m = e.state.month, ruin = e.state.era === 'ruin';
g.fillStyle = '#2a2420'; g.fillRect(-0.01, -0.79, 0.02, 0.03);
if (m === 'none' || m == null) { e.at(0, -0.35, 'page'); return; }
const NAME = { 8: 'AGOSTO', 9: 'SETTEMBRE', 12: 'DICEMBRE' }[m] ?? 'AGOSTO';
const PIC = { 8: ['#6a8ca0', '#c9b48a'], 9: ['#8a9a7a', '#b8a070'], 12: ['#8a96a8', '#e8e8e8'] }[m] ?? ['#6a8ca0', '#c9b48a'];
// the sheets turned over the top: their edges above the nail
const over = m === 12 ? 4 : m === 9 ? 1 : 0;
for (let k = 0; k < over; k++) { g.fillStyle = k % 2 ? '#cfc6ae' : '#d8cfb8'; g.fillRect(-0.22 + k * 0.004, -0.76 - k * 0.012, 0.44, 0.03); }
if (over && m === 9) { g.strokeStyle = 'rgba(50,46,48,0.8)'; g.lineWidth = 0.003; g.beginPath(); g.moveTo(-0.15, -0.75); for (let x = -0.15; x < 0.1; x += 0.012) g.lineTo(x + 0.006, -0.75 + Math.sin(x * 160) * 0.004); g.stroke(); }
g.fillStyle = ruin ? '#c4baa0' : '#d8cfb8'; g.fillRect(-0.22, -0.72, 0.44, 0.7);
g.fillStyle = PIC[0]; g.fillRect(-0.19, -0.69, 0.38, 0.22);
g.fillStyle = PIC[1]; g.beginPath(); g.moveTo(-0.19, -0.52); g.quadraticCurveTo(0, -0.58, 0.19, -0.5); g.lineTo(0.19, -0.47); g.lineTo(-0.19, -0.47); g.fill();
g.save(); g.scale(0.01, 0.01); g.fillStyle = '#7a2a22'; g.font = '700 3.5px serif'; g.textAlign = 'center'; g.fillText(NAME + ' 1958', 0, -42); g.restore();
g.strokeStyle = 'rgba(60,50,40,0.5)'; g.lineWidth = 0.002;
for (let r = 0; r < 6; r++) for (let c = 0; c < 7; c++) g.strokeRect(-0.19 + c * 0.054, -0.38 + r * 0.055, 0.054, 0.055);
if (m === 8) for (let k = 0; k < 4; k++) e.layer('line' + k, {}, l => {
  l.strokeStyle = 'rgba(50,46,48,0.85)'; l.lineWidth = 0.004;
  const y = -0.34 + k * 0.06; l.beginPath(); l.moveTo(-0.17, y);
  for (let x = -0.17; x < 0.15 - (k === 3 ? 0.12 : 0); x += 0.012) l.lineTo(x + 0.006, y + Math.sin(x * 180 + k) * 0.006);
  l.stroke();
});
if (ruin) { g.fillStyle = 'rgba(150,140,120,0.35)'; g.fillRect(-0.22, -0.72, 0.44, 0.7); }
e.at(0, -0.35, 'page');
