// The freight: a diesel locomotive (nose at x = 0, headlight) and twenty cars — tank cars, boxcars, flat cars with
// logs — dark against the snow, running to the right along the track. 4 m high, ~270 m long.
const CAR = 13, X0 = 18.5;
const wheels = (x0, w) => {
  g.fillStyle = '#101116';
  for (const dx of [1.3, 2.4, w - 2.4, w - 1.3]) { g.beginPath(); g.arc(x0 + dx, -0.38, 0.38, 0, 6.283); g.fill(); }
};
// locomotive
g.fillStyle = '#2b2f3a';
g.beginPath(); g.moveTo(0, -0.7); g.lineTo(0, -2.9); g.lineTo(0.8, -3.5); g.lineTo(10.5, -3.5); g.lineTo(10.5, -4.3);
g.lineTo(17.5, -4.3); g.lineTo(17.5, -0.7); g.closePath(); g.fill();
g.fillStyle = '#4a5166';
g.fillRect(0.8, -3.5, 9.7, 0.16);
g.fillStyle = '#8a2f2a';
g.fillRect(0, -1.2, 17.5, 0.35);
g.fillStyle = '#1b1d24';
g.fillRect(0, -0.9, 17.5, 0.5);
g.fillStyle = '#d89a4a';
g.fillRect(12, -3.9, 0.9, 0.5);
g.fillRect(14.3, -3.9, 0.9, 0.5);
g.fillStyle = '#fffbe8';
g.beginPath(); g.arc(0.35, -2.55, 0.28, 0, 6.283); g.fill();
wheels(0, 17.5);
for (const x of [5, 8]) { g.fillStyle = '#101116'; g.beginPath(); g.arc(x, -0.38, 0.38, 0, 6.283); g.fill(); }
e.light(0.35, -2.55, 0.9, '#fff0d0', 2.0, 'head');
e.light(0.35, -2.55, 14, '#fff0d0', 1.6, 'far');
e.light(13.5, -3.5, 0.5, '#e8963a', 0.5, 'cab');
e.at(0.35, -2.55, 'light');
// cars
for (let i = 0; i < 20; i++) {
  const x = X0 + i * CAR, kind = (i * 7 + 3) % 4;
  g.fillStyle = '#16171d';
  g.fillRect(x - 0.6, -0.95, CAR - 0.1, 0.25); // the frame
  if (kind === 0) { // tank car
    g.fillStyle = '#262a34';
    g.beginPath(); g.ellipse(x + 5.7, -2.15, 5.7, 1.45, 0, 0, 6.283); g.fill();
    g.fillStyle = '#3d4458'; g.fillRect(x + 1, -3.45, 9.4, 0.14);
    g.fillStyle = '#1c1f27'; g.fillRect(x + 5.2, -3.85, 1, 0.5);
  } else if (kind === 1 || kind === 3) { // boxcar
    g.fillStyle = kind === 1 ? '#40272a' : '#2a3530';
    g.fillRect(x, -3.4, 11.4, 2.45);
    g.fillStyle = 'rgba(0,0,0,0.35)';
    g.fillRect(x + 4.6, -3.3, 2.2, 2.3);
    g.strokeStyle = 'rgba(0,0,0,0.4)'; g.lineWidth = 0.06;
    for (let k = 1; k < 11; k++) { g.beginPath(); g.moveTo(x + k, -3.4); g.lineTo(x + k, -0.95); g.stroke(); }
    g.fillStyle = '#4f5568'; g.fillRect(x, -3.4, 11.4, 0.12);
  } else { // flat car with logs
    g.fillStyle = '#1f2128';
    g.fillRect(x, -1.5, 11.4, 0.55);
    g.fillStyle = '#4a3a2c';
    for (let k = 0; k < 4; k++) g.fillRect(x + 0.4, -2.8 + k * 0.35 + 0.0, 10.6, 0.33);
    g.fillStyle = '#d8e0f0'; g.fillRect(x + 0.3, -2.95, 10.8, 0.2);
  }
  wheels(x - 0.6, CAR - 0.1);
}
