// The road from the fence's end out into the fields toward the station (from above): two ruts, the middle humped.
const season = e.state.season;
g.fillStyle = season === 'autumn' ? '#4a423a' : season === 'thaw' ? '#7e7c7a' : '#d6d8e0';
g.fillRect(-1.7, -56, 3.4, 112);
g.strokeStyle = season === 'autumn' ? 'rgba(26,22,18,0.6)' : 'rgba(140,146,162,0.6)'; g.lineWidth = 0.18;
for (const x of [-0.7, 0.7]) { g.beginPath(); g.moveTo(x, -56); g.lineTo(x, 56); g.stroke(); }
