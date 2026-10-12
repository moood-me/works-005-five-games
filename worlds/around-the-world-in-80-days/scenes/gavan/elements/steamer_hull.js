// The steamer's side toward us (her starboard; her bow to the right), where it runs straight: Hong Kong's "Carnatic" —
// black, a buff riband under her rail, a red line at the water, a row of ports; Yokohama's "General Grant" — black under
// white, her paddle box standing out amidships. Her rail rises to bow and stern (lib.sheer). Her ports warm and her side
// light — a layer and glows its animate lights as the lanterns are; the gangway to the jetty (a layer) while she lies
// alongside.
const L = e.lib;
const S = L.plan.steamer;
const yoko = L.portOf(e.state) === 'yokohama';
const top = x => -L.sheer(x);
g.fillStyle = '#1e2024';
g.beginPath();
g.moveTo(-30, 0.4);
for (let x = -30; x <= 30; x += 2) g.lineTo(x, top(x));
g.lineTo(30, 0.4);
g.closePath();
g.fill();
g.fillStyle = '#8a3428';
g.fillRect(-30, -0.5, 60, 0.6);
g.strokeStyle = yoko ? '#e4e0d6' : '#b8a888';
g.lineWidth = 0.3;
g.beginPath();
for (let x = -30; x <= 30; x += 2) g.lineTo(x, top(x) + 0.35);
g.stroke();
// the ports: dark glass, and lit (a layer)
const ports = [];
for (let x = -26; x <= 26; x += 2.4) if (!(yoko && Math.abs(x) < 6)) ports.push(x);
const port = (g, color) => {
  g.fillStyle = color;
  for (const x of ports) {
    g.beginPath();
    g.arc(x, -S.deck + 1.1, 0.17, 0, Math.PI * 2);
    g.fill();
  }
};
port(g, '#3a3c40');
e.layer('lit', {}, g => {
  port(g, '#ffd896');
  for (let x = -24; x <= 24; x += 7.2) e.light(x, -S.deck + 1.1, 0.5, '#ffd08a', 0.5, 'ports');
});
if (yoko) {
  // the paddle box: a half wheel's housing, fanned
  g.fillStyle = '#e4e0d6';
  g.beginPath();
  g.arc(0, -0.8, 5.6, Math.PI, 0);
  g.closePath();
  g.fill();
  g.strokeStyle = 'rgba(40,40,40,0.35)';
  g.lineWidth = 0.08;
  for (let k = 1; k < 8; k++) {
    const a = Math.PI + (Math.PI * k) / 8;
    g.beginPath();
    g.moveTo(0, -0.8);
    g.lineTo(Math.cos(a) * 5.6, -0.8 + Math.sin(a) * 5.6);
    g.stroke();
  }
}
// her starboard light, green, by the bridge
L.lantern(e, g, 8, top(8) - 0.6, 0.2, '#6aff9a', 'side');
// the gangway from the jetty up to her rail, while she lies alongside
e.layer('gangway', {}, g => {
  g.strokeStyle = '#6a5a48';
  g.lineWidth = 0.18;
  g.beginPath();
  g.moveTo(14, -1.7);
  g.lineTo(19, top(19));
  g.stroke();
  g.lineWidth = 0.04;
  g.beginPath();
  g.moveTo(14, -2.7);
  g.lineTo(19, top(19) - 1);
  g.stroke();
  e.at(14, -1.7, 'gangway');
});
e.at(0, top(0) - 2);
