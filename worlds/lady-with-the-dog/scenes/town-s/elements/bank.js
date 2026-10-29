// The railway's bank far off across the fields (z 120): a low dark line with the telegraph poles along it.
const season = e.state.season;
g.fillStyle = season === 'autumn' ? '#4a443e' : '#9a9cae';
g.beginPath(); g.moveTo(-300, 0); g.lineTo(-300, -2.6); g.lineTo(300, -2.6); g.lineTo(300, 0); g.fill();
g.fillStyle = '#3a3a40'; g.fillRect(-300, -3.0, 600, 0.35);
for (let x = -295; x < 300; x += 40) g.fillRect(x, -9, 0.3, 6.4);
