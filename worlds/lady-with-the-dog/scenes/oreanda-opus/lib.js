// Ореанда: the numbers the paintings and the script share.
const clamp01 = v => Math.max(0, Math.min(1, Number(v) || 0));
const SEAT_D = 3.6;       // the bench's seat: its middle, metres ahead of the start
const SEAT_E = 0.43;      // its height over the land
// where the cliff top ends: straight across before them, then a promontory runs out to the right (the church on it)
const edge = across => 8 + 14 * anim.span(across, 2.2, 7.5);
// the steamer from Feodosia: far out on the left before dawn, nearer under the coast as it grows light
const steamerAt = dawn => {
  const u = anim.ease.inOut(clamp01(dawn));
  return [anim.mix(-520, -250, u), anim.mix(1500, 650, u)];
};
return {
  clamp01, SEAT_D, SEAT_E, edge, steamerAt,
  ANNA_SEAT: [-0.33, SEAT_D, SEAT_E],
  GUROV_SEAT: [0.34, SEAT_D, SEAT_E],
  ANNA_STAND: [-0.33, SEAT_D + 0.3],
  GUROV_STAND: [0.36, SEAT_D + 0.3],
  HAND_SPOT: [-0.04, SEAT_D - 0.06, SEAT_E + 0.03],   // her right hand lies on the seat between them
  SPITZ: [-1.3, SEAT_D + 0.35],                         // lying at her feet, to her left, clear of the bench
  WATCH_FROM: [5.6, 13.6],                              // out from behind the near cypress
  WATCH_STOP: [2.8, 9.0],                               // on the path by the cliff's edge, to Gurov's right
  WATCH_OFF: [[4.6, 11.8], [6.7, 14.9]],               // back behind the cypress
};
