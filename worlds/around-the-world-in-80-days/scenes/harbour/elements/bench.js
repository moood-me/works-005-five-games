// Yokohama only: the front row's bench on the landing before Batulcar's stage — where Fogg sits down (and Aouda).
if (e.lib.portOf(e.state) === 'yokohama') {
  g.fillStyle = '#5a4632';
  g.fillRect(-1.6, -0.48, 3.2, 0.07);
  for (const x of [-1.4, 1.3]) g.fillRect(x, -0.44, 0.08, 0.44);
}
