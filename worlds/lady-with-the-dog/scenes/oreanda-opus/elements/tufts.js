// A tuft of dry grass close before the eye — copies at the frame's lower corners, stirring.
const rnd = e.rnd;
e.layer('blades', { wind: { strength: 0.5, gust: 0.5, scale: 2 }, pivot: [0, 0] }, gt => {
  gt.lineCap = 'round';
  for (let i = 0; i < 46; i++) {
    const x = (rnd() - 0.5) * 0.5, l = 0.18 + rnd() * 0.38, b = (rnd() - 0.5) * 0.35;
    gt.strokeStyle = i % 4 ? '#c8bc92' : '#8f8a6c';
    gt.lineWidth = 0.008 + rnd() * 0.008;
    gt.beginPath(); gt.moveTo(x, 0); gt.quadraticCurveTo(x + b * 0.3, -l * 0.6, x + b, -l); gt.stroke();
  }
});
