// the fire door swings open (seen as it narrows toward its hinge), the fire behind it shows
const k = e.state.stove_door;
e.layer('door').scaleX = 1 - 0.9 * k;
e.layer('flame').alpha = k;
