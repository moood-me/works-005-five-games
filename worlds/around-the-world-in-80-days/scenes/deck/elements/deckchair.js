// Fogg's deck chair on the «General Grant»: a long wooden steamer chair, its canvas back sloping, the leg-rest, seen
// from before it. Nothing on the other ships.
const L = e.lib;
if (L.shipOf(e.state) === 'general_grant') {
  L.rect(g, -0.38, -0.42, 0.06, 0.42, '#7a5636');
  L.rect(g, 0.32, -0.42, 0.06, 0.42, '#7a5636');
  L.poly(g, [[-0.4, -0.44], [0.4, -0.44], [0.36, -1.0], [-0.36, -1.0]], '#7a5636');
  L.poly(g, [[-0.33, -0.48], [0.33, -0.48], [0.3, -0.95], [-0.3, -0.95]], '#d8ccae');
  g.fillStyle = 'rgba(140,60,50,0.55)';
  for (let x = -0.24; x < 0.3; x += 0.16) g.fillRect(x, -0.95, 0.06, 0.47);
  L.rect(g, -0.4, -0.46, 0.8, 0.06, '#6a4a2e');
}
