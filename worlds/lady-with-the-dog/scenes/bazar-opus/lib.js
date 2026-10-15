// Славянский базар: the numbers the paintings and the script share. A room of a Moscow hotel seen from its open
// side: the back wall at distance 6 with the door on the left (across −2.1…−1.2), the gilt mirror between, the tall
// window on the right (across 0.6…2.2); the round table with the lamp in the middle, the armchair on the left.
const clamp01 = v => Math.max(0, Math.min(1, Number(v) || 0));
const WALL_D = 6.0, HALF = 2.7, CEIL = 3.4;
const DOOR = { x0: -2.1, x1: -1.2, h: 2.35 };
const WIN = { x0: 0.6, x1: 2.2, sill: 0.45, top: 3.0 };
const MIRROR = { x: -0.3, w: 0.8, y0: 0.95, y1: 2.35 };
// the door's leaf: `door` 0 shut … 1 open into the room (its facing, degrees)
const doorFacing = door => 180 + 82 * clamp01(door);
return {
  clamp01, WALL_D, HALF, CEIL, DOOR, WIN, MIRROR, doorFacing,
  TABLE: [-0.55, 4.1, 0.76],
  GLASS: [-0.2, 4.0, 0.84],                   // his glass of tea, on the table's right side
  CHAIR_SEAT: [0.12, 4.1, 0.46],              // his chair at the table's right, facing it (turn 270)
  ARMCHAIR: [-1.75, 3.55, 0.45],              // the armchair's seat (the spitz lies on it)
  OUTSIDE: [-1.65, 6.45],                     // in the corridor behind the door
  IN_DOOR: [-1.6, 5.35],                      // just inside the door
  ANNA_WINDOW: [1.45, 5.45],                  // at the window, her back to the room (turn 0)
  GUROV_BEHIND: [0.98, 5.08],                 // behind her and to her left, his hands on her shoulders
  GUROV_MEET: [-1.3, 5.15],                   // by the door, embracing: he faces right (90) …
  ANNA_MEET: [-0.82, 5.15],                   // … she left (270)
  GUROV_CLOSE: [0.92, 5.38],                  // at the window, face to face: he (90) …
  ANNA_CLOSE: [1.42, 5.38],                   // … she (270)
  WAITER_SET: [-0.45, 4.78],                  // the waiter behind the table, setting the samovar down (turn 180)
  ROOM_CAM: { camera_x: 0, camera_z: 0 },
};
