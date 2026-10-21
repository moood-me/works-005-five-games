// On the Tankadere's deck (Hong Kong only): a bucket and a coil of rope by her mast — and where her people stand as
// she puts out: Bunsby at the tiller (tankadere_crew#helm), Fogg, Aouda, Fix.
if (e.lib.portOf(e.state) === 'hongkong') {
  g.fillStyle = '#6a5038';
  g.fillRect(1.2, -0.34, 0.26, 0.34);
  g.strokeStyle = '#8a7a5a';
  g.lineWidth = 0.05;
  g.beginPath();
  g.ellipse(-1.6, -0.08, 0.3, 0.06, 0, 0, Math.PI * 2);
  g.stroke();
  e.at(-7.6, 0, 'helm');
  e.at(-4.4, 0, 'fogg');
  e.at(-3.4, 0, 'aouda');
  e.at(-0.6, 0, 'fix');
}
