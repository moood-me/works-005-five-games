// The train at the end of the rails, standing on the unfinished embankment, its side to the trail: one teak
// carriage with its raised roof and end platforms, the tender, the locomotive — tall chimney, brass dome —
// facing right, where the line stops (its front: train_front).
const wheels = (xs, r) => {
  g.fillStyle = '#1a1c1c';
  for (const x of xs) {
    g.beginPath();
    g.arc(x, -r, r, 0, Math.PI * 2);
    g.fill();
  }
};
const iron = '#2c3330';
const brass = '#9a8456';
// the carriage
g.fillStyle = '#5c4838';
g.fillRect(-12.6, -3.5, 13.6, 2.6);
g.fillStyle = '#4a3a2e';
g.fillRect(-12.6, -2.05, 13.6, 0.08);
g.beginPath();
g.moveTo(-12.9, -3.45);
g.quadraticCurveTo(-5.8, -3.95, 1.3, -3.45);
g.closePath();
g.fill();
g.fillRect(-10.5, -4.15, 9.4, 0.42);
g.fillStyle = '#20262a';
for (let x = -11.9; x < 0.4; x += 1.5) g.fillRect(x, -3.2, 0.75, 0.85);
for (let x = -10.2; x < -1.2; x += 0.9) g.fillRect(x, -4.05, 0.45, 0.22);
// its end platforms and their rails
g.strokeStyle = '#3a3230';
g.lineWidth = 0.05;
for (const x0 of [-13.4, 1.0]) {
  g.strokeRect(x0, -1.9, 0.8, 1.0);
  g.fillStyle = '#3a3230';
  g.fillRect(x0 - 0.1, -0.95, 1.0, 0.1);
}
g.fillStyle = '#26282a';
g.fillRect(-13.4, -0.9, 15.2, 0.3);
wheels([-11.3, -10.1, -1.5, -0.3], 0.42);
// the tender, coal heaped in it
g.fillStyle = iron;
g.fillRect(2.2, -2.9, 5.1, 2.1);
g.fillStyle = '#1c1e1e';
g.beginPath();
g.moveTo(2.3, -2.9);
g.quadraticCurveTo(4.8, -3.5, 7.2, -2.9);
g.closePath();
g.fill();
wheels([3.2, 4.7, 6.3], 0.45);
// the cab, its roof overhanging
g.fillStyle = iron;
g.fillRect(7.6, -3.8, 2.6, 3);
g.fillRect(7.4, -4.05, 3.1, 0.25);
g.fillStyle = '#1c2224';
g.fillRect(8.0, -3.45, 0.9, 0.9);
// the boiler and its brass bands, the smokebox
g.fillStyle = iron;
g.fillRect(10.2, -3.3, 6.0, 1.7);
g.fillStyle = '#242a28';
g.fillRect(15.6, -3.4, 1.4, 1.9);
g.fillStyle = brass;
for (const x of [11.2, 13.4, 15.4]) g.fillRect(x, -3.3, 0.08, 1.7);
// the dome, the chimney flaring at its top
g.beginPath();
g.ellipse(12.6, -3.3, 0.5, 0.45, 0, Math.PI, 0);
g.fill();
g.fillStyle = '#242a28';
g.beginPath();
g.moveTo(16.0, -3.4);
g.lineTo(16.1, -4.5);
g.lineTo(15.85, -5.0);
g.lineTo(16.95, -5.0);
g.lineTo(16.7, -4.5);
g.lineTo(16.8, -3.4);
g.closePath();
g.fill();
// the running board, the buffer beam, the pilot
g.fillStyle = '#1e2220';
g.fillRect(7.6, -1.6, 10.2, 0.1);
g.fillStyle = '#7a3428';
g.fillRect(17.0, -1.45, 0.35, 0.45);
g.fillStyle = '#1e2220';
g.beginPath();
g.moveTo(17.0, -1.0);
g.lineTo(17.9, -0.1);
g.lineTo(17.0, -0.1);
g.closePath();
g.fill();
wheels([9.0], 0.55);
wheels([10.9, 12.8], 0.85);
wheels([14.8, 16.1], 0.42);
g.strokeStyle = '#4a4c48';
g.lineWidth = 0.08;
g.beginPath();
g.moveTo(10.9, -0.7);
g.lineTo(12.8, -0.7);
g.stroke();
e.at(13, -3, 'train');
// the chimney's mouth, where its steam comes out (the particles `steam`)
e.at(16.4, -5.0, 'chimney');
