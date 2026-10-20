// Writes scenes/yard/scene.json: the map's background (elements/yard.js), the chapters' unseen points c0…c7 and the
// author's sign's (author).
//   node tools/yard/gen.mjs   (from the world's root)
import { writeFileSync } from 'node:fs';

const SPACING = 5, DIST = 10, EYE = 1.7, AT = 0.3; // the points: i·5 m along, 10 m away, at 0.3 of the frame's height
const elevation = Math.round((EYE + (0.5 - AT) * DIST - 0.05) * 100) / 100;
const point = (id, name, across) => ({ id, name, unseen: true, across, distance: DIST, elevation, height: 0.1, box: [-0.05, -0.1, 0.05, 0] });
const scene = {
  engine: 3,
  title: 'The Yard',
  caption: '',
  camera: { mode: 'panorama', span: [0, 7 * SPACING] },
  horizon: 0.5,
  light: { grain: 0.14, vignette: 0.45 },
  state: { shown: 0, come: 0, camera_x: 0 },
  states: {
    shown: { type: 'number', means: 'the chapter the player is at: the view goes to its point c<i> (camera_x)' },
    come: { type: 'number', means: 'each new value brings the view back to the chapter shown (camera_x), the player\'s drag with it' },
  },
  objects: [
    { id: 'yard', name: 'Station', sky: true },
    { id: 'snowfall', name: 'Snow', particles: { kind: 'snow', amount: 0.3, count: 4000, reach: 30 } },
    ...Array.from({ length: 8 }, (_, i) => point(`c${i}`, 'Chapter', i * SPACING)),
    point('author', 'The author\'s map', -3.2),
  ],
};
writeFileSync('scenes/yard/scene.json', `${JSON.stringify(scene, null, 2)}\n`);
