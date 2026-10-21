// The lampshade's twisted cord up to the ceiling, its rose. Metres; from the shade's top (y 0) to the ceiling.
const top = e.area[1] + 0.02;
g.strokeStyle = '#3a2e25';
g.lineWidth = 0.01;
g.beginPath();
g.moveTo(0, 0.02);
g.lineTo(0, top);
g.stroke();
g.fillStyle = '#d8d0c0';
g.fillRect(-0.025, top, 0.05, 0.02);
