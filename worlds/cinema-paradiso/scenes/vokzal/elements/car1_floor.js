// Car 1's floor (seen through its windows and door): worn boards. In the train's frame (laid out as if it faced the
// start): x runs south (across), y west. It marks the spot behind Toto's window where he stands once aboard.
const G = e.lib.G;
g.fillStyle = '#4a3a2c'; g.fillRect(-1.1, -7.1, 2.2, 14.2);
g.strokeStyle = '#3a2c20'; g.lineWidth = 0.02; for (let x = -1.1; x < 1.1; x += 0.12) { g.beginPath(); g.moveTo(x, -7.1); g.lineTo(x, 7.1); g.stroke(); }
const mid = (G.CAR1[0] + G.CAR1[1]) / 2;
e.at(0.55, -(G.WIN1 - mid), 'win');
