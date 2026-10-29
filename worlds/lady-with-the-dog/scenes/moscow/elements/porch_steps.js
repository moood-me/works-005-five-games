// The Gurovs' porch from above (the land rises under it: relief.js): four stone treads up from the pavement (x −0.83…0)
// and the porch's top; the snow trodden on them, or wet
const season = e.lib.seasonOf(e.state.season);
g.fillStyle = season === 'thaw' ? '#77736d' : '#d9dde3';
g.fillRect(-0.83, -1.1, 1.66, 2.2);
g.fillStyle = season === 'thaw' ? 'rgba(40,38,36,0.45)' : 'rgba(120,128,140,0.4)';
for (let k = 1; k <= 4; k++) g.fillRect(-0.83 + k * 0.2125 - 0.02, -1.1, 0.04, 2.2);
g.fillStyle = season === 'thaw' ? 'rgba(30,30,32,0.35)' : 'rgba(150,158,170,0.3)';
g.fillRect(-0.6, -0.5, 1.3, 1.0);
