// The page a dry run of the game needs (check/run.mjs), with no browser and no engine behind it: of all that
// bespoke gives a game (moood/web/site/bespoke/play.js) only specOf answers — from the scene.json files of a clone
// of the world; the rest is there and does nothing.
//   scenes(world) → Map folder → {folder, spec} — every scene of the clone (world/scenes/<folder>/scene.json)
//   page(scenes, trouble) → b — trouble(text): what the game reports through b.trouble
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

export function scenes(world) {
  const all = new Map();
  for (const folder of readdirSync(join(world, 'scenes'))) {
    const file = join(world, 'scenes', folder, 'scene.json');
    if (!existsSync(file)) continue;
    const spec = JSON.parse(readFileSync(file, 'utf8'));
    all.set(folder, { folder, spec });
  }
  return all;
}

export function page(scenes, trouble) {
  const nothing = () => {}, done = async () => {};
  return {
    game: { mine: false }, layer: null, saved: null,
    specOf: async folder => {
      if (!scenes.has(folder)) throw new Error(`the world has no scene “${folder}”`);
      return scenes.get(folder).spec;
    },
    trouble,
    show: done, act: done, say: done, css: done, keep: done,
    get: nothing, set: nothing, on: nothing, hush: nothing, pause: nothing, restart: nothing,
    where: () => null, frame: () => null,
  };
}
