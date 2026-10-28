// The house's own film, outside games: every beat of lib.js film in its order (ORDER), each cut made ready ahead
// (the world's module beats) — and, between them, what a game's keys do here: the scrap taken under her fingers
// (scrap_taken, after scrap), the yacht rigged under her fingers, his hand steadying it (rig1…rig4, `guide`, after rig),
// her eyes and the camera rising from the page to the window and sinking back (`gaze`, after look), the shelves
// emptying toy by toy (`toys`). The morning shown is the one where the girl has had the yacht (`girl_toy` 1, set before
// the morning's first cut is made ready): she runs in with it, and the board over the window is empty.
const L = scene.lib;
const own = {
  scrap: { name: "taking", run: async (s) => { await s.move("scrap_taken", 1, { over: 1.2 }); await s.wait(0.8); } },
  rig: { name: "rigging", run: async (s) => {
    await s.move("rig1", 1, { over: 1.8 });
    s.move("guide", 1, { over: 0.6 });
    await s.move("rig2", 1, { over: 1.3 });
    await s.move("rig3", 1, { over: 1.8 });
    s.move("guide", 0, { over: 0.6 });
    await s.move("rig4", 1, { over: 1.3 });
    await s.wait(1);
  } },
  look: { name: "gaze", run: async (s) => { await s.move("gaze", 1, { over: 3.4, ease: "linear" }); await s.wait(1); await s.move("gaze", 0, { over: 2, ease: "linear" }); await s.wait(0.6); } },
  decide: { name: "toys", run: async (s) => { s.set("girl_toy", 1); await s.move("toys", 1, { over: 3, ease: "linear" }); await s.wait(0.6); await s.move("toys", 0.5, { over: 1.5, ease: "linear" }); } },
};
return scene.kit.beats.showcase(scene, L.film(scene), L.ORDER).flatMap((beat) => (own[beat.name] ? [beat, own[beat.name]] : [beat]));
