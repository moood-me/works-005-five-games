// The candle in a brass stick on the table (metres, origin at its foot). The wax and the flame are layers: animate
// lowers them as the candle burns down (`candle`); the flame's light is the scene's candle light.
g.fillStyle = '#9a7a40';
g.beginPath(); g.ellipse(0, -0.01, 0.07, 0.015, 0, 0, Math.PI * 2); g.fill();
g.fillRect(-0.018, -0.12, 0.036, 0.11);
g.beginPath(); g.ellipse(0, -0.12, 0.035, 0.01, 0, 0, Math.PI * 2); g.fill();
e.layer('wax', { pivot: [0, -0.12] }, gw => {
  gw.fillStyle = '#f2e9d2'; gw.fillRect(-0.014, -0.4, 0.028, 0.28);
  gw.fillStyle = 'rgba(255,255,255,0.4)'; gw.fillRect(-0.012, -0.4, 0.008, 0.28);
});
e.layer('flame', { box: [-0.08, -0.5, 0.08, -0.1], flicker: 0.3 }, gf => {
  gf.fillStyle = '#ffe2a0';
  gf.beginPath(); gf.moveTo(0, -0.445); gf.quadraticCurveTo(0.014, -0.415, 0, -0.4); gf.quadraticCurveTo(-0.014, -0.415, 0, -0.445); gf.fill();
  e.light(0, -0.42, 0.06, '#ffc070', 1.6, 'flame');
});
