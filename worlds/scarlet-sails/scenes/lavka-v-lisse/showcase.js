// The shop's own film, outside games: every beat of lib.js film in its order (ORDER), each cut made ready ahead (the
// world's module beats) — and, after `silk`, what the game's «Алый» does here: the rolls one after another, each carried
// to the window, till the scarlet one.
const L = scene.lib;
const own = {
  silk: {
    name: "alyi",
    run: async (s) => {
      for (const name of L.ROLL_NAMES) {
        s.set("roll_out", 0);
        s.set("roll", name);
        await s.wait(0.5);
        await s.move("roll_out", 1, { over: 1.2 });
        await s.wait(0.9);
        if (name === "scarlet") break;
      }
    },
  },
};
return scene.kit.beats.showcase(scene, L.film(scene), L.ORDER).flatMap((beat) => (own[beat.name] ? [beat, own[beat.name]] : [beat]));
