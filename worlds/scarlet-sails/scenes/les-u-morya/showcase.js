// «Лес у моря»'s own little film, outside games: first the wood by day — down the stream from pool to pool to its
// mouth —; then the hours at the mouth: the day going down to dusk and night, the fire lit on the cliff above; then
// the film (lib.js film, in SHOWCASE's order): chapter I — the yacht put on the stream, the chase after it (what a
// game's «За корабликом» drives, played here by itself after `chase`), Egl at the mouth and both his answers —, and
// chapter III: the night fire, dawn in the mist, the sleeping girl, the ring, the morning — and both ways it ends.
const L = scene.lib;
const stream = {
  name: "stream",
  run: async (s) => {
    s.cut(L.DAY());
    await s.wait(2.5);
    await s.path(["camera_x", "camera_z"], [[0, 0], [-0.5, 5], [-1, 16], [-2, 27]], { speed: 1.3, ease: "inOut" });
    await s.wait(2);
  },
};
const hours = {
  name: "hours",
  run: async (s) => {
    await s.move("hour", 0.76, { over: 9, ease: "inOut" });
    await s.wait(2);
    s.move("fire", 1, { over: 4 });
    await s.move("hour", 0.95, { over: 7, ease: "inOut" });
    await s.wait(3);
    await s.move("fade", 1, { over: 1.2, ease: "in" });
  },
};
// the yacht goes down the stream and she after it, as far as she may. The first snag she runs over — a tap in time
// (jump) as she comes to it; halfway down the yacht is caught in the reeds a moment; at the second she is stopped,
// then let go and led on again: she runs on over it
const chase = {
  name: "za_korablikom",
  run: async (s) => {
    const at = (u) => s.until(() => s.get("run_at") >= u - 0.004);
    s.set("run", 1);
    const first = s.move("toy", 0.55, { over: 13, ease: "linear" });
    await at(L.STOPS[0] - L.WINDOW / 2);
    s.set("jump", 1);
    await s.wait(0.3);
    s.set("jump", 0);
    await first;
    s.set("reeds", 1);
    await s.wait(1.5);
    s.set("reeds", 0);
    const rest = s.move("toy", 1, { over: 11, ease: "linear" });
    await at(L.STOPS[1]);
    await s.wait(1.5);
    s.set("run", s.get("run_at"));
    await s.wait(0.2);
    s.set("run", 1);
    await s.all(rest, at(1));
  },
};
return [stream, hours, ...scene.kit.beats.showcase(scene, L.film(scene), L.SHOWCASE).flatMap((beat) => (beat.name === "chase" ? [beat, chase] : [beat]))];
