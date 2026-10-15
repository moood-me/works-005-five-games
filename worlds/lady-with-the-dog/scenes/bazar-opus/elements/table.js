// The round table's top from above (metres from its middle, y toward the viewer): a white cloth. On it, by the party
// and the game (each changes once, so the painting reads them): the husband's envelope by the samovar's place
// (husband_knows 0 — a pale rectangle written in the husband's hand), the tea stain by Gurov's glass (stain 1). Its point `glasses`
// — the two glasses (an offer in «Советоваться»).
const st = e.state;
g.fillStyle = '#ece6da'; g.beginPath(); g.arc(0, 0, 0.57, 0, Math.PI * 2); g.fill();
g.strokeStyle = 'rgba(170,160,140,0.5)'; g.lineWidth = 0.012; g.beginPath(); g.arc(0, 0, 0.5, 0, Math.PI * 2); g.stroke();
if (!(Number(st.husband_knows) > 0.5)) {
  // «Анне. На профессора» — the envelope lying askew in front of the samovar, the writing a few grey strokes
  g.save(); g.translate(0.22, 0.16); g.rotate(-0.25);
  g.fillStyle = 'rgba(60,50,40,0.35)'; g.fillRect(-0.125, -0.06, 0.26, 0.14);          // its shadow on the cloth
  g.fillStyle = '#dfe3ea'; g.fillRect(-0.135, -0.075, 0.26, 0.14);                      // cool white against the warm cloth
  g.strokeStyle = 'rgba(90,90,110,0.9)'; g.lineWidth = 0.008; g.strokeRect(-0.135, -0.075, 0.26, 0.14);
  g.fillStyle = '#6d6a78'; g.beginPath(); g.arc(0.085, 0.03, 0.018, 0, Math.PI * 2); g.fill();   // the seal
  g.strokeStyle = 'rgba(70,70,90,0.75)'; g.lineWidth = 0.007;
  for (const [x0, x1, y] of [[-0.07, 0.05, -0.012], [-0.05, 0.08, 0.018]]) {
    g.beginPath(); g.moveTo(x0, y);
    for (let x = x0; x <= x1; x += 0.012) g.lineTo(x, y + Math.sin(x * 260) * 0.004);
    g.stroke();
  }
  g.restore();
}
if (Number(st.stain) > 0.5) {
  // the tea he spilt: a brown blot spreading from the saucer's place toward the edge, by his hand
  g.fillStyle = 'rgba(120,72,30,0.55)';
  g.beginPath(); g.ellipse(0.37, 0.14, 0.09, 0.06, 0.4, 0, Math.PI * 2); g.fill();
  g.fillStyle = 'rgba(120,72,30,0.35)';
  g.beginPath(); g.ellipse(0.45, 0.2, 0.05, 0.035, 0.2, 0, Math.PI * 2); g.fill();
}
e.at(0.1, 0.05, 'glasses');
