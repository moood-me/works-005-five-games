// The club's steps from above (the land rises under them: relief.js): three wide treads up from the road to the portico
const season = e.lib.seasonOf(e.state.season);
g.fillStyle = season === 'thaw' ? '#7a7670' : '#dde1e7';
g.fillRect(-0.7, -1.7, 1.4, 3.4);
g.fillStyle = season === 'thaw' ? 'rgba(40,38,36,0.45)' : 'rgba(120,128,140,0.4)';
for (let k = 1; k <= 3; k++) g.fillRect(0.7 - k * 0.233 - 0.02, -1.7, 0.04, 3.4);
