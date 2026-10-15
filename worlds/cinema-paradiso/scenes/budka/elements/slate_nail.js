// The slate the boy taught Alfredo his name on, hanging on the nail in the ruined booth (1988 only): «АЛЬФРЕДО» in
// faded chalk, each letter the player made crooked (`slate_letters`, the play's) leaning and askew
if (e.state.era !== 'ruin') return;
const s = String(e.state.slate_letters ?? '00000000').padEnd(8, '0'), L = 'АЛЬФРЕДО', an = e.anim;
g.strokeStyle = '#2a2420'; g.lineWidth = 0.004; g.beginPath(); g.moveTo(-0.1, -0.33); g.lineTo(0, -0.37); g.lineTo(0.1, -0.33); g.stroke();
g.fillStyle = '#6b4c32'; g.fillRect(-0.21, -0.33, 0.42, 0.3);
g.fillStyle = '#2c3030'; g.fillRect(-0.19, -0.31, 0.38, 0.26);
g.fillStyle = 'rgba(205,200,188,0.75)'; g.textAlign = 'center';
for (let i = 0; i < 8; i++) {
  const crooked = s[i] === '1', x = -0.16 + i * 0.046;
  g.save(); g.translate(x, -0.15 + (crooked ? (an.hash(i, 3) - 0.5) * 0.03 : 0)); g.rotate(crooked ? (an.hash(i, 4) - 0.5) * 0.9 : 0);
  g.scale(0.01, 0.01); g.font = '5.5px serif'; g.fillText(L[i], 0, 0); g.restore();
}
g.fillStyle = 'rgba(150,146,138,0.3)'; g.fillRect(-0.19, -0.31, 0.38, 0.26);
e.at(0, -0.18);
