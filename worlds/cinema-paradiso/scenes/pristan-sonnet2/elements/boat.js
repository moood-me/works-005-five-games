// a boat with two viewers and a lamp
e.layer('boat', { box: [-2.4, -2.2, 2.4, 0.6] }, b => {
  b.fillStyle = '#4a3a2e'; b.beginPath(); b.moveTo(-2.1, -0.55); b.quadraticCurveTo(-1.5, 0.05, 0, 0.05); b.quadraticCurveTo(1.5, 0.05, 2.1, -0.55); b.closePath(); b.fill();
  b.fillStyle = '#2e2520'; b.fillRect(-2.1, -0.6, 4.2, 0.1);
  b.fillStyle = '#1d2236'; b.beginPath(); b.arc(-0.5, -1.3, 0.17, 0, 7); b.fill(); b.fillRect(-0.8, -1.12, 0.6, 0.55);
  b.fillStyle = '#272c42'; b.beginPath(); b.arc(0.5, -1.2, 0.16, 0, 7); b.fill(); b.fillRect(0.2, -1.04, 0.6, 0.5);
  b.fillStyle = '#d7b27a'; b.beginPath(); b.arc(1.7, -1.0, 0.05, 0, 7); b.fill();
});
e.light(1.7, -1.0, 0.6, '#ffcf8a', 0.5, 'lamp');
