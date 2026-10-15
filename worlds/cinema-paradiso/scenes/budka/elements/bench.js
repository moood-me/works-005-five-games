// The workbench's front along the right wall (its x runs from the ports' end toward the door): dark planks, a drawer;
// a pencil lies at its near end (bench#pencil)
const ruin = e.state.era === 'ruin';
g.fillStyle = ruin ? '#4a4036' : '#4a3626'; g.fillRect(-0.5, -0.85, 1.0, 0.85);
g.fillStyle = '#3a2a1c'; g.fillRect(-0.5, -0.85, 1.0, 0.05); g.fillRect(-0.46, -0.8, 0.06, 0.8); g.fillRect(0.4, -0.8, 0.06, 0.8);
g.fillStyle = ruin ? '#524638' : '#5a4430'; g.fillRect(-0.28, -0.72, 0.56, 0.18);
g.fillStyle = '#b0a080'; g.fillRect(-0.03, -0.64, 0.06, 0.02);
e.at(0.38, -0.87, 'pencil');
