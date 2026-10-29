// The left side's windows lit from within (the low house, the baker's upstairs, the club): `windows` fades them. Its card
// runs along the left fronts (x = distance − 14)
const P = e.lib.PAINT;
e.layer('lit', {}, gl => {
  const one = (front, dx, share) => {
    for (const w of P.windowsOf(front)) {
      if (e.rnd() > share) continue;
      const ww = w.x1 - w.x0, hh = w.y1 - w.y0;
      gl.fillStyle = e.rnd() < 0.8 ? '#f7c98a' : '#e8e0c8';
      gl.fillRect(dx + w.x0 + 0.05, w.y0 + 0.05, ww - 0.1, hh - 0.1);
      gl.strokeStyle = 'rgba(60,50,40,0.6)';
      gl.lineWidth = 0.04;
      gl.beginPath();
      gl.moveTo(dx + w.x0 + ww / 2, w.y0);
      gl.lineTo(dx + w.x0 + ww / 2, w.y1);
      gl.moveTo(dx + w.x0, w.y0 + hh * 0.32);
      gl.lineTo(dx + w.x1, w.y0 + hh * 0.32);
      gl.stroke();
    }
  };
  one(P.FRONTS.low, -11.5, 0.5);
  one(P.FRONTS.shop, 0, 0.6);
  one(P.FRONTS.club, 10, 0.8);
});
