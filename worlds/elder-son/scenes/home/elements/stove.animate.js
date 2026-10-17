// the fire door swings open (seen as it narrows toward its hinge); the fire's glow with it
const k = e.state.stove_door;
e.layer('door').scaleX = 1 - 0.85 * k;
e.glow('fire', k);
