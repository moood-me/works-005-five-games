// The stage's front toward the audience (Yokohama only): rough boards, and along its edge the footlights — a row of
// small lamps (lit: a layer its animate shows as the lanterns are) lighting the first row and the faces over it (the
// light ramp, stage_front#ramp).
const L = e.lib;
if (L.portOf(e.state) === 'yokohama') {
  const S = L.plan.stage;
  L.boards(g, -S.half, S.half, S.h, '#6e5a44');
  const bulbs = (g, color) => {
    for (let x = -S.half + 0.5; x < S.half; x += 1.0) {
      g.fillStyle = '#2a2420';
      g.fillRect(x - 0.12, -S.h - 0.12, 0.24, 0.12);
      g.fillStyle = color;
      g.beginPath();
      g.ellipse(x, -S.h - 0.2, 0.05, 0.09, 0, 0, Math.PI * 2);
      g.fill();
    }
  };
  bulbs(g, '#6a5a40');
  e.layer('lit', {}, g => bulbs(g, '#fff0c0'));
  e.light(0, -S.h - 0.2, 0.6, '#ffd890', 0.9, 'ramp');
  e.at(0, -S.h - 1.6);
}
