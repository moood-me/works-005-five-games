// The passage beyond the front door: dark boards, a coat on a nail, a bucket — seen only when the door is open.
g.fillStyle = '#34302f';
g.fillRect(-1.45, -2.4, 2.9, 2.42);
g.strokeStyle = 'rgba(80,70,64,0.5)';
g.lineWidth = 0.02;
for (let x = -1.4; x < 1.45; x += 0.18) {
  g.beginPath();
  g.moveTo(x, -2.4);
  g.lineTo(x, 0);
  g.stroke();
}
g.fillStyle = '#4a4440';
g.fillRect(0.5, -1.7, 0.3, 0.9);
g.fillStyle = '#8b8a86';
g.fillRect(-1.0, -0.4, 0.3, 0.4);
