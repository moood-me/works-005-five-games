// Дом Лонгрена — its mechanics: the hour's light (the world's module nebo keeps the looks' weights and the sun's and
// the moon's light by `hour`); the film in beats for the game (lib.js film, the world's module beats: `beat` names
// one); the chest, the ship, the door and the window's leaves kept where their keys say; the chest going with the one
// who drags it; what a game's keys do with the people and the camera (guide, gaze).
const L = scene.lib, P = (id) => scene.person(id);
scene.kit.nebo.follow(scene);
scene.kit.beats.play(scene, L.film(scene));

// The chest, the ship, the door and the leaves move by their `place` (metres, degrees — lib.js placed): in step with
// `chest`, `sails_window`, `door`, `window_open` as those move.
const place = () => {
  const at = L.placed(scene.state);
  for (const key in at) scene.set(key, at[key]);
};
for (const key of ["chest", "sails_window", "door", "window_open"]) {
  scene.on("change", key, place);
  scene.on("move", key, place);
}
place();
// The ship rolls a little on the swell.
scene.kit.korabli.swell(scene, "ship_roll", 4.2, 1.6);

// Dragged (his gait `drag`: backing, his hands on its lid), the chest comes with him — as far out as he has gone.
const drag = () => {
  if (scene.get("longren_gait") === "drag") scene.set("chest", L.pulled(scene.get("lo_a"), scene.get("lo_d")));
};
scene.on("move", "lo_a", drag);
scene.on("move", "lo_d", drag);

// «Оснастка» (`guide`): the father's right hand on the hull, putting it right, while it is over a half — he at the
// bench, his hands free.
const atBench = () => scene.get("longren_here") !== false && !scene.get("longren_on") && Math.hypot(scene.get("lo_a") - L.AT_WORK[0], scene.get("lo_d") - L.AT_WORK[1]) < 0.3;
scene.on("change", "guide", (v) => {
  if (atBench() && !L.yachtMade(scene.state)) P("longren").reach(v > 0.5 ? { r: "work" } : null);
});
// «Смотри» (`gaze` 0…1), all the way: while she sits with the book, her eyes go from the page up to the window with it
// (lib.js gazed). The camera stands while the game's gesture leads them (under a gesture at a point nothing moves) and
// rises once they are at the window: where the film has it lowered to the page (camera_pitch: the beat `look`), `gaze`
// 1 gives it back level (camera_look, screen heights), over RISE.
const eyes = () => {
  const gaze = scene.get("gaze");
  if (scene.get("assol_on") && L.reading(scene.state)) P("assol").look(gaze > 0 ? L.gazed(gaze) : "assol#hands");
};
for (const on of ["change", "move"]) scene.on(on, "gaze", eyes);
// The camera is led there by the director (a camera's key set at once is a new shot to the engine): where it should be
// is looked at every LEAD / 2; a new place — a move there over RISE.
const LEAD = 0.12, RISE = 1.5;
let led = null, lead = null;
scene.every(LEAD / 2, () => {
  const to = (scene.get("gaze") || 0) >= 1 ? Math.tan(((scene.get("camera_pitch") || 0) * Math.PI) / 180) : 0;
  if (to === led && !(lead.done && scene.get("camera_look") !== to)) return;
  led = to;
  lead = scene.move("camera_look", to, { over: RISE, ease: "linear" });
});
