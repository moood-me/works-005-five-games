// «Лес у моря» — its mechanics: the hour's light, the yacht on the stream and the chase after it, the ring, the film
// in beats for a game (lib.js film — the world's module beats: `beat` names one; notes.md tells them and the moments
// they tell).
const L = scene.lib;
const num = (key) => scene.get(key) ?? 0;

// The hour's light follows `hour` as it is set or moves: the weights of light.looks and how much the sun and the moon
// shine (the world's: nebo), and where this scene has them — the sea is ahead, east: they rise over it and go round by
// the right to behind the viewer; the lights "sun" and "moon" shine from there, the sky has them there
function hour() {
  const k = L.hourKeys(scene.get("hour") ?? 0.5);
  for (const key in k) scene.set(key, k[key]);
}
hour();
scene.on("change", "hour", hour);
scene.on("move", "hour", hour);

// The yacht on the stream stands where `toy` says (0 where it was put on the water … 1 the mouth; `toy_out`: from the
// brink out into the current) — at once when the key is set, along as it moves.
function toy() {
  const [across, distance, elevation] = L.toyAt(num("toy"), scene.get("toy_out") ?? 1);
  scene.set("toy_a", across);
  scene.set("toy_d", distance);
  scene.set("toy_e", elevation);
}
toy();
for (const key of ["toy", "toy_out"]) {
  scene.on("change", key, toy);
  scene.on("move", key, toy);
}

// «За корабликом» — what a game drives while the yacht is on the water and her gait is the run (from the beat
// `chase`). `run` — how far along the bank she may run: she runs there at her run's own pace, down her way (lib.js
// BANK); she does not set off for less than a couple of steps (L.NEAR), unless it is all that is left to a snag or
// the end. A snag she is not let over stops her: she pulls up short of it (the cast's `halt`; lib.js STOPS) and the
// scene tells chase:snag — let go and held again (`run` down to where she is, and up), she runs on over it. `jump`
// (1) — a tap in time: coming to a snag (within L.WINDOW of its stop) or standing at it, she is let over it and runs
// on past it without breaking her run, whatever `run` says. `run_at` — how far along she is — the scene sets as she
// goes.
const EPS = 0.004;
const chasing = () => scene.get("toy_water") === 1 && scene.get("assol_gait") === "run";
// (the snag she is let over, the one last spoken of — stopped at, or let over by a tap —, whether she has been let go
// since; where a tap carries her on to; where she runs to now and her way there)
let clear = -1;
let told = -1;
let letGo = false;
let over = null;
let to = null;
let walk = null;
const halt = (stop) => scene.person("assol").go("halt", { to: L.bankAt(stop), turn: L.bankTurn(stop) });
// her way from u to `at`; to a snag's stop — the run up to where she pulls up, then that; already nearer to the stop
// than `halt` itself travels (it would begin behind her), she only runs up to it
function way(u, at, stops) {
  if (scene.get("assol_do")?.motion === "halt") scene.set("assol_do", "stand");
  if (!stops) return scene.person("assol").walk(L.bankWay(u, at));
  const [x, z] = L.bankAt(u);
  const [X, Z] = L.bankAt(at);
  const off = scene.startOf("assol", "halt", L.bankTurn(at));
  if (off && Math.hypot(X - x, Z - z) < Math.hypot(off.across, off.distance)) return scene.person("assol").walk(L.bankWay(u, at));
  if (u >= at - L.HALT_IN) return halt(at);
  const up = scene.person("assol").walk(L.bankWay(u, at - L.HALT_IN));
  (async () => {
    if ((await up) === "done" && walk === up) walk = halt(at);
  })();
  return up;
}
function run() {
  if (!chasing()) return;
  const u = num("run_at");
  const asked = scene.anim.clamp(num("run"), 0, 1);
  if (told >= 0 && told !== clear) {
    if (asked <= u + EPS) letGo = true;
    else if (letGo) clear = told;
  }
  const stop = L.STOPS.find((at, i) => i !== clear && (over ?? u) <= at + EPS) ?? 1;
  const want = Math.max(Math.min(asked, stop), over ?? 0);
  if (want <= u + EPS) {
    if (to != null) walk.cancel();
    to = null;
  } else if (to == null ? want - u > L.NEAR || want >= stop || over != null : Math.abs(want - to) > EPS) {
    to = want;
    walk = way(u, to, want >= stop && stop < 1);
  }
}
function ran() {
  if (!chasing()) return;
  const u = L.runAt(num("as_d"));
  scene.set("run_at", u);
  if (over != null && u >= over - EPS) over = null;
  if (to != null && u >= to - EPS) to = null;
  const at = L.STOPS.findIndex((stop, i) => i !== clear && Math.abs(u - stop) <= EPS);
  if (at >= 0 && at !== told) {
    told = at;
    letGo = false;
    scene.tell("chase:snag");
  }
  if (u < L.STOPS[0] - L.WINDOW) {
    told = -1;
    clear = -1;
  }
}
// (a cut leaves no walk going)
scene.on("cut", () => {
  over = null;
  to = null;
});
scene.on("change", "run", run);
scene.on("change", "as_d", ran);
scene.on("move", "as_d", ran);
scene.on("change", "jump", (v) => {
  if (!(v >= 0.5) || !chasing()) return;
  const u = num("run_at");
  const snag = L.STOPS.findIndex((stop, i) => i !== clear && u <= stop + EPS && u >= stop - L.WINDOW);
  if (snag < 0) return;
  clear = snag;
  told = snag;
  over = L.SNAGS[snag] + L.PAST;
  run();
});

// The ring. `ring` says where it is: in Grey's fingers (grey), on Assol's finger (finger), on a cord under her dress
// or nowhere (cord, none) — whoever has it has the cast's part of it with them: `ring`, his mother's, or `ring_old`,
// his own (`ring_kind`: lib.js ringPart).
const RINGS = ["ring", "ring_old"];
const has = (id, yes) => {
  const key = `${id}_with`;
  const now = scene.get(key) ?? [];
  const rest = now.filter((part) => !RINGS.includes(part));
  const next = yes ? [...rest, L.ringPart(scene)] : rest;
  if (next.length === now.length && next.every((part, i) => part === now[i])) return;
  scene.set(key, next.length ? next : null);
};
scene.on("change", "ring", (where) => {
  has("grey", where === "grey");
  has("assol", where === "finger");
});
// «Кольцо» — what a game drives while the ring is in his fingers (he kneels by her): `ring_at`, his hand with it on
// its way to her finger — past 0.4 the hand reaches for her hand (the scene tells ring:reach), at 1 the ring is hers
// (ring → finger; ring:on); `stir` — she stirs in her sleep, her head turning toward him
function ringAt() {
  if (scene.get("ring") !== "grey") return;
  const v = num("ring_at");
  const reaches = scene.get("grey_reach") != null;
  if (v >= 0.999) {
    scene.person("grey").reach(null);
    scene.set("ring", "finger");
    scene.tell("ring:on");
  } else if (v > 0.4 !== reaches) {
    scene.person("grey").reach(reaches ? null : { r: "assol#hand_r" });
    if (!reaches) scene.tell("ring:reach");
  }
}
scene.on("move", "ring_at", ringAt);
scene.on("change", "ring_at", ringAt);
scene.on("change", "stir", (v) => {
  if (scene.get("assol_do")?.motion === "sleep") scene.person("assol").look(v > 0.5 ? "grey" : null);
});

scene.kit.beats.play(scene, L.film(scene));
