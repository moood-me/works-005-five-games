// Shared by the scene's paintings and its script: where the track runs and where the freight's front is at `freight`.
// The near track is a straight line (a, d) = (-9 + 0.91 s, 10 + 0.41 s), s in metres along it; far off it bends away
// into the depth to the forest, ending in the arc where the headlight first shows (78, 200).
const TRACK = [[-63.6, -14.6], [45.6, 34.6], [50, 43], [62, 70], [72, 120], [78, 200], [80, 240]];
const ROAD = [[-4.9, -3], [-3.7, 4], [-2.4, 11], [-1.8, 14], [3, 24], [14, 50], [30, 95], [45, 150]];
const FAR = [[0, 80, 240], [0.04, 78, 200], [0.07, 72, 120], [0.09, 62, 70], [0.1, 45.6, 34.6]];
const FACING = 155.7; // the freight card's +x runs along the near track (away from the start, to the right)
// where the freight's nose is at the key `freight` (0 — not there; 0.04 — the headlight on the arc; 0.1…1 passing)
function loco(f) {
  if (!(f > 0)) return { a: 90, d: 400 };
  if (f <= 0.1) {
    for (let i = 1; i < FAR.length; i++) if (f <= FAR[i][0]) {
      const u = (f - FAR[i - 1][0]) / (FAR[i][0] - FAR[i - 1][0]);
      return { a: FAR[i - 1][1] + (FAR[i][1] - FAR[i - 1][1]) * u, d: FAR[i - 1][2] + (FAR[i][2] - FAR[i - 1][2]) * u };
    }
  }
  // 0.1 … 0.9 the train passes (the tail is still in sight at 0.9); 0.9 … 1 its tail goes out of the frame on the left
  const ff = Math.min(f, 1), s = ff <= 0.9 ? 60 - (ff - 0.1) / 0.8 * 300 : -240 - (ff - 0.9) / 0.1 * 90;
  return { a: -9 + 0.91 * s, d: 10 + 0.41 * s };
}
return { TRACK, ROAD, FACING, loco };
