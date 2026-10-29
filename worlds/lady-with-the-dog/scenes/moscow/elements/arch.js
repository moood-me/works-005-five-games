// Through the neighbour's arch: the yard — trodden snow, a shed, a lit window across it
const season = e.lib.seasonOf(e.state.season);
g.fillStyle = '#7d756a';
g.fillRect(-1.6, -3.4, 3.2, 3.4);
g.fillStyle = season === 'thaw' ? '#5a5856' : '#d6dbe3';
g.fillRect(-1.6, -0.6, 3.2, 0.6);
g.fillStyle = '#5c5048';
g.fillRect(-1.2, -1.9, 1.3, 1.3);
g.fillStyle = '#e8c88e';
g.fillRect(0.5, -2.3, 0.5, 0.6);
