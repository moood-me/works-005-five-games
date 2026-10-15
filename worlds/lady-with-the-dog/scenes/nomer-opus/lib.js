// Номер в Ялте: the numbers the paintings and the script share. The room seen from the wall opposite the balcony:
// the back wall at distance 5.8 with the open balcony door (across 0.35…1.55), the bed along it on the left, the
// table with the candle on the right, his chair at its left side.
const clamp01 = v => Math.max(0, Math.min(1, Number(v) || 0));
const WALL_D = 5.8, HALF = 2.7, CEIL = 3.2;
const DOOR = { x0: 0.35, x1: 1.55, h: 2.5 };
const BED = { x0: -2.55, x1: -0.55, d0: 4.45, d1: 5.45, top: 0.5 };
const TABLE = { x: 1.75, d: 3.9, w: 0.9, depth: 0.7, top: 0.74 };
return {
  clamp01, WALL_D, HALF, CEIL, DOOR, BED, TABLE,
  ANNA_SEAT: [-1.75, 4.62, 0.5],
  GUROV_BED_SEAT: [-1.02, 4.62, 0.5],
  GUROV_BED_STAND: [-0.95, 4.25],             // where he stands by the bed to set the plate down
  CHAIR_SEAT: [0.95, 3.9, 0.46],
  GUROV_STAND: [1.25, 3.5],                   // at the table, his back to us
  PLATE_TABLE: [1.6, 3.82, 0.745],
  PLATE_BED: [-1.35, 4.8, 0.5],
  FLOOR_BEFORE_HER: [-1.25, 4.05, 0],
  // the shots: the whole room; the two on the bed, nearer; the table and the bed, nearer
  ROOM_CAM: { camera_x: 0, camera_z: 0 },
  BED_CAM: { camera_x: -0.9, camera_z: 1.6 },
  TABLE_CAM: { camera_x: 0.2, camera_z: 1.0 },
};
