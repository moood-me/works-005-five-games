// Lights: what the painting, its shader and the script share — in stage heights (y 0 the top, 1 the foot): where the
// sea begins, where the parapet's top is, where the moon stands; how far apart the chapters' points are.
const HORIZON = 0.34;           // the far shore and the sea's edge (the scene's "horizon")
const FOOT = 0.9;               // the parapet's top: the sea ends there
const SPACING = 5;              // m between the chapters' points c0…c7 along the quay (camera_x of chapter i: i·5)
const moonX = A => A * 0.2;     // the moon over the left of the bay; its road down the water under it
const MOON_Y = 0.1;
const SEASONS = ['summer', 'autumn', 'winter', 'thaw'];
const seasonOf = v => (SEASONS.includes(v) ? v : 'summer');
return { HORIZON, FOOT, SPACING, moonX, MOON_Y, SEASONS, seasonOf };
