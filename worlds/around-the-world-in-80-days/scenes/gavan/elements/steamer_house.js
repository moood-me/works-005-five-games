// The steamer's deckhouse amidships and her bridge over it, her boats on their davits: pale; its windows lit (a layer
// its animate shows as the lanterns are), its lamp lighting the jetty while she is alongside (the light steamer_deck).
const L = e.lib;
const yoko = L.portOf(e.state) === 'yokohama';
g.fillStyle = yoko ? '#e6e2d8' : '#c8b898';
g.fillRect(-14, -2.4, 26, 2.4);
g.fillRect(2, -3.4, 8, 1.0);
g.fillStyle = '#1e2024';
g.fillRect(1.6, -3.5, 8.8, 0.12);
const windows = (g, color) => {
  g.fillStyle = color;
  for (let x = -13; x < 11; x += 1.6) g.fillRect(x, -1.7, 0.7, 0.8);
};
windows(g, '#4a4a4a');
e.layer('lit', {}, g => windows(g, '#ffdca0'));
// the boats on their davits
for (const x of [-12, -6, 4]) {
  g.fillStyle = '#e8e4da';
  g.beginPath();
  g.moveTo(x - 2.2, -2.9);
  g.quadraticCurveTo(x, -2.3, x + 2.2, -2.9);
  g.lineTo(x + 2.4, -3.3);
  g.lineTo(x - 2.4, -3.3);
  g.closePath();
  g.fill();
  g.strokeStyle = '#2a2a2a';
  g.lineWidth = 0.06;
  for (const s of [-1.8, 1.8]) {
    g.beginPath();
    g.moveTo(x + s, -2.4);
    g.quadraticCurveTo(x + s * 1.1, -3.9, x + s * 0.8, -4.1);
    g.stroke();
  }
}
e.light(-2, -1.3, 0.8, '#ffd08a', 0.6, 'lamp');
