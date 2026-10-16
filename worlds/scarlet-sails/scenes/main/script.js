// «The Kaperna Shore» — its mechanics. The hour's light follows `hour` (the world's nebo: the looks' weights, the sun's and
// the moon's light). What its keys place is kept where they say — at once when a key is set, along as it moves: "Secret"
// by `ship` (where she is, how she heads, how far her spark is kindled: lib.shipAt), the tavern's door on its hinge by
// `tavern_door`, Menners' boat by `menners_boat`, "Secret"'s skiff by `skiff_ashore`, `boat` and `ship` (lib.skiffAt: where,
// how turned, how high it floats), the two craft of the night of waiting by `light1`, `light2` (lib.lightAt; the
// steamer's smoke: lib.steamOf). The ship rolls on the swell. The film is in beats (lib.film, the world's module beats;
// notes.md lists them).
const L = scene.lib;
scene.kit.nebo.follow(scene);
const keep = (keys, put) => {
  put();
  for (const key of keys) {
    scene.on("change", key, put);
    scene.on("move", key, put);
  }
};
const place = (keys, values) => values.forEach((v, i) => scene.set(keys[i], v));
keep(["ship"], () => place(["ship_across", "ship_distance", "ship_facing", "ship_spark"], L.shipAt(scene.get("ship"))));
keep(["tavern_door"], () => scene.set("tavern_door_facing", L.doorFacing(scene.get("tavern_door"))));
keep(["menners_boat"], () => place(["mb_a", "mb_d"], L.mennersAt(scene.get("menners_boat"))));
keep(["skiff_ashore", "boat", "ship"], () => place(["sk_a", "sk_d", "sk_f", "sk_e"], L.skiffAt(scene.state)));
for (const id of ["light1", "light2"]) keep([id], () => place([`${id}_a`, `${id}_d`], L.lightAt(id, scene.get(id))));
keep(["light2"], () => scene.set("light2_smoke", L.steamOf(scene.get("light2"))));
scene.kit.korabli.swell(scene, "ship_roll", 4.2, 1.4);
scene.kit.beats.play(scene, L.film(scene));
