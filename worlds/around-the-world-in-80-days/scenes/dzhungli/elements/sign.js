// The station's board on two posts: KHOLBY, where the line ends — or, in the morning after, ALLAHABAD
// (`station`).
const name = e.state.station === 'allahabad' ? 'ALLAHABAD' : 'KHOLBY';
g.fillStyle = '#3a3026';
g.fillRect(-1.05, -2.3, 0.1, 2.3);
g.fillRect(0.95, -2.3, 0.1, 2.3);
g.fillStyle = '#e8e2d2';
g.fillRect(-1.25, -2.45, 2.5, 0.6);
g.strokeStyle = '#3a3026';
g.lineWidth = 0.04;
g.strokeRect(-1.25, -2.45, 2.5, 0.6);
g.fillStyle = '#1c1a18';
g.font = '600 0.3px sans-serif';
g.textAlign = 'center';
g.textBaseline = 'middle';
g.fillText(name, 0, -2.15, 2.2);
e.at(0, -2.15, 'station');
