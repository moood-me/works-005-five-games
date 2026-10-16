// A Shop in Liss — its mechanics: the hour's light (the world's module nebo); the film in beats for the game (lib.js film,
// the world's module beats: `beat` names one); the roll of silk kept where its holder is; the fiddler on the street.
const L = scene.lib;
scene.kit.nebo.follow(scene);
scene.kit.beats.play(scene, L.film(scene));

// The roll stands where `roll_at` says — on the rack, on the counter, or with the one who has it (his place): followed as
// they walk.
const put = () => {
  const at = L.rollPlace(scene.state);
  scene.set("roll_a", at.across);
  scene.set("roll_d", at.distance);
};
for (const key of ["roll_at", "gr_a", "gr_d", "mer_a", "mer_d"]) {
  scene.on("change", key, put);
  scene.on("move", key, put);
}
put();

// The fiddler stands in the street while `violinist` is 1.
const fiddler = () => scene.set("violinist_here", scene.get("violinist") > 0.5);
scene.on("change", "violinist", fiddler);
fiddler();
