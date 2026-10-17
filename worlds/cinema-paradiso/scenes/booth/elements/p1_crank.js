// the motor's crank on the inner side: an arm and a wooden handle turning about the boss
e.layer('arm', { pivot: [0, 0] }, c => {
  c.strokeStyle = '#2a2622'; c.lineWidth = 0.022; c.lineCap = 'round';
  c.beginPath(); c.moveTo(0, 0); c.lineTo(0, 0.12); c.stroke();
  c.fillStyle = e.state.era === 'ruin' ? '#4a3020' : '#6a3a24'; c.fillRect(-0.015, 0.1, 0.03, 0.05);
});
