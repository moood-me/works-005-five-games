
// the last carriage's west end, seen as the train goes: the gangway door, the buffers, a red tail lamp
g.fillStyle = '#3a4434'; g.fillRect(-1.4, -3.3, 2.8, 2.9);
g.fillStyle = '#2a2a2c'; g.beginPath(); g.moveTo(-1.4, -3.3); g.quadraticCurveTo(0, -3.75, 1.4, -3.3); g.fill();
g.fillStyle = '#23262a'; g.fillRect(-0.4, -2.6, 0.8, 2.2);
g.fillStyle = '#18181a'; g.fillRect(-1.4, -0.4, 2.8, 0.4); g.fillRect(-1.2, -0.7, 0.3, 0.3); g.fillRect(0.9, -0.7, 0.3, 0.3);
g.fillStyle = '#c03a2a'; g.beginPath(); g.arc(0.9, -1.0, 0.07, 0, Math.PI * 2); g.fill();
e.light(0.9, -1.0, 0.1, '#ff6a4a', 0.7, 'tail');
